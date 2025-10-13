'use client';

import { useEffect, useState, useCallback } from 'react';
import { db } from '@/app/firebase/firebase';
import { doc, setDoc, updateDoc, Timestamp, onSnapshot } from 'firebase/firestore';
import { useAuth } from './useAuth';
import sha256 from 'crypto-js/sha256';
import debounce from 'lodash/debounce';

export type UserType = 'owner' | 'renter';

export interface SignatureData {
  signatureUrl: string; // base64 или ссылка на изображение
  signedAt: Timestamp;
}

export interface ParticipantData {
  fullName: string;
  phone: string;
  email: string;
  signatureData: SignatureData | null;
  profileImageUrl: string;
  id: string;
}

export type AgreementStatus = 'pending' | 'active' | 'declined';

export interface Agreement {
  id: string;
  listingId: string;
  owner: ParticipantData;
  renter: ParticipantData;
  rentAmount: number;
  rentDuration: string;
  insurance: boolean;
  status: AgreementStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  auditLog: Array<{
    action: string;
    userId: string;
    timestamp: Timestamp;
    ip: string;
    hash: string;
  }>;
}

export function useAgreement(agreementId: string) {
  const { user } = useAuth();
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [loading, setLoading] = useState(true);

  // -------------------------------
  // Подписка на документ Firestore
  // -------------------------------
  useEffect(() => {
    if (!agreementId) return;

    setLoading(true);

    const unsub = onSnapshot(
      doc(db, 'contracts', agreementId),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as Agreement;
          setAgreement(data);
        } else {
          setAgreement(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Ошибка загрузки договора:', error);
        setAgreement(null);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [agreementId]);

  

  // -------------------------------
  // Создание договора
  // -------------------------------
  const createAgreement = async (newAgreement: Omit<Agreement, 'id' | 'createdAt' | 'updatedAt' | 'auditLog'>) => {
    if (!user) throw new Error('No user logged in');
    const id = doc(db, 'contracts').id;
    const timestamp = Timestamp.now();
    const hash = sha256(JSON.stringify(newAgreement)).toString();

    const agreementData: Agreement = {
      ...newAgreement,
      id,
      status: 'pending',
      createdAt: timestamp,
      updatedAt: timestamp,
      auditLog: [
        {
          action: 'create',
          userId: user.uid,
          timestamp,
          ip: '0.0.0.0',
          hash,
        },
      ],
    };

    await setDoc(doc(db, 'contracts', id), agreementData);
    return id;
  };

  // -------------------------------
  // Обновление договора с дебаунсом
  // -------------------------------
  const _updateAgreement = async (updates: Partial<Agreement>, action: string) => {
  if (!agreement || !user || !agreement.id) return;

  const timestamp = Timestamp.now();
  const hash = sha256(JSON.stringify(updates)).toString();

  // Чистим updates от undefined
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, v]) => v !== undefined)
  );

  const currentAuditLog = Array.isArray(agreement.auditLog) ? agreement.auditLog : [];

  await updateDoc(doc(db, 'contracts', agreement.id), {
    ...cleanUpdates,
    updatedAt: timestamp,
    auditLog: [
      ...currentAuditLog,
      {
        action,
        userId: user.uid,
        timestamp,
        ip: '0.0.0.0',
        hash,
      },
    ],
  });
};

  // Debounce, чтобы не слать каждое изменение мгновенно
  const updateAgreement = useCallback(
    debounce(async (updates: Partial<Agreement>, action: string) => {
      await _updateAgreement(updates, action);
    }, 1000), // 1 секунда задержки
    [agreement, user]
  );

  // -------------------------------
// Подпись договора (для обоих участников)
// -------------------------------
const signAgreement = async (role: UserType, signatureUrl: string) => {
  if (!agreement || !user) return;

  const signatureData: SignatureData = {
    signatureUrl,
    signedAt: Timestamp.now(),
  };

  const participantKey = role === 'owner' ? 'owner' : 'renter';

  // Обновляем локально безопасно
  setAgreement((prev) =>
    prev
      ? {
          ...prev,
          [participantKey]: {
            ...prev[participantKey],
            signatureData,
          },
        }
      : prev
  );

  // Берём текущие данные участника безопасно
  const participantData = agreement[participantKey] || {};

  // Отправляем в Firestore
  updateAgreement(
    {
      [participantKey]: { ...participantData, signatureData },
    } as Partial<Agreement>,
    'sign'
  );
};

// -------------------------------
// Принятие или отклонение запроса владельцем
// -------------------------------
const respondToRequest = async (newStatus: 'active' | 'declined') => {
  if (!agreement || !user) return;

  try {
    const contractRef = doc(db, 'contracts', agreementId);

    // Обновляем статус и дату последнего обновления
    await updateDoc(contractRef, {
      status: newStatus,
      updatedAt: Timestamp.now(),
    });

    // Локально синхронизируем UI
    setAgreement((prev) => (prev ? { ...prev, status: newStatus } : prev));

  } catch (error) {
    console.error('Ошибка обновления статуса договора:', error);
  }
};



return { agreement, loading, createAgreement, updateAgreement, signAgreement, respondToRequest };
}
