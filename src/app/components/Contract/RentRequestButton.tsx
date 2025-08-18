'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/ToastContext'; // твой toast контекст
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';

interface RentRequestButtonProps {
  listingId: string;
  ownerId: string;
  renterId: string;
}

type RequestStatus = 'none' | 'pending' | 'accepted' | 'rejected';

export default function RentRequestButton({ listingId, ownerId, renterId }: RentRequestButtonProps) {
  const [status, setStatus] = useState<RequestStatus>('none');
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();

  const requestDocRef = doc(db, 'contracts', `${listingId}_${renterId}`);

  // Проверка существующего запроса
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const docSnap = await getDoc(requestDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data?.status) setStatus(data.status as RequestStatus);
        }
      } catch (err) {
        console.error('Ошибка при проверке статуса запроса:', err);
      }
    };
    fetchStatus();
  }, [requestDocRef]);

  const handleClick = async () => {
    if (status === 'pending') {
      addToast({ title: 'Запрос уже отправлен', description: 'Ждите ответа владельца.' });
      return;
    }

    setLoading(true);
    try {
      await setDoc(requestDocRef, {
        listingId,
        ownerId,
        renterId,
        status: 'pending',
        requestDate: serverTimestamp(),
      });

      setStatus('pending');
      addToast({ title: 'Запрос отправлен', description: 'Вы можете отслеживать его на странице договоров.' });
    } catch (err) {
      console.error('Ошибка при отправке запроса:', err);
      addToast({ title: 'Ошибка', description: 'Не удалось отправить запрос.' });
    } finally {
      setLoading(false);
    }
  };

  const buttonText = (() => {
    switch (status) {
      case 'none': return '💰 Арендовать онлайн';
      case 'pending': return '⏳ Запрос отправлен';
      case 'accepted': return '✅ Запрос принят';
      case 'rejected': return '❌ Запрос отклонён';
    }
  })();

  return (
    <Button
      className="bg-orange-500 hover:bg-orange-600 text-white w-full rounded-full"
      onClick={handleClick}
      disabled={loading || status === 'pending' || status === 'accepted'}
    >
      {buttonText}
    </Button>
  );
}
