'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import CommentItem from './CommentItem';
import { useTranslation } from 'react-i18next';
import { useUserTypeWithProfile } from '@/hooks/useUserType';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Timestamp } from 'firebase/firestore';

interface CommentType {
  id: string;
  authorId: string;
  authorName: string;
  authorPhotoUrl: string;
  content: string;
  createdAt: Timestamp;
  contextType: 'owner' | 'renter' | 'listings';
  contextId: string;
  replyTo?: string;
}

interface CommentSectionProps {
  contextType: 'owner' | 'renter' | 'listings';
  contextId: string;
}

export default function CommentSection({ contextType, contextId }: CommentSectionProps) {
  const { t } = useTranslation();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userType, profile, loading] = useUserTypeWithProfile();
  const { user } = useAuth();

  // Загрузка комментариев
  useEffect(() => {
    const q = query(
      collection(db, 'comments'),
      where('targetType', '==', contextType),
      where('targetId', '==', contextId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: CommentType[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }) as CommentType);
      setComments(fetched);
    });

    return () => unsubscribe();
  }, [contextType, contextId]);

  // Отправка нового комментария
  const handleSubmit = async () => {
    if (!newComment.trim() || !profile || !userType) return;

    await addDoc(collection(db, 'comments'), {
      content: newComment,
      createdAt: serverTimestamp(),
      authorId: user?.uid,
      authorName: user?.displayName || profile?.fullName || 'Пользователь',
      authorPhotoUrl: profile?.profileImageUrl || '',
      targetType: contextType,         // 🚨 поле переименовано
      targetId: contextId,             // это может быть uid владельца/арендатора или id объекта
      authorRole: userType,            // 🚨 новое поле
    });

    setNewComment('');
  };

  const canAddComment = contextType === 'listings' && !!profile && !loading;

  return (
    <div className="space-y-6 mt-8">
      <h3 className="text-xl font-semibold">💬 {t('comments.title', 'Комментарии')}</h3>

      {comments.length === 0 ? (
        <p className="text-muted-foreground text-base">
          {canAddComment
            ? t('comments.beFirst', 'Оставьте первый комментарий')
            : t('comments.noComments', 'У вас пока что нет ни одного комментария.')}
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              userRole={userType as 'owner' | 'renter'}
              contextType={contextType}
            />
          ))}
        </div>
      )}

      {canAddComment && (
        <div className="flex items-start gap-3">
          {/* Аватар текущего пользователя */}
          <Avatar className="w-9 h-9 mt-1">
            <AvatarImage src={profile?.profileImageUrl || ''} alt="avatar" />
            <AvatarFallback>{profile?.fullName?.[0] || 'U'}</AvatarFallback>
          </Avatar>

          {/* Область ввода + кнопка */}
          <div className="bg-muted rounded-2xl px-4 py-3 max-w-xl w-full shadow-lg transition-colors">
            <Textarea
              placeholder={t('comments.addPlaceholder', 'Напишите комментарий...')}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="resize-none text-sm border-none focus:ring-0 focus:outline-none bg-transparent placeholder:text-muted-foreground"
              rows={3}
            />

            <div className="flex justify-end mt-2">
              <Button
                onClick={handleSubmit}
                disabled={!newComment.trim()}
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-1.5 rounded-md"
              >
                {t('comments.send', 'Отправить')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
