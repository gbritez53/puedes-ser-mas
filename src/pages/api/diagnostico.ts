import { createHash } from 'node:crypto';
import type { APIRoute } from 'astro';
import { diagnosticoLeadSchema, diagnosticoCompleteSchema } from '@/lib/validators/diagnostico';
import { db } from '@/db/client';
import { diagnosticos } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { checkRateLimit } from '@/lib/rate-limit';

export const prerender = false;

// POST: se llama en el checkpoint (mitad del cuestionario) para no perder el lead si abandona.
export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!checkRateLimit(clientAddress, 'diagnostico')) {
    return Response.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return Response.json(
      { ok: false, error: 'validation_failed', issues: [{ path: [], message: 'Invalid JSON' }] },
      { status: 422 },
    );
  }

  const parsed = diagnosticoLeadSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: 'validation_failed', issues: parsed.error.issues },
      { status: 422 },
    );
  }

  if (parsed.data.honeypot) {
    return Response.json({ ok: true, id: 0 }, { status: 200 });
  }

  try {
    const ipHash = clientAddress ? createHash('sha256').update(clientAddress).digest('hex') : null;

    const [row] = await db
      .insert(diagnosticos)
      .values({
        name: parsed.data.name,
        email: parsed.data.email || undefined,
        phone: parsed.data.phone || undefined,
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

// PATCH: se llama al terminar las 7 preguntas, completando el lead ya creado en el checkpoint.
export const PATCH: APIRoute = async ({ request, clientAddress }) => {
  if (!checkRateLimit(clientAddress, 'diagnostico')) {
    return Response.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return Response.json(
      { ok: false, error: 'validation_failed', issues: [{ path: [], message: 'Invalid JSON' }] },
      { status: 422 },
    );
  }

  const parsed = diagnosticoCompleteSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: 'validation_failed', issues: parsed.error.issues },
      { status: 422 },
    );
  }

  try {
    const [row] = await db
      .update(diagnosticos)
      .set({
        painSentence: parsed.data.painSentence,
        category: parsed.data.category,
        level: parsed.data.level,
        levelInferred: parsed.data.levelInferred,
        answers: JSON.stringify(parsed.data.answers),
        completed: true,
        updatedAt: new Date(),
      })
      .where(eq(diagnosticos.id, parsed.data.id))
      .returning({ id: diagnosticos.id });

    if (!row) {
      return Response.json({ ok: false, error: 'not_found' }, { status: 404 });
    }

    return Response.json({ ok: true, id: row.id }, { status: 200 });
  } catch (err) {
    console.error('[diagnostico] update failed', err);
    return Response.json({ ok: false, error: 'internal' }, { status: 500 });
  }
};
