'use client';

import React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, value, defaultValue, ...props }, ref) => {
  // массив точек: либо контролируемое значение, либо defaultValue, либо пустой массив
  const values = value ?? defaultValue ?? [];

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex w-full touch-none select-none items-center h-6',
        className
      )}
      value={value}
      defaultValue={defaultValue}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted dark:bg-slate-700">
        <SliderPrimitive.Range className="absolute h-full bg-orange-500 rounded-full" />
      </SliderPrimitive.Track>

      {values.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className={
            'block h-5 w-5 rounded-full border border-white bg-orange-500 shadow ' +
            'transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 ' +
            'focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
          }
        />
      ))}
    </SliderPrimitive.Root>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };