'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import UserMenu from '@/app/components/layout/UserMenu';
import { LanguageSwitcher } from '@/app/components/ui/LanguageSwitcher';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const navLinks = [
    { href: '/search', label: t('nav.search', 'Поиск') },
    { href: '/messages', label: t('nav.messages', 'Сообщения') },
    { href: '/payments', label: t('nav.payments', 'Платежи') },
    { href: '/contract', label: t('nav.contract', 'Договор') },
    { href: '/community', label: t('nav.community', 'Комьюнити') },
    { href: '/support', label: t('nav.support', 'Поддержка') },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border shadow-sm transition-colors rounded-b-2xl',
        resolvedTheme === 'dark' ? 'bg-zinc-900' : 'bg-white'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
            <Menu className="w-6 h-6 text-foreground" />
          </button>
          <Link
            href="/"
            className="text-xl font-bold font-logo text-primary tracking-widest uppercase"
          >
            Renterya
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-3 text-base font-medium">
  {navLinks.map(({ href, label }) => {
    const isActive =
      pathname === href || pathname.startsWith(`${href}/`);

    return (
      <Link
        key={href}
        href={href}
        className={cn(
          'relative px-3 py-2 rounded-full transition-colors duration-200',
          isActive
            ? 'bg-orange-100 text-orange-500 font-semibold'
            : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
        )}
        aria-current={isActive ? 'page' : undefined}
      >
        {label}
      </Link>
    );
  })}
</nav>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </Button>

          <LanguageSwitcher />

          {user ? (
            <UserMenu />
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-primary hover:underline"
            >
              {t('nav.login', 'Войти')}
            </Link>
          )}
        </div>
      </div>

      {isMenuOpen && (
  <div className="md:hidden px-4 pb-4">
    <nav className="flex flex-col space-y-3">
      {navLinks.map(({ href, label }) => {
        const isActive =
          pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'block px-3 py-2 rounded-full transition-colors duration-200',
              isActive
                ? 'bg-orange-100 text-orange-500 font-semibold'
                : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  </div>
)}
    </header>
  );
}
