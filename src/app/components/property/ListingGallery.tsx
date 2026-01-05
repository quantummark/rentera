'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ListingGalleryProps {
  photos: string[];
  title: string;

  /** Слот: справа сверху на главном фото (например: [❤️][🔗]) */
  topRightActions?: React.ReactNode;

  /** Слот: справа снизу на главном фото (например: ⛶ fullscreen) */
  bottomRightActions?: React.ReactNode;

  className?: string;
}

export default function ListingGallery({
  photos,
  title,
  topRightActions,
  bottomRightActions,
  className,
}: ListingGalleryProps) {
  const safePhotos = useMemo(
    () => (Array.isArray(photos) && photos.length > 0 ? photos : ['/placeholder.png']),
    [photos]
  );

  const total = safePhotos.length;

  const [heroIndex, setHeroIndex] = useState(0);

useEffect(() => {
  // если photos поменялись и стало меньше, аккуратно выровняем индекс
  setHeroIndex((i) => Math.min(i, total - 1));
  setCurrentIndex((i) => Math.min(i, total - 1));
}, [total]);

const nextHero = useCallback((e?: React.MouseEvent) => {
  e?.preventDefault();
  e?.stopPropagation();
  if (total <= 1) return;
  setHeroIndex((prev) => (prev + 1) % total);
}, [total]);

const prevHero = useCallback((e?: React.MouseEvent) => {
  e?.preventDefault();
  e?.stopPropagation();
  if (total <= 1) return;
  setHeroIndex((prev) => (prev - 1 + total) % total);
}, [total]);

  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openGallery = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeGallery = () => setIsOpen(false);

  const nextImage = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevImage = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeGallery();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, nextImage, prevImage]);

  return (
    <div className={cn('w-full', className)}>
      {/* Основное фото */}
      <div className="relative aspect-video rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => openGallery(heroIndex)}
          className="absolute inset-0 z-0 cursor-zoom-in"
          aria-label="Open gallery"
        />

        <Image
          src={safePhotos[heroIndex]}
          alt={title}
          fill
          className="object-cover"
          priority={false}
          sizes="(max-width: 768px) 100vw, 60vw"
        />

        {/* Лёгкий градиент снизу для глубины */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/35 to-transparent" />

        {/* HERO-стрелки (листать без fullscreen) */}
{total > 1 && (
  <>
    {/* Левая */}
    <button
      type="button"
      onClick={prevHero}
      className="
        absolute left-3 top-1/2 -translate-y-1/2 z-20
        inline-flex items-center justify-center
        w-9 h-9 rounded-full
        bg-black/30 backdrop-blur-md text-white
        border border-white/15
        shadow-sm
        hover:bg-black/45
        transition
        active:scale-95
        opacity-90 hover:opacity-100
      "
      aria-label="Prev photo"
    >
      <ChevronLeft className="w-5 h-5" />
    </button>

    {/* Правая */}
    <button
      type="button"
      onClick={nextHero}
      className="
        absolute right-3 top-1/2 -translate-y-1/2 z-20
        inline-flex items-center justify-center
        w-9 h-9 rounded-full
        bg-black/30 backdrop-blur-md text-white
        border border-white/15
        shadow-sm
        hover:bg-black/45
        transition
        active:scale-95
        opacity-90 hover:opacity-100
      "
      aria-label="Next photo"
    >
      <ChevronRight className="w-5 h-5" />
    </button>

  
  </>
)}

        {/* Верхний правый блок (❤️ + 🔗) */}
        {topRightActions && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
            {topRightActions}
          </div>
        )}

        {/* Нижний правый блок (⛶ fullscreen) */}
        {bottomRightActions ? (
          <div className="absolute bottom-3 right-3 z-20">{bottomRightActions}</div>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openGallery(heroIndex);
            }}
            className="
              absolute bottom-3 right-3 z-20
              inline-flex items-center justify-center
              w-8 h-8 rounded-full
              bg-black/45 backdrop-blur-md
              text-white
              hover:bg-black/60
              transition
              active:scale-95
            "
            aria-label="Fullscreen"
          >
            <Maximize size={18} />
          </button>
        )}
      </div>

      {/* Миниатюры */}
      {total > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {safePhotos.slice(0, 10).map((photo, index) => (
            <button
              key={index}
              type="button"
              className="relative w-20 h-16 min-w-[80px] rounded-xl overflow-hidden border border-border/60 hover:border-border transition"
              onClick={() => openGallery(index)}
              aria-label={`Open photo ${index + 1}`}
            >
              <Image src={photo} alt={`Photo ${index + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Полноэкранная галерея */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-screen-xl w-full h-[90vh] p-0 bg-black text-white overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={safePhotos[currentIndex]}
              alt={`Photo ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />

            {/* Закрыть */}
            <button
              type="button"
              onClick={closeGallery}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 rounded-full hover:bg-black/75 transition"
              aria-label="Close"
            >
              <X size={22} />
            </button>

            {/* Стрелки */}
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/55 rounded-full hover:bg-black/70 transition"
                  aria-label="Prev"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/55 rounded-full hover:bg-black/70 transition"
                  aria-label="Next"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
