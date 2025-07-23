'use client';

import { useEffect, useState } from 'react';
import { Heart, FolderHeart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/app/firebase/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import ListingCard from '@/app/components/property/ListingCard';
import { useTranslation } from 'react-i18next';

interface FavoriteListingsProps {
  userId: string;
}

export default function FavoriteListings({ userId }: FavoriteListingsProps) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

      try {
        // Получаем ссылку на подколлекцию "favorites" в документе "renter"
        const favRef = collection(db, 'renter', user.uid, 'favorites'); // Это подколлекция "favorites" для конкретного арендатора

        // Запрос к подколлекции "favorites"
        const q = query(favRef, where('userId', '==', user.uid)); // Дополнительно можно фильтровать по userId, если требуется
        const snapshot = await getDocs(q);

        const favListings = snapshot.docs.map((doc) => doc.data().listing);
        setFavorites(favListings);
      } catch (error) {
        console.error('Ошибка при получении избранных:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  if (loading) {
    return <p className="text-muted-foreground text-center py-10">{t('favorites.loading', 'Загрузка избранных...')}</p>;
  }

  return (
    <div className="space-y-6">
      {favorites.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground flex flex-col items-center gap-3">
          <FolderHeart className="w-12 h-12 text-muted-foreground" />
          <p className="text-base">{t('favorites.empty', 'У вас ещё нет избранных. Находите то, что нравится — нажимайте ❤️, и они появятся здесь.')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-semibold text-foreground">{t('favorites.myFavorites', 'Мои избранные')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {favorites.map((listing: any) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onView={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
                showActions={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
