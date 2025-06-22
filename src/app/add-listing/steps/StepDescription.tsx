'use client';

import { useListingForm } from '@/context/ListingFormContext';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from 'react-i18next';

export default function StepDescription() {
  const { data, updateData } = useListingForm();
  const { t } = useTranslation();

  const amenities = [
    { key: 'wifi', label: t('listing.description.amenities.wifi', 'Wi-Fi') },
    { key: 'washer', label: t('listing.description.amenities.washer', 'Стиральная машина') },
    { key: 'parking', label: t('listing.description.amenities.parking', 'Парковка') },
    { key: 'balcony', label: t('listing.description.amenities.balcony', 'Балкон') },
    { key: 'ac', label: t('listing.description.amenities.ac', 'Кондиционер') },
    { key: 'elevator', label: t('listing.description.amenities.elevator', 'Лифт') },
    { key: 'heating', label: t('listing.description.amenities.heating', 'Отопление') },
    { key: 'furniture', label: t('listing.description.amenities.furniture', 'Мебель') },
    { key: 'oven', label: t('listing.description.amenities.oven', 'Духовка') },
    { key: 'stove', label: t('listing.description.amenities.stove', 'Варочная поверхность') },
    { key: 'microwave', label: t('listing.description.amenities.microwave', 'Микроволновка') },
    { key: 'fridge', label: t('listing.description.amenities.fridge', 'Холодильник') },
    { key: 'dishwasher', label: t('listing.description.amenities.dishwasher', 'Посудомоечная машина') },
    { key: 'boiler', label: t('listing.description.amenities.boiler', 'Бойлер / Водонагреватель') },
    { key: 'smarttv', label: t('listing.description.amenities.smarttv', 'Смарт-ТВ') },
    { key: 'metro', label: t('listing.description.amenities.metro', 'Близость к метро') },
    { key: 'soundproof', label: t('listing.description.amenities.soundproof', 'Шумоизоляция') },
    { key: 'modern', label: t('listing.description.amenities.modern', 'Современный ЖК') },
    { key: 'security', label: t('listing.description.amenities.security', 'Охраняемая территория') },
    { key: 'concierge', label: t('listing.description.amenities.concierge', 'Консьерж / охрана') }
  ];

  const toggleAmenity = (key: string) => {
    const updated = new Set(data.amenities);
    updated.has(key) ? updated.delete(key) : updated.add(key);
    updateData({ amenities: Array.from(updated) });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {t('listing.description.title', '3. Описание и удобства')}
      </h2>

      {/* Текстовое описание */}
      <div className="space-y-2">
        <Label htmlFor="description">{t('listing.description.label', 'Описание объекта')}</Label>
        <Textarea
          id="description"
          placeholder={t(
            'listing.description.placeholder',
            'Светлая квартира с балконом, окна во двор, рядом метро…'
          )}
          maxLength={1000}
          value={data.description}
          onChange={(e) => updateData({ description: e.target.value })}
          required
        />
      </div>

      {/* Удобства */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
  {amenities.map((item) => (
    <label
      key={item.key}
      className="flex items-center space-x-2 cursor-pointer"
    >
      <Checkbox
        id={item.key}
        checked={data.amenities.includes(item.key)}
        onChange={() => toggleAmenity(item.key)}
      />
      <span>{item.label}</span>
    </label>
  ))}
</div>
      </div>
  );
}
