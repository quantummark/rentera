'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

type BenefitItem = {
  titleKey: string;
  titleFallback: string;
  descKey: string;
  descFallback: string;
};

type RentOutBenefitsProps = {
  className?: string;
  sectionId?: string;
};

export default function RentOutBenefits({
  className,
  sectionId = 'rent-out-benefits',
}: RentOutBenefitsProps) {
  const { t } = useTranslation(['rentOut']);
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const benefits: BenefitItem[] = useMemo(
    () => [
      {
        titleKey: 'rentOut:benefits.items.1.title',
        titleFallback: 'Без посередників',
        descKey: 'rentOut:benefits.items.1.desc',
        descFallback:
          'Ви здаєте напряму — без агентів, зайвих комісій та стороннього тиску. Повний контроль умов залишається у вас.',
      },
      {
        titleKey: 'rentOut:benefits.items.2.title',
        titleFallback: 'Прямий чат з орендарем',
        descKey: 'rentOut:benefits.items.2.desc',
        descFallback:
          'Спілкуйтесь на платформі та фіксуйте домовленості в одному місці — без втрачених повідомлень і “передзвоніть пізніше”.',
      },
      {
        titleKey: 'rentOut:benefits.items.3.title',
        titleFallback: 'Захист житла до 250 000 ₴',
        descKey: 'rentOut:benefits.items.3.desc',
        descFallback:
          'Оренда без залогу може бути безпечною. Страховий захист допомагає зменшити ризики та залучити більше орендарів.',
      },
      {
        titleKey: 'rentOut:benefits.items.4.title',
        titleFallback: 'Профіль орендаря з ключовими параметрами',
        descKey: 'rentOut:benefits.items.4.desc',
        descFallback:
          'Ви бачите важливу інформацію до рішення: строк оренди, зайнятість, бюджет, діти, тварини, куріння — усе прозоро.',
      },
      {
        titleKey: 'rentOut:benefits.items.5.title',
        titleFallback: 'Онлайн-договір за хвилини',
        descKey: 'rentOut:benefits.items.5.desc',
        descFallback:
          'Швидко оформлюйте та підписуйте договір онлайн — без паперів, сканів і зайвої бюрократії.',
      },
      {
        titleKey: 'rentOut:benefits.items.6.title',
        titleFallback: 'Онлайн-платежі по підписці',
        descKey: 'rentOut:benefits.items.6.desc',
        descFallback:
          'Регулярні платежі без нагадувань і затримок. Вам простіше керувати орендою, орендарю — зручніше платити.',
      },
      {
        titleKey: 'rentOut:benefits.items.7.title',
        titleFallback: "Комʼюніті власників",
        descKey: 'rentOut:benefits.items.7.desc',
        descFallback:
          'Обмін досвідом, поради та живе середовище платформи. Можна отримати підтримку від інших власників і швидше знайти орендаря.',
      },
      {
        titleKey: 'rentOut:benefits.items.8.title',
        titleFallback: 'Прозора комісія 2,5% з онлайн оплат',
        descKey: 'rentOut:benefits.items.8.desc',
        descFallback:
          'Без прихованих платежів. Орендар не сплачує комісію — ви платите лише за сервіс і результат, коли використовуєте онлайн-оплату на платформі.',
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
        'group relative overflow-hidden rounded-2xl border p-4 sm:p-5',
        'transition-all duration-200',
        isDark ? 'bg-white/5 border-white/10' : 'bg-black/[0.03] border-black/10'
      ),
      cardHover: cn(
        isDark ? 'hover:bg-white/7 hover:border-white/15' : 'hover:bg-black/[0.05] hover:border-black/15'
      ),
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
      cardTitle: cn('mt-3 text-base sm:text-lg font-semibold leading-snug', isDark ? 'text-white' : 'text-foreground'),
      cardDesc: cn('mt-1.5 text-sm sm:text-base leading-relaxed', isDark ? 'text-white/70' : 'text-foreground/70'),
      footer: cn(
        'mt-6 text-sm sm:text-base leading-relaxed',
        isDark ? 'text-white/65' : 'text-foreground/65'
      ),
      gradientWord: cn(
        'bg-clip-text text-transparent font-semibold',
        isDark
          ? 'bg-gradient-to-r from-orange-300 via-yellow-200 to-orange-400'
          : 'bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500'
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
              {t('rentOut:benefits.title', 'Чому власники обирають Rentera')}
            </h2>
            <p className={cn('mt-3 text-base sm:text-lg leading-relaxed', styles.softText)}>
              {t(
                'rentOut:benefits.subtitle',
                'Ми зібрали ключові інструменти сучасної оренди в одній платформі — щоб вам було спокійно, зручно та передбачувано.'
              )}
            </p>
          </motion.div>

          <div className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 md:grid-cols-2">
            {benefits.map((b, idx) => (
              <motion.div
                key={b.titleKey}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.35, ease: 'easeOut', delay: Math.min(idx * 0.04, 0.2) }}
                className={cn(styles.card, styles.cardHover)}
              >
                <div className={styles.badge}>
                  <span className={styles.dot} aria-hidden="true" />
                  {t('rentOut:benefits.badge', 'Перевага')}
                </div>

                <div className={styles.cardTitle}>{t(b.titleKey, b.titleFallback)}</div>
                <div className={styles.cardDesc}>{t(b.descKey, b.descFallback)}</div>

                <div className={styles.shine} />
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
            {t(
              'rentOut:benefits.footerPrefix',
              'Rentera створена для власників, які хочуть здавати житло сучасно: швидко, без посередників і з відчуттям контролю.'
            )}
            {' '}
            <span className={styles.gradientWord}>{t('rentOut:benefits.footerAccent', '')}</span>
          </motion.p>
        </div>
      </div>
    </section>
  );
}
