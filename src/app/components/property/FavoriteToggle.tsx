// components/property/FavoriteToggle.tsx
'use client';

import { useState, useEffect, MouseEvent } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { Listing } from '@/app/types/listing';
import { useToast } from '@/components/ui/ToastContext';
import { Description } from '@radix-ui/react-dialog';

type Props = {
  listing: Listing;
};

export default function FavoriteToggle({ listing }: Props) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const [fav, setFav] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (listing.id) {
      isFavorite(listing.id).then(setFav);
    } else {
      setFav(false);
    }
  }, [listing.id, isFavorite]);

  const toggle = async (e: MouseEvent) => {
    e.stopPropagation();
    if (fav) {
      if (listing.id) {
        await removeFromFavorites(listing.id);
        setFav(false);
        addToast({ title: 'Удалено из избранного' });
      }
    } else {
      await addToFavorites(listing);
      setFav(true);
      addToast({ title: 'Добавлено в избранное', description: 'Вы можете найти его в разделе «Избранное» в вашем профиле.' });
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={fav ? 'Удалить из избранного' : 'Добавить в избранное'}
      className="p-1 transition-colors hover:text-red-500"
    >
      <Heart
        className="w-6 h-6"
        style={{
          fill: fav ? 'currentColor' : 'none',
          color: fav ? 'rgb(239, 68, 68)' : 'currentColor',
        }}
      />
    </button>
  );
}