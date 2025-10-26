'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useListingForm } from '@/context/ListingFormContext';
import { useTranslation } from 'react-i18next';
import CustomSelect from '@/components/ui/CustomSelect'; 

// ключи типов — храним в БД именно ИХ
const TYPE_KEYS = [
  'apartment',
  'house',
  'room',
  'studio',
  'townhouse',
  'villa',
  'loft',
  'duplex',
  'penthouse',
  'cottage',
  'apartmentSuite' // «Апартаменты» как отдельный тип
] as const;

export type ListingTypeKey = (typeof TYPE_KEYS)[number];

export default function StepBasicInfo() {
  const { data, updateData } = useListingForm();
  const { t } = useTranslation(['listingForm', 'listing']);

  const typeOptions = TYPE_KEYS.map((key) => ({
    value: key,
    // подписи берём из "listing" (центр типов) с фолбэком
    label: t(`listing:${key}`, key)
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {t('listingForm:sections.basic')}
      </h2>

      {/* Заголовок */}
      <div className="space-y-2">
        <Label htmlFor="title">{t('listingForm:fields.title')}</Label>
        <Input
          id="title"
          placeholder={t('listingForm:placeholders.title')}
          value={data.title || ''}
          onChange={(e) => updateData({ title: e.target.value })}
          required
        />
      </div>

      {/* Страна */}
      <div className="space-y-2">
        <Label htmlFor="country">{t('listingForm:fields.country', 'Страна')}</Label>
        <Input
          id="country"
          placeholder={t('listingForm:placeholders.country', 'Україна')}
          value={data.country || ''}
          onChange={(e) => updateData({ country: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Город */}
        <div className="space-y-2">
          <Label htmlFor="city">{t('listingForm:fields.city')}</Label>
          <Input
            id="city"
            placeholder={t('listingForm:placeholders.city', 'Київ')}
            value={data.city || ''}
            onChange={(e) => updateData({ city: e.target.value })}
            required
          />
        </div>

        {/* Район */}
        <div className="space-y-2">
          <Label htmlFor="district">{t('listingForm:fields.district')}</Label>
          <Input
            id="district"
            placeholder={t('listingForm:placeholders.district')}
            value={data.district || ''}
            onChange={(e) => updateData({ district: e.target.value })}
          />
        </div>

        {/* Адрес */}
        <div className="space-y-2">
          <Label htmlFor="address">{t('listingForm:fields.address')}</Label>
          <Input
            id="address"
            placeholder={t('listingForm:placeholders.address')}
            value={data.address || ''}
            onChange={(e) => updateData({ address: e.target.value })}
          />
        </div>

        {/* Тип жилья (сохраняем ключ) */}
        <div className="space-y-2">
          <Label htmlFor="type">{t('listingForm:fields.type')}</Label>
          <CustomSelect
            value={data.type || ''}
            onChange={(value) => updateData({ type: value as ListingTypeKey })}
            options={typeOptions}
            placeholder={t('listingForm:placeholders.type', '—')}
          />
        </div>

        {/* Площадь */}
        <div className="space-y-2">
          <Label htmlFor="area">{t('listingForm:fields.area')}</Label>
          <Input
            id="area"
            type="number"
            min={1}
            placeholder="45"
            value={data.area ?? ''}
            onChange={(e) => updateData({ area: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>

        {/* Комнаты */}
        <div className="space-y-2">
          <Label htmlFor="rooms">{t('listingForm:fields.rooms')}</Label>
          <Input
            id="rooms"
            type="number"
            min={1}
            placeholder="2"
            value={data.rooms ?? ''}
            onChange={(e) => updateData({ rooms: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
      </div>
    </div>
  );
}
