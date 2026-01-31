'use client';

import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export default function SearchIntro() {
  const { t } = useTranslation('searchIntro');

  return (
    <div
      className={cn(
        'text-center text-white space-y-4 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'
      )}
    >
      <h1
        className={cn(
  'text-3xl sm:text-3xl font-bold tracking-tight leading-tight',
  'bg-gradient-to-r from-orange-300 via-amber-400 to-orange-400',
  'bg-clip-text text-transparent select-none'
)}
      >
        {t('hero.title')}
      </h1>
    </div>
  );
}