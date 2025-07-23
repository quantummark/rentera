// components/chat/ChatList.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Users as UsersIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  updatedAt: any;
}

interface ChatListProps {
  lastMessage?: string;
  selectedUserId: string | null;
  onSelect: (userId: string, userName?: string, userAvatar?: string) => void;
}

export default function ChatList({ selectedUserId, onSelect }: ChatListProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [chats, setChats] = useState<Chat[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  // 1. Подписка на чаты
  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, 'users', user.uid, 'chats'),
      orderBy('updatedAt', 'desc')
    );
    const unsub = onSnapshot(q, snap => {
      setChats(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
      setLoading(false);
    });
    return unsub;
  }, [user?.uid]);

  // 2. Загрузка профилей собеседников
  useEffect(() => {
    if (loading) return;
    ;(async () => {
      const cache: Record<string, any> = {};
      for (const chat of chats) {
        const otherId = chat.participants.find(id => id !== user?.uid)!;
        if (!cache[otherId]) {
          const { doc, getDoc } = await import('firebase/firestore');
          let snap = await getDoc(doc(db, 'renter', otherId));
          if (!snap.exists()) snap = await getDoc(doc(db, 'owner', otherId));
          cache[otherId] = snap.exists() ? snap.data() : null;
        }
      }
      setProfiles(cache);
    })();
  }, [loading, chats, user?.uid]);

  if (loading) {
    return (
      <div className="flex justify-center py-8 text-muted-foreground">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  return (
    <div
  className="
    bg-card               /* светлая тема */
    dark:bg-gray-900      /* тёмная тема */
    border border-gray-200
    dark:border-gray-700
    rounded-2xl shadow-sm
    p-4 h-[80vh] md:h-full
    flex flex-col
  "
>
  {/* Заголовок */}
  <div className="flex items-center mb-4">
    <UsersIcon className="w-6 h-6 text-foreground mr-2" />
    <h2 className="text-lg font-semibold text-foreground">
      {t('chat.list.title', 'Ваши чаты')}
    </h2>
  </div>

  {/* Список чатов */}
  <ul className="overflow-y-auto space-y-2 flex-1">
    {chats.map(chat => {
      const otherId = chat.participants.find(id => id !== user!.uid)!;
      const isSelected = otherId === selectedUserId;

      return (
        <li
          key={chat.id}
          onClick={() => onSelect(otherId, profiles[otherId]?.fullName, profiles[otherId]?.profileImageUrl)}
          className={cn(
            'flex items-center gap-3 p-3 rounded-xl transition cursor-pointer',
            'bg-card hover:bg-muted/10 dark:bg-gray-800 dark:hover:bg-gray-700',
            isSelected && 'bg-muted/20 dark:bg-gray-700'
          )}
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src={profiles[otherId]?.profileImageUrl} alt="avatar" />
            <AvatarFallback>{profiles[otherId]?.fullName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {profiles[otherId]?.fullName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {chat.lastMessage || t('chat.noMessages', 'Нет сообщений')}  
            </p>
          </div>
        </li>
      );
    })}
  </ul>
</div>
  );
}
