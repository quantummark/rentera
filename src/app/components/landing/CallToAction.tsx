'use client';

import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CallToAction() {
  const { t } = useTranslation();

  return (
    <section className="bg-gray-900 bg-opacity-70 rounded-2xl py-12 text-center text-white">
      <div className="container mx-auto px-4">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">{t('cta.title', 'Готовы начать?')}</h2>
          <p className="text-lg md:text-2xl opacity-80">
            {t(
              'cta.subtitle',
              'Начни с Rentera — арендуй или сдавай с уверенностью!'
            )}
          </p>

          <Link
            href="/search"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-orange-600 font-semibold text-lg rounded-lg shadow-lg hover:bg-orange-50 transition-all"
          >
            {t('cta.buttonText', 'Начать поиск')} 
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
