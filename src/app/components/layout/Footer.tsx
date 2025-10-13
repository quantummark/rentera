'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import {
  FaTelegramPlane,
  FaInstagram,
  FaLinkedinIn,
} from 'react-icons/fa';

export default function Footer() {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();

  return (
    <footer
      className={cn(
        'mt-20 px-6 md:px-12 py-10 text-sm transition-colors rounded-t-2xl',
        resolvedTheme === 'dark' ? 'bg-zinc-950 text-muted' : 'bg-orange-100 text-muted-foreground'
      )}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Навигация */}
        <div>
          <h4 className="font-semibold mb-2 text-foreground">{t('footer.navigation', 'Навигация')}</h4>
          <ul className="space-y-1">
            <li><Link href="/search">{t('nav.search', 'Поиск')}</Link></li>
            <li><Link href="/community">{t('nav.community', 'Комьюнити')}</Link></li>
            <li><Link href="/about">{t('nav.about', 'О нас')}</Link></li>
            <li><Link href="/support">{t('nav.support', 'Поддержка')}</Link></li>
          </ul>
        </div>

        {/* Информация */}
        <div>
          <h4 className="font-semibold mb-2 text-foreground">{t('footer.info', 'Информация')}</h4>
          <ul className="space-y-1">
            <li><Link href="/terms">{t('footer.terms', 'Условия использования')}</Link></li>
            <li><Link href="/privacy">{t('footer.privacy', 'Политика конфиденциальности')}</Link></li>
            <li><Link href="/faq">{t('footer.faq', 'Вопросы и ответы')}</Link></li>
          </ul>
        </div>

        {/* Контакты и соцсети */}
        <div>
          <h4 className="font-semibold mb-2 text-foreground">{t('footer.contacts', 'Контакты')}</h4>
          <ul className="space-y-1">
            <li>
              <a href="mailto:support@renterya.com" className="hover:underline">
                support@renterya.com
              </a>
            </li>
            <li className="flex gap-4 mt-3 text-xl">
              <Link href="https://t.me/renterya" target="_blank" aria-label="Telegram">
                <FaTelegramPlane className="hover:text-primary transition" />
              </Link>
              <Link href="https://instagram.com/renterya" target="_blank" aria-label="Instagram">
                <FaInstagram className="hover:text-primary transition" />
              </Link>
              <Link href="https://linkedin.com/company/renterya" target="_blank" aria-label="LinkedIn">
                <FaLinkedinIn className="hover:text-primary transition" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Логотип и копирайт */}
        <div className="flex flex-col justify-between items-start">
          <Link href="/" className="text-xl font-bold text-primary tracking-wider">
            RENTERYA
          </Link>
          <p className="mt-2 text-sm italic text-muted-foreground">
          Аренда без посредников — честно, удобно, надёжно.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            © 2025 Renterya. {t('footer.rights', 'Все права защищены.')}
          </p>
        </div>
      </div>
    </footer>
  );
}
