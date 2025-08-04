'use client';

import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export default function SearchIntro() {
  const { t } = useTranslation();

  return (
    <div className={cn(
      'text-center text-white space-y-4 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'
    )}>
      <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
        {t('search.hero.title', 'Для подбора подходящего жилья заполните, пожалуйста, форму ниже. Укажите ваши предпочтения, и мы найдём для вас оптимальные варианты.')}
      </h1>
    </div>
  );
}
