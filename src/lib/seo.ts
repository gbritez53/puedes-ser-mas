export interface SeoMeta {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
}

export const defaultSeo: SeoMeta = {
  title: 'Diplomado Coach Emprendedor — PUEDES SER MÁS',
  description:
    'En 90 días, transformate en un emprendedor con dirección, valor y estructura. Programa online en vivo. Cohorte Mayo 2026. Máximo 15 alumnos.',
  ogTitle: 'Diplomado Coach Emprendedor',
  ogDescription:
    'El programa de transformación ontológica para emprendedores que quieren dejar de improvisar y construir un negocio sostenible.',
  ogImage: '/assets/logo.png',
};
