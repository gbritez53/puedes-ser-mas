import { useState, useRef, useCallback, type KeyboardEvent } from 'react';
import type { CurriculumModule } from '../../content/types';
import { ModulePanel } from './ModulePanel';

interface CurriculumAccordionProps {
  modules: readonly CurriculumModule[];
  defaultOpenId?: string;
}

export function CurriculumAccordion({ modules, defaultOpenId }: CurriculumAccordionProps) {
  const [openModuleId, setOpenModuleId] = useState<string | null>(defaultOpenId ?? null);
  const headerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleToggle = useCallback((moduleId: string) => {
    setOpenModuleId((prev) => (prev === moduleId ? null : moduleId));
  }, []);

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const moduleIds = modules.map((m) => m.id);
    const currentIndex = openModuleId ? moduleIds.indexOf(openModuleId) : -1;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % moduleIds.length;
      const nextId = moduleIds[nextIndex];
      if (nextId) {
        headerRefs.current[nextId]?.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + moduleIds.length) % moduleIds.length;
      const prevId = moduleIds[prevIndex];
      if (prevId) {
        headerRefs.current[prevId]?.focus();
      }
    }
  }

  return (
    <div onKeyDown={handleKeyDown} role="presentation" className="w-full">
      {modules.map((module) => {
        const panelId = `module-panel-${module.id}`;
        return (
          <ModulePanel
            key={module.id}
            module={module}
            isOpen={openModuleId === module.id}
            onToggle={() => handleToggle(module.id)}
            panelId={panelId}
          />
        );
      })}
    </div>
  );
}
