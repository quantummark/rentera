'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function CallToAction() {
  const { t } = useTranslation('cta');

  return (
    <section
      className="relative rounded-2xl py-16 text-center text-white overflow-hidden"
      style={{
        backgroundColor: '#081338',
        backgroundImage: `
          radial-gradient(circle at 20px 20px, rgba(255,255,255,0.1) 20%, transparent 21%),
          radial-gradient(circle at 60px 60px, rgba(255,255,255,0.1) 20%, transparent 21%)
        `,
        backgroundSize: '80px 80px',
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold drop-shadow-lg">
            {t('cta:title')}
          </h2>
          <p className="text-lg md:text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed">
            {t(
              'cta:subtitle'
            )}
          </p>

          <div className="mt-8 flex flex-col gap-4 md:flex-row justify-center">
            {/* Кнопка "Начать поиск" */}
            <Link
              href="/search"
              className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-lg hover:scale-105 hover:shadow-2xl transition-transform inline-flex items-center justify-center w-full md:w-auto"
            >
               {t('cta:startSearch')}
            </Link>

            {/* Кнопка "Сдать жильё" */}
            <Link
              href="/login"
              className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 text-white rounded-full shadow-md hover:scale-105 hover:shadow-xl transition-transform inline-flex items-center justify-center w-full md:w-auto"
            >
               {t('cta:startRenting')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
