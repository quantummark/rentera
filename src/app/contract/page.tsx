'use client';

import { useUserTypeWithProfile } from '@/hooks/useUserType';
import { useContracts } from '@/hooks/useContracts';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function ContractsLanding() {
  const [userType] = useUserTypeWithProfile();
  const { contracts, loading } = useContracts();

  if (!userType) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <p>Сначала нужно войти в аккаунт</p>
        <Link href="/login">
          <Button>Войти</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Мои договоры</h1>

      {contracts.length === 0 ? (
        <div className="text-center py-20 border rounded-xl">
          <p className="mb-4 text-lg">У вас пока нет активных договоров.</p>
          <p className="mb-6 text-sm text-muted-foreground">
            Здесь будут отображаться все ваши документы и статус аренды.
          </p>
          <Link href="/search">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 text-sm font-medium">
              Начать поиск жилья
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {contracts.map((c) => (
            <Link
              key={c.id}
              href={`/contract/${c.id}`}
              className="p-4 border rounded-xl hover:shadow-md transition"
            >
              <p>
                <strong>Договор:</strong> {c.id}
              </p>
              <p>
                <strong>Статус:</strong> {c.status}
              </p>
              <p>
                <strong>Дата запроса:</strong> {new Date(c.requestDate).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
