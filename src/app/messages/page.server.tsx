// app/messages/page.tsx
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const MessagesClient = dynamic(
  () => import('./page'),
  {
    ssr: false,
    loading: () => <div>Loading messages…</div>
  }
);

export default function MessagesPage() {
  return (
    <Suspense fallback={<div>Loading messages...</div>}>
      <MessagesClient />
    </Suspense>
  );
}
