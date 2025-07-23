// components/chat/ChatsContainer.tsx
'use client';

import { useState } from 'react';
import { useMediaQuery } from '@react-hookz/web';
import ChatList from '@/app/components/chat/ChatList';
import { ChatWindow } from '@/app/components/chat/ChatWindow';

export default function ChatsContainer() {
  // true если ≥768px
  const isDesktop = useMediaQuery('only screen and (min-width:768px)');
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex h-full">
      {/* Список чатов */}
      <div
        className={`${
          isDesktop
            ? 'block w-80'
            : selected
            ? 'hidden'
            : 'block w-full'
        } border-r border-muted overflow-auto`}
      >
        <ChatList
          selectedUserId={selected}
          onSelect={(userId) => setSelected(userId)}
        />
      </div>

      {/* Окно чата */}
      <div
        className={`flex-1 ${
          isDesktop
            ? 'block'
            : selected
            ? 'block'
            : 'hidden'
        }`}
      >
        {selected && (
          <ChatWindow
            otherUserId={selected}
            onBack={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
}
