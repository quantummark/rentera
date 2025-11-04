'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Listing } from '@/app/types/listing';
import InlineAmenitiesEditor, {
  type AmenityOption,
} from '@/app/components/inline/InlineAmenitiesEditor';
import { patchListing } from '@/app/lib/firestore/profiles';

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
  canEdit: boolean;
}

/** Жёстко типизируем коды удобств под твои ключи */
type AmenityCode =
  | 'wifi'
  | 'washingMachine'
  | 'parking'
  | 'balcony'
  | 'airConditioner'
  | 'elevator'
  | 'heating'
  | 'furniture'
  | 'oven'
  | 'stove'
  | 'microwave'
  | 'fridge'
  | 'dishwasher'
  | 'boiler'
  | 'tv'
  | 'nearMetro'
  | 'soundproof'
  | 'modernComplex'
  | 'securedArea'
  | 'concierge';

/** Иконки для опций редактирования */
const AMENITY_OPTIONS: AmenityOption[] = [
  { value: 'wifi', icon: Wifi },
  { value: 'washingMachine', icon: WashingMachine },
  { value: 'parking', icon: ParkingSquare },
  { value: 'balcony', icon: KeyRound },
  { value: 'airConditioner', icon: Snowflake },
  { value: 'elevator', icon: GanttChartSquare },
  { value: 'heating', icon: Flame },
  { value: 'furniture', icon: BedDouble },
  { value: 'oven', icon: Croissant },
  { value: 'stove', icon: CookingPot },
  { value: 'microwave', icon: Microwave },
  { value: 'fridge', icon: Refrigerator },
  { value: 'dishwasher', icon: Utensils },
  { value: 'boiler', icon: ShowerHead },
  { value: 'tv', icon: Tv2 },
  { value: 'nearMetro', icon: TrainFrontTunnel },
  { value: 'soundproof', icon: VolumeX },
  { value: 'modernComplex', icon: Building2 },
  { value: 'securedArea', icon: ShieldCheck },
  { value: 'concierge', icon: ConciergeBell },
];

export default function ListingAmenities({ listing, canEdit }: ListingAmenitiesProps) {
  const { t } = useTranslation(['listing', 'listingAmenities', 'common']);

  const amenities = (listing.amenities ?? []) as AmenityCode[];
  const hasAny = amenities.length > 0;

  const onSave = (next: AmenityCode[]) =>
    patchListing(listing.listingId, { amenities: next });

  return (
    <section className="mx-auto max-w-8xl space-y-4 px-4 py-8 md:px-10">
      <h2 className="text-xl font-semibold text-foreground">
        {t('listing:amenitiesTitle')}
      </h2>

      <Card className="rounded-2xl bg-muted shadow-sm">
        <CardContent className="p-4">
          {/* Инлайн-редактор: делает Popover на десктопе и Sheet на мобилке */}
          <InlineAmenitiesEditor
            value={amenities}
            options={AMENITY_OPTIONS}
            canEdit={canEdit}
            onSave={onSave}
            title={t('listing:editAmenities')}
          />

          {/* Пустое состояние для просмотра (когда не редактируем и пусто) */}
          {!hasAny && !canEdit && (
            <>
              <Separator className="my-3" />
              <p className="text-sm italic text-muted-foreground">
                {t('listing:noAmenities')}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
