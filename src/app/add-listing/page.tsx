// app/(dashboard)/owner/add-listing/page.tsx
'use client';

import ListingForm from '@/app/add-listing/ListingForm';
import { useTranslation } from 'react-i18next';

export default function AddListingPage() {
  const { t } = useTranslation('listing');

  return (
    <div className="min-h-screen py-10 px-4 md:px-6 bg-background flex justify-center items-start">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t('listing:addTitle')}
          </h1>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            {t('listing:addDescription')}
          </p>
        </div>

        <ListingForm />
      </div>
    </div>
  );
}
