import { createContext, useContext, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface RadioGroupContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  name: string;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  onValueChange?: (value: string) => void;
}

export function RadioGroup({ value, onValueChange, className, ...props }: RadioGroupProps) {
  const name = useId();
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange, name }}>
      <div role="radiogroup" className={cn('grid gap-2', className)} {...props} />
    </RadioGroupContext.Provider>
  );
}

interface RadioGroupItemProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'type'
> {
  value: string;
}

export function RadioGroupItem({ value, className, id, ...props }: RadioGroupItemProps) {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) throw new Error('RadioGroupItem must be used inside RadioGroup');
  return (
    <input
      type="radio"
      id={id ?? `${ctx.name}-${value}`}
      name={ctx.name}
      value={value}
      checked={ctx.value === value}
      onChange={() => ctx.onValueChange?.(value)}
      className={cn('h-4 w-4 shrink-0 accent-cta', className)}
      {...props}
    />
  );
}

interface RadioItemLabelProps {
  htmlFor: string;
  className?: string;
  children: ReactNode;
}

export function RadioItemLabel({ htmlFor, className, children }: RadioItemLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('cursor-pointer w-full text-sm text-text-muted', className)}
    >
      {children}
    </label>
  );
}
