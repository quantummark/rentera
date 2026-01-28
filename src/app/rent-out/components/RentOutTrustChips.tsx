'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

type TrustChip = {
  key: string;
  fallback: string;
};

type RentOutTrustChipsProps = {
  className?: string;

  /** Якщо захочеш показувати менше/більше чипів — просто передай список ключів */
  keysOverride?: Array<{ key: string; fallback: string }>;
};

export default function RentOutTrustChips({ className, keysOverride }: RentOutTrustChipsProps) {
  const { t } = useTranslation(['rentOut']);
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const chips: TrustChip[] = useMemo(
    () =>
      keysOverride ?? [
        { key: 'rentOut:trustChips.noMediators', fallback: 'Без посередників' },
        { key: 'rentOut:trustChips.directChat', fallback: 'Прямий чат з орендарем' },
        { key: 'rentOut:trustChips.protection', fallback: 'Захист до 250 000 ₴' },
        { key: 'rentOut:trustChips.renterProfile', fallback: 'Профіль орендаря' },
        { key: 'rentOut:trustChips.onlineContract', fallback: 'Онлайн-договір' },
        { key: 'rentOut:trustChips.subscriptionPayments', fallback: 'Платежі по підписці' },
        { key: 'rentOut:trustChips.community', fallback: "Комʼюніті власників" },
        { key: 'rentOut:trustChips.fee', fallback: 'Комісія 2,5% з онлайн оплат' },
      ],
    [keysOverride]
  );

  const styles = useMemo(() => {
    return {
      wrapper: cn('relative'),
      grid: cn('grid gap-2 sm:gap-3', 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'),
      chip: cn(
        'relative overflow-hidden',
        'rounded-2xl border',
        'px-3 py-2.5 sm:px-4 sm:py-3',
        'text-xs sm:text-sm font-medium',
        'transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50'
      ),
      chipBg: isDark ? 'bg-white/5 border-white/10 text-white/85' : 'bg-black/[0.03] border-black/10 text-foreground/80',
      chipHover: isDark ? 'hover:bg-white/7 hover:border-white/15' : 'hover:bg-black/[0.05] hover:border-black/15',
      shine: cn(
        'pointer-events-none absolute inset-0 opacity-0',
        'transition-opacity duration-200',
        isDark
          ? 'bg-[radial-gradient(70%_60%_at_50%_0%,rgba(255,255,255,0.14),transparent_60%)]'
          : 'bg-[radial-gradient(70%_60%_at_50%_0%,rgba(0,0,0,0.10),transparent_60%)]'
      ),
      dot: cn(
        'h-2 w-2 rounded-full',
        isDark ? 'bg-gradient-to-r from-orange-300 to-yellow-200' : 'bg-gradient-to-r from-orange-500 to-yellow-400'
      ),
      text: cn('flex-1 leading-snug'),
    };
  }, [isDark]);

  return (
    <div className={cn('px-1 sm:px-3', className)}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}
        className={styles.wrapper}
      >
        <div className={styles.grid}>
          {chips.map((item) => (
            <motion.div
              key={item.key}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className={cn(styles.chip, styles.chipBg, styles.chipHover)}
              role="note"
            >
              <div className="flex items-center gap-2">
                <span className={styles.dot} aria-hidden="true" />
                <span className={styles.text}>{t(item.key, item.fallback)}</span>
              </div>

              <div className={cn(styles.shine, 'group-hover:opacity-100')} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
