'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

type UserRole = 'owner' | 'renter';
type PageMode = 'contract' | 'dashboard';

interface PaymentsHeaderProps {
  mode: PageMode;
  role: UserRole;
  contractId?: string;
  className?: string;

  // На будущее (когда подтянешь contract info):
  listingTitle?: string;
  city?: string;
  counterpartyName?: string; // ownerName for renter / renterName for owner
}

function safeTrim(value?: string): string {
  return (value ?? '').trim();
}

export default function PaymentsHeader({
  mode,
  role,
  contractId,
  className,
  listingTitle,
  city,
  counterpartyName,
}: PaymentsHeaderProps) {
  const { t } = useTranslation(['payments', 'common']);

  const isContractMode = mode === 'contract' && Boolean(safeTrim(contractId));

  const title = useMemo(() => {
    if (isContractMode) {
      return role === 'owner'
        ? t('payments:header.contractOwnerTitle')
        : t('payments:header.contractRenterTitle');
    }

    return role === 'owner'
      ? t('payments:header.dashboardOwnerTitle')
      : t('payments:header.dashboardRenterTitle');
  }, [isContractMode, role, t]);

  const subtitle = useMemo(() => {
    if (!isContractMode) {
      return role === 'owner'
        ? t('payments:header.dashboardOwnerSubtitle')
        : t('payments:header.dashboardRenterSubtitle');
    }

    // Contract mode — если у нас есть детали, показываем красиво,
    // если нет — показываем нейтральную подсказку.
    const parts: string[] = [];

    const titleSafe = safeTrim(listingTitle);
    const citySafe = safeTrim(city);
    const nameSafe = safeTrim(counterpartyName);

    if (titleSafe) parts.push(titleSafe);
    if (citySafe) parts.push(citySafe);

    if (nameSafe) {
      const who =
        role === 'owner'
          ? t('payments:header.renterLabel')
          : t('payments:header.ownerLabel');
      parts.push(`${who}: ${nameSafe}`);
    }

    if (parts.length > 0) {
      return parts.join(' · ');
    }

    return role === 'owner'
      ? t('payments:header.contractOwnerSubtitle')
      : t('payments:header.contractRenterSubtitle');
  }, [isContractMode, role, t, listingTitle, city, counterpartyName]);

  const backHref = '/payments';
  const backLabel = t('payments:header.backToAll') ?? t('common:back') ?? 'Назад';

  return (
    <header
      className={cn(
        'w-full rounded-3xl border border-white/60 dark:border-white/10',
        'bg-white/5 dark:bg-background-dark backdrop-blur shadow-sm',
        'px-4 sm:px-6 md:px-8 py-4 sm:py-5',
        className,
      )}
    >
      <div className="flex flex-col gap-3">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/70 bg-white/60 text-slate-700 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/60 dark:text-slate-200">
                <CreditCard className="h-5 w-5" aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-base sm:text-lg font-semibold text-foreground">
                  {title}
                </h1>
                <p className="mt-0.5 truncate text-xs sm:text-sm text-muted-foreground">
                  {subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isContractMode && (
              <Link
                href={backHref}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium transition',
                  'border border-slate-200/70 dark:border-slate-800/70',
                  'bg-white/50 dark:bg-slate-900/50 text-foreground hover:bg-white/70 dark:hover:bg-slate-900/70',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                )}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">{backLabel}</span>
                <span className="sm:hidden">{t('common:back') ?? 'Назад'}</span>
              </Link>
            )}
          </div>
        </div>

        {/* Contract helper line (optional) */}
        {isContractMode && (
          <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-muted-foreground">
            <span className="rounded-full border border-slate-200/70 bg-white/40 px-2 py-0.5 dark:border-slate-800/70 dark:bg-slate-900/40">
              {t('payments:header.contractLabel') ?? 'Договір'}
            </span>
            <span className="truncate">
              {contractId}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
