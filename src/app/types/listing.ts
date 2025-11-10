export interface Listing {
  id: string;
  listingId: string; // уникальный идентификатор объявления
  title: string;
  country: string;
  city: string;
  district: string;
  address: string;
  type: string;
  area: number;
  rooms: number;

  price: number;
  currency: string;
  paymentMethod: 'cash' | 'card' | 'crypto' | null;
  onlinePayment: boolean;
  useInsurance: boolean;
  deposit: number;
  rentDuration: string;
  availableFrom: Date | null;

  allowPets: boolean;
  allowKids: boolean;
  allowSmoking: boolean;

  description: string;
  amenities: string[];
  photos: string[];

  createdAt: Date;
  ownerId: string;

  ownerName: string;
  ownerAvatar: string;
  ownerRating: number;
  ownerCity?: string; // если нужно
}