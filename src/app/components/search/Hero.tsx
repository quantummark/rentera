'use client';

import Image from 'next/image';
import SearchIntro from './SearchIntro';
import SearchCard from './SearchCard';

export default function Hero() {
  return (
    <section className="relative w-full mx-auto px-4 sm:px-6 md:px-8 min-h-[120vh] py-10 flex items-center justify-center overflow-hidden rounded-2xl">
      {/* Фоновое изображение */}
      <Image
        src="/images/Hero3.webp"
        alt="Hero Background"
        fill
        priority
        className="object-cover object-center -z-10"
      />

      {/* Затемняющий слой */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Контент */}
      <div className="w-full max-w-7xl px-4 md:px-10 flex flex-col items-center justify-center text-center text-white z-10">
        {/* Слоган и описание */}
        <SearchIntro />

        {/* Карточка поиска */}
        <div className="w-full max-w-4xl mt-10">
          <SearchCard />
        </div>
      </div>
    </section>
  );
}
