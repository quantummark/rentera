'use client';

import React, { createContext, useContext } from 'react';
import { useListingsSearch } from '@/hooks/useListingsSearch';

type ListingsSearchContextValue = ReturnType<typeof useListingsSearch>;

const ListingsSearchContext = createContext<ListingsSearchContextValue | null>(null);

export function ListingsSearchProvider({
  children,
  pageSize = 18,
}: {
  children: React.ReactNode;
  pageSize?: number;
}) {
  const value = useListingsSearch(pageSize);
  return (
    <ListingsSearchContext.Provider value={value}>
      {children}
    </ListingsSearchContext.Provider>
  );
}

export function useListingsSearchCtx() {
  const ctx = useContext(ListingsSearchContext);
  if (!ctx) throw new Error('useListingsSearchCtx must be used within ListingsSearchProvider');
  return ctx;
}
