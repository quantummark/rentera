'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MapPin,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import {
  doc,
  onSnapshot,
  FirestoreError,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { cn } from '@/lib/utils';
import type {
  CommunityPostWithId,
  CommunityTopic,
} from '@/app/types/communityTypes';
import CommunityCommentsSection from '@/app/CommunityScreen/CommunityCommentsSection';
import { usePostLike } from '@/hooks/usePostLike';
import {
  MessageCircle as TopicMessage,
  Users,
  Wrench,
  Truck,
  Wallet,
  Smile,
  X,
  MapPin as TopicPin,
} from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface PostFullViewProps {
  postId: string;
  initialPost?: CommunityPostWithId;
  className?: string;
}

type TopicIconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export default function PostFullView({
  postId,
  initialPost,
  className,
}: PostFullViewProps) {
  const { t, i18n } = useTranslation('community');

  const [post, setPost] = useState<CommunityPostWithId | null>(initialPost ?? null);
  const [loading, setLoading] = useState<boolean>(!initialPost);
  const [error, setError] = useState<FirestoreError | null>(null);

  const { likedByMe, loading: likeLoading, toggleLike } = usePostLike(postId);

  const [copying, setCopying] = useState(false);
  const [copied, setCopied] = useState(false);

  // 🔥 новый стейт для просмотра картинок
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleOpenImage = (index: number) => {
    if (!post?.images || post.images.length === 0) return;
    setActiveImageIndex(index);
    setImageViewerOpen(true);
  };

  const handleCloseImage = () => {
    setImageViewerOpen(false);
  };

  const handleNextImage = () => {
    if (!post?.images || post.images.length === 0) return;
    setActiveImageIndex((prev) => (prev + 1) % post.images.length);
  };

  const handlePrevImage = () => {
    if (!post?.images || post.images.length === 0) return;
    setActiveImageIndex((prev) =>
      (prev - 1 + post.images.length) % post.images.length,
    );
  };

  useEffect(() => {
    if (!postId) return;

    setLoading(true);
    setError(null);

    const ref = doc(db, 'community_posts', postId);

    const unsubscribe = onSnapshot(
      ref,
      snap => {
        if (!snap.exists()) {
          setPost(null);
          setLoading(false);
          return;
        }
        const data = snap.data() as Omit<CommunityPostWithId, 'id'>;
        setPost({
          id: snap.id,
          ...data,
        });
        setLoading(false);
      },
      (err: FirestoreError) => {
        // eslint-disable-next-line no-console
        console.error('PostFullView error:', err);
        setError(err);
        setLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const locale = i18n.language || 'uk-UA';

  const handleCopyLink = async () => {
    if (!post) return;
    if (copying) return;

    setCopying(true);
    setCopied(false);

    try {
      const origin =
        typeof window !== 'undefined'
          ? window.location.origin
          : 'https://renterya.com';

      const url = `${origin}/community/post/${post.id}`;

      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to copy link:', err);
    } finally {
      setCopying(false);
    }
  };

  if (loading && !post) {
    return (
      <article
        className={cn(
          'w-full rounded-3xl border border-white/60 dark:border-white/10',
          'bg-white/5 dark:bg-background-dark backdrop-blur shadow-md',
          'px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-7',
          className,
        )}
      >
        <PostSkeleton />
      </article>
    );
  }

  if (error) {
    return (
      <article
        className={cn(
          'w-full rounded-3xl border border-red-200/70 dark:border-red-900/70',
          'bg-red-50/80 dark:bg-red-950/40 backdrop-blur px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-7',
          className,
        )}
      >
        <p className="text-sm text-red-700 dark:text-red-200">
          {t('post.error') ?? 'Не вдалося завантажити пост.'}
        </p>
      </article>
    );
  }

  if (!post) {
    return (
      <article
        className={cn(
          'w-full rounded-3xl border border-slate-200/70 dark:border-slate-800/70',
          'bg-white/5 dark:bg-background-dark backdrop-blur px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-7',
          className,
        )}
      >
        <p className="text-sm text-muted-foreground">
          {t('post.notFound') ?? 'Пост не знайдено.'}
        </p>
      </article>
    );
  }

  const createdAtLabel = formatDate(post.createdAt, locale);
  const topicLabel = getTopicLabel(post.topic, t);
  const topicIcon = getTopicIcon(post.topic);
  const TopicIcon = topicIcon;

  const canShowImages = Array.isArray(post.images) && post.images.length > 0;

  const likeButtonActive = likedByMe;

  return (
    <article
      className={cn(
        'w-full rounded-3xl border border-white/60 dark:border-white/10',
        'bg-white/5 dark:bg-background-dark backdrop-blur shadow-md',
        'px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-7 space-y-5 sm:space-y-6',
        className,
      )}
    >
      {/* Header */}
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-1 gap-3">
          <Link
  href={
    post.authorRole === 'owner'
      ? `/profile/owner/${post.authorUid}`
      : `/profile/renter/${post.authorUid}`
  }
  className="mt-0.5 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-semibold text-slate-700 dark:text-slate-200 hover:ring-2 hover:ring-orange-400/40 transition"
>
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
</Link>

          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <Link
                href={
                  post.authorRole === 'owner'
                    ? `/profile/owner/${post.authorUid}`
                    : `/profile/renter/${post.authorUid}`
                }
                className="text-sm font-semibold text-foreground hover:underline"
              >
                {post.authorName}
              </Link>
              <span className="rounded-full bg-white/5 dark:bg-background-dark border border-slate-200/70 dark:border-slate-200/70 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground dark:text-muted-foreground">
                {post.authorRole === 'owner'
                  ? t('feed.badges.owner')
                  : t('feed.badges.renter')}
              </span>
              {post.authorCity && (
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <MapPin className="h-3 w-3" aria-hidden="true" />
                  {post.authorCity}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              <div className="inline-flex items-center gap-1 rounded-full bg-white/5 dark:bg-background-dark border border-slate-200/70 dark:border-slate-200/70 px-2 py-0.5 text-[11px] font-medium text-muted-foreground dark:text-muted-foreground">
                {TopicIcon && <TopicIcon className="h-3 w-3" aria-hidden="true" />}
                <span>{topicLabel}</span>
              </div>
              {post.city && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" aria-hidden="true" />
                  {post.city}
                </span>
              )}
              <span>· {createdAtLabel}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="space-y-4">
        <p className="text-sm sm:text-base leading-relaxed text-foreground whitespace-pre-line">
          {post.content}
        </p>

        {canShowImages && (
  <div className="mt-2">
    {post.images.length === 1 ? (
      <button
        type="button"
        onClick={() => handleOpenImage(0)}
        className="block w-full overflow-hidden rounded-2xl border border-white/40 dark:border-white/10 bg-slate-950/5 dark:bg-slate-950/40 cursor-zoom-in"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.images[0]}
          alt="Post image"
          className="aspect-square w-full object-cover"
        />
      </button>
    ) : (
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {post.images.slice(0, 4).map((url, index) => (
          <button
            key={url}
            type="button"
            onClick={() => handleOpenImage(index)}
            className={cn(
              'overflow-hidden rounded-xl border border-white/30 dark:border-white/10 bg-slate-950/5 dark:bg-slate-950/40 cursor-zoom-in',
              index === 0 && post.images.length > 2 && 'col-span-2',
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`Post image ${index + 1}`}
              className="h-40 w-full object-cover sm:h-48 md:h-56"
            />
          </button>
        ))}
      </div>
    )}
  </div>
)}
      </section>

      {/* Action bar */}
      <section className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/70 pt-3 text-xs text-muted-foreground dark:border-slate-200/70">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {/* Like */}
          <button
            type="button"
            onClick={toggleLike}
            disabled={likeLoading}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all',
              'border border-slate-200/70 dark:border-slate-200/70',
              likeButtonActive
                ? 'bg-red-500/80 text-white shadow-md shadow-red-500/40'
                : 'bg-white/5 dark:bg-white/5 text-foreground hover:bg-white/10 dark:hover:bg-white/10',
              likeLoading && 'opacity-60 cursor-not-allowed',
            )}
          >
            <Heart
              className={cn('h-4 w-4', likeButtonActive && 'fill-current')}
              aria-hidden="true"
            />
            <span className="text-xs font-medium">{post.likesCount}</span>
          </button>

          {/* Comments counter */}
          <div
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5',
              'bg-white/5 dark:bg-white/5 border border-slate-200/70 dark:border-slate-200/70',
              'text-foreground',
            )}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs font-medium">{post.commentsCount}</span>
          </div>

          {/* Copy link / share */}
          <button
            type="button"
            onClick={handleCopyLink}
            disabled={copying}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5',
              'bg-white/5 dark:bg-white/5 border border-slate-200/70 dark:border-slate-200/70',
              'text-foreground hover:bg-white/10 dark:hover:bg-white/10 transition-all',
              copying && 'opacity-60 cursor-wait',
            )}
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs font-medium">
              {copied
                ? t('post.copied') ?? 'Посилання скопійовано'
                : t('post.share') ?? 'Поділитися'}
            </span>
          </button>

          {/* Save (на будущее) */}
          <button
            type="button"
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5',
              'bg-white/5 dark:bg-white/5 border border-slate-200/70 dark:border-slate-200/70',
              'text-foreground hover:bg-white/10 dark:hover:bg-white/10 transition-all',
            )}
          >
            <Bookmark className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs font-medium">
              {t('post.save') ?? 'Зберегти'}
            </span>
          </button>
        </div>

        <div className="text-[11px] text-muted-foreground">
          {t('post.stats', {
            likes: post.likesCount,
            comments: post.commentsCount,
          })}
        </div>
      </section>

      {/* Comments */}
      <CommunityCommentsSection
        postId={post.id}
        className="mt-2"
        initialCount={post.commentsCount}
      />
      {/* 🔥 Полноэкранный просмотр изображений */}
      {canShowImages && (
        <Dialog open={imageViewerOpen} onOpenChange={setImageViewerOpen}>
          <DialogContent className="max-w-screen-xl w-full h-[90vh] p-0 bg-black text-white">
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={post.images[activeImageIndex]}
                alt={`Post image ${activeImageIndex + 1}`}
                fill
                className="object-contain"
              />

              {/* Кнопка закрытия (дополнительно к встроенной в DialogContent) */}
              <button
                type="button"
                onClick={handleCloseImage}
                className="absolute top-4 right-4 z-10 p-2 bg-black/70 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Стрелки переключения */}
              {post.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/70 rounded-full"
                  >
                    <ChevronLeft className="h-7 w-7" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/70 rounded-full"
                  >
                    <ChevronRight className="h-7 w-7" />
                  </button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </article>
  );
}

// ===== Skeleton / helpers =====

function PostSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="mt-1 h-10 w-10 rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-32 rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
          <div className="h-3 w-48 rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3.5 w-full rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
        <div className="h-3.5 w-5/6 rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
        <div className="h-3.5 w-2/3 rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
      </div>
      <div className="h-40 w-full rounded-2xl bg-slate-200/80 dark:bg-slate-800/80" />
    </div>
  );
}

function formatDate(value: Timestamp, locale: string): string {
  try {
    const date = value.toDate();
    return date.toLocaleDateString(locale || 'uk-UA', {
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

function getTopicLabel(topic: CommunityTopic, t: (key: string) => string): string {
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

function getTopicIcon(topic: CommunityTopic): TopicIconType | null {
  switch (topic) {
    case 'experience':
      return TopicMessage;
    case 'roommates':
      return Users;
    case 'household':
      return Wrench;
    case 'moving':
      return Truck;
    case 'finance':
      return Wallet;
    case 'fun':
      return Smile;
    case 'recommendations':
      return TopicPin;
    default:
      return TopicMessage;
  }
}
