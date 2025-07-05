'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Listing } from '@/app/types/listing';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Home,
  MapPin,
  ShieldCheck,
  Ruler,
  DoorOpen,
  CheckCircle,
  XCircle,
  PawPrint,
  Baby,
  Cigarette,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import OwnerListingControls from './OwnerListingControls';
import { cn } from '@/lib/utils';

interface ListingCardProps {
  listing: Listing;
}

interface ListingCardProps {
  listing: Listing;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  showActions: boolean;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const {
    id,
    title,
    city,
    district,
    address,
    type,
    area,
    rooms,
    photos,
    price,
    useInsurance,
    allowKids,
    allowPets,
    allowSmoking,
    ownerId,
  } = listing;

  const isOwner = user?.uid === ownerId;

  return (
    <Card className="overflow-hidden rounded-2xl border shadow-sm hover:shadow-md transition-all bg-card p-0">
      {/* Фото без отступов */}
      <Link href={`/listing/${id}`}>
        <div className="relative w-full h-72 sm:h-80">
          <Image
            src={photos?.[0] || '/placeholder.png'}
            alt={title}
            fill
            className="object-cover w-full h-full"
          />
        </div>
      </Link>

      {/* Контент */}
      <CardContent className="p-4 space-y-4">
        {/* Название + Адрес + страховка */}
        <div className="space-y-2 -mt-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            {useInsurance && (
              <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0" aria-label="Есть страховка" />
            )}
          </div>
          <p className="text-base text-muted-foreground flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {city}, {district}{address ? ` — ${address}` : ''}
          </p>
        </div>

        {/* Характеристики */}
        <div className="flex flex-wrap items-center gap-4 text-base text-muted-foreground">
          <span className="flex items-center gap-1">
            <Home className="w-4 h-4" /> {type}
          </span>
          <span className="flex items-center gap-1">
            <Ruler className="w-4 h-4" /> {area} м²
          </span>
          <span className="flex items-center gap-1">
            <DoorOpen className="w-4 h-4" /> {rooms} комн.
          </span>
        </div>

        {/* Запреты — компактно */}
        <div className="flex flex-wrap items-center gap-4 text-base text-muted-foreground">
          <span className="flex items-center gap-2">
            <PawPrint className="w-4 h-4" />
            {t('listing.pets', 'Животные')}
            {allowPets
              ? <CheckCircle className="w-4 h-4 text-green-500" />
              : <XCircle className="w-4 h-4 text-red-500" />}
          </span>
          <span className="flex items-center gap-2">
            <Baby className="w-4 h-4" />
            {t('listing.kids', 'Дети')}
            {allowKids
              ? <CheckCircle className="w-4 h-4 text-green-500" />
              : <XCircle className="w-4 h-4 text-red-500" />}
          </span>
          <span className="flex items-center gap-2">
            <Cigarette className="w-4 h-4" />
            {t('listing.smoking', 'Курение')}
            {allowSmoking
              ? <CheckCircle className="w-4 h-4 text-green-500" />
              : <XCircle className="w-4 h-4 text-red-500" />}
          </span>
        </div>

        {/* Цена + действия */}
        <div className="text-lg font-bold text-primary">${price} / мес</div>

        <div className="pt-4 text-center">
          {isOwner ? (
            <OwnerListingControls listingId={id ?? ''} />
          ) : (
            <Link
              href={`/listing/${id}`}
              className="inline-block text-sm font-medium text-orange-600 border border-orange-300 bg-orange-50 px-4 py-2 rounded-lg hover:bg-orange-100 transition"
            >
              {t('listing.details', 'Подробнее')} →
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
