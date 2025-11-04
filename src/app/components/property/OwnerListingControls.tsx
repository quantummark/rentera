'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import React from 'react';

interface OwnerListingControlsProps {
  listingId: string;

  /** Если задать href — используется <Link asChild>. Если не задан, используем onView/onEdit или дефолтные маршруты */
  viewHref?: string;
  editHref?: string;

  onView?: (listingId: string) => void;
  onEdit?: (listingId: string) => void;
  onDelete?: (listingId: string) => void;

  /** Остановить всплытие клика (если вся карточка кликабельна) */
  stopPropagation?: boolean;

  /** Делает кнопки компактнее (для тесных карточек) */
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
    ? 'h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm'
    : 'h-9 px-4 text-sm sm:h-10 sm:px-5 sm:text-sm';

  const handle = (cb?: (id: string) => void) => (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    cb?.(listingId);
  };

  const handleDelete = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    const ok = window.confirm(t('ownerListingControls:confirmDelete'));
    if (ok) onDelete?.(listingId);
  };

  // Дефолтные маршруты
  const defaultViewHref = `/listing/${listingId}`;
  const defaultEditHref = `/listing/${listingId}?edit=1`;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {/* View */}
      {viewHref ? (
        <Button
          asChild
          variant="outline"
          className={cn('border-orange-300 text-orange-600 hover:bg-orange-100', sizeClasses)}
        >
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
          className={cn('border-orange-300 text-orange-600 hover:bg-orange-100', sizeClasses)}
          onClick={handle(onView)}
          aria-label={t('ownerListingControls:viewAria')}
          title={t('ownerListingControls:view')}
        >
          <Eye className="h-4 w-4" />
          <span className="whitespace-nowrap">{t('ownerListingControls:view')}</span>
        </Button>
      ) : (
        <Button
          asChild
          variant="outline"
          className={cn('border-orange-300 text-orange-600 hover:bg-orange-100', sizeClasses)}
        >
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
        <Button
          asChild
          variant="outline"
          className={cn('border-orange-300 text-orange-600 hover:bg-orange-100', sizeClasses)}
        >
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
          className={cn('border-orange-300 text-orange-600 hover:bg-orange-100', sizeClasses)}
          onClick={handle(onEdit)}
          aria-label={t('ownerListingControls:editAria')}
          title={t('ownerListingControls:edit')}
        >
          <Pencil className="h-4 w-4" />
          <span className="whitespace-nowrap">{t('ownerListingControls:edit')}</span>
        </Button>
      ) : (
        <Button
          asChild
          variant="outline"
          className={cn('border-orange-300 text-orange-600 hover:bg-orange-100', sizeClasses)}
        >
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
        className={cn('border-red-300 text-red-600 hover:bg-red-100', sizeClasses)}
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