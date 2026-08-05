import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

type Variant = 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  default: 'bg-cta text-white hover:bg-cta-hover focus-visible:ring-cta/40',
  outline:
    'border border-line bg-transparent text-white hover:bg-surface focus-visible:ring-cta/40',
  ghost: 'bg-transparent text-white hover:bg-surface focus-visible:ring-cta/40',
  secondary:
    'bg-surface text-white border border-line/60 hover:bg-surface-lowest focus-visible:ring-cta/40',
  destructive: 'bg-cta text-white hover:bg-cta-hover focus-visible:ring-cta/40',
  link: 'bg-transparent text-cta underline-offset-4 hover:underline',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = 'Button';
