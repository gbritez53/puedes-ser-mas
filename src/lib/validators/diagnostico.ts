import { z } from 'zod';

export const diagnosticoLeadSchema = z
  .object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(120),
    email: z.string().email('Ingresá un email válido').max(160).optional().or(z.literal('')),
    phone: z
      .string()
      .min(6, 'El WhatsApp debe tener al menos 6 caracteres')
      .max(32)
      .optional()
      .or(z.literal('')),
    honeypot: z.string().max(0).optional(), // must be empty — filled = bot
  })
  .refine((data) => !!data.email || !!data.phone, {
    message: 'Dejanos al menos un email o un WhatsApp',
    path: ['email'],
  });

export type DiagnosticoLeadInput = z.infer<typeof diagnosticoLeadSchema>;

const answerSchema = z.object({
  question: z.string().max(300),
  selected: z.array(z.string().max(200)).max(10),
  other: z.string().max(500),
});

export const diagnosticoCompleteSchema = z.object({
  id: z.number().int().positive(),
  painSentence: z.string().min(1).max(1000),
  category: z.enum(['sanidad', 'liderazgo', 'caracter', 'oratoria']),
  level: z.enum(['sesion-unica', 'acompanamiento', 'transformacion']),
  levelInferred: z.boolean(),
  answers: z.array(answerSchema).max(10),
});

export type DiagnosticoCompleteInput = z.infer<typeof diagnosticoCompleteSchema>;

export type DiagnosticoFieldErrors = Partial<Record<keyof DiagnosticoLeadInput, string>>;
