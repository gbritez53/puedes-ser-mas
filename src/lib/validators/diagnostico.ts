import { z } from 'zod';

export const diagnosticoSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(120),
  phone: z.string().min(6, 'El WhatsApp debe tener al menos 6 caracteres').max(32),
  email: z.string().email('Ingresá un email válido').max(160),
  track: z.enum(['A', 'B', 'C', 'D'], { message: 'Track inválido' }),
  scoreA: z.number().int().min(0).max(20),
  scoreB: z.number().int().min(0).max(20),
  scoreC: z.number().int().min(0).max(20),
  scoreD: z.number().int().min(0).max(20),
  closingText: z.string().min(1, 'Contanos qué buscás con la mentoría').max(2000),
  aspirations: z.array(z.string().max(200)).max(10),
  answers: z
    .array(
      z.object({
        question: z.string().max(300),
        answer: z.string().max(500),
      }),
    )
    .max(10),
  honeypot: z.string().max(0).optional(), // must be empty — filled = bot
});

export type DiagnosticoInput = z.infer<typeof diagnosticoSchema>;

export type DiagnosticoFieldErrors = Partial<Record<keyof DiagnosticoInput, string>>;
