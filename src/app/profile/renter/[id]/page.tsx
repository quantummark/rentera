'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { doc, getDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { useAuth } from '@/hooks/useAuth';
import RenterCard from '@/app/components/profile/RenterCard';
import FavoriteListings from '@/app/components/profile/FavoriteListings';
import CommentSection from '@/app/components/comments/CommentSection';
import { Separator } from '@/components/ui/separator';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface RenterProfile {
  uid: string;
  fullName: string;
  bio?: string;
  city: string;
  rentDuration: string;
  hasPets: 'no' | 'cat' | 'dog';
  hasKids: 'yes' | 'no';
  smoking: 'yes' | 'no';
  occupation: string;
  budgetFrom: number;
  budgetTo: number;
  profileImageUrl?: string;
  createdAt: Timestamp;
}

// первичная загрузка документа
const fetchRenter = async (id: string): Promise<RenterProfile> => {
  const ref = doc(db, 'renter', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    throw new Error('Профиль арендатора не найден');
  }
  return snap.data() as RenterProfile;
};

export default function RenterProfilePage() {
  const { id } = useParams();
  const stringId = typeof id === 'string' ? id : '';
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [subError, setSubError] = useState<string | null>(null);

  // 1) первичная загрузка через React Query
  const {
    data: renter,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['renter', stringId],
    queryFn: () => fetchRenter(stringId),
    enabled: !!stringId && !authLoading,
  });

  // 2) realtime-подписка, синхронизируем кэш
  useEffect(() => {
    if (!stringId || authLoading) return;

    const ref = doc(db, 'renter', stringId);
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        setSubError(null);
        if (snap.exists()) {
          queryClient.setQueryData(['renter', stringId], snap.data() as RenterProfile);
        } else {
          // документ удалён — очищаем кэш
          queryClient.removeQueries({ queryKey: ['renter', stringId], exact: true });
        }
      },
      (err) => {
        console.error('[RenterProfilePage] onSnapshot error:', err);
        setSubError('Не удалось получить обновления профиля в реальном времени.');
      }
    );

    return () => unsubscribe();
  }, [stringId, authLoading, queryClient]);

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-solid"></div>
      </div>
    );
  }

  if (isError) {
    return <p className="text-center mt-10 text-destructive">{(error as Error).message}</p>;
  }

  const data = renter;
  if (!data) {
    return <p className="text-center mt-10 text-destructive">Профиль не найден</p>;
  }

  const isRenter = user?.uid === stringId;

  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-10 space-y-8">
      {/* уведомление о проблеме с подпиской (если вдруг) */}
      {subError && (
        <div className="rounded-md border border-yellow-300/50 bg-yellow-500/10 px-4 py-2 text-sm text-yellow-800 dark:text-yellow-200">
          {subError}
        </div>
      )}

      {/* full-bleed только на мобильном */}
      <div className="-mx-4 md:mx-0">
        <RenterCard renter={data} isCurrentUser={isRenter} />
      </div>

      <Separator className="my-4 -mx-4 md:mx-0" />

      <div className="-mx-4 md:mx-0">
        <FavoriteListings userId={stringId} />
      </div>

      <Separator className="my-4 -mx-4 md:mx-0" />

      <div className="-mx-4 md:mx-0">
        <CommentSection contextType="renter" contextId={stringId} />
      </div>
    </div>
  );
}
