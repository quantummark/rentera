'use client';

import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Listing } from '@/app/types/listing';
import React, { useState } from 'react';
import {
  Wifi,
  WashingMachine,
  ParkingSquare,
  KeyRound,
  Snowflake,
  GanttChartSquare,
  Flame,
  BedDouble,
  Croissant,
  CookingPot,
  Microwave,
  Refrigerator,
  Utensils,
  ShowerHead,
  Tv2,
  TrainFrontTunnel,
  VolumeX,
  Building2,
  ShieldCheck,
  ConciergeBell,
} from 'lucide-react';

interface ListingAmenitiesProps {
  listing: Listing;
}

const amenityList = [
  { label: 'Wi-Fi', icon: Wifi, bg: 'bg-blue-100 dark:bg-blue-900', color: 'text-blue-600 dark:text-blue-300' },
  { label: 'Стиральная машина', icon: WashingMachine, bg: 'bg-indigo-100 dark:bg-indigo-900', color: 'text-indigo-600 dark:text-indigo-300' },
  { label: 'Парковка', icon: ParkingSquare, bg: 'bg-gray-100 dark:bg-gray-900', color: 'text-gray-600 dark:text-gray-300' },
  { label: 'Балкон', icon: KeyRound, bg: 'bg-yellow-100 dark:bg-yellow-900', color: 'text-yellow-600 dark:text-yellow-300' },
  { label: 'Кондиционер', icon: Snowflake, bg: 'bg-sky-100 dark:bg-sky-900', color: 'text-sky-600 dark:text-sky-300' },
  { label: 'Лифт', icon: GanttChartSquare, bg: 'bg-gray-200 dark:bg-gray-800', color: 'text-gray-700 dark:text-gray-300' },
  { label: 'Отопление', icon: Flame, bg: 'bg-red-100 dark:bg-red-900', color: 'text-red-600 dark:text-red-300' },
  { label: 'Мебель', icon: BedDouble, bg: 'bg-rose-100 dark:bg-rose-900', color: 'text-rose-600 dark:text-rose-300' },
  { label: 'Духовка', icon: Croissant, bg: 'bg-orange-100 dark:bg-orange-900', color: 'text-orange-600 dark:text-orange-300' },
  { label: 'Варочная поверхность', icon: CookingPot, bg: 'bg-yellow-100 dark:bg-yellow-900', color: 'text-yellow-600 dark:text-yellow-300' },
  { label: 'Микроволновка', icon: Microwave, bg: 'bg-pink-100 dark:bg-pink-900', color: 'text-pink-600 dark:text-pink-300' },
  { label: 'Холодильник', icon: Refrigerator, bg: 'bg-cyan-100 dark:bg-cyan-900', color: 'text-cyan-600 dark:text-cyan-300' },
  { label: 'Посудомоечная машина', icon: Utensils, bg: 'bg-purple-100 dark:bg-purple-900', color: 'text-purple-600 dark:text-purple-300' },
  { label: 'Бойлер / Водонагреватель', icon: ShowerHead, bg: 'bg-lime-100 dark:bg-lime-900', color: 'text-lime-600 dark:text-lime-300' },
  { label: 'Смарт-ТВ', icon: Tv2, bg: 'bg-violet-100 dark:bg-violet-900', color: 'text-violet-600 dark:text-violet-300' },
  { label: 'Близость к метро', icon: TrainFrontTunnel, bg: 'bg-fuchsia-100 dark:bg-fuchsia-900', color: 'text-fuchsia-600 dark:text-fuchsia-300' },
  { label: 'Шумоизоляция', icon: VolumeX, bg: 'bg-stone-100 dark:bg-stone-900', color: 'text-stone-600 dark:text-stone-300' },
  { label: 'Современный жилой комплекс', icon: Building2, bg: 'bg-green-100 dark:bg-green-900', color: 'text-green-600 dark:text-green-300' },
  { label: 'Охраняемая территория', icon: ShieldCheck, bg: 'bg-emerald-100 dark:bg-emerald-900', color: 'text-emerald-600 dark:text-emerald-300' },
  { label: 'Консьерж / охрана', icon: ConciergeBell, bg: 'bg-teal-100 dark:bg-teal-900', color: 'text-teal-600 dark:text-teal-300' },
];

export default function ListingAmenities({ listing }: ListingAmenitiesProps) {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const { amenities } = listing;

  if (!amenities || amenities.length === 0) return null;

  const fullList = amenityList.filter((item) => amenities.includes(item.label));
  const visibleAmenities = showAll ? fullList : fullList.slice(0, 6);

  return (
    <section className="py-8 px-4 md:px-10 space-y-6 max-w-8xl mx-auto">
      <h2 className="text-xl font-semibold text-foreground">{t('listing.amenities', 'Удобства')}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {visibleAmenities.map(({ label, icon: Icon, bg, color }) => (
          <Card
            key={label}
            className="rounded-2xl p-4 flex items-center gap-4 bg-muted shadow-sm"
          >
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', bg)}>
              <Icon className={cn('w-5 h-5', color)} />
            </div>
            <CardContent className="p-0">
              <p className="text-base font-medium text-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {fullList.length > 6 && (
        <>
          <Separator className="my-2" />
          <div className="text-center">
            <Button variant="secondary" onClick={() => setShowAll(!showAll)}>
              {showAll
                ? t('listing.showLess', 'Свернуть все удобства')
                : t('listing.showAll', 'Показать все удобства')}
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
