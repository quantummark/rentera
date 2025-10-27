import { db } from '@/app/firebase/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import type { CommentType } from '@/app/types/comment';

type Role = 'owner' | 'renter';
type Context = 'owner' | 'renter' | 'listings';

/**
 * Получить комментарии по типу и id (унифицированные поля: targetType/targetId)
 */
export async function fetchComments(
  contextType: Context,
  contextId: string
): Promise<CommentType[]> {
  const q = query(
    collection(db, 'comments'),
    where('targetType', '==', contextType),
    where('targetId', '==', contextId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);

  // Примечание: при getDocs значения serverTimestamp уже материализованы в Timestamp
  const items: CommentType[] = snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...(data as Omit<CommentType, 'id'>),
    };
  });

  return items;
}

/**
 * Добавить комментарий
 * Держим единый формат с компонентами: targetType/targetId + authorRole
 */
export async function addComment(
  contextType: Context,
  contextId: string,
  authorId: string,
  authorName: string,
  authorPhotoUrl: string,
  content: string,
  authorRole: Role
): Promise<string> {
  const ref = await addDoc(collection(db, 'comments'), {
    targetType: contextType,
    targetId: contextId,
    authorId,
    authorName,
    authorPhotoUrl,
    authorRole,
    content,
    createdAt: serverTimestamp(), // пусть сервер ставит время
  });

  return ref.id;
}

/**
 * Добавить ответ на комментарий
 * Опционально сохраняем автора ответа и роль — удобно для UI.
 */
export async function replyToComment(
  commentId: string,
  text: string,
  replyAuthor?: { authorId?: string; authorRole?: Role }
): Promise<void> {
  const ref = doc(db, 'comments', commentId);
  await updateDoc(ref, {
    reply: {
      text,
      ...(replyAuthor?.authorId ? { authorId: replyAuthor.authorId } : null),
      ...(replyAuthor?.authorRole ? { authorRole: replyAuthor.authorRole } : null),
      createdAt: serverTimestamp(),
    },
  });
}
