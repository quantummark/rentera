'use client';

import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Listing } from '@/app/types/listing';

interface ListingAmenitiesProps {
  listing: Listing;
}

const amenityIcons: Record<string, string> = {
  'Wi-Fi': '📶',
  'Стиральная машина': '🧺',
  'Парковка': '🅿️',
  'Балкон': '🏞️',
  'Кондиционер': '❄️',
  'Лифт': '🛗',
  'Отопление': '🔥',
  'Мебель': '🛋️',
  'Духовка': '♨️',
  'Варочная поверхность': '🍳',
  'Микроволновка': '📡',
  'Холодильник': '🧊',
  'Посудомоечная машина': '🍽️',
  'Бойлер / Водонагреватель': '🚿',
  'Смарт-ТВ': '📺',
  'Близость к метро': '🚇',
  'Шумоизоляция': '🔇',
  'Современный жилой комплекс': '🏙️',
  'Охраняемая территория': '🛡️',
  'Консьерж / охрана': '👮',
};

export default function ListingAmenities({ listing }: ListingAmenitiesProps) {
  const { t } = useTranslation();
  const { amenities } = listing;

  if (!amenities || amenities.length === 0) return null;

  return (
    <section className="py-8 px-4 md:px-10 space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-green-500" />
        {t('listing.amenities', 'Удобства')}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {amenities.map((item) => (
          <Card
            key={item}
            className={cn(
              'rounded-xl p-3 text-sm flex items-center gap-2 shadow-sm bg-muted'
            )}
          >
            <span className="text-lg">{amenityIcons[item] || '✔️'}</span>
            <span className="text-foreground">{item}</span>
          </Card>
        ))}
      </div>
    </section>
  );
}
