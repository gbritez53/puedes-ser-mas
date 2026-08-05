import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'flex min-h-[80px] w-full rounded-lg border border-line bg-surface-lowest px-3 py-2 text-sm text-white placeholder:text-text-variant/70 focus:border-cta focus:outline-none focus:ring-2 focus:ring-cta/20 disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';
