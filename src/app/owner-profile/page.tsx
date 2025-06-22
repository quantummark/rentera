'use client';

import { useTranslation } from 'react-i18next';
import OwnerCard from '@/app/components/profile/OwnerCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function OwnerProfilePage() {
  const { t } = useTranslation();

  const owner = {
    name: 'Алексей Коваленко',
    location: 'Киев',
    bio: 'Сдаю жильё на Позняках. Люблю путешествия, кофе и порядок в квартире.',
    email: 'alex@example.com',
    phone: '+380501234567',
    socials: {
      instagram: 'https://instagram.com/alexrent',
    },
    avatar: 'https://i.postimg.cc/JhT84hrB/photo-2025-03-20-00-48-53.jpg',
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32 bg-background space-y-10">
      {/* Визитка */}
      <OwnerCard {...owner} />

      {/* Мои объявления */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t('owner.profile.myListings', 'Мои объявления')}</h2>
          <Button variant="default" className="bg-orange-500 hover:bg-orange-600 text-white">
            {t('owner.profile.addListing', 'Добавить объект')}
          </Button>
        </div>
        <Separator />
        <div className="flex items-center justify-center py-10">
          <p className="text-center text-lg font-semibold text-muted-foreground max-w-xl">
            {t('owner.profile.noListings', 'У вас пока нет ни одного объекта. Добавьте его прямо сейчас — это быстро и просто!')}
          </p>
        </div>
      </section>

      {/* Отзывы */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t('owner.profile.reviews', 'Отзывы арендаторов')}</h2>
        </div>
        <Separator />
        <div className="flex items-center justify-center py-10">
          <p className="text-center text-lg font-semibold text-muted-foreground max-w-xl">
            {t('owner.profile.noReviews', 'Пока ни одного комментария не добавлено.')}
          </p>
        </div>
      </section>
    </div>
  );
}
