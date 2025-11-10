'use client';

import { MouseEvent, useMemo } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import type { Listing } from '@/app/types/listing';
import { useToast } from '@/components/ui/ToastContext';
import { useTranslation } from 'react-i18next';

// Универсальный входной тип: поддерживаем listing.id и legacy listing.listingId
type ListingInput = Listing | (Omit<Listing, 'id'> & { listingId: string });

interface Props {
  listing: ListingInput;
}

export default function FavoriteToggle({ listing }: Props) {
  const { t } = useTranslation('favorites');
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { addToast } = useToast();

  // Аккуратно и строго извлекаем id
  const listingId = useMemo(() => {
    if ('id' in listing && listing.id) return listing.id.trim();
    if ('listingId' in listing && listing.listingId) return listing.listingId.trim();
    return '';
  }, [listing]);

  // Пока id нет — не показываем кнопку
  if (!listingId) return null;

  const fav = isFavorite(listingId);

  const toggle = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (fav) {
      await removeFromFavorites(listingId);
      addToast({
        title: t('favorites:removedTitle'),
        description: t('favorites:removedDesc'),
      });
    } else {
      // ✅ Без any — тип ListingInput полностью совместим с addToFavorites
      await addToFavorites(listing);
      addToast({
        title: t('favorites:addedTitle'),
        description: t('favorites:addedDesc'),
      });
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={fav ? t('favorites:removeAria') : t('favorites:addAria')}
      className="p-1 transition-colors hover:text-red-500"
    >
      <Heart
        className="h-6 w-6"
        style={{
          fill: fav ? 'currentColor' : 'none',
          color: fav ? 'rgb(239, 68, 68)' : 'currentColor',
        }}
      />
    </button>
  );
}
