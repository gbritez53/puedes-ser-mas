/**
 * Datos del titular del sitio y metadatos legales.
 *
 * ⚠️ COMPLETAR antes de publicar: los campos marcados con `[COMPLETAR]` son los
 * únicos que hay que tocar. Todas las páginas legales leen de acá, así que se
 * cargan una sola vez y quedan consistentes en los tres documentos.
 */
export const legal = {
  /** Nombre comercial de la marca */
  brand: 'PUEDES SER MÁS',

  /** Razón social del titular (persona humana o jurídica) */
  razonSocial: '[COMPLETAR: razón social o nombre completo del titular]',

  /** CUIT / CUIL del titular */
  cuit: '[COMPLETAR: CUIT/CUIL]',

  /** Domicilio legal */
  domicilio: '[COMPLETAR: domicilio legal completo]',

  /** Email de contacto para ejercer derechos sobre datos personales */
  emailContacto: '[COMPLETAR: email de contacto]',

  /** Ciudad cuyos tribunales ordinarios resultan competentes */
  jurisdiccion: '[COMPLETAR: ciudad, provincia]',

  /** Dominio del sitio */
  sitio: 'puedessermas.com',

  /**
   * Fecha de última actualización de los documentos legales.
   * Actualizala cada vez que modifiques el contenido de alguna de las páginas.
   */
  ultimaActualizacion: '30 de agosto de 2026',
} as const;

export const legalPages = [
  { label: 'Política de Privacidad', href: '/politica-de-privacidad' },
  { label: 'Términos y Condiciones', href: '/terminos-y-condiciones' },
  { label: 'Política de Cookies', href: '/politica-de-cookies' },
] as const;
