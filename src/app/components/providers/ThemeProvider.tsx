'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"           // добавляет класс 'dark' на html
      defaultTheme="light"        // стартуем всегда со светлой (или 'dark', как тебе нужно)
      enableSystem={false}        // полностью отключаем подстройку под систему
      storageKey="rentera-theme"  // свой ключ в localStorage, чтобы исключить конфликты
      disableTransitionOnChange={true}   // чтобы не мигали переходы при смене темы
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
