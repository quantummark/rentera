'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function CallToAction() {
  const { t } = useTranslation('cta');

  return (
    <section
      className={cn(
        'relative rounded-2xl overflow-hidden py-20 sm:py-24 px-4 sm:px-6 md:px-8'
      )}
    >
      {/* ===== Background: яркие ауры + мягкий верхний свет ===== */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* верхний радиальный свет */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 block dark:hidden"
            style={{
              background:
                'radial-gradient(80% 60% at 50% -10%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 70%)',
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

        {/* крупные яркие пятна */}
        <div
          className="absolute -top-48 -left-32 h-[46rem] w-[46rem] rounded-full blur-[130px]"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(255,120,60,0.70) 0%, rgba(255,120,60,0) 80%)',
          }}
        />
        <div
          className="absolute -bottom-52 -right-40 h-[50rem] w-[50rem] rounded-full blur-[150px]"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(120,80,255,0.70) 0%, rgba(120,80,255,0) 80%)',
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[10%] h-[42rem] w-[42rem] rounded-full blur-[140px]"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(60,200,255,0.65) 0%, rgba(60,200,255,0) 80%)',
          }}
        />

        {/* текстура */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-soft-light [background-image:url('/noise.png')]" />
      </div>

      {/* ===== Content Card (glass) ===== */}
      <div className="relative z-10 max-w-5xl mx-auto">
        <div
          className={cn(
            'rounded-2xl border shadow-xl backdrop-blur-2xl',
            'bg-white/35 dark:bg-white/8 border-black/10 dark:border-white/10',
            'px-6 sm:px-10 md:px-14 py-12 sm:py-16'
          )}
        >
          {/* Заголовок */}
          <h2 className="text-3xl text-center md:text-4xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 drop-shadow-sm">
            {t('cta:title')}
          </h2>

          {/* Подзаголовок — с корректным text-muted-foreground */}
          <p className="text-lg text-center md:text-2xl text-muted-foreground dark:text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed tracking-wide">
            {t('cta:subtitle')}
          </p>

          {/* Бейджи */}
          <div className="mb-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-base">
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/70 dark:bg-white/10 text-slate-800 dark:text-slate-100 ring-1 ring-black/10 dark:ring-white/10">
              {t('cta:zeroPercentMiddlemen')} ✅
            </span>
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/70 dark:bg-white/10 text-slate-800 dark:text-slate-100 ring-1 ring-black/10 dark:ring-white/10">
              {t('cta:onlineContract')} ✍️
            </span>
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/70 dark:bg-white/10 text-slate-800 dark:text-slate-100 ring-1 ring-black/10 dark:ring-white/10">
              {t('cta:support')} 🛟
            </span>
          </div>

          {/* Кнопки */}
          <div className="flex flex-col gap-4 md:flex-row justify-center">
            <Link
              href="/search"
              className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-lg hover:scale-105 hover:shadow-2xl transition-transform inline-flex items-center justify-center w-full md:w-auto"
            >
              {t('cta:startSearch')}
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 text-white rounded-full shadow-md hover:scale-105 hover:shadow-xl transition-transform inline-flex items-center justify-center w-full md:w-auto"
            >
              {t('cta:startRenting')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
