'use client';

import { useEffect, useMemo, useState } from 'react';
import { Heart, FolderHeart } from 'lucide-react';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import ListingCard from '@/app/components/property/ListingCard';
import { useTranslation } from 'react-i18next';
import type { Listing } from '@/app/types/listing';

interface FavoriteListingsProps {
  userId: string;
}

interface FavoriteDoc {
  userId: string;
  listing: Listing;
  createdAt?: Timestamp | null;
}

/**
 * Реалтайм-список избранных объявлений арендатора.
 * Источник: renter/{userId}/favorites (doc.id == listing.id)
 */
export default function FavoriteListings({ userId }: FavoriteListingsProps) {
  const { t } = useTranslation('favorites');
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) return;

    const favColRef = collection(db, 'renter', userId, 'favorites');
    // Можно убрать orderBy, если в старых доках нет createdAt:
    const q = query(favColRef, orderBy('createdAt', 'desc'));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const items: Listing[] = [];
        snap.forEach((docSnap) => {
          const data = docSnap.data() as Partial<FavoriteDoc>;
          const l = data.listing;
          if (l && l.id) {
            // нормальный случай — сохраняем, как есть
            items.push(l);
          } else {
            // подстраховка: если вдруг listing.id отсутствует, используем doc.id
            items.push({
              ...(l ?? ({} as Listing)),
              id: docSnap.id,
            });
          }
        });
        setFavorites(items);
        setLoading(false);
      },
      () => {
        setFavorites([]);
        setLoading(false);
      }
    );

    return () => {
      unsub();
    };
  }, [userId]);

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="flex justify-center items-center mt-10">
          <div className="h-16 w-16 animate-spin rounded-full border-solid border-t-4 border-orange-500" />
        </div>
      );
    }

    if (favorites.length === 0) {
      return (
        <div className="flex flex-col items-center gap-3 py-10 text-center text-muted-foreground">
          <FolderHeart className="h-12 w-12" />
          <p className="text-base">{t('favorites:empty')}</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          <h2 className="text-xl font-semibold text-foreground">
            {t('favorites:myFavorites')}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {favorites.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onView={() => {}}
              onEdit={() => {}}
              onDelete={() => {}}
              showActions={false}
            />
          ))}
        </div>
      </div>
    );
  }, [favorites, loading, t]);

  return <div className="space-y-6">{content}</div>;
}
