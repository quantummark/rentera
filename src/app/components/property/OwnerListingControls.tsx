'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import React from 'react';

interface OwnerListingControlsProps {
  listingId: string;

  viewHref?: string;
  editHref?: string;

  onView?: (listingId: string) => void;
  onEdit?: (listingId: string) => void;
  onDelete?: (listingId: string) => void;

  stopPropagation?: boolean;
  compact?: boolean;
  className?: string;
}

export default function OwnerListingControls({
  listingId,
  viewHref,
  editHref,
  onView,
  onEdit,
  onDelete,
  stopPropagation = true,
  compact = false,
  className,
}: OwnerListingControlsProps) {
  const { t } = useTranslation(['ownerListingControls']);

  const sizeClasses = compact
    ? 'h-9 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm'
    : 'h-10 px-4 text-sm sm:h-10 sm:px-5 sm:text-sm';

  const handle = (cb?: (id: string) => void) => (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    cb?.(listingId);
  };

  const handleDelete = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    const ok = window.confirm(t('ownerListingControls:confirmDelete'));
    if (ok) onDelete?.(listingId);
  };

  const defaultViewHref = `/listing/${listingId}`;
  const defaultEditHref = `/listing/${listingId}?edit=1`;

  // единый стиль для кнопок: стеклянно-аккуратно, как в твоей карточке
  const baseBtn =
    'w-full justify-center gap-2 rounded-xl border backdrop-blur-md shadow-sm active:scale-[0.98] transition';

  const orangeBtn = cn(
    baseBtn,
    'border-orange-500/25 text-orange-600 bg-orange-500/10 hover:bg-orange-500/15'
  );

  const redBtn = cn(
    baseBtn,
    'border-red-500/25 text-red-600 bg-red-500/10 hover:bg-red-500/15'
  );

  // ✅ ВАЖНО: сетка для стабильного размещения
  // Mobile: 2 колонки (View/Edit), Delete на всю ширину
  // Desktop: 3 колонки в один ряд
  return (
    <div
      className={cn(
        'grid w-full gap-2',
        'grid-cols-2 sm:grid-cols-3',
        className
      )}
    >
      {/* View */}
      {viewHref ? (
        <Button asChild variant="outline" className={cn(orangeBtn, sizeClasses)}>
          <Link
            href={viewHref}
            prefetch={false}
            aria-label={t('ownerListingControls:viewAria')}
            onClick={(e) => stopPropagation && e.stopPropagation()}
          >
            <Eye className="h-4 w-4" />
            <span className="whitespace-nowrap">{t('ownerListingControls:view')}</span>
          </Link>
        </Button>
      ) : onView ? (
        <Button
          type="button"
          variant="outline"
          className={cn(orangeBtn, sizeClasses)}
          onClick={handle(onView)}
          aria-label={t('ownerListingControls:viewAria')}
          title={t('ownerListingControls:view')}
        >
          <Eye className="h-4 w-4" />
          <span className="whitespace-nowrap">{t('ownerListingControls:view')}</span>
        </Button>
      ) : (
        <Button asChild variant="outline" className={cn(orangeBtn, sizeClasses)}>
          <Link
            href={defaultViewHref}
            prefetch={false}
            aria-label={t('ownerListingControls:viewAria')}
            onClick={(e) => stopPropagation && e.stopPropagation()}
          >
            <Eye className="h-4 w-4" />
            <span className="whitespace-nowrap">{t('ownerListingControls:view')}</span>
          </Link>
        </Button>
      )}

      {/* Edit */}
      {editHref ? (
        <Button asChild variant="outline" className={cn(orangeBtn, sizeClasses)}>
          <Link
            href={editHref}
            prefetch={false}
            aria-label={t('ownerListingControls:editAria')}
            onClick={(e) => stopPropagation && e.stopPropagation()}
          >
            <Pencil className="h-4 w-4" />
            <span className="whitespace-nowrap">{t('ownerListingControls:edit')}</span>
          </Link>
        </Button>
      ) : onEdit ? (
        <Button
          type="button"
          variant="outline"
          className={cn(orangeBtn, sizeClasses)}
          onClick={handle(onEdit)}
          aria-label={t('ownerListingControls:editAria')}
          title={t('ownerListingControls:edit')}
        >
          <Pencil className="h-4 w-4" />
          <span className="whitespace-nowrap">{t('ownerListingControls:edit')}</span>
        </Button>
      ) : (
        <Button asChild variant="outline" className={cn(orangeBtn, sizeClasses)}>
          <Link
            href={defaultEditHref}
            prefetch={false}
            aria-label={t('ownerListingControls:editAria')}
            onClick={(e) => stopPropagation && e.stopPropagation()}
          >
            <Pencil className="h-4 w-4" />
            <span className="whitespace-nowrap">{t('ownerListingControls:edit')}</span>
          </Link>
        </Button>
      )}

      {/* Delete */}
      <Button
        type="button"
        variant="outline"
        className={cn(
          redBtn,
          sizeClasses,
          // на мобилке — на всю ширину внизу, на sm+ становится обычной колонкой
          'col-span-2 sm:col-span-1'
        )}
        onClick={handleDelete}
        aria-label={t('ownerListingControls:deleteAria')}
        title={t('ownerListingControls:delete')}
      >
        <Trash2 className="h-4 w-4" />
        <span className="whitespace-nowrap">{t('ownerListingControls:delete')}</span>
      </Button>
    </div>
  );
}
