'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/ToastContext';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/app/firebase/firebase';
import { useTranslation } from 'react-i18next';

interface RentRequestButtonProps {
  listingId: string;
  ownerId: string;
}

type RequestStatus = 'none' | 'pending' | 'active' | 'signed';

export default function RentRequestButton({ listingId, ownerId }: RentRequestButtonProps) {
  const { t } = useTranslation('rentRequest');
  const [status, setStatus] = useState<RequestStatus>('none');
  const [loading, setLoading] = useState<boolean>(false);
  const { addToast } = useToast();

  // Текущий пользователь (арендатор)
  const currentUser = auth.currentUser;
  const renterId = currentUser?.uid;

  // Ссылка на документ Firestore или null, если не авторизован
  const requestDocRef = renterId ? doc(db, 'contracts', `${listingId}_${renterId}`) : null;

  // Проверяем существующий статус
  useEffect(() => {
    if (!requestDocRef) {
      setStatus('none');
      return;
    }
    (async () => {
      try {
        const snap = await getDoc(requestDocRef);
        if (!snap.exists()) {
          setStatus('none');
          return;
        }
        const data = snap.data();
        if (data.status === 'signed') setStatus('signed');
        else if (data.status === 'active') setStatus('active');
        else setStatus('pending');
      } catch (e) {
        // можно добавить лог/тост при желании
      }
    })();
  }, [requestDocRef]);

  if (!renterId) return null; // не показываем кнопку неавторизованным

  const handleClick = async () => {
    if (status === 'pending') {
      addToast({ title: t('toast.alreadySent.title'), description: t('toast.alreadySent.desc') });
      return;
    }

    setLoading(true);
    try {
      await setDoc(requestDocRef!, {
        listingId,
        ownerId,
        renterId,
        status: 'pending',
        requestDate: serverTimestamp(),
      });

      setStatus('pending');
      addToast({ title: t('toast.sent.title'), description: t('toast.sent.desc') });
    } catch (err) {
      addToast({ title: t('toast.error.title'), description: t('toast.error.desc') });
    } finally {
      setLoading(false);
    }
  };

  const labels: Record<RequestStatus, string> = {
    none: t('cta.rentOnline'),       // 💰 …
    pending: t('status.pending'),    // ⏳ …
    active: t('status.accepted'),    // ✅ …
    signed: t('status.signed')       // 📄 …
  };

  return (
    <Button
      className="w-full rounded-full bg-orange-500 hover:bg-orange-600 text-white"
      onClick={handleClick}
      disabled={loading || status !== 'none'}
      aria-label={labels[status]}
    >
      {labels[status]}
    </Button>
  );
}
