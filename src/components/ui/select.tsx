import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  registerOption: (option: SelectOption) => void;
  unregisterOption: (value: string) => void;
  placeholder: string;
  setPlaceholder: (placeholder: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextValue | null>(null);

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
}

export function Select({ value, onValueChange, children }: SelectProps) {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [placeholder, setPlaceholder] = useState('');
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const registerOption = (option: SelectOption) => {
    setOptions((prev) => {
      if (prev.some((o) => o.value === option.value)) return prev;
      return [...prev, option];
    });
  };

  const unregisterOption = (optionValue: string) => {
    setOptions((prev) => prev.filter((o) => o.value !== optionValue));
  };

  return (
    <div ref={rootRef} className="relative">
      <SelectContext.Provider
        value={{
          value,
          onValueChange,
          options,
          registerOption,
          unregisterOption,
          placeholder,
          setPlaceholder,
          open,
          setOpen,
        }}
      >
        {children}
      </SelectContext.Provider>
    </div>
  );
}

interface SelectTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  id?: string;
}

export function SelectTrigger({ id, className, children, ...props }: SelectTriggerProps) {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error('SelectTrigger must be used inside Select');
  const selected = ctx.options.find((o) => o.value === ctx.value);
  const selectedLabel = selected ? selected.label : ctx.placeholder;

  return (
    <button
      type="button"
      id={id}
      aria-haspopup="listbox"
      aria-expanded={ctx.open}
      onClick={() => ctx.setOpen(!ctx.open)}
      className={cn(
        'flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-line bg-surface-lowest px-3 py-2 text-sm text-white focus:border-cta focus:outline-none focus:ring-2 focus:ring-cta/20 disabled:cursor-not-allowed disabled:opacity-50',
        !selected && !ctx.value && 'text-text-variant/70',
        className,
      )}
      {...props}
    >
      <span className="truncate text-left">{selectedLabel}</span>
      <ChevronDown
        className={cn(
          'h-4 w-4 shrink-0 text-text-muted transition-transform',
          ctx.open && 'rotate-180',
        )}
        aria-hidden="true"
      />
      {children}
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error('SelectValue must be used inside Select');
  useEffect(() => {
    if (placeholder !== undefined) ctx.setPlaceholder(placeholder);
  }, [placeholder, ctx]);
  return null;
}

export function SelectContent({ children }: { children: ReactNode }) {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error('SelectContent must be used inside Select');

  return (
    <>
      {children}
      {ctx.open && (
        <ul
          role="listbox"
          className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-lg border border-line bg-surface-lowest py-1 shadow-xl"
        >
          {ctx.options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={ctx.value === option.value}
                onClick={() => {
                  ctx.onValueChange?.(option.value);
                  ctx.setOpen(false);
                }}
                className={cn(
                  'block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-surface',
                  ctx.value === option.value
                    ? 'bg-surface font-semibold text-white'
                    : 'text-text-muted',
                )}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

interface SelectItemProps {
  value: string;
  children: ReactNode;
}

export function SelectItem({ value, children }: SelectItemProps) {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error('SelectItem must be used inside Select');

  useEffect(() => {
    const label = typeof children === 'string' ? children : String(children ?? '');
    ctx.registerOption({ value, label });
    return () => ctx.unregisterOption(value);
  }, [value, children, ctx]);

  return null;
}
