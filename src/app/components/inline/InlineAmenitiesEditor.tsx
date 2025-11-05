'use client';

import React from 'react';
import {  useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import InlineEdit from './InlineEdit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Типы
export type AmenityCode =
  | 'wifi'
  | 'washingMachine'
  | 'parking'
  | 'balcony'
  | 'airConditioner'
  | 'elevator'
  | 'heating'
  | 'furniture'
  | 'oven'
  | 'stove'
  | 'microwave'
  | 'fridge'
  | 'dishwasher'
  | 'boiler'
  | 'tv'
  | 'nearMetro'
  | 'soundproof'
  | 'modernComplex'
  | 'securedArea'
  | 'concierge';

export interface AmenityOption {
  value: AmenityCode;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface InlineAmenitiesEditorProps {
  value: AmenityCode[];                 // текущие удобства
  options: AmenityOption[];             // все доступные
  canEdit: boolean;
  onSave: (next: AmenityCode[]) => Promise<void> | void;
  className?: string;
  /** заголовок редактора (покажется в Sheet на мобилке) */
  title?: string;
}

// простая «иконка-чип»
function Chip({
  children,
  active,
  onClick,
}: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm',
        'transition-colors',
        active
          ? 'border-orange-300 bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300'
          : 'border-white/10 bg-white/5 text-foreground/90 hover:bg-white/10'
      )}
    >
      {children}
    </button>
  );
}

export default function InlineAmenitiesEditor({
  value,
  options,
  canEdit,
  onSave,
  className,
  title,
}: InlineAmenitiesEditorProps) {
  const { t } = useTranslation(['listing', 'amenities', 'common']);
  const [query, setQuery] = useState('');

  const filtered = React.useMemo(() => {
  if (!query.trim()) return options;
  const q = query.toLowerCase();
  return options.filter((o) =>
    t(`amenities:${o.value}`).toLowerCase().includes(q)
  );
}, [options, query, t]);

  // Цвета иконок по коду удобства
const AMENITY_COLORS: Record<AmenityCode, string> = {
  wifi: 'text-blue-600 dark:text-blue-400',
  washingMachine: 'text-indigo-600 dark:text-indigo-400',
  parking: 'text-gray-700 dark:text-gray-300',
  balcony: 'text-amber-600 dark:text-amber-400',
  airConditioner: 'text-sky-600 dark:text-sky-400',
  elevator: 'text-zinc-700 dark:text-zinc-300',
  heating: 'text-red-600 dark:text-red-400',
  furniture: 'text-rose-600 dark:text-rose-400',
  oven: 'text-orange-600 dark:text-orange-400',
  stove: 'text-yellow-600 dark:text-yellow-400',
  microwave: 'text-pink-600 dark:text-pink-400',
  fridge: 'text-cyan-600 dark:text-cyan-400',
  dishwasher: 'text-purple-600 dark:text-purple-400',
  boiler: 'text-lime-600 dark:text-lime-400',
  tv: 'text-violet-600 dark:text-violet-400',
  nearMetro: 'text-fuchsia-600 dark:text-fuchsia-400',
  soundproof: 'text-stone-700 dark:text-stone-300',
  modernComplex: 'text-green-600 dark:text-green-400',
  securedArea: 'text-emerald-600 dark:text-emerald-400',
  concierge: 'text-teal-600 dark:text-teal-400',
};

  // Вью: список выбранных как «живые» чипы
const renderView = (vals: AmenityCode[]) => {
  if (!vals?.length) {
    return <span className="text-muted-foreground">{t('listing:noAmenities')}</span>;
  }

  return (
    <div className="flex flex-wrap items-start gap-2 pt-1">
      {vals.map((v) => {
        const found = options.find((o) => o.value === v);
        const Icon = found?.icon;

        return (
          <span
            key={v}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white/5 px-3 py-1.5 text-base dark:border-white/10"
            title={t(`amenities:${v}`)}
            aria-label={t(`amenities:${v}`)}
          >
            {Icon ? (
              <Icon
                className={cn('h-5 w-5 shrink-0', AMENITY_COLORS[v])}
                aria-hidden="true"
              />
            ) : null}

            <span className="text-foreground">{t(`amenities:${v}`)}</span>
          </span>
        );
      })}
    </div>
  );
};

  // Редактор: поиск + сетка
const renderEditor = (vals: AmenityCode[], setVals: (next: AmenityCode[]) => void) => {
  const toggle = (code: AmenityCode) => {
    setVals(vals.includes(code) ? vals.filter((v) => v !== code) : [...vals, code]);
  };

  const selectAll = () => setVals(filtered.map((f) => f.value));
  const clearAll  = () => setVals([]);

  return (
    <div className="w-[min(92vw,560px)]">
      {/* Поиск + действия */}
      <div className="mb-3 flex items-center gap-2">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('listing:searchAmenities')}
            className="pl-9"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={t('common:clear')}
              title={t('common:clear')}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={selectAll}>
          {t('common:selectAll')}
        </Button>
        <Button variant="ghost" size="sm" onClick={clearAll}>
          {t('common:clear')}
        </Button>
      </div>

      {/* Сетка чекбоксов/чипов */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {filtered.map(({ value: code, icon: Icon }) => {
          const active = vals.includes(code);
          return (
            <Chip key={code} active={active} onClick={() => toggle(code)}>
              {Icon ? <Icon className="h-4 w-4" /> : null}
              <span className="truncate">{t(`amenities:${code}`)}</span>
              {active && <Check className="h-4 w-4" />}
            </Chip>
          );
        })}
      </div>
    </div>
  );
};

  return (
    <InlineEdit<AmenityCode[]>
      value={value}
      canEdit={canEdit}
      onSave={onSave}
      renderView={renderView}
      renderEditor={renderEditor}
      className={className}
      title={title ?? t('listing:editAmenities')}
    />
  );
}
