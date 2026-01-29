'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type RentOutFinalCTAProps = {
  className?: string;
  sectionId?: string;

  /** Куди вести власника на створення профілю (реєстрація/логін). */
  primaryHref?: string;

  /** Куди вести за допомогою (підтримка/чат/контакти). */
  helpHref?: string;

  onPrimaryClick?: () => void;
  onHelpClick?: () => void;
};

export default function RentOutFinalCTA({
  className,
  sectionId = 'rent-out-final-cta',
  primaryHref = '/login',
  helpHref = '/support/help',
  onPrimaryClick,
  onHelpClick,
}: RentOutFinalCTAProps) {
  const { t } = useTranslation(['rentOut']);
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const styles = useMemo(() => {
    return {
      wrap: cn('px-1 sm:px-3', className),
      section: cn(
        'relative overflow-hidden rounded-3xl border',
        isDark ? 'bg-[#0B0F17] border-white/10' : 'bg-white border-black/10'
      ),

      gridDots: cn(
        'pointer-events-none absolute inset-0 opacity-[0.06]',
        isDark ? 'bg-[radial-gradient(#fff_1px,transparent_1px)]' : 'bg-[radial-gradient(#000_1px,transparent_1px)]',
        'bg-[length:18px_18px]'
      ),
      glowTop: cn(
        'pointer-events-none absolute -top-28 -right-24 h-80 w-80 rounded-full blur-3xl opacity-70',
        isDark ? 'bg-orange-500/28' : 'bg-orange-400/22'
      ),
      glowBottom: cn(
        'pointer-events-none absolute -bottom-32 -left-28 h-96 w-96 rounded-full blur-3xl opacity-70',
        isDark ? 'bg-yellow-500/20' : 'bg-yellow-300/26'
      ),

      title: cn('text-2xl sm:text-3xl md:text-4xl font-bold leading-tight', isDark ? 'text-white' : 'text-foreground'),
      subtitle: cn('mt-3 text-base sm:text-lg leading-relaxed', isDark ? 'text-white/70' : 'text-foreground/70'),

      body: cn('mt-4 text-base leading-relaxed', isDark ? 'text-white/70' : 'text-foreground/70'),

      gradientWord: cn(
        'bg-clip-text text-transparent',
  isDark
    ? 'bg-gradient-to-r from-orange-200 to-orange-400'
    : 'bg-gradient-to-r from-orange-400 to-orange-600'
      ),

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
      footer: cn('mt-5 text-sm sm:text-base leading-relaxed', isDark ? 'text-white/65' : 'text-foreground/65'),
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
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <h2 className={styles.title}>
              {t('rentOut:finalCta.title', 'Готові почати з ')}
              <span className={styles.gradientWord}>{t('rentOut:finalCta.brand', 'Rentera')}</span>
              {t('rentOut:finalCta.titleSuffix', '?')}
            </h2>

            <p className={styles.subtitle}>
              {t('rentOut:finalCta.subtitle', 'Ми поруч — навіть якщо ви здаєте житло вперше.')}
            </p>

            <p className={styles.body}>
              {t('rentOut:finalCta.body1', 'Якщо у вас є сумніви або ви вперше користуєтесь подібною платформою — не хвилюйтесь.')}
            </p>

            <p className={styles.body}>
              {t(
                'rentOut:finalCta.body2',
                'Наша команда допоможе вам створити профіль власника, додати обʼєкт та правильно оформити оголошення. Ми проведемо вас крок за кроком — і ви зможете отримати свої перші заявки на оренду.'
              )}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
              {onPrimaryClick ? (
                <Button type="button" className={styles.primaryBtn} onClick={onPrimaryClick}>
                  {t('rentOut:finalCta.primaryCta', 'Створити профіль')}
                </Button>
              ) : (
                <Button asChild className={styles.primaryBtn}>
                  <a href={primaryHref}>{t('rentOut:finalCta.primaryCta', 'Створити профіль')}</a>
                </Button>
              )}

              {onHelpClick ? (
                <Button type="button" variant="outline" className={styles.secondaryBtn} onClick={onHelpClick}>
                  {t('rentOut:finalCta.secondaryCta', 'Отримати допомогу')}
                </Button>
              ) : (
                <Button asChild variant="outline" className={styles.secondaryBtn}>
                  <a href={helpHref}>{t('rentOut:finalCta.secondaryCta', 'Отримати допомогу')}</a>
                </Button>
              )}
            </div>

            <div className={styles.microcopy}>
              {t(
                'rentOut:finalCta.microcopy',
                'Безкоштовно. Без зобовʼязань. Ми допоможемо вам на кожному етапі.'
              )}
            </div>

            <div className={styles.footer}>
              {t('rentOut:finalCta.footer', 'Rentera — сучасний шлях до впевненої оренди житла.')}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
