'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface ListingGalleryProps {
  photos: string[];
  title: string;
}

export default function ListingGallery({ photos, title }: ListingGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openGallery = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeGallery = () => {
    setIsOpen(false);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") closeGallery();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, nextImage, prevImage]); // Добавлены зависимости nextImage и prevImage

  return (
    <div className="w-full">
      {/* Основное фото */}
      <div className="relative aspect-video rounded-xl overflow-hidden">
        <Image
          src={photos[0] || "/placeholder.png"}
          alt={title}
          fill
          className="object-cover"
          onClick={() => openGallery(0)}
        />
        <button
          onClick={() => openGallery(0)}
          className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      {/* Миниатюры */}
      <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
        {photos.slice(0, 10).map((photo, index) => (
          <div
            key={index}
            className="relative w-20 h-16 min-w-[80px] cursor-pointer rounded-lg overflow-hidden"
            onClick={() => openGallery(index)}
          >
            <Image src={photo} alt={`Photo ${index + 1}`} fill className="object-cover" />
          </div>
        ))}
      </div>

      {/* Полноэкранная галерея */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-screen-xl w-full h-[90vh] p-0 bg-black text-white">
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={photos[currentIndex]}
              alt={`Photo ${currentIndex + 1}`}
              fill
              className="object-contain"
            />

            {/* Кнопка закрытия */}
            <button
              onClick={closeGallery}
              className="absolute top-4 right-4 z-10 p-2 bg-black/70 rounded-full"
            >
              <X size={24} />
            </button>

            {/* Стрелки */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/70 rounded-full"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/70 rounded-full"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
