'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FirestoreError } from 'firebase/firestore';

import { cn } from '@/lib/utils';
import { useUserTypeWithProfile } from '@/hooks/useUserType';
import { useRentalPayments } from '@/hooks/useRentalPayments';

import PaymentsHeader from './PaymentsHeader';
import BaseEmptyState from './BaseEmptyState';

type UserRole = 'owner' | 'renter';
type PageMode = 'contract' | 'dashboard';

type PaymentsPageProps =
  | { mode: 'dashboard'; contractId?: never; className?: string }
  | { mode: 'contract'; contractId: string; className?: string };

function safeString(value: string | null | undefined): string {
  return (value ?? '').trim();
}

export default function PaymentsPage(props: PaymentsPageProps) {
  const { t } = useTranslation(['payments', 'common']);

  const [userType, userProfile, userLoading] = useUserTypeWithProfile();

  const uid = userProfile?.uid ?? '';
  const role = (userType === 'owner' || userType === 'renter' ? userType : null) as UserRole | null;

  const pageMode: PageMode = props.mode;
  const contractId = pageMode === 'contract' ? safeString(props.contractId) : '';

  const paymentsQuery = useMemo(() => {
    if (!role || !uid) {
      // режим "нет данных" — хук внутри сам корректно завершится
      return {
        mode: 'renter' as const,
        renterUid: '',
        ownerUid: '',
        contractId: '',
        limit: 50,
        orderByField: 'dueDate' as const,
      };
    }

    if (pageMode === 'contract' && contractId) {
      return {
        mode: 'contract' as const,
        contractId,
        limit: 50,
        orderByField: 'dueDate' as const,
      };
    }

    if (role === 'owner') {
      return {
        mode: 'owner' as const,
        ownerUid: uid,
        limit: 50,
        orderByField: 'dueDate' as const,
      };
    }

    return {
      mode: 'renter' as const,
      renterUid: uid,
      limit: 50,
      orderByField: 'dueDate' as const,
    };
  }, [role, uid, pageMode, contractId]);

  // TODO: лучше типизировать useRentalPayments, но пока оставим минимум правок
  const { payments, loading: paymentsLoading, error: paymentsError } = useRentalPayments(paymentsQuery as any);

  const isAuthReady = !userLoading;
  const isSignedIn = Boolean(uid);
  const isRoleReady = Boolean(role);

  const showBaseEmpty =
    isAuthReady &&
    isSignedIn &&
    isRoleReady &&
    pageMode === 'dashboard' &&
    !paymentsLoading &&
    !paymentsError &&
    payments.length === 0;

  return (
    <main className="min-h-screen w-full">
      <div
        className={cn(
          'mx-auto w-full max-w-6xl px-3 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8',
          props.className
        )}
      >
        <PaymentsHeader
          mode={pageMode}
          role={role ?? 'renter'}
          contractId={pageMode === 'contract' && contractId ? contractId : undefined}
        />

        {/* Loading пользователя */}
        {userLoading && (
          <div className="mt-4 rounded-2xl border border-slate-200/70 bg-white/40 px-4 py-3 text-sm text-muted-foreground dark:border-slate-800/70 dark:bg-background-dark">
            {t('common:loading')}
          </div>
        )}

        {/* Не залогинен */}
        {!userLoading && !isSignedIn && (
          <div className="mt-4 rounded-2xl border border-slate-200/70 bg-white/40 px-4 py-4 text-sm text-muted-foreground dark:border-slate-800/70 dark:bg-background-dark">
            {t('payments:authRequired') ?? 'Увійдіть у акаунт, щоб переглядати платежі.'}
          </div>
        )}

        {/* Роль не определилась */}
        {!userLoading && isSignedIn && !isRoleReady && (
          <div className="mt-4 rounded-2xl border border-amber-200/70 bg-amber-50/80 px-4 py-4 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
            {t('payments:roleUnknown') ?? 'Не вдалося визначити роль користувача. Спробуйте оновити сторінку.'}
          </div>
        )}

        {/* Ошибка платежей */}
        {isAuthReady && isSignedIn && isRoleReady && paymentsError && (
          <PaymentsErrorBlock
            error={paymentsError}
            fallbackText={t('payments:errorGeneric') ?? 'Не вдалося завантажити платежі. Спробуйте оновити сторінку.'}
          />
        )}

        {/* Загрузка платежей */}
        {isAuthReady && isSignedIn && isRoleReady && paymentsLoading && (
          <div className="mt-4 space-y-2">
            <div className="h-20 w-full animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/60" />
            <div className="h-20 w-full animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/60" />
            <div className="h-20 w-full animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/60" />
          </div>
        )}

        {/* Пусто (дашборд) */}
        {showBaseEmpty && (
          <div className="mt-6">
            <BaseEmptyState role={role!} />
          </div>
        )}

        {/* Реальные данные */}
        {isAuthReady &&
          isSignedIn &&
          isRoleReady &&
          !paymentsLoading &&
          !paymentsError &&
          payments.length > 0 && (
            <section className="mt-6 space-y-3">
              <div className="text-xs text-muted-foreground">
                {pageMode === 'contract'
                  ? t('payments:contract.listTitle') ?? 'Платежі за цим договором'
                  : t('payments:dashboard.listTitle') ?? 'Усі платежі'}
              </div>

              <div className="space-y-3">
                {payments.map((p) => (
                  <article
                    key={p.id}
                    className={cn(
                      'w-full rounded-2xl border border-slate-200/70 bg-white/50 p-4 backdrop-blur',
                      'dark:border-slate-800/70 dark:bg-background-dark'
                    )}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground">
                          {p.listingTitle || t('payments:labels.listingFallback') || 'Об’єкт'}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {p.city ? `${p.city} · ` : ''}
                          {t('payments:labels.contract') ?? 'Contract'}: {p.contractId}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {t('payments:labels.period') ?? 'Період'}:{' '}
                          {formatDateSafe(p.periodStart)} – {formatDateSafe(p.periodEnd)}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="text-sm font-semibold text-foreground">
                          {formatMoney(p.amountTotal, p.currency)}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {t('payments:labels.due') ?? 'До'}: {formatDateSafe(p.dueDate)}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {t('payments:labels.status') ?? 'Статус'}: {p.status}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
      </div>
    </main>
  );
}

function PaymentsErrorBlock({
  error,
  fallbackText,
}: {
  error: FirestoreError;
  fallbackText: string;
}) {
  const details = (error?.message || '').slice(0, 220);

  return (
    <div className="mt-4 rounded-2xl border border-red-200/70 bg-red-50/80 px-4 py-4 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
      <div className="font-medium">{fallbackText}</div>
      {details && <div className="mt-1 text-xs opacity-90">{details}</div>}
    </div>
  );
}

// Если у тебя value = Firestore Timestamp — отлично, если нет — вернёт ''
function formatDateSafe(value: unknown): string {
  try {
    if (!value || typeof value !== 'object') return '';
    const maybe = value as { toDate?: () => Date };
    if (typeof maybe.toDate !== 'function') return '';
    return maybe.toDate().toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}

function formatMoney(amount: number, currency?: string): string {
  const safeCurrency = (currency || 'USD').toUpperCase();
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: safeCurrency,
      maximumFractionDigits: 0,
    }).format(amount ?? 0);
  } catch {
    return `${amount ?? 0} ${safeCurrency}`;
  }
}
