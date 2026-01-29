'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type StepItem = {
  titleKey: string;
  titleFallback: string;
  descKey: string;
  descFallback: string;
};

type RentOutHowItWorksProps = {
  className?: string;
  /** Для якоря зі Hero-кнопки */
  sectionId?: string;
};

export default function RentOutHowItWorks({
  className,
  sectionId = 'rent-out-how-it-works',
}: RentOutHowItWorksProps) {
  const { t } = useTranslation(['rentOut']);
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const steps: StepItem[] = useMemo(
    () => [
      {
        titleKey: 'rentOut:howItWorks.steps.1.title',
        titleFallback: 'Створіть профіль власника',
        descKey: 'rentOut:howItWorks.steps.1.desc',
        descFallback: 'Заповніть базові дані — це займає кілька хвилин.',
      },
      {
        titleKey: 'rentOut:howItWorks.steps.2.title',
        titleFallback: "Додайте обʼєкт",
        descKey: 'rentOut:howItWorks.steps.2.desc',
        descFallback: 'Завантажте фото, опишіть житло та зазначте правила проживання.',
      },
      {
        titleKey: 'rentOut:howItWorks.steps.3.title',
        titleFallback: 'Налаштуйте умови оренди',
        descKey: 'rentOut:howItWorks.steps.3.desc',
        descFallback: 'Вкажіть ціну, строк, комунальні, залог або оренду без залогу з захистом.',
      },
      {
        titleKey: 'rentOut:howItWorks.steps.4.title',
        titleFallback: 'Отримуйте заявки та спілкуйтесь у чаті',
        descKey: 'rentOut:howItWorks.steps.4.desc',
        descFallback: 'Усе спілкування — напряму на платформі, без посередників і “передзвоніть потім”.',
      },
      {
        titleKey: 'rentOut:howItWorks.steps.5.title',
        titleFallback: 'Перевірте профіль орендаря та оберіть найкращий варіант',
        descKey: 'rentOut:howItWorks.steps.5.desc',
        descFallback:
          'Бюджет, строк оренди, зайнятість, діти, тварини, куріння — ключові параметри видно одразу.',
      },
      {
        titleKey: 'rentOut:howItWorks.steps.6.title',
        titleFallback: 'Підпишіть договір онлайн',
        descKey: 'rentOut:howItWorks.steps.6.desc',
        descFallback: 'Швидко зафіксуйте домовленості — без паперів, сканів і зайвих зустрічей.',
      },
      {
        titleKey: 'rentOut:howItWorks.steps.7.title',
        titleFallback: 'Підключіть свою карту для отримання оплат',
        descKey: 'rentOut:howItWorks.steps.7.desc',
        descFallback: 'Підключіть карту на сторінці платежів, щоб отримувати платежі безпосередньо на неї.',
      },
      {
        titleKey: 'rentOut:howItWorks.steps.8.title',
        titleFallback: 'Отримуйте оплату онлайн по підписці',
        descKey: 'rentOut:howItWorks.steps.8.desc',
        descFallback: 'Регулярні платежі — стабільно, прозоро та зручно для обох сторін.',
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
        isDark ? 'bg-orange-500/25' : 'bg-orange-400/20'
      ),
      glowBottom: cn(
        'pointer-events-none absolute -bottom-32 -left-28 h-96 w-96 rounded-full blur-3xl opacity-60',
        isDark ? 'bg-yellow-500/18' : 'bg-yellow-300/22'
      ),
      card: cn(
        'relative rounded-2xl border p-4 sm:p-5',
        isDark ? 'bg-white/5 border-white/10' : 'bg-black/[0.03] border-black/10'
      ),
      badge: cn(
        'inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-xs font-semibold',
        isDark ? 'border-white/12 text-white/80 bg-white/5' : 'border-black/10 text-foreground/70 bg-black/[0.02]'
      ),
      stepTitle: cn('mt-3 text-base sm:text-lg font-semibold leading-snug', isDark ? 'text-white' : 'text-foreground'),
      stepDesc: cn('mt-1.5 text-sm sm:text-base leading-relaxed', isDark ? 'text-white/70' : 'text-foreground/70'),
      footer: cn(
        'mt-6 text-sm sm:text-base leading-relaxed',
        isDark ? 'text-white/65' : 'text-foreground/65'
      ),
      gradientWord: cn(
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
              {t('rentOut:howItWorks.title', 'Як здати житло на Rentera')}
            </h2>
            <p className={cn('mt-3 text-base sm:text-lg leading-relaxed', styles.softText)}>
              {t(
                'rentOut:howItWorks.subtitle',
                'Простий процес, у якому ви зберігаєте контроль на кожному кроці — від оголошення до договору та регулярних оплат.'
              )}
            </p>
          </motion.div>

          <div className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 md:grid-cols-2">
            {steps.map((s, idx) => (
              <motion.div
                key={s.titleKey}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.35, ease: 'easeOut', delay: Math.min(idx * 0.04, 0.2) }}
                className={styles.card}
              >
                <span className={styles.badge}>{t('rentOut:howItWorks.stepLabel', 'Крок')} {idx + 1}</span>

                <div className={styles.stepTitle}>{t(s.titleKey, s.titleFallback)}</div>
                <div className={styles.stepDesc}>{t(s.descKey, s.descFallback)}</div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
            className={styles.footer}
          >
            {t('rentOut:howItWorks.footerPrefix', 'Ви керуєте процесом. ')}
            <span className={styles.gradientWord}>
              {t('rentOut:howItWorks.footerAccent', 'Rentera')}
            </span>
            {t('rentOut:howItWorks.footerSuffix', ' дає інструменти, щоб оренда була сучасною, безпечною та передбачуваною.')}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
