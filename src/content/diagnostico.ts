export type Track = 'A' | 'B' | 'C' | 'D';

export interface QuizOption {
  emoji: string;
  label: string;
  track: Track;
}

export interface QuizQuestion {
  emoji: string;
  /** Texto con **resaltado** en markdown simple; se renderiza con renderHighlighted(). */
  text: string;
  hint?: string;
  multi?: boolean;
  options: QuizOption[];
}

export interface DiagnosticoResult {
  emoji: string;
  title: string;
  body: string;
  diplomadoSlug: 'coaching-y-liderazgo' | 'comunicacion-y-oratoria';
  diplomadoNombre: string;
}

export const questions: QuizQuestion[] = [
  {
    emoji: '🧭',
    text: 'Si tuvieras que describir en **una palabra** cómo te sentís hoy con tu vida o tu liderazgo, ¿cuál elegirías?',
    options: [
      { emoji: '🌱', label: 'Estancado/a, como dando vueltas en lo mismo', track: 'A' },
      { emoji: '🤝', label: 'Sobrepasado/a, con un equipo o proyecto que no despega', track: 'B' },
      { emoji: '🔥', label: 'Inconforme conmigo mismo/a, sé que puedo más', track: 'C' },
      { emoji: '🎤', label: 'Inseguro/a cuando tengo que hablar o mostrarme', track: 'D' },
    ],
  },
  {
    emoji: '🛑',
    text: '¿Qué es lo que **más te frena** para dar el siguiente paso?',
    options: [
      {
        emoji: '🌱',
        label: 'Heridas o creencias del pasado que todavía me condicionan',
        track: 'A',
      },
      {
        emoji: '🤝',
        label: 'No sé cómo llevar adelante a las personas que dependen de mí',
        track: 'B',
      },
      {
        emoji: '🔥',
        label: 'Me falta disciplina y constancia para sostener lo que me propongo',
        track: 'C',
      },
      {
        emoji: '🎤',
        label: 'El miedo a exponerme, hablar en público o comunicar lo que pienso',
        track: 'D',
      },
    ],
  },
  {
    emoji: '⚡',
    text: 'Cuando algo no te sale como esperabas, ¿qué es **lo primero que aparece** en vos?',
    options: [
      { emoji: '🌱', label: 'Vuelve una vieja herida o un "otra vez lo mismo"', track: 'A' },
      { emoji: '🤝', label: 'Frustración porque el equipo no responde como necesito', track: 'B' },
      { emoji: '🔥', label: 'Autocrítica dura, siento que me falló el carácter', track: 'C' },
      { emoji: '🎤', label: 'Me paralizo o evito la situación en lugar de hablarlo', track: 'D' },
    ],
  },
  {
    emoji: '🎯',
    text: 'Si una mentoría pudiera resolver **UNA sola cosa** en tu vida hoy, ¿cuál sería?',
    options: [
      { emoji: '🌱', label: 'Sanar algo que llevo cargando hace tiempo', track: 'A' },
      {
        emoji: '🤝',
        label: 'Aprender a liderar un equipo con más autoridad y orden',
        track: 'B',
      },
      {
        emoji: '🔥',
        label: 'Convertirme en una versión más fuerte y disciplinada de mí mismo/a',
        track: 'C',
      },
      { emoji: '🎤', label: 'Comunicar con seguridad y dejar huella cuando hablo', track: 'D' },
    ],
  },
  {
    emoji: '🔮',
    text: 'Imaginate dentro de **12 meses** habiendo logrado ese cambio. ¿Qué es lo que más notás distinto?',
    options: [
      { emoji: '🌱', label: 'Estoy en paz conmigo mismo/a, sin ese peso de antes', track: 'A' },
      {
        emoji: '🤝',
        label: 'Mi equipo o negocio funciona sin que yo tenga que estar en todo',
        track: 'B',
      },
      { emoji: '🔥', label: 'Tomo decisiones con carácter, sin dudar tanto de mí', track: 'C' },
      { emoji: '🎤', label: 'Hablo en público o en reuniones con seguridad total', track: 'D' },
    ],
  },
  {
    emoji: '🔁',
    text: '¿Qué intentaste ya para resolver esto **por tu cuenta**, y qué pasó?',
    options: [
      {
        emoji: '🌱',
        label: 'Leí, reflexioné, intenté "soltar", pero sigue apareciendo',
        track: 'A',
      },
      {
        emoji: '🤝',
        label: 'Delegué o cambié procesos, pero el problema de fondo sigue',
        track: 'B',
      },
      { emoji: '🔥', label: 'Me propuse cambiar hábitos varias veces y no lo sostuve', track: 'C' },
      { emoji: '🎤', label: 'Evité las situaciones donde tengo que exponerme', track: 'D' },
    ],
  },
  {
    emoji: '🎁',
    multi: true,
    text: 'Antes de cerrar: **¿qué te gustaría llevarte** de este proceso?',
    hint: 'Elegí una, dos o todas las que quieras.',
    options: [
      { emoji: '🌱', label: 'Una sanidad completa: cerrar heridas y avanzar en paz', track: 'A' },
      { emoji: '🤝', label: 'Un equipo que funcione y me libere del día a día', track: 'B' },
      { emoji: '🎓', label: 'Una certificación que respalde mi transformación', track: 'C' },
      { emoji: '🎤', label: 'Una oratoria efectiva que deje huella cuando hablo', track: 'D' },
    ],
  },
];

export const results: Record<Track, DiagnosticoResult> = {
  A: {
    emoji: '🌱',
    title: 'Necesitás **sanar**, no solo avanzar.',
    body: 'Lo que contaste describe a alguien que sigue cargando algo del pasado, y eso no se resuelve leyendo más ni con fuerza de voluntad — se resuelve **acompañando el proceso de cerca**, con una mirada que te ayude a soltar lo que te condiciona. Eso es lo que trabajamos en el Diplomado de Coaching y Liderazgo, empezando por adentro.',
    diplomadoSlug: 'coaching-y-liderazgo',
    diplomadoNombre: 'Diplomado de Coaching para Líderes',
  },
  B: {
    emoji: '🤝',
    title: 'Tu freno no sos vos: es tu **forma de liderar**.',
    body: 'Lo que contaste describe a alguien que está sosteniendo demasiado peso solo/a, sin las herramientas para que un equipo funcione con autoridad y orden. Eso no se aprende improvisando — se aprende con **un proceso de liderazgo estructurado**, el corazón del Diplomado de Coaching y Liderazgo.',
    diplomadoSlug: 'coaching-y-liderazgo',
    diplomadoNombre: 'Diplomado de Coaching para Líderes',
  },
  C: {
    emoji: '🔥',
    title: 'Ya sabés lo que querés. Te falta **sostenerlo**.',
    body: 'Lo que contaste describe a alguien que se propone cambiar una y otra vez, pero sin un proceso que sostenga ese cambio en el tiempo. Ahí es donde entra una mentoría: no para darte más información, sino para **construir el carácter y la disciplina** que convierten una intención en un resultado real.',
    diplomadoSlug: 'coaching-y-liderazgo',
    diplomadoNombre: 'Diplomado de Coaching para Líderes',
  },
  D: {
    emoji: '🎤',
    title: 'Tenés algo para decir. Te falta **decirlo con fuerza**.',
    body: 'Lo que contaste describe a alguien que se guarda cosas por miedo a exponerse, y eso tiene un costo directo en tu liderazgo y en tus resultados. Eso se entrena: **voz, presencia y seguridad escénica**, el foco del Diplomado de Comunicación y Oratoria.',
    diplomadoSlug: 'comunicacion-y-oratoria',
    diplomadoNombre: 'Diplomado de Oratoria para Profesionales',
  },
};
