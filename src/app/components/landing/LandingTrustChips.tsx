'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

type LandingTrustChipsProps = {
  className?: string;
  sectionId?: string;
};

type ChipItem = {
  key: string;
  fallback: string;
};

export default function LandingTrustChips({
  className,
  sectionId = 'landing-trust-chips',
}: LandingTrustChipsProps) {
  const { t } = useTranslation(['landing']);
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const chips: ChipItem[] = useMemo(
    () => [
      { key: 'landing:trustChips.1', fallback: 'Без посередників' },
      { key: 'landing:trustChips.2', fallback: 'Прямий чат між сторонами' },
      { key: 'landing:trustChips.3', fallback: 'Онлайн-договір' },
      { key: 'landing:trustChips.4', fallback: 'Оплата по підписці' },
      { key: 'landing:trustChips.5', fallback: "Живе комʼюніті" },
      { key: 'landing:trustChips.6', fallback: 'Платформа нового покоління' },
    ],
    []
  );

  const styles = useMemo(() => {
    const border = isDark ? 'border-white/10' : 'border-black/10';
    const chipBg = isDark ? 'bg-white/5' : 'bg-black/[0.03]';
    const chipText = isDark ? 'text-white/80' : 'text-foreground/80';

    return {
      wrap: cn('px-1 sm:px-3', className),
      section: cn(
        'relative overflow-hidden rounded-3xl border',
        isDark ? 'bg-[#0B0F17]' : 'bg-white',
        border
      ),

      gridDots: cn(
        'pointer-events-none absolute inset-0 opacity-[0.05]',
        isDark
          ? 'bg-[radial-gradient(#fff_1px,transparent_1px)]'
          : 'bg-[radial-gradient(#000_1px,transparent_1px)]',
        'bg-[length:18px_18px]'
      ),
      glow: cn(
        'pointer-events-none absolute -top-24 right-10 h-72 w-72 rounded-full blur-3xl opacity-60',
        isDark ? 'bg-orange-500/18' : 'bg-orange-400/14'
      ),

      inner: 'relative mx-auto max-w-5xl p-4 sm:p-6 md:p-8',

      chip: cn(
        'group inline-flex items-center justify-center gap-2 rounded-2xl border px-3 py-2 sm:px-4 sm:py-2.5',
        'text-xs sm:text-sm font-semibold',
        'transition-all duration-200',
        border,
        chipBg,
        chipText
      ),
      chipHover: cn(
        isDark ? 'hover:bg-white/7 hover:border-white/15' : 'hover:bg-black/[0.05] hover:border-black/15'
      ),
      dot: cn(
        'h-2 w-2 rounded-full transition-transform duration-200 group-hover:scale-110',
        isDark ? 'bg-gradient-to-r from-orange-300 to-yellow-200' : 'bg-gradient-to-r from-orange-500 to-yellow-400'
      ),
    };
  }, [className, isDark]);

  return (
    <section id={sectionId} className={styles.wrap}>
      <div className={cn(styles.section)}>
        <div className={styles.gridDots} />
        <div className={styles.glow} />

        <div className={styles.inner}>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {chips.map((chip, idx) => (
              <motion.div
                key={chip.key}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.25, ease: 'easeOut', delay: Math.min(idx * 0.04, 0.18) }}
                className={cn(styles.chip, styles.chipHover)}
              >
                <span className={styles.dot} aria-hidden="true" />
                <span>{t(chip.key, chip.fallback)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
