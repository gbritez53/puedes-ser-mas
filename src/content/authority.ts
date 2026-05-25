import type { AuthorityCredential } from './types';

export interface AuthorityProfile {
  name: string;
  role: string;
  company: string;
  bio: string;
  credentials: readonly AuthorityCredential[];
  endorsements: readonly AuthorityCredential[];
}

export const authority: AuthorityProfile = {
  name: 'Claudio Español',
  role: 'Coach Profesional & Conferencista Internacional',
  company: 'PUEDES SER MÁS',
  bio: 'Con más de 15 años acompañando emprendedores y líderes en Latinoamérica, Claudio Español transformó su propia historia de adversidad en un método probado para que otros puedan hacer lo mismo. CEO de PUEDES SER MÁS y formador certificado por las principales organizaciones internacionales de coaching.',
  credentials: [
    {
      id: 'ceo',
      label: 'CEO — PUEDES SER MÁS',
    },
    {
      id: 'coach-profesional',
      label: 'Coach Profesional Certificado',
    },
    {
      id: 'conferencista',
      label: 'Conferencista Internacional',
    },
  ],
  endorsements: [
    {
      id: 'gcc',
      label: 'Global Confederation of Coaching',
      institution: 'Global Confederation of Coaching',
    },
    {
      id: 'oic',
      label: 'OIC — Organización Internacional de Coaching',
      institution: 'OIC',
    },
    {
      id: 'inedif',
      label: 'INEDIF — Instituto de Estudios para la Dirección y la Formación',
      institution: 'INEDIF',
    },
  ],
};
