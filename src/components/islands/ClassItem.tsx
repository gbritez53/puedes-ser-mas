import type { CurriculumClass } from '../../content/types';

interface ClassItemProps {
  cls: CurriculumClass;
}

export function ClassItem({ cls }: ClassItemProps) {
  return (
    <li
      className="flex gap-4 py-4 border-b last:border-b-0"
      style={{ borderColor: 'var(--color-line)' }}
    >
      <div
        className="font-heading text-2xl leading-none flex-shrink-0 w-10 text-right pt-0.5"
        style={{ color: 'var(--color-cta)', opacity: 0.5 }}
        aria-hidden="true"
      >
        {String(cls.number).padStart(2, '0')}
      </div>
      <div className="flex-1">
        <h4 className="font-body font-bold text-sm text-white mb-1">{cls.title}</h4>
        <p
          className="font-body text-xs leading-relaxed"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {cls.summary}
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {cls.competencies.map((competency) => (
            <span
              key={competency}
              className="font-body text-xs px-2 py-0.5 border"
              style={{
                borderColor: 'var(--color-line)',
                color: 'var(--color-text-muted)',
                borderRadius: '2px',
              }}
            >
              {competency}
            </span>
          ))}
        </div>
      </div>
      <div
        className="font-body text-xs flex-shrink-0 pt-0.5"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {cls.duration}
      </div>
    </li>
  );
}
