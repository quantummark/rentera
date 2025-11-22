'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Timestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { useCommunityPosts, type CommunityTopic, type CommunityPostWithId } from '@/hooks/useCommunityPosts';
import type { CommunityTopicFilter } from './CommunityTopicMenu';
import { MessageCircle, Heart, Bookmark, MapPin } from 'lucide-react';

interface CommunityFeedProps {
  activeTopic: CommunityTopicFilter;
  limit?: number;
  className?: string;
}

export default function CommunityFeed({ activeTopic, limit = 20, className }: CommunityFeedProps) {
  const { t } = useTranslation('community');

  const { posts, loading, error } = useCommunityPosts({
    topic: activeTopic,
    limit,
  });

  const isEmpty = !loading && !error && posts.length === 0;

  const emptyMessage = useMemo(() => {
    if (activeTopic === 'all') {
      return t('feed.emptyAll');
    }
    return t('feed.emptyTopic');
  }, [activeTopic, t]);

  return (
    <section className={cn('w-full space-y-3 sm:space-y-4', className)}>
      {/* ошибки */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs sm:text-sm text-red-700">
          {t('feed.errorGeneric')}
        </div>
      )}

      {/* состояние загрузки */}
      {loading && (
        <div className="space-y-3 sm:space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonPostCard key={index} />
          ))}
        </div>
      )}

      {/* пустое состояние */}
      {isEmpty && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-6 text-center text-xs sm:text-sm text-muted-foreground dark:border-slate-700 dark:bg-slate-900/40">
          {emptyMessage}
        </div>
      )}

      {/* посты */}
      {!loading && !isEmpty && posts.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          {posts.map(post => (
            <CommunityPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}

// ===== карточка поста =====

interface CommunityPostCardProps {
  post: CommunityPostWithId;
}

function CommunityPostCard({ post }: CommunityPostCardProps) {
  const { t, i18n } = useTranslation('community');

  const createdAtLabel = useMemo(() => formatDate(post.createdAt, i18n.language), [post.createdAt, i18n.language]);
  const topicLabel = useMemo(() => topicToLabel(post.topic, t), [post.topic, t]);

  const firstImage = post.images && post.images.length > 0 ? post.images[0] : null;

  return (
    <article
      className={cn(
        'w-full rounded-2xl md:rounded-3xl rounded-2xl bg-background/60 dark:bg-slate-900/60',
        'border border-slate-100/80 dark:border-slate-800/80',
        'shadow-sm hover:shadow-lg transition-shadow',
        'px-4 sm:px-5 md:px-6 py-3.5 sm:py-4 md:py-5',
      )}
    >
      {/* header */}
      <header className="flex items-start gap-3 sm:gap-4">
        <div className="mt-0.5 h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-semibold text-slate-600 dark:text-slate-200">
          {post.authorAvatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.authorAvatarUrl}
              alt={post.authorName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{getInitials(post.authorName)}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="max-w-[60%] truncate text-sm sm:text-base font-semibold text-foreground">
              {post.authorName}
            </span>
            <span className="rounded-full bg-slate-100/80 dark:bg-slate-800/80 px-2 py-0.5 text-[10px] sm:text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-300">
              {post.authorRole === 'owner'
                ? t('feed.badges.owner')
                : t('feed.badges.renter')}
            </span>
            {post.authorCity && (
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                {post.authorCity}
              </span>
            )}
          </div>

          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
            <span>{createdAtLabel}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50/80 dark:bg-orange-900/30 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-orange-700 dark:text-orange-300">
              {topicLabel}
            </span>
          </div>
        </div>
      </header>

      {/* body */}
      <div className="mt-3 space-y-3">
        <p className="text-sm sm:text-base text-foreground dark:text-slate-50 leading-relaxed whitespace-pre-line">
          {post.content}
        </p>

        {firstImage && (
          <div className="overflow-hidden rounded-xl border border-slate-100/80 dark:border-slate-800/80 bg-slate-100/80 dark:bg-slate-900/80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={firstImage}
              alt={t('feed.imageAlt')}
              className="h-48 w-full object-cover sm:h-56 md:h-64"
            />
          </div>
        )}
      </div>

      {/* footer */}
      <footer className="mt-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
          <div className="inline-flex items-center gap-1.5">
            <Heart className="h-4 w-4" aria-hidden="true" />
            <span>{post.likesCount}</span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            <span>{post.commentsCount}</span>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-transparent px-3 py-1 text-xs sm:text-sm font-medium text-muted-foreground hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors"
        >
          <Bookmark className="h-4 w-4" aria-hidden="true" />
          <span>{t('feed.save')}</span>
        </button>
      </footer>
    </article>
  );
}

// ===== skeleton-карточка =====

function SkeletonPostCard() {
  return (
    <div className="w-full rounded-2xl md:rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-100/80 dark:border-slate-800/80 shadow-sm px-4 sm:px-5 md:px-6 py-3.5 sm:py-4 md:py-5 animate-pulse">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-32 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-5/6 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-3/4 rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="mt-4 h-40 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}

// ===== helpers =====

function formatDate(value?: Timestamp | null, locale?: string): string {
  if (!value) return '';
  try {
    const date = value.toDate();
    return date.toLocaleDateString(locale || 'en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

function getInitials(name: string): string {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

function topicToLabel(topic: CommunityTopic, t: (key: string) => string): string {
  switch (topic) {
    case 'experience':
      return t('topics.experience');
    case 'roommates':
      return t('topics.roommates');
    case 'household':
      return t('topics.household');
    case 'moving':
      return t('topics.moving');
    case 'finance':
      return t('topics.finance');
    case 'fun':
      return t('topics.fun');
    case 'recommendations':
      return t('topics.recommendations');
    default:
      return t('topics.all');
  }
}
