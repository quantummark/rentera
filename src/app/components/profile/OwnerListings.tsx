'use client';

import { useEffect, useMemo, useState } from 'react';
import { db } from '@/app/firebase/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { PlusCircle, Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ListingCard from '@/app/components/property/ListingCard';

interface Listing {
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

  createdAt: Date;
  ownerId: string;
  country: string;
  currency: string;
  paymentMethod: 'cash' | 'card' | 'crypto' | null;

  owner: {
    avatar: string;
    name: string;
    rating: number;
    id: string;
    city?: string;
  };
}

interface OwnerListingsProps {
  ownerId: string;           // чей профиль смотрим
  currentUserId?: string;    // текущий пользователь (может быть пустым)
}

export default function OwnerListings({ ownerId, currentUserId }: OwnerListingsProps) {
  const { t } = useTranslation(['ownerListings', 'listing']);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = Boolean(currentUserId);
  const isOwner = isAuthenticated && currentUserId === ownerId;

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(collection(db, 'listings'), where('ownerId', '==', ownerId));
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Listing, 'id'>),
        })) as Listing[];

        setListings(data);
      } catch (error) {
        console.error('Error loading listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [ownerId]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(t('listing:confirmDelete'));
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, 'listings', id));
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (error) {
      console.error('Ошибка удаления объекта:', error);
      alert(t('listing:deleteError'));
    }
  };

  const title = useMemo(() => {
    return isOwner ? t('ownerListings:title.mine') : t('ownerListings:title.owner');
  }, [isOwner, t]);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-solid"></div>
      </div>
    );
  }

  if (!listings.length) {
    return (
      <div className="relative mx-auto max-w-5xl px-4">
        {/* glass empty state */}
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-orange-500/30 via-zinc-500/5 to-transparent blur-2xl" />
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-14 text-center text-muted-foreground backdrop-blur-md">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-background/60">
            <Home className="h-7 w-7 opacity-80" />
          </div>
          <p className="mx-auto max-w-xl text-base">
            {!isAuthenticated
              ? t('ownerListings:empty.guest')
              : isOwner
                ? t('ownerListings:empty.mine')
                : t('ownerListings:empty.owner')}
          </p>

          {isOwner && (
            <div className="mt-6">
              <Link href="/add-listing">
                <Button className="bg-orange-500 text-white hover:bg-orange-600">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  {t('ownerListings:addNew')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Заголовок + кнопка: на мобилке — в две строки, без наезда */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
          <Home className="h-5 w-5 text-orange-500" />
          {title}
        </h2>

        {isOwner && (
          <div className="sm:shrink-0">
            <Link href="/add-listing">
              <Button className="w-full bg-orange-500 text-white hover:bg-orange-600 sm:w-auto">
                <PlusCircle className="mr-2 h-5 w-5" />
                {t('ownerListings:addNew')}
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Сетка карточек. Подскажи в ListingCard футеру: flex-wrap для мобильной адаптации действий */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            showActions={isOwner}
            onView={() => router.push(`/listing/${listing.id}`)}
            onEdit={() => router.push(`/edit-listing/${listing.id}`)}
            onDelete={() => listing.id && handleDelete(listing.id)}
          />
        ))}
      </div>
    </section>
  );
}
