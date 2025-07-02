'use client';

import {
  Home,
  Ruler,
  DoorOpen,
  Clock3,
  Calendar,
  PawPrint,
  Baby,
  Cigarette,
  HandCoins,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Listing } from '@/app/types/listing';
import { format } from 'date-fns';
import { ru, uk, enUS } from 'date-fns/locale';

interface ListingConditionsProps {
  listing: Listing;
}

export default function ListingConditions({ listing }: ListingConditionsProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'ru' ? ru : i18n.language === 'uk' ? uk : enUS;

  const items = [
    {
      icon: Home,
      label: t('listing.type', 'Тип жилья'),
      value: listing.type,
      bg: 'bg-blue-100 dark:bg-blue-900',
      color: 'text-blue-600 dark:text-blue-300',
    },
    {
      icon: Ruler,
      label: t('listing.area', 'Площадь'),
      value: `${listing.area} м²`,
      bg: 'bg-purple-100 dark:bg-purple-900',
      color: 'text-purple-600 dark:text-purple-300',
    },
    {
      icon: DoorOpen,
      label: t('listing.rooms', 'Количество комнат'),
      value: `${listing.rooms}`,
      bg: 'bg-orange-100 dark:bg-orange-900',
      color: 'text-orange-600 dark:text-orange-300',
    },
    {
      icon: Clock3,
      label: t('listing.rentDuration', 'Срок аренды'),
      value: listing.rentDuration || t('listing.notSpecified', 'Не указано'),
      bg: 'bg-teal-100 dark:bg-teal-900',
      color: 'text-teal-600 dark:text-teal-300',
    },
    {
      icon: Calendar,
      label: t('listing.availableFrom', 'Доступно с'),
      value: listing.availableFrom
        ? format(new Date(listing.availableFrom), 'dd MMMM yyyy', { locale })
        : t('listing.notSpecified', 'Не указано'),
      color: 'text-yellow-600 dark:text-yellow-300',
    },
    {
      icon: HandCoins,
      label: t('listing.deposit', 'Залог'),
      value: listing.useInsurance
        ? t('listing.noDepositRequired', 'Не требуется')
        : listing.deposit
        ? `$${listing.deposit}`
        : t('listing.notSpecified', 'Не указано'),
      bg: 'bg-yellow-100 dark:bg-yellow-900',
      color: 'text-yellow-600 dark:text-yellow-300',
    },
    {
      icon: PawPrint,
      label: t('listing.petsAllowed', 'С животными'),
      value: listing.allowPets ? t('listing.allowed', 'Разрешено') : t('listing.notAllowed', 'Запрещено'),
      bg: 'bg-green-100 dark:bg-green-900',
      color: 'text-green-600 dark:text-green-300',
    },
    {
      icon: Baby,
      label: t('listing.kidsAllowed', 'С детьми'),
      value: listing.allowKids ? t('listing.allowed', 'Разрешено') : t('listing.notAllowed', 'Запрещено'),
      bg: 'bg-pink-100 dark:bg-pink-900',
      color: 'text-pink-600 dark:text-pink-300',
    },
    {
      icon: Cigarette,
      label: t('listing.smokingAllowed', 'Курение'),
      value: listing.allowSmoking ? t('listing.allowed', 'Разрешено') : t('listing.notAllowed', 'Запрещено'),
      bg: 'bg-red-100 dark:bg-red-900',
      color: 'text-red-600 dark:text-red-300',
    },
  ];

  return (
    <section className="py-8 px-4 md:px-10 space-y-6">
      <h2 className="text-xl font-semibold">{t('listing.rentConditions', 'Условия аренды')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <Card key={index} className="p-4 rounded-2xl shadow-sm bg-muted">
  <div className="flex items-center gap-4">
    <div className={`p-2 rounded-md ${item.bg}`}>
      <item.icon className={`w-6 h-6 ${item.color}`} />
    </div>
    <div className="flex flex-col">
      <p className="text-sm text-muted-foreground">{item.label}</p>
      <p className="text-base font-medium text-foreground">{item.value}</p>
    </div>
  </div>
</Card>
        ))}
      </div>
    </section>
  );
}