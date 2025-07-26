'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // Используем хук здесь
import { useTranslation } from 'react-i18next';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { useAuth } from '@/hooks/useAuth';

import ChatList from '@/app/components/chat/ChatList';
import { ChatWindow } from '@/app/components/chat/ChatWindow';

export default function MessagesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Получаем параметры запроса сразу внутри компонента
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get('userId');

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [selectedUserAvatar, setSelectedUserAvatar] = useState<string>('');

  // Открыть чат по ?userId (параметры URL)
  useEffect(() => {
    if (targetUserId && user?.uid && targetUserId !== user.uid) {
      setSelectedUserId(targetUserId);
    }
  }, [targetUserId, user?.uid]);

  // Убедиться, что чат существует
  useEffect(() => {
    const ensureChat = async () => {
      if (!user?.uid || !selectedUserId) return;
      const chatId = [user.uid, selectedUserId].sort().join('_');
      const ref = doc(db, 'chats', chatId);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          participants: [user.uid, selectedUserId],
          lastMessage: '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        // Также создаём сабколлекции users/.../chats
      }
    };
    ensureChat();
  }, [selectedUserId, user?.uid]);

  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <div className="flex flex-col md:flex-row h-[90vh]">
        {/* Список чатов */}
        <div
          className={`${
            selectedUserId ? 'hidden' : 'block'
          } w-full md:block md:w-1/3 bg-background overflow-auto`}
        >
          <ChatList
            selectedUserId={selectedUserId}
            onSelect={(id, name, avatar) => {
              setSelectedUserId(id);
              setSelectedUserName(name || '');
              setSelectedUserAvatar(avatar || '');
            }}
          />
        </div>

        {/* Окно чата */}
        <div
          className={`${
            selectedUserId ? 'block' : 'hidden'
          } w-full md:block md:flex-1 bg-background`}
        >
          {selectedUserId ? (
            <ChatWindow
              otherUserId={selectedUserId}
              otherUserName={selectedUserName}
              otherUserAvatar={selectedUserAvatar}
              onBack={() => setSelectedUserId(null)}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-base px-4">
              {t('messages.selectChat', 'Выберите чат, чтобы начать общение')}
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
}
