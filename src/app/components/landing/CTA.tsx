'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export default function CTA() {
  const { t } = useTranslation();

  return (
    <section className="bg-orange-500 dark:bg-orange-700 py-12 md:py-16 text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6">
          {t('cta.title', 'Готовы начать?')}
        </h2>
        <p className="text-lg md:text-xl text-white opacity-80 mb-8">
          {t('cta.subtitle', 'Выберите один из путей и приступайте к аренде или сдаче жилья с Rentera.')}
        </p>
        <div className="space-x-4">
          <a href="/search">
            <Button
              className="px-8 py-4 text-lg font-semibold bg-white text-orange-500 rounded-full shadow-lg hover:bg-orange-100 transition-all"
            >
              {t('cta.ctaSearch', 'Найти жилье')}
            </Button>
          </a>
          <a href="/sell">
            <Button
              className="px-8 py-4 text-lg font-semibold bg-transparent border-2 border-white text-white rounded-full shadow-lg hover:bg-white hover:text-orange-500 transition-all"
            >
              {t('cta.ctaSell', 'Сдать жилье')}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
