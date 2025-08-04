'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { MapPin, ShieldCheck, CreditCard, MessageCircle } from 'lucide-react';
import ListingGallery from './ListingGallery'; // ✅ импорт галереи
import MapLinkButton from './MapLinkButton'; // ✅ импорт кнопки карты
import { useRouter } from 'next/navigation';

interface ListingHeaderProps {
  listing: {
    ownerId: string;
    title: string;
    city: string;
    district: string;
    address: string;
    photos: string[];
    price: number;
    useInsurance: boolean;
    onlinePayment: boolean;
    owner?: {
      avatar: string;
      name: string;
      rating: number;
      id: string;
    };
  };
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
        <h1 className="text-2xl font-semibold text-foreground leading-tight">{listing.title}</h1>

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
        <div className="pt-4 flex flex-col gap-2">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full rounded-full">
            💰 {t('listing.rentOnline', 'Арендовать онлайн')}
          </Button>
          <Button 
          onClick={() => router.push(`/messages?userId=${listing.ownerId}`)}
          variant="outline" className="w-full rounded-full flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" />
            {t('listing.contactOwner', 'Написать владельцу')}
          </Button>
        </div>

        {/* Владелец */}
        {listing.owner && (
          <div className="flex items-center gap-4 border-t pt-4">
            <Image
              src={listing.owner.avatar || '/avatar-placeholder.png'}
              alt={listing.owner.name}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium">{listing.owner.name}</p>
              <p className="text-xs text-muted-foreground">⭐ {listing.owner.rating?.toFixed(1)} / 5</p>
            </div>
            <Button variant="ghost" className="ml-auto text-sm text-primary px-2">
              {t('listing.viewOwnerProfile', 'Смотреть профиль')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
