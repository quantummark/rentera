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
        {t('search.hero.title', 'Мы собрали самые передовые технологии, чтобы вы смогли арендовать жильё совершенно по-новому')}
      </h1>
      <p className="text-base sm:text-lg text-white/80">
        {t(
          'search.hero.description',
          'Мы убрали всё лишнее, оставили только технологии и удобство. Так арендуют те, кто не привык к посредственности.'
        )}
      </p>
    </div>
  );
}
