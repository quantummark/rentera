'use client';

import { useEffect, useState } from 'react';
import { db } from '@/app/firebase/firebase';
import { doc, setDoc, updateDoc, Timestamp, onSnapshot } from 'firebase/firestore';
import { useAuth } from './useAuth';
import sha256 from 'crypto-js/sha256';

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

  useEffect(() => {
    if (!agreementId) return;

    const unsub = onSnapshot(doc(db, 'agreements', agreementId), (docSnap) => {
      if (docSnap.exists()) {
        setAgreement(docSnap.data() as Agreement);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [agreementId]);

  const createAgreement = async (newAgreement: Omit<Agreement, 'id' | 'createdAt' | 'updatedAt' | 'auditLog'>) => {
    if (!user) throw new Error('No user logged in');
    const id = doc(db, 'agreements').id; // создаём уникальный ID
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
          ip: '0.0.0.0', // потом можно динамически подставлять IP
          hash,
        },
      ],
    };

    await setDoc(doc(db, 'agreements', id), agreementData);
    return id;
  };

  const updateAgreement = async (updates: Partial<Agreement>, action: string) => {
    if (!agreement || !user) return;
    const timestamp = Timestamp.now();
    const hash = sha256(JSON.stringify(updates)).toString();

    await updateDoc(doc(db, 'agreements', agreement.id), {
      ...updates,
      updatedAt: timestamp,
      auditLog: [
        ...(agreement.auditLog || []),
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

  const signAgreement = async (role: UserType, signatureUrl: string) => {
    if (!agreement || !user) return;
    const signatureData: SignatureData = {
      signatureUrl,
      signedAt: Timestamp.now(),
    };

    const participantKey = role === 'owner' ? 'owner' : 'renter';
    await updateAgreement(
      {
        [participantKey]: {
          ...agreement[participantKey],
          signatureData,
        },
      } as Partial<Agreement>,
      'sign'
    );

    // Если оба подписали, меняем статус на active
    const updatedAgreement = {
      ...agreement,
      [participantKey]: {
        ...agreement[participantKey],
        signatureData,
      },
    } as Agreement;

    if (updatedAgreement.owner.signatureData && updatedAgreement.renter.signatureData) {
      await updateAgreement({ status: 'active' }, 'activate');
    }
  };

  return { agreement, loading, createAgreement, updateAgreement, signAgreement };
}
