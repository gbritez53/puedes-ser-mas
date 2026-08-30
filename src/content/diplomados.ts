import type { DiplomadoDetail } from './diplomado';
import heroCoaching from '../assets/diplomado-coaching.jpg';
import heroOratoria from '../assets/diplomado-oratoria.jpg';

const heroImageCoaching = heroCoaching.src;

const heroImageComunicacion = heroOratoria.src;

/**
 * Cierre de inscripción: 11 días. Editá esta fecha para reiniciar la cuenta regresiva.
 */
const inscripcionDeadline = '2026-09-10T23:59:00-03:00';

const pricingCoaching = {
  amount: '397',
  currency: 'USD',
  label: 'Matrícula Preferencial (Pago Único)',
  headline: 'Inversión',
  headlineAccent: 'Seleccionada',
  tagline:
    'Asegurá tu lugar en la próxima generación de líderes. Elegí el pago único preferencial o financiá tu transformación en cuotas.',
  checklist: [
    'Acceso de por vida al material',
    'Certificación oficial validada',
    'Mentor Coach personalizado',
  ],
  ctaLabel: 'COMENZAR TRANSFORMACIÓN',
  ctaHref: '/#registro',
  singleAmount: '397',
  reservationAmount: '35',
  monthlyAmount: '65',
  installments: 6,
  paymentConditions:
    'Las cuotas se abonan del 1 al 10 de cada mes. Los pagos realizados fuera de este plazo tienen un 10% de recargo.',
};

const pricingComunicacion = {
  ...pricingCoaching,
  tagline:
    'Asegurá tu lugar en la próxima generación de oradores. Elegí el pago único preferencial o financiá tu transformación en cuotas.',
};

export const diplomados: Record<string, DiplomadoDetail> = {
  'coaching-y-liderazgo': {
    slug: 'coaching-y-liderazgo',
    chip: 'Liderazgo',
    title: 'Diplomado de Coaching para la Superación Personal',
    headline: 'DIPLOMADO DE',
    headlineAccent: 'COACHING PARA LA SUPERACIÓN PERSONAL',
    heroDescription:
      'Desata tu potencial oculto. Este programa intensivo está diseñado para forjar líderes inquebrantables, capaces de transformar su entorno personal y profesional con autoridad, visión y resiliencia absoluta.',
    heroImageUrl: heroImageCoaching,
    chips: ['Liderazgo', 'Certificado'],
    skillsTitle: 'El Arsenal del Líder',
    skillsAccent: 'Líder',
    skillsSubtitle: 'Domina las habilidades críticas que separan a los excepcionales del resto.',
    skills: [
      {
        icon: 'psychology',
        title: 'Autodominio y Resiliencia',
        description:
          'Conquista tu mente antes de intentar conquistar el mundo. Desarrolla una fortaleza mental inquebrantable frente a la adversidad extrema.',
        size: 'large',
      },
      {
        icon: 'forum',
        title: 'Comunicación de Impacto',
        description: 'Articula tu visión con poder persuasivo y claridad absoluta.',
        size: 'small',
      },
      {
        icon: 'track_changes',
        title: 'Ejecución Estratégica',
        description: 'Transforma objetivos abstractos en resultados tangibles y medibles.',
        size: 'small',
      },
      {
        icon: 'groups',
        title: 'Equipos de Alto Rendimiento',
        description:
          'Forja y dirige escuadrones de élite cohesionados, motivados y alineados hacia un propósito único y dominante.',
        size: 'large',
      },
    ],
    pricing: pricingCoaching,
    meta: {
      title: 'Diplomado de Coaching para la Superación Personal - PUEDES SER MÁS',
      description:
        'Diplomado de Coaching para la Superación Personal. Forja una mentalidad inquebrantable, dominio emocional absoluto y liderazgo con propósito. Cupo limitado, sesiones en vivo. Conocé más y sumate hoy.',
      canonical: '/diplomados/coaching-y-liderazgo',
    },
    enfoque: ['Liderazgo Interno', 'Gestión Emocional', 'Propósito'],
    promesa:
      'Forjarás una mentalidad inquebrantable, dominio emocional absoluto y un liderazgo con propósito.',
    fechaInicio: 'Martes 15 de Septiembre 2026',
    plazas: 'Aulas Exclusivas (Máximo 15 plazas por entrevista)',
    inscripcionDeadline,
  },

  'comunicacion-y-oratoria': {
    slug: 'comunicacion-y-oratoria',
    chip: 'Comunicación',
    title: 'Diplomado en Comunicación y Oratoria',
    headline: 'DIPLOMADO EN',
    headlineAccent: 'COMUNICACIÓN Y ORATORIA',
    heroDescription:
      'Transformá el miedo en convicción. Este programa intensivo está diseñado para que tu voz se escuche con poder, aplomo e impacto, convirtiéndote en un comunicador capaz de movilizar audiencias y dejar huella.',
    heroImageUrl: heroImageComunicacion,
    chips: ['Comunicación', 'Certificado'],
    skillsTitle: 'El Arsenal del Comunicador',
    skillsAccent: 'Comunicador',
    skillsSubtitle:
      'Domina las habilidades críticas que separan a los comunicadores memorables del resto.',
    skills: [
      {
        icon: 'gesture',
        title: 'Presencia y Lenguaje Corporal',
        description:
          'Dominá el lenguaje silencioso que habla antes que las palabras. Tu cuerpo proyecta confianza —o la delata— apenas te ponés frente a cámara o público.',
        size: 'large',
      },
      {
        icon: 'self_improvement',
        title: 'Dominio del Miedo Escénico',
        description:
          'Convertí los nervios en combustible. Gestioná el miedo a la exposición y hablá con calma y autoridad ante cualquier audiencia.',
        size: 'small',
      },
      {
        icon: 'record_voice_over',
        title: 'Voz y Dicción',
        description:
          'Controlá tono, ritmo y respiración para que cada palabra llegue con claridad y fuerza.',
        size: 'small',
      },
      {
        icon: 'campaign',
        title: 'Discursos Memorables',
        description:
          'Construí mensajes que se quedan grabados en la mente de tu audiencia y la inspiran a la acción. Estructura, storytelling y cierres que impactan.',
        size: 'large',
      },
    ],
    pricing: pricingComunicacion,
    meta: {
      title: 'Diplomado en Comunicación y Oratoria - PUEDES SER MÁS',
      description:
        'Diplomado en Comunicación y Oratoria. Destruí la timidez, eliminá las máscaras y dominá el arte de la presencia escénica. Cupo limitado, sesiones en vivo. Conocé más y sumate hoy.',
      canonical: '/diplomados/comunicacion-y-oratoria',
    },
    enfoque: ['Presencia Escénica', 'Storytelling', 'Dominio Oral'],
    promesa:
      'Destruirás la timidez, eliminarás las máscaras y dominarás el arte de la presencia escénica.',
    fechaInicio: 'Miércoles 16 de Septiembre 2026',
    plazas: 'Aulas Exclusivas (Máximo 15 plazas por entrevista)',
    inscripcionDeadline,
  },
};
