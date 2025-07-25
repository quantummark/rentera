'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { useAuth } from '@/hooks/useAuth';
import OwnerCard from '@/app/components/profile/OwnerCard';
import OwnerListings from '@/app/components/profile/OwnerListings';
import { Separator } from '@/components/ui/separator';
import CommentSection from '@/app/components/comments/CommentSection';
import { Timestamp } from 'firebase/firestore';

// Определение интерфейса для данных владельца
interface OwnerProfile {
  uid: string;
  fullName: string;
  bio: string;
  city: string;
  contactPhone: string;
  contactEmail: string;
  profileImageUrl: string;
  socialLinks: {
    instagram: string;
    telegram: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  metrics?: {
    listingsCount: number;
    completedRentals: number;
    averageRating: number;
    responseTime: string;
  };
}

export default function OwnerProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { id } = useParams(); // ⚡ получаем [id] из URL
  const [owner, setOwner] = useState<OwnerProfile | null>(null); // Используем тип OwnerProfile
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwner = async () => {
      if (!id || typeof id !== 'string') return;

      try {
        const docRef = doc(db, 'owner', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOwner(docSnap.data() as OwnerProfile); // Приводим данные к типу OwnerProfile
        } else {
          console.warn('Профиль владельца не найден');
        }
      } catch (error) {
        console.error('Ошибка при загрузке профиля:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchOwner();
    }
  }, [id, authLoading]);

  if (authLoading || loading) {
    return <p className="text-center mt-10 text-muted-foreground">Загрузка профиля...</p>;
  }

  if (!owner) {
    return <p className="text-center mt-10 text-destructive">Профиль не найден</p>;
  }

  const isOwner = user?.uid === id; // 🔑 ты просматриваешь свой профиль?

  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-10 space-y-8">
      <OwnerCard owner={owner} isCurrentUser={isOwner} />
      <Separator className="my-4" />
      <OwnerListings ownerId={typeof id === 'string' ? id : ''} currentUserId={user?.uid ?? ''} />
      <Separator className="my-4" />
      <CommentSection
        contextType="owner"
        contextId={typeof id === 'string' ? id : ''}
      />
    </div>
  );
}
