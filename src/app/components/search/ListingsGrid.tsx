'use client';

import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import ListingCard from '@/app/components/property/ListingCard';
import { useListingsSearch } from '@/hooks/useListingsSearch';
import { useTranslation } from 'react-i18next';

export default function ListingsGrid() {
  const { t } = useTranslation();
  const { results, loading, search } = useListingsSearch(); // ⬅️ добавили search
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<'new' | 'cheap' | 'expensive'>('new');

  const itemsPerPage = 9;

  // ⬇️ Вызов поиска при загрузке компонента
  useEffect(() => {
    search({});
  }, []);

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
      {/* Сортировка */}
      <div className="flex justify-end">
        <select
          className="border rounded-md px-3 py-2 text-base dark:bg-zinc-900 dark:text-white"
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
        >
          <option value="new">{t('listings.sort.new', 'Новые')}</option>
          <option value="expensive">{t('listings.sort.expensive', 'Дорогие')}</option>
          <option value="cheap">{t('listings.sort.cheap', 'Дешёвые')}</option>
        </select>
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
          {t('listings.notFound', 'Объявлений не найдено')}
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
            {t('listings.prev', 'Предыдущее')}
          </Button>

          {visibleListings.length < sortedListings.length && (
            <Button onClick={() => setPage((p) => p + 1)}>
              {t('listings.more', 'Смотреть ещё')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}