import type { AuthorityCredential } from './types';

export interface AuthorityProfile {
  name: string;
  role: string;
  company: string;
  bio: string;
  credentials: readonly AuthorityCredential[];
  endorsements: readonly AuthorityCredential[];
}

export interface FacultyMember {
  name: string;
  role: string;
  bio: string;
}

export const authority: AuthorityProfile = {
  name: 'Claudio Español',
  role: 'CEO y Fundador de PUEDES SER MÁS · Director de la Academia de Superación',
  company: 'PUEDES SER MÁS',
  bio: 'Coach Ontológico con más de 7 años acompañando a líderes en +7 países de Latinoamérica. CEO y Fundador de PUEDES SER MÁS y Director de la Academia de Superación, dedicado a la transformación del SER como base del crecimiento profesional.',
  credentials: [
    {
      id: 'ceo',
      label: 'CEO — PUEDES SER MÁS',
    },
    {
      id: 'coach-ontologico',
      label: 'Coach Ontológico',
    },
    {
      id: 'director-academia',
      label: 'Director — Academia de Superación',
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

export const faculty: FacultyMember[] = [
  {
    name: 'Fernando Kolbo',
    role: 'Facilitador',
    bio: 'Acompaña procesos de transformación personal y profesional con foco en liderazgo y mentalidad.',
  },
  {
    name: 'Gastón Molina',
    role: 'Facilitador',
    bio: 'Especialista en comunicación y expresión, ayuda a los alumnos a conquistar la presencia escénica.',
  },
  {
    name: 'Malena Holzman',
    role: 'Facilitadora',
    bio: 'Trabaja el dominio emocional y la inteligencia aplicada en contextos de alta exigencia.',
  },
  {
    name: 'Carlos Monnery',
    role: 'Facilitador',
    bio: 'Acompaña la construcción de propósito, visión y marca personal de cada participante.',
  },
  {
    name: 'Daniel Pereira',
    role: 'Facilitador',
    bio: 'Guía el desarrollo de liderazgo humano y gestión de equipos orientados a resultados.',
  },
];
