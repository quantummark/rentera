'use client';

import { useState } from 'react';
import { CommentType } from '@/app/types/comment';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';
import { replyToComment } from '@/app/lib/firestore/comments';

interface CommentItemProps {
  comment: CommentType;
  currentUserId: string;
  userRole: 'owner' | 'renter';
  contextType: 'owner' | 'renter' | 'listings';
  contextId: string;
}

export default function CommentItem({
  comment,
  currentUserId,
  userRole,
  contextType,
  contextId,
}: CommentItemProps) {
  const { t } = useTranslation();
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  const canReply =
    (userRole === 'owner' && contextType === 'owner') ||
    (userRole === 'renter' && contextType === 'renter');

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    setLoading(true);
    try {
      await replyToComment(comment.id, replyText);
      setReplyText('');
      setShowReply(false);
    } catch (error) {
      console.error('Ошибка при отправке ответа:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-muted p-4 space-y-3 bg-card">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={comment.authorPhotoUrl || ''} />
          <AvatarFallback>
            {comment.authorName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-foreground">{comment.authorName}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(comment.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
        {comment.content}
      </p>

      {comment.reply && (
        <div className="ml-6 mt-3 border-l-2 border-muted pl-4 space-y-1">
          <p className="text-sm text-muted-foreground">
            {userRole === 'owner'
              ? t('commentItem.ownerReply', 'Ответ владельца:')
              : t('commentItem.renterReply', 'Ответ арендатора:')}
          </p>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
            {comment.reply.text}
          </p>
        </div>
      )}

      {canReply && !comment.reply && (
        <div className="ml-6">
          {!showReply ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReply(true)}
              className="text-sm text-orange-500 hover:underline"
            >
              {userRole === 'owner'
                ? t('commentItem.replyToRenter', 'Ответить арендатору')
                : t('commentItem.replyToOwner', 'Ответить владельцу')}
            </Button>
          ) : (
            <div className="mt-2 space-y-2">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={t('commentItem.replyPlaceholder', 'Напишите ваш ответ...')}
                className="w-full max-w-md text-sm"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleReplySubmit}
                  disabled={loading || !replyText.trim()}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {t('commentItem.sendReply', 'Отправить')}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowReply(false)}>
                  {t('commentItem.cancel', 'Отменить')}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
