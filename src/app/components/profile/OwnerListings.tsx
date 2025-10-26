'use client';

import { useEffect, useState } from 'react';
import { db } from '@/app/firebase/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ListingCard from '@/app/components/property/ListingCard';

interface Listing {
  id?: string;
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

  createdAt: Date;
  ownerId: string;
  country: string;
  currency: string;
  paymentMethod: "cash" | "card" | "crypto" | null;

  owner: {
  avatar: string;
  name: string;
  rating: number;
  id: string;
  city?: string; // Опционально, если нужно
  };
  // добавь остальные поля: photos, insurance, rooms, area и т.д.
}

interface OwnerListingsProps {
  ownerId: string;
  currentUserId?: string;
}

export default function OwnerListings({ ownerId, currentUserId }: OwnerListingsProps) {
  const { t } = useTranslation();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isCurrentUser = currentUserId === ownerId;

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(collection(db, 'listings'), where('ownerId', '==', ownerId));
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Listing[];

        setListings(data);
      } catch (error) {
        console.error('Ошибка загрузки объектов:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [ownerId]);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(t('listing.confirmDelete', 'Вы уверены, что хотите удалить этот объект?'));
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'listings', id));
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (error) {
      console.error('Ошибка удаления объекта:', error);
      alert(t('listing.deleteError', 'Не удалось удалить объект. Попробуйте позже.'));
    }
  };

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
        {isCurrentUser && (
          <Link href="/add-listing">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-base font-semibold">
              <PlusCircle className="w-5 h-5 mr-2" />
              {t('ownerListings.add', 'Добавить объект')}
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t('ownerListings.title', '🏘 Мои объекты')}</h2>
        {isCurrentUser && (
          <Link href="/add-listing">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <PlusCircle className="w-5 h-5 mr-2" />
              {t('ownerListings.addNew', 'Добавить новый объект')}
            </Button>
          </Link>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={{ 
              ...listing,
              listingId: listing.id ?? '',
              ownerName: listing.owner?.name ?? '',
              ownerAvatar: listing.owner?.avatar ?? '',
              ownerRating: listing.owner?.rating ?? 0,
            }}
            showActions={isCurrentUser}
            onView={() => router.push(`/listing/${listing.id}`)}
            onEdit={() => router.push(`/edit-listing/${listing.id}`)}
            onDelete={() => listing.id && handleDelete(listing.id)}
          />
        ))}
      </div>
    </div>
  );
}
