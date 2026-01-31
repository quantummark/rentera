'use client';

import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface CustomToggleProps {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  children: React.ReactNode;
  className?: string;

  /** если нужно сделать на всю ширину на мобилке */
  fullWidth?: boolean;
}

export function CustomToggle({
  pressed,
  onPressedChange,
  children,
  className,
  fullWidth = false,
}: CustomToggleProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const base = isDark
    ? 'bg-white/8 border-white/15 text-white hover:bg-white/10'
    : 'bg-white/70 border-slate-200 text-slate-900 hover:bg-white';

  const active = isDark
    ? 'bg-orange-500/16 border-orange-300/35 ring-1 ring-orange-400/25'
    : 'bg-orange-50 border-orange-200 ring-1 ring-orange-400/15';

  return (
    <TogglePrimitive.Root
      pressed={pressed}
      onPressedChange={onPressedChange}
      className={cn(
        fullWidth ? 'w-full' : 'w-auto',
        'inline-flex items-center justify-between gap-3',
        'px-4 py-2.5',
        'rounded-full border',
        'text-sm font-medium',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-orange-400/25',
        base,
        pressed && active,
        className
      )}
    >
      {/* Label */}
      <span className="truncate">{children}</span>

      {/* Mini switch (визуальный индикатор) */}
      <span
        aria-hidden="true"
        className={cn(
          'relative shrink-0',
          'w-9 h-5 rounded-full border',
          'transition-colors duration-200',
          pressed
            ? 'bg-orange-500 border-orange-500'
            : isDark
              ? 'bg-white/10 border-white/15'
              : 'bg-slate-100 border-slate-200'
        )}
      >
        <span
  className={cn(
    'absolute left-0.5 top-1/2 -translate-y-1/2',
    'w-4 h-4 rounded-full bg-white shadow-sm',
    'transition-transform duration-200',
    pressed ? 'translate-x-4' : 'translate-x-0'
  )}
/>
      </span>
    </TogglePrimitive.Root>
  );
}
