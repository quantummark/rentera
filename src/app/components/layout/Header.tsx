'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import UserMenu from '@/app/components/layout/UserMenu';
import { LanguageSwitcher } from '@/app/components/ui/LanguageSwitcher';
import { cn } from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { setTheme, theme } = useTheme();
  const { t } = useTranslation('nav');
  const { user } = useAuth();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  // закрываем мобильное меню при смене страницы
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // блокируем скролл, когда моб-меню открыто
  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, mounted]);

  const navLinks = useMemo(
    () => [
      { href: '/search', label: t('nav:search') },
      { href: '/messages', label: t('nav:messages') },
      { href: '/payments', label: t('nav:payments') },
      { href: '/contract', label: t('nav:contract') },
      { href: '/community', label: t('nav:community') },
      { href: '/support', label: t('nav:support') },
    ],
    [t]
  );

  if (!mounted) return null;

  const isDark = theme === 'dark';

  const isActiveLink = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const navBase =
    'relative px-3 py-2 rounded-full text-sm font-medium transition-all duration-200';
  const navInactive =
    'text-muted-foreground hover:text-foreground hover:bg-foreground/5';
  const navActive =
    'text-foreground bg-orange-500/10 ring-1 ring-orange-500/20 shadow-[0_0_0_1px_rgba(249,115,22,0.10)]';

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* “AMG glass” container */}
      <div
        className={cn(
          'relative border-b border-border/60',
          'rounded-xl md:rounded-2xl',
          'backdrop-blur-xl',
          isDark ? 'bg-zinc-950/70' : 'bg-background/70',
          'shadow-[0_10px_30px_-20px_rgba(0,0,0,0.45)]'
        )}
      >
        {/* subtle glow */}
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0',
            'bg-[radial-gradient(700px_circle_at_15%_20%,rgba(249,115,22,0.12),transparent_55%),radial-gradient(700px_circle_at_85%_25%,rgba(255,255,255,0.06),transparent_60%)]'
          )}
        />

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Left: burger + logo */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen((v) => !v)}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              <Link
                href="/"
                className={cn(
                  'text-lg md:text-xl font-bold tracking-[0.18em] uppercase',
                  'text-foreground'
                )}
              >
                <span className="relative">
                  Renterya
                  <span
                    aria-hidden
                    className="absolute -bottom-1 left-0 h-px w-full bg-orange-500/60"
                  />
                </span>
              </Link>
            </div>

            {/* Center: nav */}
            <nav className="hidden md:flex items-center gap-1">
              <div className="inline-flex items-center rounded-full border border-border/60 bg-background/40 px-1 py-1 backdrop-blur-md">
                {navLinks.map(({ href, label }) => {
                  const active = isActiveLink(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(navBase, active ? navActive : navInactive)}
                      aria-current={active ? 'page' : undefined}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Right: actions */}
            <div className="flex items-center gap-2 md:gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                aria-label="Toggle theme"
                className={cn(
                  'rounded-xl border border-border/60 bg-background/40 backdrop-blur-md',
                  'hover:bg-foreground/5'
                )}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              {/* Язык рядом с темой (и на мобилке тоже) */}
              <LanguageSwitcher />

              {user ? (
                <UserMenu />
              ) : (
                <Link
                  href="/login"
                  className={cn(
                    'text-sm font-medium',
                    'text-foreground/90 hover:text-foreground',
                    'rounded-xl border border-border/60 bg-background/40 px-3 py-2 backdrop-blur-md',
                    'transition-colors hover:bg-foreground/5'
                  )}
                >
                  {t('nav:login')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div
            className={cn(
              'border-b border-border/60 backdrop-blur-xl',
              isDark ? 'bg-zinc-950/80' : 'bg-background/80'
            )}
          >
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
              <nav className="grid gap-2">
                {navLinks.map(({ href, label }) => {
                  const active = isActiveLink(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        'flex items-center justify-between rounded-2xl border border-border/60 bg-background/40 px-4 py-3 text-sm backdrop-blur-md transition-all',
                        active
                          ? 'text-foreground ring-1 ring-orange-500/25 bg-orange-500/10'
                          : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                      )}
                      aria-current={active ? 'page' : undefined}
                    >
                      <span className="font-medium">{label}</span>
                      <span
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          active ? 'bg-orange-500' : 'bg-muted-foreground/40'
                        )}
                        aria-hidden
                      />
                    </Link>
                  );
                })}
              </nav>

              {!user && (
                <div className="mt-4">
                  <Link
                    href="/login"
                    className={cn(
                      'flex items-center justify-center rounded-2xl border border-border/60 bg-background/40 px-4 py-3 text-sm font-medium text-foreground backdrop-blur-md',
                      'hover:bg-foreground/5 transition-colors'
                    )}
                  >
                    {t('nav:login')}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* click outside overlay */}
          <button
            aria-label="Close menu overlay"
            className="fixed inset-0 z-[-1] cursor-default bg-black/20"
            onClick={() => setIsMenuOpen(false)}
          />
        </div>
      )}
    </header>
  );
}
