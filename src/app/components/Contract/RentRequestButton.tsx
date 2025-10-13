'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/ToastContext';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/app/firebase/firebase';

interface RentRequestButtonProps {
  listingId: string;
  ownerId: string;
}

type RequestStatus = 'none' | 'pending' | 'active' | 'signed';

export default function RentRequestButton({ listingId, ownerId }: RentRequestButtonProps) {
  const [status, setStatus] = useState<RequestStatus>('none');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const currentUser = auth.currentUser;
  const renterId = currentUser?.uid;

  if (!renterId) return null; // скрываем кнопку если не авторизован

  const requestDocRef = doc(db, 'contracts', `${listingId}_${renterId}`);

  // Проверка статуса запроса
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const docSnap = await getDoc(requestDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.status === 'active') setStatus('active');
          else setStatus('pending');
        }
      } catch (err) {
        console.error('Ошибка при проверке статуса запроса:', err);
      }
    };
    fetchStatus();
  }, [requestDocRef]);

  // Если в колекции status: signed, меняем кнопку на "Договор подписан"
  useEffect(() => {
  // Зависимость всегда одна — requestDocRef
  if (!requestDocRef) return;

  const checkSignedStatus = async () => {
    try {
      const docSnap = await getDoc(requestDocRef);
      if (docSnap.exists() && docSnap.data().status === 'signed') {
        setStatus('signed');
      }
    } catch (err) {
      console.error('Ошибка при проверке статуса:', err);
    }
  };

  checkSignedStatus();
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

  let buttonText = '💰 Арендовать онлайн';
  if (status === 'pending') buttonText = '⏳ Запрос отправлен';
  if (status === 'active') buttonText = '✅ Принято';
  if (status === 'signed') buttonText = '📄 Договор подписан'; 

  return (
    <Button
      className={`w-full rounded-full bg-orange-500 hover:bg-orange-600 text-white`}
      onClick={handleClick}
      disabled={loading || status !== 'none'}
    >
      {buttonText}
    </Button>
  );
}
