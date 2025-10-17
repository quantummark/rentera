'use client';

import '@/app/components/ui/i18n'; // инициализация i18n происходит ТОЛЬКО на клиенте

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
