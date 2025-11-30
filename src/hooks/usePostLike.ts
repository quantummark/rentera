'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  increment,
  FirestoreError,
} from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { useUserTypeWithProfile } from '@/hooks/useUserType';

interface UsePostLikeResult {
  likedByMe: boolean;
  loading: boolean;
  error: FirestoreError | null;
  toggleLike: () => Promise<void>;
}

export function usePostLike(postId: string | null): UsePostLikeResult {
  const [likedByMe, setLikedByMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FirestoreError | null>(null);

  const [userType, userProfile, userLoading] = useUserTypeWithProfile();
  const uid = userProfile?.uid ?? null;

  // подписка на лайк конкретного пользователя
  useEffect(() => {
    if (!postId || !uid) {
      setLikedByMe(false);
      return;
    }

    const likeDocRef = doc(db, 'community_posts', postId, 'likes', uid);

    const unsub = onSnapshot(
      likeDocRef,
      snap => {
        setLikedByMe(snap.exists());
      },
      (err: FirestoreError) => {
        // eslint-disable-next-line no-console
        console.error('usePostLike error:', err);
        setError(err);
      },
    );

    return () => {
      unsub();
    };
  }, [postId, uid]);

  const toggleLike = useCallback(async () => {
    if (!postId) return;
    if (userLoading) return;
    if (!uid || !userType || !userProfile) {
      // тут можно потом показать тост "увійдіть в акаунт"
      return;
    }

    setLoading(true);
    setError(null);

    const likeDocRef = doc(db, 'community_posts', postId, 'likes', uid);
    const postRef = doc(db, 'community_posts', postId);
    const now = serverTimestamp();

    try {
      if (likedByMe) {
        // удаляем лайк
        await deleteDoc(likeDocRef);
        await updateDoc(postRef, {
          likesCount: increment(-1),
          lastActivityAt: now,
        });
      } else {
        // ставим лайк
        await setDoc(likeDocRef, {
          userUid: uid,
          postId,
          createdAt: now,
        });
        await updateDoc(postRef, {
          likesCount: increment(1),
          lastActivityAt: now,
        });
      }
    } catch (err) {
      const fsError = err as FirestoreError;
      setError(fsError);
      // eslint-disable-next-line no-console
      console.error('toggleLike error:', err);
    } finally {
      setLoading(false);
    }
  }, [postId, uid, userType, userProfile, userLoading, likedByMe]);

  return {
    likedByMe,
    loading,
    error,
    toggleLike,
  };
}
