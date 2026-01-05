'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit as limitQuery,
  onSnapshot,
  DocumentData,
  Query,
  FirestoreError,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';

// ===== типы =====

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'released'
  | 'failed'
  | 'canceled'
  | 'dispute';

export type PaymentMethod =
  | 'card'
  | 'crypto'
  | 'bank_transfer'
  | 'cash_temp';

export interface RentalPayment {
  contractId: string;
  listingId: string;

  renterUid: string;
  ownerUid: string;

  renterName?: string;
  ownerName?: string;
  listingTitle?: string;
  city?: string;

  currency: string;
  amountRent: number;
  amountPlatformFee: number;
  amountTotal: number;

  isFirstPayment?: boolean;

  periodStart: Timestamp;
  periodEnd: Timestamp;
  dueDate: Timestamp;

  status: PaymentStatus;
  method: PaymentMethod;
  provider?: string;
  providerInvoiceId?: string;
  providerPaymentId?: string;

  cryptoNetwork?: string;
  txHash?: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;
  paidAt?: Timestamp | null;
  releasedAt?: Timestamp | null;

  cancelReason?: string;
  notes?: string;
}

export interface RentalPaymentWithId extends RentalPayment {
  id: string;
}

type PaymentMode = 'renter' | 'owner' | 'contract';

export interface UseRentalPaymentsOptions {
  mode: PaymentMode;

  renterUid?: string;
  ownerUid?: string;
  contractId?: string;

  status?: PaymentStatus | 'activeOnly';
  limit?: number;
  orderByField?: 'dueDate' | 'createdAt';
}

export interface UseRentalPaymentsResult {
  payments: RentalPaymentWithId[];
  loading: boolean;
  error: FirestoreError | null;
}

// ===== основной хук =====

export function useRentalPayments(
  options: UseRentalPaymentsOptions,
): UseRentalPaymentsResult {
  const {
    mode,
    renterUid,
    ownerUid,
    contractId,
    status,
    limit,
    orderByField = 'dueDate',
  } = options;

  const [payments, setPayments] = useState<RentalPaymentWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const collectionRef = collection(db, 'rental_payments');
    let q: Query<DocumentData> = collectionRef;

    // --- фильтр по режиму ---
    if (mode === 'renter') {
      if (!renterUid) {
        // если почему-то не передали uid — просто очищаем и выходим
        setPayments([]);
        setLoading(false);
        return;
      }
      q = query(q, where('renterUid', '==', renterUid));
    }

    if (mode === 'owner') {
      if (!ownerUid) {
        setPayments([]);
        setLoading(false);
        return;
      }
      q = query(q, where('ownerUid', '==', ownerUid));
    }

    if (mode === 'contract') {
      if (!contractId) {
        setPayments([]);
        setLoading(false);
        return;
      }
      q = query(q, where('contractId', '==', contractId));
    }

    // --- фильтр по статусу ---
    if (status) {
      if (status === 'activeOnly') {
        // активные статусы: которые ещё "живые"
        // при необходимости список можно расширить
        q = query(
          q,
          where('status', 'in', ['pending', 'processing', 'paid']),
        );
      } else {
        q = query(q, where('status', '==', status));
      }
    }

    // --- сортировка ---
    // ВАЖНО: Firestore может попросить композитный индекс для комбинаций where+orderBy.
    q = query(q, orderBy(orderByField, 'asc'));

    // --- лимит ---
    if (limit && limit > 0) {
      q = query(q, limitQuery(limit));
    }

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const rows: RentalPaymentWithId[] = snapshot.docs.map(docSnap => {
          const data = docSnap.data() as RentalPayment;
          return {
            id: docSnap.id,
            ...data,
          };
        });

        setPayments(rows);
        setLoading(false);
      },
      (err: FirestoreError) => {
        // eslint-disable-next-line no-console
        console.error('useRentalPayments error:', err);
        setError(err);
        setLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [
    mode,
    renterUid,
    ownerUid,
    contractId,
    status,
    limit,
    orderByField,
  ]);

  return {
    payments,
    loading,
    error,
  };
}
