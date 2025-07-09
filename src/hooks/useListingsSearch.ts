import { useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { Listing } from '@/app/types/listing';

export interface SearchFilters {
  city?: string;
  type?: string;
  rooms?: string;
  insurance?: string;
  payment?: string;
  currency?: string;
  priceRange?: number[];
  allowKids?: boolean;
  allowPets?: boolean;
  allowSmoking?: boolean;
}

export function useListingsSearch() {
  const [results, setResults] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async (filters: SearchFilters) => {
    setLoading(true);
    try {
      const ref = collection(db, 'listings');
      let q = query(ref);

      if (filters.city) q = query(q, where('city', '==', filters.city));
      if (filters.type) q = query(q, where('type', '==', filters.type));
      if (filters.rooms) q = query(q, where('rooms', '==', filters.rooms));
      if (filters.insurance) q = query(q, where('insurance', '==', filters.insurance));
      if (filters.payment) q = query(q, where('payment', '==', filters.payment));
      if (filters.currency) q = query(q, where('currency', '==', filters.currency));

      const snapshot = await getDocs(q);
      let items: Listing[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Listing, 'id'>),
      }));

      // Доп. фильтрация по цене и запретам
      if (filters.priceRange?.length) {
        const max = filters.priceRange[0];
        items = items.filter(item => typeof item.price === 'number' && item.price <= max);
      }

      if (filters.allowKids === false) {
        items = items.filter(item => item.allowKids === false);
      }
      if (filters.allowPets === false) {
        items = items.filter(item => item.allowPets === false);
      }
      if (filters.allowSmoking === false) {
        items = items.filter(item => item.allowSmoking === false);
      }

      setResults(items);
    } catch (error) {
      console.error('Ошибка при поиске:', error);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, search };
}