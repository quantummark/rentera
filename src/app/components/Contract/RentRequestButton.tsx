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

export default function RentRequestButton({
  listingId,
  ownerId,
}: RentRequestButtonProps) {
  const [status, setStatus] = useState<RequestStatus>('none');
  const [loading, setLoading] = useState<boolean>(false);
  const { addToast } = useToast();

  // Текущий пользователь (арендатор)
  const currentUser = auth.currentUser;
  const renterId = currentUser?.uid;

  // Ссылка на документ Firestore или null, если не авторизован
  const requestDocRef = renterId
    ? doc(db, 'contracts', `${listingId}_${renterId}`)
    : null;

  // 1. Проверяем, был ли уже создан запрос (pending/active)
  useEffect(() => {
    if (!requestDocRef) {
      setStatus('none');
      return;
    }

    const fetchStatus = async () => {
      try {
        const docSnap = await getDoc(requestDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setStatus(data.status === 'active' ? 'active' : 'pending');
        } else {
          setStatus('none');
        }
      } catch (err: unknown) {
        console.error('Ошибка при проверке статуса запроса:', err);
      }
    };

    fetchStatus();
  }, [requestDocRef]);

  // 2. Отдельно проверяем, не подписан ли уже договор
  useEffect(() => {
    if (!requestDocRef) return;

    const checkSignedStatus = async () => {
      try {
        const docSnap = await getDoc(requestDocRef);
        if (docSnap.exists() && docSnap.data().status === 'signed') {
          setStatus('signed');
        }
      } catch (err: unknown) {
        console.error('Ошибка при проверке подписанного статуса:', err);
      }
    };

    checkSignedStatus();
  }, [requestDocRef]);

  // Если нет авторизованного пользователя — не рендерим кнопку
  if (!renterId) {
    return null;
  }

  // Отправка запроса на аренду
  const handleClick = async () => {
    if (status === 'pending') {
      addToast({
        title: 'Запрос уже отправлен',
        description: 'Ждите ответа владельца.',
      });
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
      addToast({
        title: 'Запрос отправлен',
        description: 'Вы можете отслеживать его на странице договоров.',
      });
    } catch (err: unknown) {
      console.error('Ошибка при отправке запроса:', err);
      addToast({ title: 'Ошибка', description: 'Не удалось отправить запрос.' });
    } finally {
      setLoading(false);
    }
  };

  // Выбор текста кнопки в зависимости от статуса
  let buttonText = '💰 Арендовать онлайн';
  if (status === 'pending') buttonText = '⏳ Запрос отправлен';
  if (status === 'active') buttonText = '✅ Принято';
  if (status === 'signed') buttonText = '📄 Договор подписан';

  return (
    <Button
      className="w-full rounded-full bg-orange-500 hover:bg-orange-600 text-white"
      onClick={handleClick}
      disabled={loading || status !== 'none'}
    >
      {buttonText}
    </Button>
  );
}