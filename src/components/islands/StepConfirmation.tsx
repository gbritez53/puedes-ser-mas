interface StepConfirmationProps {
  status: 'success' | 'error';
  serverError?: string;
  onRetry?: () => void;
  name?: string;
}

export function StepConfirmation({ status, serverError, onRetry, name }: StepConfirmationProps) {
  if (status === 'success') {
    return (
      <div className="flex flex-col items-center text-center gap-8 py-8">
        {/* Success icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(196,23,24,0.15)', border: '2px solid var(--color-cta)' }}
          aria-hidden="true"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M6 16l8 8 12-14"
              stroke="var(--color-cta)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div>
          <h3 className="font-heading text-4xl text-white uppercase mb-4">
            {name ? `¡Gracias, ${name.split(' ')[0]}!` : '¡Aplicación enviada!'}
          </h3>
          <p className="font-body max-w-md" style={{ color: 'var(--color-text-muted)' }}>
            Recibimos tu aplicación al Diplomado Coach Emprendedor. Revisaremos tu información y te
            contactaremos en las próximas 48 horas hábiles.
          </p>
        </div>

        <div
          className="p-6 border w-full max-w-sm"
          style={{
            borderColor: 'var(--color-line)',
            borderRadius: 'var(--radius-card)',
            background: 'rgba(255,255,255,0.02)',
          }}
        >
          <p className="font-body text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Mientras tanto, podés seguirnos en nuestras redes o guardar esta página por si tenés
            dudas.
          </p>
        </div>

        <p className="font-heading text-2xl uppercase" style={{ color: 'var(--color-cta)' }}>
          PUEDES SER MÁS.
        </p>
      </div>
    );
  }

  // Error state
  return (
    <div className="flex flex-col items-center text-center gap-6 py-8">
      {/* Error icon */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(196,23,24,0.1)', border: '2px solid var(--color-cta)' }}
        aria-hidden="true"
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path
            d="M16 10v8M16 22v1"
            stroke="var(--color-cta)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div>
        <h3 className="font-heading text-3xl text-white uppercase mb-4">Algo salió mal</h3>
        <p className="font-body max-w-md" style={{ color: 'var(--color-text-muted)' }}>
          {serverError ?? 'Hubo un error al enviar tu aplicación. Por favor, intentá de nuevo.'}
        </p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="font-body font-bold uppercase tracking-widest px-8 py-4 text-sm transition-all"
          style={{
            background: 'var(--color-cta)',
            color: 'white',
            borderRadius: 'var(--radius-cta)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
