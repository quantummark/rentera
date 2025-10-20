'use client';

import SearchIntro from './SearchIntro';
import SearchCard from './SearchCard';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export default function Hero() {
  const { t } = useTranslation('hero');

  return (
    <section
      className={cn(
        'relative w-full mx-auto px-4 sm:px-6 md:px-8',
        'min-h-[100vh] py-16 flex items-center justify-center overflow-hidden rounded-2xl'
      )}
    >
      {/* ===== Base dark background (z-0) ===== */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(5,8,15,1) 0%, rgba(10,14,25,1) 40%, rgba(15,18,30,1) 100%)',
        }}
      />

      {/* ===== Color auroras (z-10) ===== */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* верхнее белое свечение */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[-10%]">
          <div
            className="absolute h-[40rem] w-[72rem] -translate-x-1/2 left-1/2 rounded-full blur-[90px] mix-blend-screen aurora-pulse-slow"
            style={{
              background:
                'radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 70%)',
            }}
          />
          <div
            className="absolute h-[28rem] w-[50rem] -translate-x-1/2 left-1/2 rounded-full blur-[50px] mix-blend-screen aurora-pulse-slow"
            style={{
              background:
                'radial-gradient(40% 40% at 50% 50%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 65%)',
            }}
          />
        </div>

        {/* слева тёплое */}
        <div className="absolute -top-40 -left-56">
          <div
            className="absolute h-[48rem] w-[48rem] rounded-full blur-[110px] mix-blend-screen aurora-pulse"
            style={{
              background:
                'radial-gradient(50% 50% at 50% 50%, rgba(255,120,60,0.55) 0%, rgba(255,120,60,0) 78%)',
            }}
          />
          <div
            className="absolute h-[34rem] w-[34rem] rounded-full blur-[70px] mix-blend-screen aurora-pulse"
            style={{
              background:
                'radial-gradient(45% 45% at 50% 50%, rgba(255,90,100,0.45) 0%, rgba(255,90,100,0) 70%)',
            }}
          />
        </div>

        {/* справа холодное */}
        <div className="absolute -bottom-52 -right-60">
          <div
            className="absolute h-[52rem] w-[52rem] rounded-full blur-[115px] mix-blend-screen aurora-pulse"
            style={{
              background:
                'radial-gradient(50% 50% at 50% 50%, rgba(110,80,255,0.55) 0%, rgba(110,80,255,0) 80%)',
            }}
          />
          <div
            className="absolute h-[36rem] w-[36rem] rounded-full blur-[75px] mix-blend-screen aurora-pulse"
            style={{
              background:
                'radial-gradient(45% 45% at 50% 50%, rgba(60,160,255,0.38) 0%, rgba(60,160,255,0) 72%)',
            }}
          />
        </div>

        {/* под карточкой мягкий циан */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[10%]">
          <div
            className="absolute h-[34rem] w-[34rem] rounded-full blur-[95px] mix-blend-screen aurora-pulse-slow"
            style={{
              background:
                'radial-gradient(50% 50% at 50% 50%, rgba(60,180,255,0.42) 0%, rgba(60,180,255,0) 74%)',
            }}
          />
          <div
            className="absolute h-[22rem] w-[22rem] rounded-full blur-[55px] mix-blend-screen aurora-pulse-slow"
            style={{
              background:
                'radial-gradient(45% 45% at 50% 50%, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0) 68%)',
            }}
          />
        </div>

        {/* лёгкая текстура */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-soft-light [background-image:url('/noise.png')]" />
      </div>

      {/* ===== Floating badges (z-20) ===== */}
<div className="absolute inset-0 z-20 pointer-events-none">
  <div className="absolute left-8 top-16 animate-float delay-100">
    <span className="inline-flex items-center gap-2 rounded-full bg-white/14 backdrop-blur px-4 py-2 text-sm md:text-base font-semibold text-slate-100 ring-1 ring-white/10 shadow-sm select-none">
      {t('badge.noIntermediaries')} <span className="text-xl md:text-2xl">🧡</span>
    </span>
  </div>
  <div className="absolute right-8 top-32 animate-float delay-300">
    <span className="inline-flex items-center gap-2 rounded-full bg-white/14 backdrop-blur px-4 py-2 text-sm md:text-base font-semibold text-slate-100 ring-1 ring-white/10 shadow-sm select-none">
      {t('badge.onlineContract')} <span className="text-xl md:text-2xl">✍️</span>
    </span>
  </div>
  <div className="absolute left-10 bottom-20 animate-float delay-500">
    <span className="inline-flex items-center gap-2 rounded-full bg-white/14 backdrop-blur px-4 py-2 text-sm md:text-base font-semibold text-slate-100 ring-1 ring-white/10 shadow-sm select-none">
      {t('badge.securePayments')} <span className="text-xl md:text-2xl">💳</span>
    </span>
  </div>
</div>

      {/* ===== Content (z-30) ===== */}
      <div className="relative z-30 w-full max-w-7xl px-4 md:px-10 flex flex-col items-center justify-center text-center text-white">
        <SearchIntro />

        <div className="relative w-full max-w-4xl mt-10">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div
              className="absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[70px] mix-blend-screen"
              style={{
                background:
                  'radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 70%)',
              }}
            />
          </div>
          <SearchCard />
        </div>
      </div>

      {/* ===== Animations ===== */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-10px) translateX(6px); }
          100% { transform: translateY(0) translateX(0); }
        }
        .animate-float {
          animation: float 7s ease-in-out infinite;
          will-change: transform;
        }

        @keyframes auroraPulse {
          0%   { transform: scale(1);   opacity: 1; }
          50%  { transform: scale(1.04); opacity: 0.9; }
          100% { transform: scale(1);   opacity: 1; }
        }
        .aurora-pulse { animation: auroraPulse 10s ease-in-out infinite; }
        .aurora-pulse-slow { animation: auroraPulse 16s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .animate-float, .aurora-pulse, .aurora-pulse-slow { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
