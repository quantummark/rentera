'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type LandingFinalCTAProps = {
  className?: string;
  sectionId?: string;

  searchHref?: string;
  helpHref?: string;

  onSearchClick?: () => void;
  onHelpClick?: () => void;
};

export default function LandingFinalCTA({
  className,
  sectionId = 'landing-final-cta',
  searchHref = '/search',
  helpHref = '/support',
  onSearchClick,
  onHelpClick,
}: LandingFinalCTAProps) {
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
        'pointer-events-none absolute -top-32 -right-24 h-[26rem] w-[26rem] rounded-full blur-3xl opacity-75',
        isDark ? 'bg-orange-500/22' : 'bg-orange-400/18'
      ),
      glow2: cn(
        'pointer-events-none absolute -bottom-40 -left-28 h-[30rem] w-[30rem] rounded-full blur-3xl opacity-75',
        isDark ? 'bg-yellow-500/18' : 'bg-yellow-300/22'
      ),
      vignette: cn(
        'pointer-events-none absolute inset-0',
        isDark
          ? 'bg-[radial-gradient(1200px_420px_at_30%_0%,rgba(255,255,255,0.08),transparent_65%)]'
          : 'bg-[radial-gradient(1200px_420px_at_30%_0%,rgba(0,0,0,0.06),transparent_65%)]'
      ),

      inner: cn(
        'relative mx-auto max-w-5xl rounded-3xl border p-5 sm:p-8 md:p-10 text-center',
        isDark ? 'bg-white/5 border-white/10' : 'bg-black/[0.03] border-black/10'
      ),

      title: cn('text-2xl sm:text-3xl md:text-4xl font-bold leading-tight', titleText),
      titleAccent: cn(
        'bg-clip-text text-transparent',
  isDark
    ? 'bg-gradient-to-r from-orange-200 to-orange-400'
    : 'bg-gradient-to-r from-orange-400 to-orange-600'
      ),

      subtitle: cn('mt-3 text-base sm:text-lg leading-relaxed', softText),

      actions: 'mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:items-center',
      primaryBtn: cn(
  'rounded-2xl px-5 py-5 sm:py-6 text-sm sm:text-base font-semibold transition-all',
  isDark
    ? 'bg-orange-500 text-white hover:bg-orange-400 shadow-[0_8px_30px_rgba(249,115,22,0.35)]'
    : 'bg-orange-500 text-white hover:bg-orange-600 shadow-[0_8px_30px_rgba(249,115,22,0.25)]'
),
      secondaryBtn: cn(
        'rounded-2xl px-6 py-5 sm:py-6 text-sm sm:text-base font-semibold border',
        isDark ? 'border-white/20 text-white hover:bg-white/5' : 'border-black/15 text-foreground hover:bg-black/5'
      ),

      microcopy: cn('mt-4 text-xs sm:text-sm leading-relaxed', isDark ? 'text-white/60' : 'text-foreground/60'),
      microAccent: cn(
        'font-semibold text-orange-500',
  isDark && 'text-orange-400'
      ),

      helperLine: cn('mt-3 text-xs sm:text-sm leading-relaxed', isDark ? 'text-white/65' : 'text-foreground/65'),
    };
  }, [className, isDark]);

  return (
    <section id={sectionId} className={styles.wrap}>
      <div className={cn(styles.section, 'p-5 sm:p-8 md:p-10')}>
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
            className="mx-auto max-w-3xl"
          >
            <h2 className={styles.title}>
              {t('landing:finalCta.titlePrefix', 'Почніть пошук — і знайдіть ')}
              <span className={styles.titleAccent}>{t('landing:finalCta.titleAccent', '“своє” житло')}</span>
              {t('landing:finalCta.titleSuffix', ' без зайвого стресу')}
            </h2>

            <p className={styles.subtitle}>
              {t(
                'landing:finalCta.subtitle',
                'Rentera створена, щоб оренда була простою: прямий чат, договір онлайн і порядок у платежах.'
              )}
            </p>

            <div className={styles.actions}>
              {onSearchClick ? (
                <Button type="button" className={styles.primaryBtn} onClick={onSearchClick}>
                  {t('landing:finalCta.primaryCta', 'Почати пошук житла')}
                </Button>
              ) : (
                <Button asChild className={styles.primaryBtn}>
                  <a href={searchHref}>{t('landing:finalCta.primaryCta', 'Почати пошук житла')}</a>
                </Button>
              )}

              {onHelpClick ? (
                <Button type="button" variant="outline" className={styles.secondaryBtn} onClick={onHelpClick}>
                  {t('landing:finalCta.secondaryCta', 'Отримати допомогу')}
                </Button>
              ) : (
                <Button asChild variant="outline" className={styles.secondaryBtn}>
                  <a href={helpHref}>{t('landing:finalCta.secondaryCta', 'Отримати допомогу')}</a>
                </Button>
              )}
            </div>

            <div className={styles.microcopy}>
              <span className={styles.microAccent}>{t('landing:finalCta.micro1', 'Безкоштовно')}</span>
              {t('landing:finalCta.sep1', ' • ')}
              <span className={styles.microAccent}>{t('landing:finalCta.micro2', 'Без посередників')}</span>
              {t('landing:finalCta.sep2', ' • ')}
              <span className={styles.microAccent}>{t('landing:finalCta.micro3', 'Усе в одному місці')}</span>
            </div>

            <div className={styles.helperLine}>
              {t('landing:finalCta.helperLine', 'Якщо ви користуєтесь платформою вперше — ми підкажемо, з чого почати.')}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
