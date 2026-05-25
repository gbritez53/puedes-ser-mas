import type { AdmissionInput, AdmissionFieldErrors } from '../../lib/validators/admission';

interface StepProfessionalProps {
  values: Partial<AdmissionInput>;
  errors: AdmissionFieldErrors;
  onChange: (field: keyof AdmissionInput, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const inputClass = `
  w-full bg-transparent border px-4 py-3 font-body text-sm text-white
  transition-colors focus:outline-none focus:border-[var(--color-cta)]
  placeholder:text-[var(--color-text-muted)]
`.trim();

const inputStyle = {
  borderColor: 'var(--color-line)',
  borderRadius: 'var(--radius-card)',
};

export function StepProfessional({
  values,
  errors,
  onChange,
  onNext,
  onBack,
}: StepProfessionalProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div>
        <p
          className="font-body text-xs uppercase tracking-widest mb-2"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Paso 2 de 3
        </p>
        <h3 className="font-heading text-3xl text-white uppercase">Tu actividad profesional</h3>
      </div>

      {/* Profession */}
      <div className="flex flex-col gap-1">
        <label htmlFor="profession" className="font-body text-sm font-bold text-white">
          ¿A qué te dedicás? <span style={{ color: 'var(--color-cta)' }}>*</span>
        </label>
        <input
          id="profession"
          type="text"
          autoComplete="organization-title"
          value={values.profession ?? ''}
          onChange={(e) => onChange('profession', e.target.value)}
          placeholder="Coach, consultor, emprendedor..."
          required
          aria-required="true"
          aria-invalid={!!errors.profession}
          aria-describedby={errors.profession ? 'profession-error' : undefined}
          className={inputClass}
          style={inputStyle}
        />
        {errors.profession && (
          <span
            id="profession-error"
            role="alert"
            className="font-body text-xs"
            style={{ color: 'var(--color-cta)' }}
          >
            {errors.profession}
          </span>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="font-body font-bold uppercase tracking-widest px-6 py-4 text-sm transition-all"
          style={{
            background: 'transparent',
            color: 'var(--color-text-muted)',
            borderRadius: 'var(--radius-cta)',
            border: '1px solid var(--color-line)',
            cursor: 'pointer',
          }}
        >
          ← Volver
        </button>
        <button
          type="submit"
          className="flex-1 font-body font-bold uppercase tracking-widest px-8 py-4 text-sm transition-all"
          style={{
            background: 'var(--color-cta)',
            color: 'white',
            borderRadius: 'var(--radius-cta)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Siguiente →
        </button>
      </div>
    </form>
  );
}
