'use client';

import { useListingForm } from '@/context/ListingFormContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { ru, uk, enUS } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

export default function StepRentConditions() {
  const { data, updateData } = useListingForm();
  const { t, i18n } = useTranslation();

  const locale = i18n.language === 'ru' ? ru : i18n.language === 'uk' ? uk : enUS;

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
          value={data.price || ''}
          onChange={(e) => updateData({ price: Number(e.target.value) || 0 })}
          required
        />
      </div>

      {/* Онлайн-оплата */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="onlinePayment"
          checked={data.onlinePayment}
          onChange={(e) => updateData({ onlinePayment: e.target.checked })}
        />
        <Label htmlFor="onlinePayment" className="text-sm">
          {t('listing.conditions.onlinePayment', 'Онлайн-оплата')}
        </Label>
      </div>

      {/* Страховка */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="useInsurance"
            checked={data.useInsurance}
            onChange={() => handleCheckbox('useInsurance')}
          />
          <Label htmlFor="useInsurance">
            {t('listing.conditions.useInsurance', 'Использовать страхование вместо залога')}
          </Label>
        </div>
        {data.useInsurance && (
          <p className="text-muted-foreground text-sm">
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
          <div className="flex items-center gap-2">
            <Checkbox
              id="useDeposit"
              checked={!!data.deposit}
              onChange={() => updateData({ deposit: data.deposit ? 0 : 1000 })}
            />
            <Label htmlFor="useDeposit">
              {t('listing.conditions.useDeposit', 'Не хочу использовать страховку — укажу сумму залога вручную')}
            </Label>
          </div>

          {!!data.deposit && (
            <Input
              id="deposit"
              type="number"
              min={0}
              placeholder="1000"
              value={data.deposit}
              onChange={(e) => updateData({ deposit: Number(e.target.value) || 0 })}
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
        <Label htmlFor="availableFrom">{t('listing.conditions.availableFrom', 'Доступно с')}</Label>
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
                ? format(new Date(data.availableFrom), 'dd MMMM yyyy', { locale })
                : t('listing.conditions.selectDate', 'Выберите дату')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              date={data.availableFrom ?? null}
              onChange={(date: Date | null) => updateData({ availableFrom: date })}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Разрешено с... */}
      <div className="space-y-2">
        <Label>{t('listing.conditions.allowed', 'Разрешено:')}</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="allowPets"
              checked={data.allowPets}
              onChange={() => handleCheckbox('allowPets')}
            />
            <Label htmlFor="allowPets">{t('listing.conditions.pets', 'С животными')}</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="allowKids"
              checked={data.allowKids}
              onChange={() => handleCheckbox('allowKids')}
            />
            <Label htmlFor="allowKids">{t('listing.conditions.kids', 'С детьми')}</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="allowSmoking"
              checked={data.allowSmoking}
              onChange={() => handleCheckbox('allowSmoking')}
            />
            <Label htmlFor="allowSmoking">{t('listing.conditions.smoking', 'Курение')}</Label>
          </div>
        </div>
      </div>
    </div>
  );
}
