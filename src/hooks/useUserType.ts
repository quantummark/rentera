'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { Timestamp } from 'firebase/firestore';

type UserType = 'owner' | 'renter' | null;

interface OwnerProfile {
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

interface RenterProfile {
  fullName: string;
  bio?: string;
  city: string;
  rentDuration: string;
  hasPets: 'no' | 'cat' | 'dog';
  hasKids: 'yes' | 'no';
  smoking: 'yes' | 'no';
  occupation: string;
  budgetFrom: number;
  budgetTo: number;
  profileImageUrl?: string;
  createdAt: Timestamp;
}

type UserProfile = OwnerProfile | RenterProfile | null;

export function useUserTypeWithProfile(): [UserType, UserProfile, boolean] {
  const { user } = useAuth();
  const [type, setType] = useState<UserType>(null);
  const [profile, setProfile] = useState<UserProfile>(null);
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
        setProfile(ownerDoc.data() as OwnerProfile);
      } else {
        const renterDoc = await getDoc(doc(db, 'renter', uid));
        if (renterDoc.exists()) {
          setType('renter');
          setProfile(renterDoc.data() as RenterProfile);
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
