'use client';

import '@/app/lib/i18n'; // инициализация i18n происходит ТОЛЬКО на клиенте

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
