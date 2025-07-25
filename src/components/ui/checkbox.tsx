'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const checkboxVariants = cva(
  'peer relative h-5 w-5 shrink-0 rounded border border-muted bg-transparent ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      checked: {
        true: 'bg-primary text-primary-foreground',
        false: '',
      },
    },
  }
);

const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <label className="inline-flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        ref={ref}
        className={cn(
          checkboxVariants({ checked: props.checked }),
          'hidden peer',
          className
        )}
        {...props}
      />
      <div className="flex h-5 w-5 items-center justify-center rounded border border-input bg-background transition-all peer-checked:bg-orange-500 peer-checked:text-white">
        <Check className="h-4 w-4 opacity-0 peer-checked:opacity-100" />
      </div>
    </label>
  )
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
