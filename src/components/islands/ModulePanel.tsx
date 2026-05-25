import { type KeyboardEvent } from 'react';
import type { CurriculumModule } from '../../content/types';
import { ClassItem } from './ClassItem';

interface ModulePanelProps {
  module: CurriculumModule;
  isOpen: boolean;
  onToggle: () => void;
  panelId: string;
}

export function ModulePanel({ module, isOpen, onToggle, panelId }: ModulePanelProps) {
  const headerId = `module-header-${module.id}`;

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  }

  return (
    <div className="border-b" style={{ borderColor: 'var(--color-line)' }}>
      {/* Module header — trigger */}
      <button
        id={headerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        className="w-full flex items-center justify-between gap-4 py-6 text-left transition-colors cursor-pointer"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'inherit',
        }}
      >
        <div className="flex items-center gap-6">
          <span
            className="font-heading text-3xl leading-none flex-shrink-0"
            style={{ color: 'var(--color-cta)', opacity: 0.4 }}
            aria-hidden="true"
          >
            {String(module.number).padStart(2, '0')}
          </span>
          <div className="text-left">
            <p className="font-heading text-2xl text-white uppercase leading-tight">
              {module.title}
            </p>
            <p className="font-body text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
              {module.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span
            className="font-body text-xs uppercase tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {module.classes.length} clases
          </span>
          {/* Chevron */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="transition-transform duration-300"
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              color: 'var(--color-cta)',
            }}
            aria-hidden="true"
          >
            <path
              d="M5 7.5l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {/* Collapsible class list */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        hidden={!isOpen}
        style={{
          overflow: 'hidden',
          transition: 'all 300ms var(--ease-out)',
        }}
      >
        <ul className="pb-6" aria-label={`Clases del módulo ${module.number}: ${module.title}`}>
          {module.classes.map((cls) => (
            <ClassItem key={cls.id} cls={cls} />
          ))}
        </ul>
      </div>
    </div>
  );
}
