'use client';

import { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useListingForm } from '@/context/ListingFormContext';

export default function StepPhotos() {
  const { t } = useTranslation();
  const { data, updateData } = useListingForm();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const updated = [...data.photos, file];
      updateData({ photos: updated });
    }
  };

  const removeImage = (index: number) => {
    const updated = data.photos.filter((_, i) => i !== index);
    updateData({ photos: updated });
  };

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold mb-2 block">
        {t('listing.photos.title', '4. Добавьте фото объекта')}
      </Label>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {data.photos.map((file, index) => {
          const url = URL.createObjectURL(file);
          return (
            <div
              key={index}
              className="relative w-full aspect-square rounded-xl overflow-hidden shadow"
            >
              <img
                src={url}
                className="object-cover w-full h-full"
                alt={`Фото ${index + 1}`}
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-80"
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}

        {data.photos.length < 10 && (
          <label className="flex items-center justify-center w-full aspect-square border-2 border-dashed border-muted-foreground rounded-xl cursor-pointer hover:border-orange-500 transition">
            <Plus size={32} className="text-muted-foreground" />
            <input
              type="file"
              accept="image/*"
              onChange={handleAddImage}
              className="hidden"
              ref={inputRef}
            />
          </label>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        {t('listing.photos.note', 'Максимум 10 фотографий. Нажмите, чтобы загрузить.')}
      </p>
    </div>
  );
}
