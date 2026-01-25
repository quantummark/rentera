'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import DropdownMenu, { DropdownItem } from '@/components/ui/DropdownMenu';

import ListingCard from '@/app/components/property/ListingCard';
import { type SortKey } from '@/hooks/useListingsSearch';
import { useListingsSearchCtx } from '@/context/ListingsSearchContext';

export default function ListingsGrid() {
  const { t } = useTranslation('listings');

  const { results, loading, error, hasMore, search, loadMore } = useListingsSearchCtx();
  const [sort, setSort] = useState<SortKey>('new');

  // ✅ Если пользователь зашёл без поиска — показываем последние объявления
  useEffect(() => {
    void search({ sort: 'new' });
  }, [search]);

  // ✅ Когда меняем сортировку — перезапрашиваем сервер
  useEffect(() => {
    void search({ sort });
  }, [sort, search]);

  const showEmpty = !loading && !error && results.length === 0;

  return (
    <div className="space-y-6">
      {/* Header row: title / count / sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-base font-medium text-foreground">{t('results.title')}</p>

          {!loading && !error && (
            <p className="text-sm text-muted-foreground">
              {t('results.found', { count: results.length })}
            </p>
          )}
        </div>

        {/* Sort */}
        <div className="flex justify-end">
          <DropdownMenu
            align="end"
            trigger={
              <Button variant="outline" className="rounded-xl">
                {t('sort.label')}: {t(`sort.${sort}`)}
              </Button>
            }
          >
            <DropdownItem onSelect={() => setSort('new')}>{t('sort.new')}</DropdownItem>
            <DropdownItem onSelect={() => setSort('cheap')}>{t('sort.cheap')}</DropdownItem>
            <DropdownItem onSelect={() => setSort('expensive')}>{t('sort.expensive')}</DropdownItem>
          </DropdownMenu>
        </div>
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="rounded-2xl border border-border/60 bg-background/40 p-6 text-center backdrop-blur-md">
          <p className="text-sm text-foreground">{t('states.error')}</p>
          <p className="mt-2 text-xs text-muted-foreground">{error}</p>

          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={() => void search({ sort })}>
              {t('sort.new')}
            </Button>
          </div>
        </div>
      )}

      {/* Loading (first load) */}
      {loading && results.length === 0 && (
        <div className="rounded-2xl border border-border/60 bg-background/40 p-6 text-center backdrop-blur-md">
          <p className="text-sm text-muted-foreground">{t('states.loading')}</p>
        </div>
      )}

      {/* Empty */}
      {showEmpty && (
        <div className="rounded-2xl border border-border/60 bg-background/40 p-10 text-center backdrop-blur-md">
          <p className="text-sm font-medium text-foreground">{t('results.empty')}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t('results.tryChange')}</p>
        </div>
      )}

      {/* Grid */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((listing) => (
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
      )}

      {/* Load more */}
      {!error && results.length > 0 && (
        <div className="flex justify-center pt-2">
          <Button
            onClick={() => void loadMore()}
            disabled={loading || !hasMore}
            className="rounded-xl"
            variant="outline"
          >
            {loading ? t('states.loading') : t('pagination.more')}
          </Button>
        </div>
      )}
    </div>
  );
}
