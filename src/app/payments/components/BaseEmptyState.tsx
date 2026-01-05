'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, FileText, Search, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type UserRole = 'owner' | 'renter';

interface BaseEmptyStateProps {
  role: UserRole;
  className?: string;

  // Если захочешь — позже можно переопределять ссылки извне
  contractsHref?: string;
  renterCtaHref?: string;
  ownerCtaHref?: string;
}

export default function BaseEmptyState({
  role,
  className,
  contractsHref = '/contract',
  renterCtaHref = '/search',
  ownerCtaHref = '/listings/new',
}: BaseEmptyStateProps) {
  const { t } = useTranslation(['payments', 'common']);

  const isOwner = role === 'owner';

  const title = useMemo(() => {
    return isOwner
      ? t('payments:empty.owner.title')
      : t('payments:empty.renter.title');
  }, [isOwner, t]);

  const description = useMemo(() => {
    return isOwner
      ? t('payments:empty.owner.description')
      : t('payments:empty.renter.description');
  }, [isOwner, t]);

  const stepsTitle = useMemo(() => {
    return t('payments:empty.stepsTitle');
  }, [t]);

  const steps = useMemo(() => {
    if (isOwner) {
      return [
        {
          icon: PlusCircle,
          title: t('payments:empty.owner.steps.0.title'),
          text: t('payments:empty.owner.steps.0.text'),
        },
        {
          icon: FileText,
          title: t('payments:empty.owner.steps.1.title'),
          text: t('payments:empty.owner.steps.1.text'),
        },
        {
          icon: CreditCard,
          title: t('payments:empty.owner.steps.2.title'),
          text: t('payments:empty.owner.steps.2.text'),
        },
      ];
    }

    return [
      {
        icon: Search,
        title: t('payments:empty.renter.steps.0.title'),
        text: t('payments:empty.renter.steps.0.text'),
      },
      {
        icon: FileText,
        title: t('payments:empty.renter.steps.1.title'),
        text: t('payments:empty.renter.steps.1.text'),
      },
      {
        icon: CreditCard,
        title: t('payments:empty.renter.steps.2.title'),
        text: t('payments:empty.renter.steps.2.text'),
      },
    ];
  }, [isOwner, t]);

  const primaryCta = useMemo(() => {
    if (isOwner) {
      return {
        href: ownerCtaHref,
        label: t('payments:empty.owner.primaryCta'),
        Icon: PlusCircle,
      };
    }
    return {
      href: renterCtaHref,
      label: t('payments:empty.renter.primaryCta'),
      Icon: Search,
    };
  }, [isOwner, ownerCtaHref, renterCtaHref, t]);

  const secondaryCta = useMemo(() => {
    return {
      href: contractsHref,
      label: t('payments:empty.secondaryCta'),
      Icon: FileText,
    };
  }, [contractsHref, t]);

  return (
    <section
      className={cn(
        'w-full rounded-3xl border border-white/60 dark:border-white/10',
        'bg-white/5 dark:bg-background-dark backdrop-blur shadow-sm',
        'px-4 sm:px-6 md:px-8 py-6 sm:py-7 md:py-8',
        className,
      )}
    >
      <div className="flex flex-col gap-6">
        {/* Top */}
        <div className="flex items-start gap-3">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/70 bg-white/60 text-slate-700 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/60 dark:text-slate-200">
            <CreditCard className="h-5 w-5" aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {stepsTitle}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={`${idx}-${step.title}`}
                  className={cn(
                    'rounded-2xl border border-slate-200/70 dark:border-slate-800/70',
                    'bg-white/50 dark:bg-slate-900/40',
                    'px-4 py-4',
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70 text-slate-700 dark:text-slate-200">
                      <StepIcon className="h-5 w-5" aria-hidden="true" />
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground">
                        {step.title}
                      </div>
                      <div className="mt-1 text-xs sm:text-sm text-muted-foreground">
                        {step.text}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Link
            href={primaryCta.href}
            className={cn(
              'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition',
              'bg-orange-500 text-white hover:bg-orange-600',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            )}
          >
            <primaryCta.Icon className="h-4 w-4" aria-hidden="true" />
            <span>{primaryCta.label}</span>
          </Link>

          <Link
            href={secondaryCta.href}
            className={cn(
              'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition',
              'border border-slate-200/70 dark:border-slate-800/70',
              'bg-white/40 dark:bg-slate-900/40 text-foreground hover:bg-white/60 dark:hover:bg-slate-900/60',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            )}
          >
            <secondaryCta.Icon className="h-4 w-4" aria-hidden="true" />
            <span>{secondaryCta.label}</span>
          </Link>

          <div className="sm:ml-auto text-[11px] sm:text-xs text-muted-foreground self-center">
            {t('payments:empty.hint') ?? t('common:tip') ?? ''}
          </div>
        </div>
      </div>
    </section>
  );
}
