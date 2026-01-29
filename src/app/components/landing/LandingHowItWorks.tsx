'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

type LandingHowItWorksProps = {
  className?: string;
  sectionId?: string;
};

type StepItem = {
  titleKey: string;
  titleFallback: string;
  descKey: string;
  descFallback: string;
};

export default function LandingHowItWorks({
  className,
  sectionId = 'landing-how-it-works',
}: LandingHowItWorksProps) {
  const { t } = useTranslation(['landing']);
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const steps: StepItem[] = useMemo(
    () => [
      {
        titleKey: 'landing:howItWorks.steps.1.title',
        titleFallback: 'Знайдіть житло',
        descKey: 'landing:howItWorks.steps.1.desc',
        descFallback: 'Переглядайте оголошення, фільтруйте та обирайте те, що підходить саме вам.',
      },
      {
        titleKey: 'landing:howItWorks.steps.2.title',
        titleFallback: 'Напишіть власнику в чат',
        descKey: 'landing:howItWorks.steps.2.desc',
        descFallback: 'Ставте запитання, домовляйтесь про перегляд та уточнюйте деталі — напряму, без посередників.',
      },
      {
        titleKey: 'landing:howItWorks.steps.3.title',
        titleFallback: 'Узгодьте умови',
        descKey: 'landing:howItWorks.steps.3.desc',
        descFallback: 'Строк оренди, правила, деталі проживання — все прозоро та зафіксовано.',
      },
      {
        titleKey: 'landing:howItWorks.steps.4.title',
        titleFallback: 'Підпишіть онлайн-договір',
        descKey: 'landing:howItWorks.steps.4.desc',
        descFallback: 'Коли все погоджено — підписуєте договір онлайн прямо на платформі.',
      },
      {
        titleKey: 'landing:howItWorks.steps.5.title',
        titleFallback: 'Оплачуйте зручно',
        descKey: 'landing:howItWorks.steps.5.desc',
        descFallback: 'Онлайн оплата та регулярні платежі — менше стресу, більше порядку.',
      },
      {
        titleKey: 'landing:howItWorks.steps.6.title',
        titleFallback: 'Заселяйтесь і насолоджуйтесь життям',
        descKey: 'landing:howItWorks.steps.6.desc',
        descFallback: 'Переїжджайте в нове житло та насолоджуйтесь комфортом і зручностями.',
      },
    ],
    []
  );

  const styles = useMemo(() => {
    return {
      wrap: cn('px-1 sm:px-3', className),
      section: cn(
        'relative overflow-hidden rounded-3xl border',
        isDark ? 'bg-[#0B0F17] border-white/10' : 'bg-white border-black/10'
      ),
      title: isDark ? 'text-white' : 'text-foreground',
      softText: isDark ? 'text-white/70' : 'text-foreground/70',

      gridDots: cn(
        'pointer-events-none absolute inset-0 opacity-[0.06]',
        isDark ? 'bg-[radial-gradient(#fff_1px,transparent_1px)]' : 'bg-[radial-gradient(#000_1px,transparent_1px)]',
        'bg-[length:18px_18px]'
      ),
      glowTop: cn(
        'pointer-events-none absolute -top-28 -right-24 h-80 w-80 rounded-full blur-3xl opacity-60',
        isDark ? 'bg-orange-500/20' : 'bg-orange-400/16'
      ),
      glowBottom: cn(
        'pointer-events-none absolute -bottom-32 -left-28 h-96 w-96 rounded-full blur-3xl opacity-60',
        isDark ? 'bg-yellow-500/14' : 'bg-yellow-300/18'
      ),

      grid: 'mt-6 sm:mt-8 grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3',
      card: cn(
        'group relative overflow-hidden rounded-2xl border p-4 sm:p-5',
        'transition-all duration-200',
        isDark ? 'bg-white/5 border-white/10' : 'bg-black/[0.03] border-black/10'
      ),
      cardHover: cn(isDark ? 'hover:bg-white/7 hover:border-white/15' : 'hover:bg-black/[0.05] hover:border-black/15'),
      shine: cn(
        'pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100',
        'transition-opacity duration-200',
        isDark
          ? 'bg-[radial-gradient(70%_60%_at_50%_0%,rgba(255,255,255,0.12),transparent_60%)]'
          : 'bg-[radial-gradient(70%_60%_at_50%_0%,rgba(0,0,0,0.10),transparent_60%)]'
      ),

      badge: cn(
        'inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold',
        isDark ? 'border-white/12 text-white/80 bg-white/5' : 'border-black/10 text-foreground/70 bg-black/[0.02]'
      ),
      dot: cn(
        'h-2 w-2 rounded-full',
        isDark ? 'bg-gradient-to-r from-orange-300 to-yellow-200' : 'bg-gradient-to-r from-orange-500 to-yellow-400'
      ),

      stepTitle: cn('mt-3 text-base sm:text-lg font-semibold leading-snug', isDark ? 'text-white' : 'text-foreground'),
      stepDesc: cn('mt-1.5 text-sm sm:text-base leading-relaxed', isDark ? 'text-white/70' : 'text-foreground/70'),

      closing: cn('mt-6 text-sm sm:text-base leading-relaxed', isDark ? 'text-white/65' : 'text-foreground/65'),
      closingAccent: cn(
        'font-semibold text-orange-500',
  isDark && 'text-orange-400'
      ),
    };
  }, [className, isDark]);

  return (
    <section id={sectionId} className={styles.wrap}>
      <div className={cn(styles.section, 'p-5 sm:p-8 md:p-10')}>
        <div className={styles.gridDots} />
        <div className={styles.glowTop} />
        <div className={styles.glowBottom} />

        <div className="relative mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <h2 className={cn('text-2xl sm:text-3xl font-bold', styles.title)}>
              {t('landing:howItWorks.title', 'Як це працює — просто і зрозуміло')}
            </h2>
            <p className={cn('mt-3 text-base sm:text-lg leading-relaxed', styles.softText)}>
              {t(
                'landing:howItWorks.subtitle',
                'Від пошуку до заселення — кілька кроків без хаосу, дзвінків і зайвих людей.'
              )}
            </p>
          </motion.div>

          <div className={styles.grid}>
            {steps.map((s, idx) => (
              <motion.div
                key={s.titleKey}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.35, ease: 'easeOut', delay: Math.min(idx * 0.05, 0.2) }}
                className={cn(styles.card, styles.cardHover)}
              >
                <div className={styles.badge}>
                  <span className={styles.dot} aria-hidden="true" />
                  {t('landing:howItWorks.stepLabel', 'Крок')}{' '}
                  {t(`landing:howItWorks.stepNumber.${idx + 1}`, String(idx + 1))}
                </div>

                <div className={styles.stepTitle}>{t(s.titleKey, s.titleFallback)}</div>
                <div className={styles.stepDesc}>{t(s.descKey, s.descFallback)}</div>

                <div className={styles.shine} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
            className={styles.closing}
          >
            {t('landing:howItWorks.closingPrefix', 'Оренда може бути легкою. ')}
            <span className={styles.closingAccent}>
              {t('landing:howItWorks.closingAccent', 'Саме так ми її й зробили')}
            </span>
            {t('landing:howItWorks.closingSuffix', '.')}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
