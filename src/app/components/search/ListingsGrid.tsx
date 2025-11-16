'use client';

import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import ListingCard from '@/app/components/property/ListingCard';
import { useListingsSearch } from '@/hooks/useListingsSearch';
import { useTranslation } from 'react-i18next';
import DropdownMenu from '@/components/ui/DropdownMenu';

export default function ListingsGrid() {
  const { t } = useTranslation('listings');
  const { results, search } = useListingsSearch(); // Убрали неиспользуемую переменную `loading`
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<'new' | 'cheap' | 'expensive'>('new');

  const itemsPerPage = 9;

  // Вызов поиска при загрузке компонента
  useEffect(() => {
    search({});
  }, [search]); // Добавили зависимость от search

  const sortedListings = useMemo(() => {
    const sorted = [...results];
    switch (sort) {
      case 'cheap':
        return sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      case 'expensive':
        return sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      default:
        return sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt ?? '').getTime();
          const dateB = new Date(b.createdAt ?? '').getTime();
          return dateB - dateA;
        });
    }
  }, [results, sort]);

  const visibleListings = sortedListings.slice(0, page * itemsPerPage);
  

  return (
    <div className="space-y-6">
      {/* Сортировка с использованием DropdownMenu */}
      <div className="flex rounded-md border-gray-200 justify-end">
        <DropdownMenu
          trigger={
            <Button variant="outline">{t(`sort.${sort}`)}</Button>
          }
        >
          <div className="p-2 rounded-md hover:ring-1 hover:ring-ring hover:ring-offset-1 hover:ring-offset-background" onClick={() => setSort('new')}>{t('sort.new')}</div>
          <div className="p-2 rounded-md hover:ring-1 hover:ring-ring hover:ring-offset-1 hover:ring-offset-background" onClick={() => setSort('expensive')}>{t('sort.expensive')}</div>
          <div className="p-2 rounded-md hover:ring-1 hover:ring-ring hover:ring-offset-1 hover:ring-offset-background" onClick={() => setSort('cheap')}>{t('sort.cheap')}</div>
        </DropdownMenu>
      </div>

      {/* Сетка карточек */}
      {visibleListings.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onView={() => {}}
              onEdit={() => {}}
              onDelete={() => {}}
              showActions={false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-10">
          {t('sort.notFound')}
        </div>
      )}

      {/* Кнопки пагинации */}
      {sortedListings.length > itemsPerPage && (
        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            {t('sort.prev')}
          </Button>

          {visibleListings.length < sortedListings.length && (
            <Button onClick={() => setPage((p) => p + 1)}>
              {t('sort.more')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
