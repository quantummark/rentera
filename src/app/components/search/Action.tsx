'use client';

import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import BackgroundParticles from '@/app/components/BackgroundParticles';

export default function Action() {
  const { theme } = useTheme();
  const { t } = useTranslation('action');

  return (
    <section
      className={cn(
        'relative mt-16 overflow-hidden rounded-2xl py-10 px-6 md:px-12 text-center space-y-6 shadow-md transition-colors',
        theme === 'dark' ? 'bg-zinc-900/50' : 'bg-orange-50'
      )}
    >
      {/* Particles — фон под контентом */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BackgroundParticles />
      </div>

      {/* Контент — поверх */}
      <div className="relative z-10 space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          {t('action:title')}
        </h2>

        <p className="text-muted-foreground text-lg">
          {t('action:subtitle')}
        </p>

        {/* CTA-кнопки — овальные как просили */}
        <div className="flex justify-center gap-3 flex-col md:flex-row">
          <Link
            href="/login"
            className={cn(
              'rounded-full text-white font-semibold inline-flex items-center justify-center transition',
              'bg-gradient-to-r from-orange-500 to-orange-600 hover:scale-[1.03] hover:shadow-lg',
              'text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3'
            )}
          >
            {t('action:owner')}
          </Link>

          <Link
            href="/login"
            className={cn(
              'rounded-full font-semibold inline-flex items-center justify-center transition',
              'border border-input text-foreground hover:bg-accent',
              'dark:bg-background-dark/40',
              'text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3'
            )}
          >
            {t('action:renter')}
          </Link>
        </div>
      </div>
    </section>
  );
}
