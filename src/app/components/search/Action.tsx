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

        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link
            href="/login"
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-6 py-3 rounded-xl transition"
          >
            {t('action:owner')}
          </Link>

          <Link
            href="/login"
            className="dark:bg-background-dark border border-input text-foreground text-sm font-medium px-6 py-3 rounded-xl hover:bg-accent transition"
          >
            {t('action:renter')}
          </Link>
        </div>
      </div>
    </section>
  );
}
