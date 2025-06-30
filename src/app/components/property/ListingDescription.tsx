'use client';

import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Listing } from '@/app/types/listing';

interface ListingDescriptionProps {
  listing: Listing;
}

export default function ListingDescription({ listing }: ListingDescriptionProps) {
  const { t } = useTranslation();
  const { description } = listing;

  return (
    <section className="py-8 px-4 md:px-10 space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-2">
        <Info className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          {t('listing.descriptionTitle', 'Описание объекта')}
        </h2>
      </div>

      <p className="text-base leading-relaxed text-muted-foreground">
        {description?.trim()
          ? description
          : t('listing.noDescription', 'Владелец пока не добавил описание к этому объекту.')}
      </p>
    </section>
  );
}
