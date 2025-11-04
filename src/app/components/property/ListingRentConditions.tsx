'use client';

import {
  Home,
  Ruler,
  DoorOpen,
  Clock3,
  Calendar as CalendarIcon,
  PawPrint,
  Baby,
  Cigarette,
  HandCoins,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Listing } from '@/app/types/listing';
import { format, type Locale } from 'date-fns';
import { ru, uk, enUS } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';

import InlineSelect from '@/app/components/inline/InlineSelect';
import InlineNumber from '@/app/components/inline/InlineNumber';
import InlineSwitch from '@/app/components/inline/InlineSwitch';
import InlineEdit from '@/app/components/inline/InlineEdit';

// ⚠️ у тебя уже есть этот импорт для Description, используем тот же:
import { patchListing } from '@/app/lib/firestore/profiles';

type DateInput = Date | string | number | Timestamp | null | undefined;

const localeMap: Record<string, Locale> = {
  ru,
  uk,
  en: enUS,
  'en-US': enUS,
};

function isDateValid(d: Date): boolean {
  return d instanceof Date && !Number.isNaN(d.getTime());
}

function toDateSafe(input: DateInput): Date | null {
  if (input == null) return null;

  if (input instanceof Date) return isDateValid(input) ? input : null;

  if (input instanceof Timestamp) {
    const d = input.toDate();
    return isDateValid(d) ? d : null;
  }

  if (typeof input === 'number') {
    const ms = input > 1e12 ? input : input * 1000; // сек → мс
    const d = new Date(ms);
    return isDateValid(d) ? d : null;
  }

  if (typeof input === 'string') {
    const d = new Date(input);
    return isDateValid(d) ? d : null;
  }

  return null;
}

export function formatDateLocalized(
  value: DateInput,
  lang: string,
  pattern = 'dd MMMM yyyy'
): string | null {
  const date = toDateSafe(value);
  if (!date) return null;

  const locale = localeMap[lang] ?? enUS;
  try {
    return format(date, pattern, { locale });
  } catch {
    return null;
  }
}

interface ListingConditionsProps {
  listing: Listing;
  canEdit: boolean;
}

export default function ListingConditions({ listing, canEdit }: ListingConditionsProps) {
  const { t, i18n } = useTranslation(['listing', 'StepRentConditions']);

  // --- Опции селектов ---
  const rentDurationOptions = [
    { value: 'threeMonths', label: t('listing:threeMonths') },
    { value: 'sixMonths', label: t('listing:sixMonths') },
    { value: 'oneYear', label: t('listing:oneYear') },
    { value: 'unlimited', label: t('listing:unlimited') },
  ] as const;

  const propertyTypeOptions = [
    { value: 'apartment', label: t('listing:apartment') },
    { value: 'house', label: t('listing:house') },
    { value: 'villa', label: t('listing:villa') },
    { value: 'studio', label: t('listing:studio') },
    { value: 'townhouse', label: t('listing:townhouse') },
    { value: 'penthouse', label: t('listing:penthouse') },
    { value: 'loft', label: t('listing:loft') },
    { value: 'duplex', label: t('listing:duplex') },
    { value: 'cottage', label: t('listing:cottage') },
    { value: 'room', label: t('listing:room') },
    { value: 'apartmentSuite', label: t('listing:apartmentSuite') },
  ] as const;

  // --- Сейверы (без any, строгие поля) ---
  const assertId = () => {
    const id = listing.listingId || (listing as unknown as { id?: string }).id;
    if (!id) throw new Error('listingId is required to patch listing');
    return id;
  };

  const saveType = (next: string) =>
    patchListing(assertId(), { type: next });

  const saveArea = (next: number) =>
    patchListing(assertId(), { area: next });

  const saveRooms = (next: number) =>
    patchListing(assertId(), { rooms: next });

  const saveRentDuration = (next: string) =>
    patchListing(assertId(), { rentDuration: next });

  const saveAvailableFrom = (nextISO: string | null) =>
    patchListing(assertId(), { availableFrom: nextISO ?? null });

  const saveDeposit = (next: number) =>
    patchListing(assertId(), { deposit: next });

  const saveAllowPets = (next: boolean) =>
    patchListing(assertId(), { allowPets: next });

  const saveAllowKids = (next: boolean) =>
    patchListing(assertId(), { allowKids: next });

  const saveAllowSmoking = (next: boolean) =>
    patchListing(assertId(), { allowSmoking: next });

  // --- Локальный InlineDate на базе InlineEdit (input[type=date]) ---
  function InlineDate({
    value,
    canEdit: can,
    onSave,
    placeholder,
    className,
    title,
  }: {
    value: DateInput;
    canEdit: boolean;
    onSave: (iso: string | null) => Promise<void> | void;
    placeholder?: string;
    className?: string;
    title?: string;
  }) {
    const view = formatDateLocalized(value, i18n.language) ?? placeholder ?? '—';
    // приводим к yyyy-MM-dd для инпута
    const d = toDateSafe(value);
    const initial = d
      ? new Date(d.getTime() - d.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 10)
      : '';

    return (
      <InlineEdit<string>
        value={initial}
        canEdit={can}
        className={className}
        renderView={() => <span className="text-foreground">{view}</span>}
        renderEditor={(draft, setDraft) => (
          <input
            type="date"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-[min(92vw,320px)] rounded-md border border-input bg-background p-2 text-sm"
          />
        )}
        onSave={(next) => onSave(next || null)}
        // заголовок для sheet на мобилке
        title={title ?? t('listing:availableFrom')}
      />
    );
  }

  // --- Карточки условий ---
  return (
    <section className="py-8 px-4 md:px-10 space-y-6">
      <h2 className="text-xl font-semibold">{t('listing:rentConditions')}</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Тип жилья */}
        <Card className="rounded-2xl bg-muted p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-blue-100 p-2 dark:bg-blue-900">
              <Home className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{t('listing:type')}</p>
              <InlineSelect
                value={listing.type}
                options={propertyTypeOptions as unknown as { value: string; label: string }[]}
                canEdit={canEdit}
                onSave={saveType}
                // placeholder не нужен — поле всегда заполнено
              />
            </div>
          </div>
        </Card>

        {/* Площадь */}
        <Card className="rounded-2xl bg-muted p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-purple-100 p-2 dark:bg-purple-900">
              <Ruler className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{t('listing:area')}</p>
              <div className="flex items-baseline gap-2">
                <InlineNumber
                  value={listing.area}
                  min={0}
                  canEdit={canEdit}
                  onSave={saveArea}
                />
                <span className="text-sm text-muted-foreground">{t('listing:areaUnit')}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Комнаты */}
        <Card className="rounded-2xl bg-muted p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-orange-100 p-2 dark:bg-orange-900">
              <DoorOpen className="h-6 w-6 text-orange-600 dark:text-orange-300" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{t('listing:rooms')}</p>
              <InlineNumber
                value={listing.rooms}
                min={0}
                canEdit={canEdit}
                onSave={saveRooms}
              />
            </div>
          </div>
        </Card>

        {/* Срок аренды */}
        <Card className="rounded-2xl bg-muted p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-teal-100 p-2 dark:bg-teal-900">
              <Clock3 className="h-6 w-6 text-teal-600 dark:text-teal-300" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{t('listing:rentDuration')}</p>
              <InlineSelect
                value={listing.rentDuration}
                options={rentDurationOptions as unknown as { value: string; label: string }[]}
                canEdit={canEdit}
                onSave={saveRentDuration}
              />
            </div>
          </div>
        </Card>

        {/* Доступно с */}
        <Card className="rounded-2xl bg-muted p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-yellow-100 p-2 dark:bg-yellow-900">
              <CalendarIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{t('listing:availableFrom')}</p>
              <InlineDate
                value={listing.availableFrom}
                canEdit={canEdit}
                onSave={saveAvailableFrom}
                placeholder={t('listing:notSpecified')}
                title={t('listing:availableFrom')}
              />
            </div>
          </div>
        </Card>

        {/* Депозит / либо нет, если страховка */}
        <Card className="rounded-2xl bg-muted p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-yellow-100 p-2 dark:bg-yellow-900">
              <HandCoins className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{t('listing:deposit')}</p>
              {listing.useInsurance ? (
                <span className="text-base font-medium text-foreground">
                  {t('listing:noDepositRequired')}
                </span>
              ) : (
                <InlineNumber
                  value={listing.deposit ?? 0}
                  min={0}
                  canEdit={canEdit}
                  onSave={saveDeposit}
                />
              )}
            </div>
          </div>
        </Card>

        {/* Животные */}
        <Card className="rounded-2xl bg-muted p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-green-100 p-2 dark:bg-green-900">
              <PawPrint className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{t('listing:petsAllowed')}</p>
              <InlineSwitch
                value={!!listing.allowPets}
                canEdit={canEdit}
                onSave={saveAllowPets}
                trueLabel={t('listing:allowed')}
                falseLabel={t('listing:notAllowed')}
              />
            </div>
          </div>
        </Card>

        {/* Дети */}
        <Card className="rounded-2xl bg-muted p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-pink-100 p-2 dark:bg-pink-900">
              <Baby className="h-6 w-6 text-pink-600 dark:text-pink-300" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{t('listing:kidsAllowed')}</p>
              <InlineSwitch
                value={!!listing.allowKids}
                canEdit={canEdit}
                onSave={saveAllowKids}
                trueLabel={t('listing:allowed')}
                falseLabel={t('listing:notAllowed')}
              />
            </div>
          </div>
        </Card>

        {/* Курение */}
        <Card className="rounded-2xl bg-muted p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-red-100 p-2 dark:bg-red-900">
              <Cigarette className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{t('listing:smokingAllowed')}</p>
              <InlineSwitch
                value={!!listing.allowSmoking}
                canEdit={canEdit}
                onSave={saveAllowSmoking}
                trueLabel={t('listing:allowed')}
                falseLabel={t('listing:notAllowed')}
              />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
