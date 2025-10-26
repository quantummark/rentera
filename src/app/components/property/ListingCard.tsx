'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Listing } from '@/app/types/listing';
import { Card, CardContent } from '@/components/ui/card';
import {
  Home, MapPin, ShieldCheck, Ruler, DoorOpen,
  CheckCircle, XCircle, PawPrint, Baby, Cigarette,
  ChevronLeft, ChevronRight, CreditCard, Bitcoin, Banknote
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import OwnerListingControls from './OwnerListingControls';
import { cn } from '@/lib/utils';

interface ListingCardProps {
  listing: Listing;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  showActions: boolean;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const { t } = useTranslation(['listing', 'types', 'StepRentConditions']);
  const { user } = useAuth();
  const {
    id, title, city, district, address, type,
    area, rooms, photos = [], price,
    useInsurance, onlinePayment, allowKids, allowPets, allowSmoking, ownerId,
    currency, paymentMethod
  } = listing;

  const isOwner = user?.uid === ownerId;

  // ======== Галерея с листанием ========
  const [idx, setIdx] = useState(0);
  const total = photos.length || 1;
  const currentSrc = photos[idx] || '/placeholder.png';

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    setIdx(i => (i - 1 + total) % total);
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    setIdx(i => (i + 1) % total);
  };

  // ======== Валюта/способ оплаты ========
  const currencyMeta = useMemo(() => ({
    USD: { symbol: '$',  pretty: t('StepRentConditions:options.currency.USD') },
    EUR: { symbol: '€',  pretty: t('StepRentConditions:options.currency.EUR') },
    UAH: { symbol: '₴',  pretty: t('StepRentConditions:options.currency.UAH') },
    BTC: { symbol: '₿',  pretty: t('StepRentConditions:options.currency.BTC') },
    ETH: { symbol: 'Ξ',  pretty: t('StepRentConditions:options.currency.ETH') },
    USDT:{ symbol: '₮',  pretty: t('StepRentConditions:options.currency.USDT') },
    SOL: { symbol: '◎',  pretty: t('StepRentConditions:options.currency.SOL') },
  }), [t]);

  const cur = currency ? currencyMeta[currency as keyof typeof currencyMeta] : { symbol: '', pretty: '' };

  const paymentIcon =
    paymentMethod === 'cash' ? <Banknote className="w-4 h-4 text-emerald-600" /> :
    paymentMethod === 'card' ? <CreditCard className="w-4 h-4 text-indigo-500" /> :
    paymentMethod === 'crypto' ? <Bitcoin className="w-4 h-4 text-amber-500" /> :
    null;

  return (
    <Card className="overflow-hidden rounded-2xl border shadow-sm hover:shadow-md transition-all bg-card p-0">
      {/* Фото-галерея с навигацией */}
      <Link href={`/listing/${id}`} aria-label={title}>
        <div className="relative w-full h-72 sm:h-80">
          <Image
            src={currentSrc}
            alt={title}
            fill
            className="object-cover w-full h-full"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />

          {/* Стрелки — показываем только если фото > 1 */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                aria-label={t('listing:prevImage', 'Предыдущее фото')}
                className="absolute left-2 top-1/2 -translate-y-1/2 grid place-items-center rounded-full p-2
                           bg-black/40 hover:bg-black/55 text-white backdrop-blur-sm transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                aria-label={t('listing:nextImage', 'Следующее фото')}
                className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center rounded-full p-2
                           bg-black/40 hover:bg-black/55 text-white backdrop-blur-sm transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Индикаторы */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {photos.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-1.5 w-6 rounded-full transition',
                      i === idx ? 'bg-white/90' : 'bg-white/40'
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </Link>

      <CardContent className="p-4 space-y-4">
        {/* Заголовок + адрес + страховка + онлайн-оплата */}
        <div className="space-y-2 -mt-1">
          <div className="flex justify-between items-start gap-2">
  <h3 className="text-xl font-semibold text-foreground line-clamp-2">{title}</h3>

  {/* Группа иконок */}
  <div className="flex items-center gap-1 shrink-0">
    {useInsurance && (
      <ShieldCheck
        className="w-5 h-5 text-orange-500"
        aria-label={t('listing:insuredAria')}
      />
    )}
    {onlinePayment && (
      <CreditCard
        className="w-5 h-5 text-indigo-500"
        aria-label={t('listing:onlinePaymentAria')}
      />
    )}
  </div>
</div>
          <p className="text-base text-muted-foreground flex items-start gap-1">
  <MapPin className="w-4 h-4 shrink-0 mt-[2px]" />
  <span className="break-words leading-snug">
    {city}{district ? `, ${district}` : ''}{address ? ` — ${address}` : ''}
  </span>
</p>
        </div>

        {/* Характеристики */}
        <div className="flex flex-wrap items-center gap-4 text-base text-muted-foreground">
          {type && (
            <span className="flex items-center gap-1">
              <Home className="w-4 h-4" /> {t(`types:${type}`)}
            </span>
          )}
          {area != null && (
            <span className="flex items-center gap-1">
              <Ruler className="w-4 h-4" /> {area} {t('listing:areaUnit', 'м²')}
            </span>
          )}
          {rooms != null && (
            <span className="flex items-center gap-1">
              <DoorOpen className="w-4 h-4" /> {rooms} {t('listing:roomsShort', 'комн.')}
            </span>
          )}
        </div>

        {/* Правила */}
        <div className="flex flex-wrap items-center gap-4 text-base text-muted-foreground">
          <span className="flex items-center gap-2">
            <PawPrint className="w-4 h-4" />
            {t('listing:pets', 'Животные')}
            {allowPets ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
          </span>

          <span className="flex items-center gap-2">
            <Baby className="w-4 h-4" />
            {t('listing:kids', 'Дети')}
            {allowKids ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
          </span>

          <span className="flex items-center gap-2">
            <Cigarette className="w-4 h-4" />
            {t('listing:smoking', 'Курение')}
            {allowSmoking ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
          </span>
        </div>

        {/* Цена + способ оплаты (адаптивно) */}
        <div className="flex flex-col gap-2">
          {/* Цена */}
          <div className="text-lg sm:text-xl font-bold text-primary">
            {cur.symbol} {price}{' '}
            <span className="text-sm sm:text-base font-medium text-foreground/70"> {t('listing:perMonth', 'мес')}</span>
            {listing.currency && (
    <div className="text-xs text-muted-foreground">
      {cur.pretty}
    </div>
  )}
          </div>

          {/* Способ оплаты — компактный бейдж с переносами на мобилке */}
          {paymentMethod && (
            <span
              className="inline-flex flex-wrap items-center gap-2 rounded-full bg-muted py-1
                         text-base leading-tight max-w-full"
            >
              <span className="shrink-0">{paymentIcon}</span>
              <span className="text-muted-foreground">
                {t('StepRentConditions:fields.paymentMethod')}
              </span>
              <span className="font-medium">
                {t(`StepRentConditions:options.payment.${paymentMethod}`)}
              </span>
            </span>
          )}
        </div>

        {/* Действия */}
        <div className="pt-4 text-center">
          {isOwner ? (
            <OwnerListingControls listingId={id ?? ''} />
          ) : (
            <Link
              href={`/listing/${id}`}
              className="inline-block text-sm font-medium text-orange-600 border border-orange-300 bg-orange-50 px-4 py-2 rounded-lg hover:bg-orange-100 transition"
            >
              {t('listing:details', 'Подробнее')} →
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
