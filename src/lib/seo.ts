export interface SeoMeta {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
}

export const defaultSeo: SeoMeta = {
  title: 'PUEDES SER MÁS — Transformación Personal y Profesional',
  description:
    'Diplomados de Coaching para la Superación Personal y Comunicación y Oratoria. Cupo limitado, entrevista de admisión, inicio Septiembre 2026.',
  ogTitle: 'PUEDES SER MÁS — Diplomados de Transformación',
  ogDescription:
    'No entrenamos proyectos; transformamos a la persona que los lidera. Forja un carácter inquebrantable, domina tu mundo emocional y comunica con presencia absoluta.',
  ogImage: '/assets/logo.png',
};
