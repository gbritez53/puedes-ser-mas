import { createHash } from 'node:crypto';
import type { APIRoute } from 'astro';
import { admissionSchema } from '@/lib/validators/admission';
import { db } from '@/db/client';
import { admissions } from '@/db/schema';
import { checkRateLimit } from '@/lib/rate-limit';

export const prerender = false;

// Mapea el desafío principal a la columna diplomado existente.
const DIPLOMADO_FROM_DESAFIO: Record<string, string> = {
  mentalidad: 'liderazgo',
  comunicacion: 'comunicacion',
  ambos: 'ambos',
};

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
    const ipHash = clientAddress ? createHash('sha256').update(clientAddress).digest('hex') : null;

    const [row] = await db
      .insert(admissions)
      .values({
        name: parsed.data.name,
        phone: parsed.data.phone,
        diplomado: DIPLOMADO_FROM_DESAFIO[parsed.data.desafioPrincipal] ?? 'liderazgo',
        desafioPrincipal: parsed.data.desafioPrincipal,
        porQueSerSeleccionado: parsed.data.porQueSerSeleccionado,
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
