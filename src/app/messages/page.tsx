'use client';
export const dynamic = 'force-dynamic';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { useAuth } from '@/hooks/useAuth';

import ChatList from '@/app/components/chat/ChatList';
import { ChatWindow } from '@/app/components/chat/ChatWindow';

export default function MessagesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get('userId');

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [selectedUserAvatar, setSelectedUserAvatar] = useState<string>('');

  useEffect(() => {
    if (targetUserId && user?.uid && targetUserId !== user.uid) {
      setSelectedUserId(targetUserId);
    }
  }, [targetUserId, user?.uid]);

  useEffect(() => {
    const ensureChat = async () => {
      if (!user?.uid || !selectedUserId) return;
      const chatId = [user.uid, selectedUserId].sort().join('_');
      const refDoc = doc(db, 'chats', chatId);
      const snap = await getDoc(refDoc);
      if (!snap.exists()) {
        await setDoc(refDoc, {
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
    <Suspense fallback={<div className="p-4">Загрузка чатов…</div>}>
      <div className="flex flex-col md:flex-row h-[90vh]">
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
