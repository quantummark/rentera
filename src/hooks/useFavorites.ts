// hooks/useFavorites.ts
'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  doc, setDoc, deleteDoc, serverTimestamp, onSnapshot, collection,
} from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { useAuth } from '@/hooks/useAuth';
import type { Listing } from '@/app/types/listing';

// Разрешим вход с id ИЛИ listingId (на случай старых мест вызова)
type WithId<T> = T & { id: string };
type WithListingId<T> = Omit<T, 'id'> & { listingId: string };
type ListingLike = WithId<Listing> | WithListingId<Listing>;

// Достаём id: учитываем id / listingId, обрезаем пробелы, отбрасываем пустую строку
function extractListingId(input: ListingLike): string {
  const id =
    'id' in input && typeof input.id === 'string' ? input.id.trim() :
    'listingId' in input && typeof input.listingId === 'string' ? input.listingId.trim() :
    '';
  return id;
}

// Нормализуем объект к виду с id
function normalizeListing(input: ListingLike): WithId<Listing> {
  if ('id' in input) return input;
  const { listingId, ...rest } = input as WithListingId<Listing>;
  return { ...(rest as Omit<Listing, 'id'>), id: listingId };
}

export function useFavorites() {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      setFavoriteIds(new Set());
      return;
    }
    const favRef = collection(db, 'renter', user.uid, 'favorites');
    const unsub = onSnapshot(favRef, (snap) => {
      const next = new Set<string>();
      snap.forEach((d) => next.add(d.id));
      setFavoriteIds(next);
    });
    return () => unsub();
  }, [user]);

  const addToFavorites = useCallback(
    async (raw: ListingLike): Promise<void> => {
      if (!user) throw new Error('Пользователь не авторизован');

      const listingId = extractListingId(raw);
      if (!listingId) {
        // полезный лог, чтобы сразу увидеть, что именно прилетает
        // eslint-disable-next-line no-console
        console.error('[Favorites] Missing listing id. Got object with keys:', Object.keys(raw));
        throw new Error('Listing id is missing');
      }

      const listing = normalizeListing(raw);
      const favDocRef = doc(db, 'renter', user.uid, 'favorites', listingId);
      await setDoc(favDocRef, {
        userId: user.uid,
        listing,
        createdAt: serverTimestamp(),
      });
    },
    [user]
  );

  const removeFromFavorites = useCallback(
    async (listingId: string): Promise<void> => {
      if (!user) throw new Error('Пользователь не авторизован');
      const id = listingId?.trim();
      if (!id) throw new Error('Listing id is missing');
      const favDocRef = doc(db, 'renter', user.uid, 'favorites', id);
      await deleteDoc(favDocRef);
    },
    [user]
  );

  const isFavorite = useCallback(
    (listingId: string): boolean => {
      const id = listingId?.trim();
      if (!id) return false;
      return favoriteIds.has(id);
    },
    [favoriteIds]
  );

  return { isFavorite, addToFavorites, removeFromFavorites };
}
