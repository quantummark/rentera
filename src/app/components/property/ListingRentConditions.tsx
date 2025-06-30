'use client';

import { Calendar, CreditCard, HandCoins, ShieldCheck, Users, Baby, Cigarette, Clock3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { ru, uk, enUS } from 'date-fns/locale';
import { Listing } from '@/app/types/listing';

interface ListingConditionsProps {
  listing: Listing;
}

export default function ListingConditions({ listing }: ListingConditionsProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'ru' ? ru : i18n.language === 'uk' ? uk : enUS;

  const {
    price,
    onlinePayment,
    useInsurance,
    deposit,
    rentDuration,
    availableFrom,
    allowPets,
    allowKids,
    allowSmoking,
  } = listing;

  const items = [
    {
      icon: CreditCard,
      label: t('listing.price', 'Цена в месяц'),
      value: `$${price}`,
    },
    {
      icon: ShieldCheck,
      label: t('listing.insurance', 'Используется страхование'),
      value: useInsurance ? t('listing.yes', 'Да') : `$${deposit}`,
    },
    {
      icon: Clock3,
      label: t('listing.rentDuration', 'Срок аренды'),
      value: rentDuration,
    },
    {
      icon: Calendar,
      label: t('listing.availableFrom', 'Доступно с'),
      value: availableFrom
        ? format(new Date(availableFrom), 'dd MMMM yyyy', { locale })
        : t('listing.notSpecified', 'Не указано'),
    },
    {
      icon: HandCoins,
      label: t('listing.onlinePayment', 'Онлайн-оплата'),
      value: onlinePayment ? t('listing.enabled', 'Включена') : t('listing.disabled', 'Отключена'),
    },
    {
      icon: Users,
      label: t('listing.petsAllowed', 'С животными'),
      value: allowPets ? t('listing.allowed', 'Разрешено') : t('listing.notAllowed', 'Запрещено'),
    },
    {
      icon: Baby,
      label: t('listing.kidsAllowed', 'С детьми'),
      value: allowKids ? t('listing.allowed', 'Разрешено') : t('listing.notAllowed', 'Запрещено'),
    },
    {
      icon: Cigarette,
      label: t('listing.smokingAllowed', 'Курение'),
      value: allowSmoking ? t('listing.allowed', 'Разрешено') : t('listing.notAllowed', 'Запрещено'),
    },
  ];

  return (
    <section className="py-8 px-4 md:px-10 space-y-6">
      <h2 className="text-xl font-semibold">{t('listing.rentConditions', 'Условия аренды')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <Card key={index} className="rounded-2xl bg-muted p-4 flex items-start gap-4">
            <item.icon className="w-6 h-6 text-primary shrink-0" />
            <CardContent className="p-0">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-base font-medium text-foreground">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
