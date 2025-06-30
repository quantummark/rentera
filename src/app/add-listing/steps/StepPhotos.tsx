'use client';

import { useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useListingForm } from '@/context/ListingFormContext';

export default function StepPhotos() {
  const { t } = useTranslation();
  const { data, updateData } = useListingForm();
  const inputRef = useRef<HTMLInputElement>(null);

  // Очистка object URLs при размонтировании
  useEffect(() => {
    return () => {
      data.photos.forEach((file) => URL.revokeObjectURL(file as any));
    };
  }, [data.photos]);

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка на тип файла
    if (!file.type.startsWith('image/')) {
      alert(t('listing.photos.invalidType', 'Пожалуйста, выберите изображение.'));
      return;
    }

    if (data.photos.length >= 10) {
      alert(t('listing.photos.limitReached', 'Вы можете загрузить максимум 10 фото.'));
      return;
    }

    const updated = [...data.photos, file];
    updateData({ photos: updated });

    // сброс input
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const updated = data.photos.filter((_, i) => i !== index);
    updateData({ photos: updated });
  };

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold block">
        {t('listing.photos.title', '4. Добавьте фото объекта')}
      </Label>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {data.photos.map((file, index) => {
          const url = URL.createObjectURL(file);

          return (
            <div
              key={index}
              className="relative w-full aspect-square rounded-xl overflow-hidden shadow bg-muted"
            >
              <img
                src={url}
                alt={`${t('listing.photos.alt', 'Фото')} ${index + 1}`}
                className="object-cover w-full h-full"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-black bg-opacity-50 hover:bg-opacity-80 rounded-full p-1 text-white"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}

        {data.photos.length < 10 && (
          <label className="flex items-center justify-center w-full aspect-square border-2 border-dashed border-muted-foreground rounded-xl cursor-pointer hover:border-orange-500 transition bg-muted hover:bg-muted/60">
            <Plus size={28} className="text-muted-foreground" />
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
