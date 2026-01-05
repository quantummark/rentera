'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { useUserTypeWithProfile } from './useUserType';
import { Timestamp, deleteDoc } from 'firebase/firestore';

// Тип договора
export interface AgreementType {
  id: string;
  renterId: string;
  renterName?: string;
  renterAvatar?: string;
  ownerId: string;
  ownerName?: string;
  ownerAvatar?: string;
  requestDate: Date;
  status: 'pending' | 'active' | 'declined' | 'signed';
  listingId: string;
  title?: string;
  shortDescription?: string;
  listingImageUrl?: string;
  isPaid?: boolean;
}

export function useContracts() {
  const [userType, userProfile, loadingUser] = useUserTypeWithProfile();
  const [contracts, setContracts] = useState<AgreementType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loadingUser || !userProfile || !userType) {
      setLoading(false);
      return;
    }

    // Фильтр по роли
    const q =
      userType === 'owner'
        ? query(collection(db, 'contracts'), where('ownerId', '==', userProfile.uid))
        : query(collection(db, 'contracts'), where('renterId', '==', userProfile.uid));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const list: AgreementType[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data() as Omit<AgreementType, 'id'>;
        const contract: AgreementType = { id: docSnap.id, ...data };

        // Получаем данные объекта
if (contract.listingId) {
  const listingDoc = await getDoc(doc(db, 'listings', contract.listingId));

  if (listingDoc.exists()) {
    const listingData = listingDoc.data() as {
      title?: string;
      shortDescription?: string;
      photos?: string[];
    };

    // ✅ title: сначала то, что уже в contracts, иначе из listing
    contract.title = contract.title || listingData.title || 'Объект';

    // ✅ shortDescription: не затираем если уже есть
    contract.shortDescription = contract.shortDescription || listingData.shortDescription;

    // ✅ image: СНАЧАЛА contracts.listingImageUrl, иначе listing.photos[0]
    const firstPhoto =
      Array.isArray(listingData.photos) && listingData.photos.length > 0
        ? listingData.photos[0]
        : undefined;

    contract.listingImageUrl = contract.listingImageUrl || firstPhoto;
  }
}

// ✅ если вообще нет картинки — можно поставить плейсхолдер
contract.listingImageUrl = contract.listingImageUrl || '/placeholder.png';

        // Преобразуем дату запроса в объект Date
        const rd = (contract.requestDate as unknown) as Timestamp | Date | undefined;
        contract.requestDate =
        rd instanceof Date ? rd : rd?.toDate?.() ?? new Date();
        

        // Получаем данные владельца
        const ownerDoc = await getDoc(doc(db, 'owner', contract.ownerId));
        if (ownerDoc.exists()) {
          const ownerData = ownerDoc.data();
          contract.ownerName = ownerData.fullName;
          contract.ownerAvatar = ownerData.profileImageUrl;
        }

        // Получаем данные арендатора (если нужно)
        const renterDoc = await getDoc(doc(db, 'renter', contract.renterId));
        if (renterDoc.exists()) {
          const renterData = renterDoc.data();
          contract.renterName = renterData.fullName;
          contract.renterAvatar = renterData.profileImageUrl;
        }

        list.push(contract);
      }

      setContracts(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userProfile, userType, loadingUser]);

  // Удаление контракта
const deleteContract = async (id: string) => {
  if (!userProfile) throw new Error('No user logged in');

  const contractRef = doc(db, 'contracts', id);
  await deleteDoc(contractRef);
};

  // Функция для ручного обновления
  const refreshContracts = async () => {
    if (!userProfile || !userType) return;
    setLoading(true);

    const q =
      userType === 'owner'
        ? query(collection(db, 'contracts'), where('ownerId', '==', userProfile.uid))
        : query(collection(db, 'contracts'), where('renterId', '==', userProfile.uid));

    const snapshot = await getDocs(q);
    const list: AgreementType[] = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data() as Omit<AgreementType, 'id'>;
      const contract: AgreementType = { id: docSnap.id, ...data };

      // Получаем данные объекта
if (contract.listingId) {
  const listingDoc = await getDoc(doc(db, 'listings', contract.listingId));

  if (listingDoc.exists()) {
    const listingData = listingDoc.data() as {
      title?: string;
      shortDescription?: string;
      photos?: string[];
    };

    // ✅ title: сначала то, что уже в contracts, иначе из listing
    contract.title = contract.title || listingData.title || 'Объект';

    // ✅ shortDescription: не затираем если уже есть
    contract.shortDescription = contract.shortDescription || listingData.shortDescription;

    // ✅ image: СНАЧАЛА contracts.listingImageUrl, иначе listing.photos[0]
    const firstPhoto =
      Array.isArray(listingData.photos) && listingData.photos.length > 0
        ? listingData.photos[0]
        : undefined;

    contract.listingImageUrl = contract.listingImageUrl || firstPhoto;
  }
}

// ✅ если вообще нет картинки — можно поставить плейсхолдер
contract.listingImageUrl = contract.listingImageUrl || '/placeholder.png';

      // Данные владельца
      const ownerDoc = await getDoc(doc(db, 'owner', contract.ownerId));
      if (ownerDoc.exists()) {
        const ownerData = ownerDoc.data();
        contract.ownerName = ownerData.fullName;
        contract.ownerAvatar = ownerData.profileImageUrl;
      }

      // Данные арендатора
      const renterDoc = await getDoc(doc(db, 'renter', contract.renterId));
      if (renterDoc.exists()) {
        const renterData = renterDoc.data();
        contract.renterName = renterData.fullName;
        contract.renterAvatar = renterData.profileImageUrl;
      }

      list.push(contract);
    }

    setContracts(list);
    setLoading(false);
  };

  return { contracts, loading, refreshContracts, userType, deleteContract };
}
