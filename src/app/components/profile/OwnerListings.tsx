// OwnerListings.tsx
'use client';

import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '@/app/firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  city: string;
  address: string;
  type: string;
  // добавь другие поля по мере необходимости
}

export default function OwnerListings() {
  const { t } = useTranslation();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [userUid, setUserUid] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserUid(user.uid);
        const q = query(collection(db, 'listings'), where('ownerId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Listing[];

        setListings(data);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p className="text-center text-muted-foreground mt-8">{t('loading', 'Загрузка...')}</p>;
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="text-5xl">🏠</div>
        <p className="text-lg font-medium text-muted-foreground">
          {t('ownerListings.empty', 'У вас пока что нет ни одного объекта. Добавьте первый, чтобы начать сдавать жильё.')}
        </p>
        <Link href="/add-listing">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-base font-semibold">
            <PlusCircle className="w-5 h-5 mr-2" />
            {t('ownerListings.add', 'Добавить объект')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t('ownerListings.title', '🏘 Мои объекты')}</h2>
        <Link href="/add-listing">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <PlusCircle className="w-5 h-5 mr-2" />
            {t('ownerListings.addNew', 'Добавить новый объект')}
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <div key={listing.id} className="border border-muted rounded-xl p-4 shadow-sm bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-1">{listing.title}</h3>
            <p className="text-sm text-muted-foreground">{listing.city}, {listing.address}</p>
            <p className="text-sm mt-1 text-foreground italic">{listing.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
