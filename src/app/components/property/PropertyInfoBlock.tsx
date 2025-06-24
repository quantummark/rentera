// PropertyInfoBlock.tsx
'use client';
import {
  Wifi, Snowflake, Car, Flame, BedDouble, Ruler, Building2,
  CigaretteOff, Clock, Refrigerator, Tv2, Shield, KeyRound
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export type AmenityKey =
  | 'wifi'
  | 'washer'
  | 'parking'
  | 'balcony'
  | 'ac'
  | 'elevator'
  | 'heating'
  | 'furniture'
  | 'oven'
  | 'stove'
  | 'microwave'
  | 'fridge'
  | 'dishwasher'
  | 'boiler'
  | 'smarttv'
  | 'metro'
  | 'soundproof'
  | 'modern'
  | 'security'
  | 'concierge';

interface PropertyInfoBlockProps {
  rooms: number;
  area: number;
  floor: string;
  furnished: boolean;
  withChildren: boolean;
  withPets: boolean;
  smokingAllowed: boolean;
  longTerm: boolean;
  amenities: AmenityKey[];
}

export default function PropertyInfoBlock({
  rooms,
  area,
  floor,
  furnished,
  withChildren,
  withPets,
  smokingAllowed,
  longTerm,
  amenities,
}: PropertyInfoBlockProps) {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);

  const amenityMap: Record<AmenityKey, { icon: React.ReactNode; label: string }> = {
    wifi: { icon: <Wifi className="w-5 h-5 text-orange-500" />, label: t('listing.description.amenities.wifi', 'Wi-Fi') },
    washer: { icon: <span className="text-orange-500">🧺</span>, label: t('listing.description.amenities.washer', 'Стиральная машина') },
    parking: { icon: <Car className="w-5 h-5 text-orange-500" />, label: t('listing.description.amenities.parking', 'Парковка') },
    balcony: { icon: <span className="text-orange-500">🛋️</span>, label: t('listing.description.amenities.balcony', 'Балкон') },
    ac: { icon: <Snowflake className="w-5 h-5 text-orange-500" />, label: t('listing.description.amenities.ac', 'Кондиционер') },
    elevator: { icon: <span className="text-orange-500">🛗</span>, label: t('listing.description.amenities.elevator', 'Лифт') },
    heating: { icon: <Flame className="w-5 h-5 text-orange-500" />, label: t('listing.description.amenities.heating', 'Отопление') },
    furniture: { icon: <span className="text-orange-500">🪑</span>, label: t('listing.description.amenities.furniture', 'Мебель') },
    oven: { icon: <span className="text-orange-500">🍞</span>, label: t('listing.description.amenities.oven', 'Духовка') },
    stove: { icon: <span className="text-orange-500">🍳</span>, label: t('listing.description.amenities.stove', 'Варочная поверхность') },
    microwave: { icon: <span className="text-orange-500">📡</span>, label: t('listing.description.amenities.microwave', 'Микроволновка') },
    fridge: { icon: <Refrigerator className="w-5 h-5 text-orange-500" />, label: t('listing.description.amenities.fridge', 'Холодильник') },
    dishwasher: { icon: <span className="text-orange-500">🍽️</span>, label: t('listing.description.amenities.dishwasher', 'Посудомоечная машина') },
    boiler: { icon: <span className="text-orange-500">💧</span>, label: t('listing.description.amenities.boiler', 'Бойлер / Водонагреватель') },
    smarttv: { icon: <Tv2 className="w-5 h-5 text-orange-500" />, label: t('listing.description.amenities.smarttv', 'Смарт-ТВ') },
    metro: { icon: <span className="text-orange-500">🚇</span>, label: t('listing.description.amenities.metro', 'Близость к метро') },
    soundproof: { icon: <span className="text-orange-500">🔇</span>, label: t('listing.description.amenities.soundproof', 'Шумоизоляция') },
    modern: { icon: <span className="text-orange-500">🏙️</span>, label: t('listing.description.amenities.modern', 'Современный ЖК') },
    security: { icon: <Shield className="w-5 h-5 text-orange-500" />, label: t('listing.description.amenities.security', 'Охраняемая территория') },
    concierge: { icon: <KeyRound className="w-5 h-5 text-orange-500" />, label: t('listing.description.amenities.concierge', 'Консьерж / охрана') },
  };

  return (
    <div className="space-y-6">
        <p className="text-xl font-semibold text-foreground">
          {t('property.amenities.title', 'Условия аренды')}
        </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <InfoCard icon={<BedDouble className="w-6 h-6 text-orange-500" />} label={t('property.rooms', 'Комнат')} value={rooms} />
        <InfoCard icon={<Ruler className="w-6 h-6 text-orange-500" />} label={t('property.area', 'Площадь')} value={`${area} м²`} />
        <InfoCard icon={<Building2 className="w-6 h-6 text-orange-500" />} label={t('property.floor', 'Этаж')} value={floor} />
        <InfoCard icon={<span className="text-orange-500">🧳</span>} label={t('property.furnished', 'Меблирована')} value={furnished ? 'Да' : 'Нет'} />
        <InfoCard icon={<span className="text-orange-500">🧸</span>} label={t('property.children', 'С детьми')} value={withChildren ? 'Разрешено' : 'Запрещено'} />
        <InfoCard icon={<span className="text-orange-500">🐾</span>} label={t('property.pets', 'С животными')} value={withPets ? 'Разрешено' : 'Запрещено'} />
        <InfoCard icon={<CigaretteOff className="w-6 h-6 text-orange-500" />} label={t('property.smoking', 'Курение')} value={smokingAllowed ? 'Да' : 'Нет'} />
        <InfoCard icon={<Clock className="w-6 h-6 text-orange-500" />} label={t('property.longTerm', 'Долгосрочная')} value={longTerm ? 'Да' : 'Нет'} />
      </div>

      <div className="space-y-6">
        <p className="text-xl font-semibold text-foreground">
          {t('property.amenities.title', 'Удобства')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {amenities.slice(0, showAll ? amenities.length : 4).map((key) => {
            const amenity = amenityMap[key];
            return (
              <InfoCard
                key={key}
                icon={amenity?.icon ?? <span className="text-orange-500">❓</span>}
                label={amenity?.label ?? key}
                value=""
              />
            );
          })}
        </div>
        {amenities.length > 4 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-primary hover:underline mt-2"
          >
            {showAll ? t('property.amenities.hide', 'Скрыть удобства') : t('property.amenities.showAll', 'Смотреть все удобства')}
          </button>
        )}
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl border border-muted bg-background shadow-sm">
      <div className="shrink-0">{icon}</div>
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-foreground leading-none">{label}</p>
        {value !== '' && <p className="text-base text-muted-foreground">{value}</p>}
      </div>
    </div>
  );
}
