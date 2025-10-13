export interface Listing {
  id?: string;
  listingId: string; // уникальный идентификатор объявления
  title: string;
  city: string;
  district: string;
  address: string;
  type: string;
  area: number;
  rooms: number;

  price: number;
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