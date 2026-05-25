import { createHash } from 'node:crypto';
import type { APIRoute } from 'astro';
import { admissionSchema } from '@/lib/validators/admission';
import { db } from '@/db/client';
import { admissions } from '@/db/schema';
import { checkRateLimit } from '@/lib/rate-limit';
import { eq } from 'drizzle-orm';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  // Rate limit check
  if (!checkRateLimit(clientAddress)) {
    return Response.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  // Parse JSON body
  const body = await request.json().catch(() => null);
  if (!body) {
    return Response.json(
      { ok: false, error: 'validation_failed', issues: [{ path: [], message: 'Invalid JSON' }] },
      { status: 422 },
    );
  }

  // Validate
  const parsed = admissionSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: 'validation_failed', issues: parsed.error.issues },
      { status: 422 },
    );
  }

  // Silent honeypot rejection (return 200 to confuse bots)
  if (parsed.data.honeypot) {
    return Response.json({ ok: true, id: 0 }, { status: 200 });
  }

  try {
    // Check for duplicate email
    const existing = await db
      .select({ id: admissions.id })
      .from(admissions)
      .where(eq(admissions.email, parsed.data.email))
      .limit(1);

    if (existing.length > 0) {
      return Response.json(
        { ok: false, error: 'duplicate_email', message: 'Este email ya fue registrado.' },
        { status: 400 },
      );
    }

    // Insert
    const ipHash = clientAddress ? createHash('sha256').update(clientAddress).digest('hex') : null;

    const [row] = await db
      .insert(admissions)
      .values({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        profession: parsed.data.profession,
        motivation: parsed.data.motivation,
        cohort: parsed.data.cohort,
        ipHash: ipHash ?? undefined,
        userAgent: request.headers.get('user-agent') ?? undefined,
      })
      .returning({ id: admissions.id });

    return Response.json({ ok: true, id: row?.id ?? 0 }, { status: 201 });
  } catch (err) {
    console.error('[admission] insert failed', err);
    return Response.json({ ok: false, error: 'internal' }, { status: 500 });
  }
};
