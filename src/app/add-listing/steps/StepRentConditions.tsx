'use client';

import { useListingForm } from '@/context/ListingFormContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

export default function StepRentConditions() {
  const { data, updateData } = useListingForm();
  const { t } = useTranslation();

  const handleCheckbox = (field: keyof typeof data) => {
    updateData({ [field]: !data[field] });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {t('listing.conditions.title', '2. Условия аренды')}
      </h2>

      {/* Цена */}
      <div className="space-y-2">
        <Label htmlFor="price">{t('listing.conditions.price', 'Цена в месяц ($)')}</Label>
        <Input
          id="price"
          type="number"
          min={0}
          placeholder="750"
          value={data.price}
          onChange={(e) => updateData({ price: parseInt(e.target.value) || 0 })}
          required
        />
      </div>

      {/* Онлайн-оплата */}
<div className="flex items-center space-x-2 pt-2">
  <input
    type="checkbox"
    id="onlinePayment"
    checked={data.onlinePayment}
    onChange={(e) => updateData({ onlinePayment: e.target.checked })}
    className="w-5 h-5 accent-orange-500"
  />
  <label htmlFor="onlinePayment" className="text-sm text-foreground">
    {t('listing.conditions.onlinePayment', 'Онлайн-оплата')}
  </label>
</div>

      {/* Страховка */}
      <div className="space-y-2">
        <Checkbox
          checked={data.useInsurance}
          onChange={() => handleCheckbox('useInsurance')}
        />
        <Label className="ml-2">{t('listing.conditions.useInsurance', 'Использовать страхование вместо залога')}</Label>

        {data.useInsurance && (
          <p className="text-muted-foreground text-sm mt-2">
            {t(
              'listing.conditions.insuranceNote',
              'С Rentera вы можете не брать залог, а подключить страхование, которое покрывает возможный ущерб. Это удобно для арендатора и безопасно для вас.'
            )}
          </p>
        )}
      </div>

      {/* Залог вручную */}
      {!data.useInsurance && (
        <div className="space-y-2">
          <Checkbox
            checked={!!data.deposit}
            onChange={() =>
              updateData({ deposit: data.deposit ? 0 : 1000 })
            }
          />
          <Label className="ml-2">{t('listing.conditions.useDeposit', 'Не хочу использовать страховку — укажу сумму залога вручную')}</Label>

          {!!data.deposit && (
            <Input
              id="deposit"
              type="number"
              min={0}
              placeholder="1000"
              value={data.deposit}
              onChange={(e) => updateData({ deposit: parseInt(e.target.value) || 0 })}
            />
          )}
        </div>
      )}

      {/* Срок аренды */}
      <div className="space-y-2">
        <Label htmlFor="duration">{t('listing.conditions.duration', 'Срок аренды')}</Label>
        <Input
          id="duration"
          placeholder={t('listing.conditions.durationPlaceholder', '1–3 мес / 3–6 мес / 6+ мес / Без ограничения')}
          value={data.rentDuration}
          onChange={(e) => updateData({ rentDuration: e.target.value })}
        />
      </div>

      {/* Доступно с */}
      <div className="space-y-2">
        <Label>{t('listing.conditions.availableFrom', 'Доступно с')}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !data.availableFrom && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {data.availableFrom
                ? format(new Date(data.availableFrom), 'dd MMMM yyyy', { locale: ru })
                : t('listing.conditions.selectDate', 'Выберите дату')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              date={data.availableFrom ? new Date(data.availableFrom) : null}
              onChange={(date: Date) => updateData({ availableFrom: date ?? null })}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Разрешено с... */}
      <div className="space-y-2">
        <Label>{t('listing.conditions.allowed', 'Разрешено:')}</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={data.allowPets}
              onChange={() => handleCheckbox('allowPets')}
            />
            <Label>{t('listing.conditions.pets', 'С животными')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={data.allowKids}
              onChange={() => handleCheckbox('allowKids')}
            />
            <Label>{t('listing.conditions.kids', 'С детьми')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={data.allowSmoking}
              onChange={() => handleCheckbox('allowSmoking')}
            />
            <Label>{t('listing.conditions.smoking', 'Курение')}</Label>
          </div>
        </div>
      </div>
    </div>
  );
}
