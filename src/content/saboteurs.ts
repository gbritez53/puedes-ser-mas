import type { Saboteur } from './types';

export const saboteurs: readonly Saboteur[] = [
  {
    id: 'abandono',
    name: 'Abandonar',
    description: 'Huir antes del fracaso — dejás todo cuando aparece la primera dificultad real.',
  },
  {
    id: 'procrastinacion',
    name: 'Procrastinar',
    description: 'Lo urgente sobre lo importante — vivís apagando incendios en lugar de construir.',
  },
  {
    id: 'excusas',
    name: 'Excusas',
    description:
      'Externalizar la culpa — el mercado, la economía, el timing... todo es culpa de otro.',
  },
  {
    id: 'perfeccionismo',
    name: 'Perfeccionismo',
    description: 'Miedo al juicio ajeno — nunca está "listo", nunca es "suficientemente bueno".',
  },
] as const;

export const calloutPhrase = 'NADA CAMBIA EN LA ZONA CÓMODA';
