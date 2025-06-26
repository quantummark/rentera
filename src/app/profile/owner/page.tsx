'use client';

import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import OwnerCard from '@/app/components/profile/OwnerCard';
import OwnerListings from '@/app/components/profile/OwnerListings';
import { Separator } from '@/components/ui/separator';
import CommentSection from '@/app/components/comments/CommentSection';

export default function OwnerProfilePage() {
  const [owner, setOwner] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const [ownerId, setOwnerId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'owner', user.uid); // проверь что коллекция точно 'owner'
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setOwner(docSnap.data());
          } else {
            console.warn('Документ владельца не найден');
          }
        } catch (error) {
          console.error('Ошибка при получении профиля:', error);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-muted-foreground">Загрузка профиля...</p>;
  }

  if (!owner) {
    return <p className="text-center mt-10 text-destructive">Профиль не найден</p>;
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-10 space-y-8">
      <OwnerCard owner={owner} />
      <Separator className="my-4" />
      <OwnerListings /> {/* 👈 Добавляем компонент */}
      <Separator className="my-4" />
      <CommentSection
      userRole="owner"
      currentUserId={uid ?? ''}
      contextType="owner"
      contextId={ownerId ?? ''}
    />
      {/* 👈 Передаем id владельца как contextId */}
    </div>
  );
  
}