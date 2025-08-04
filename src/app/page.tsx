'use client';

import Hero from '@/app/components/landing/UpperBlock';
import CallToAction from '@/app/components/landing/CallToAction';
import Benefits from '@/app/components/landing/Benefits';
import HowItWorks from '@/app/components/landing/HowItWorks';
import Motivation from '@/app/components/landing/Motivation';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <Hero />

        {/* Преимущества Rentera */}
        <Benefits />

        {/* Как работает Rentera */}
        <HowItWorks />

        {/* Мотивационный блок */}
        <Motivation />

        {/* Призыв к действию */}
        <CallToAction />
      </main>
    </Suspense>
  );
}
