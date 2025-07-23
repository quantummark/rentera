// app/query-client-wrapper.tsx
'use client'; // Этот компонент будет клиентским

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

import { ReactNode } from 'react';

export default function QueryClientWrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
