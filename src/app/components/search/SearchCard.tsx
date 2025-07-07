'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CustomToggle } from '@/components/ui/CustomToggle';
import { Slider } from '@/components/ui/slider';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import {
  MapPinHouse,
  Home,
  DoorOpen,
  ShieldCheck,
  CreditCard,
  DollarSign,
} from 'lucide-react';

export default function SearchCard() {
  const { t } = useTranslation();

  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [rooms, setRooms] = useState('');
  const [insurance, setInsurance] = useState('');
  const [payment, setPayment] = useState('');
  const [currency, setCurrency] = useState('usd');
  const [priceRange, setPriceRange] = useState([300]);
  const [allowKids, setAllowKids] = useState(false);
  const [allowPets, setAllowPets] = useState(false);
  const [allowSmoking, setAllowSmoking] = useState(false);

  return (
    <div className="bg-background/75 backdrop-blur-md border border-muted rounded-2xl p-6 md:p-8 shadow-lg space-y-6 w-full">

      {/* 1. Первая строка */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label className="flex items-center gap-1 text-base text-foreground">
            <MapPinHouse className="w-4 h-4 text-orange-500" />
            {t('search.city', 'Город')}
          </Label>
          <Input
            placeholder={t('search.city', 'Город')}
            value={city}
            onChange={e => setCity(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label className="flex items-center gap-1 text-base text-foreground">
            <Home className="w-4 h-4 text-orange-500" />
            {t('search.type', 'Тип жилья')}
          </Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder={t('search.type', 'Тип жилья')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">{t('types.apartment', 'Квартира')}</SelectItem>
              <SelectItem value="house">{t('types.house', 'Дом')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="flex items-center gap-1 text-base text-foreground">
            <DoorOpen className="w-4 h-4 text-orange-500" />
            {t('search.rooms', 'Комнат')}
          </Label>
          <Select value={rooms} onValueChange={setRooms}>
            <SelectTrigger>
              <SelectValue placeholder={t('search.rooms', 'Комнат')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 2. Вторая строка */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label className="flex items-center gap-1 text-base text-foreground">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            {t('search.insurance', 'Страховка')}
          </Label>
          <Select value={insurance} onValueChange={setInsurance}>
            <SelectTrigger>
              <SelectValue placeholder={t('search.insurance', 'Страховка')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">{t('yes', 'Да')}</SelectItem>
              <SelectItem value="no">{t('no', 'Нет')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="flex items-center gap-1 text-base text-foreground">
            <CreditCard className="w-4 h-4 text-orange-500" />
            {t('search.payment', 'Оплата')}
          </Label>
          <Select value={payment} onValueChange={setPayment}>
            <SelectTrigger>
              <SelectValue placeholder={t('search.payment', 'Оплата')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card">{t('payment.card', 'Карта')}</SelectItem>
              <SelectItem value="cash">{t('payment.cash', 'Наличные')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="flex items-center gap-1 text-base text-foreground">
            <DollarSign className="w-4 h-4 text-orange-500" />
            {t('search.currency', 'Валюта')}
          </Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger>
              <SelectValue placeholder={t('search.currency', 'Валюта')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usd">USD</SelectItem>
              <SelectItem value="eur">EUR</SelectItem>
              <SelectItem value="uah">UAH</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 3-й ряд: слайдер + вертикалка + тумблеры */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* Слайдер (цена) */}
  <div className="flex flex-col items-start space-y-1 md:col-span-1">
    <Label className="text-base text-muted-foreground text-left">
      {t('search.price', 'Цена')}: ${priceRange[0]}
    </Label>
    <Slider
      className="w-full"
      value={priceRange}
      max={5000}
      step={100}
      onValueChange={setPriceRange}
    />
  </div>

  {/* Тумблеры, выровненные по «нулю» нижнего края */}
  <div
    className="
      self-end
      flex flex-wrap items-center
      gap-6
      md:col-span-2
      md:pl-6 md:border-l md:border-white
    "
  >
    <CustomToggle pressed={allowKids} onPressedChange={setAllowKids}>
      👶 {t('search.kids', 'С детьми')}
    </CustomToggle>

    <CustomToggle pressed={allowPets} onPressedChange={setAllowPets}>
      🐱 {t('search.pets', 'С животными')}
    </CustomToggle>

    <CustomToggle pressed={allowSmoking} onPressedChange={setAllowSmoking}>
      🚬 {t('search.smoking', 'Курение')}
    </CustomToggle>
  </div>
</div>
    </div>
  );
}
