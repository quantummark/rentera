'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Users as UsersIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Timestamp } from 'firebase/firestore';

// Определим интерфейс для профиля пользователя
interface UserProfile {
  fullName: string;
  profileImageUrl: string;
}

// Определим интерфейс для чата
interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  updatedAt: Timestamp;  // Заменили any на Timestamp
}

interface ChatDoc {
  participants: string[];
  lastMessage: string;
  updatedAt: Timestamp;
}

interface ChatListProps {
  lastMessage?: string;
  selectedUserId: string | null;
  onSelect: (userId: string, userName?: string, userAvatar?: string) => void;
}

export default function ChatList({ selectedUserId, onSelect }: ChatListProps) {
  const { user } = useAuth();
  const { t } = useTranslation('messages');
  const [chats, setChats] = useState<Chat[]>([]);
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>({});
  const [loading, setLoading] = useState(true);

  // 1. Подписка на чаты
  useEffect(() => {
  if (!user?.uid) return;

  const q = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', user.uid),
    orderBy('updatedAt', 'desc')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const list: Chat[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as ChatDoc; // строго типизируем

      return {
        id: docSnap.id,
        participants: data.participants,
        lastMessage: data.lastMessage || '',
        updatedAt: data.updatedAt,
      };
    });

    setChats(list);
    setLoading(false);
  });

  return unsubscribe;
}, [user?.uid]);

  // 2. Загрузка профилей собеседников
  useEffect(() => {
    if (loading) return;
    (async () => {
      const cache: Record<string, UserProfile> = {};
      for (const chat of chats) {
        const otherId = chat.participants.find(id => id !== user?.uid)!;
        if (!cache[otherId]) {
          const { getDoc, doc } = await import('firebase/firestore');
          let snap = await getDoc(doc(db, 'renter', otherId));
          if (!snap.exists()) snap = await getDoc(doc(db, 'owner', otherId));
          cache[otherId] = snap.exists() ? snap.data() as UserProfile : { fullName: '', profileImageUrl: '' };
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
    <div className="bg-card dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-4 h-[80vh] md:h-full flex flex-col">
      {/* Заголовок */}
      <div className="flex items-center mb-4">
        <UsersIcon className="w-6 h-6 text-foreground mr-2" />
        <h2 className="text-lg font-semibold text-foreground dark:text-foreground-dark">
          {t('messages.title')}
        </h2>
      </div>

      {/* Список чатов */}
      <ul className="overflow-y-auto space-y-2 flex-1">
        {chats.map((chat) => {
          const otherId = chat.participants.find((id) => id !== user!.uid)!;
          const isSelected = otherId === selectedUserId;

          // Получаем профиль собеседника из списка профилей
          const userProfile = profiles[otherId];
          const name = userProfile?.fullName || t('messages.unknownUser');
          const avatar = userProfile?.profileImageUrl || '';
          const preview = chat.lastMessage?.trim() ? chat.lastMessage : t('messages.noMessages');

          return (
            <li
              key={chat.id}
              onClick={() => onSelect(otherId, name, avatar)}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl transition cursor-pointer',
                'bg-card hover:bg-muted/10 dark:bg-gray-800 dark:hover:bg-gray-700',
                isSelected && 'bg-muted/20 dark:bg-gray-700'
              )}
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback>{name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground dark:text-foreground">{name}</p>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground truncate">{preview}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
