'use client';

import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative flex justify-center items-center h-[80vh] rounded-2xl overflow-hidden">
  <Image
    src="/images/Hero4.webp"
    alt="Hero Background"
    fill
    priority
    className="object-cover object-center -z-10"
  />
    <div className="absolute inset-0 bg-black/30 dark:bg-black/50"></div>
  
  <div className="relative z-10 text-center space-y-6 p-6 md:p-12 text-white">
    <h1 className="text-3xl md:text-5xl font-bold font-sans">
      {t('landing.welcome', 'Добро пожаловать в Rentera')}
    </h1>
    <p className="text-lg md:text-2xl opacity-80 dark:text-gray-200">
      {t('landing.subtitle', 'Арендуйте жильё напрямую от владельцев, без агентств, риелторов и скрытых комиссий.')}
    </p>
    
    <div className="mt-6 space-x-4">
      {/* Кнопка "Начать поиск" */}
      <Link
        href="/search"
        className="px-8 py-3 text-lg font-semibold bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-all inline-flex items-center justify-center"
      >
        {t('landing.startSearch', 'Начать поиск')}
      </Link>
      
      {/* Кнопка "Сдать жильё" */}
      <Link
        href="/login"
        className="px-8 py-3 text-lg font-semibold bg-transparent border-2 border-orange-500 text-orange-500 rounded-full shadow-lg hover:bg-orange-50 transition-all inline-flex items-center justify-center"
      >
        {t('landing.startRenting', 'Сдать жильё')}
      </Link>
    </div>
  </div>
</section>
  );
}
