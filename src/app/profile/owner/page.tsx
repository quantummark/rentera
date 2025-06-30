'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { useAuth } from '@/hooks/useAuth'; // ✅ твой универсальный хук
import OwnerCard from '@/app/components/profile/OwnerCard';
import OwnerListings from '@/app/components/profile/OwnerListings';
import { Separator } from '@/components/ui/separator';
import CommentSection from '@/app/components/comments/CommentSection';

export default function OwnerProfilePage() {
  const { user, loading: authLoading } = useAuth(); // ✅ юзаем хук
  const [owner, setOwner] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwner = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, 'owner', user.uid); // ✅ коллекция 'owner', как ты используешь везде
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOwner(docSnap.data());
        } else {
          console.warn('Документ владельца не найден');
        }
      } catch (error) {
        console.error('Ошибка при получении профиля владельца:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchOwner();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <p className="text-center mt-10 text-muted-foreground">Загрузка профиля...</p>;
  }

  if (!owner) {
    return <p className="text-center mt-10 text-destructive">Профиль не найден</p>;
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-10 space-y-8">
      <OwnerCard owner={owner} />
      <Separator className="my-4" />
      <OwnerListings />
      <Separator className="my-4" />
      <CommentSection
        userRole="owner"
        currentUserId={user?.uid ?? ''}
        contextType="owner"
        contextId={user?.uid ?? ''}
      />
    </div>
  );
}
