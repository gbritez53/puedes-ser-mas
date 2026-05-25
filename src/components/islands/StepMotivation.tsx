import type { AdmissionInput, AdmissionFieldErrors } from '../../lib/validators/admission';

interface StepMotivationProps {
  values: Partial<AdmissionInput>;
  errors: AdmissionFieldErrors;
  onChange: (field: keyof AdmissionInput, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const textareaClass = `
  w-full bg-transparent border px-4 py-3 font-body text-sm text-white
  transition-colors focus:outline-none focus:border-[var(--color-cta)]
  placeholder:text-[var(--color-text-muted)] resize-none
`.trim();

const inputStyle = {
  borderColor: 'var(--color-line)',
  borderRadius: 'var(--radius-card)',
};

export function StepMotivation({
  values,
  errors,
  onChange,
  onSubmit,
  onBack,
  isSubmitting,
}: StepMotivationProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  const charCount = (values.motivation ?? '').length;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div>
        <p
          className="font-body text-xs uppercase tracking-widest mb-2"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Paso 3 de 3
        </p>
        <h3 className="font-heading text-3xl text-white uppercase">Tu motivación</h3>
      </div>

      {/* Motivation textarea */}
      <div className="flex flex-col gap-1">
        <label htmlFor="motivation" className="font-body text-sm font-bold text-white">
          ¿Por qué querés aplicar al Diplomado? <span style={{ color: 'var(--color-cta)' }}>*</span>
        </label>
        <p className="font-body text-xs" style={{ color: 'var(--color-text-muted)' }}>
          Contanos qué te trajo hasta acá. Mínimo 40 caracteres.
        </p>
        <textarea
          id="motivation"
          rows={5}
          value={values.motivation ?? ''}
          onChange={(e) => onChange('motivation', e.target.value)}
          placeholder="Quiero transformar mi emprendimiento porque..."
          required
          aria-required="true"
          aria-invalid={!!errors.motivation}
          aria-describedby={errors.motivation ? 'motivation-error' : 'motivation-count'}
          className={textareaClass}
          style={inputStyle}
        />
        <div className="flex justify-between items-center">
          {errors.motivation ? (
            <span
              id="motivation-error"
              role="alert"
              className="font-body text-xs"
              style={{ color: 'var(--color-cta)' }}
            >
              {errors.motivation}
            </span>
          ) : (
            <span
              id="motivation-count"
              className="font-body text-xs"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {charCount < 40 ? `${40 - charCount} caracteres más` : `${charCount}/1000`}
            </span>
          )}
        </div>
      </div>

      {/* Camera acknowledgment */}
      <div
        className="p-4 border"
        style={{
          borderColor: 'var(--color-line)',
          borderRadius: 'var(--radius-card)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <p className="font-body text-sm" style={{ color: 'var(--color-text-muted)' }}>
          <strong className="text-white">Requisito de cámara:</strong> Todas las clases en vivo
          requieren cámara encendida. Al enviar esta aplicación, confirmás que podés cumplir con
          este requisito.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="font-body font-bold uppercase tracking-widest px-6 py-4 text-sm transition-all"
          style={{
            background: 'transparent',
            color: 'var(--color-text-muted)',
            borderRadius: 'var(--radius-cta)',
            border: '1px solid var(--color-line)',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.5 : 1,
          }}
        >
          ← Volver
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
          className="flex-1 font-body font-bold uppercase tracking-widest px-8 py-4 text-sm transition-all"
          style={{
            background: 'var(--color-cta)',
            color: 'white',
            borderRadius: 'var(--radius-cta)',
            border: 'none',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Enviando...
            </span>
          ) : (
            'Enviar aplicación'
          )}
        </button>
      </div>
    </form>
  );
}
