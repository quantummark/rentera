'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DropdownMenu from '@/components/ui/DropdownMenu';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Lng = 'uk' | 'en' | 'ru';

const LANGS: ReadonlyArray<{ code: Lng; label: string }> = [
  // P.S. Метка "UK" может путать с United Kingdom; чаще ставят "UA" или "UKR".
  { code: 'uk', label: 'UA' },
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
] as const;

function norm(lng?: string): Lng {
  const base = (lng || 'uk').split('-')[0] as Lng;
  return (['uk', 'en', 'ru'] as const).includes(base) ? base : 'uk';
}

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation(); // t держит подписку на i18n-ивенты
  const [current, setCurrent] = useState<Lng>(norm(i18n.language));

  // Обновляем состояние при смене языка (на 100% надёжно)
  useEffect(() => {
    const handler = (lng: string) => setCurrent(norm(lng));
    i18n.on('languageChanged', handler);
    return () => i18n.off('languageChanged', handler);
  }, [i18n]);

  // Текущая кнопка
  const currentLabel = useMemo(
    () => LANGS.find(l => l.code === current)?.label ?? LANGS[0].label,
    [current]
  );

  const change = async (code: Lng) => {
    if (code === current) return;
    await i18n.changeLanguage(code);

    // Синхронизируем с детектором: cookie 'i18next'
    document.cookie = [
      `i18next=${code}`,
      'path=/',
      'max-age=' + 60 * 60 * 24 * 365, // 1 год
      'samesite=lax',
      // добавь 'secure' на проде с HTTPS:
      // 'secure'
    ].join('; ');

    // Чтоб <html lang="..."> был корректным для SEO/скринридеров
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', code);
    }
  };

  return (
    <DropdownMenu
      trigger={
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Globe className="w-4 h-4" aria-hidden="true" />
          <span aria-live="polite">{currentLabel}</span>
        </Button>
      }
    >
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => change(code)}
          role="menuitem"
          className={`w-full text-left rounded-md px-4 py-2 text-sm hover:ring-1 hover:ring-ring hover:ring-offset-1 hover:ring-offset-background ${
            current === code ? 'font-semibold text-primary text-orange-500' : 'text-foreground'
          }`}
        >
          {label}
        </button>
      ))}
    </DropdownMenu>
  );
};