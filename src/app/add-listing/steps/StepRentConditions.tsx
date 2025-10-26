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
import CustomSelect from '@/components/ui/CustomSelect'; 

type PaymentMethodKey = 'cash' | 'card' | 'crypto';
type CurrencyKey = 'USD' | 'EUR' | 'UAH' | 'BTC' | 'ETH' | 'USDT' | 'SOL';
type RentDurationKey = 'threeMonths' | 'sixMonths' | 'oneYear' | 'unlimited';

const PAYMENT_METHODS: PaymentMethodKey[] = ['cash', 'card', 'crypto'];
const CURRENCIES: CurrencyKey[] = ['USD','EUR','UAH','BTC','ETH','USDT','SOL'];
const DURATIONS: RentDurationKey[] = ['threeMonths','sixMonths','oneYear','unlimited'];

export default function StepRentConditions() {
  const { data, updateData } = useListingForm();
  const { t, i18n } = useTranslation('StepRentConditions');
  const locale = i18n.language === 'ru' ? ru : i18n.language === 'uk' ? uk : enUS;

  const handleCheckbox = (field: keyof typeof data) => {
    // @ts-ignore — в форме эти поля булевые
    updateData({ [field]: !data[field] });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {t('sections.details')}
      </h2>

      {/* Цена */}
      <div className="space-y-2">
        <Label htmlFor="price">{t('fields.price')}</Label>
        <Input
          id="price"
          type="number"
          min={0}
          placeholder="750"
          value={data.price ?? ''}
          onChange={(e) => updateData({ price: e.target.value ? Number(e.target.value) : undefined })}
          required
        />
      </div>

      {/* Способ оплаты */}
      <div className="space-y-2">
        <Label htmlFor="paymentMethod">{t('fields.paymentMethod')}</Label>
        <CustomSelect
          value={data.paymentMethod || ''}
          onChange={(value) => updateData({ paymentMethod: value as PaymentMethodKey })}
          options={PAYMENT_METHODS.map((k) => ({
            value: k,
            label: t(`options.payment.${k}`)
          }))}
          placeholder={t('placeholders.paymentMethod')}
        />
      </div>

      {/* Валюта */}
      <div className="space-y-2">
        <Label htmlFor="currency">{t('fields.currency')}</Label>
        <CustomSelect
          value={data.currency || ''}
          onChange={(value) => updateData({ currency: value as CurrencyKey })}
          options={CURRENCIES.map((k) => ({
            value: k,
            label: t(`options.currency.${k}`)
          }))}
          placeholder={t('placeholders.currency')}
        />
      </div>

      {/* Онлайн-оплата */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="onlinePayment"
          checked={!!data.onlinePayment}
          onChange={(e) => updateData({ onlinePayment: (e.target as HTMLInputElement).checked })}
        />
        <Label htmlFor="onlinePayment" className="text-sm">
          {t('fields.onlinePayment')}
        </Label>
      </div>
      {data.onlinePayment && (
        <p className="text-muted-foreground text-sm">
          {t('notes.onlinePayment')}
        </p>
      )}

      {/* Страхование вместо залога */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="useInsurance"
            checked={!!data.useInsurance}
            onChange={() => handleCheckbox('useInsurance')}
          />
          <Label htmlFor="useInsurance">
            {t('fields.useInsurance')}
          </Label>
        </div>
        {data.useInsurance && (
          <p className="text-muted-foreground text-sm">
            {t('notes.insurance')}
          </p>
        )}
      </div>

      {/* Залог вручную (если нет страховки) */}
      {!data.useInsurance && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="useDeposit"
              checked={!!data.deposit && data.deposit > 0}
              onChange={() => updateData({ deposit: (data.deposit && data.deposit > 0) ? 0 : 1000 })}
            />
            <Label htmlFor="useDeposit">
              {t('fields.useDeposit')}
            </Label>
          </div>

          {!!data.deposit && data.deposit > 0 && (
            <Input
              id="deposit"
              type="number"
              min={0}
              placeholder="1000"
              value={data.deposit}
              onChange={(e) => updateData({ deposit: e.target.value ? Number(e.target.value) : 0 })}
            />
          )}
        </div>
      )}

      {/* Срок аренды */}
      <div className="space-y-2">
        <Label htmlFor="rentDuration">{t('fields.rentDuration')}</Label>
        <CustomSelect
          value={data.rentDuration || ''}
          onChange={(value) => updateData({ rentDuration: value as RentDurationKey })}
          options={DURATIONS.map((k) => ({
            value: k,
            label: t(`options.duration.${k}`)
          }))}
          placeholder={t('placeholders.rentDuration')}
        />
      </div>

      {/* Доступно с */}
      <div className="space-y-2">
        <Label htmlFor="availableFrom">{t('fields.availableFrom')}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn('w-full justify-start text-left font-normal', !data.availableFrom && 'text-muted-foreground')}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {data.availableFrom
                ? format(new Date(data.availableFrom), 'dd MMMM yyyy', { locale })
                : t('placeholders.selectDate')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              date={data.availableFrom ?? null}
              onChange={(date: Date | null) => updateData({ availableFrom: date ?? null })}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Разрешено */}
      <div className="space-y-2">
        <Label>{t('fields.allowed')}</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <Checkbox id="allowPets" checked={!!data.allowPets} onChange={() => handleCheckbox('allowPets')} />
            <Label htmlFor="allowPets">{t('options.allowed.pets')}</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="allowKids" checked={!!data.allowKids} onChange={() => handleCheckbox('allowKids')} />
            <Label htmlFor="allowKids">{t('options.allowed.kids')}</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="allowSmoking" checked={!!data.allowSmoking} onChange={() => handleCheckbox('allowSmoking')} />
            <Label htmlFor="allowSmoking">{t('options.allowed.smoking')}</Label>
          </div>
        </div>
      </div>
    </div>
  );
}
