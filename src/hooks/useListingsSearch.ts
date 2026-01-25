import { useCallback, useMemo, useRef, useState } from 'react';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
  type QuerySnapshot,
} from 'firebase/firestore';

import { db } from '@/app/firebase/firebase';
import type { Listing } from '@/app/types/listing';

export type SortKey = 'new' | 'cheap' | 'expensive';

export interface SearchFilters {
  city?: string;

  type?: string; // ListingTypeKey
  rooms?: number;

  rentDuration?: string; // RentDurationKey
  paymentMethod?: string; // PaymentMethodKey
  currency?: string; // CurrencyKey

  priceRange?: [number?, number?]; // [min, max]

  onlinePayment?: boolean;
  useInsurance?: boolean;

  allowKids?: boolean;
  allowPets?: boolean;
  allowSmoking?: boolean;

  sort?: SortKey; // ✅ server-side sort
}

type SearchState = {
  results: Listing[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
};

function safeTrim(value?: string): string {
  return (value ?? '').trim();
}

/** Нормализация города в ключ */
function toCityKey(input: string): string {
  const raw = safeTrim(input).toLowerCase();

  const cleaned = raw
    .replace(/[’'`]/g, '')
    .replace(/[-.,/\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const map: Record<string, string> = {
    киев: 'kyiv',
    київ: 'kyiv',
    kiev: 'kyiv',
    kyiv: 'kyiv',

    одесса: 'odesa',
    одеса: 'odesa',
    odessa: 'odesa',
    odesa: 'odesa',

    харьков: 'kharkiv',
    харків: 'kharkiv',
    kharkov: 'kharkiv',
    kharkiv: 'kharkiv',

    львов: 'lviv',
    львів: 'lviv',
    lvov: 'lviv',
    lviv: 'lviv',

    днепр: 'dnipro',
    дніпро: 'dnipro',
    dnepr: 'dnipro',
    dnipro: 'dnipro',
  };

  return map[cleaned] ?? cleaned;
}

function mapSnapshotToListings(snapshot: QuerySnapshot<DocumentData>): Listing[] {
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data() as Omit<Listing, 'id'>;
    return { id: docSnap.id, ...data };
  });
}

function hasPriceRange(filters: SearchFilters): boolean {
  const [minPrice, maxPrice] = filters.priceRange ?? [];
  return typeof minPrice === 'number' || typeof maxPrice === 'number';
}

function pushSortConstraints(constraints: QueryConstraint[], filters: SearchFilters) {
  const sort: SortKey = filters.sort ?? 'new';
  const priceRangeOn = hasPriceRange(filters);

  // Если есть priceRange, Firestore требует orderBy(price) первым
  if (sort === 'cheap') {
    constraints.push(orderBy('price', 'asc'));
    constraints.push(orderBy('createdAt', 'desc'));
    return;
  }

  if (sort === 'expensive') {
    constraints.push(orderBy('price', 'desc'));
    constraints.push(orderBy('createdAt', 'desc'));
    return;
  }

  // sort === 'new'
  if (priceRangeOn) {
    constraints.push(orderBy('price', 'asc'));
    constraints.push(orderBy('createdAt', 'desc'));
  } else {
    constraints.push(orderBy('createdAt', 'desc'));
  }
}

export function useListingsSearch(pageSize = 24) {
  const [state, setState] = useState<SearchState>({
    results: [],
    loading: false,
    error: null,
    hasMore: true,
  });

  const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);
  const activeRequestRef = useRef<number>(0);
  const lastFiltersRef = useRef<SearchFilters | null>(null);

  const reset = useCallback(() => {
    lastDocRef.current = null;
    lastFiltersRef.current = null;
    setState({ results: [], loading: false, error: null, hasMore: true });
  }, []);

  const buildConstraints = useCallback(
    (filters: SearchFilters): QueryConstraint[] => {
      const constraints: QueryConstraint[] = [];

      // City: основной путь через cityAliases
      const city = safeTrim(filters.city);
      if (city) {
        const key = toCityKey(city);
        constraints.push(where('cityAliases', 'array-contains', key));
      }

      if (filters.type) constraints.push(where('type', '==', filters.type));
      if (typeof filters.rooms === 'number') constraints.push(where('rooms', '==', filters.rooms));

      if (filters.rentDuration) constraints.push(where('rentDuration', '==', filters.rentDuration));
      if (filters.paymentMethod) constraints.push(where('paymentMethod', '==', filters.paymentMethod));
      if (filters.currency) constraints.push(where('currency', '==', filters.currency));

      if (typeof filters.onlinePayment === 'boolean') {
        constraints.push(where('onlinePayment', '==', filters.onlinePayment));
      }
      if (typeof filters.useInsurance === 'boolean') {
        constraints.push(where('useInsurance', '==', filters.useInsurance));
      }

      if (typeof filters.allowKids === 'boolean') constraints.push(where('allowKids', '==', filters.allowKids));
      if (typeof filters.allowPets === 'boolean') constraints.push(where('allowPets', '==', filters.allowPets));
      if (typeof filters.allowSmoking === 'boolean') constraints.push(where('allowSmoking', '==', filters.allowSmoking));

      // Price range
      const [minPrice, maxPrice] = filters.priceRange ?? [];
      if (typeof minPrice === 'number') constraints.push(where('price', '>=', minPrice));
      if (typeof maxPrice === 'number') constraints.push(where('price', '<=', maxPrice));

      // ✅ Sorting (server-side)
      pushSortConstraints(constraints, filters);

      // page size
      constraints.push(limit(pageSize));

      return constraints;
    },
    [pageSize]
  );

  const runQuery = useCallback(
    async (filters: SearchFilters, mode: 'replace' | 'append') => {
      const reqId = (activeRequestRef.current += 1);

      setState((s) => ({ ...s, loading: true, error: null }));

      try {
        const ref = collection(db, 'listings');
        const constraints = buildConstraints(filters);

        const q = lastDocRef.current
          ? query(ref, ...constraints, startAfter(lastDocRef.current))
          : query(ref, ...constraints);

        const snap = await getDocs(q);

        // Ignore stale responses
        if (reqId !== activeRequestRef.current) return;

        const items = mapSnapshotToListings(snap);

        // Update cursor
        if (snap.docs.length > 0) {
          lastDocRef.current = snap.docs[snap.docs.length - 1];
        }

        setState((s) => {
          const nextResults = mode === 'append' ? [...s.results, ...items] : items;
          const more = snap.docs.length === pageSize;
          return { ...s, results: nextResults, loading: false, error: null, hasMore: more };
        });

        // Fallback: если cityAliases нет/пусто — пробуем точный city
        const city = safeTrim(filters.city);
        if (city && items.length === 0 && mode === 'replace') {
          lastDocRef.current = null;

          const exactConstraints: QueryConstraint[] = [where('city', '==', city)];

          // повторим priceRange в fallback
          const [minPrice, maxPrice] = filters.priceRange ?? [];
          if (typeof minPrice === 'number') exactConstraints.push(where('price', '>=', minPrice));
          if (typeof maxPrice === 'number') exactConstraints.push(where('price', '<=', maxPrice));

          // сортировка в fallback
          pushSortConstraints(exactConstraints, filters);

          exactConstraints.push(limit(pageSize));

          const exactQ = query(ref, ...exactConstraints);
          const exactSnap = await getDocs(exactQ);

          if (reqId !== activeRequestRef.current) return;

          const exactItems = mapSnapshotToListings(exactSnap);
          lastDocRef.current = exactSnap.docs.length ? exactSnap.docs[exactSnap.docs.length - 1] : null;

          setState((s) => ({
            ...s,
            results: exactItems,
            loading: false,
            error: null,
            hasMore: exactSnap.docs.length === pageSize,
          }));
        }
      } catch (err: unknown) {
        if (reqId !== activeRequestRef.current) return;

        const message = err instanceof Error ? err.message : 'Search failed';
        setState((s) => ({ ...s, loading: false, error: message }));
      }
    },
    [buildConstraints, pageSize]
  );

  const search = useCallback(
    async (filters: SearchFilters) => {
      lastDocRef.current = null;
      lastFiltersRef.current = filters;
      await runQuery(filters, 'replace');
    },
    [runQuery]
  );

  const loadMore = useCallback(async () => {
    if (!lastFiltersRef.current) return;
    if (state.loading || !state.hasMore) return;
    await runQuery(lastFiltersRef.current, 'append');
  }, [runQuery, state.loading, state.hasMore]);

  return useMemo(
    () => ({
      results: state.results,
      loading: state.loading,
      error: state.error,
      hasMore: state.hasMore,
      search,
      loadMore,
      reset,
    }),
    [state, search, loadMore, reset]
  );
}
