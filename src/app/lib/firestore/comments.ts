import { db } from '@/app/firebase/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  updateDoc,
  doc,
  orderBy,
} from 'firebase/firestore';
import { CommentType } from '@/app/types/comment';

// Получить комментарии по типу и id
export async function fetchComments(contextType: 'owner' | 'renter' | 'listings', contextId: string) {
  const q = query(
    collection(db, 'comments'),
    where('contextType', '==', contextType),
    where('contextId', '==', contextId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as CommentType[];
}

// Добавить комментарий
export async function addComment(
  contextType: 'owner' | 'renter' | 'listings',
  contextId: string,
  authorId: string,
  authorName: string,
  authorPhotoUrl: string,
  content: string
) {
  const docRef = await addDoc(collection(db, 'comments'), {
    contextType,
    contextId,
    authorId,
    authorName,
    authorPhotoUrl,
    content,
    createdAt: Timestamp.now(),
  });

  return docRef.id;
}

// Добавить ответ на комментарий
export async function replyToComment(commentId: string, text: string) {
  const ref = doc(db, 'comments', commentId);
  await updateDoc(ref, {
    reply: {
      text,
      createdAt: Timestamp.now(),
    },
  });
}
