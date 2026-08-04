import { z } from 'zod';

export const admissionSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(120),
  phone: z.string().min(8, 'El WhatsApp debe tener al menos 8 caracteres').max(32),
  desafioPrincipal: z.enum(['mentalidad', 'comunicacion', 'ambos'], {
    message: 'Seleccioná tu desafío principal',
  }),
  porQueSerSeleccionado: z
    .string()
    .min(10, 'Contanos con al menos 10 caracteres por qué deberías ser seleccionado')
    .max(1000),
  honeypot: z.string().max(0).optional(), // must be empty — filled = bot
});

export type AdmissionInput = z.infer<typeof admissionSchema>;

export type AdmissionFieldErrors = Partial<Record<keyof AdmissionInput, string>>;
