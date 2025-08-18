'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { useUserTypeWithProfile } from './useUserType';

// Тип договора
export interface AgreementType {
  id: string;
  renterId: string;
  renterName: string;
  renterAvatar?: string;
  ownerId: string;
  requestDate: string; // ISO string
  status: 'pending' | 'accepted' | 'rejected';
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

    // Определяем фильтр по роли
    const q =
      userType === 'owner'
        ? query(collection(db, 'contracts'), where('ownerId', '==', userProfile?.uid))
        : query(collection(db, 'contracts'), where('renterId', '==', userProfile?.uid));

    // Подписка на изменения коллекции
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: AgreementType[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...(doc.data() as Omit<AgreementType, 'id'>) });
      });
      setContracts(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userProfile, userType, loadingUser]);

  const refreshContracts = async () => {
    if (!userProfile || !userType) return;
    setLoading(true);

    const q =
      userType === 'owner'
        ? query(collection(db, 'contracts'), where('ownerId', '==', userProfile?.uid))
        : query(collection(db, 'contracts'), where('renterId', '==', userProfile?.uid));

    const snapshot = await getDocs(q);
    const list: AgreementType[] = [];
    snapshot.forEach((doc) => list.push({ id: doc.id, ...(doc.data() as Omit<AgreementType, 'id'>) }));
    setContracts(list);
    setLoading(false);
  };

  return { contracts, loading, refreshContracts, userType };
}
