'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

type InputVariant = 'default' | 'pill';

interface InputProps extends React.ComponentProps<'input'> {
  variant?: InputVariant;
}

function Input({ className, type, variant = 'default', ...props }: InputProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const base =
    'flex w-full min-w-0 bg-transparent outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50';

  const defaultStyles = cn(
    'h-9 rounded-md border px-3 py-1',
    'text-base md:text-sm',
    'shadow-xs transition-[color,box-shadow,border-color,background-color]',
    isDark
      ? 'border-white/15 bg-white/5 text-white placeholder:text-white/45'
      : 'border-slate-200 bg-white/70 text-slate-900 placeholder:text-slate-500',
    'focus-visible:ring-2 focus-visible:ring-orange-400/25 focus-visible:border-orange-300/40'
  );

  const pillStyles = cn(
    'h-12 rounded-full border px-5',
    'text-base md:text-base',
    'backdrop-blur-md',
    'shadow-sm transition-[color,box-shadow,border-color,background-color]',
    isDark
      ? 'border-white/15 bg-white/8 text-white placeholder:text-white/45 hover:bg-white/10'
      : 'border-slate-200 bg-white/70 text-slate-900 placeholder:text-slate-500 hover:bg-white',
    'focus-visible:ring-2 focus-visible:ring-orange-400/30 focus-visible:border-orange-300/45'
  );

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(base, variant === 'pill' ? pillStyles : defaultStyles, className)}
      {...props}
    />
  );
}

export { Input };
