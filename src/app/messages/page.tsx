// app/messages/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import ChatWindow from '@/app/components/chat/ChatWindow';
import ChatList from '@/app/components/chat/ChatList';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { useAuth } from '@/hooks/useAuth';


export default function MessagesPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get('userId');
  const initialUid = searchParams.get('uid');

  const [selectedUserId, setSelectedUserId] = useState<string | null>(initialUid);
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [selectedUserAvatar, setSelectedUserAvatar] = useState<string>('');
  const { user } = useAuth();

  useEffect(() => {
  const ensureChatExists = async () => {
    if (!user?.uid || !targetUserId || user.uid === targetUserId) return;

    const chatId = [user.uid, targetUserId].sort().join('_');
    const chatRef = doc(db, 'chats', chatId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      await setDoc(chatRef, {
        participants: [user.uid, targetUserId],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: '',
      });

      // создаём ссылку в сабколлекциях для быстрого списка чатов
      const myChatRef = doc(db, 'users', user.uid, 'chats', chatId);
      const theirChatRef = doc(db, 'users', targetUserId, 'chats', chatId);

      await Promise.all([
        setDoc(myChatRef, {
          participants: [user.uid, targetUserId],
          lastMessage: '',
          updatedAt: serverTimestamp(),
        }),
        setDoc(theirChatRef, {
          participants: [user.uid, targetUserId],
          lastMessage: '',
          updatedAt: serverTimestamp(),
        }),
      ]);
    }

    setSelectedUserId(targetUserId);
  };

  ensureChatExists();
}, [targetUserId, user?.uid]);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">
      {/* Левая колонка — список чатов */}
      <div className="w-full md:w-1/3 bg-background">
        <ChatList
          onSelect={(userId: string, userName?: string, userAvatar?: string) => {
            setSelectedUserId(userId);
            setSelectedUserName(userName || 'Пользователь');
            setSelectedUserAvatar(userAvatar || '');
          }}
        />
      </div>

      {/* Правая колонка — окно чата */}
      <div className="flex-1 ml-8 bg-background">
        {selectedUserId ? (
          <ChatWindow
            otherUserId={selectedUserId}
            otherUserName={selectedUserName}
            otherUserAvatar={selectedUserAvatar}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-base gap-2">
            <p>{t('messages.selectChat', 'Выберите чат, чтобы начать общение')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
