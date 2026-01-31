'use client';

import { useTheme } from 'next-themes';
import SearchIntro from './SearchIntro';
import SearchCard from './SearchCard';
import { cn } from '@/lib/utils';

export default function Hero() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className="w-full px-1 sm:px-6 md:px-8">
      <div
        className={cn(
          'relative mx-auto w-full max-w-7xl overflow-hidden rounded-3xl',
          'py-10 sm:py-12 lg:py-12'
        )}
      >
        {/* ===== ФОН ===== */}
        <div
          className="absolute inset-0 -z-10 transition-colors duration-700"
          style={{
            background: isDark
              ? `
                radial-gradient(60rem 45rem at 10% 15%, rgba(255,140,80,0.35), transparent 70%),
                radial-gradient(55rem 55rem at 90% 30%, rgba(120,100,255,0.32), transparent 70%),
                radial-gradient(45rem 45rem at 50% 85%, rgba(80,200,255,0.22), transparent 70%),
                linear-gradient(
                  180deg,
                  rgba(10,12,20,1) 0%,
                  rgba(16,20,32,1) 50%,
                  rgba(18,22,36,1) 100%
                )
              `
              : `
                radial-gradient(60rem 45rem at 10% 20%, rgba(255,190,150,0.45), transparent 70%),
                radial-gradient(55rem 55rem at 90% 25%, rgba(180,210,255,0.45), transparent 70%),
                radial-gradient(45rem 45rem at 50% 80%, rgba(220,190,255,0.35), transparent 70%),
                linear-gradient(
                  180deg,
                  #ffffff 0%,
                  #f7f9fc 60%,
                  #f3f6fb 100%
                )
              `,
          }}
        />

        {/* ===== КОНТЕНТ ===== */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-3 sm:px-6 md:px-10 text-center">
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
