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
  userRole: 'owner' | 'renter';
  contextType: 'owner' | 'renter' | 'listings';
}

export default function CommentItem({
  comment,
  userRole,
  contextType,
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
      console.error('Ошибка при ответе на комментарий:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-start gap-3 max-w-[650px]">
      {/* Аватар */}
      <Avatar className="w-10 h-10">
        <AvatarImage src={comment.authorPhotoUrl || ''} />
        <AvatarFallback>{comment.authorName[0]}</AvatarFallback>
      </Avatar>

      {/* Сообщение */}
      <div className="relative bg-muted p-4 rounded-xl shadow-sm">
        {/* Хвостик */}
        <div className="absolute -left-1 top-5 w-3 h-3 bg-muted rotate-45" />

        <p className="text-sm font-semibold">{comment.authorName}</p>
        <p className="text-sm text-foreground whitespace-pre-line mt-1">{comment.content}</p>
        <p className="text-xs text-muted-foreground mt-2">
          {comment.createdAt
            ? new Date(comment.createdAt.toDate()).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : t('commentItem.noDate', 'Дата неизвестна')}
        </p>

        {/* Ответ от владельца или арендатора */}
        {comment.reply && (
          <div className="mt-4 border-l-2 border-muted pl-4 ml-2 space-y-1">
            <p className="text-sm text-muted-foreground font-medium">
              {userRole === 'owner'
                ? t('commentItem.ownerReply', 'Ответ владельца:')
                : t('commentItem.renterReply', 'Ответ арендатора:')}
            </p>
            <p className="text-sm text-foreground whitespace-pre-line">{comment.reply.text}</p>
          </div>
        )}

        {/* Ответить (если можно) */}
        {canReply && !comment.reply && (
          <div className="mt-4">
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
                  className="w-full text-sm"
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
    </div>
  );
}
