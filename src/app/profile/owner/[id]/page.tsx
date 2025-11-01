'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { useAuth } from '@/hooks/useAuth';
import OwnerCard from '@/app/components/profile/OwnerCard';
import OwnerListings from '@/app/components/profile/OwnerListings';
import { Separator } from '@/components/ui/separator';
import CommentSection from '@/app/components/comments/CommentSection';
import { Timestamp } from 'firebase/firestore';

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
  const { id } = useParams();
  const [owner, setOwner] = useState<OwnerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return; // ждём, пока авторизация определится
    if (!id || typeof id !== 'string') return;

    const ref = doc(db, 'owner', id);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          console.warn('Owner profile not found');
          setOwner(null);
        } else {
          // добавляем uid в модель (его может не быть внутри документа)
          const data = snap.data() as Omit<OwnerProfile, 'uid'>;
          setOwner({ uid: id, ...data });
        }
        setLoading(false);
      },
      (err) => {
        console.error('Owner profile subscribe error:', err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [id, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-solid" />
      </div>
    );
  }

  if (!owner) {
    return <p className="text-center mt-10 text-destructive">Profile not found</p>;
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-10 space-y-8">
      {/* OwnerCard full-bleed на мобилке */}
      <div className="-mx-4 md:mx-0">
        <OwnerCard owner={owner} />
      </div>

      <Separator className="my-4 -mx-4 md:mx-0" />

      {/* Список объектов владельца */}
      <div className="-mx-4 md:mx-0">
        <OwnerListings
          ownerId={typeof id === 'string' ? id : ''}
          currentUserId={user?.uid ?? ''}
        />
      </div>

      <Separator className="my-4 -mx-4 md:mx-0" />

      {/* Комментарии к профилю владельца */}
      <div className="-mx-4 md:mx-0">
        <CommentSection
          contextType="owner"
          contextId={typeof id === 'string' ? id : ''}
        />
      </div>
    </div>
  );
}
