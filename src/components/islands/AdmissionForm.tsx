import { useReducer, useCallback, type ChangeEvent } from 'react';
import { admissionSchema } from '../../lib/validators/admission';
import type { AdmissionInput, AdmissionFieldErrors } from '../../lib/validators/admission';
import { StepPersonal } from './StepPersonal';
import { StepProfessional } from './StepProfessional';
import { StepMotivation } from './StepMotivation';
import { StepConfirmation } from './StepConfirmation';

type Step = 'personal' | 'professional' | 'motivation' | 'confirmation';

interface FormState {
  step: Step;
  values: Partial<AdmissionInput>;
  errors: AdmissionFieldErrors;
  status: 'idle' | 'submitting' | 'success' | 'error';
  serverError?: string;
}

type FormAction =
  | { type: 'SET_FIELD'; field: keyof AdmissionInput; value: string }
  | { type: 'SET_ERRORS'; errors: AdmissionFieldErrors }
  | { type: 'NEXT_STEP'; nextStep: Step }
  | { type: 'PREV_STEP'; prevStep: Step }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; error: string }
  | { type: 'RETRY' };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: undefined },
      };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'NEXT_STEP':
      return { ...state, step: action.nextStep, errors: {} };
    case 'PREV_STEP':
      return { ...state, step: action.prevStep, errors: {} };
    case 'SUBMIT_START':
      return { ...state, status: 'submitting', errors: {} };
    case 'SUBMIT_SUCCESS':
      return { ...state, status: 'success', step: 'confirmation' };
    case 'SUBMIT_ERROR':
      return { ...state, status: 'error', step: 'confirmation', serverError: action.error };
    case 'RETRY':
      return { ...state, status: 'idle', step: 'motivation', serverError: undefined };
    default:
      return state;
  }
}

const initialState: FormState = {
  step: 'personal',
  values: { cohort: 'COHORTE 01 — MAYO 2026' },
  errors: {},
  status: 'idle',
};

// Validate fields for a given step
function validateStep(step: Step, values: Partial<AdmissionInput>): AdmissionFieldErrors {
  const errors: AdmissionFieldErrors = {};

  if (step === 'personal') {
    const nameResult = admissionSchema.shape.name.safeParse(values.name);
    if (!nameResult.success) errors.name = nameResult.error.issues[0]?.message ?? 'Inválido';

    const emailResult = admissionSchema.shape.email.safeParse(values.email);
    if (!emailResult.success) errors.email = emailResult.error.issues[0]?.message ?? 'Inválido';

    const phoneResult = admissionSchema.shape.phone.safeParse(values.phone);
    if (!phoneResult.success) errors.phone = phoneResult.error.issues[0]?.message ?? 'Inválido';
  }

  if (step === 'professional') {
    const profResult = admissionSchema.shape.profession.safeParse(values.profession);
    if (!profResult.success) errors.profession = profResult.error.issues[0]?.message ?? 'Inválido';
  }

  if (step === 'motivation') {
    const motResult = admissionSchema.shape.motivation.safeParse(values.motivation);
    if (!motResult.success) errors.motivation = motResult.error.issues[0]?.message ?? 'Inválido';
  }

  return errors;
}

export function AdmissionForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleChange = useCallback((field: keyof AdmissionInput, value: string) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  function handleNextFromPersonal() {
    const errors = validateStep('personal', state.values);
    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_ERRORS', errors });
      return;
    }
    dispatch({ type: 'NEXT_STEP', nextStep: 'professional' });
  }

  function handleNextFromProfessional() {
    const errors = validateStep('professional', state.values);
    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_ERRORS', errors });
      return;
    }
    dispatch({ type: 'NEXT_STEP', nextStep: 'motivation' });
  }

  async function handleSubmit() {
    const errors = validateStep('motivation', state.values);
    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_ERRORS', errors });
      return;
    }

    dispatch({ type: 'SUBMIT_START' });

    const payload: AdmissionInput = {
      name: state.values.name ?? '',
      email: state.values.email ?? '',
      phone: state.values.phone ?? '',
      profession: state.values.profession ?? '',
      motivation: state.values.motivation ?? '',
      cohort: state.values.cohort ?? 'COHORTE 01 — MAYO 2026',
      honeypot: state.values.honeypot ?? '',
    };

    try {
      const res = await fetch('/api/admission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        dispatch({ type: 'SUBMIT_SUCCESS' });
      } else if (res.status === 429) {
        dispatch({
          type: 'SUBMIT_ERROR',
          error: 'Demasiadas aplicaciones desde tu IP. Intentá más tarde.',
        });
      } else if (res.status === 422) {
        const body = (await res.json().catch(() => null)) as {
          ok: false;
          issues?: Array<{ path: string[]; message: string }>;
        } | null;
        const firstIssue = body?.issues?.[0]?.message;
        dispatch({
          type: 'SUBMIT_ERROR',
          error: firstIssue ?? 'Datos inválidos. Revisá el formulario.',
        });
      } else {
        dispatch({
          type: 'SUBMIT_ERROR',
          error: 'Error del servidor. Por favor, intentá de nuevo.',
        });
      }
    } catch {
      dispatch({
        type: 'SUBMIT_ERROR',
        error: 'Sin conexión. Verificá tu internet e intentá de nuevo.',
      });
    }
  }

  return (
    <div
      className="max-w-xl mx-auto p-8 border"
      style={{
        borderColor: 'var(--color-line)',
        borderRadius: 'var(--radius-card)',
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      {/* Progress indicator */}
      {state.step !== 'confirmation' && (
        <div className="flex gap-2 mb-8" aria-label="Progreso del formulario" role="progressbar">
          {(['personal', 'professional', 'motivation'] as const).map((step, index) => {
            const stepOrder = { personal: 0, professional: 1, motivation: 2 };
            const currentOrder = stepOrder[state.step as keyof typeof stepOrder] ?? 0;
            const isCompleted = index < currentOrder;
            const isCurrent = step === state.step;
            return (
              <div
                key={step}
                className="flex-1 h-1 transition-all duration-300"
                style={{
                  background: isCompleted || isCurrent ? 'var(--color-cta)' : 'var(--color-line)',
                  opacity: isCurrent ? 1 : isCompleted ? 0.6 : 0.3,
                  borderRadius: '1px',
                }}
                aria-hidden="true"
              />
            );
          })}
        </div>
      )}

      {/* Honeypot — hidden from real users, filled by bots */}
      <input
        type="text"
        name="website"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
          width: '1px',
          height: '1px',
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('honeypot', e.target.value)}
      />

      {/* Step rendering */}
      {state.step === 'personal' && (
        <StepPersonal
          values={state.values}
          errors={state.errors}
          onChange={handleChange}
          onNext={handleNextFromPersonal}
        />
      )}

      {state.step === 'professional' && (
        <StepProfessional
          values={state.values}
          errors={state.errors}
          onChange={handleChange}
          onNext={handleNextFromProfessional}
          onBack={() => dispatch({ type: 'PREV_STEP', prevStep: 'personal' })}
        />
      )}

      {state.step === 'motivation' && (
        <StepMotivation
          values={state.values}
          errors={state.errors}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onBack={() => dispatch({ type: 'PREV_STEP', prevStep: 'professional' })}
          isSubmitting={state.status === 'submitting'}
        />
      )}

      {state.step === 'confirmation' && (
        <StepConfirmation
          status={state.status === 'success' ? 'success' : 'error'}
          serverError={state.serverError}
          onRetry={state.status === 'error' ? () => dispatch({ type: 'RETRY' }) : undefined}
          name={state.values.name}
        />
      )}
    </div>
  );
}
