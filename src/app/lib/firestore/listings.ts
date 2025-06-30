// lib/firestore/listings.ts

import { db } from '@/app/firebase/firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

export interface Listing {
  id: string;
  title: string;
  city: string;
  district: string;
  address: string;
  type: string;
  area: number;
  rooms: number;
  price: number;
  onlinePayment: boolean;
  useInsurance: boolean;
  deposit: number;
  rentDuration: string;
  availableFrom: Date | null;
  allowPets: boolean;
  allowKids: boolean;
  allowSmoking: boolean;
  description: string;
  amenities: string[];
  photos: string[];
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Получить один объект по ID
export async function getListingById(listingId: string): Promise<Listing | null> {
  try {
    const ref = doc(db, 'listings', listingId);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    const data = snap.data();

    return {
      id: snap.id,
      ...data,
      availableFrom: data.availableFrom?.toDate?.() || null,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Listing;
  } catch (error) {
    console.error('Ошибка при получении объекта:', error);
    return null;
  }
}

// Получить все объекты пользователя
export async function getListingsByOwner(ownerId: string): Promise<Listing[]> {
  try {
    const q = query(collection(db, 'listings'), where('ownerId', '==', ownerId));
    const querySnap = await getDocs(q);

    return querySnap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        availableFrom: data.availableFrom?.toDate?.() || null,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Listing;
    });
  } catch (error) {
    console.error('Ошибка при загрузке объектов владельца:', error);
    return [];
  }
}
