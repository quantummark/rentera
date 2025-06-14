'use client';

import { useState } from 'react';

interface LanguageSwitcherProps {
  language: 'ru' | 'en' | 'ua';
  onChange: (lang: 'ru' | 'en' | 'ua') => void;
}

export const LanguageSwitcher = ({ language, onChange }: LanguageSwitcherProps) => {
  const langs = [
    { code: 'ru', label: 'RU' },
    { code: 'en', label: 'EN' },
    { code: 'ua', label: 'UA' },
  ] as const;

  return (
    <div className="flex space-x-2">
      {langs.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => onChange(code)}
          className={`
            px-3 py-1 rounded-md text-sm font-semibold
            transition
            ${
              language === code
                ? 'bg-orange-400 text-white shadow-md'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }
            focus:outline-none
          `}
          aria-pressed={language === code}
          aria-label={`Выбрать язык ${label}`}
          type="button"
        >
          {label}
        </button>
      ))}
    </div>
  );
};
