// app/messages/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import ChatWindow from '@/app/components/chat/ChatWindow';
import ChatList from '@/app/components/chat/ChatList';
import { useTranslation } from 'react-i18next';

export default function MessagesPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const initialUid = searchParams.get('uid');

  const [selectedUserId, setSelectedUserId] = useState<string | null>(initialUid);
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [selectedUserAvatar, setSelectedUserAvatar] = useState<string>('');

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">
      {/* Левая колонка — список чатов */}
      <div className="w-full md:w-1/3 border-r border-muted bg-background">
        <ChatList
          onSelect={(userId: string, userName?: string, userAvatar?: string) => {
            setSelectedUserId(userId);
            setSelectedUserName(userName || 'Пользователь');
            setSelectedUserAvatar(userAvatar || '');
          }}
        />
      </div>

      {/* Правая колонка — окно чата */}
      <div className="flex-1 bg-background">
        {selectedUserId ? (
          <ChatWindow
            otherUserId={selectedUserId}
            otherUserName={selectedUserName}
            otherUserAvatar={selectedUserAvatar}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
            <p>{t('messages.selectChat', 'Выберите чат, чтобы начать общение')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
