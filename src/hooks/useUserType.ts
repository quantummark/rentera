'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';

type UserType = 'owner' | 'renter' | null;

export function useUserTypeWithProfile(): [UserType, any | null, boolean] {
  const { user } = useAuth();
  const [type, setType] = useState<UserType>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setType(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      const uid = user.uid;
      const ownerDoc = await getDoc(doc(db, 'owner', uid));
      if (ownerDoc.exists()) {
        setType('owner');
        setProfile(ownerDoc.data());
      } else {
        const renterDoc = await getDoc(doc(db, 'renter', uid));
        if (renterDoc.exists()) {
          setType('renter');
          setProfile(renterDoc.data());
        } else {
          setType(null);
          setProfile(null);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  return [type, profile, loading];
}
