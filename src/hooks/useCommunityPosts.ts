'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit as limitQuery,
  onSnapshot,
  DocumentData,
  Query,
  FirestoreError,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';

// ===== типы, соответствующие твоей коллекции community_posts =====

export type CommunityTopic =
  | 'experience' // Оренда та досвід
  | 'roommates' // Співоренда / пошук сусіда
  | 'household' // Побут / ремонт
  | 'moving' // Переїзд
  | 'finance' // Фінанси / страхування
  | 'fun' // Смішні історії
  | 'recommendations'; // Рекомендації районів, ЖК, сервісів

export interface CommunityPost {
  authorUid: string;
  authorRole: 'owner' | 'renter';
  authorName: string;
  authorAvatarUrl?: string;
  authorCity?: string;

  topic: CommunityTopic;
  city?: string;
  content: string;

  images?: string[];

  likesCount: number;
  commentsCount: number;
  savesCount: number;

  createdAt?: Timestamp | null;
  lastActivityAt?: Timestamp | null;

  isPinned?: boolean;
  isDeleted?: boolean;
  status?: 'active' | 'hidden' | 'under_review';
}

export interface CommunityPostWithId extends CommunityPost {
  id: string;
}

export type CommunityTopicFilter = CommunityTopic | 'all';

export interface UseCommunityPostsOptions {
  topic?: CommunityTopicFilter;
  limit?: number;
}

export interface UseCommunityPostsResult {
  posts: CommunityPostWithId[];
  loading: boolean;
  error: FirestoreError | null;
}

// ===== основной хук =====

export function useCommunityPosts(
  options: UseCommunityPostsOptions = {},
): UseCommunityPostsResult {
  const { topic = 'all', limit = 20 } = options;

  const [posts, setPosts] = useState<CommunityPostWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const collectionRef = collection(db, 'community_posts');
    let q: Query<DocumentData> = collectionRef;

    // фильтр по теме
    if (topic !== 'all') {
      q = query(q, where('topic', '==', topic));
    }

    // сортировка по дате создания (новые сверху)
    q = query(q, orderBy('createdAt', 'desc'));

    // лимит, чтобы не тянуть всё подряд
    if (limit && limit > 0) {
      q = query(q, limitQuery(limit));
    }

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const nextPosts: CommunityPostWithId[] = snapshot.docs.map(docSnap => {
          const data = docSnap.data() as CommunityPost;

          return {
            id: docSnap.id,
            ...data,
          };
        });

        setPosts(nextPosts);
        setLoading(false);
      },
      (err: FirestoreError) => {
        setError(err);
        setLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [topic, limit]);

  return {
    posts,
    loading,
    error,
  };
}
