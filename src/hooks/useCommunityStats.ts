'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  collection,
  getCountFromServer,
  type Firestore,
} from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';

interface CommunityStats {
  postsCount: number;
  ownersCount: number;
  rentersCount: number;
  totalUsers: number;
}

interface UseCommunityStatsResult {
  stats: CommunityStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useCommunityStats(): UseCommunityStatsResult {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // one Firestore instance, просто чтобы было наглядно
      const dbRef: Firestore = db;

      const postsRef = collection(dbRef, 'community_posts');
      const ownersRef = collection(dbRef, 'owner');
      const rentersRef = collection(dbRef, 'renter');

      const [postsSnap, ownersSnap, rentersSnap] = await Promise.all([
        getCountFromServer(postsRef),
        getCountFromServer(ownersRef),
        getCountFromServer(rentersRef),
      ]);

      const postsCount = postsSnap.data().count;
      const ownersCount = ownersSnap.data().count;
      const rentersCount = rentersSnap.data().count;

      const totalUsers = ownersCount + rentersCount;

      setStats({
        postsCount,
        ownersCount,
        rentersCount,
        totalUsers,
      });
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error('Error fetching community stats:', err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load community stats.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
  };
}
