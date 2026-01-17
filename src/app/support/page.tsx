'use client';

import { useTranslation } from 'react-i18next';

import SupportHero from './components/SupportHero';
import SupportCardGrid from './components/SupportCardGrid';

export default function SupportPage() {
  const { t } = useTranslation(['support']);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 md:py-12">
      <SupportHero
        title={t('support:home.title', 'Підтримка Rentera')}
        subtitle={t(
          'support:home.subtitle',
          'Ми тут, щоб допомогти вам. Оберіть тему — і напишіть нам у чаті.'
        )}
      />

      <SupportCardGrid />
    </main>
  );
}
