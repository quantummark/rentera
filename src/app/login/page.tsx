'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import Link from 'next/link';

import { AuthForm } from '@/app/components/forms/AuthForm';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const { t } = useTranslation('login');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const styles = useMemo(() => {
    const cardBase = isDark
      ? cn(
          'border-orange-400/25',
          'bg-gradient-to-br from-orange-500/10 via-white/[0.04] to-pink-500/10',
          'shadow-[0_12px_35px_rgba(0,0,0,0.25)]'
        )
      : cn(
          'border-orange-300/60',
          'bg-gradient-to-br from-orange-50 via-white to-rose-50',
          'shadow-sm'
        );

    const titleText = isDark ? 'text-orange-300' : 'text-orange-600';
    const bodyText = isDark ? 'text-orange-200/90' : 'text-orange-800/90';

    const glow = isDark ? 'bg-orange-400/18' : 'bg-orange-400/20';

    // Стили ссылки на Terms — под тему
    const link = isDark
      ? cn(
          'font-semibold underline underline-offset-4',
          'decoration-orange-300/60',
          'text-orange-200/95',
          'transition-colors',
          'hover:text-orange-200 hover:decoration-orange-300'
        )
      : cn(
          'font-semibold underline underline-offset-4',
          'decoration-orange-500/40',
          'text-orange-700',
          'transition-colors',
          'hover:text-orange-800 hover:decoration-orange-500'
        );

    return {
      card: cn(
        'mt-6 relative overflow-hidden rounded-2xl border px-5 py-4 text-left',
        'backdrop-blur-sm',
        cardBase
      ),
      glow: cn('pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full blur-3xl', glow),
      title: cn('mb-2 flex items-center gap-2 text-base font-semibold', titleText),

      // чуть плотнее и приятнее для длинного текста
      text: cn('text-sm leading-relaxed', bodyText),

      veil: isDark
        ? 'pointer-events-none absolute inset-0 bg-[radial-gradient(900px_260px_at_10%_0%,rgba(255,255,255,0.06),transparent_60%)]'
        : 'pointer-events-none absolute inset-0 bg-[radial-gradient(900px_260px_at_10%_0%,rgba(0,0,0,0.04),transparent_60%)]',

      link,
    };
  }, [isDark]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background transition-colors px-1">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('description')}</p>
        </div>

        <AuthForm />

        {/* ✨ Магічне попередження Rentera (без dark: классов) */}
        <div className={styles.card}>
          <div className={styles.veil} />
          <div className={styles.glow} />

          <h2 className={styles.title}>✨ {t('magicTitle')}</h2>

          <p className={styles.text}>
            {t('magicTextPrefix')}
            <br />
            <br />
            {t('magicTextMiddle')}
            <br />
            <br />
            {t('magicTextSuffix')}{' '}
            <Link href="/terms" prefetch className={styles.link}>
              {t('magicTextLink')}
            </Link>{' '}
            {t('magicTextAfterLink')}
          </p>
        </div>
      </div>
    </div> 
  );
}
