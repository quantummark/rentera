'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type LandingHeroProps = {
  className?: string;
  sectionId?: string;

  /** Куди вести орендаря на пошук */
  searchHref?: string;

  /** Куди вести власника */
  ownerHref?: string;
};

export default function LandingHero({
  className,
  sectionId = 'landing-hero',
  searchHref = '/search',
  ownerHref = '/rent-out',
}: LandingHeroProps) {
  const { t } = useTranslation(['landing']);
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const styles = useMemo(() => {
    const sectionBg = isDark ? 'bg-[#0B0F17] border-white/10' : 'bg-white border-black/10';
    const titleText = isDark ? 'text-white' : 'text-foreground';
    const softText = isDark ? 'text-white/70' : 'text-foreground/70';

    return {
      wrap: cn('px-1 sm:px-3', className),
      section: cn('relative overflow-hidden rounded-3xl border', sectionBg),

      gridDots: cn(
        'pointer-events-none absolute inset-0 opacity-[0.06]',
        isDark ? 'bg-[radial-gradient(#fff_1px,transparent_1px)]' : 'bg-[radial-gradient(#000_1px,transparent_1px)]',
        'bg-[length:18px_18px]'
      ),
      glow1: cn(
        'pointer-events-none absolute -top-32 -right-24 h-[26rem] w-[26rem] rounded-full blur-3xl opacity-70',
        isDark ? 'bg-orange-500/25' : 'bg-orange-400/20'
      ),
      glow2: cn(
        'pointer-events-none absolute -bottom-40 -left-28 h-[30rem] w-[30rem] rounded-full blur-3xl opacity-70',
        isDark ? 'bg-yellow-500/18' : 'bg-yellow-300/24'
      ),
      vignette: cn(
        'pointer-events-none absolute inset-0',
        isDark
          ? 'bg-[radial-gradient(1200px_420px_at_30%_0%,rgba(255,255,255,0.08),transparent_65%)]'
          : 'bg-[radial-gradient(1200px_420px_at_30%_0%,rgba(0,0,0,0.06),transparent_65%)]'
      ),

      inner: cn(
        'relative mx-auto max-w-5xl rounded-3xl border p-5 sm:p-8 md:p-10',
        isDark ? 'bg-white/5 border-white/10' : 'bg-black/[0.03] border-black/10'
      ),

      kicker: cn(
        'inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold',
        isDark ? 'border-white/12 text-white/80 bg-white/5' : 'border-black/10 text-foreground/70 bg-black/[0.02]'
      ),
      dot: cn(
        'h-2 w-2 rounded-full',
        isDark ? 'bg-gradient-to-r from-orange-300 to-yellow-200' : 'bg-gradient-to-r from-orange-500 to-yellow-400'
      ),

      title: cn('mt-4 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight', titleText),
      titleGradient: cn(
        'bg-clip-text text-transparent',
        isDark ? 'bg-gradient-to-r from-orange-200 to-orange-400' : 'bg-gradient-to-r from-orange-400 to-orange-600'
      ),
      subtitle: cn('mt-4 text-base sm:text-lg leading-relaxed', softText),

      actions: 'mt-6 flex flex-col sm:flex-row gap-3 sm:items-center',
      primaryBtn: cn(
        'rounded-2xl px-5 py-5 sm:py-6 text-sm sm:text-base font-semibold transition-all',
        isDark
          ? 'bg-orange-500 text-white hover:bg-orange-400 shadow-[0_8px_30px_rgba(249,115,22,0.35)]'
          : 'bg-orange-500 text-white hover:bg-orange-600 shadow-[0_8px_30px_rgba(249,115,22,0.25)]'
      ),
      secondaryBtn: cn(
        'rounded-2xl px-5 py-5 sm:py-6 text-sm sm:text-base font-semibold border',
        isDark ? 'border-white/20 text-white hover:bg-white/5' : 'border-black/15 text-foreground hover:bg-black/5'
      ),

      microcopy: cn('mt-3 text-xs sm:text-sm leading-relaxed', isDark ? 'text-white/60' : 'text-foreground/60'),
      microcopyAccent: cn('font-semibold text-orange-500', isDark && 'text-orange-400'),
    };
  }, [className, isDark]);

  return (
    <section id={sectionId} className={styles.wrap}>
      <div className={cn(styles.section, 'p-4 sm:p-6 md:p-8')}>
        <div className={styles.gridDots} />
        <div className={styles.glow1} />
        <div className={styles.glow2} />
        <div className={styles.vignette} />

        <div className={styles.inner}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <div className={styles.kicker}>
              <span className={styles.dot} aria-hidden="true" />
              {t('landing:hero.kicker', 'Платформа сучасної оренди')}
            </div>

            <h1 className={styles.title}>
              {t('landing:hero.title', 'Знайдіть житло без посередників — ')}
              <span className={styles.titleGradient}>
                {t('landing:hero.titleAccent', 'легко та спокійно')}
              </span>
            </h1>

            <p className={styles.subtitle}>
              {t(
                'landing:hero.subtitle',
                'Rentera поєднує пряме спілкування, онлайн-договір та зручні платежі в одній сучасній платформі.'
              )}
            </p>

            <div className={styles.actions}>
              <Button asChild className={styles.primaryBtn}>
                <Link href={searchHref} prefetch>
                  {t('landing:hero.primaryCta', 'Почати пошук житла')}
                </Link>
              </Button>

              <Button asChild variant="outline" className={styles.secondaryBtn}>
                <Link href={ownerHref} prefetch>
                  {t('landing:hero.secondaryCta', 'Я власник житла')}
                </Link>
              </Button>
            </div>

            <div className={styles.microcopy}>
              <span className={styles.microcopyAccent}>{t('landing:hero.microcopyFree', 'Безкоштовно')}</span>
              {t('landing:hero.microcopySep1', ' • ')}
              <span className={styles.microcopyAccent}>
                {t('landing:hero.microcopyNoMediators', 'Без посередників')}
              </span>
              {t('landing:hero.microcopySep2', ' • ')}
              <span className={styles.microcopyAccent}>{t('landing:hero.microcopyNoStress', 'Без зайвого стресу')}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
