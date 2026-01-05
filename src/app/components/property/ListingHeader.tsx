'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  ShieldCheck,
  CreditCard,
  MessageCircle,
  Bitcoin,
  Banknote,
} from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import ListingGallery from './ListingGallery';
import MapLinkButton from './MapLinkButton';
import FavoriteToggle from '@/app/components/property/FavoriteToggle';
import { Button } from '@/components/ui/button';
import RentRequestButton from '@/app/components/Contract/RentRequestButton';
import CopyLinkButton from '@/app/components/property/CopyLinkButton';

// 🔧 инлайн-редакторы
import InlineText from '@/app/components/inline/InlineText';
import InlineNumber from '@/app/components/inline/InlineNumber';
import InlineSelect from '@/app/components/inline/InlineSelect';
import InlineSwitch from '@/app/components/inline/InlineSwitch';
import ListingGalleryEditor from '@/app/components/inline/ListingGalleryEditor';

// ⚠️ как ты и сказал — у тебя уже есть этот helper
import { patchListing } from '@/app/lib/firestore/profiles';

import type { Listing } from '@/app/types/listing';

interface ListingHeaderProps {
  listing: Listing;
  canEdit?: boolean;
  isOwner?: boolean;
  onEnterEdit?: () => void;
}

const currencyOptions = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'UAH', label: 'UAH (₴)' },
  { value: 'BTC', label: 'BTC (₿)' },
  { value: 'ETH', label: 'ETH (Ξ)' },
  { value: 'USDT', label: 'USDT (₮)' },
  { value: 'SOL', label: 'SOL (◎)' },
] as const;

type CurrencyCode = typeof currencyOptions[number]['value'];
export const PAYMENT_METHOD_VALUES = ['cash', 'card', 'crypto'] as const;
export type PaymentMethod = typeof PAYMENT_METHOD_VALUES[number];

export default function ListingHeader({
  listing,
  canEdit = false,
}: ListingHeaderProps) {
  const { t } = useTranslation(['listing', 'StepRentConditions']);
  const router = useRouter();

  const [photos, setPhotos] = useState<string[]>(listing.photos ?? []);
  useEffect(() => {
    setPhotos(listing.photos ?? []);
  }, [listing.photos]);

  // Сохранение массива фоток в Firestore
  const savePhotos = useCallback(async (next: string[]) => {
    setPhotos(next); // оптимистично обновляем UI
    try {
      await patchListing(listing.listingId, { photos: next });
      // toast.success('Галерея обновлена'); // если хочешь уведомление
    } catch (e) {
      // toast.error('Не удалось сохранить галерею');
      // откат при ошибке — вернём назад пропсовые, если нужно:
      setPhotos(listing.photos ?? []);
      throw e;
    }
  }, [listing.listingId, listing.photos]);

  const handleUpload = useCallback(async (files: File[]) => {
    const storage = getStorage(); // или возьми готовый `storage` из своего модуля
    const folder = `listings/${listing.listingId}/photos`;
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      const objectRef = ref(storage, `${folder}/${id}-${file.name}`);
      await uploadBytes(objectRef, file, { contentType: file.type });
      const url = await getDownloadURL(objectRef);
      uploadedUrls.push(url);
    }

    // toast.success(`Загружено: ${uploadedUrls.length}`);
    return uploadedUrls; // Editor ожидает массив URL’ов
  }, [listing.listingId]);

  const currencyMeta: Record<CurrencyCode, { symbol: string; pretty: string }> = {
    USD: { symbol: '$', pretty: t('StepRentConditions:options.currency.USD') },
    EUR: { symbol: '€', pretty: t('StepRentConditions:options.currency.EUR') },
    UAH: { symbol: '₴', pretty: t('StepRentConditions:options.currency.UAH') },
    BTC: { symbol: '₿', pretty: t('StepRentConditions:options.currency.BTC') },
    ETH: { symbol: 'Ξ', pretty: t('StepRentConditions:options.currency.ETH') },
    USDT: { symbol: '₮', pretty: t('StepRentConditions:options.currency.USDT') },
    SOL: { symbol: '◎', pretty: t('StepRentConditions:options.currency.SOL') },
  };

  const paymentOptions = [
  { value: 'cash',  label: t('StepRentConditions:options.payment.cash') },
  { value: 'card',  label: t('StepRentConditions:options.payment.card') },
  { value: 'crypto', label: t('StepRentConditions:options.payment.crypto') },
] as const;

  const cur =
    listing.currency && currencyMeta[listing.currency as CurrencyCode]
      ? currencyMeta[listing.currency as CurrencyCode]
      : { symbol: '', pretty: '' };

  const pm = listing.paymentMethod as PaymentMethod | undefined;
  const paymentIcon =
    pm === 'cash' ? (
      <Banknote className="h-4 w-4 text-emerald-600" />
    ) : pm === 'card' ? (
      <CreditCard className="h-4 w-4 text-indigo-500" />
    ) : pm === 'crypto' ? (
      <Bitcoin className="h-4 w-4 text-amber-500" />
    ) : null;

  // ===== save handlers (все через patchListing) =====
  const saveTitle = (next: string) => patchListing(listing.listingId, { title: next });

  const saveCountry = (next: string) => patchListing(listing.listingId, { country: next });
  const saveCity = (next: string) => patchListing(listing.listingId, { city: next });
  const saveDistrict = (next: string) => patchListing(listing.listingId, { district: next });
  const saveAddress = (next: string) => patchListing(listing.listingId, { address: next });

  const savePrice = (next: number) => patchListing(listing.listingId, { price: next });
  const saveCurrency = (next: string) =>
    patchListing(listing.listingId, { currency: next as CurrencyCode });

  const savePaymentMethod = (next: string) =>
    patchListing(listing.listingId, { paymentMethod: next as PaymentMethod });

  const saveInsurance = (next: boolean) =>
    patchListing(listing.listingId, { useInsurance: next });

  const saveOnlinePayment = (next: boolean) =>
    patchListing(listing.listingId, { onlinePayment: next });

  return (
    <div className="flex flex-col items-start gap-6 md:flex-row">
      {/* Левая колонка с галереей */}
<div className="w-full md:w-2/3">
  {canEdit ? (
    <ListingGalleryEditor
      value={photos}                    // текущие фото (первый = cover)
      onChange={savePhotos}             // сохранение порядка/удалений/cover
      onUpload={handleUpload}           // загрузка файлов -> URL'ы
      max={30}                          // лимит фоток (при желании поменяй)
      title={listing.title || 'Gallery'}
      className="mt-2"
    />
  ) : (
    <ListingGallery
  photos={photos}
  title={listing.title}
  topRightActions={
    <div className="flex items-center gap-2">
      {/* ❤️ */}
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-black/35 backdrop-blur-md hover:bg-black/50 transition text-white">
        <FavoriteToggle listing={listing} />
      </div>

      {/* 🔗 */}
      <CopyLinkButton href={`/listing/${listing.listingId}`} />
    </div>
  }
/>
  )}
</div>


      {/* Инфо-карточка */}
      <div className="w-full space-y-3 rounded-2xl border bg-card p-5 shadow-sm md:w-1/3">
        {/* Заголовок + избранное (title — редактируем) */}
        <div className="flex items-start justify-between gap-3">
  <h1 className="text-2xl font-semibold leading-tight text-foreground">
    <InlineText value={listing.title ?? ''} canEdit={canEdit} onSave={saveTitle} />
  </h1>
</div>

        {/* Адрес (каждое поле редактируем отдельно, остаётся верстка «через запятую») */}
        <div className="flex items-start justify-between gap-3 text-base text-muted-foreground">
  <div className="flex items-start gap-2 flex-1 min-w-0">
    <MapPin className="h-4 w-4 shrink-0 text-blue-500 mt-[2px]" />
    <span className="min-w-0 flex-1 break-words leading-snug">
      <InlineText value={listing.country ?? ''} canEdit={canEdit} onSave={saveCountry} />
      {'• '}
      <InlineText value={listing.city ?? ''} canEdit={canEdit} onSave={saveCity} />
      {listing.district ? `• ` : ''}
      {listing.district && (
        <InlineText value={listing.district} canEdit={canEdit} onSave={saveDistrict} />
      )}
      {listing.address ? `• ` : ''}
      {listing.address && (
        <InlineText value={listing.address} canEdit={canEdit} onSave={saveAddress} />
      )}
    </span>
  </div>

  <MapLinkButton
    variant="icon"
    address={`${listing.country ?? ''}, ${listing.city ?? ''}${listing.district ? `, ${listing.district}` : ''}${listing.address ? `, ${listing.address}` : ''}`}
  />
</div>

        {/* Детали аренды — Decision Card */}
<div className="rounded-2xl bg-card/70 backdrop-blur-md p-4 space-y-4 shadow-sm">
  {/* Цена + валюта */}
  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-bold text-foreground">
        {cur.symbol}{' '}
        <InlineNumber
          value={Number(listing.price) || 0}
          min={0}
          step={10}
          canEdit={canEdit}
          onSave={savePrice}
        />
      </span>

      <span className="text-sm font-medium text-muted-foreground">
       {t('listing:perMonth', 'мес')}
      </span>
    </div>

    <div className="text-sm text-muted-foreground">
      <InlineSelect
        value={(listing.currency as string) ?? 'USD'}
        canEdit={canEdit}
        options={currencyOptions.map((c) => ({ value: c.value, label: c.label }))}
        onSave={saveCurrency}
      />
    </div>
  </div>

  {/* Chips row */}
  <div className="flex flex-wrap gap-2">
    {/* Способ оплаты (без дубля) */}
    <div
      className="
        inline-flex items-center gap-2
        rounded-2xl px-3 py-2
        bg-muted/55 backdrop-blur-md
        border border-border/60 shadow-sm
        text-foreground
        max-w-full
      "
    >
      <span className="shrink-0">{paymentIcon}</span>
      <InlineSelect
        value={(listing.paymentMethod as string) ?? 'cash'}
        canEdit={canEdit}
        options={paymentOptions.map((p) => ({ value: p.value, label: p.label }))}
        onSave={savePaymentMethod}
      />
    </div>

    {/* Страховка (убрали дубликат) */}
    <div
      className={[
        "inline-flex items-center gap-2 rounded-2xl px-3 py-2 backdrop-blur-md border shadow-sm",
        listing.useInsurance
          ? "bg-orange-500/15 border-orange-500/25 text-orange-700"
          : "bg-muted/40 border-border/60 text-muted-foreground",
      ].join(' ')}
    >
      <ShieldCheck className="h-4 w-4" />
      <InlineSwitch
        value={Boolean(listing.useInsurance)}
        canEdit={canEdit}
        onSave={saveInsurance}
        trueLabel={t('listing:insuranceEnabled')}
        falseLabel={t('listing:insuranceDisabled')}
      />
    </div>

    {/* Онлайн-оплата (убрали дубликат) */}
    <div
      className={[
        "inline-flex items-center gap-2 rounded-2xl px-3 py-2 backdrop-blur-md border shadow-sm",
        listing.onlinePayment
          ? "bg-indigo-500/15 border-indigo-500/25 text-indigo-700"
          : "bg-muted/40 border-border/60 text-muted-foreground",
      ].join(' ')}
    >
      <CreditCard className="h-4 w-4" />
      <InlineSwitch
        value={Boolean(listing.onlinePayment)}
        canEdit={canEdit}
        onSave={saveOnlinePayment}
        trueLabel={t('listing:onlinePaymentEnabled')}
        falseLabel={t('listing:onlinePaymentDisabled')}
      />
    </div>
  </div>
</div>

        {/* Кнопки действий */}
<div className="pt-4 py-4 flex flex-col gap-2">
  {/* ✅ Кнопка аренды возвращена */}
  <RentRequestButton 
    listingId={listing.listingId}
    ownerId={listing.ownerId}
    listingTitle={listing.title || ''}
  />

  {/* Кнопка «написати власнику» — secondary CTA */}
<Button
  onClick={() => router.push(`/messages?userId=${listing.ownerId}`)}
  className="
    w-full h-12
    rounded-2xl
    flex items-center justify-center gap-2
    bg-muted/60 backdrop-blur-md
    border border-border/60
    text-foreground
    font-medium
    shadow-sm
    hover:bg-muted
    hover:shadow-md
    transition-all
    active:scale-[0.98]
  "
>
  <MessageCircle className="w-4 h-4 text-muted-foreground" />
  {t('listing:contactOwner')}
</Button>
</div>

        {/* Блок «Владелец» */}
<div className="border-t pt-4">
  <Link
    href={`/profile/owner/${listing.ownerId}`}
    className="
      group
      flex items-center gap-4
      cursor-pointer
    "
  >
    {/* Аватар */}
    <Image
      src={listing.ownerAvatar || '/avatar-placeholder.png'}
      alt={listing.ownerName}
      width={56}
      height={56}
      className="
        h-14 w-14 rounded-full object-cover
        transition-transform
        group-hover:scale-[1.03]
      "
    />

    {/* Имя + рейтинг */}
    <div className="flex flex-col justify-center">
      <p
        className="
          text-base font-medium leading-tight
          transition-colors
          group-hover:underline
          group-hover:text-primary
        "
      >
        {listing.ownerName}
      </p>

      <p className="text-sm text-muted-foreground">
        ⭐ {Number(listing.ownerRating ?? 0).toFixed(1)} / 5
      </p>
    </div>
  </Link>
</div>
      </div>
    </div>
  );
}
