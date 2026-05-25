import type { AdmissionInput, AdmissionFieldErrors } from '../../lib/validators/admission';

interface StepPersonalProps {
  values: Partial<AdmissionInput>;
  errors: AdmissionFieldErrors;
  onChange: (field: keyof AdmissionInput, value: string) => void;
  onNext: () => void;
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

export function StepPersonal({ values, errors, onChange, onNext }: StepPersonalProps) {
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
          Paso 1 de 3
        </p>
        <h3 className="font-heading text-3xl text-white uppercase">Tus datos personales</h3>
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="font-body text-sm font-bold text-white">
          Nombre completo <span style={{ color: 'var(--color-cta)' }}>*</span>
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          value={values.name ?? ''}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Tu nombre y apellido"
          required
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className={inputClass}
          style={inputStyle}
        />
        {errors.name && (
          <span
            id="name-error"
            role="alert"
            className="font-body text-xs"
            style={{ color: 'var(--color-cta)' }}
          >
            {errors.name}
          </span>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="font-body text-sm font-bold text-white">
          Email <span style={{ color: 'var(--color-cta)' }}>*</span>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={values.email ?? ''}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="tu@email.com"
          required
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={inputClass}
          style={inputStyle}
        />
        {errors.email && (
          <span
            id="email-error"
            role="alert"
            className="font-body text-xs"
            style={{ color: 'var(--color-cta)' }}
          >
            {errors.email}
          </span>
        )}
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1">
        <label htmlFor="phone" className="font-body text-sm font-bold text-white">
          Teléfono <span style={{ color: 'var(--color-cta)' }}>*</span>
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone ?? ''}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="+54 9 11 5555-1234"
          required
          aria-required="true"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
          className={inputClass}
          style={inputStyle}
        />
        {errors.phone && (
          <span
            id="phone-error"
            role="alert"
            className="font-body text-xs"
            style={{ color: 'var(--color-cta)' }}
          >
            {errors.phone}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="font-body font-bold uppercase tracking-widest px-8 py-4 text-sm transition-all"
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
    </form>
  );
}
