'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function UpperBlock() {
  const { t } = useTranslation('landing');

  return (
    <section
      className={cn(
        'relative flex items-center justify-center',
        'min-h-[80vh] rounded-2xl overflow-hidden px-4 sm:px-6 md:px-8'
      )}
    >
      {/* ===== Яркие ауры без тёмного фона ===== */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* мягкий верхний свет */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 block dark:hidden"
            style={{
              background:
                'radial-gradient(80% 60% at 50% -10%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 70%)',
            }}
          />
          <div
            className="absolute inset-0 hidden dark:block"
            style={{
              background:
                'radial-gradient(80% 60% at 50% -10%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)',
            }}
          />
        </div>

        {/* крупные, насыщенные пятна */}
        <div
          className="absolute -top-40 -left-24 h-[32rem] w-[32rem] rounded-full blur-[120px]"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(255,120,60,0.55) 0%, rgba(255,120,60,0) 80%)',
          }}
        />
        <div
          className="absolute -bottom-40 -right-32 h-[40rem] w-[40rem] rounded-full blur-[140px]"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(120,80,255,0.55) 0%, rgba(120,80,255,0) 80%)',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[38rem] w-[38rem] rounded-full blur-[150px]"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(60,200,255,0.38) 0%, rgba(60,200,255,0) 80%)',
          }}
        />

        {/* лёгкая текстура */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-soft-light [background-image:url('/noise.png')]" />
      </div>

      {/* ===== Плавающие бейджи ===== */}
      <div className="pointer-events-none absolute inset-0 overflow-visible">
        <div className="absolute left-6 sm:left-8 top-12 sm:top-16 animate-float delay-100">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur px-3 py-1.5 text-base sm:text-sm font-medium text-muted-foreground dark:text-muted-foreground ring-1 ring-white/40 dark:ring-white/10 shadow-sm select-none">
            {t('landing:verifiedOwners')} ✅
          </span>
        </div>
        <div className="absolute right-6 sm:right-8 top-28 sm:top-32 animate-float delay-300">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur px-3 py-1.5 text-base sm:text-sm font-medium text-muted-foreground dark:text-muted-foreground ring-1 ring-white/40 dark:ring-white/10 shadow-sm select-none">
            {t('landing:verifiedListings')} 📌
          </span>
        </div>
        <div className="absolute left-8 bottom-16 animate-float delay-500">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur px-3 py-1.5 text-base sm:text-sm font-medium text-muted-foreground dark:text-muted-foreground ring-1 ring-white/40 dark:ring-white/10 shadow-sm select-none">
            {t('landing:support')} 🛟
          </span>
        </div>
      </div>

      {/* ===== Контент ===== */}
      <div className="relative z-10 text-center space-y-6 p-6 md:p-12 w-full max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold font-sans uppercase bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-300 drop-shadow-lg">
  {t('landing:welcome')}
</h1>

        <p className="text-lg md:text-2xl text-muted-foreground dark:text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed tracking-wide">
          {t('landing:subtitle')}
        </p>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:gap-4 justify-center">
          <Link
  href="/search"
  className="
    relative overflow-hidden
    px-9 py-3.5
    text-lg font-semibold
    rounded-full
    bg-orange-500 text-white
    shadow-[0_10px_30px_rgba(255,140,60,0.35)]
    transition-all duration-300
    hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(255,140,60,0.45)]
    active:translate-y-0
    inline-flex items-center justify-center
    w-full md:w-auto
  "
>
  {t('landing:startSearch')}
</Link>

          <Link
  href="/login"
  className="
    px-9 py-3.5
    text-lg font-semibold
    rounded-full

    bg-white/70
    backdrop-blur-md

    text-slate-800
    border border-slate-200

    shadow-sm
    transition-all duration-300

    hover:bg-white
    hover:shadow-md
    hover:-translate-y-0.5

    inline-flex items-center justify-center
    w-full md:w-auto
  "
>
 {t('landing:startRenting')}
</Link>
        </div>
      </div>

      {/* ===== Animations ===== */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-8px) translateX(4px); }
          100% { transform: translateY(0) translateX(0); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .animate-float { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
