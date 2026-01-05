'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ListingImageSliderProps {
  photos: string[];
  title: string;
  href: string;
  badges?: React.ReactNode;
  actionSlot?: React.ReactNode;
}

export default function ListingImageSlider({
  photos = [],
  title,
  href,
  badges,
  actionSlot,
}: ListingImageSliderProps) {
  const [idx, setIdx] = useState(0);
  const total = photos.length || 1;
  const currentSrc = photos[idx] || '/placeholder.png';

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx((i) => (i - 1 + total) % total);
  };

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx((i) => (i + 1) % total);
  };

  return (
    <div className="relative w-full h-64 sm:h-72 overflow-hidden rounded-t-3xl -mt-px leading-none">
      <Link href={href} aria-label={title} className="block w-full h-full">
        <Image
          src={currentSrc}
          alt={title}
          fill
          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />

        {/* subtle gradient снизу */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
      </Link>

      {/* Верхний ряд: бейджи и action */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
  <div className="flex flex-col items-start gap-2 pointer-events-auto">
    {badges}
  </div>
  <div className="pointer-events-auto">
    {actionSlot}
  </div>
</div>

      {/* Навигация — теперь постоянная (если фото > 1) */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Prev image"
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2",
              "p-2 rounded-full",
              "bg-black/25 backdrop-blur-md border border-white/15 text-white",
              "hover:bg-black/35 transition-all active:scale-95"
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={next}
            aria-label="Next image"
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2",
              "p-2 rounded-full",
              "bg-black/25 backdrop-blur-md border border-white/15 text-white",
              "hover:bg-black/35 transition-all active:scale-95"
            )}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Индикатор */}
          <div className="absolute bottom-3 left-3 right-3 flex gap-1.5 h-1">
            {photos.map((_, i) => (
              <div key={i} className="flex-1 h-full rounded-full overflow-hidden bg-white/30">
                <div
                  className={cn(
                    "h-full bg-white shadow-sm transition-all duration-300",
                    i === idx ? "w-full opacity-100" : "w-0 opacity-0"
                  )}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
