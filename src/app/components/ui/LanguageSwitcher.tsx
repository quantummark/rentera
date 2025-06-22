'use client';

import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

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
          onClick={() => i18n.changeLanguage(code)}
          className={`px-3 py-1 rounded-md text-sm font-semibold transition ${
            i18n.language === code
              ? 'bg-orange-400 text-white shadow-md'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
          aria-pressed={i18n.language === code}
          aria-label={`Выбрать язык ${label}`}
          type="button"
        >
          {label}
        </button>
      ))}
    </div>
  );
};
