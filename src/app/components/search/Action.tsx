'use client';

import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Action() {
  const { theme } = useTheme();

  return (
    <section
      className={cn(
        'mt-16 rounded-2xl py-10 px-6 md:px-12 text-center space-y-6 shadow-md transition-colors',
        theme === 'dark' ? 'bg-zinc-900/50' : 'bg-orange-50'
      )}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-foreground">
        Сдаёте жильё? Или ищете аренду?
      </h2>

      <p className="text-muted-foreground text-lg">
        Присоединяйтесь к Rentera — создайте профиль арендатора или зарегистрируйтесь как владелец.
      </p>

      <div className="flex flex-col md:flex-row justify-center gap-4">
        <Link
          href="/login"
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-6 py-3 rounded-xl transition"
        >
          Создать профиль владельца
        </Link>

        <Link
          href="/login"
          className="bg-white dark:bg-zinc-800 border border-input text-foreground text-sm font-medium px-6 py-3 rounded-xl hover:bg-accent transition"
        >
          Создать профиль арендатора
        </Link>
      </div>
    </section>
  );
}
