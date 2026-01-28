'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

type RentOutRenterProfileProps = {
  className?: string;
  sectionId?: string;
};

type ProfileField = {
  key: string;
  fallback: string;
};

export default function RentOutRenterProfile({
  className,
  sectionId = 'rent-out-renter-profile',
}: RentOutRenterProfileProps) {
  const { t } = useTranslation(['rentOut']);
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const fields: ProfileField[] = useMemo(
    () => [
      { key: 'rentOut:renterProfile.fields.1', fallback: 'Бажаний строк оренди' },
      { key: 'rentOut:renterProfile.fields.2', fallback: 'Зайнятість' },
      { key: 'rentOut:renterProfile.fields.3', fallback: 'Бюджет' },
      { key: 'rentOut:renterProfile.fields.4', fallback: 'Діти' },
      { key: 'rentOut:renterProfile.fields.5', fallback: 'Куріння' },
      { key: 'rentOut:renterProfile.fields.6', fallback: 'Домашні тварини' },
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
        isDark ? 'bg-orange-500/22' : 'bg-orange-400/18'
      ),
      glowBottom: cn(
        'pointer-events-none absolute -bottom-32 -left-28 h-96 w-96 rounded-full blur-3xl opacity-60',
        isDark ? 'bg-yellow-500/16' : 'bg-yellow-300/20'
      ),

      grid: 'mt-6 sm:mt-8 grid gap-4 md:grid-cols-12',
      left: 'md:col-span-7',
      right: 'md:col-span-5',

      card: cn(
        'relative overflow-hidden rounded-2xl border p-4 sm:p-5',
        isDark ? 'bg-white/5 border-white/10' : 'bg-black/[0.03] border-black/10'
      ),

      badge: cn(
        'inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold',
        isDark ? 'border-white/12 text-white/80 bg-white/5' : 'border-black/10 text-foreground/70 bg-black/[0.02]'
      ),
      dot: cn(
        'h-2 w-2 rounded-full',
        isDark ? 'bg-gradient-to-r from-orange-300 to-yellow-200' : 'bg-gradient-to-r from-orange-500 to-yellow-400'
      ),

      fieldsGrid: 'mt-4 grid grid-cols-2 gap-2 sm:gap-3',
      chip: cn(
        'flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-xs sm:text-sm font-medium',
        'transition-all duration-200'
      ),
      chipBase: isDark ? 'border-white/10 bg-white/5 text-white/80' : 'border-black/10 bg-black/[0.03] text-foreground/80',
      chipHover: isDark ? 'hover:bg-white/7 hover:border-white/15' : 'hover:bg-black/[0.05] hover:border-black/15',
      chipIcon: cn(
        'h-2 w-2 shrink-0 rounded-full',
        isDark ? 'bg-orange-300/90' : 'bg-orange-500/90'
      ),

      summary: cn(
        'mt-4 rounded-2xl border p-4 sm:p-5 text-sm sm:text-base leading-relaxed',
        isDark ? 'border-white/10 bg-white/4 text-white/70' : 'border-black/10 bg-black/[0.02] text-foreground/70'
      ),

      closing: cn(
        'mt-5 text-sm sm:text-base leading-relaxed',
        isDark ? 'text-white/65' : 'text-foreground/65'
      ),
      closingAccent: cn(
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
              {t('rentOut:renterProfile.title', 'Ви знаєте, кому здаєте житло')}
            </h2>
            <p className={cn('mt-3 text-base sm:text-lg leading-relaxed', styles.softText)}>
              {t(
                'rentOut:renterProfile.subtitle',
                'Профіль орендаря показує ключові параметри ще до рішення — щоб ви могли обирати впевнено та без зайвих ризиків.'
              )}
            </p>
            <p className={cn('mt-4 text-base leading-relaxed', styles.softText)}>
              {t(
                'rentOut:renterProfile.body',
                'Rentera допомагає власникам приймати зважені рішення. Перед підтвердженням оренди ви бачите основну інформацію, яка впливає на комфорт проживання та відповідність вашим правилам.'
              )}
            </p>
          </motion.div>

          <div className={styles.grid}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className={cn(styles.card, styles.left)}
            >
              <div className={styles.badge}>
                <span className={styles.dot} aria-hidden="true" />
                {t('rentOut:renterProfile.fieldsTitle', 'Ключові параметри профілю')}
              </div>

              <div className={styles.fieldsGrid}>
                {fields.map((f) => (
                  <div key={f.key} className={cn(styles.chip, styles.chipBase, styles.chipHover)}>
                    <span className={styles.chipIcon} aria-hidden="true" />
                    <span>{t(f.key, f.fallback)}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.04 }}
              className={cn(styles.card, styles.right)}
            >
              <div className={styles.badge}>
                <span className={styles.dot} aria-hidden="true" />
                {t('rentOut:renterProfile.whyTitle', 'Чому це важливо')}
              </div>

              <p className={cn('mt-3 text-sm sm:text-base leading-relaxed', styles.softText)}>
                {t(
                  'rentOut:renterProfile.whyText',
                  'Це зменшує кількість випадкових заявок, економить ваш час та допомагає знайти орендаря, який підходить саме вам.'
                )}
              </p>

              <div className={styles.summary}>
                {t('rentOut:renterProfile.summary', 'Менше сюрпризів. Більше впевненості.')}
              </div>

              <div className={styles.closing}>
                <span className={styles.closingAccent}>
                  {t('rentOut:renterProfile.closingAccent', 'Прозорість')}
                </span>
                {t('rentOut:renterProfile.closingSuffix', ' — це комфортна оренда для обох сторін.')}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
