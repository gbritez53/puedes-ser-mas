import { useCallback, useState, type ChangeEvent, type FormEvent } from 'react';
import { admissionSchema } from '../../lib/validators/admission';
import type { AdmissionFieldErrors } from '../../lib/validators/admission';

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface FormValues {
  name: string;
  email: string;
  phone: string;
  diplomado: string;
  honeypot: string;
}

const initialValues: FormValues = {
  name: '',
  email: '',
  phone: '',
  diplomado: '',
  honeypot: '',
};

const inputClass =
  'w-full bg-black border border-white/40 rounded px-4 py-3 text-white font-body focus:border-cta focus:ring-1 focus:ring-cta/50 focus:outline-none transition-all';

const labelClass = 'font-body text-sm font-bold uppercase tracking-wider text-white';

export function AdmissionForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<AdmissionFieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState<string>();

  const handleChange = useCallback(
    (field: keyof FormValues) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    [],
  );

  function validateForm(form: FormValues): AdmissionFieldErrors {
    const result = admissionSchema.safeParse(form);
    if (result.success) return {};

    const fieldErrors: AdmissionFieldErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof AdmissionFieldErrors;
      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return fieldErrors;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fieldErrors = validateForm(values);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setStatus('submitting');
    setServerError(undefined);

    const payload = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      diplomado: values.diplomado,
      honeypot: values.honeypot,
    };

    try {
      const res = await fetch('/api/admission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus('success');
      } else if (res.status === 429) {
        setStatus('error');
        setServerError('Demasiadas aplicaciones desde tu IP. Intentá más tarde.');
      } else if (res.status === 422) {
        const body = (await res.json().catch(() => null)) as {
          issues?: Array<{ path: string[]; message: string }>;
        } | null;
        setStatus('error');
        setServerError(body?.issues?.[0]?.message ?? 'Datos inválidos. Revisá el formulario.');
      } else {
        setStatus('error');
        setServerError('Error del servidor. Por favor, intentá de nuevo.');
      }
    } catch {
      setStatus('error');
      setServerError('Sin conexión. Verificá tu internet e intentá de nuevo.');
    }
  }

  function handleRetry() {
    setStatus('idle');
    setServerError(undefined);
    setErrors({});
  }

  if (status === 'success') {
    return (
      <div
        className="flex flex-col items-center gap-4 text-center"
        role="status"
        aria-live="polite"
      >
        <span className="material-symbols-outlined text-cta text-5xl">check_circle</span>
        <h3 className="font-heading text-3xl uppercase text-white">
          ¡Gracias, {values.name?.split(' ')[0]}!
        </h3>
        <p className="font-body text-[#e4beba]">
          Tu solicitud fue registrada. Te contactaremos con la información detallada del diplomado.
        </p>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
      {/* Honeypot — hidden from real users, filled by bots */}
      <input
        type="text"
        name="website"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        onChange={handleChange('honeypot')}
        style={{ position: 'absolute', opacity: 0, width: '1px', height: '1px' }}
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="name" className={labelClass}>
          Nombre Completo
        </label>
        <input
          id="name"
          type="text"
          placeholder="Tu nombre"
          value={values.name}
          onChange={handleChange('name')}
          className={inputClass}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="font-body text-sm text-cta" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className={labelClass}>
          Correo Electrónico
        </label>
        <input
          id="email"
          type="email"
          placeholder="tu@email.com"
          value={values.email}
          onChange={handleChange('email')}
          className={inputClass}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="font-body text-sm text-cta" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="phone" className={labelClass}>
          WhatsApp
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="+123456789"
          value={values.phone}
          onChange={handleChange('phone')}
          className={inputClass}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
        />
        {errors.phone && (
          <p id="phone-error" className="font-body text-sm text-cta" role="alert">
            {errors.phone}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="diplomado" className={labelClass}>
          Elige tu camino
        </label>
        <select
          id="diplomado"
          value={values.diplomado}
          onChange={handleChange('diplomado')}
          className={inputClass}
          aria-invalid={!!errors.diplomado}
          aria-describedby={errors.diplomado ? 'diplomado-error' : undefined}
        >
          <option value="" disabled>
            Selecciona un diplomado...
          </option>
          <option value="liderazgo">Coaching y Liderazgo</option>
          <option value="comunicacion">Comunicación y Oratoria</option>
        </select>
        {errors.diplomado && (
          <p id="diplomado-error" className="font-body text-sm text-cta" role="alert">
            {errors.diplomado}
          </p>
        )}
      </div>

      {status === 'error' && serverError && (
        <div
          className="font-body text-sm text-cta border border-cta/40 rounded p-4 flex flex-col gap-3"
          role="alert"
        >
          <span>{serverError}</span>
          <button
            type="button"
            onClick={handleRetry}
            className="self-start font-body text-sm font-bold uppercase tracking-wider underline underline-offset-2"
          >
            Reintentar
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="bg-cta text-white font-heading text-2xl py-4 rounded-lg mt-4 w-full uppercase shadow-[0_0_20px_rgba(211,47,47,0.4)] hover:bg-cta-hover hover:shadow-[0_0_30px_rgba(211,47,47,0.6)] transition-all disabled:opacity-60"
      >
        {status === 'submitting' ? 'ENVIANDO...' : '¡QUIERO SER MÁS!'}
      </button>
    </form>
  );
}
