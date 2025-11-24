'use client';

import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { CommunityTopic } from '@/hooks/useCommunityPosts';
import {
  MessageCircle,
  Users,
  Wrench,
  Truck,
  Wallet,
  Smile,
  MapPin,
  KeyRound
} from 'lucide-react';

export type CommunityTopicFilter = CommunityTopic | 'all';

interface CommunityTopicMenuProps {
  activeTopic: CommunityTopicFilter;
  onTopicChange: (topic: CommunityTopicFilter) => void;
  className?: string;
}

interface TopicConfig {
  id: CommunityTopicFilter;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  labelKey: string;
  iconBgClass: string;
  iconTintClass: string;
}

const TOPICS: TopicConfig[] = [
  {
    id: 'all',
    icon: MessageCircle,
    labelKey: 'community:topics.all',
    iconBgClass: 'bg-slate-200/40 dark:bg-slate-200/40',
    iconTintClass: 'text-slate-800 dark:text-slate-800',
  },
  {
    id: 'experience',
    icon: KeyRound,
    labelKey: 'community:topics.experience',
    iconBgClass: 'bg-orange-500/20 dark:bg-orange-500/20',
    iconTintClass: 'text-orange-700 dark:text-orange-700',
  },
  {
    id: 'roommates',
    icon: Users,
    labelKey: 'community:topics.roommates',
    iconBgClass: 'bg-emerald-500/20 dark:bg-emerald-500/20',
    iconTintClass: 'text-emerald-700 dark:text-emerald-700',
  },
  {
    id: 'household',
    icon: Wrench,
    labelKey: 'community:topics.household',
    iconBgClass: 'bg-sky-500/20 dark:bg-sky-500/20',
    iconTintClass: 'text-sky-700 dark:text-sky-700',
  },
  {
    id: 'moving',
    icon: Truck,
    labelKey: 'community:topics.moving',
    iconBgClass: 'bg-indigo-500/20 dark:bg-indigo-500/20',
    iconTintClass: 'text-indigo-700 dark:text-indigo-700',
  },
  {
    id: 'finance',
    icon: Wallet,
    labelKey: 'community:topics.finance',
    iconBgClass: 'bg-amber-500/20 dark:bg-amber-500/20',
    iconTintClass: 'text-amber-700 dark:text-amber-700',
  },
  {
    id: 'fun',
    icon: Smile,
    labelKey: 'community:topics.fun',
    iconBgClass: 'bg-pink-500/20 dark:bg-pink-500/20',
    iconTintClass: 'text-pink-700 dark:text-pink-700',
  },
  {
    id: 'recommendations',
    icon: MapPin,
    labelKey: 'community:topics.recommendations',
    iconBgClass: 'bg-teal-500/20 dark:bg-teal-500/20',
    iconTintClass: 'text-teal-700 dark:text-teal-700',
  },
];

export default function CommunityTopicMenu({
  activeTopic,
  onTopicChange,
  className,
}: CommunityTopicMenuProps) {
  const { t } = useTranslation('community');

  return (
    <nav
      aria-label={t('community:topics.ariaLabel')}
      className={cn(
        'w-full rounded-2xl bg-background/60 dark:bg-background-dark',
        'border border-gray-300 dark:border-gray-300',
        'backdrop-blur px-3 sm:px-4 py-3 sm:py-4',
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm sm:text-base font-semibold text-foreground">
          {t('community:topics.title')}
        </h2>
        <p className="hidden text-xs text-muted-foreground sm:block">
          {t('community:topics.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {TOPICS.map(({ id, icon: Icon, labelKey, iconBgClass, iconTintClass }) => {
          const isActive = id === activeTopic;

          return (
            <button
              key={id}
              type="button"
              onClick={() => onTopicChange(id)}
              className={cn(
  'flex h-full flex-col items-center justify-between rounded-2xl px-3 py-3 sm:px-4 sm:py-4 text-center text-xs sm:text-sm font-medium transition-all',
  'backdrop-blur-sm bg-white/5 dark:bg-white/5', // стеклянный фон
  'border border-white/10 shadow-sm', // лёгкая, тонкая рамка
  'text-foreground',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500',

  // активная тема — мягкая рамка + glow
  isActive
    ? [
        'border-orange-400/70',
        'shadow-md shadow-orange-400/20',
        'bg-orange-500/10 dark:bg-orange-400/10',
        'backdrop-blur-md', // чуть сильнее стекло
      ].join(' ')
    : [
        // hover — минимальный акцент: тень и рамочка
        'hover:border-orange-300/40 hover:shadow-md hover:shadow-orange-300/10',
      ].join(' ')
)}
            >
              <span
  className={cn(
    'mb-2 flex h-11 w-11 items-center justify-center rounded-full',
    'backdrop-blur-md border border-white/25 shadow-sm',
    iconBgClass,
    isActive && 'border-orange-400/80 shadow-md shadow-orange-400/40',
  )}
>
  <Icon
    className={cn('h-5 w-5', iconTintClass)}
    aria-hidden="true"
  />
</span>
<span className="leading-snug">{t(labelKey)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
