'use client';

import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Listing } from '@/app/types/listing';
import { Card, CardContent } from '@/components/ui/card';
import InlineTextarea from '@/app/components/inline/InlineTextarea';
import { patchListing } from '@/app/lib/firestore/profiles';


interface ListingDescriptionProps {
  listing: Listing;
  canEdit: boolean;
}

export default function ListingDescription({ listing, canEdit }: ListingDescriptionProps) {
  const { t } = useTranslation('listing');
  const { description } = listing;

  const onSaveDescription = async (next: string) => {
  await patchListing(listing.listingId, { description: next });
};

  const hasDescription = description?.trim();

  return (
    <section className="py-8 px-4 md:px-10 space-y-4 max-w-8xl mx-auto">
      {/* Заголовок секции */}
      <div className="flex items-center gap-2">
        <Info className="w-5 h-5 text-blue-500 dark:text-blue-300" />
        <h2 className="text-xl font-semibold text-foreground">
          {t('listing:descriptionTitle')}
        </h2>
      </div>

      {/* Контент в карточке */}
      <Card className="rounded-2xl shadow-sm bg-muted">
  <CardContent className="p-4 text-base leading-relaxed text-muted-foreground max-h-[300px] overflow-auto">

    {hasDescription || canEdit ? (
      <InlineTextarea
        value={description ?? ''}
        canEdit={canEdit}
        onSave={onSaveDescription}
        placeholder={t('listing:noDescription')}
        className="whitespace-pre-line"
      />
    ) : (
      <div className="italic flex items-center gap-2 text-muted-foreground">
        <span>📝</span>
        <span>{t('listing:noDescription')}</span>
      </div>
    )}

  </CardContent>
</Card>
    </section>
  );
}