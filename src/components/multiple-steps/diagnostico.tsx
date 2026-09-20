import { useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  questions,
  CHECKPOINT_AFTER_INDEX,
  LEVEL_INFO,
  CATEGORY_ADDON,
  buildPainSentence,
  pickPrimaryCategory,
  pickLevel,
  type Answers,
} from '@/content/diagnostico';

const WHATSAPP_NUMBER = '5491134785986';
const CALENDLY_URL = 'https://calendly.com/puedessermas/30min';

type Step = 'question' | 'checkpoint' | 'result';

type ResultData = {
  painSentence: string;
  greeting: string;
  levelName: string;
  levelMeta: string;
  benefit: string;
  inferred: boolean;
  ctaHref: string;
};

function emptyAnswers(): Answers {
  return Object.fromEntries(questions.map((q) => [q.id, { selected: [], other: '' }]));
}

export function DiagnosticoForm() {
  const [step, setStep] = useState<Step>('question');
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
    const addon = CATEGORY_ADDON[category];
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
      greeting: name
        ? `¡Gracias por completar el diagnóstico, ${name}! Esto es lo que veo en tus respuestas:`
        : '¡Gracias por completar el diagnóstico! Esto es lo que veo en tus respuestas:',
      levelName: info.name,
      levelMeta: info.meta,
      benefit: `Ahí ${info.benefit}, ${addon}.`,
      inferred,
      ctaHref: `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
    });
    setStep('result');
  }

  const totalSteps = questions.length;

  return (
    <div
      className={
        step === 'result' ? 'mx-auto my-auto w-full max-w-5xl' : 'mx-auto my-auto w-full max-w-2xl'
      }
    >
      {step === 'question' && (
        <div>
          <div className="mb-3 print:hidden">
            <p className="mb-1.5 font-body text-xs font-semibold uppercase tracking-wide text-text-variant">
              Pregunta {questionIndex + 1} de {totalSteps}
            </p>
            <div className="relative h-2.5 overflow-hidden rounded-full bg-line">
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: 'linear-gradient(90deg, #dc2626, #f97316, #eab308, #22c55e)' }}
              />
              <div
                className="absolute inset-y-0 right-0 rounded-full bg-line transition-all duration-300"
                style={{ width: `${100 - ((questionIndex + 1) / totalSteps) * 100}%` }}
              />
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
                onChange={(e) => setLeadPhone(e.target.value)}
                placeholder="+54 9 11 ..."
                className="w-full rounded-xl border-2 border-line bg-surface px-5 py-2.5 font-body text-[15px] text-white outline-none focus:border-cta"
              />
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
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:items-start lg:gap-8">
          <div>
            <div className="mb-6 flex items-center gap-3.5 border-b border-line pb-5">
              <img
                src="/assets/fotoclaudio.jpeg"
                alt="Claudio Español"
                className="size-16 flex-shrink-0 rounded-full border-2 border-cta object-cover"
              />
              <div>
                <p className="font-body text-[14.5px] font-bold text-white">Claudio Español</p>
                <p className="font-body text-xs text-text-variant">Fundador de Puedes Ser Más</p>
              </div>
            </div>

            <p className="mb-6 font-body text-[15px] leading-relaxed text-text-muted">
              {result.greeting}
            </p>

            <div className="rounded-2xl border-2 border-line bg-surface p-7">
              <p className="mb-2 font-heading text-xs tracking-[1.5px] text-cta">
                MENTORÍA RECOMENDADA
              </p>
              <h3 className="mb-1 font-heading text-2xl text-white sm:text-3xl">
                {result.levelName}
              </h3>
              <p className="mb-5 font-body text-xs text-text-variant">{result.levelMeta}</p>
              <p className="mb-2 font-heading text-xs tracking-[1.5px] text-cta">
                LO QUE VAS A LOGRAR
              </p>
              <p className="font-body text-lg leading-relaxed text-white sm:text-xl">
                {result.benefit}
              </p>
            </div>

            {result.inferred && (
              <p className="mt-5 font-body text-[12.5px] leading-relaxed text-text-variant">
                Esto es una referencia inicial a partir de tus respuestas — lo ideal es que lo
                charlemos juntos para confirmarlo.
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-4 lg:sticky lg:top-4 lg:mt-0">
            <div>
              <p className="mb-3.5 font-heading text-sm tracking-[2px] text-cta">TU DIAGNÓSTICO</p>
              <div className="rounded-2xl border-l-4 border-cta bg-surface p-6">
                <p className="font-body text-lg leading-relaxed text-white">
                  Lo que te está frenando hoy es {result.painSentence}.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={result.ctaHref}
                target="_blank"
                rel="noopener"
                className="btn-lift block w-full whitespace-nowrap rounded-xl bg-cta px-4 py-4 text-center font-body text-[15px] font-bold text-white transition-colors hover:bg-cta-hover"
              >
                Quiero mi mentoría →
              </a>

              <button
                type="button"
                onClick={() => window.Calendly?.initPopupWidget({ url: CALENDLY_URL })}
                className="block w-full whitespace-nowrap rounded-xl border-2 border-line bg-transparent px-4 py-4 text-center font-body text-[15px] font-bold text-white transition-colors hover:border-cta"
              >
                Reservar sesión 1 a 1 con Claudio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DiagnosticoForm;
