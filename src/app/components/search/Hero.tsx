'use client';

import SearchIntro from './SearchIntro';
import SearchCard from './SearchCard';
import { cn } from '@/lib/utils';

export default function Hero() {
  return (
    <section className={cn('w-full px-1 sm:px-6 md:px-8')}>
      <div
        className={cn(
          'relative mx-auto w-full max-w-7xl overflow-hidden rounded-2xl',
          // ВАЖНО: убрали min-h-screen и вертикальный центринг
          'py-10 sm:py-12 lg:py-12'
        )}
      >
        {/* ===== Перформантный фон: мягкие видимые пятна ===== */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `
              radial-gradient(50rem 50rem at 0% 10%,   rgba(255,120,60,0.55), transparent 65%),
              radial-gradient(60rem 60rem at 100% 90%, rgba(110,80,255,0.52), transparent 70%),
              radial-gradient(42rem 42rem at 55% 45%,  rgba(60,200,255,0.38), transparent 65%),
              radial-gradient(55rem 35rem at 50% -5%,  rgba(255,255,255,0.14), transparent 70%),
              linear-gradient(180deg, rgba(5,8,15,1) 0%, rgba(10,14,25,1) 40%, rgba(15,18,30,1) 100%)
              center / cover no-repeat
            `,
          }}
        />

        {/* ===== Контент ===== */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-1 sm:px-6 md:px-10 text-center text-white">
          <SearchIntro />

          <div className="mt-8 sm:mt-10">
            <div className="mx-auto w-full max-w-4xl">
              <SearchCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
