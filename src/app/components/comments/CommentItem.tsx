'use client';

import { useState, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';
import type { CommentType } from './CommentSection';
import { Timestamp } from 'firebase/firestore';
import { replyToComment } from '@/app/lib/firestore/comments';

type Role = 'owner' | 'renter';
type Context = 'owner' | 'renter' | 'listings';

interface CommentItemProps {
  comment: CommentType;
  userRole: Role | null;      // может быть null, пока роль не загрузилась
  contextType: Context;
}

function canReplyToThis(contextType: Context, userRole: Role | null) {
  if (!userRole) return false;
  if (contextType === 'listings') return true;
  if (contextType === 'owner') return userRole === 'renter';
  if (contextType === 'renter') return userRole === 'owner';
  return false;
}

function safeDateString(
  ts: Timestamp | Date | null | undefined,
  locale: string = 'ru-RU'
): string | null {
  if (!ts) return null;

  // Если это Firestore Timestamp
  if (ts instanceof Timestamp) {
    try {
      return ts.toDate().toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return null;
    }
  }

  // Если это обычная Date
  if (ts instanceof Date) {
    try {
      return ts.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return null;
    }
  }

  return null;
}

export default function CommentItem({
  comment,
  userRole,
  contextType,
}: CommentItemProps) {
  const { t, i18n } = useTranslation('comments');
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  const canReply = canReplyToThis(contextType, userRole);

  const createdAtStr = useMemo(
    () => safeDateString(comment.createdAt, i18n.language) ?? t('noDate'),
    [comment.createdAt, i18n.language, t]
  );

  const initials =
    (comment.authorName || 'U')
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'U';

  const replyLabel = useMemo(() => {
    const role = comment.reply?.authorRole;
    if (role === 'owner') return t('ownerReply');
    if (role === 'renter') return t('renterReply');
    // Фолбэк — по контексту
    return contextType === 'owner' ? t('ownerReply') : t('renterReply');
  }, [comment.reply?.authorRole, contextType, t]);

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    setLoading(true);
    try {
      // твоя функция сейчас принимает (commentId, text)
      await replyToComment(comment.id, replyText.trim());
      setReplyText('');
      setShowReply(false);
    } catch (error) {
      // можно дополнить тостом
      console.error('Помилка при відповіді на коментар:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-start gap-3 max-w-[720px]">
      {/* Аватар */}
      <Avatar className="w-10 h-10 mt-0.5">
        <AvatarImage src={comment.authorPhotoUrl || ''} alt={comment.authorName} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      {/* Пузырь */}
      <div className="relative bg-muted p-4 rounded-xl shadow-sm w-full">
        {/* Хвостик */}
        <div className="absolute -left-1 top-5 w-3 h-3 bg-muted rotate-45" />

        {/* Шапка */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold">{comment.authorName}</p>
          <p className="text-xs text-muted-foreground">{createdAtStr}</p>
        </div>

        {/* Текст */}
        <p className="text-sm text-foreground whitespace-pre-line mt-1">{comment.content}</p>

        {/* Блок с ответом (если есть) */}
        {comment.reply?.text && (
          <div className="mt-4 border-l-2 border-muted pl-4 ml-2 space-y-1">
            <p className="text-sm text-muted-foreground font-medium">{replyLabel}</p>
            <p className="text-sm text-foreground whitespace-pre-line">{comment.reply.text}</p>
            {comment.reply.createdAt && (
              <p className="text-xs text-muted-foreground">
                {safeDateString(comment.reply.createdAt, i18n.language) ?? ''}
              </p>
            )}
          </div>
        )}

        {/* Кнопка «Ответить» и форма */}
        {canReply && !comment.reply?.text && (
          <div className="mt-3">
            {!showReply ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReply(true)}
                className="text-sm text-orange-500 hover:underline"
              >
                {userRole === 'owner' ? t('replyToRenter') : t('replyToOwner')}
              </Button>
            ) : (
              <div className="mt-2 space-y-2">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={t('replyPlaceholder') as string}
                  className="w-full text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleReplySubmit}
                    disabled={loading || !replyText.trim()}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {t('send')}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowReply(false)}>
                    {t('cancel')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
