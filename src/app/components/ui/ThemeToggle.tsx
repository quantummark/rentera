'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="p-2 rounded border border-gray-300 dark:border-gray-600"
    >
      {theme === 'light' ? '🌞 Light' : '🌜 Dark'}
    </button>
  );
}
// This component toggles between light and dark themes using the next-themes package.