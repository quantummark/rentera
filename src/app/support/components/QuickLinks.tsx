'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  Home,
  Search,
  CreditCard,
  FileSignature,
  Users,
  UserCircle
} from 'lucide-react';

type QuickLink = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

export default function QuickLinks() {
  const { t } = useTranslation(['support']);

  const links: QuickLink[] = [
    {
      href: '/help/how-to-rent-out',
      icon: <Home className="h-5 w-5" />,
      label: t('support:quickLinks.rentOut', 'Як здати житло')
    },
    {
      href: '/help/how-to-find',
      icon: <Search className="h-5 w-5" />,
      label: t('support:quickLinks.findHome', 'Як знайти житло')
    },
    {
      href: '/help/payments-and-subscription',
      icon: <CreditCard className="h-5 w-5" />,
      label: t('support:quickLinks.payments', 'Оплата та підписка')
    },
    {
      href: '/help/online-contract',
      icon: <FileSignature className="h-5 w-5" />,
      label: t('support:quickLinks.contract', 'Договір онлайн')
    },
    {
      href: '/help/community-post',
      icon: <Users className="h-5 w-5" />,
      label: t('support:quickLinks.community', 'Пости у комʼюніті')
    },
    {
      href: '/help/create-profile',
      icon: <UserCircle className="h-5 w-5" />,
      label: t('support:quickLinks.profile', 'Створення профілю')
    }
  ];

  return (
    <section className="rounded-2xl border bg-background/60 p-4 md:p-6 shadow-sm">
      <h2 className="mb-4 text-base md:text-lg font-semibold">
        {t('support:quickLinks.title', 'Швидкі дії')}
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 rounded-xl border bg-background p-3
                       text-sm font-medium shadow-sm transition
                       hover:shadow-md hover:-translate-y-0.5
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span
  className="flex h-8 w-8 shrink-0 items-center justify-center
             rounded-lg border bg-background shadow-sm"
>
  {link.icon}
</span>
            <span className="leading-tight">{link.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
