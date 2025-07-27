'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { useAuth } from '@/hooks/useAuth';

interface ChatWindowProps {
  otherUserId: string;
  otherUserName?: string;
  otherUserAvatar?: string;
  onBack?: () => void; // функция для возврата назад
}

// Динамические импорты компонентов
const ChatList = dynamic(
  () => import('@/app/components/chat/ChatList'),
  {
    ssr: false,
    // Можно оставить Suspense вместо loading, но здесь покажем простой лоадер
    loading: () => <div className="p-4 text-center">Загрузка списка…</div>,
  }
);

const ChatWindow = dynamic<ChatWindowProps>(
  () =>
    import('@/app/components/chat/ChatWindow')
      .then((mod) => mod.ChatWindow),
  {
    ssr: false,
    loading: () => <div className="p-4 text-center">Загрузка чата…</div>,
  }
);

export default function MessagesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get('userId');

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [selectedUserAvatar, setSelectedUserAvatar] = useState<string>('');

  // Открыть чат по ?userId
  useEffect(() => {
    if (targetUserId && user?.uid && targetUserId !== user.uid) {
      setSelectedUserId(targetUserId);
    }
  }, [targetUserId, user?.uid]);

  // Создать чат в Firestore, если ещё не существует
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
      }
    };
    ensureChat();
  }, [selectedUserId, user?.uid]);

  return (
    <Suspense fallback={<div className="p-4 text-center">Загрузка...</div>}>
  <div className="flex flex-col md:flex-row h-[90vh]">
    {/* Список чатов: скрываем только на мобильных, на md+ — всегда показываем */}
    <div
      className={`
        ${selectedUserId ? 'hidden' : 'block'}  // на мобилке
        w-full
        md:block                              // на md+ всегда block
        md:w-1/3
        bg-background
        overflow-auto
      `}
    >
      <ChatList
        selectedUserId={selectedUserId}
        onSelect={(userId: string, userName?: string, userAvatar?: string) => {
          setSelectedUserId(userId);
          setSelectedUserName(userName || '');
          setSelectedUserAvatar(userAvatar || '');
        }}
      />
    </div>

    {/* Окно чата: тоже скрываем только на мобилке */}
    <div
      className={`
        ${selectedUserId ? 'block' : 'hidden'}  // на мобилке
        w-full
        md:block                                // на md+ всегда block
        md:flex-1
        bg-background
      `}
    >
      {selectedUserId ? (
        <ChatWindow
          otherUserId={selectedUserId}
          otherUserName={selectedUserName}
          otherUserAvatar={selectedUserAvatar}
          onBack={() => setSelectedUserId(null)}
        />
      ) : (
        <div className="p-4 text-center text-muted-foreground">
          Выберите чат для общения или начните новый диалог, нажав кнопку «Написать».
        </div>
      )}
    </div>
  </div>
</Suspense>
  );
}
