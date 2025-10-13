// hooks/useFavorites.ts
'use client';

import { useCallback } from 'react';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { useAuth } from '@/hooks/useAuth';
import { Listing } from '@/app/types/listing';

export function useFavorites() {
  const { user } = useAuth();

  const addToFavorites = useCallback(
    async (listing: Listing) => {
      if (!user) throw new Error('Пользователь не авторизован');
      if (!listing.id) throw new Error('Listing id is missing');
      const favDoc = doc(db, 'renter', user.uid, 'favorites', listing.id);
      await setDoc(favDoc, {
        userId: user.uid,
        listing,
      });
    },
    [user]
  );

  const removeFromFavorites = useCallback(
    async (listingId: string) => {
      if (!user) throw new Error('Пользователь не авторизован');
      const favDoc = doc(db, 'renter', user.uid, 'favorites', listingId);
      await deleteDoc(favDoc);
    },
    [user]
  );

  const isFavorite = useCallback(
    async (listingId: string) => {
      if (!user) return false;
      const favDoc = doc(db, 'renter', user.uid, 'favorites', listingId);
      const snap = await getDoc(favDoc);
      return snap.exists();
    },
    [user]
  );

  return { addToFavorites, removeFromFavorites, isFavorite };
}
