// components/comments/CommentSection.tsx
'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import CommentItem from './CommentItem';
import { useTranslation } from 'react-i18next';

interface CommentType {
  id: string;
  authorId: string;
  authorName: string;
  authorPhotoUrl: string;
  content: string;
  createdAt: any;
  contextType: 'owner' | 'renter' | 'listings';
  contextId: string;
  replyTo?: string;
}

interface CommentSectionProps {
  currentUserId: string;
  contextType: 'owner' | 'renter' | 'listings';
  contextId: string;
  userRole: 'owner' | 'renter';
}

export default function CommentSection({ contextType, contextId }: CommentSectionProps) {
  const { t } = useTranslation();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'owner' | 'renter' | null>(null);

// Removed duplicate fetching logic; real-time updates are handled by the onSnapshot useEffect below.

  useEffect(() => {
    const q = query(
      collection(db, 'comments'),
      where('contextType', '==', contextType),
      where('contextId', '==', contextId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: CommentType[] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CommentType));
      setComments(fetched);
    });

    return () => unsubscribe();
  }, [contextType, contextId]);

  const handleSubmit = async () => {
    if (!newComment.trim() || !user) return;

    await addDoc(collection(db, 'comments'), {
      content: newComment,
      createdAt: serverTimestamp(),
      authorId: user.uid,
      authorName: user.displayName || 'Пользователь',
      authorPhotoUrl: user.photoURL || '',
      contextType,
      contextId,
    });

    setNewComment('');
  };

  const canAddComment = contextType === 'listings'; // Только для объявлений разрешаем писать всем

  return (
    <div className="space-y-6 mt-8">
      <h3 className="text-xl font-semibold">
        💬 {t('comments.title', 'Комментарии')}
      </h3>

      {comments.length === 0 ? (
        <p className="text-muted-foreground text-base">
          {t('comments.noComments', 'У вас пока что нет ни одного комментария.')}
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={user?.uid || ''}
              userRole={userRole || 'renter'}
              contextType={contextType}
              contextId={contextId}
            />
          ))}
        </div>
      )}

      {canAddComment && user && (
        <div className="space-y-2">
          <Textarea
            placeholder={t('comments.addPlaceholder', 'Напишите комментарий...')}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="resize-none min-h-[80px]"
          />
          <Button onClick={handleSubmit} className="bg-orange-500 text-white hover:bg-orange-600">
            {t('comments.send', 'Отправить')}
          </Button>
        </div>
      )}
    </div>
  );
}
