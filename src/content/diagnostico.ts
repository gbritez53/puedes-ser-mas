export type Category = 'sanidad' | 'liderazgo' | 'caracter' | 'oratoria';
export type Urgency = 'alta' | 'media' | 'baja';
export type Level = 'sesion-unica' | 'acompanamiento' | 'transformacion' | 'no-se';

export interface QuizOption {
  id: string;
  emoji: string;
  label: string;
  pain?: string;
  category?: Category;
  urgency?: Urgency;
  level?: Level;
  /** Marca que elegir esta opción indica una fortaleza ya presente en esa categoría (no un bloqueo). */
  strength?: Category;
}

export interface QuizQuestion {
  id: string;
  emoji: string;
  title: string;
  hint?: string;
  other: boolean;
  options: QuizOption[];
}

export const questions: QuizQuestion[] = [
  {
    id: 'q1',
    emoji: '🧭',
    title: '¿Cómo te sentís hoy con tu vida o tu liderazgo?',
    other: true,
    options: [
      {
        id: 'estancado',
        emoji: '🌱',
        label: 'Siento que doy vueltas en lo mismo, sin avanzar',
        pain: 'la sensación de estar dando vueltas en lo mismo, sin avanzar',
      },
      {
        id: 'equipo',
        emoji: '🤝',
        label: 'Tengo un equipo o proyecto que no despega, y me pesa',
        pain: 'un equipo o proyecto que no termina de despegar',
        category: 'liderazgo',
      },
      {
        id: 'inconforme',
        emoji: '🔥',
        label: 'No estoy conforme conmigo mismo/a — sé que puedo más',
        pain: 'la exigencia interna de saber que podés más',
        category: 'caracter',
      },
      {
        id: 'oratoria',
        emoji: '🎤',
        label: 'Me cuesta mostrarme o hablar cuando importa',
        pain: 'la dificultad para mostrarte o hablar cuando más importa',
        category: 'oratoria',
      },
    ],
  },
  {
    id: 'q2',
    emoji: '💔',
    title: 'Si pudieras sanar o soltar algo de tu historia, ¿qué sería lo primero?',
    other: true,
    options: [
      {
        id: 'heridas',
        emoji: '💔',
        label: 'Heridas o cosas del pasado que todavía me condicionan',
        pain: 'heridas del pasado que todavía te condicionan',
        category: 'sanidad',
      },
      {
        id: 'miedos',
        emoji: '😰',
        label: 'Miedos que me frenan a la hora de decidir',
        pain: 'miedos que te frenan a la hora de decidir',
        category: 'sanidad',
      },
      {
        id: 'creencias',
        emoji: '🧠',
        label: 'Creencias tipo "no soy suficiente" o "no me lo merezco"',
        pain: 'creencias como "no soy suficiente" que te limitan',
        category: 'sanidad',
      },
      {
        id: 'ya-trabajado',
        emoji: '✅',
        label: 'Ya trabajé bastante en esto, no es mi prioridad ahora',
        strength: 'sanidad',
      },
    ],
  },
  {
    id: 'q3',
    emoji: '🤝',
    title: 'Cuando pensás en tu equipo o en las personas que lideras, ¿qué te cuesta más?',
    other: true,
    options: [
      {
        id: 'comunicar',
        emoji: '🗣️',
        label: 'Comunicar con claridad lo que espero',
        pain: 'la dificultad para comunicar con claridad lo que esperás',
        category: 'liderazgo',
      },
      {
        id: 'delegar',
        emoji: '🤝',
        label: 'Delegar sin perder el control',
        pain: 'la dificultad para delegar sin perder el control',
        category: 'liderazgo',
      },
      {
        id: 'motivar',
        emoji: '🔥',
        label: 'Motivarlos cuando las cosas se ponen difíciles',
        pain: 'la dificultad para sostener la motivación de tu equipo en momentos difíciles',
        category: 'liderazgo',
      },
      {
        id: 'sin-equipo',
        emoji: '👤',
        label: 'No lidero equipo todavía, pero quiero prepararme',
      },
    ],
  },
  {
    id: 'q4',
    emoji: '🎯',
    title: '¿Qué tipo de resultado te gustaría ver en los próximos meses?',
    hint: 'Esta es clave para tu diagnóstico — elegí todas las que apliquen.',
    other: false,
    options: [
      {
        id: 'paz',
        emoji: '🧘',
        label: 'Paz interior y más claridad sobre quién soy',
        category: 'sanidad',
      },
      {
        id: 'despegue',
        emoji: '📈',
        label: 'Un equipo o proyecto que finalmente despegue',
        category: 'liderazgo',
      },
      {
        id: 'disciplina',
        emoji: '🎯',
        label: 'Disciplina y carácter para sostener lo que empiezo',
        category: 'caracter',
      },
      {
        id: 'hablar',
        emoji: '🎤',
        label: 'Hablar con seguridad frente a otros',
        category: 'oratoria',
      },
    ],
  },
  {
    id: 'q5',
    emoji: '🎤',
    title: 'Cuando hablás en público o tenés que mostrarte, ¿qué te pasa?',
    other: true,
    options: [
      {
        id: 'bloqueo',
        emoji: '😬',
        label: 'Me bloqueo o se me va la cabeza',
        pain: 'el bloqueo que sentís al tener que hablar en público',
        category: 'oratoria',
      },
      {
        id: 'no-soy-yo',
        emoji: '🎭',
        label: 'Puedo, pero siento que no soy yo del todo',
        pain: 'la sensación de no ser vos del todo cuando te mostrás',
        category: 'oratoria',
      },
      {
        id: 'pulir',
        emoji: '💪',
        label: 'Me manejo bien, quiero pulir el nivel',
        strength: 'oratoria',
      },
      {
        id: 'no-preocupa',
        emoji: '🙅',
        label: 'No es algo que me preocupe hoy',
        strength: 'oratoria',
      },
    ],
  },
  {
    id: 'q6',
    emoji: '⏳',
    title: '¿Qué tan urgente sentís este cambio?',
    other: true,
    options: [
      {
        id: 'urgente',
        emoji: '🔴',
        label: 'Lo necesito ya, esto no puede esperar',
        urgency: 'alta',
      },
      {
        id: 'importante',
        emoji: '🟠',
        label: 'Es importante, pero puedo tomarme unos meses',
        urgency: 'media',
      },
      {
        id: 'explorando',
        emoji: '🟡',
        label: 'Estoy explorando, todavía no es prioridad',
        urgency: 'baja',
      },
    ],
  },
  {
    id: 'q7',
    emoji: '🚀',
    title: '¿Cuánto estás dispuesto/a a invertir en tu desarrollo en este momento?',
    other: false,
    options: [
      {
        id: 'sesion-unica',
        emoji: '☕',
        label: 'Una sesión intensiva conmigo, ir directo al punto (2 hs)',
        level: 'sesion-unica',
      },
      {
        id: 'acompanamiento',
        emoji: '📅',
        label: 'Un mes de acompañamiento, con continuidad (4 sesiones)',
        level: 'acompanamiento',
      },
      {
        id: 'transformacion',
        emoji: '🚀',
        label: 'Un proceso de transformación real, 90 días a fondo',
        level: 'transformacion',
      },
      {
        id: 'no-se',
        emoji: '🤔',
        label: 'Todavía no lo sé, quiero que me orienten',
        level: 'no-se',
      },
    ],
  },
];

/** Índice (0-based) de la pregunta después de la cual aparece el checkpoint de datos. */
export const CHECKPOINT_AFTER_INDEX = 3;

export const LEVEL_INFO: Record<
  Exclude<Level, 'no-se'>,
  { name: string; meta: string; benefit: string }
> = {
  'sesion-unica': {
    name: 'Sesión Única Personalizada',
    meta: '2 horas · encuentro intensivo 1 a 1',
    benefit:
      'vas a salir con un mapa claro de qué es lo primero que tenés que resolver y un plan de acción inmediato',
  },
  acompanamiento: {
    name: 'Programa de Acompañamiento',
    meta: '4 sesiones · un mes de continuidad',
    benefit:
      'vas a salir con un plan concreto para sostenerlo en el tiempo, con herramientas que podés aplicar semana a semana',
  },
  transformacion: {
    name: 'Programa de Transformación',
    meta: '90 días · proceso a fondo',
    benefit:
      'vas a trabajar en profundidad durante 90 días para instalar un cambio real y sostenible, no un simple parche',
  },
};

export const CATEGORY_ADDON: Record<Category, string> = {
  sanidad: 'con más paz y claridad sobre quién sos y hacia dónde vas',
  liderazgo: 'con acciones concretas para que tu equipo empiece a responder distinto',
  caracter: 'con la disciplina y el carácter para sostener lo que empezás',
  oratoria: 'con la seguridad para hablar y mostrarte cuando más importa',
};

export const URGENCY_TO_LEVEL: Record<Urgency, Exclude<Level, 'no-se'>> = {
  alta: 'transformacion',
  media: 'acompanamiento',
  baja: 'sesion-unica',
};

export type Answers = Record<string, { selected: string[]; other: string }>;

function findOption(questionId: string, optionId: string): QuizOption | undefined {
  return questions.find((q) => q.id === questionId)?.options.find((o) => o.id === optionId);
}

function collectSelectedOptions(answers: Answers, questionId: string): QuizOption[] {
  const answer = answers[questionId] ?? { selected: [], other: '' };
  return answer.selected
    .map((id) => findOption(questionId, id))
    .filter((o): o is QuizOption => !!o);
}

export function buildPainSentence(answers: Answers): string {
  const painSources = ['q1', 'q2', 'q3', 'q5'];
  const fragments: string[] = [];
  painSources.forEach((qid) => {
    collectSelectedOptions(answers, qid).forEach((opt) => {
      if (opt.pain && !fragments.includes(opt.pain)) fragments.push(opt.pain);
    });
  });

  if (fragments.length === 0) {
    return 'algunos bloqueos que todavía no tenés del todo identificados, pero que están frenando tu avance';
  }
  if (fragments.length === 1) return fragments[0];
  return `${fragments[0]} y ${fragments[1]}`;
}

export function pickPrimaryCategory(answers: Answers): Category {
  const q4 = collectSelectedOptions(answers, 'q4');
  if (q4.length && q4[0].category) return q4[0].category;

  const fallbackSources = ['q1', 'q2', 'q3', 'q5'];
  for (const qid of fallbackSources) {
    const withCategory = collectSelectedOptions(answers, qid).find((o) => o.category);
    if (withCategory?.category) return withCategory.category;
  }
  return 'caracter';
}

export function pickLevel(answers: Answers): { level: Exclude<Level, 'no-se'>; inferred: boolean } {
  const q7 = collectSelectedOptions(answers, 'q7');
  const chosen = q7[0];
  let level: Level = chosen?.level ?? 'no-se';
  let inferred = false;

  if (level === 'no-se') {
    const q6 = collectSelectedOptions(answers, 'q6');
    const urgency = q6[0]?.urgency ?? 'media';
    level = URGENCY_TO_LEVEL[urgency];
    inferred = true;
  }
  return { level: level as Exclude<Level, 'no-se'>, inferred };
}

export type Metric = 'proposito' | 'enfoque' | 'confianza' | 'accion';

export const METRIC_ORDER: Metric[] = ['proposito', 'enfoque', 'confianza', 'accion'];

export const METRIC_META: Record<Metric, { label: string; short: string }> = {
  proposito: { label: 'Claridad de propósito', short: 'más claridad' },
  enfoque: { label: 'Enfoque y disciplina', short: 'enfoque' },
  confianza: { label: 'Confianza personal', short: 'confianza' },
  accion: { label: 'Acción y ejecución', short: 'acción sostenida' },
};

const CATEGORY_TO_METRIC: Record<Category, Metric> = {
  sanidad: 'proposito',
  caracter: 'enfoque',
  oratoria: 'confianza',
  liderazgo: 'accion',
};

export function computeMetrics(answers: Answers): Record<Metric, number> {
  const scores: Record<Metric, number> = { proposito: 65, enfoque: 65, confianza: 65, accion: 65 };

  ['q1', 'q2', 'q3', 'q5'].forEach((qid) => {
    collectSelectedOptions(answers, qid).forEach((opt) => {
      if (opt.category && opt.pain) scores[CATEGORY_TO_METRIC[opt.category]] -= 18;
      if (opt.strength) scores[CATEGORY_TO_METRIC[opt.strength]] += 15;
    });
  });

  collectSelectedOptions(answers, 'q4').forEach((opt) => {
    if (opt.category) scores[CATEGORY_TO_METRIC[opt.category]] -= 8;
  });

  METRIC_ORDER.forEach((metric) => {
    scores[metric] = Math.max(15, Math.min(95, scores[metric]));
  });

  return scores;
}

function sortedMetrics(scores: Record<Metric, number>): Metric[] {
  return [...METRIC_ORDER].sort((a, b) => scores[a] - scores[b]);
}

const PROFILE_LABEL: Record<Metric, string> = {
  proposito: 'Rumbo por definir',
  enfoque: 'Enfoque disperso',
  confianza: 'Voz en reserva',
  accion: 'Potencial en pausa',
};

const STRENGTH_TEXT: Record<Metric, string> = {
  proposito: 'tenés bastante claro qué es lo que realmente querés — esa base ya la tenés.',
  enfoque: 'cuando te lo proponés, sostenés la disciplina bastante bien.',
  confianza: 'te mostrás con seguridad cuando la situación lo requiere.',
  accion: 'cuando decidís avanzar, las cosas se mueven — tenés capacidad real de ejecución.',
};

const BLOCKER_TEXT: Record<Metric, string> = {
  proposito: 'te falta claridad sobre hacia dónde ir, y eso te hace dar vueltas en lo mismo.',
  enfoque: 'te cuesta sostener la disciplina y la constancia en el tiempo.',
  confianza: 'te cuesta mostrarte con seguridad cuando más importa.',
  accion: 'sabés qué querés, pero te cuesta pasar a la acción y ejecutar.',
};

export interface DiagnosticoProfile {
  metrics: Record<Metric, number>;
  profileLabel: string;
  strengthText: string;
  blockerText: string;
  priorityText: string;
}

export function buildProfile(answers: Answers): DiagnosticoProfile {
  const metrics = computeMetrics(answers);
  const weakest = sortedMetrics(metrics);
  const strongest = [...weakest].reverse();

  return {
    metrics,
    profileLabel: PROFILE_LABEL[weakest[0]],
    strengthText: STRENGTH_TEXT[strongest[0]],
    blockerText: BLOCKER_TEXT[weakest[0]],
    priorityText: `${METRIC_META[weakest[0]].short} + ${METRIC_META[weakest[1]].short}`,
  };
}
