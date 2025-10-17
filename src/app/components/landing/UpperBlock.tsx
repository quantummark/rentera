'use client';

import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  const { t } = useTranslation('landing');

  return (
    <section className="relative flex justify-center items-center h-[80vh] rounded-2xl overflow-hidden">
  <Image
    src="/images/rentera11.jpg"
    alt="Hero Background"
    fill
    priority
    className="object-cover object-center -z-10"
  />
    <div className="absolute inset-0 bg-black/30 dark:bg-black/50"></div>
  
  <div className="relative z-10 text-center space-y-6 p-6 md:p-12 text-white">
    <h1 className="text-3xl md:text-5xl font-bold font-sans uppercase drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-500">
  {t('landing:welcome')}
</h1>

<p className="text-lg md:text-2xl opacity-90 dark:text-gray-100 max-w-3xl mx-auto leading-relaxed tracking-wide">
  {t('landing:subtitle')}
</p>
    
    <div className="mt-6 flex flex-col gap-4 md:flex-row md:gap-4 justify-center">
  {/* Кнопка "Начать поиск" */}
  <Link
  href="/search"
  className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-lg hover:scale-105 hover:shadow-2xl transition-transform inline-flex items-center justify-center w-full md:w-auto"
>
   {t('landing:startSearch')}
</Link>
  
  {/* Кнопка "Сдать жильё" */}
  <Link
  href="/login"
  className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 text-white rounded-full shadow-md hover:scale-105 hover:shadow-xl transition-transform inline-flex items-center justify-center w-full md:w-auto"
>
   {t('landing:startRenting')}
</Link>
</div>
  </div>
</section>
  );
}
