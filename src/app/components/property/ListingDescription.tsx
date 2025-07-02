'use client';

import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Listing } from '@/app/types/listing';
import { Card, CardContent } from '@/components/ui/card';

interface ListingDescriptionProps {
  listing: Listing;
}

export default function ListingDescription({ listing }: ListingDescriptionProps) {
  const { t } = useTranslation();
  const { description } = listing;

  const hasDescription = description?.trim();

  return (
    <section className="py-8 px-4 md:px-10 space-y-4 max-w-8xl mx-auto">
      {/* Заголовок секции */}
      <div className="flex items-center gap-2">
        <Info className="w-5 h-5 text-blue-500 dark:text-blue-300" />
        <h2 className="text-xl font-semibold text-foreground">
          {t('listing.descriptionTitle', 'Описание объекта')}
        </h2>
      </div>

      {/* Контент в карточке */}
      <Card className="rounded-2xl shadow-sm bg-muted">
        <CardContent className="p-4 text-base leading-relaxed text-muted-foreground max-h-[300px] overflow-auto">
          {hasDescription ? (
            <p className="whitespace-pre-line">{description}</p>
          ) : (
            <div className="italic flex items-center gap-2 text-muted-foreground">
              <span>📝</span>
              <span>{t('listing.noDescription', 'Владелец пока не добавил описание к этому объекту.')}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}