'use client';

import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
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

  const handleCreatePostClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (onCreatePostClick) {
      onCreatePostClick();
    }
  };

  const formatNumber = (value?: number): string => {
    if (typeof value !== 'number') return '—';
    return value.toLocaleString(i18n.language || 'en-US');
  };

  return (
    <section
      className={cn(
        'relative flex items-center justify-center',
        'w-full rounded-2xl md:rounded-3xl overflow-hidden',
        'min-h-[60vh] md:min-h-[70vh]',
        'px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16',
        className,
      )}
    >
      {/* ===== Фон с аурами и легкой текстурой ===== */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* мягкий верхний свет */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 block dark:hidden"
            style={{
              background:
                'radial-gradient(80% 60% at 50% -10%, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 70%)',
            }}
          />
          <div
            className="absolute inset-0 hidden dark:block"
            style={{
              background:
                'radial-gradient(80% 60% at 50% -10%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 70%)',
            }}
          />
        </div>

        {/* крупные цветные пятна */}
        <div
          className="absolute -top-40 -left-24 h-[30rem] w-[30rem] rounded-full blur-[120px]"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(255,140,90,0.55) 0%, rgba(255,140,90,0) 80%)',
          }}
        />
        <div
          className="absolute -bottom-40 -right-32 h-[34rem] w-[34rem] rounded-full blur-[140px]"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(120,110,255,0.55) 0%, rgba(120,110,255,0) 80%)',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px]"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(70,210,255,0.38) 0%, rgba(70,210,255,0) 80%)',
          }}
        />

        {/* лёгкая текстура */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-soft-light [background-image:url('/noise.png')]" />
      </div>

      {/* ===== Плавающие бейджи ===== */}
      <div className="pointer-events-none absolute inset-0 overflow-visible">
        <div className="absolute left-6 sm:left-8 top-10 sm:top-14 animate-float delay-100">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/65 dark:bg-white/10 backdrop-blur px-3 py-1.5 text-sm sm:text-base font-medium text-muted-foreground dark:text-muted-foreground ring-1 ring-white/50 dark:ring-white/15 shadow-sm select-none">
            {t('hero.badgeRealStories')} 📖
          </span>
        </div>
        <div className="absolute right-6 sm:right-10 top-24 sm:top-32 animate-float delay-300">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/65 dark:bg-white/10 backdrop-blur px-3 py-1.5 text-sm sm:text-base font-medium text-muted-foreground dark:text-muted-foreground ring-1 ring-white/50 dark:ring-white/15 shadow-sm select-none">
            {t('hero.badgeTrustedCommunity')} 🛡️
          </span>
        </div>
        <div className="absolute left-10 bottom-14 sm:bottom-16 animate-float delay-500">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/65 dark:bg-white/10 backdrop-blur px-3 py-1.5 text-sm sm:text-base font-medium text-muted-foreground dark:text-muted-foreground ring-1 ring-white/50 dark:ring-white/15 shadow-sm select-none">
            {t('hero.badgeOwnersRenters')} 🤝
          </span>
        </div>
      </div>

      {/* ===== Контент ===== */}
      <div className="relative z-10 flex w-full max-w-6xl flex-col gap-8 md:flex-row md:items-center">
        {/* Левая часть: текст + кнопка */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-sans bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-300 drop-shadow-lg">
  {t('hero.title')}
</h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground dark:text-muted-foreground max-w-xl mx-auto md:mx-0 leading-relaxed tracking-wide">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-start">
            <button
              type="button"
              onClick={handleCreatePostClick}
              className={cn(
                'inline-flex items-center justify-center',
                'px-6 sm:px-8 py-2.5 sm:py-3',
                'whitespace-nowrap',
                'rounded-full font-semibold text-sm sm:text-base',
                'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
                'shadow-lg hover:shadow-xl',
                'transition-all hover:scale-[1.03]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500',
              )}
            >
              {t('hero.ctaCreatePost')}
            </button>

            <p className="text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground max-w-xs text-center sm:text-left leading-relaxed">
              {t('hero.ctaHint')}
            </p>
          </div>
        </div>

        {/* Правая часть: статистика */}
        <div className="mt-6 flex-1 md:mt-0">
          <div className="mx-auto flex max-w-md flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard
                label={t('hero.stats.members')}
                value={formatNumber(stats?.membersCount)}
              />
              <StatCard
                label={t('hero.stats.posts')}
                value={formatNumber(stats?.postsCount)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== Анимация плавающих бейджей ===== */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-8px) translateX(4px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-float {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

interface StatCardProps {
  label: string;
  value: string;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-white/60 dark:border-white/10 bg-white/5 dark:bg-background-dark px-4 py-3 text-center shadow-md backdrop-blur">
      <span className="text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground">
        {label}
      </span>
      <span className="text-lg sm:text-xl font-semibold text-muted-foreground dark:text-muted-foreground">
        {value}
      </span>
    </div>
  );
}
