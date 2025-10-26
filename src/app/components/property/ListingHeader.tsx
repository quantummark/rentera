'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { MapPin, ShieldCheck, CreditCard, MessageCircle, Bitcoin, Banknote } from 'lucide-react';
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
  const { t } = useTranslation(['listing', 'StepRentConditions']);
  const router = useRouter();

  const currencyMeta: Record<
  NonNullable<typeof listing.currency>,
  { symbol: string; pretty: string }
> = {
  USD: { symbol: '$',  pretty: t('StepRentConditions:options.currency.USD') },
  EUR: { symbol: '€',  pretty: t('StepRentConditions:options.currency.EUR') },
  UAH: { symbol: '₴',  pretty: t('StepRentConditions:options.currency.UAH') },
  BTC: { symbol: '₿',  pretty: t('StepRentConditions:options.currency.BTC') },
  ETH: { symbol: 'Ξ',  pretty: t('StepRentConditions:options.currency.ETH') },
  USDT:{ symbol: '₮',  pretty: t('StepRentConditions:options.currency.USDT') },
  SOL: { symbol: '◎',  pretty: t('StepRentConditions:options.currency.SOL') },
};

const cur = listing.currency ? currencyMeta[listing.currency] : { symbol: '', pretty: '' };

// helper: иконка способа оплаты + перевод из StepRentConditions
const pm = listing.paymentMethod as 'cash' | 'card' | 'crypto' | undefined;
const paymentIcon =
  pm === 'cash' ? <Banknote className="w-4 h-4 text-emerald-600" /> :
  pm === 'card' ? <CreditCard className="w-4 h-4 text-indigo-500" /> :
  pm === 'crypto' ? <Bitcoin className="w-4 h-4 text-amber-500" /> :
  null;

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
          <span>{listing.country}, {listing.city}, {listing.district}, {listing.address}</span>
        </div>

        {/* Кнопка карты */}
        
        <MapLinkButton address={listing.address} />

        {/* Детали аренды */}
<div className="space-y-3 text-base text-foreground pt-4">

  {/* Цена с валютой */}
  <div className="flex items-center gap-2">
    <span className="text-xl font-bold text-primary">
      {cur.symbol} {listing.price}
      <span className="text-base font-medium text-foreground/70">
        {' '} {t('listing:perMonth', 'мес')}
      </span>
    </span>
  </div>

  {listing.currency && (
    <div className="text-xs text-muted-foreground">
      {cur.pretty}
    </div>
  )}

  {/* Способ оплаты — ПЕРВЫМ пунктом под ценой */}
 {pm && (
  <span
    className="inline-flex flex-wrap items-center gap-2 rounded-full bg-muted py-1
               text-base leading-tight max-w-full"
  >
    <span className="shrink-0">{paymentIcon}</span>

    <span className="text-muted-foreground break-normal">
      {t('StepRentConditions:fields.paymentMethod')}
    </span>

    <span className="font-medium break-normal">
      {t(`StepRentConditions:options.payment.${pm}`)}
    </span>
  </span>
)}

  {/* Страхование */}
  <div className="flex items-center gap-2">
    <ShieldCheck className="w-4 h-4 text-green-600" />
    {listing.useInsurance ? t('listing:insuranceEnabled') : t('listing:insuranceDisabled')}
  </div>

  {/* Онлайн-оплата */}
  <div className="flex items-center gap-2">
    <CreditCard className="w-4 h-4 text-indigo-500" />
    {listing.onlinePayment ? t('listing:onlinePaymentEnabled') : t('listing:onlinePaymentDisabled')}
  </div>
</div>

        {/* Кнопки */}
        <div className="pt-4 py-4 flex flex-col gap-2">
          <RentRequestButton listingId={listing.listingId} ownerId={listing.ownerId} />
          <Button
            onClick={() => router.push(`/messages?userId=${listing.ownerId}`)}
            variant="outline" className="w-full rounded-full flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" />
            {t('listing:contactOwner')}
          </Button>
        </div>

        {/* Владелец */}
<div className="border-t pt-4">
  <div className="flex items-center gap-4">
    <Image
      src={listing.ownerAvatar || '/avatar-placeholder.png'}
      alt={listing.ownerName}
      width={56}
      height={56}
      className="w-14 h-14 rounded-full object-cover"
    />
    <div className="flex-1">
      <p className="text-base font-medium leading-tight">{listing.ownerName}</p>
      <p className="text-sm text-muted-foreground">⭐ {listing.ownerRating?.toFixed(1)} / 5</p>

      {/* Кнопка под именем */}
      <div className="mt-3 justify-center">
        <Button asChild variant="ghost" size="sm" className="text-primary hover:underline rounded-full px-3">
          <Link href={`/profile/owner/${listing.ownerId}`}>
            {t('listing:viewOwnerProfile')}
          </Link>
        </Button>
      </div>
    </div>
  </div>
</div>
      </div>
    </div>
  );
}
