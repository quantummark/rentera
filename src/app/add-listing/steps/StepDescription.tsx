'use client';

import { useListingForm } from '@/context/ListingFormContext';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from 'react-i18next';

const ALL_AMENITIES: string[] = [
  'Wi-Fi',
  'Стиральная машина',
  'Парковка',
  'Балкон',
  'Кондиционер',
  'Лифт',
  'Отопление',
  'Мебель',
  'Духовка',
  'Варочная поверхность',
  'Микроволновка',
  'Холодильник',
  'Посудомоечная машина',
  'Бойлер / Водонагреватель',
  'Смарт-ТВ',
  'Близость к метро',
  'Шумоизоляция',
  'Современный жилой комплекс',
  'Охраняемая территория',
  'Консьерж / охрана',
];

export default function StepDescriptionAndAmenities() {
  const { data, updateData } = useListingForm();
  const { t } = useTranslation();

  const toggleAmenity = (amenity: string) => {
    if (data.amenities.includes(amenity)) {
      updateData({
        amenities: data.amenities.filter((item) => item !== amenity),
      });
    } else {
      updateData({
        amenities: [...data.amenities, amenity],
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {t('listing.descriptionAndAmenities.title', '3. Описание и удобства')}
      </h2>

      {/* Описание */}
      <div className="space-y-2">
        <Label htmlFor="description">
          {t('listing.descriptionAndAmenities.descriptionLabel', 'Описание объекта')}
        </Label>
        <Textarea
          id="description"
          rows={6}
          placeholder={t(
            'listing.descriptionAndAmenities.descriptionPlaceholder',
            'Расскажите об объекте, районе, преимуществах...'
          )}
          value={data.description}
          onChange={(e) => updateData({ description: e.target.value })}
        />
      </div>

      {/* Удобства */}
      <div className="space-y-3">
        <Label>
          {t('listing.descriptionAndAmenities.amenitiesLabel', 'Удобства')}
        </Label>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {ALL_AMENITIES.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={amenity}
                checked={data.amenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
              />
              <Label htmlFor={amenity} className="text-sm text-foreground">
                {t(`listing.amenities.${amenity}`, amenity)}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
