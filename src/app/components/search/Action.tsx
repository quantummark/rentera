'use client';

import { useMemo } from 'react';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import BackgroundParticles from '@/app/components/BackgroundParticles';

export default function Action() {
  const { theme } = useTheme();
  const { t } = useTranslation('action');

  const isDark = theme === 'dark';

  const styles = useMemo(() => {
    const sectionBase = isDark
      ? cn(
          'border-white/10',
          'bg-white/[0.03]',
          'shadow-[0_18px_45px_rgba(0,0,0,0.35)]'
        )
      : cn(
          'border-black/10',
          'bg-white/70',
          'shadow-[0_14px_40px_rgba(0,0,0,0.10)]'
        );

    const title = isDark ? 'text-white' : 'text-foreground';
    const subtitle = isDark ? 'text-white/70' : 'text-muted-foreground';

    const chip = isDark
      ? 'bg-white/6 border-white/10 text-white/80'
      : 'bg-white/60 border-black/10 text-foreground/80';

    const primaryBtn = isDark
      ? cn(
          'bg-orange-500 text-white hover:bg-orange-400',
          'shadow-[0_10px_26px_rgba(249,115,22,0.35)] hover:shadow-[0_14px_34px_rgba(249,115,22,0.45)]'
        )
      : cn(
          'bg-orange-500 text-white hover:bg-orange-600',
          'shadow-[0_10px_26px_rgba(249,115,22,0.25)] hover:shadow-[0_14px_34px_rgba(249,115,22,0.30)]'
        );

    const secondaryBtn = isDark
      ? 'border-white/15 text-white hover:bg-white/7'
      : 'border-black/15 text-foreground hover:bg-black/5';

    return {
      section: cn(
        'relative mt-16 overflow-hidden rounded-3xl border',
        'py-10 px-6 md:px-12 text-center',
        'transition-colors',
        sectionBase
      ),

      // тонкая “дорогая” акцентная линия сверху
      accentLine: 'absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400',

      // мягкие пятна (без жести)
      glow1: cn(
        'pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full blur-3xl',
        isDark ? 'bg-orange-500/18' : 'bg-orange-300/25'
      ),
      glow2: cn(
        'pointer-events-none absolute -right-28 -bottom-24 h-80 w-80 rounded-full blur-3xl',
        isDark ? 'bg-indigo-500/14' : 'bg-indigo-300/20'
      ),

      title: cn('text-2xl md:text-3xl font-bold', title),
      subtitle: cn('text-base md:text-lg', subtitle),

      chipsWrap: 'mt-4 flex flex-wrap justify-center gap-2',
      chip: cn('inline-flex items-center rounded-full border px-3 py-1 text-xs sm:text-sm', chip),

      actions: 'mt-6 flex justify-center gap-3 flex-col md:flex-row',

      btnBase: cn(
        'rounded-full font-semibold inline-flex items-center justify-center',
        'transition-all duration-300',
        'text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3',
        'hover:-translate-y-0.5 active:translate-y-0',
        'focus:outline-none focus:ring-2 focus:ring-orange-400/25'
      ),
      primaryBtn: cn(primaryBtn),
      secondaryBtn: cn('border', secondaryBtn),

      micro: cn('mt-4 text-xs sm:text-sm', isDark ? 'text-white/60' : 'text-muted-foreground'),
    };
  }, [isDark]);

  return (
    <section className={styles.section}>
      <div className={styles.accentLine} />
      <div className={styles.glow1} />
      <div className={styles.glow2} />

      {/* Particles — фон под контентом */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.18]">
        <BackgroundParticles />
      </div>

      {/* Контент — поверх */}
      <div className="relative z-10 space-y-6">
        <h2 className={styles.title}>{t('title')}</h2>
        <p className={styles.subtitle}>{t('subtitle')}</p>

        {/* Chips */}
        <div className={styles.chipsWrap}>
          <span className={styles.chip}>{t('chips.noAgents')}</span>
          <span className={styles.chip}>{t('chips.onlineContract')}</span>
          <span className={styles.chip}>{t('chips.oneClickPayments')}</span>
        </div>

        {/* CTA */}
        <div className={styles.actions}>
          <Link href="/login" className={cn(styles.btnBase, styles.primaryBtn)}>
            {t('owner')}
            <span className="ml-2 opacity-80 transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </Link>

          <Link href="/login" className={cn(styles.btnBase, styles.secondaryBtn)}>
            {t('renter')}
          </Link>
        </div>

        <p className={styles.micro}>{t('micro')}</p>
      </div>
    </section>
  );
}
