'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Listing } from '@/app/types/listing';
import { Card } from '@/components/ui/card';
import {
  MapPin, ShieldCheck, Ruler, DoorOpen,
  PawPrint, Baby, Cigarette,
  CreditCard, Bitcoin, Banknote, Sparkles
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import OwnerListingControls from './OwnerListingControls';
import { cn } from '@/lib/utils';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import FavoriteToggle from '@/app/components/property/FavoriteToggle';
import ListingImageSlider from './ListingImageSlider';
import MapLinkButton from './MapLinkButton';
import CopyLinkButton from '@/app/components/property/CopyLinkButton';


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
    useInsurance, allowKids, allowPets, allowSmoking, ownerId,
    currency, paymentMethod
  } = listing;

  const isOwner = user?.uid === ownerId;

  const handleDelete = async (listingId: string) => {
    try {
      await deleteDoc(doc(db, 'listings', listingId));
    } catch (error) {
      console.error('Error removing listing:', error);
    }
  };

  const currencyMeta = useMemo(() => ({
    USD: { symbol: '$', pretty: 'USD' },
    EUR: { symbol: '€', pretty: 'EUR' },
    UAH: { symbol: '₴', pretty: 'UAH' },
    BTC: { symbol: '₿', pretty: 'BTC' },
    ETH: { symbol: 'Ξ', pretty: 'ETH' },
    USDT: { symbol: '₮', pretty: 'USDT' },
    SOL: { symbol: '◎', pretty: 'SOL' },
  }), []);

  const cur = currency ? currencyMeta[currency as keyof typeof currencyMeta] : { symbol: '', pretty: '' };

  const formattedPrice = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 })
    .format(Number(price) || 0);

  const paymentMeta = useMemo(() => ({
    cash: { icon: Banknote, label: t('StepRentConditions:options.payment.cash', 'Готівка') },
    card: { icon: CreditCard, label: t('StepRentConditions:options.payment.card', 'Картка') },
    crypto: { icon: Bitcoin, label: t('StepRentConditions:options.payment.crypto', 'Crypto') },
  }), [t]);

  const pay = paymentMethod ? paymentMeta[paymentMethod as keyof typeof paymentMeta] : null;
  const PayIcon = pay?.icon;

  return (
    <Card className="group flex flex-col overflow-hidden rounded-3xl p-0 leading-none border border-border/50 bg-card shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1">
      {/* 1) Слайдер — без зазора сверху */}
      <ListingImageSlider
        photos={photos}
        title={title}
        href={`/listing/${id}`}
        badges={
          <>
            {/* Страховка (вместо Verified) */}
            {useInsurance && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-500/80 backdrop-blur-md text-white text-xs font-medium shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('listing:insurance', 'Страховка')}</span>
              </div>
              // При наведении на бейдж появляеться тултип с пояснением

            )}

            {/* Чип со способом оплаты — ПОД страховкой */}
            {paymentMethod && pay && PayIcon && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-white text-xs font-medium shadow-sm">
                <PayIcon className={cn(
                  "w-3.5 h-3.5",
                  paymentMethod === 'crypto' && "text-yellow-300",
                  paymentMethod === 'card' && "text-indigo-200",
                  paymentMethod === 'cash' && "text-emerald-200"
                )} />
                <span>{pay.label}</span>
              </div>
            )}
          </>
        }
        actionSlot={
  !isOwner && (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-black/30 backdrop-blur-md hover:bg-black/45 transition-colors text-white">
        <FavoriteToggle listing={listing} />
      </div>

      <CopyLinkButton href={`/listing/${id}`} />
    </div>
  )
}
      />

      {/* 2) Контент */}
      <div className="flex flex-col flex-1 px-4 pb-4 pt-0 gap-3">
        {/* Заголовок */}
        <div>
          <h3 className="text-lg font-bold text-foreground leading-snug line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Полный адрес (city + district + address) */}
          <div className="mt-1 flex items-start justify-between gap-2">
  <div className="flex items-start gap-1.5 text-sm text-muted-foreground font-medium">
    <MapPin className="w-3.5 h-3.5 shrink-0 mt-[2px]" />
    <div className="leading-snug break-words">
      <div>
        <span className="text-foreground/85">{city}</span>
        {district && <span className="text-muted-foreground"> • {district}</span>}
      </div>
      {address && <div className="text-muted-foreground/90">{address}</div>}
    </div>
  </div>

  <MapLinkButton
    variant="icon"
    address={`${city}${district ? `, ${district}` : ''}${address ? `, ${address}` : ''}`}
  />
</div>
        </div>

        {/* Характеристики */}
        <div className="flex flex-wrap gap-2">
          {type && (
            <div className="
  px-2.5 py-1 rounded-lg
  bg-muted/70 dark:bg-background-dark/70
  backdrop-blur-md
  border border-border/60
  text-xs font-semibold
  text-muted-foreground
  shadow-sm
  flex items-center gap-1.5
">
              <Sparkles className="w-3.5 h-3.5 text-muted-foreground/80" />
              {t(`types:${type}`)}
            </div>
          )}
          {area != null && (
            <div className="
  px-2.5 py-1 rounded-lg
  bg-muted/70 dark:bg-background-dark/70
  backdrop-blur-md
  border border-border/60
  text-xs font-semibold
  text-muted-foreground
  shadow-sm
  flex items-center gap-1.5
">
              <Ruler className="w-3.5 h-3.5 text-muted-foreground/80" />
              {area} {t('listing:areaUnit')}
            </div>
          )}
          {rooms != null && (
            <div className="
  px-2.5 py-1 rounded-lg
  bg-muted/70 dark:bg-background-dark/70
  backdrop-blur-md
  border border-border/60
  text-xs font-semibold
  text-muted-foreground
  shadow-sm
  flex items-center gap-1.5
">
              <DoorOpen className="w-3.5 h-3.5 text-muted-foreground/80" />
              {rooms} {t('listing:roomsShort')}
            </div>
          )}
        </div>

        {/* Правила */}
        <div className="flex items-center gap-3 py-2 border-t border-b border-dashed border-border/60">
          <Rule label={t('listing:kids', 'Діти')} ok={!!allowKids} icon={<Baby className="w-4 h-4" />} />
          <div className="w-px h-3 bg-border/70" />
          <Rule label={t('listing:pets', 'Тварини')} ok={!!allowPets} icon={<PawPrint className="w-4 h-4" />} />
          <div className="w-px h-3 bg-border/70" />
          <Rule label={t('listing:smoking', 'Куріння')} ok={!!allowSmoking} icon={<Cigarette className="w-4 h-4" />} />
        </div>

{/* Футер: цена + действия */}
<div className="mt-auto pt-1 flex flex-col gap-3">
  {/* Верхняя линия: цена (+ paymentMethod) и кнопка (только для НЕ владельца) */}
  <div className="flex items-end justify-between gap-3">
    <div className="min-w-0">
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-foreground">
          {cur.symbol}{formattedPrice}
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          {t('listing:perMonth', 'міс')}
        </span>
      </div>

      {paymentMethod && (
        <div className="text-xs text-muted-foreground mt-0.5">
          {t('StepRentConditions:fields.paymentMethod')}:{" "}
          <span className="font-medium text-foreground/80">
            {t(`StepRentConditions:options.payment.${paymentMethod}`)}
          </span>
        </div>
      )}
    </div>

    {/* ✅ Обычная карточка: кнопка рядом с ценой */}
    {!isOwner && (
      <Link
        href={`/listing/${id}`}
        className="
          inline-flex items-center justify-center
          h-10 px-5 rounded-xl
          bg-orange-500/15
          backdrop-blur-md
          border border-orange-500/25
          text-sm font-semibold
          text-orange-500
          hover:bg-orange-500/20
          transition-all
          active:scale-[0.98]
          shadow-sm
          shrink-0
        "
      >
        {t('listing:details', 'Детальніше')}
      </Link>
    )}
  </div>

  {/* ✅ Карточка владельца: controls под ценой */}
  {isOwner && (
    <div className="w-full">
      <OwnerListingControls
        listingId={listing.id!}
        viewHref={`/listing/${listing.id}`}
        editHref={`/listing/${listing.id}?edit=1`}
        onDelete={(listingId) => handleDelete(listingId)}
        compact
        className="w-full"
      />
    </div>
  )}
</div>
      </div>
    </Card>
  );
}

function Rule({ icon, ok, label }: { icon: React.ReactNode; ok: boolean; label: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium",
        ok ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground/70"
      )}
    >
      {icon}
      <span className={cn(!ok && "line-through decoration-muted-foreground/50")}>
        {label}
      </span>
    </div>
  );
}
