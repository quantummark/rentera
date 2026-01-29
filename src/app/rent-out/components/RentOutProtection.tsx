'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

type RentOutProtectionProps = {
  className?: string;
  sectionId?: string;
};

export default function RentOutProtection({
  className,
  sectionId = 'rent-out-protection',
}: RentOutProtectionProps) {
  const { t } = useTranslation(['rentOut']);
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const coverageItems = useMemo(
    () => [
      {
        key: 'rentOut:protection.coverage.items.1',
        fallback: 'пошкодження меблів і побутової техніки',
      },
      {
        key: 'rentOut:protection.coverage.items.2',
        fallback: "збитки інтерʼєру та елементам ремонту",
      },
      {
        key: 'rentOut:protection.coverage.items.3',
        fallback: 'пошкодження від води, пожежі та інших побутових ситуацій',
      },
    ],
    []
  );

  const benefitItems = useMemo(
    () => [
      { key: 'rentOut:protection.bullets.1', fallback: 'можливість здати житло без залогу' },
      { key: 'rentOut:protection.bullets.2', fallback: 'більше заявок від орендарів' },
      { key: 'rentOut:protection.bullets.3', fallback: 'щомісячний страховий внесок від орендаря' },
      { key: 'rentOut:protection.bullets.4', fallback: 'фінансовий захист майна' },
      { key: 'rentOut:protection.bullets.5', fallback: 'спокій та впевненість власника' },
    ],
    []
  );

  const styles = useMemo(() => {
    const sectionBg = isDark ? 'bg-[#0B0F17] border-white/10' : 'bg-white border-black/10';
    const softText = isDark ? 'text-white/70' : 'text-foreground/70';
    const titleText = isDark ? 'text-white' : 'text-foreground';

    return {
      wrap: cn('px-1 sm:px-3', className),
      section: cn('relative overflow-hidden rounded-3xl border', sectionBg),
      title: titleText,
      softText,
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

      grid: 'mt-6 sm:mt-8 grid gap-4 md:grid-cols-12',
      left: 'md:col-span-7',
      right: 'md:col-span-5',

      card: cn(
        'relative overflow-hidden rounded-2xl border p-4 sm:p-5',
        isDark ? 'bg-white/5 border-white/10' : 'bg-black/[0.03] border-black/10'
      ),
      cardTitle: cn('text-base sm:text-lg font-semibold', titleText),
      cardText: cn('mt-2 text-sm sm:text-base leading-relaxed', softText),

      badge: cn(
        'inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold',
        isDark ? 'border-white/12 text-white/80 bg-white/5' : 'border-black/10 text-foreground/70 bg-black/[0.02]'
      ),
      dot: cn(
        'h-2 w-2 rounded-full',
        isDark ? 'bg-gradient-to-r from-orange-300 to-yellow-200' : 'bg-gradient-to-r from-orange-500 to-yellow-400'
      ),

      bullets: 'mt-3 space-y-2',
      bullet: cn(
        'flex items-start gap-2 rounded-xl border px-3 py-2 text-sm sm:text-base',
        isDark ? 'border-white/10 bg-white/4 text-white/75' : 'border-black/10 bg-white/60 text-foreground/75'
      ),
      bulletIcon: cn(
        'mt-1 h-2 w-2 shrink-0 rounded-full',
        isDark ? 'bg-orange-300/90' : 'bg-orange-500/90'
      ),

      bigNumberWrap: cn(
        'relative overflow-hidden rounded-2xl border p-5 sm:p-6',
        isDark ? 'bg-white/6 border-white/10' : 'bg-black/[0.03] border-black/10'
      ),
      bigNumber: cn(
        'text-4xl sm:text-5xl font-bold tracking-tight',
        'bg-clip-text text-transparent',
        isDark
          ? 'bg-gradient-to-r from-orange-300 via-yellow-200 to-orange-400'
          : 'bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500'
      ),
      bigNumberLabel: cn('mt-2 text-sm sm:text-base leading-relaxed', softText),

      hint: cn(
        'mt-4 rounded-2xl border p-4 sm:p-5 text-sm sm:text-base leading-relaxed',
        isDark ? 'border-white/10 bg-white/4 text-white/70' : 'border-black/10 bg-black/[0.02] text-foreground/70'
      ),

      closing: cn(
        'mt-5 sm:mt-6 text-sm sm:text-base leading-relaxed',
        isDark ? 'text-white/65' : 'text-foreground/65'
      ),
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
              {t('rentOut:protection.title', 'Захист житла замість залогу')}
            </h2>
            <p className={cn('mt-3 text-base sm:text-lg leading-relaxed', styles.softText)}>
              {t('rentOut:protection.subtitle', 'Здавайте житло без залогу — не ризикуючи власною нерухомістю.')}
            </p>
            <p className={cn('mt-4 text-base leading-relaxed', styles.softText)}>
              {t(
                'rentOut:protection.body',
                'Rentera пропонує сучасний підхід до оренди: замість обовʼязкового залогу — страховий захист житла на суму до 250 000 ₴.'
              )}
            </p>
            <p className={cn('mt-3 text-base leading-relaxed', styles.softText)}>
              {t(
                'rentOut:protection.body2',
                'Орендар щомісяця сплачує страховий внесок разом з оплатою оренди, що дозволяє власнику зберігати фінансову безпеку без необхідності брати залог.'
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
                {t('rentOut:protection.benefitsBadge', 'Що дає захист')}
              </div>

              <div className={styles.bullets}>
                {benefitItems.map((item) => (
                  <div key={item.key} className={styles.bullet}>
                    <span className={styles.bulletIcon} aria-hidden="true" />
                    <span>{t(item.key, item.fallback)}</span>
                  </div>
                ))}
              </div>

              <div className={cn(styles.hint, 'mt-5')}>
                <div className={styles.cardTitle}>
                  {t('rentOut:protection.coverage.title', '🛠️ Що може покривати захист житла')}
                </div>
                <p className={styles.cardText}>
                  {t(
                    'rentOut:protection.coverage.subtitle',
                    'Страхове покриття може поширюватися на:'
                  )}
                </p>

                <ul className="mt-3 space-y-2">
                  {coverageItems.map((c) => (
                    <li key={c.key} className="flex items-start gap-2">
                      <span className={styles.bulletIcon} aria-hidden="true" />
                      <span className={cn('text-sm sm:text-base', styles.softText)}>{t(c.key, c.fallback)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.04 }}
              className={cn(styles.right, 'space-y-4')}
            >
              <div className={styles.bigNumberWrap}>
                <div className={styles.bigNumber}>{t('rentOut:protection.amount', '250 000 ₴')}</div>
                <div className={styles.bigNumberLabel}>
                  {t(
                    'rentOut:protection.amountLabel',
                    'Максимальна сума страхового захисту (відповідно до умов платформи).'
                  )}
                </div>
              </div>

              <div className={styles.hint}>
                {t(
                  'rentOut:protection.note',
                  'Захист житла є додатковим рівнем безпеки та застосовується відповідно до умов платформи. Усі деталі доступні під час оформлення оренди та договору.'
                )}
              </div>

              <div className={styles.closing}>
                {t('rentOut:protection.closingPrefix', 'Сучасна оренда — це не страх. ')}
                <span className={styles.closingAccent}>
                  {t('rentOut:protection.closingAccent', 'Це впевненість.')}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
