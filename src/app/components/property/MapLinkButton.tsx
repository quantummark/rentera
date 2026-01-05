'use client';

import { Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface MapLinkButtonProps {
  address: string;
  variant?: 'full' | 'icon';
  className?: string;
}

export default function MapLinkButton({
  address,
  variant = 'full',
  className,
}: MapLinkButtonProps) {
  const { t } = useTranslation();

  const handleClick = () => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'icon') {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleClick();
      }}
      aria-label={t('listing:viewOnMap')}
      className={className ?? `
        inline-flex items-center justify-center
        w-8 h-8 min-w-[32px] shrink-0 rounded-full
        bg-muted/60 backdrop-blur-md
        border border-border/60
        text-muted-foreground
        hover:bg-muted
        transition
        active:scale-95
      `}
    >
      <Map className="w-4 h-4" />
    </button>
  );
}

  return (
    <Button
      variant="link"
      onClick={handleClick}
      className="text-base px-0 inline-flex items-center gap-1 text-primary hover:underline"
    >
      <Map className="w-4 h-4" />
      {t('listing:viewOnMap')}
    </Button>
  );
}
