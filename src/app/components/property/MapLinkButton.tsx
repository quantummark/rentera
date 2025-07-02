'use client';

import { Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface MapLinkButtonProps {
  address: string;
}

export default function MapLinkButton({ address }: MapLinkButtonProps) {
  const { t } = useTranslation();

  const handleClick = () => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(url, '_blank');
  };

  return (
    <Button
      variant="link"
      onClick={handleClick}
      className="text-base px-0 inline-flex items-center gap-1 text-primary hover:underline"
    >
      <Map className="w-4 h-4" />
      {t('listing.viewOnMap', 'Посмотреть на карте')}
    </Button>
  );
}
