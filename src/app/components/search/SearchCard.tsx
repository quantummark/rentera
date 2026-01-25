'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomToggle } from '@/components/ui/CustomToggle';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

import {
  MapPinHouse,
  Home,
  DoorOpen,
  ShieldCheck,
  CreditCard,
  DollarSign,
  Search,
  XCircle,
} from 'lucide-react';

import CustomSelect from '@/components/ui/CustomSelect';
import { type SearchFilters } from '@/hooks/useListingsSearch';
import { useListingsSearchCtx } from '@/context/ListingsSearchContext';

type YesNo = '' | 'yes' | 'no';
type RoomsValue = '' | '1' | '2' | '3' | '4' | '5';
type CurrencyUi = 'usd' | 'eur' | 'uah' | 'btc' | 'eth' | 'usdt' | 'solana';

type SavedSearch = {
  city: string;
  type: string;
  rooms: RoomsValue;
  insurance: YesNo;
  payment: string;
  currency: CurrencyUi;
  priceMax: number;
  allowKids: boolean;
  allowPets: boolean;
  allowSmoking: boolean;
};

const STORAGE_KEY = 'rentera-search-v2';

function toBoolFromYesNo(v: YesNo): boolean | undefined {
  if (v === 'yes') return true;
  if (v === 'no') return false;
  return undefined;
}

function toRoomsNumber(v: RoomsValue): number | undefined {
  if (!v) return undefined;
  if (v === '5') return 5; // в БД у тебя rooms число, для "5+" лучше трактовать как 5 (минимум)
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function toCurrencyDb(v: CurrencyUi): SearchFilters['currency'] | undefined {
  const map: Record<CurrencyUi, string> = {
    usd: 'USD',
    eur: 'EUR',
    uah: 'UAH',
    btc: 'BTC',
    eth: 'ETH',
    usdt: 'USDT',
    solana: 'SOL',
  };
  return map[v];
}

function safeParseSaved(raw: string | null): SavedSearch | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<SavedSearch>;
    const priceMax = typeof parsed.priceMax === 'number' ? parsed.priceMax : 300;

    return {
      city: typeof parsed.city === 'string' ? parsed.city : '',
      type: typeof parsed.type === 'string' ? parsed.type : '',
      rooms: (typeof parsed.rooms === 'string' ? parsed.rooms : '') as RoomsValue,
      insurance: (typeof parsed.insurance === 'string' ? parsed.insurance : '') as YesNo,
      payment: typeof parsed.payment === 'string' ? parsed.payment : '',
      currency: (typeof parsed.currency === 'string' ? parsed.currency : 'usd') as CurrencyUi,
      priceMax,
      allowKids: Boolean(parsed.allowKids),
      allowPets: Boolean(parsed.allowPets),
      allowSmoking: Boolean(parsed.allowSmoking),
    };
  } catch {
    return null;
  }
}

export default function SearchCard() {
  const { t } = useTranslation(['search', 'types', 'payment', 'common']);

  // UI state
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [rooms, setRooms] = useState<RoomsValue>('');
  const [insurance, setInsurance] = useState<YesNo>('');
  const [payment, setPayment] = useState('');
  const [currency, setCurrency] = useState<CurrencyUi>('usd');
  const [priceMax, setPriceMax] = useState<number>(300);

  const [allowKids, setAllowKids] = useState(false);
  const [allowPets, setAllowPets] = useState(false);
  const [allowSmoking, setAllowSmoking] = useState(false);

  const { search, loading } = useListingsSearchCtx();
  // Load from localStorage once
  useEffect(() => {
    const saved = safeParseSaved(localStorage.getItem(STORAGE_KEY));
    if (!saved) return;

    setCity(saved.city);
    setType(saved.type);
    setRooms(saved.rooms);
    setInsurance(saved.insurance);
    setPayment(saved.payment);
    setCurrency(saved.currency);
    setPriceMax(saved.priceMax);

    setAllowKids(saved.allowKids);
    setAllowPets(saved.allowPets);
    setAllowSmoking(saved.allowSmoking);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    const payload: SavedSearch = {
      city,
      type,
      rooms,
      insurance,
      payment,
      currency,
      priceMax,
      allowKids,
      allowPets,
      allowSmoking,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [city, type, rooms, insurance, payment, currency, priceMax, allowKids, allowPets, allowSmoking]);

  const filters: SearchFilters = useMemo(() => {
    // Маппим UI → SearchFilters (то, что реально ждёт хук)
    const roomsNumber = toRoomsNumber(rooms);
    const useInsurance = toBoolFromYesNo(insurance);
    const currencyDb = toCurrencyDb(currency);

    return {
      city: city.trim() || undefined,
      type: type || undefined,
      rooms: roomsNumber,
      useInsurance,
      paymentMethod: payment || undefined,
      currency: currencyDb,
      // у нас слайдер "до X" → кладём в max
      priceRange: [undefined, priceMax],
      allowKids,
      allowPets,
      allowSmoking,
      // сортировку не трогаем здесь — ею управляет ListingsGrid
    };
  }, [city, type, rooms, insurance, payment, currency, priceMax, allowKids, allowPets, allowSmoking]);

  const resetFilters = () => {
    setCity('');
    setType('');
    setRooms('');
    setInsurance('');
    setPayment('');
    setCurrency('usd');
    setPriceMax(300);
    setAllowKids(false);
    setAllowPets(false);
    setAllowSmoking(false);

    localStorage.removeItem(STORAGE_KEY);
    // ✅ и сразу показываем последние объявления
    void search({ sort: 'new' });
  };

  const handleSearch = () => {
    void search(filters);
  };

  return (
    <div className="bg-background/60 backdrop-blur-lg border border-muted rounded-2xl p-6 md:p-8 shadow-lg space-y-6 w-full transition-opacity duration-500 animate-fade-in">
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label className="flex items-center gap-1 text-base text-foreground">
            <MapPinHouse className="w-4 h-4 text-orange-500" />
            {t('search:city')}
          </Label>
          <Input
            placeholder={t('search:city')}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label className="flex items-center gap-1 text-base text-foreground">
            <Home className="w-4 h-4 text-orange-500" />
            {t('search:type')}
          </Label>
          <CustomSelect
            value={type}
            onChange={setType}
            placeholder={t('search:type')}
            options={[
              { value: 'apartment', label: t('types:apartment') },
              { value: 'house', label: t('types:house') },
              { value: 'room', label: t('types:room') },
              { value: 'studio', label: t('types:studio') },
              { value: 'villa', label: t('types:villa') },
              { value: 'townhouse', label: t('types:townhouse') },
              { value: 'penthouse', label: t('types:penthouse') },
              { value: 'loft', label: t('types:loft') },
              { value: 'duplex', label: t('types:duplex') },
              { value: 'cottage', label: t('types:cottage') },
              { value: 'apartmentSuite', label: t('types:apartmentSuite') },
            ]}
          />
        </div>

        <div className="space-y-1">
          <Label className="flex items-center gap-1 text-base text-foreground">
            <DoorOpen className="w-4 h-4 text-orange-500" />
            {t('search:rooms')}
          </Label>
          <CustomSelect
            value={rooms}
            onChange={(v) => setRooms(v as RoomsValue)}
            placeholder={t('search:rooms')}
            options={[
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
              { value: '5', label: '5+' },
            ]}
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label className="flex items-center gap-1 text-base text-foreground">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            {t('search:insurance')}
          </Label>
          <CustomSelect
            value={insurance}
            onChange={(v) => setInsurance(v as YesNo)}
            placeholder={t('search:insurance')}
            options={[
              { value: 'yes', label: t('common:yes') },
              { value: 'no', label: t('common:no') },
            ]}
          />
        </div>

        <div className="space-y-1">
          <Label className="flex items-center gap-1 text-base text-foreground">
            <CreditCard className="w-4 h-4 text-orange-500" />
            {t('search:payment')}
          </Label>
          <CustomSelect
            value={payment}
            onChange={setPayment}
            placeholder={t('search:payment')}
            options={[
              { value: 'card', label: t('payment:card') },
              { value: 'cash', label: t('payment:cash') },
              { value: 'crypto', label: t('payment:crypto') },
            ]}
          />
        </div>

        <div className="space-y-1">
          <Label className="flex items-center gap-1 text-base text-foreground">
            <DollarSign className="w-4 h-4 text-orange-500" />
            {t('search:currency')}
          </Label>
          <CustomSelect
            value={currency}
            onChange={(v) => setCurrency(v as CurrencyUi)}
            placeholder={t('search:currency')}
            options={[
              { value: 'usd', label: 'USD' },
              { value: 'eur', label: 'EUR' },
              { value: 'uah', label: 'UAH' },
              { value: 'btc', label: 'BTC' },
              { value: 'eth', label: 'ETH' },
              { value: 'usdt', label: 'USDT' },
              { value: 'solana', label: 'SOL' },
            ]}
          />
        </div>
      </div>

      {/* Slider + toggles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col items-start space-y-1 md:col-span-1">
          <Label className="text-base text-muted-foreground text-left">
            {t('search:price')}: ${priceMax}
          </Label>

          <Slider
            className="w-full"
            value={[priceMax]}
            max={5000}
            step={100}
            onValueChange={(v) => setPriceMax(v[0] ?? 300)}
          />
        </div>

        <div className="self-end flex flex-wrap items-center gap-6 md:col-span-2 md:pl-6 md:border-l md:border-border">
          <CustomToggle pressed={allowKids} onPressedChange={setAllowKids}>
            👶 {t('search:kids')}
          </CustomToggle>

          <CustomToggle pressed={allowPets} onPressedChange={setAllowPets}>
            🐱 {t('search:pets')}
          </CustomToggle>

          <CustomToggle pressed={allowSmoking} onPressedChange={setAllowSmoking}>
            🚬 {t('search:smoking')}
          </CustomToggle>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={resetFilters} className="gap-2">
          <XCircle className="w-4 h-4" />
          {t('search:reset')}
        </Button>

        <Button
          onClick={handleSearch}
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 text-sm font-medium gap-2"
        >
          <Search className="w-4 h-4" />
          {t('search:submit')}
        </Button>
      </div>
    </div>
  );
}
