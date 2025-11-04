'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

type Size = 'sm' | 'md' | 'lg';

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  /** Размер тумблера */
  size?: Size;
  /** Мягкое свечение при включении */
  glow?: boolean;
  /** Показывать простую иконку в бегунке */
  icon?: boolean;
}

const sizeMap: Record<Size, {
  root: string; thumb: string; translate: { on: string; off: string }
}> = {
  sm: {
    root: 'h-5 w-9',
    thumb: 'h-4 w-4',
    translate: { on: 'translate-x-4', off: 'translate-x-0' },
  },
  md: {
    root: 'h-6 w-11',
    thumb: 'h-5 w-5',
    translate: { on: 'translate-x-5', off: 'translate-x-0' },
  },
  lg: {
    root: 'h-7 w-14',
    thumb: 'h-6 w-6',
    translate: { on: 'translate-x-7', off: 'translate-x-0' },
  },
};

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, size = 'md', glow = true, icon = true, ...props }, ref) => {
  const s = sizeMap[size];

  return (
    <SwitchPrimitives.Root
      ref={ref}
      className={cn(
        // base
        'peer relative inline-flex shrink-0 cursor-pointer items-center rounded-full border',
        s.root,
        // трек: заметный в обеих темах
        'border-black/5 bg-zinc-200/70 dark:border-white/10 dark:bg-zinc-800/70',
        // стеклянный эффект
        'backdrop-blur supports-[backdrop-filter]:backdrop-blur',
        // state
        'data-[state=checked]:bg-primary/90 data-[state=checked]:border-primary/50',
        // glow (по желанию)
        glow && 'data-[state=checked]:shadow-[0_0_20px_-4px] data-[state=checked]:shadow-primary/60',
        // focus ring
        'outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        // disabled
        'disabled:cursor-not-allowed disabled:opacity-60',
        // motion friendly
        'motion-safe:transition-colors',
        className
      )}
      {...props}
    >
      {/* декоративный «блик» трека */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 rounded-full',
          'bg-gradient-to-b from-white/30 to-transparent dark:from-white/10',
          'opacity-60'
        )}
      />

      {/* бегунок */}
      <SwitchPrimitives.Thumb
  className={cn(
    'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform',
    'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
    'will-change-transform' // ⚡️ микро-фикс для рендеринга
  )}
>
        {/* мини-иконка для читаемости состояния */}
        {icon && (
          <span
            aria-hidden
            className={cn(
              'absolute inset-0 grid place-items-center text-[10px] leading-none',
              'text-zinc-500 dark:text-zinc-400',
              'data-[state=checked]:text-primary-foreground',
            )}
          >
            {/* Используем системные символы — лёгкие и нейтральные */}
            {/* Радикс не прокидывает state сюда, поэтому отрисуем обе и спрячем CSS-ом */}
            <span className="block data-[state=unchecked]:opacity-100 data-[state=checked]:opacity-0">
              •
            </span>
            <span className="absolute opacity-0 data-[state=checked]:opacity-100">
              ✓
            </span>
          </span>
        )}
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  );
});

Switch.displayName = SwitchPrimitives.Root.displayName;
export default Switch;
