import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  questions,
  CHECKPOINT_AFTER_INDEX,
  LEVEL_INFO,
  buildPainSentence,
  buildProfile,
  pickPrimaryCategory,
  pickLevel,
  METRIC_ORDER,
  METRIC_META,
  type Answers,
  type DiagnosticoProfile,
} from '@/content/diagnostico';

const WHATSAPP_NUMBER = '5491134785986';

type Step = 'intro' | 'question' | 'checkpoint' | 'result';

type ResultData = {
  painSentence: string;
  profile: DiagnosticoProfile;
  ctaHref: string;
};

function emptyAnswers(): Answers {
  return Object.fromEntries(questions.map((q) => [q.id, { selected: [], other: '' }]));
}

function sanitizePhone(value: string): string {
  const hasCountryCode = value.trimStart().startsWith('+');
  const digits = value.replace(/\D/g, '');
  return hasCountryCode ? `+${digits}` : digits;
}

export function DiagnosticoForm() {
  const [step, setStep] = useState<Step>('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);

  const [leadCaptured, setLeadCaptured] = useState(false);
  const [leadRowId, setLeadRowId] = useState<number | null>(null);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadTouched, setLeadTouched] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [submittingLead, setSubmittingLead] = useState(false);
  const [submittingResult, setSubmittingResult] = useState(false);

  const [result, setResult] = useState<ResultData | null>(null);
  const [barsAnimated, setBarsAnimated] = useState(false);

  useEffect(() => {
    if (step !== 'result') {
      setBarsAnimated(false);
      return;
    }
    const timer = setTimeout(() => setBarsAnimated(true), 250);
    return () => clearTimeout(timer);
  }, [step]);

  const q = questions[questionIndex];
  const answer = answers[q.id];

  function toggleOption(idx: number) {
    const opt = q.options[idx];
    setAnswers((prev) => {
      const current = prev[q.id];
      const pos = current.selected.indexOf(opt.id);
      const selected =
        pos > -1 ? current.selected.filter((id) => id !== opt.id) : [...current.selected, opt.id];
      return { ...prev, [q.id]: { ...current, selected } };
    });
  }

  function setOtherText(text: string) {
    setAnswers((prev) => ({ ...prev, [q.id]: { ...prev[q.id], other: text } }));
  }

  const hasSelection = answer.selected.length > 0 || answer.other.trim().length > 0;

  function goBack() {
    if (questionIndex === 0) return;
    setQuestionIndex(questionIndex - 1);
  }

  function validateLead(showErrors: boolean) {
    const okName = leadName.trim().length > 1;
    const okContact =
      /^\S+@\S+\.\S+$/.test(leadEmail.trim()) || leadPhone.replace(/\D/g, '').length > 6;
    if (showErrors) setLeadTouched(true);
    return okName && okContact;
  }

  async function goNext() {
    if (questionIndex < questions.length - 1) {
      const justAnswered = questionIndex;
      setQuestionIndex(questionIndex + 1);
      if (justAnswered === CHECKPOINT_AFTER_INDEX && !leadCaptured) {
        setStep('checkpoint');
      }
    } else {
      await submitResult();
    }
  }

  async function handleCheckpointContinue() {
    if (!validateLead(true)) return;

    setSubmittingLead(true);
    try {
      const res = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName.trim(),
          email: leadEmail.trim(),
          phone: leadPhone.trim(),
          honeypot,
        }),
      });
      const body = (await res.json().catch(() => null)) as { ok: boolean; id?: number } | null;
      if (res.ok && body?.id) {
        setLeadRowId(body.id);
      } else {
        toast.error('No pudimos guardar tus datos todavía, pero seguí con el diagnóstico.');
      }
    } catch {
      toast.error('Sin conexión: no pudimos guardar tus datos, pero seguí con el diagnóstico.');
    } finally {
      setSubmittingLead(false);
      setLeadCaptured(true);
      setStep('question');
    }
  }

  async function submitResult() {
    const painSentence = buildPainSentence(answers);
    const category = pickPrimaryCategory(answers);
    const { level, inferred } = pickLevel(answers);
    const info = LEVEL_INFO[level];
    const profile = buildProfile(answers);
    const name = leadName.trim();

    setSubmittingResult(true);

    if (leadRowId) {
      const answersPayload = questions.map((question) => ({
        question: question.title,
        selected: answers[question.id].selected,
        other: answers[question.id].other.trim(),
      }));

      try {
        const res = await fetch('/api/diagnostico', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: leadRowId,
            painSentence,
            category,
            level,
            levelInferred: inferred,
            answers: answersPayload,
          }),
        });
        if (!res.ok) {
          toast.error('No pudimos guardar tu resultado, pero acá lo tenés igual.');
        }
      } catch {
        toast.error('Sin conexión: no pudimos guardar tu resultado, pero acá lo tenés igual.');
      }
    }

    setSubmittingResult(false);

    const message = encodeURIComponent(
      `Hola Claudio, soy ${name}. Hice el Diagnóstico de Claridad de Puedes Ser Más.\n` +
        `Lo que me está frenando: ${painSentence}.\n` +
        `Nivel de mentoría recomendado: ${info.name}.\n` +
        `WhatsApp: ${leadPhone.trim()}${leadEmail.trim() ? `\nEmail: ${leadEmail.trim()}` : ''}`,
    );

    setResult({
      painSentence,
      profile,
      ctaHref: `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
    });
    setStep('result');
  }

  const totalSteps = questions.length;
  const progressPct = ((questionIndex + 1) / totalSteps) * 100;

  return (
    <div className="mx-auto my-auto w-full max-w-2xl">
      {step === 'intro' && (
        <div className="text-center">
          <div className="mb-4 text-5xl leading-none">🧭</div>
          <h1 className="mb-4 font-heading text-3xl leading-tight text-white sm:text-4xl">
            Diagnóstico de Claridad
          </h1>
          <p className="mx-auto mb-4 max-w-md font-body text-[15px] leading-relaxed text-text-muted">
            Descubrí en 7 preguntas qué es lo que realmente te está frenando hoy y cuál es el primer
            paso concreto para resolverlo.
          </p>
          <p className="mb-8 inline-block rounded-full bg-cta/15 px-3 py-1 font-heading text-xs tracking-[1.5px] text-cta">
            7 PREGUNTAS · 2 MINUTOS
          </p>
          <div>
            <Button onClick={() => setStep('question')} className="btn-lift rounded-full px-10">
              Comenzar <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 'question' && (
        <div>
          <div className="mb-3 print:hidden">
            <p className="mb-1.5 font-body text-xs font-semibold uppercase tracking-wide text-text-variant">
              Pregunta {questionIndex + 1} de {totalSteps}
            </p>
            <div className="relative h-2.5 overflow-hidden rounded-full bg-line">
              <div
                className="progress-shine absolute inset-y-0 left-0 overflow-hidden rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              >
                <div
                  className="absolute inset-y-0 left-0"
                  style={{
                    width: `${(100 / progressPct) * 100}%`,
                    background: 'linear-gradient(90deg, #dc2626, #f97316, #eab308, #22c55e)',
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mb-1 text-3xl leading-none">{q.emoji}</div>
          <h2 className="mb-1 max-w-lg font-heading text-2xl leading-tight text-white sm:text-3xl">
            {q.title}
          </h2>
          <p className="mb-2 font-body text-sm font-medium text-text-variant">
            {q.hint ?? 'Elegí todas las que apliquen.'}
          </p>

          <div className="mb-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {q.options.map((opt, idx) => {
              const selected = answer.selected.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleOption(idx)}
                  className={
                    selected
                      ? 'flex w-full items-center gap-3 rounded-xl border-2 border-cta bg-[#1B1414] px-4 py-3 text-left font-body text-[15px] font-medium text-white transition-colors'
                      : 'flex w-full items-center gap-3 rounded-xl border-2 border-line bg-surface px-4 py-3 text-left font-body text-[15px] font-medium text-white transition-colors hover:border-[#3A3A3A]'
                  }
                >
                  <span className="flex-shrink-0 text-xl">{opt.emoji}</span>
                  <span className="flex-1">{opt.label}</span>
                  <span
                    className={
                      selected
                        ? 'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border border-cta bg-cta text-xs text-white'
                        : 'h-6 w-6 flex-shrink-0 rounded-md border border-line'
                    }
                  >
                    {selected ? '✓' : ''}
                  </span>
                </button>
              );
            })}
          </div>

          {q.other && (
            <input
              type="text"
              value={answer.other}
              onChange={(e) => setOtherText(e.target.value)}
              placeholder="Otro: contanos con tus palabras..."
              className="mb-3 w-full rounded-xl border-2 border-line bg-surface px-4 py-2.5 font-body text-[15px] text-white outline-none placeholder:text-text-variant/60 focus:border-cta"
            />
          )}
          {!q.other && <div className="mb-3" />}

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={goBack}
              className={questionIndex === 0 ? 'invisible text-text-variant' : 'text-text-variant'}
            >
              <ChevronLeft className="h-4 w-4" /> Atrás
            </Button>
            <Button
              onClick={goNext}
              disabled={!hasSelection || submittingResult}
              className="btn-lift rounded-full px-6"
            >
              {submittingResult ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Calculando...
                </>
              ) : questionIndex === questions.length - 1 ? (
                'Ver mi resultado'
              ) : (
                <>
                  Siguiente <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {step === 'checkpoint' && (
        <div>
          <div className="mb-2 text-3xl leading-none">🎉</div>
          <h2 className="mb-2 font-heading text-2xl leading-tight text-white sm:text-3xl">
            ¡Vas muy bien!
          </h2>
          <p className="mb-4 font-body text-[14.5px] leading-relaxed text-text-muted">
            Llegaste a la mitad del diagnóstico —{' '}
            <span className="font-bold text-white">el 90% de las personas no llega hasta acá.</span>{' '}
            Ya hiciste lo más difícil. Dejame tus datos para poder enviarte tu diagnóstico
            personalizado apenas termines.
          </p>

          <div className="mb-3 flex flex-col gap-2.5">
            <input
              type="text"
              name="website"
              autoComplete="off"
              tabIndex={-1}
              aria-hidden="true"
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ position: 'absolute', left: '-9999px', top: 0, width: '1px', height: '1px' }}
            />

            <div>
              <label className="mb-1.5 block font-body text-xs font-bold uppercase tracking-wide text-text-variant">
                Nombre
              </label>
              <input
                type="text"
                autoComplete="name"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="¿Cómo te llamás?"
                className={
                  leadTouched && leadName.trim().length <= 1
                    ? 'w-full rounded-xl border-2 border-cta bg-surface px-5 py-2.5 font-body text-[15px] text-white outline-none'
                    : 'w-full rounded-xl border-2 border-line bg-surface px-5 py-2.5 font-body text-[15px] text-white outline-none focus:border-cta'
                }
              />
            </div>
            <div>
              <label className="mb-1.5 block font-body text-xs font-bold uppercase tracking-wide text-text-variant">
                Email
              </label>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full rounded-xl border-2 border-line bg-surface px-5 py-2.5 font-body text-[15px] text-white outline-none focus:border-cta"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-body text-xs font-bold uppercase tracking-wide text-text-variant">
                WhatsApp
              </label>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={leadPhone}
                onChange={(e) => setLeadPhone(sanitizePhone(e.target.value))}
                placeholder="+54 9 11 ..."
                className="w-full rounded-xl border-2 border-line bg-surface px-5 py-2.5 font-body text-[15px] text-white outline-none focus:border-cta"
              />
              <p className="mt-1 font-body text-[11.5px] text-text-variant">
                Solo números. Usá el + solo si ponés el código de país; si es tu número local, sin
                el +.
              </p>
            </div>
          </div>

          {leadTouched && !validateLead(false) && (
            <p className="mb-5 font-body text-[12.5px] font-medium text-cta">
              Completá tu nombre y al menos un email o WhatsApp para continuar.
            </p>
          )}

          <div className="flex items-center justify-end">
            <Button
              onClick={handleCheckpointContinue}
              disabled={submittingLead}
              className="btn-lift rounded-full px-6"
            >
              {submittingLead ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Guardando...
                </>
              ) : (
                <>
                  Continuar <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
          <p className="mt-2 text-center font-body text-[11.5px] text-text-variant">
            Tus datos son confidenciales. No hacemos spam, solo te acompañamos en tu proceso.
          </p>
        </div>
      )}

      {step === 'result' && result && (
        <div className="offer-in">
          <div className="relative mb-6 text-center">
            <div className="relative mx-auto w-fit">
              <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-cta/40 blur-2xl" />
              <img
                src="/assets/fotoclaudio.jpeg"
                alt="Claudio Español"
                className="size-24 flex-shrink-0 rounded-full border-4 border-cta object-cover shadow-[0_0_40px_rgba(196,23,24,0.45)]"
              />
            </div>
            <p className="mt-4 font-heading text-xl text-white">Claudio Español</p>
            <p className="mt-1.5 inline-block rounded-full bg-[#2dfa87]/15 px-4 py-1.5 font-heading text-sm tracking-[1.5px] text-[#2dfa87]">
              CEO Y FUNDADOR DE PUEDES SER MÁS
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-surface to-black p-6 sm:p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,_var(--color-cta)_20%,_transparent),_transparent_70%)]" />

            <div className="relative">
              <p className="mb-5 flex items-start gap-2.5 font-body text-lg leading-snug text-white sm:text-xl">
                <span className="text-2xl">📊</span>
                <span>
                  {leadName.trim() && <strong className="font-bold">{leadName.trim()}, </strong>}
                  este es tu resultado de diagnóstico
                </span>
              </p>

              <div className="mb-6 flex items-center gap-2.5 rounded-2xl border border-cta/40 bg-gradient-to-r from-cta/20 to-cta/5 px-4 py-3.5">
                <span className="text-xl">⚡</span>
                <p className="font-body text-[15px] text-white">
                  Perfil actual:{' '}
                  <strong className="font-bold text-[#ff5361]">
                    {result.profile.profileLabel.toUpperCase()}
                  </strong>
                </p>
              </div>

              <div className="mb-6 flex flex-col gap-4">
                {METRIC_ORDER.map((metric) => {
                  const value = result.profile.metrics[metric];
                  const gradient =
                    value < 50
                      ? 'linear-gradient(90deg, #ff3546, #ff5361)'
                      : value < 70
                        ? 'linear-gradient(90deg, #ffcc66, #ffad33)'
                        : 'linear-gradient(90deg, #35d895, #12ba71)';
                  return (
                    <div key={metric}>
                      <div className="mb-1.5 flex items-center justify-between gap-3">
                        <p className="flex items-center gap-1.5 font-body text-sm font-bold text-white">
                          <span>{METRIC_META[metric].emoji}</span> {METRIC_META[metric].label}
                        </p>
                        <span className="font-heading text-lg text-white">{value}%</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-line">
                        <div
                          className="h-full rounded-full transition-[width] duration-[1200ms] ease-out"
                          style={{ width: barsAnimated ? `${value}%` : '0%', background: gradient }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mb-6 h-px bg-line" />

              <div className="mb-6 flex flex-col gap-4">
                <div className="flex items-start gap-3.5">
                  <span className="flex size-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#00bf73] bg-[#00bf73]/10 text-lg text-[#00e68a]">
                    ★
                  </span>
                  <p className="font-body text-[15px] leading-relaxed text-text-muted">
                    <strong className="font-bold text-white">Tu fortaleza:</strong>{' '}
                    {result.profile.strengthText}
                  </p>
                </div>
                <div className="flex items-start gap-3.5">
                  <span className="flex size-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-cta bg-cta/10 text-lg text-[#ff5361]">
                    🔒
                  </span>
                  <p className="font-body text-[15px] leading-relaxed text-text-muted">
                    <strong className="font-bold text-white">Tu principal bloqueo:</strong>{' '}
                    {result.profile.blockerText} Concretamente, lo que más te frena hoy es{' '}
                    {result.painSentence}.
                  </p>
                </div>
                <div className="flex items-start gap-3.5">
                  <span className="flex size-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#ffd026] bg-[#ffd026]/10 text-lg text-[#ffd026]">
                    ↗
                  </span>
                  <p className="font-body text-[15px] leading-relaxed text-text-muted">
                    <strong className="font-bold text-white">Área prioritaria:</strong>{' '}
                    {result.profile.priorityText}.
                  </p>
                </div>
              </div>

              <div className="mb-5 h-px bg-line" />

              <p className="mb-5 font-body text-[15px] leading-relaxed text-text-muted">
                Si querés trabajar esta área en profundidad, podés hacerlo en una{' '}
                <strong className="font-bold text-white">mentoría gratuita</strong>, 1 a 1 conmigo,
                personalizada a tu situación.
              </p>

              <a
                href={result.ctaHref}
                target="_blank"
                rel="noopener"
                className="btn-lift pulse-cta block w-full whitespace-nowrap rounded-xl bg-cta px-4 py-5 text-center font-body text-base font-bold text-white transition-colors hover:bg-cta-hover"
              >
                Quiero mi mentoría gratuita →
              </a>
            </div>
          </div>

          <p className="mt-6 text-center font-heading text-xs tracking-[4px] text-text-variant uppercase">
            Más disciplina · Más libertad · Un vos más grande
          </p>
        </div>
      )}
    </div>
  );
}

export default DiagnosticoForm;
