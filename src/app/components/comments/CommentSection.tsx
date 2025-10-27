'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import CommentItem from './CommentItem';
import { useTranslation } from 'react-i18next';
import { useUserTypeWithProfile } from '@/hooks/useUserType';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type Role = 'owner' | 'renter';
type Context = 'owner' | 'renter' | 'listings';

export interface CommentType {
  id: string;
  authorId: string;
  authorName: string;
  authorPhotoUrl?: string;
  authorRole?: Role;
  content: string;
  createdAt?: Timestamp | null;
  // таргет поля именно так лежат в базе:
  targetType: Context;
  targetId: string;
  // если у тебя есть плоский «первый ответ», оставим совместимость:
  reply?: { text: string; authorRole?: Role; createdAt?: Timestamp | null };
}

interface CommentSectionProps {
  contextType: Context;   // где отображаем (страница владельца/арендатора/объекта)
  contextId: string;      // uid владельца/арендатора или id listing
  className?: string;
}

function canUserComment(params: {
  isAuthenticated: boolean;
  userRole: Role | null;
  contextType: Context;
}) {
  const { isAuthenticated, userRole, contextType } = params;
  if (!isAuthenticated || !userRole) return false;
  if (contextType === 'listings') return true;       // оба могут
  if (contextType === 'owner') return userRole === 'renter'; // арендатор -> владельцу
  if (contextType === 'renter') return userRole === 'owner'; // владелец -> арендатору
  return false;
}

export default function CommentSection({ contextType, contextId, className }: CommentSectionProps) {
  const { t } = useTranslation('comments');
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userType, profile, loadingUser] = useUserTypeWithProfile();
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
      const fetched: CommentType[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<CommentType, 'id'>;
        return { id: doc.id, ...data };
      });
      setComments(fetched);
    });

    return () => unsubscribe();
  }, [contextType, contextId]);

  const isAuthenticated = !!user && !loadingUser;
  const userRole: Role | null = userType ?? null;
  const canWrite = useMemo(
    () => canUserComment({ isAuthenticated, userRole, contextType }),
    [isAuthenticated, userRole, contextType]
  );

  // Отправка нового комментария
  const handleSubmit = async () => {
    const text = newComment.trim();
    if (!text || !profile || !userRole || !user) return;

    await addDoc(collection(db, 'comments'), {
      content: text,
      createdAt: serverTimestamp(),
      authorId: user.uid,
      authorName: user.displayName || profile.fullName || t('anonymousUser'),
      authorPhotoUrl: profile.profileImageUrl || '',
      authorRole: userRole,
      targetType: contextType,
      targetId: contextId,
    });

    setNewComment('');
  };

  const hasComments = comments.length > 0;

  return (
    <section className={cn('space-y-6 mt-8', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">
          💬 {t('title')}
          <span className="opacity-70"> ({t('count', { count: comments.length })})</span>
        </h3>
      </div>

      {/* Пустые состояния */}
{!hasComments && (
  <div className="
    inline-flex
    items-center
    rounded-xl
    border border-gray-300
    bg-white/5
    backdrop-blur-sm
    px-4 py-3
    text-base text-muted-foreground
    mx-auto
    text-center
  ">
    {isAuthenticated ? t('emptyAuthorized') : t('empty')}
  </div>
)}

      {/* Список комментариев */}
      {hasComments && (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              userRole={userRole}
              contextType={contextType}
            />
          ))}
        </div>
      )}

      {/* Форма ввода — только если правила позволяют */}
      {isAuthenticated && canWrite && (
        <div className="flex items-start gap-3">
          <Avatar className="w-9 h-9 mt-1">
            <AvatarImage src={profile?.profileImageUrl || ''} alt="avatar" />
            <AvatarFallback>{(profile?.fullName?.[0] || 'U').toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="bg-muted rounded-2xl px-4 py-3 max-w-xl w-full shadow-lg transition-colors">
            <Textarea
              placeholder={t('placeholder') as string}
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
                {t('send')}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className ="mt-1">
      {/* Авторизован, но писать нельзя (не та роль для этой страницы) */}
      {isAuthenticated && !canWrite && (
        <div className="inline-flex
    items-center
    rounded-xl
    border border-gray-300
    bg-white/5
    backdrop-blur-sm
    px-4 py-3
    text-base text-muted-foreground
    mx-auto
    text-center">
          {contextType === 'owner' && t('onlyRenterCanComment')}
          {contextType === 'renter' && t('onlyOwnerCanComment')}
        </div>
      )}
      </div>
    </section>
  );
}
