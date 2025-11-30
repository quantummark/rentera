'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { usePostComments, type CommentTree } from '@/hooks/usePostComments';
import { useUserTypeWithProfile } from '@/hooks/useUserType';

interface CommunityCommentsSectionProps {
  postId: string;
  className?: string;
  initialCount?: number;
}

export default function CommunityCommentsSection({
  postId,
  className,
  initialCount,
}: CommunityCommentsSectionProps) {
  const { t, i18n } = useTranslation('community');
  const { comments, loading, error, addComment, replyToComment } = usePostComments(postId);
  const [userType, userProfile, userLoading] = useUserTypeWithProfile();

  const [newCommentText, setNewCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canComment = !!userType && !!userProfile && !userLoading;

  const totalCount =
    typeof initialCount === 'number' && initialCount >= 0
      ? initialCount
      : comments.reduce((acc, root) => acc + 1 + root.replies.length, 0);

  const handleSubmitNew = async () => {
    const trimmed = newCommentText.trim();
    if (!trimmed || submitting) return;

    try {
      setSubmitting(true);
      await addComment(trimmed);
      setNewCommentText('');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to add comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className={cn(
        'w-full rounded-2xl bg-white/5 dark:bg-background-dark backdrop-blur shadow-md border border-white/60 dark:border-white/10 backdrop-blur px-4 sm:px-5 md:px-6 py-4 sm:py-5 md:py-6',
        className,
      )}
    >
      {/* header */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-300">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-foreground">
            {t('comments.title')}
          </h3>
        </div>
        <span className="rounded-full bg-white/5 dark:bg-background-dark border border-slate-200/70 dark:border-slate-200/70 px-2.5 py-1 text-xs font-medium text-muted-foreground dark:text-muted-foreground">
          {t('comments.count', { count: totalCount })}
        </span>
      </div>

      {/* error */}
      {error && (
        <div className="mb-3 rounded-xl border border-red-200/80 bg-red-50/80 px-3 py-2 text-xs text-red-700">
          {t('comments.error')}
        </div>
      )}

      {/* composer */}
      <div className="mb-4 sm:mb-5">
        {canComment ? (
          <div className="flex gap-3">
            {/* avatar */}
            <div className="mt-1 h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-semibold text-slate-700 dark:text-slate-200">
              {userProfile?.profileImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userProfile.profileImageUrl}
                  alt={userProfile.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{getInitials(userProfile.fullName)}</span>
              )}
            </div>

            {/* textarea + button */}
            <div className="flex-1 space-y-2">
              <textarea
                value={newCommentText}
                onChange={e => setNewCommentText(e.target.value)}
                rows={2}
                className={cn(
                  'w-full resize-none rounded-xl border border-slate-200/70 dark:border-slate-200/70',
                  'bg-white/5 dark:bg-background-dark',
                  'px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 focus:ring-offset-background',
                )}
                placeholder={t('comments.placeholder') ?? ''}
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmitNew}
                  disabled={submitting || !newCommentText.trim()}
                  className={cn(
                    'inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all',
                    'bg-orange-500 text-white shadow-sm hover:shadow-md hover:bg-orange-600',
                    'disabled:cursor-not-allowed disabled:opacity-60',
                  )}
                >
                  {submitting ? t('comments.sending') : t('comments.send')}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-between gap-2 rounded-xl border border-dashed border-slate-200/80 bg-slate-50/80 px-3 py-3 text-center sm:flex-row sm:gap-3 sm:text-left dark:border-slate-800/80 dark:bg-slate-900/60">
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t('comments.loginPrompt')}
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-orange-500/80 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-orange-600 hover:bg-orange-50/80 dark:text-orange-300 dark:hover:bg-orange-900/20"
            >
              {t('comments.loginButton')}
            </Link>
          </div>
        )}
      </div>

      {/* list */}
      <div className="space-y-3 sm:space-y-4">
        {loading && comments.length === 0 && (
          <>
            <CommentSkeleton />
            <CommentSkeleton />
          </>
        )}

        {!loading && comments.length === 0 && (
          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            {t('comments.empty')}
          </p>
        )}

        {comments.map(root => (
          <CommentItem
            key={root.id}
            node={root}
            depth={0}
            onReply={replyToComment}
            canReply={canComment}
            currentUserUid={userProfile?.uid}
            locale={i18n.language}
          />
        ))}
      </div>
    </section>
  );
}

// ===== Comment Item =====

interface CommentItemProps {
  node: CommentTree;
  depth: number;
  onReply: (parentId: string, content: string) => Promise<void>;
  canReply: boolean;
  currentUserUid?: string;
  locale: string;
}

function CommentItem({
  node,
  depth,
  onReply,
  canReply,
  currentUserUid,
  locale,
}: CommentItemProps) {
  const { t } = useTranslation('community');
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  const isOwner = currentUserUid === node.authorUid;
  const createdAtLabel = formatDate(node.createdAt, locale);

  const handleReplySubmit = async () => {
    const trimmed = replyText.trim();
    if (!trimmed || replyLoading) return;

    try {
      setReplyLoading(true);
      await onReply(node.id, trimmed);
      setReplyText('');
      setIsReplying(false);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to send reply:', err);
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <div
      className={cn(
        'flex gap-3',
        depth > 0 && 'ml-6 border-l border-slate-200/70 pl-3 dark:border-slate-700/70',
      )}
    >
      {/* avatar */}
      <div className="mt-1 h-7 w-7 flex-shrink-0 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-semibold text-slate-700 dark:text-slate-200">
        {node.authorAvatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={node.authorAvatarUrl}
            alt={node.authorName}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{getInitials(node.authorName)}</span>
        )}
      </div>

      {/* body */}
      <div className="flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs">
          <span className="font-semibold text-foreground">{node.authorName}</span>
          <span className="rounded-full bg-white/5 dark:bg-background-dark border border-slate-200/70 dark:border-slate-200/70 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground dark:text-muted-foreground">
            {node.authorRole === 'owner' ? t('feed.badges.owner') : t('feed.badges.renter')}
          </span>
          {node.authorCity && (
            <span className="text-[10px] text-muted-foreground">· {node.authorCity}</span>
          )}
          <span className="text-[10px] text-muted-foreground">· {createdAtLabel}</span>
          {isOwner && (
            <span className="text-[10px] font-medium text-orange-500">
              {t('comments.you')}
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-line">
          {node.content}
        </p>

        <div className="flex items-center gap-3 pt-0.5">
          {canReply && (
            <button
              type="button"
              onClick={() => setIsReplying(prev => !prev)}
              className="text-[11px] sm:text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              {t('comments.reply')}
            </button>
          )}
        </div>

        {/* reply composer */}
        {canReply && isReplying && (
          <div className="mt-2 space-y-2">
            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              rows={2}
              className={cn(
                'w-full resize-none rounded-xl border border-slate-200/70 dark:border-slate-200/70',
                'bg-white/5 dark:bg-background-dark',
                'px-3 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 focus:ring-offset-background',
              )}
              placeholder={t('comments.replyPlaceholder') ?? ''}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsReplying(false);
                  setReplyText('');
                }}
                className="text-[11px] sm:text-xs text-muted-foreground hover:text-foreground"
              >
                {t('comments.cancel')}
              </button>
              <button
                type="button"
                onClick={handleReplySubmit}
                disabled={replyLoading || !replyText.trim()}
                className={cn(
                  'inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] sm:text-xs font-semibold transition-all',
                  'bg-orange-500 text-white shadow-sm hover:shadow-md hover:bg-orange-600',
                  'disabled:cursor-not-allowed disabled:opacity-60',
                )}
              >
                {replyLoading ? t('comments.sending') : t('comments.send')}
              </button>
            </div>
          </div>
        )}

        {/* children */}
        {node.replies.length > 0 && (
          <div className="mt-2 space-y-3">
            {node.replies.map(reply => (
              <CommentItem
                key={reply.id}
                node={reply}
                depth={depth + 1}
                onReply={onReply}
                canReply={canReply}
                currentUserUid={currentUserUid}
                locale={locale}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== Skeleton =====

function CommentSkeleton() {
  return (
    <div className="flex gap-3">
      <div className="mt-1 h-7 w-7 flex-shrink-0 rounded-full bg-slate-200 dark:bg-slate-800" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-32 rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
        <div className="h-3 w-full rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
        <div className="h-3 w-2/3 rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
      </div>
    </div>
  );
}

// ===== helpers =====

function getInitials(name: string): string {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

function formatDate(value: Timestamp, locale: string): string {
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
