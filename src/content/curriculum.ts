import type { CurriculumModule } from './types';

export const curriculum: readonly CurriculumModule[] = [
  {
    id: 'm1',
    number: 1,
    title: 'Fundamentos del Ser Emprendedor',
    subtitle: 'Construí la base de tu identidad como emprendedor consciente',
    classes: [
      {
        id: 'm1-c1',
        number: 1,
        title: 'Ontología del Emprendedor',
        summary:
          'Descubrí qué tipo de observador sos y cómo eso determina los resultados que obtenés en tu negocio.',
        duration: '90 min',
        competencies: ['Autoconocimiento', 'Ontología del lenguaje', 'Identidad emprendedora'],
      },
      {
        id: 'm1-c2',
        number: 2,
        title: 'Los 4 Saboteadores Internos',
        summary:
          'Identificá y desactivá los patrones inconscientes que te frenan: abandono, procrastinación, excusas y perfeccionismo.',
        duration: '90 min',
        competencies: ['Gestión emocional', 'Autoregulación', 'Cambio de paradigmas'],
      },
      {
        id: 'm1-c3',
        number: 3,
        title: 'Aprendizaje de Segundo Orden',
        summary:
          'Aprendé a aprender: cómo los emprendedores que realmente transforman su vida adoptan nuevas formas de pensar y actuar.',
        duration: '90 min',
        competencies: ['Metacognición', 'Cambio de creencias', 'Plasticidad mental'],
      },
    ],
  },
  {
    id: 'm2',
    number: 2,
    title: 'Dirección Estratégica',
    subtitle: 'Definí a dónde vas y por qué importa',
    classes: [
      {
        id: 'm2-c1',
        number: 4,
        title: 'Propósito y Visión de Negocio',
        summary:
          'Construí tu propósito emprendedor y traducilo en una visión concreta que oriente cada decisión estratégica.',
        duration: '90 min',
        competencies: ['Visión estratégica', 'Propósito emprendedor', 'Dirección'],
      },
      {
        id: 'm2-c2',
        number: 5,
        title: 'Modelo de Negocio y Propuesta de Valor',
        summary:
          'Diseñá un modelo de negocio sólido centrado en el valor que entregás a tus clientes ideales.',
        duration: '90 min',
        competencies: ['Business Model Canvas', 'Propuesta de valor', 'Segmentación'],
      },
      {
        id: 'm2-c3',
        number: 6,
        title: 'OKRs para Emprendedores',
        summary:
          'Implementá el framework de objetivos y resultados clave para medir el progreso real de tu negocio.',
        duration: '90 min',
        competencies: ['Planificación', 'Métricas', 'OKRs'],
      },
    ],
  },
  {
    id: 'm3',
    number: 3,
    title: 'Valor y Estructura Comercial',
    subtitle: 'Construí un negocio que genere ingresos sostenidos',
    classes: [
      {
        id: 'm3-c1',
        number: 7,
        title: 'Pricing con Confianza',
        summary:
          'Eliminá el miedo a cobrar lo que realmente valés. Estrategias de precios que reflejan el valor que entregás.',
        duration: '90 min',
        competencies: ['Pricing strategy', 'Confianza comercial', 'Posicionamiento'],
      },
      {
        id: 'm3-c2',
        number: 8,
        title: 'Ventas desde la Autenticidad',
        summary:
          'Vendé sin sentirte vendedor. Un método de conversación comercial basado en la escucha y el servicio genuino.',
        duration: '90 min',
        competencies: ['Ventas consultivas', 'Comunicación auténtica', 'Conversión'],
      },
      {
        id: 'm3-c3',
        number: 9,
        title: 'Captación y Fidelización de Clientes',
        summary:
          'Construí un sistema predecible para atraer clientes ideales y convertirlos en promotores de tu marca.',
        duration: '90 min',
        competencies: ['Marketing relacional', 'Funnel de ventas', 'Retención'],
      },
    ],
  },
  {
    id: 'm4',
    number: 4,
    title: 'Liderazgo y Escala',
    subtitle: 'Pasá de emprendedor a CEO de tu propia empresa',
    classes: [
      {
        id: 'm4-c1',
        number: 10,
        title: 'Liderazgo Ontológico',
        summary:
          'Desarrollá la presencia y autoridad natural de un líder que inspira acción en otros sin manipular.',
        duration: '90 min',
        competencies: ['Liderazgo', 'Presencia ejecutiva', 'Influencia'],
      },
      {
        id: 'm4-c2',
        number: 11,
        title: 'Gestión del Equipo y Delegación',
        summary:
          'Aprendé a delegar con confianza y construir un equipo que amplifique tu capacidad sin depender de tu presencia constante.',
        duration: '90 min',
        competencies: ['Delegación efectiva', 'Gestión de equipos', 'Sistemas'],
      },
      {
        id: 'm4-c3',
        number: 12,
        title: 'Plan de Crecimiento 90 Días',
        summary:
          'Diseñá tu hoja de ruta personal para los próximos 90 días post-diplomado. Compromisos concretos, métricas y accountability.',
        duration: '90 min',
        competencies: ['Planificación táctica', 'Accountability', 'Ejecución'],
      },
    ],
  },
] as const;
