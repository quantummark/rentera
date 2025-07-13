'use client';

import { useTranslation } from 'react-i18next';
import DropdownMenu from '@/components/ui/DropdownMenu';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const langs = [
    { code: 'ua', label: 'UA' },
    { code: 'en', label: 'EN' },
    { code: 'ru', label: 'RU' },
  ] as const;

  const current = langs.find(l => l.code === i18n.language) || langs[0];

  return (
    <DropdownMenu
      trigger={
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          {current.label}
        </Button>
      }
    >
      {langs.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => i18n.changeLanguage(code)}
          className={`w-full text-left px-4 py-2 text-sm hover:bg-accent rounded-md ${
            i18n.language === code ? 'font-semibold text-primary' : 'text-foreground'
          }`}
        >
          {label}
        </button>
      ))}
    </DropdownMenu>
  );
};
