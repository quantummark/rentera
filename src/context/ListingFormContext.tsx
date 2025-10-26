'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

/** Ключи — храним ТОЛЬКО их, UI переводит по i18n */
export type ListingTypeKey =
  | 'apartment'
  | 'house'
  | 'room'
  | 'studio'
  | 'townhouse'
  | 'villa'
  | 'loft'
  | 'duplex'
  | 'penthouse'
  | 'cottage'
  | 'apartmentSuite';

export type PaymentMethodKey = 'cash' | 'card' | 'crypto';

export type CurrencyKey = 'USD' | 'EUR' | 'UAH' | 'BTC' | 'ETH' | 'USDT' | 'SOL';

export type RentDurationKey = 'threeMonths' | 'sixMonths' | 'oneYear' | 'unlimited';

export type AmenityKey =
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

export type ListingFormData = {
  /** Блок 1: базовая инфа */
  title: string;
  country: string;
  city: string;
  district: string;
  address: string;
  type?: ListingTypeKey;         // ключ, не текст!
  area?: number;
  rooms?: number;

  /** Блок 2: условия */
  price?: number;
  onlinePayment: boolean;
  useInsurance: boolean;
  deposit?: number;              // если есть, иначе undefined
  rentDuration?: RentDurationKey;
  availableFrom: Date | null;
  allowPets: boolean;
  allowKids: boolean;
  allowSmoking: boolean;
  paymentMethod?: PaymentMethodKey;
  currency?: CurrencyKey;

  /** Блок 3: описание и удобства */
  description: string;
  amenities: AmenityKey[];

  /** Блок 4: фото (локальные File-ы в форме, в БД — URL-ы) */
  photos: File[];

  /** Владелец (подставляем при сабмите) */
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerRating: number;
  ownerCity?: string;
};

const defaultData: ListingFormData = {
  // Базовое
  title: '',
  country: '',
  city: '',
  district: '',
  address: '',
  type: undefined,
  area: undefined,
  rooms: undefined,

  // Условия
  price: undefined,
  onlinePayment: false,
  useInsurance: false,
  deposit: undefined,
  rentDuration: undefined,
  availableFrom: null,
  allowPets: false,
  allowKids: false,
  allowSmoking: false,
  paymentMethod: undefined,
  currency: 'USD', // можно поменять на 'UAH' если это дефолт для Украины

  // Описание/удобства
  description: '',
  amenities: [],

  // Фото
  photos: [],

  // Владелец
  ownerId: '',
  ownerName: '',
  ownerAvatar: '',
  ownerRating: 5,
  ownerCity: ''
};

type ListingFormContextType = {
  data: ListingFormData;
  updateData: (patch: Partial<ListingFormData>) => void;
  resetData: () => void;

  // удобные хелперы, чтобы не дублировать логику в шагах
  toggleAmenity: (key: AmenityKey) => void;
  addPhoto: (file: File) => void;
  removePhoto: (index: number) => void;
};

const ListingFormContext = createContext<ListingFormContextType | undefined>(undefined);

export const useListingForm = () => {
  const ctx = useContext(ListingFormContext);
  if (!ctx) throw new Error('useListingForm must be used within a ListingFormProvider');
  return ctx;
};

export const ListingFormProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<ListingFormData>(defaultData);

  const updateData = (patch: Partial<ListingFormData>) => {
    setData(prev => ({ ...prev, ...patch }));
  };

  const resetData = () => setData(defaultData);

  const toggleAmenity = (key: AmenityKey) => {
    setData(prev => {
      const has = prev.amenities.includes(key);
      return {
        ...prev,
        amenities: has ? prev.amenities.filter(a => a !== key) : [...prev.amenities, key]
      };
    });
  };

  const addPhoto = (file: File) => {
    setData(prev => {
      if (prev.photos.length >= 10) return prev; // мягкий лимит
      return { ...prev, photos: [...prev.photos, file] };
    });
  };

  const removePhoto = (index: number) => {
    setData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  return (
    <ListingFormContext.Provider
      value={{ data, updateData, resetData, toggleAmenity, addPhoto, removePhoto }}
    >
      {children}
    </ListingFormContext.Provider>
  );
};
