import { useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { questions, results, type Track } from '@/content/diagnostico';

const WHATSAPP_NUMBER = '5491134785986';

type Answer =
  | { type: 'option'; idx: number }
  | { type: 'other'; text: string }
  | { type: 'multi'; idxs: number[]; otherText: string };

type Step = 'question' | 'encouragement' | 'closing' | 'lead' | 'result';

const TOTAL_STEPS = questions.length + 2;

function renderHighlighted(text: string): ReactNode[] {
  return text.split('**').map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="text-cta">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

function stripHighlight(text: string): string {
  return text.replaceAll('**', '');
}

function isAnswered(a: Answer | null, multi: boolean): boolean {
  if (!a) return false;
  if (multi && a.type === 'multi') {
    return a.idxs.length > 0 || a.otherText.trim().length > 0;
  }
  if (a.type === 'option') return true;
  if (a.type === 'other') return a.text.trim().length > 0;
  return false;
}

export function DiagnosticoForm() {
  const [step, setStep] = useState<Step>('question');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<Answer | null>>(() =>
    new Array(questions.length).fill(null),
  );
  const [encouragementShown, setEncouragementShown] = useState(false);
  const [closingText, setClosingText] = useState('');

  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadTouched, setLeadTouched] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [result, setResult] = useState<{ track: Track; ctaHref: string } | null>(null);

  const q = questions[questionIndex];

  function setAnswer(i: number, next: Answer | null) {
    setAnswers((prev) => {
      const copy = prev.slice();
      copy[i] = next;
      return copy;
    });
  }

  function toggleOption(idx: number) {
    const current = answers[questionIndex];
    if (q.multi) {
      const base =
        current && current.type === 'multi'
          ? current
          : { type: 'multi' as const, idxs: [], otherText: '' };
      const pos = base.idxs.indexOf(idx);
      const idxs = pos > -1 ? base.idxs.filter((x) => x !== idx) : [...base.idxs, idx];
      setAnswer(questionIndex, { ...base, idxs });
    } else {
      setAnswer(questionIndex, { type: 'option', idx });
    }
  }

  function setOtherText(text: string) {
    const current = answers[questionIndex];
    if (q.multi) {
      const base =
        current && current.type === 'multi'
          ? current
          : { type: 'multi' as const, idxs: [], otherText: '' };
      setAnswer(questionIndex, { ...base, otherText: text });
    } else {
      setAnswer(questionIndex, { type: 'other', text });
    }
  }

  function goBackFromQuestion() {
    if (questionIndex === 0) return;
    setQuestionIndex(questionIndex - 1);
    setStep('question');
  }

  function goNext() {
    const next = questionIndex + 1;
    if (next < questions.length) {
      setQuestionIndex(next);
      if (next === 4 && !encouragementShown) {
        setEncouragementShown(true);
        setStep('encouragement');
      } else {
        setStep('question');
      }
    } else {
      setStep('closing');
    }
  }

  function computeScores() {
    const scores: Record<Track, number> = { A: 0, B: 0, C: 0, D: 0 };
    answers.forEach((a, i) => {
      if (!a) return;
      const question = questions[i];
      if (question.multi && a.type === 'multi') {
        a.idxs.forEach((idx) => {
          scores[question.options[idx].track]++;
        });
      } else if (a.type === 'option') {
        scores[question.options[a.idx].track]++;
      }
    });
    return scores;
  }

  function getAspirations() {
    const i = questions.findIndex((x) => x.multi);
    const question = questions[i];
    const a = answers[i];
    const list: Array<{ emoji: string; text: string }> = [];
    if (a && a.type === 'multi') {
      a.idxs.forEach((idx) =>
        list.push({ emoji: question.options[idx].emoji, text: question.options[idx].label }),
      );
      if (a.otherText.trim()) list.push({ emoji: '✏️', text: a.otherText.trim() });
    }
    return list;
  }

  function validateLead(showErrors: boolean) {
    const okName = leadName.trim().length > 1;
    const okPhone = leadPhone.replace(/\D/g, '').length >= 6;
    const okEmail = /^\S+@\S+\.\S+$/.test(leadEmail.trim());
    if (showErrors) setLeadTouched(true);
    return okName && okPhone && okEmail;
  }

  async function handleLeadSubmit() {
    if (!validateLead(true)) return;

    const scores = computeScores();
    let topTrack: Track = 'A';
    let topScore = -1;
    (Object.keys(scores) as Track[]).forEach((k) => {
      if (scores[k] > topScore) {
        topScore = scores[k];
        topTrack = k;
      }
    });

    const aspirations = getAspirations();
    const answersPayload = questions.map((question, i) => {
      const a = answers[i];
      let answerText = '';
      if (a) {
        if (a.type === 'option') answerText = question.options[a.idx].label;
        else if (a.type === 'other') answerText = a.text.trim();
        else if (a.type === 'multi') {
          const labels = a.idxs.map((idx) => question.options[idx].label);
          if (a.otherText.trim()) labels.push(a.otherText.trim());
          answerText = labels.join(', ');
        }
      }
      return { question: stripHighlight(question.text), answer: answerText };
    });

    const name = leadName.trim();
    const phone = leadPhone.trim();
    const email = leadEmail.trim();

    setSubmitting(true);

    const payload = {
      name,
      phone,
      email,
      track: topTrack,
      scoreA: scores.A,
      scoreB: scores.B,
      scoreC: scores.C,
      scoreD: scores.D,
      closingText: closingText.trim(),
      aspirations: aspirations.map((a) => a.text),
      answers: answersPayload,
      honeypot,
    };

    try {
      const res = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        toast.error('No pudimos guardar tu diagnóstico, pero acá lo tenés igual.');
      }
    } catch {
      toast.error('Sin conexión: no pudimos guardar tu diagnóstico, pero acá lo tenés igual.');
    } finally {
      setSubmitting(false);
    }

    const r = results[topTrack];
    const message = encodeURIComponent(
      `Hola Claudio, soy ${name}. Hice el Diagnóstico de Claridad de Puedes Ser Más.\n` +
        `Resultado: ${stripHighlight(r.title)}\n` +
        `Quiero empezar mi proceso en el ${r.diplomadoNombre}.\n` +
        `Teléfono: ${phone}\nEmail: ${email}`,
    );

    setResult({ track: topTrack, ctaHref: `https://wa.me/${WHATSAPP_NUMBER}?text=${message}` });
    setStep('result');
  }

  function restart() {
    setStep('question');
    setQuestionIndex(0);
    setAnswers(new Array(questions.length).fill(null));
    setEncouragementShown(false);
    setClosingText('');
    setLeadName('');
    setLeadPhone('');
    setLeadEmail('');
    setLeadTouched(false);
    setResult(null);
  }

  // ---- Progress ----
  const globalIndex =
    step === 'closing' ? questions.length : step === 'lead' ? questions.length + 1 : questionIndex;

  return (
    <div className="mx-auto w-full max-w-xl">
      {step !== 'result' && (
        <div className="mb-6 print:hidden">
          <div className="mb-2 flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, idx) => (
              <div key={idx} className="h-1 flex-1 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full bg-cta transition-all duration-300"
                  style={{ width: idx <= globalIndex ? '100%' : '0%' }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between font-body text-xs font-semibold text-text-variant">
            <span>
              Pregunta {globalIndex + 1} de {TOTAL_STEPS}
            </span>
            <span>{Math.round((globalIndex / TOTAL_STEPS) * 100)}%</span>
          </div>
        </div>
      )}

      {step === 'question' && (
        <div>
          <div className="mb-3 text-4xl leading-none">{q.emoji}</div>
          <h2 className="mb-2 max-w-lg font-heading text-3xl leading-tight text-white sm:text-4xl">
            {renderHighlighted(q.text)}
          </h2>
          {q.hint && (
            <p className="mb-5 font-body text-sm font-medium text-text-variant">{q.hint}</p>
          )}

          <div className="mb-7 flex flex-col gap-2.5">
            {q.options.map((opt, idx) => {
              const a = answers[questionIndex];
              const selected = q.multi
                ? a?.type === 'multi' && a.idxs.includes(idx)
                : a?.type === 'option' && a.idx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleOption(idx)}
                  className={
                    selected
                      ? 'flex w-full items-start gap-3 border border-l-[3px] border-cta bg-[#1B1414] px-4 py-4 text-left font-body text-[15px] font-medium text-white transition-colors'
                      : 'flex w-full items-start gap-3 border border-l-[3px] border-line bg-surface px-4 py-4 text-left font-body text-[15px] font-medium text-white transition-colors hover:border-[#3A3A3A]'
                  }
                >
                  <span className="mt-px flex-shrink-0 text-xl">{opt.emoji}</span>
                  <span className="flex-1">{opt.label}</span>
                  {q.multi && (
                    <span className={cn('flex-shrink-0 text-text-variant', selected && 'text-cta')}>
                      {selected ? '✓' : ''}
                    </span>
                  )}
                </button>
              );
            })}

            <OtherRow
              value={
                q.multi
                  ? (answers[questionIndex]?.type === 'multi' &&
                      answers[questionIndex]?.otherText) ||
                    ''
                  : (answers[questionIndex]?.type === 'other' && answers[questionIndex]?.text) || ''
              }
              onChange={setOtherText}
            />
          </div>

          <StepNav
            onBack={goBackFromQuestion}
            backVisible={questionIndex > 0}
            onNext={goNext}
            nextDisabled={!isAnswered(answers[questionIndex], !!q.multi)}
          />
        </div>
      )}

      {step === 'encouragement' && (
        <div className="py-8 text-center">
          <div className="mb-5 text-4xl tracking-widest">🎉 ✨ 🔥</div>
          <h2 className="mb-3 font-heading text-3xl text-white sm:text-4xl">¡Vas muy bien!</h2>
          <p className="mx-auto mb-7 max-w-md font-body text-[14.5px] leading-relaxed text-text-muted">
            El <span className="font-bold text-white">90% de las personas abandona</span> este
            diagnóstico antes de llegar acá. Vos ya estás más cerca de tu claridad que la mayoría —
            faltan solo un par de preguntas más.
          </p>
          <Button onClick={() => setStep('question')} className="btn-lift">
            Seguir <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {step === 'closing' && (
        <div>
          <div className="mb-3 text-4xl leading-none">✍️</div>
          <h2 className="mb-5 max-w-lg font-heading text-3xl leading-tight text-white sm:text-4xl">
            Para cerrar, completá la frase:{' '}
            <span className="text-cta">"Lo que realmente busco</span> con una mentoría es..."
          </h2>
          <Textarea
            value={closingText}
            onChange={(e) => setClosingText(e.target.value)}
            placeholder="Escribí con tus propias palabras..."
            className="mb-7 min-h-[110px] border-l-[3px] border-l-cta"
          />
          <StepNav
            onBack={() => {
              setQuestionIndex(questions.length - 1);
              setStep('question');
            }}
            backVisible
            onNext={() => setStep('lead')}
            nextDisabled={closingText.trim().length === 0}
          />
        </div>
      )}

      {step === 'lead' && (
        <div>
          <div className="mb-3 text-4xl leading-none">📩</div>
          <h2 className="mb-2 max-w-lg font-heading text-3xl leading-tight text-white sm:text-4xl">
            Antes de ver tu diagnóstico, <span className="text-cta">contanos quién sos</span>
          </h2>
          <p className="mb-5 font-body text-[12.5px] font-medium text-text-variant">
            Así podemos guardar tu resultado y coordinar tu sesión si querés avanzar.
          </p>

          <div className="mb-6 flex flex-col gap-2.5">
            {/* Honeypot */}
            <input
              type="text"
              name="website"
              autoComplete="off"
              tabIndex={-1}
              aria-hidden="true"
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ position: 'absolute', opacity: 0, width: '1px', height: '1px' }}
            />

            <LeadRow
              emoji="🙋"
              label="Nombre:"
              value={leadName}
              onChange={setLeadName}
              placeholder="Nombre y apellido"
              autoComplete="name"
              invalid={leadTouched && leadName.trim().length <= 1}
            />
            <LeadRow
              emoji="📱"
              label="Teléfono:"
              value={leadPhone}
              onChange={setLeadPhone}
              placeholder="Tu WhatsApp con código de área"
              autoComplete="tel"
              inputMode="tel"
              invalid={leadTouched && leadPhone.replace(/\D/g, '').length < 6}
            />
            <LeadRow
              emoji="✉️"
              label="Email:"
              value={leadEmail}
              onChange={setLeadEmail}
              placeholder="tu@email.com"
              autoComplete="email"
              inputMode="email"
              invalid={leadTouched && !/^\S+@\S+\.\S+$/.test(leadEmail.trim())}
            />
          </div>

          {leadTouched && !validateLead(false) && (
            <p className="mb-5 font-body text-[12.5px] font-medium text-cta">
              Completá los tres campos para continuar.
            </p>
          )}

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep('closing')}
              className="text-text-variant"
            >
              <ChevronLeft className="h-4 w-4" /> Atrás
            </Button>
            <Button onClick={handleLeadSubmit} disabled={submitting} className="btn-lift">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Guardando...
                </>
              ) : (
                <>
                  Ver mi diagnóstico <Check className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {step === 'result' && result && (
        <ResultScreen
          track={result.track}
          ctaHref={result.ctaHref}
          closingText={closingText}
          aspirations={getAspirations()}
          onRestart={restart}
        />
      )}
    </div>
  );
}

function StepNav({
  onBack,
  backVisible,
  onNext,
  nextDisabled,
}: {
  onBack: () => void;
  backVisible: boolean;
  onNext: () => void;
  nextDisabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <Button
        variant="ghost"
        onClick={onBack}
        className={cn('text-text-variant', !backVisible && 'invisible')}
      >
        <ChevronLeft className="h-4 w-4" /> Atrás
      </Button>
      <Button onClick={onNext} disabled={nextDisabled} className="btn-lift">
        Siguiente <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

function OtherRow({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div
      className={
        value.trim().length > 0
          ? 'flex items-center gap-2.5 border border-l-[3px] border-accent-soft bg-surface py-1.5 pl-4 pr-1.5'
          : 'flex items-center gap-2.5 border border-l-[3px] border-line bg-surface py-1.5 pl-4 pr-1.5'
      }
    >
      <span className="text-xl">✏️</span>
      <label className="whitespace-nowrap font-body text-[15px] font-medium text-text-variant">
        Otro:
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Escribí tu propia respuesta"
        className="flex-1 bg-transparent px-1.5 py-2.5 font-body text-[15px] text-white outline-none placeholder:text-text-variant/60"
      />
    </div>
  );
}

function LeadRow({
  emoji,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  inputMode,
  invalid,
}: {
  emoji: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete: string;
  inputMode?: 'tel' | 'email';
  invalid: boolean;
}) {
  return (
    <div
      className={
        'flex flex-col items-stretch gap-1.5 border border-l-[3px] bg-surface p-3.5 sm:flex-row sm:items-center sm:gap-2.5 sm:py-1.5 sm:pl-4 sm:pr-1.5 ' +
        (invalid ? 'border-cta' : value.trim().length > 0 ? 'border-accent-soft' : 'border-line')
      }
    >
      <span className="text-xl">{emoji}</span>
      <label className="whitespace-nowrap font-body text-[15px] font-medium text-text-variant sm:whitespace-nowrap">
        {label}
      </label>
      <input
        type="text"
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent px-1.5 py-2.5 font-body text-[15px] text-white outline-none placeholder:text-text-variant/60"
      />
    </div>
  );
}

function ResultScreen({
  track,
  ctaHref,
  closingText,
  aspirations,
  onRestart,
}: {
  track: Track;
  ctaHref: string;
  closingText: string;
  aspirations: Array<{ emoji: string; text: string }>;
  onRestart: () => void;
}) {
  const r = results[track];
  const date = new Date().toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div>
      <div className="mb-6 border border-dashed border-[#3A3A3A] bg-[#0F0F0F] p-7 print:border-black print:bg-white">
        <p className="mb-3.5 font-heading text-sm tracking-[2px] text-cta">
          TU DIAGNÓSTICO — PUEDES SER MÁS
        </p>
        <div className="mb-2.5 text-5xl">{r.emoji}</div>
        <h2 className="mb-5 font-heading text-3xl leading-tight text-white sm:text-4xl print:text-black">
          {renderHighlighted(r.title)}
        </h2>
        <p className="mb-5 border-l-[3px] border-accent pl-4 font-body text-sm italic leading-relaxed text-[#D6D6D6] print:text-[#333]">
          "{closingText.trim()}"
        </p>
        <p className="mb-1.5 font-body text-[14.5px] leading-relaxed text-[#D6D6D6] print:text-[#333]">
          {renderHighlighted(r.body)}
        </p>
        <div className="mt-5 flex justify-between border-t border-line pt-3.5 font-body text-[11px] text-[#6A6A6A]">
          <span>puedessermas.com</span>
          <span>{date}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.print()}
        className="mb-9 border border-line px-4 py-2.5 font-body text-[13px] font-semibold text-text-variant transition-colors hover:border-[#4A4A4A] hover:text-white print:hidden"
      >
        🖨️ Guardar o imprimir mi diagnóstico
      </button>

      <div className="border-t border-line pt-7 print:hidden">
        <p className="mb-7 border-l-[3px] border-cta bg-surface p-4 font-body text-[13.5px] leading-relaxed text-[#C8C8C8]">
          📌 La mayoría de las personas hace este diagnóstico,{' '}
          <span className="font-bold text-white">se queda con la foto de lo que le pasa</span> y ahí
          se detiene. Lo que realmente cambia las cosas es lo que hacés después de leer esto.
        </p>

        <p className="mb-2.5 font-heading text-sm tracking-[2px] text-cta">TU PRÓXIMO PASO</p>
        <h3 className="mb-4 max-w-md font-heading text-2xl leading-tight text-white sm:text-3xl">
          Quiero que Claudio me ayude a:
        </h3>

        {aspirations.length > 0 && (
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {aspirations.map((item, idx) => (
              <div key={idx} className="border border-line bg-surface p-3.5">
                <span className="mb-2 block text-xl">{item.emoji}</span>
                <span className="mb-1.5 block font-heading text-sm tracking-wide text-cta">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="font-body text-xs leading-snug text-[#C8C8C8]">{item.text}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mb-5 inline-flex items-center gap-2 border border-[#3A2323] bg-[#1A0F0F] px-3.5 py-1.5 font-body text-xs font-semibold text-[#FF8A8A]">
          <span className="h-1.5 w-1.5 flex-shrink-0 animate-pulse rounded-full bg-cta" />
          Quedan pocos cupos de mentoría esta semana
        </div>

        <div className="mb-6 flex items-center gap-3.5">
          <img
            src="/assets/claudio-portrait.webp"
            alt="Claudio Español"
            className="h-14 w-14 flex-shrink-0 rounded-full border border-line object-cover"
          />
          <div>
            <p className="font-body text-[14.5px] font-bold text-white">Claudio Español</p>
            <p className="font-body text-xs text-text-variant">
              Director, Puedes Ser Más · Sesión de 30 minutos
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener"
            className="btn-lift inline-block bg-cta px-8 py-4 font-body text-[15px] font-bold text-white transition-colors hover:bg-cta-hover"
          >
            Quiero empezar mi proceso
          </a>
          <a
            href={`/diplomados/${r.diplomadoSlug}`}
            className="font-body text-sm font-semibold text-text-variant underline underline-offset-4 hover:text-white"
          >
            Conocé el {r.diplomadoNombre} →
          </a>
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="mt-5 block font-body text-[13px] text-text-variant underline hover:text-white"
        >
          Volver a empezar
        </button>
      </div>
    </div>
  );
}

export default DiagnosticoForm;
