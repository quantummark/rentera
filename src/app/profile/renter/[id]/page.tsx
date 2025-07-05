'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { useAuth } from '@/hooks/useAuth';
import RenterCard from '@/app/components/profile/RenterCard';
import FavoriteListings from '@/app/components/profile/FavoriteListings';
import CommentSection from '@/app/components/comments/CommentSection';
import { Separator } from '@/components/ui/separator';

export default function RenterProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [renter, setRenter] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRenter = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, 'renter', String(id));
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRenter(docSnap.data());
        } else {
          console.warn('Профиль арендатора не найден');
        }
      } catch (error) {
        console.error('Ошибка при получении арендатора:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRenter();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10 text-muted-foreground">Загрузка профиля...</p>;
  }

  if (!renter) {
    return <p className="text-center mt-10 text-destructive">Профиль не найден</p>;
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-10 space-y-8">
      <RenterCard renter={renter} isCurrentUser={user?.uid === id} />
      <Separator className="my-4" />
      <FavoriteListings userId={String(id)} />
      <Separator className="my-4" />
      <CommentSection
        userRole="renter"
        currentUserId={user?.uid ?? ''}
        contextType="renter"
        contextId={String(id)}
      />
    </div>
  );
}
