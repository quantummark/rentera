'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { FaTelegramPlane, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { ShieldCheck, FileSignature, Headset, Globe } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation('footer');
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === 'dark';

  const linkClass =
    'inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground';
  const fancyUnderline =
    'relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-orange-500 after:transition-transform after:duration-200 hover:after:scale-x-100';

  const socialBtn =
    'inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-background/40 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-orange-500/50 hover:bg-orange-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40';

  return (
    <footer className="mt-20">
      <div
        className={cn(
          'relative overflow-hidden rounded-t-3xl border-t border-border/70 px-6 md:px-12 pt-12 pb-6',
          'bg-gradient-to-b',
          isDark ? 'from-zinc-950 to-black' : 'from-background to-background/70'
        )}
      >
        {/* subtle glow / texture */}
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0',
            'bg-[radial-gradient(800px_circle_at_20%_20%,rgba(249,115,22,0.14),transparent_55%),radial-gradient(700px_circle_at_85%_25%,rgba(255,255,255,0.06),transparent_60%),radial-gradient(900px_circle_at_50%_120%,rgba(249,115,22,0.10),transparent_55%)]'
          )}
        />

        <div className="relative max-w-7xl mx-auto">
          {/* верхняя сетка */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            {/* Навигация */}
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-foreground">
                {t('footer:navigation')}
              </h4>

              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/search" className={cn(linkClass, fancyUnderline)}>
                    {t('footer:nav.search')}
                  </Link>
                </li>
                <li>
                  <Link href="/community" className={cn(linkClass, fancyUnderline)}>
                    {t('footer:nav.community')}
                  </Link>
                </li>
                <li>
                  <Link href="/about" className={cn(linkClass, fancyUnderline)}>
                    {t('footer:nav.about')}
                  </Link>
                </li>
                <li>
                  <Link href="/support" className={cn(linkClass, fancyUnderline)}>
                    {t('footer:nav.support')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Информация */}
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-foreground">
                {t('footer:info')}
              </h4>

              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/terms" className={cn(linkClass, fancyUnderline)}>
                    {t('footer:terms')}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className={cn(linkClass, fancyUnderline)}>
                    {t('footer:privacy')}
                  </Link>
                </li>
                <li>
                  <Link href="/support/help" className={cn(linkClass, fancyUnderline)}>
                    {t('footer:faq')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Контакты и соцсети */}
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-foreground">
                {t('footer:contacts')}
              </h4>

              <div className="mt-4 space-y-3">
                <a href="mailto:support@renterya.com" className={cn(linkClass, fancyUnderline)}>
                  support@renterya.com
                </a>

                <div className="flex items-center gap-3 pt-1">
                  <Link
                    href="https://t.me/renterya"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Telegram"
                    className={socialBtn}
                  >
                    <FaTelegramPlane className="text-lg" />
                  </Link>

                  <Link
                    href="https://instagram.com/renterya"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className={socialBtn}
                  >
                    <FaInstagram className="text-lg" />
                  </Link>

                  <Link
                    href="https://linkedin.com/company/renterya"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className={socialBtn}
                  >
                    <FaLinkedinIn className="text-lg" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Бренд */}
            <div className="flex flex-col justify-between">
              <div>
                <Link
  href="/"
  className={cn(
  'group relative text-xl md:text-2xl font-semibold tracking-[0.04em]',
  'text-foreground transition-colors duration-300 hover:text-orange-500'
)}
>
  <span className="relative inline-block">
    Renterya

    <span
      aria-hidden
      className={cn(
        'absolute -bottom-1 left-1/2 h-px',
        'w-[70%] -translate-x-1/2',        // 70% ширины, центрировано
        'bg-orange-500/80',
        'transition-all duration-300 ease-out',
        'group-hover:w-full'               // плавно до 100%
      )}
    />
  </span>
</Link>

                <p className="mt-4 max-w-xs text-sm text-muted-foreground leading-relaxed">
                  {t('footer:slogan')}
                </p>
              </div>

              <div className="mt-8">
                <div className="inline-flex items-center gap-2 rounded-2xl border border-border/60 bg-background/30 px-3 py-2 text-xs text-muted-foreground backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500/80" />
                  <span>{t('footer:kyivUkraine')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* нижняя trust-полоса */}
          <div className="mt-10 border-t border-border/60 pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* копирайт */}
              <p className="text-xs text-muted-foreground">
                © 2026 Renterya. {t('footer:rights')}
              </p>

              {/* trust strip */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-muted-foreground backdrop-blur-md">
                  <ShieldCheck className="h-4 w-4 text-orange-500 drop-shadow-[0_0_6px_rgba(249,115,22,0.45)]" />
                  {t('footer:noRealtors')}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-muted-foreground backdrop-blur-md">
                  <FileSignature className="h-4 w-4 text-indigo-400 drop-shadow-[0_0_6px_rgba(129,140,248,0.45)]" />
                  {t('footer:onlineContract')}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-muted-foreground backdrop-blur-md">
                  <Globe className="h-4 w-4 text-blue-400 drop-shadow-[0_0_6px_rgba(59,130,246,0.45)]" />
                  {t('footer:community')}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-muted-foreground backdrop-blur-md">
                  <Headset className="h-4 w-4 text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.45)]" />
                  {t('footer:support247')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
