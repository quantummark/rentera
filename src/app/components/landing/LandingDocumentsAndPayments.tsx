'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

type LandingDocumentsAndPaymentsProps = {
  className?: string;
  sectionId?: string;
};

type InfoCard = {
  titleKey: string;
  titleFallback: string;
  bodyKey: string;
  bodyFallback: string;
  bullets: Array<{ key: string; fallback: string }>;
};

export default function LandingDocumentsAndPayments({
  className,
  sectionId = 'landing-docs-payments',
}: LandingDocumentsAndPaymentsProps) {
  const { t } = useTranslation(['landing']);
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const cards: InfoCard[] = useMemo(
    () => [
      {
        titleKey: 'landing:docsPayments.cards.contract.title',
        titleFallback: 'Онлайн-договір',
        bodyKey: 'landing:docsPayments.cards.contract.body',
        bodyFallback:
          'Підписуйте договір онлайн прямо на платформі — без паперів, сканів і плутанини. Умови оренди зафіксовані та доступні в будь-який момент.',
        bullets: [
          { key: 'landing:docsPayments.cards.contract.bullets.1', fallback: 'все зрозуміло з першого дня' },
          { key: 'landing:docsPayments.cards.contract.bullets.2', fallback: 'менше ризику непорозумінь' },
          { key: 'landing:docsPayments.cards.contract.bullets.3', fallback: 'договір завжди під рукою' },
        ],
      },
      {
        titleKey: 'landing:docsPayments.cards.payments.title',
        titleFallback: 'Онлайн-оплата',
        bodyKey: 'landing:docsPayments.cards.payments.body',
        bodyFallback:
          'Сплачуйте оренду онлайн — регулярно та зручно. Історія платежів зберігається у вашому кабінеті.',
        bullets: [
          { key: 'landing:docsPayments.cards.payments.bullets.1', fallback: 'регулярні платежі без нагадувань' },
          { key: 'landing:docsPayments.cards.payments.bullets.2', fallback: 'прозора історія оплат' },
          { key: 'landing:docsPayments.cards.payments.bullets.3', fallback: 'більше порядку в побуті' },
        ],
      },
      {
        titleKey: 'landing:docsPayments.cards.protection.title',
        titleFallback: 'Захист житла',
        bodyKey: 'landing:docsPayments.cards.protection.body',
        bodyFallback:
          'Можливість заїхати без великого залогу — сплачуючи оренду та невеликий щомісячний внесок у страховий фонд партнера Rentera.',
        bullets: [
          { key: 'landing:docsPayments.cards.protection.bullets.1', fallback: 'менше фінансового навантаження при заселенні' },
          { key: 'landing:docsPayments.cards.protection.bullets.2', fallback: 'більше довіри між сторонами' },
          { key: 'landing:docsPayments.cards.protection.bullets.3', fallback: 'сучасний підхід до оренди' },
        ],
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

      grid: 'mt-6 sm:mt-8 grid gap-3 sm:gap-4 md:grid-cols-3',

      card: cn(
        'group relative overflow-hidden rounded-2xl border p-4 sm:p-6',
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

      cardTitle: cn('mt-3 text-base sm:text-lg font-semibold leading-snug', isDark ? 'text-white' : 'text-foreground'),
      cardBody: cn('mt-2 text-sm sm:text-base leading-relaxed', isDark ? 'text-white/70' : 'text-foreground/70'),

      bulletList: 'mt-4 space-y-2',
      bullet: cn(
        'flex items-start gap-2 rounded-xl border px-3 py-2 text-sm sm:text-base',
        isDark ? 'border-white/10 bg-white/4 text-white/75' : 'border-black/10 bg-white/60 text-foreground/75'
      ),
      bulletIcon: cn('mt-1 h-2 w-2 shrink-0 rounded-full', isDark ? 'bg-orange-300/90' : 'bg-orange-500/90'),

      footer: cn('mt-6 text-sm sm:text-base leading-relaxed', isDark ? 'text-white/65' : 'text-foreground/65'),
      footerAccent: cn(
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
              {t('landing:docsPayments.title', 'Договір, платежі та захист — без зайвого стресу')}
            </h2>
            <p className={cn('mt-3 text-base sm:text-lg leading-relaxed', styles.softText)}>
              {t('landing:docsPayments.subtitle', 'Rentera допомагає зробити оренду зрозумілою та спокійною з першого дня.')}
            </p>
          </motion.div>

          <div className={styles.grid}>
            {cards.map((c, idx) => (
              <motion.div
                key={c.titleKey}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.35, ease: 'easeOut', delay: Math.min(idx * 0.06, 0.18) }}
                className={cn(styles.card, styles.cardHover)}
              >
                <div className={styles.badge}>
                  <span className={styles.dot} aria-hidden="true" />
                  {t('landing:docsPayments.badge', 'Сервіс')}
                </div>

                <div className={styles.cardTitle}>{t(c.titleKey, c.titleFallback)}</div>
                <div className={styles.cardBody}>{t(c.bodyKey, c.bodyFallback)}</div>

                <div className={styles.bulletList}>
                  {c.bullets.map((b) => (
                    <div key={b.key} className={styles.bullet}>
                      <span className={styles.bulletIcon} aria-hidden="true" />
                      <span>{t(b.key, b.fallback)}</span>
                    </div>
                  ))}
                </div>

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
            {t('landing:docsPayments.footerPrefix', 'Оренда може бути без страху, великих сум наперед і ')}
            <span className={styles.footerAccent}>{t('landing:docsPayments.footerAccent', 'зайвого напруження')}</span>
            {t('landing:docsPayments.footerSuffix', '.')}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
