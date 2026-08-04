import type { DiplomadoDetail } from './diplomado';

const heroImageUrl =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDEIBmuRpwt7L9kSkBerPF5uNqSaG4K8wHCFZJVi-4EBT9KbEAPRSI2E31egbKxlpsCLz2jxMqh52JHehGLizzuKr-z9ABx1ombb63EqGs372Wffhpqzg5IYMJ7aObfxpCbk1JUoSjOuaMSlMaxckPntCDPSN4WpSzSkklEeu7ySJn2aEBb0BIduX7hDujpyq7q4vBb7S-Qc6rMvppEbUCFYeENBp9aPk4EsLG2TXbuQS85nDfBA0OA';

export const diplomados: Record<string, DiplomadoDetail> = {
  'coaching-y-liderazgo': {
    slug: 'coaching-y-liderazgo',
    chip: 'Liderazgo',
    title: 'Diplomado en Coaching y Liderazgo',
    headline: 'DIPLOMADO EN',
    headlineAccent: 'COACHING Y LIDERAZGO',
    heroDescription:
      'Desata tu potencial oculto. Este programa intensivo está diseñado para forjar líderes inquebrantables, capaces de transformar su entorno personal y profesional con autoridad, visión y resiliencia absoluta.',
    heroImageUrl,
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
    pricing: {
      amount: '997',
      currency: 'USD',
      label: 'Inversión Total',
      headline: 'El Momento es',
      headlineAccent: 'Ahora',
      tagline:
        'La inversión en tu capacidad de liderazgo es la única que garantiza un retorno infinito. Asegura tu lugar en la próxima generación de líderes.',
      checklist: ['Acceso de por vida al material', 'Certificación oficial validada'],
      ctaLabel: 'COMENZAR TRANSFORMACIÓN',
      ctaHref: '/#registro',
    },
    meta: {
      title: 'Diplomado en Coaching y Liderazgo - PUEDES SER MÁS',
      description:
        'Diplomado en Coaching y Liderazgo. Forja líderes inquebrantables con dirección, valor y estructura. Cupo limitado, sesiones en vivo. Conocé más y sumate hoy.',
      canonical: '/diplomados/coaching-y-liderazgo',
    },
  },

  'comunicacion-y-oratoria': {
    slug: 'comunicacion-y-oratoria',
    chip: 'Comunicación',
    title: 'Diplomado en Comunicación y Oratoria',
    headline: 'DIPLOMADO EN',
    headlineAccent: 'COMUNICACIÓN Y ORATORIA',
    heroDescription:
      'Transformá el miedo en convicción. Este programa intensivo está diseñado para que tu voz se escuche con poder, aplomo e impacto, convirtiéndote en un comunicador capaz de movilizar audiencias y dejar huella.',
    heroImageUrl,
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
    pricing: {
      amount: '997',
      currency: 'USD',
      label: 'Inversión Total',
      headline: 'El Momento es',
      headlineAccent: 'Ahora',
      tagline:
        'La inversión en tu capacidad de comunicar es la única que garantiza un retorno infinito. Asegurá tu lugar en la próxima generación de oradores.',
      checklist: ['Acceso de por vida al material', 'Certificación oficial validada'],
      ctaLabel: 'COMENZAR TRANSFORMACIÓN',
      ctaHref: '/#registro',
    },
    meta: {
      title: 'Diplomado en Comunicación y Oratoria - PUEDES SER MÁS',
      description:
        'Diplomado en Comunicación y Oratoria. Hacé que tu voz se escuche con poder, aplomo e impacto. Cupo limitado, sesiones en vivo. Conocé más y sumate hoy.',
      canonical: '/diplomados/comunicacion-y-oratoria',
    },
  },
};
