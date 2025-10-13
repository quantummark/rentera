'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Управление checked-состоянием извне.
   * Когда true — фон становится оранжевым и рендерится галочка.
   */
  checked?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked = false, children, ...props }, ref) => {
    return (
      <label
        className={cn(
          'inline-flex items-center space-x-2 cursor-pointer',
          className
        )}
      >
        {/* input остаётся в DOM, но скрыт визуально */}
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          className="sr-only"
          {...props}
        />

        {/* квадрат-обёртка */}
        <div
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded border transition-colors',
            checked
              ? 'bg-orange-500 border-orange-500'
              : 'bg-transparent border-gray-300'
          )}
        >
          {/* рендерим галочку только когда checked === true */}
          {checked && <Check className="h-4 w-4 text-white" />}
        </div>

        {children && <span>{children}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
