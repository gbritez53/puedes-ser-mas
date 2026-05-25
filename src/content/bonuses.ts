import type { Bonus } from './types';

export const bonuses: readonly Bonus[] = [
  {
    id: 'mentor-coach',
    label: 'Mentor Coach Personalizado',
    description:
      'Sesiones 1:1 con un mentor coach asignado a tu proceso durante los 90 días del diplomado.',
    value: 'Incluido',
  },
  {
    id: 'certificaciones',
    label: 'Certificaciones Internacionales',
    description:
      'Acceso a certificaciones avaladas por la Global Confederation of Coaching, OIC e INEDIF.',
    value: 'Incluido',
  },
  {
    id: 'soporte-whatsapp',
    label: 'Soporte WhatsApp Diario',
    description: 'Canal privado de WhatsApp con respuesta en menos de 24 horas de lunes a viernes.',
    value: 'Incluido',
  },
  {
    id: 'coworking',
    label: 'Coworking Nacional e Internacional',
    description:
      'Acceso a espacios de coworking en Argentina y en el exterior para miembros del programa.',
    value: 'Incluido',
  },
  {
    id: 'vip-pass',
    label: 'FREE PASS VIP Ilimitado a Eventos',
    description:
      'Entrada gratuita y sin límite a todos los eventos presenciales de PUEDES SER MÁS durante el año.',
    value: 'Incluido',
  },
] as const;
