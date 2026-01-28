'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type RentOutHeroProps = {
  className?: string;

  /** Куди вести власника на створення профілю (реєстрація/логін). */
  primaryHref?: string;

  /** Якор на цій же сторінці (наприклад секція "Як працює"). */
  secondaryScrollId?: string;

  /** Дозволяє підмінити поведінку кнопок, якщо треба */
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
};

export default function RentOutHero({
  className,
  primaryHref = '/login',
  secondaryScrollId = '/support/help',
  onPrimaryClick,
  onSecondaryClick,
}: RentOutHeroProps) {
  const { t } = useTranslation(['rentOut']);
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const styles = useMemo(() => {
    // ВАЖЛИВО: без dark: — усе через isDark
    return {
      section: cn(
        'relative overflow-hidden rounded-3xl border',
        isDark ? 'bg-[#0B0F17] border-white/10' : 'bg-white border-black/10'
      ),
      softText: isDark ? 'text-white/70' : 'text-foreground/70',
      title: isDark ? 'text-white' : 'text-foreground',
      gradientText: cn(
        'bg-clip-text text-transparent',
        isDark
          ? 'bg-gradient-to-r from-orange-300 via-yellow-200 to-orange-400'
          : 'bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500'
      ),
      primaryBtn: cn(
        'rounded-2xl px-5 py-5 sm:py-6 text-sm sm:text-base font-semibold',
        isDark
          ? 'bg-white text-black hover:bg-white/90'
          : 'bg-black text-white hover:bg-black/90'
      ),
      secondaryBtn: cn(
        'rounded-2xl px-5 py-5 sm:py-6 text-sm sm:text-base font-semibold border',
        isDark
          ? 'border-white/20 text-white hover:bg-white/5'
          : 'border-black/15 text-foreground hover:bg-black/5'
      ),
      microcopy: cn('text-xs sm:text-sm', isDark ? 'text-white/60' : 'text-foreground/60'),
      glow1: cn(
        'pointer-events-none absolute -top-28 -right-24 h-80 w-80 rounded-full blur-3xl opacity-60',
        isDark ? 'bg-orange-500/30' : 'bg-orange-400/25'
      ),
      glow2: cn(
        'pointer-events-none absolute -bottom-32 -left-28 h-96 w-96 rounded-full blur-3xl opacity-60',
        isDark ? 'bg-yellow-500/20' : 'bg-yellow-300/25'
      ),
      grid: cn(
        'pointer-events-none absolute inset-0 opacity-[0.06]',
        isDark ? 'bg-[radial-gradient(#fff_1px,transparent_1px)]' : 'bg-[radial-gradient(#000_1px,transparent_1px)]',
        'bg-[length:18px_18px]'
      ),
    };
  }, [isDark]);

  const handleSecondary = (): void => {
    if (onSecondaryClick) {
      onSecondaryClick();
      return;
    }

    const el = document.getElementById(secondaryScrollId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className={cn('px-1 sm:px-3', className)}>
      <div className={cn(styles.section, 'p-5 sm:p-8 md:p-10')}>
        {/* background */}
        <div className={styles.grid} />
        <div className={styles.glow1} />
        <div className={styles.glow2} />

        <div className="relative mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <p className={cn('text-sm font-medium', styles.softText)}>
              {t('rentOut:hero.kicker', 'Для власників житла')}
            </p>

            <h1 className={cn('mt-3 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight', styles.title)}>
              <span className={styles.gradientText}>
                {t('rentOut:hero.title', 'Оренда житла нового покоління')}
              </span>
              <span className={cn(isDark ? 'text-white' : 'text-foreground')}>
                {t('rentOut:hero.titleTail', ' — для власників, які цінують контроль і безпеку')}
              </span>
            </h1>

            <p className={cn('mt-4 text-base sm:text-lg leading-relaxed', styles.softText)}>
              {t(
                'rentOut:hero.subtitle',
                'Rentera обʼєднує пряме спілкування, захист житла, онлайн-договір та платежі в одній сучасній платформі.'
              )}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
              {onPrimaryClick ? (
                <Button type="button" className={styles.primaryBtn} onClick={onPrimaryClick}>
                  {t('rentOut:hero.primaryCta', 'Створити профіль власника')}
                </Button>
              ) : (
                <Button asChild className={styles.primaryBtn}>
                  <a href={primaryHref}>{t('rentOut:hero.primaryCta', 'Створити профіль власника')}</a>
                </Button>
              )}

              <Button type="button" variant="outline" className={styles.secondaryBtn} onClick={handleSecondary}>
                {t('rentOut:hero.secondaryCta', 'Дізнатися більше')}
              </Button>
            </div>

            <p className={cn('mt-3', styles.microcopy)}>
              {t('rentOut:hero.microcopy', 'Реєстрація безкоштовна • Без зобовʼязань • Лише кілька хвилин')}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
