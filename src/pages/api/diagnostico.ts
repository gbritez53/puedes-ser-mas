import { createHash } from 'node:crypto';
import type { APIRoute } from 'astro';
import { diagnosticoSchema } from '@/lib/validators/diagnostico';
import { db } from '@/db/client';
import { diagnosticos } from '@/db/schema';
import { checkRateLimit } from '@/lib/rate-limit';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!checkRateLimit(clientAddress)) {
    return Response.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return Response.json(
      { ok: false, error: 'validation_failed', issues: [{ path: [], message: 'Invalid JSON' }] },
      { status: 422 },
    );
  }

  const parsed = diagnosticoSchema.safeParse(body);
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
    const ipHash = clientAddress ? createHash('sha256').update(clientAddress).digest('hex') : null;

    const [row] = await db
      .insert(diagnosticos)
      .values({
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email,
        track: parsed.data.track,
        scoreA: parsed.data.scoreA,
        scoreB: parsed.data.scoreB,
        scoreC: parsed.data.scoreC,
        scoreD: parsed.data.scoreD,
        closingText: parsed.data.closingText,
        aspirations: JSON.stringify(parsed.data.aspirations),
        answers: JSON.stringify(parsed.data.answers),
        ipHash: ipHash ?? undefined,
        userAgent: request.headers.get('user-agent') ?? undefined,
      })
      .returning({ id: diagnosticos.id });

    return Response.json({ ok: true, id: row?.id ?? 0 }, { status: 201 });
  } catch (err) {
    console.error('[diagnostico] insert failed', err);
    return Response.json({ ok: false, error: 'internal' }, { status: 500 });
  }
};
