'use client';

import React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, value, defaultValue, ...props }, ref) => {
  const values = value ?? defaultValue ?? [];
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const trackBase = isDark
    ? 'bg-white/12 border-white/15'
    : 'bg-slate-200/70 border-slate-200';

  const rangeBase = isDark
    ? 'bg-gradient-to-r from-orange-400 to-orange-500'
    : 'bg-gradient-to-r from-orange-500 to-orange-600';

  const thumbBase = isDark
    ? 'border-orange-300/60 bg-white shadow-[0_6px_18px_rgba(0,0,0,0.35)]'
    : 'border-orange-400/60 bg-white shadow-[0_10px_22px_rgba(0,0,0,0.15)]';

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex w-full touch-none select-none items-center h-7',
        className
      )}
      value={value}
      defaultValue={defaultValue}
      {...props}
    >
      {/* Track */}
      <SliderPrimitive.Track
        className={cn(
          'relative w-full grow overflow-hidden rounded-full border',
          'h-2.5',
          'backdrop-blur-md',
          trackBase
        )}
      >
        {/* Range */}
        <SliderPrimitive.Range
          className={cn(
            'absolute h-full rounded-full',
            rangeBase,
            // мягкий glow, аккуратно
            isDark ? 'shadow-[0_0_18px_rgba(255,140,60,0.25)]' : 'shadow-[0_0_14px_rgba(255,140,60,0.18)]'
          )}
        />
      </SliderPrimitive.Track>

      {/* Thumb(s) */}
      {values.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className={cn(
            'group relative block h-5 w-5 rounded-full border-2',
            'transition-transform duration-150',
            'hover:scale-110 active:scale-105',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/35',
            'disabled:pointer-events-none disabled:opacity-50',
            thumbBase
          )}
        >
          {/* inner dot (дорогой эффект) */}
          <span
            aria-hidden="true"
            className={cn(
              'absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full',
              isDark ? 'bg-orange-400/90' : 'bg-orange-500/90'
            )}
          />
        </SliderPrimitive.Thumb>
      ))}
    </SliderPrimitive.Root>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
