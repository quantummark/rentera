// lib/firestore/listings.ts

import { db } from '@/app/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

export interface Listing {
  id: string;
  title: string;
  country: string;
  city: string;
  district: string;
  address: string;
  type: string;
  area: number;
  rooms: number;
  price: number;
  currency: string;
  paymentMethod: "cash" | "card" | "crypto" | null;
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

  ownerName: string;
  ownerAvatar: string;
  ownerRating: number;
  ownerCity?: string; // если нужно

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

// Получить все объекты пользователя с деталями владельца
export async function getListingByIdWithOwner(listingId: string): Promise<Listing | null> {
  try {
    const ref = doc(db, 'listings', listingId);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    const data = snap.data();

    // Загружаем владельца по его ID
    let owner = {
      avatar: '',
      name: '',
      rating: 0,
      id: data.ownerId || '',
    };

    if (data.ownerId) {
      const ownerRef = doc(db, 'owner', data.ownerId);
      const ownerSnap = await getDoc(ownerRef);

      if (ownerSnap.exists()) {
        const ownerData = ownerSnap.data();
        owner = {
          avatar: ownerData.profileImageUrl || '',
          name: ownerData.fullName || '',
          rating: ownerData.rating || 0,
          id: data.ownerId,
        };
      }
    }

    return {
      id: snap.id,
      title: data.title || '',
      city: data.city || '',
      district: data.district || '',
      address: data.address || '',
      type: data.type || '',
      area: data.area || 0,
      rooms: data.rooms || 0,
      price: data.price || 0,
      onlinePayment: data.onlinePayment || false,
      useInsurance: data.useInsurance || false,
      deposit: data.deposit || 0,
      rentDuration: data.rentDuration || '',
      availableFrom: data.availableFrom?.toDate?.() || null,
      allowPets: data.allowPets || false,
      allowKids: data.allowKids || false,
      allowSmoking: data.allowSmoking || false,
      description: data.description || '',
      amenities: data.amenities || [],
      photos: data.photos || [],
      ownerId: data.ownerId || '',
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      ownerName: owner.name,
      ownerAvatar: owner.avatar,
      ownerRating: owner.rating,
      ownerCity: data.ownerCity || '',
    } as Listing;
  } catch (error) {
    console.error('Ошибка при получении объекта:', error);
    return null;
  }
}
