import { z } from 'zod';

export const admissionSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(120),
  email: z.string().email('El email no es válido').max(160),
  phone: z.string().min(8, 'El teléfono debe tener al menos 8 caracteres').max(32),
  profession: z.string().min(2, 'La profesión debe tener al menos 2 caracteres').max(160),
  motivation: z
    .string()
    .min(40, 'Contanos un poco más — al menos 40 caracteres')
    .max(1000, 'Máximo 1000 caracteres'),
  cohort: z.string().min(2).max(40),
  honeypot: z.string().max(0).optional(), // must be empty — filled = bot
});

export type AdmissionInput = z.infer<typeof admissionSchema>;

export type AdmissionFieldErrors = Partial<Record<keyof AdmissionInput, string>>;
