'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

type RentOutPricingProps = {
  className?: string;
  sectionId?: string;
};

type PricingTile = {
  titleKey: string;
  titleFallback: string;
  valueKey: string;
  valueFallback: string;
  noteKey: string;
  noteFallback: string;
};

export default function RentOutPricing({
  className,
  sectionId = 'rent-out-pricing',
}: RentOutPricingProps) {
  const { t } = useTranslation(['rentOut']);
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const tiles: PricingTile[] = useMemo(
    () => [
      {
        titleKey: 'rentOut:pricing.tiles.owner.title',
        titleFallback: 'Для власника',
        valueKey: 'rentOut:pricing.tiles.owner.value',
        valueFallback: '2,5% комісії',
        noteKey: 'rentOut:pricing.tiles.owner.note',
        noteFallback: 'тільки з онлайн оплат',
      },
      {
        titleKey: 'rentOut:pricing.tiles.renter.title',
        titleFallback: 'Для орендаря',
        valueKey: 'rentOut:pricing.tiles.renter.value',
        valueFallback: '0% комісії',
        noteKey: 'rentOut:pricing.tiles.renter.note',
        noteFallback: 'орендар сплачує лише оренду',
      },
      {
        titleKey: 'rentOut:pricing.tiles.free.title',
        titleFallback: 'Безкоштовно',
        valueKey: 'rentOut:pricing.tiles.free.value',
        valueFallback: '0 ₴ за користування',
        noteKey: 'rentOut:pricing.tiles.free.note',
        noteFallback: 'без підписок, тарифів і прихованих платежів',
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
        isDark ? 'bg-orange-500/22' : 'bg-orange-400/18'
      ),
      glowBottom: cn(
        'pointer-events-none absolute -bottom-32 -left-28 h-96 w-96 rounded-full blur-3xl opacity-60',
        isDark ? 'bg-yellow-500/16' : 'bg-yellow-300/20'
      ),

      leadCard: cn(
        'relative overflow-hidden rounded-2xl border p-4 sm:p-6',
        isDark ? 'bg-white/5 border-white/10' : 'bg-black/[0.03] border-black/10'
      ),

      bigValue: cn(
        'text-4xl sm:text-5xl font-bold tracking-tight',
        'bg-clip-text text-transparent',
        isDark
          ? 'bg-gradient-to-r from-orange-300 via-yellow-200 to-orange-400'
          : 'bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500'
      ),
      bigNote: cn('mt-2 text-sm sm:text-base leading-relaxed', isDark ? 'text-white/70' : 'text-foreground/70'),

      grid: 'mt-6 sm:mt-8 grid gap-3 sm:gap-4 md:grid-cols-3',

      tile: cn(
        'group relative overflow-hidden rounded-2xl border p-4 sm:p-5',
        'transition-all duration-200',
        isDark ? 'bg-white/5 border-white/10' : 'bg-black/[0.03] border-black/10'
      ),
      tileHover: cn(isDark ? 'hover:bg-white/7 hover:border-white/15' : 'hover:bg-black/[0.05] hover:border-black/15'),
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

      tileValue: cn('mt-3 text-2xl sm:text-3xl font-bold', isDark ? 'text-white' : 'text-foreground'),
      tileNote: cn('mt-2 text-sm sm:text-base leading-relaxed', isDark ? 'text-white/70' : 'text-foreground/70'),

      footer: cn(
        'mt-6 text-sm sm:text-base leading-relaxed',
        isDark ? 'text-white/65' : 'text-foreground/65'
      ),
      footerAccent: cn(
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
              {t('rentOut:pricing.title', 'Прозора комісія без прихованих платежів')}
            </h2>

            <p className={cn('mt-3 text-base sm:text-lg leading-relaxed', styles.softText)}>
              {t(
                'rentOut:pricing.subtitle',
                'Rentera — повністю безкоштовна платформа. Ми не беремо оплату за реєстрацію, розміщення обʼєктів або користування сервісом.'
              )}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.04 }}
            className={cn(styles.leadCard, 'mt-6 sm:mt-8')}
          >
            <div className={styles.bigValue}>{t('rentOut:pricing.main.value', '2,5%')}</div>
            <div className={styles.bigNote}>
              {t(
                'rentOut:pricing.main.note',
                'Єдина комісія платформи стягується лише з онлайн оплат на платформі — з власника.'
              )}
            </div>
            <div className={cn('mt-3 text-sm sm:text-base', styles.softText)}>
              {t('rentOut:pricing.main.extra', 'Якщо оренда не оплачується онлайн — жодних комісій немає.')}
            </div>
          </motion.div>

          <div className={styles.grid}>
            {tiles.map((tile, idx) => (
              <motion.div
                key={tile.titleKey}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.35, ease: 'easeOut', delay: Math.min(idx * 0.05, 0.18) }}
                className={cn(styles.tile, styles.tileHover)}
              >
                <div className={styles.badge}>
                  <span className={styles.dot} aria-hidden="true" />
                  {t(tile.titleKey, tile.titleFallback)}
                </div>

                <div className={styles.tileValue}>{t(tile.valueKey, tile.valueFallback)}</div>
                <div className={styles.tileNote}>{t(tile.noteKey, tile.noteFallback)}</div>

                <div className={styles.shine} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
            className={styles.footer}
          >
            {t('rentOut:pricing.footerPrefix', 'Ви платите лише тоді, коли отримуєте ')}
            <span className={styles.footerAccent}>{t('rentOut:pricing.footerAccent', 'реальну оплату')}</span>
            {t('rentOut:pricing.footerSuffix', ' через Rentera.')}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
