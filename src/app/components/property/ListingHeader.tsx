'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { MapPin, ShieldCheck, CreditCard, MessageCircle } from 'lucide-react';
import ListingGallery from './ListingGallery'; // ✅ импорт галереи
import MapLinkButton from './MapLinkButton'; // ✅ импорт кнопки карты
import { useRouter } from 'next/navigation';
import RentRequestButton from '@/app/components/Contract/RentRequestButton'; // ✅ импорт кнопки аренды
import Link from 'next/link';
import FavoriteToggle from '@/app/components/property/FavoriteToggle';

import type { Listing } from '@/app/types/listing'; // Adjust the import path as needed

interface ListingHeaderProps {
  listing: Listing;
}

export default function ListingHeader({ listing }: ListingHeaderProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      {/* Галерея слева */}
      <div className="w-full md:w-2/3">
        <ListingGallery photos={listing.photos} title={listing.title} />
      </div>

      {/* Инфо-карточка */}
      <div className="w-full md:w-1/3 bg-card p-5 border rounded-2xl shadow-sm space-y-3">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
  <h1 className="text-2xl font-semibold text-foreground leading-tight">
    {listing.title}
  </h1>
  <FavoriteToggle listing={listing} />
</div>

        {/* Адрес */}
        <div className="flex items-center gap-2 text-base text-muted-foreground">
          <MapPin className="w-4 h-4 text-blue-500" />
          <span>{listing.city}, {listing.district}, {listing.address}</span>
        </div>

        {/* Кнопка карты */}
        
        <MapLinkButton address={listing.address} />

        {/* Цена и условия */}
        <div className="space-y-2 text-base text-foreground pt-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">💰 {listing.price} ₴ / мес</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            {listing.useInsurance
              ? t('listing.insuranceEnabled', 'Страхование включено')
              : t('listing.insuranceDisabled', 'Без страхования')}
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-indigo-500" />
            {listing.onlinePayment
              ? t('listing.onlinePaymentEnabled', 'Онлайн-оплата доступна')
              : t('listing.onlinePaymentDisabled', 'Оплата только наличными')}
          </div>
        </div>

        {/* Кнопки */}
        <div className="pt-4 py-4 flex flex-col gap-2">
          <RentRequestButton listingId={listing.listingId} ownerId={listing.ownerId} />
          <Button
            onClick={() => router.push(`/messages?userId=${listing.ownerId}`)}
            variant="outline" className="w-full rounded-full flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" />
            {t('listing.contactOwner', 'Написать владельцу')}
          </Button>
        </div>

        {/* Владелец */}
<div className="flex items-center justify-between border-t pt-4">
  {/* левая группа */}
  <div className="flex items-center gap-4">
    <Image
      src={listing.ownerAvatar || '/avatar-placeholder.png'}
      alt={listing.ownerName}
      width={40}
      height={40}
      className="rounded-full object-cover"
    />
    <div>
      <p className="text-sm font-medium">{listing.ownerName}</p>
      <p className="text-xs text-muted-foreground">
        ⭐ {listing.ownerRating?.toFixed(1)} / 5
      </p>
    </div>
  </div>

  {/* ссылка прижата вправо */}
  <Link href={`/profile/owner/${listing.ownerId}`} passHref>
  <Button asChild variant="ghost" className="text-sm sm:text-xs text-primary px-2 hover:underline">
    <span>{t('listing.viewOwnerProfile', 'Смотреть профиль')}</span>
  </Button>
</Link>
</div>
      </div>
    </div>
  );
}
