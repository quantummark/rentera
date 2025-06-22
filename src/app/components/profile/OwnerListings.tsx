'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Listing = {
  id: string;
  title: string;
  description?: string;
  address: string;
  price: number;
  image?: string;
};

type OwnerListingsProps = {
  listings: Listing[];
  onAddNew?: () => void;
};

export function OwnerListings({ listings, onAddNew }: OwnerListingsProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">
          {t('owner.listings.title', 'Мои объявления')}
        </h3>
        <Button onClick={onAddNew} variant="outline" className="gap-2">
          <PlusCircle size={18} />
          {t('owner.listings.add', 'Добавить объект')}
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.length > 0 ? (
          listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition">
              <CardContent className="p-0">
                <div className="h-40 w-full overflow-hidden">
                  <img
                    src={listing.image || '/placeholder-property.jpg'}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="font-semibold text-base">{listing.title}</h4>
                  <p className="text-sm text-muted-foreground">{listing.address}</p>
                  <p className="text-sm font-medium text-orange-600">${listing.price}/мес</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">
            {t('owner.listings.empty', 'У вас пока нет активных объявлений.')}
          </p>
        )}
      </div>
    </div>
  );
}