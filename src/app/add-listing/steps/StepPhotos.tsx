'use client';

import { useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useListingForm } from '@/context/ListingFormContext';
import Image from 'next/image'; 

export default function StepPhotos() {
  const { t } = useTranslation();
  const { data, updateData } = useListingForm();
  const inputRef = useRef<HTMLInputElement>(null);

  // Очистка object URLs при размонтировании
  useEffect(() => {
    const urls = data.photos.map((file) => URL.createObjectURL(file));
    return () => urls.forEach(URL.revokeObjectURL);
  }, [data.photos]);

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(t('listing:photos.invalidType'));
      return;
    }

    if (data.photos.length >= 10) {
      alert(t('listing:photos.limitReached'));
      return;
    }

    updateData({ photos: [...data.photos, file] });

    e.target.value = '';
  };

  const removeImage = (index: number) => {
    updateData({ photos: data.photos.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold block">
        {t('listing:photos.title')}
      </Label>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {data.photos.map((file, index) => {
          const url = URL.createObjectURL(file);
          return (
            <div
              key={index}
              className="relative w-full aspect-square rounded-xl overflow-hidden shadow bg-muted"
            >
              <Image
                src={url}
                alt={`${t('listing:photos.alt')} ${index + 1}`}
                className="object-cover w-full h-full"
                fill
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-black/50 hover:bg-black/80 rounded-full p-1 text-white transition"
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
        {t('listing:photos.note')}
      </p>
    </div>
  );
}
