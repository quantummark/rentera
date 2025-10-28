'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomToggle } from '@/components/ui/CustomToggle';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
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
import { useListingsSearch } from '@/hooks/useListingsSearch';

export default function SearchCard() {
  const { t } = useTranslation(['search','types','payment','common']);

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
  const { search, loading } = useListingsSearch();

  // Загрузка из localStorage при монтировании
  useEffect(() => {
    const saved = localStorage.getItem('rentera-search');
    if (saved) {
      const parsed = JSON.parse(saved);
      setCity(parsed.city || '');
      setType(parsed.type || '');
      setRooms(parsed.rooms || '');
      setInsurance(parsed.insurance || '');
      setPayment(parsed.payment || '');
      setCurrency(parsed.currency || 'usd');
      setPriceRange(parsed.priceRange || [300]);
      setAllowKids(parsed.allowKids || false);
      setAllowPets(parsed.allowPets || false);
      setAllowSmoking(parsed.allowSmoking || false);
    }
  }, []);

  // Сохранение в localStorage при изменениях
  useEffect(() => {
    localStorage.setItem(
      'rentera-search',
      JSON.stringify({
        city,
        type,
        rooms,
        insurance,
        payment,
        currency,
        priceRange,
        allowKids,
        allowPets,
        allowSmoking,
      })
    );
  }, [city, type, rooms, insurance, payment, currency, priceRange, allowKids, allowPets, allowSmoking]);

  const resetFilters = () => {
    setCity('');
    setType('');
    setRooms('');
    setInsurance('');
    setPayment('');
    setCurrency('usd');
    setPriceRange([300]);
    setAllowKids(false);
    setAllowPets(false);
    setAllowSmoking(false);
  };

  const handleSearch = () => {
    search({
      city,
      type,
      rooms,
      insurance,
      payment,
      currency,
      priceRange,
      allowKids,
      allowPets,
      allowSmoking,
    });
  };

  return (
    <div className="bg-background/60 backdrop-blur-lg border border-muted rounded-2xl p-6 md:p-8 shadow-lg space-y-6 w-full transition-opacity duration-500 animate-fade-in">
      {/* Первая строка */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label className="flex items-center gap-1 text-base text-foreground">
            <MapPinHouse className="w-4 h-4 text-orange-500" />
            {t('search:city')}
          </Label>
          <Input placeholder={t('search:city')} value={city} onChange={e => setCity(e.target.value)} />
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
            onChange={setRooms}
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

      {/* Вторая строка */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label className="flex items-center gap-1 text-base text-foreground">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            {t('search:insurance')}
          </Label>
          <CustomSelect
            value={insurance}
            onChange={setInsurance}
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
            onChange={setCurrency}
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

      {/* Слайдер и тумблеры */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col items-start space-y-1 md:col-span-1">
          <Label className="text-base text-muted-foreground text-left">
            {t('search:price')}: ${priceRange[0]}
          </Label>
          <Slider
            className="w-full"
            value={priceRange}
            max={5000}
            step={100}
            onValueChange={setPriceRange}
          />
        </div>

        <div className="self-end flex flex-wrap items-center gap-6 md:col-span-2 md:pl-6 md:border-l md:border-white">
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

      {/* Кнопки действия */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={resetFilters} className="gap-2">
          <XCircle className="w-4 h-4" />
          {t('search:reset')}
        </Button>

        <Button onClick={handleSearch} disabled={loading} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 text-sm font-medium">
          <Search className="w-4 h-4" />
          {t('search:submit')}
        </Button>
      </div>
    </div>
  );
}
