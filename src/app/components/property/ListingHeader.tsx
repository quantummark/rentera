// components/listing/ListingHeader.tsx
'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { MapPin, Home, Ruler, DoorOpen, Mail, Calendar } from 'lucide-react';

interface ListingHeaderProps {
  listing: {
    title: string;
    city: string;
    district: string;
    address: string;
    type: string;
    area: number;
    rooms: number;
    photos: string[];
  };
}

export default function ListingHeader({ listing }: ListingHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      {/* Карусель фото */}
      <div className="w-full md:w-2/3 aspect-video relative rounded-2xl overflow-hidden shadow-md">
        <Image
          src={listing.photos?.[0] || '/placeholder.png'}
          alt={listing.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Информация и кнопки */}
      <div className="w-full md:w-1/3 bg-card p-4 rounded-2xl shadow-sm space-y-4">
        <h1 className="text-xl font-semibold text-foreground leading-tight">
          {listing.title}
        </h1>

        <div className="text-sm text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span>
              {listing.city}, {listing.district}, {listing.address}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-green-500" />
            <span>{t('listing.type', 'Тип')}: {listing.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-purple-500" />
            <span>{t('listing.area', 'Площадь')}: {listing.area} м²</span>
          </div>
          <div className="flex items-center gap-2">
            <DoorOpen className="w-4 h-4 text-orange-500" />
            <span>{t('listing.rooms', 'Комнат')}: {listing.rooms}</span>
          </div>
        </div>

        <div className="pt-3 flex flex-col gap-3">
          <Button className="bg-primary text-white hover:bg-primary/90 rounded-full px-6 py-2">
            💰 {t('listing.rentOnline', 'Арендовать онлайн')}
          </Button>
          <Button variant="outline" className="rounded-full px-6 py-2">
            💬 {t('listing.contactOwner', 'Написать владельцу')}
          </Button>
        </div>
      </div>
    </div>
  );
}
