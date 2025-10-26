'use client';

import { useListingForm } from '@/context/ListingFormContext';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from 'react-i18next'; 

// ключи удобств — СОХРАНЯЕМ ИХ В БД
const AMENITY_KEYS = [
  'wifi',
  'washingMachine',
  'parking',
  'balcony',
  'airConditioner',
  'elevator',
  'heating',
  'furniture',
  'oven',
  'stove',
  'microwave',
  'fridge',
  'dishwasher',
  'boiler',
  'tv',
  'nearMetro',
  'soundproof',
  'modernComplex',
  'securedArea',
  'concierge',
] as const;

type AmenityKey = (typeof AMENITY_KEYS)[number];

export default function StepDescriptionAndAmenities() {
  const { data, updateData } = useListingForm();
  const { t } = useTranslation(['listingAmenities', 'listing']);

  const toggleAmenity = (amenity: AmenityKey) => {
    if (data.amenities.includes(amenity)) {
      updateData({ amenities: data.amenities.filter((a) => a !== amenity) });
    } else {
      updateData({ amenities: [...data.amenities, amenity] });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {t('listing:descriptionAndAmenities.title')}
      </h2>

      {/* Описание */}
      <div className="space-y-2">
        <Label htmlFor="description">
          {t('listing:descriptionAndAmenities.descriptionLabel')}
        </Label>
        <Textarea
          id="description"
          rows={6}
          placeholder={t('listing:descriptionAndAmenities.descriptionPlaceholder')}
          value={data.description || ''}
          onChange={(e) => updateData({ description: e.target.value })}
        />
      </div>

      {/* Удобства */}
      <div className="space-y-3">
        <Label>
          {t('listing:descriptionAndAmenities.amenitiesLabel')}
        </Label>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {AMENITY_KEYS.map((key) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={key}
                checked={data.amenities.includes(key)}
                onChange={() => toggleAmenity(key)}
              />
              <Label htmlFor={key} className="text-sm text-foreground">
                {t(`listingAmenities:items.${key}`)}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
