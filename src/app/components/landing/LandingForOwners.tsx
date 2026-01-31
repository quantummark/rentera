'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type LandingForOwnersProps = {
  className?: string;
  sectionId?: string;

  ownerHref?: string;
};

type BulletItem = {
  key: string;
  fallback: string;
};

export default function LandingForOwners({
  className,
  sectionId = 'landing-for-owners',
  ownerHref = '/rent-out',
}: LandingForOwnersProps) {
  const { t } = useTranslation(['landing']);
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const bullets: BulletItem[] = useMemo(
    () => [
      { key: 'landing:forOwners.bullets.1', fallback: 'Без посередників — прямий контакт з орендарем' },
      { key: 'landing:forOwners.bullets.2', fallback: 'Захист житла замість великого залогу' },
      { key: 'landing:forOwners.bullets.3', fallback: 'Онлайн-договір та підписання на платформі' },
      { key: 'landing:forOwners.bullets.4', fallback: 'Регулярні онлайн-платежі по підписці' },
      { key: 'landing:forOwners.bullets.5', fallback: 'Комʼюніті для досвіду та пошуку орендаря' },
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

      gridDots: cn(
        'pointer-events-none absolute inset-0 opacity-[0.06]',
        isDark ? 'bg-[radial-gradient(#fff_1px,transparent_1px)]' : 'bg-[radial-gradient(#000_1px,transparent_1px)]',
        'bg-[length:18px_18px]'
      ),

      glowTop: cn(
        'pointer-events-none absolute -top-28 -right-24 h-80 w-80 rounded-full blur-3xl opacity-70',
        isDark ? 'bg-orange-500/22' : 'bg-orange-400/18'
      ),
      glowBottom: cn(
        'pointer-events-none absolute -bottom-32 -left-28 h-96 w-96 rounded-full blur-3xl opacity-70',
        isDark ? 'bg-yellow-500/18' : 'bg-yellow-300/22'
      ),

      inner: 'relative mx-auto max-w-5xl',
      grid: 'grid gap-4 md:grid-cols-2 md:items-center',

      // Left content
      title: cn('text-2xl sm:text-3xl font-bold leading-tight', isDark ? 'text-white' : 'text-foreground'),
      subtitle: cn('mt-3 text-base sm:text-lg leading-relaxed', isDark ? 'text-white/70' : 'text-foreground/70'),

      list: 'mt-5 space-y-2',
      li: cn(
        'flex items-start gap-3 rounded-2xl border px-4 py-3',
        isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/[0.03]'
      ),
      dot: cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', isDark ? 'bg-orange-300/90' : 'bg-orange-500/90'),
      liText: cn('text-sm sm:text-base leading-relaxed', isDark ? 'text-white/75' : 'text-foreground/75'),

      actions: 'mt-6 flex flex-col sm:flex-row gap-3 sm:items-center',
      primaryBtn: cn(
  'rounded-2xl px-5 py-5 sm:py-6 text-sm sm:text-base font-semibold transition-all',
  isDark
    ? 'bg-orange-500 text-white hover:bg-orange-400 shadow-[0_8px_30px_rgba(249,115,22,0.35)]'
    : 'bg-orange-500 text-white hover:bg-orange-600 shadow-[0_8px_30px_rgba(249,115,22,0.25)]'
),

      microcopy: cn('mt-3 text-xs sm:text-sm leading-relaxed', isDark ? 'text-white/60' : 'text-foreground/60'),
      microAccent: cn(
        'font-semibold text-orange-500',
  isDark && 'text-orange-400'
      ),

      // Right preview card
      previewCard: cn(
        'relative overflow-hidden rounded-3xl border p-5 sm:p-6',
        isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/[0.03]'
      ),
      previewTitle: cn('text-base sm:text-lg font-semibold', isDark ? 'text-white' : 'text-foreground'),
      previewText: cn('mt-2 text-sm sm:text-base leading-relaxed', isDark ? 'text-white/70' : 'text-foreground/70'),
      previewPillRow: 'mt-4 flex flex-wrap gap-2',
      pill: cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold',
        isDark ? 'border-white/12 text-white/80 bg-white/5' : 'border-black/10 text-foreground/70 bg-black/[0.02]'
      ),
      pillDot: cn(
        'h-2 w-2 rounded-full',
        isDark ? 'bg-gradient-to-r from-orange-300 to-yellow-200' : 'bg-gradient-to-r from-orange-500 to-yellow-400'
      ),

      previewFooter: cn('mt-5 text-xs sm:text-sm leading-relaxed', isDark ? 'text-white/60' : 'text-foreground/60'),
      arrow: cn(
        'pointer-events-none absolute -right-10 -top-10 h-40 w-40 rotate-12 rounded-full blur-3xl opacity-60',
        isDark ? 'bg-orange-500/18' : 'bg-orange-400/14'
      ),
    };
  }, [className, isDark]);

  return (
    <section id={sectionId} className={styles.wrap}>
      <div className={cn(styles.section, 'p-5 sm:p-8 md:p-10')}>
        <div className={styles.gridDots} />
        <div className={styles.glowTop} />
        <div className={styles.glowBottom} />

        <div className={styles.inner}>
          <div className={styles.grid}>
            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <h2 className={styles.title}>
                {t('landing:forOwners.title', 'Здаєте житло? Для власників — окремий простір')}
              </h2>

              <p className={styles.subtitle}>
                {t(
                  'landing:forOwners.subtitle',
                  'Ми зробили окрему сторінку для власників: з усіма інструментами оренди, захистом житла та онлайн-процесом від першої заявки до оплати.'
                )}
              </p>

              <div className={styles.list}>
                {bullets.map((b) => (
                  <div key={b.key} className={styles.li}>
                    <span className={styles.dot} aria-hidden="true" />
                    <div className={styles.liText}>{t(b.key, b.fallback)}</div>
                  </div>
                ))}
              </div>

                <div className={styles.actions}>
  <Button asChild className={styles.primaryBtn}>
    <Link href={ownerHref} prefetch>
      {t('landing:forOwners.cta', 'Перейти для власників')}
    </Link>
  </Button>
</div>

              <div className={styles.microcopy}>
                <span className={styles.microAccent}>
                  {t('landing:forOwners.micro1', 'Безкоштовна реєстрація')}
                </span>
                {t('landing:forOwners.sep1', ' • ')}
                <span className={styles.microAccent}>
                  {t('landing:forOwners.micro2', 'Комісія лише 2,5% з онлайн оплат')}
                </span>
                {t('landing:forOwners.sep2', ' • ')}
                <span className={styles.microAccent}>{t('landing:forOwners.micro3', 'Без прихованих умов')}</span>
              </div>
            </motion.div>

            {/* RIGHT PREVIEW */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
              className={styles.previewCard}
            >
              <div className={styles.arrow} />
              <div className={styles.previewTitle}>
                {t('landing:forOwners.preview.title', 'Сторінка для власників')}
              </div>
              <div className={styles.previewText}>
                {t(
                  'landing:forOwners.preview.text',
                  'Усе зібрано в одному місці: захист житла, профіль орендаря, договір, платежі та комʼюніті.'
                )}
              </div>

              <div className={styles.previewPillRow}>
                <div className={styles.pill}>
                  <span className={styles.pillDot} aria-hidden="true" />
                  {t('landing:forOwners.preview.pill1', 'Захист')}
                </div>
                <div className={styles.pill}>
                  <span className={styles.pillDot} aria-hidden="true" />
                  {t('landing:forOwners.preview.pill2', 'Договір')}
                </div>
                <div className={styles.pill}>
                  <span className={styles.pillDot} aria-hidden="true" />
                  {t('landing:forOwners.preview.pill3', 'Платежі')}
                </div>
                <div className={styles.pill}>
                  <span className={styles.pillDot} aria-hidden="true" />
                  {t('landing:forOwners.preview.pill4', 'Комʼюніті')}
                </div>
              </div>

              <div className={styles.previewFooter}>
                {t(
                  'landing:forOwners.preview.footer',
                  'Rentera — коли здавати житло так само зручно, як і користуватись сервісом.'
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
