'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BadgeDollarSign, CalendarDays, CheckCircle, MapPin, MessageSquare, ShieldCheck, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';





export default function PropertyHero() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Галерея */}
      <div className="w-full md:w-2/3 space-y-4">
        {/* Главное фото */}
        <div className="aspect-video rounded-2xl overflow-hidden">
          <Image
            src="https://i.postimg.cc/9Qb5JfqN/d61145ef978493a0d18628286c51358b.jpg"
            alt="Главное фото"
            width={1200}
            height={800}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Миниатюры + кнопка */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            'https://i.postimg.cc/9Qb5JfqN/d61145ef978493a0d18628286c51358b.jpg',
            'https://i.postimg.cc/NfB4Px5J/42b8f297404f3f00ed32b7bc0e4b75a0.jpg',
            'https://i.postimg.cc/ZKYKTmv2/modern-interior.jpg'
          ].map((src, index) => (
            <Image
              key={index}
              src={src}
              alt={`Фото ${index + 1}`}
              width={100}
              height={100}
              className="w-20 h-20 object-cover rounded-xl"
            />
          ))}

          <button className="ml-2 text-base font-medium text-primary underline whitespace-nowrap hover:text-orange-500 transition">
      {t('property.viewAllPhotos', 'Посмотреть все фото')}
    </button>
        </div>
      </div>

      {/* Инфо-блок */}
      <div className="w-full md:w-1/3 flex flex-col justify-between space-y-6">
        <div className="space-y-3">
          <h1 className="text-xl md:text-2xl font-bold">
            {t('property.title', 'Уютная 2-к квартира с балконом возле метро Университет')}
          </h1>
          <div className="flex items-center text-muted-foreground gap-1 text-sm">
            <MapPin className="w-4 h-4" />
            {t('property.address', 'Киев, ул. Пушкинская (точный адрес после бронирования)')}
          </div>
          <div className="text-3xl font-bold text-orange-500">
            ₴15 000 <span className="text-base font-normal text-muted-foreground">/ мес</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>4.8</span>
            <span className="text-muted-foreground">(12 {t('property.reviews', 'отзывов')})</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 text-sm">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
              {t('property.availableFrom', 'Доступна с')}: <strong>15 июля</strong>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              {t('property.insured', 'Страхование включено')}
            </div>
            <div className="flex items-center gap-2">
              <BadgeDollarSign className="w-4 h-4 text-green-500" />
              {t('property.noDeposit', 'Без залога')}
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex flex-col gap-3 md:pt-4">
          <Button className="bg-green-600 hover:bg-green-700 text-white text-base py-5">
            {t('property.bookNow', 'Арендовать онлайн')}
          </Button>
          <Button variant="outline" className="text-base py-5">
            <MessageSquare className="w-4 h-4 mr-2" />
            {t('property.messageOwner', 'Написать владельцу')}
          </Button>
        </div>

        {/* Владелец */}
        <div className="flex items-center gap-4 pt-6">
          <Image
            src="/mock/avatar.jpg"
            alt="Owner avatar"
            width={48}
            height={48}
            className="rounded-full w-12 h-12 object-cover"
          />
          <div>
            <p className="font-medium">Марина</p>
            <p className="text-sm text-muted-foreground">
              ✅ {t('property.verifiedOwner', 'Проверенный владелец')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}