'use client';

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  serverTimestamp,
  Timestamp,
  FirestoreError,
  increment,
} from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { db } from '@/app/firebase/firebase';
import { useUserTypeWithProfile } from '@/hooks/useUserType';

type CommentAuthorRole = 'owner' | 'renter';

export interface PostComment {
  id: string;
  postId: string;
  parentId: string | null;
  authorUid: string;
  authorRole: CommentAuthorRole;
  authorName: string;
  authorAvatarUrl?: string;
  authorCity?: string;
  content: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp | null;
  isDeleted: boolean;
  likesCount: number;
}

export interface CommentTree extends PostComment {
  replies: CommentTree[];
}

interface UsePostCommentsResult {
  comments: CommentTree[];
  flatComments: PostComment[];
  loading: boolean;
  error: FirestoreError | null;
  addComment: (content: string) => Promise<void>;
  replyToComment: (parentId: string, content: string) => Promise<void>;
}

interface CurrentUserProfile {
  uid: string;
  fullName: string;
  city?: string;
  profileImageUrl?: string;
}

function mapProfile(profile: unknown): CurrentUserProfile | null {
  if (!profile || typeof profile !== 'object') return null;

  const maybe: Record<string, unknown> = profile as Record<string, unknown>;

  const uid = typeof maybe.uid === 'string' ? maybe.uid : null;
  const fullName = typeof maybe.fullName === 'string' ? maybe.fullName : null;
  const city = typeof maybe.city === 'string' ? maybe.city : undefined;

  if (!uid || !fullName) return null;

  let profileImageUrl: string | undefined;

  if (typeof maybe.profileImageUrl === 'string') {
    profileImageUrl = maybe.profileImageUrl;
  }

  return {
    uid,
    fullName,
    city,
    profileImageUrl,
  };
}

export function usePostComments(postId: string | null): UsePostCommentsResult {
  const [comments, setComments] = useState<CommentTree[]>([]);
  const [flatComments, setFlatComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const [userType, userProfile, userLoading] = useUserTypeWithProfile();

  const currentUserProfile: CurrentUserProfile | null = useMemo(
    () => mapProfile(userProfile),
    [userProfile],
  );

  useEffect(() => {
    if (!postId) {
      setComments([]);
      setFlatComments([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const commentsCol = collection(db, 'community_posts', postId, 'comments');

    const q = query(
      commentsCol,
      where('isDeleted', '==', false),
      orderBy('createdAt', 'asc'),
    );

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const rawComments: PostComment[] = snapshot.docs.map(docSnap => {
          const data = docSnap.data() as Omit<PostComment, 'id'>;
          return {
            id: docSnap.id,
            ...data,
          };
        });

        setFlatComments(rawComments);

        const map = new Map<string, CommentTree>();
        const roots: CommentTree[] = [];

        rawComments.forEach(comment => {
          map.set(comment.id, { ...comment, replies: [] });
        });

        map.forEach(comment => {
          if (comment.parentId && map.has(comment.parentId)) {
            const parent = map.get(comment.parentId);
            if (parent) {
              parent.replies.push(comment);
            }
          } else {
            roots.push(comment);
          }
        });

        setComments(roots);
        setLoading(false);
      },
      (err: FirestoreError) => {
        // eslint-disable-next-line no-console
        console.error('usePostComments error:', err);
        setError(err);
        setLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const ensureCanComment = useCallback(() => {
    if (!postId) {
      throw new Error('Cannot comment: postId is not provided.');
    }
    if (userLoading) {
      throw new Error('Cannot comment while user profile is loading.');
    }
    if (!userType || !currentUserProfile) {
      throw new Error('User must be authenticated to comment.');
    }
  }, [postId, userLoading, userType, currentUserProfile]);

  const addComment = useCallback(
    async (content: string): Promise<void> => {
      ensureCanComment();

      if (!postId || !currentUserProfile || !userType) return;

      const trimmed = content.trim();
      if (!trimmed) return;

      const commentsCol = collection(db, 'community_posts', postId, 'comments');
      const newCommentRef = doc(commentsCol);

      const now = serverTimestamp();

      const newComment: Omit<PostComment, 'id' | 'createdAt'> & {
        createdAt: ReturnType<typeof serverTimestamp>;
      } = {
        postId,
        parentId: null,
        authorUid: currentUserProfile.uid,
        authorRole: userType,
        authorName: currentUserProfile.fullName,
        authorAvatarUrl: currentUserProfile.profileImageUrl,
        authorCity: currentUserProfile.city,
        content: trimmed,
        createdAt: now,
        updatedAt: null,
        isDeleted: false,
        likesCount: 0,
      };

      await setDoc(newCommentRef, {
        commentId: newCommentRef.id,
        ...newComment,
      });

      const postRef = doc(db, 'community_posts', postId);
      await updateDoc(postRef, {
        commentsCount: increment(1),
        lastActivityAt: now,
      });
    },
    [ensureCanComment, postId, currentUserProfile, userType],
  );

  const replyToComment = useCallback(
    async (parentId: string, content: string): Promise<void> => {
      ensureCanComment();

      if (!postId || !currentUserProfile || !userType) return;

      const trimmed = content.trim();
      if (!trimmed) return;

      const commentsCol = collection(db, 'community_posts', postId, 'comments');
      const newCommentRef = doc(commentsCol);

      const now = serverTimestamp();

      const newComment: Omit<PostComment, 'id' | 'createdAt'> & {
        createdAt: ReturnType<typeof serverTimestamp>;
      } = {
        postId,
        parentId,
        authorUid: currentUserProfile.uid,
        authorRole: userType,
        authorName: currentUserProfile.fullName,
        authorAvatarUrl: currentUserProfile.profileImageUrl,
        authorCity: currentUserProfile.city,
        content: trimmed,
        createdAt: now,
        updatedAt: null,
        isDeleted: false,
        likesCount: 0,
      };

      await setDoc(newCommentRef, {
        commentId: newCommentRef.id,
        ...newComment,
      });

      const postRef = doc(db, 'community_posts', postId);
      await updateDoc(postRef, {
        commentsCount: increment(1),
        lastActivityAt: now,
      });
    },
    [ensureCanComment, postId, currentUserProfile, userType],
  );

  return {
    comments,
    flatComments,
    loading: loading || userLoading,
    error,
    addComment,
    replyToComment,
  };
}
