'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useListingForm } from '@/context/ListingFormContext';
import { useTranslation } from 'react-i18next';

export default function StepBasicInfo() {
  const { data, updateData } = useListingForm();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{t('listing.basic.title', '1. Основная информация')}</h2>

      <div className="space-y-2">
        <Label htmlFor="title">{t('listing.basic.titleLabel', 'Заголовок объявления')}</Label>
        <Input
          id="title"
          placeholder={t('listing.basic.titlePlaceholder', '1-к квартира в центре Киева')}
          value={data.title}
          onChange={(e) => updateData({ title: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">{t('listing.basic.city', 'Город')}</Label>
          <Input
            id="city"
            placeholder="Киев"
            value={data.city}
            onChange={(e) => updateData({ city: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="district">{t('listing.basic.district', 'Район')}</Label>
          <Input
            id="district"
            placeholder="Шевченковский"
            value={data.district}
            onChange={(e) => updateData({ district: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">{t('listing.basic.address', 'Адрес')}</Label>
          <Input
            id="address"
            placeholder="ул. Крещатик, 10"
            value={data.address}
            onChange={(e) => updateData({ address: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">{t('listing.basic.type', 'Тип жилья')}</Label>
          <Input
            id="type"
            placeholder="Квартира / Дом / Комната / Апартаменты"
            value={data.type}
            onChange={(e) => updateData({ type: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="area">{t('listing.basic.area', 'Площадь (м²)')}</Label>
          <Input
            id="area"
            type="number"
            min={1}
            placeholder="45"
            value={data.area}
            onChange={(e) => updateData({ area: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rooms">{t('listing.basic.rooms', 'Количество комнат')}</Label>
          <Input
            id="rooms"
            type="number"
            min={1}
            placeholder="2"
            value={data.rooms}
            onChange={(e) => updateData({ rooms: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>
    </div>
  );
}
