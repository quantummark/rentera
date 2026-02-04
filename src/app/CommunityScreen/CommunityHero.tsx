'use client';

import type { MouseEvent } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface CommunityHeroStats {
  membersCount?: number; // totalUsers
  postsCount?: number;
}

interface CommunityHeroProps {
  onCreatePostClick?: () => void;
  stats?: CommunityHeroStats;
  className?: string;
}

export default function CommunityHero({
  onCreatePostClick,
  stats,
  className,
}: CommunityHeroProps) {
  const { t, i18n } = useTranslation('community');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleCreatePostClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onCreatePostClick?.();
  };

  const formatNumber = (value?: number): string => {
    if (typeof value !== 'number') return '—';
    return value.toLocaleString(i18n.language || 'en-US');
  };

  const styles = useMemo(() => {
    // Контейнер hero — компактный, не “плакат на полэкрана”
    const sectionBase = cn(
      'relative w-full overflow-hidden rounded-2xl md:rounded-3xl',
      'px-4 sm:px-6 md:px-10',
      'py-10 sm:py-12', // компактно
      className
    );

    // Фон: мягкий, светлый/тёмный — но одинаково “дорого”
    const baseBg = isDark
      ? 'bg-[#0B0F17]'
      : 'bg-white';

    const border = isDark ? 'border-white/10' : 'border-black/10';

    const titleGradient = isDark
      ? 'bg-gradient-to-r from-orange-200 to-orange-400'
      : 'bg-gradient-to-r from-orange-400 to-orange-600';

    const subtitleText = isDark ? 'text-white/70' : 'text-foreground/70';

    const chipBase = isDark
      ? 'bg-white/8 border-white/12 text-white/80 hover:bg-white/10'
      : 'bg-black/[0.03] border-black/10 text-foreground/70 hover:bg-black/[0.05]';

    const cardBase = isDark
      ? 'bg-white/6 border-white/12 shadow-[0_18px_50px_rgba(0,0,0,0.35)]'
      : 'bg-black/[0.03] border-black/10 shadow-sm';

    const statLabel = isDark ? 'text-white/65' : 'text-foreground/60';
    const statValue = isDark ? 'text-white' : 'text-foreground';

    const primaryBtn = isDark
      ? 'bg-orange-500 text-white hover:bg-orange-400 shadow-[0_10px_30px_rgba(249,115,22,0.35)]'
      : 'bg-orange-500 text-white hover:bg-orange-600 shadow-[0_10px_30px_rgba(249,115,22,0.22)]';

    return {
      section: cn(sectionBase, 'border', border, baseBg),

      // декоративные слои фона
      bgWrap: 'pointer-events-none absolute inset-0 -z-10',

      // мягкая “вуаль” (вместо лишней темноты)
      vignette: isDark
        ? 'absolute inset-0 bg-[radial-gradient(1200px_500px_at_30%_0%,rgba(255,255,255,0.08),transparent_65%)]'
        : 'absolute inset-0 bg-[radial-gradient(1200px_500px_at_30%_0%,rgba(0,0,0,0.04),transparent_65%)]',

      // пятна
      glow1: cn(
        'absolute -top-44 -left-32 h-[32rem] w-[32rem] rounded-full blur-[130px] opacity-70',
        isDark ? 'bg-orange-500/20' : 'bg-orange-400/18'
      ),
      glow2: cn(
        'absolute -bottom-52 -right-40 h-[36rem] w-[36rem] rounded-full blur-[150px] opacity-70',
        isDark ? 'bg-indigo-500/20' : 'bg-indigo-400/16'
      ),
      glow3: cn(
        'absolute top-1/2 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[170px] opacity-60',
        isDark ? 'bg-cyan-500/14' : 'bg-cyan-400/14'
      ),

      // легкая зернистость
      noise: 'absolute inset-0 opacity-[0.05] mix-blend-soft-light [background-image:url("/noise.png")]',

      // layout content
      inner: 'relative z-10 mx-auto w-full max-w-6xl',

      grid: cn(
        'grid items-center gap-8',
        'md:grid-cols-[1.25fr_0.75fr]'
      ),

      // текстовый блок
      left: 'space-y-5',
      title: cn(
        'text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight',
        'bg-clip-text text-transparent select-none',
        titleGradient
      ),
      subtitle: cn(
        'text-base sm:text-lg leading-relaxed',
        subtitleText
      ),

      // chips под subtitle
      chipsRow: cn(
        'flex flex-wrap items-center gap-2 pt-1'
      ),
      chip: cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1.5',
        'text-xs sm:text-sm font-semibold',
        'transition-colors duration-200',
        chipBase
      ),
      chipDot: cn(
        'h-2 w-2 rounded-full',
        isDark ? 'bg-gradient-to-r from-orange-300 to-yellow-200' : 'bg-gradient-to-r from-orange-500 to-yellow-400'
      ),

      // action row
      actionRow: cn(
        'pt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start'
      ),
      primaryBtn: cn(
        'inline-flex items-center justify-center',
        'h-11 px-6 sm:px-7',
        'rounded-full font-semibold text-sm sm:text-base',
        'transition-all duration-200 hover:scale-[1.02]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500',
        primaryBtn
      ),
      hint: cn(
        'text-xs sm:text-sm leading-relaxed',
        isDark ? 'text-white/60' : 'text-foreground/60'
      ),

      // правая колонка
      right: 'md:justify-self-end',
      rightCard: cn(
        'rounded-3xl border p-4 sm:p-5 backdrop-blur',
        cardBase
      ),
      statsGrid: 'grid grid-cols-2 gap-3',
      statItem: cn(
        'rounded-2xl border px-4 py-3 text-center',
        isDark ? 'border-white/12 bg-white/6' : 'border-black/10 bg-white/60'
      ),
      statLabel: cn('text-xs sm:text-sm', statLabel),
      statValue: cn('mt-1 text-xl sm:text-2xl font-semibold', statValue),

      helperLine: cn(
        'mt-3 text-xs sm:text-sm leading-relaxed text-center',
        isDark ? 'text-white/60' : 'text-foreground/60'
      ),
    };
  }, [className, isDark]);

  return (
    <section className={styles.section}>
      {/* ===== Фон ===== */}
      <div className={styles.bgWrap} aria-hidden>
        <div className={styles.vignette} />
        <div className={styles.glow1} />
        <div className={styles.glow2} />
        <div className={styles.glow3} />
        <div className={styles.noise} />
      </div>

      {/* ===== Контент ===== */}
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Left */}
          <div className={styles.left}>
            <h1 className={styles.title}>{t('hero.title')}</h1>

            <p className={styles.subtitle}>{t('hero.subtitle')}</p>

            {/* Chips под subtitle (вместо плавающих) */}
            <div className={styles.chipsRow}>
              <span className={styles.chip}>
                <span className={styles.chipDot} aria-hidden />
                {t('hero.chips.realStories')}
                <span aria-hidden></span>
              </span>

              <span className={styles.chip}>
                <span className={styles.chipDot} aria-hidden />
                {t('hero.chips.trustedCommunity')}
                <span aria-hidden></span>
              </span>

              <span className={styles.chip}>
                <span className={styles.chipDot} aria-hidden />
                {t('hero.chips.ownersRenters')}
                <span aria-hidden></span>
              </span>
            </div>

            {/* CTA + hint */}
            <div className={styles.actionRow}>
              <button type="button" onClick={handleCreatePostClick} className={styles.primaryBtn}>
                {t('hero.ctaCreatePost')}
              </button>

              <p className={styles.hint}>{t('hero.ctaHint')}</p>
            </div>
          </div>

          {/* Right */}
          <div className={styles.right}>
            <div className={styles.rightCard}>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>{t('hero.stats.members')}</div>
                  <div className={styles.statValue}>{formatNumber(stats?.membersCount)}</div>
                </div>

                <div className={styles.statItem}>
                  <div className={styles.statLabel}>{t('hero.stats.posts')}</div>
                  <div className={styles.statValue}>{formatNumber(stats?.postsCount)}</div>
                </div>
              </div>

              <div className={styles.helperLine}>
                {t('hero.helperLine')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
