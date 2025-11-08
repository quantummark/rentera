'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Users as UsersIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { timeLabel, resolveLocale } from '@/app/utils/date';

interface UserProfile {
  fullName: string;
  profileImageUrl: string;
}

interface ChatDoc {
  participants: string[];
  lastMessage: string;
  updatedAt: Timestamp;
  readCursors?: Record<string, Timestamp>;
}

interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  updatedAt: Timestamp;
  readCursors?: Record<string, Timestamp>;
}

interface PresenceDoc {
  typing?: boolean;
  updatedAt?: Timestamp;
}

interface ChatListProps {
  selectedUserId: string | null;
  onSelect: (userId: string, userName?: string, userAvatar?: string) => void;
}

export default function ChatList({ selectedUserId, onSelect }: ChatListProps) {
  const { user } = useAuth();
  const { t, i18n } = useTranslation('messages');
  const locale = resolveLocale(i18n.language);

  const [chats, setChats] = useState<Chat[]>([]);
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>({});
  const [onlineMap, setOnlineMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // 1) Подписка на чаты текущего пользователя
  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list: Chat[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as ChatDoc;
        return {
          id: docSnap.id,
          participants: data.participants,
          lastMessage: data.lastMessage || '',
          updatedAt: data.updatedAt,
          readCursors: data.readCursors,
        };
      });
      setChats(list);
      setLoading(false);
    });

    return unsub;
  }, [user?.uid]);

  // 2) Загрузка профилей собеседников
  useEffect(() => {
    if (loading || !user?.uid) return;

    let cancelled = false;

    (async () => {
      const cache: Record<string, UserProfile> = { ...profiles };

      for (const chat of chats) {
        const otherId = chat.participants.find((id) => id !== user.uid);
        if (!otherId) continue;

        if (!cache[otherId]) {
          const { getDoc } = await import('firebase/firestore');
          let snap = await getDoc(doc(db, 'renter', otherId));
          if (!snap.exists()) snap = await getDoc(doc(db, 'owner', otherId));
          cache[otherId] = snap.exists()
            ? (snap.data() as UserProfile)
            : { fullName: '', profileImageUrl: '' };
        }
      }

      if (!cancelled) {
        setProfiles(cache);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, chats, user?.uid]);

  // 3) Presence: считаем online по свежему updatedAt
  useEffect(() => {
    if (!user?.uid) return;
    const unsubs: Array<() => void> = [];

    chats.forEach((chat) => {
      const otherId = chat.participants.find((id) => id !== user.uid);
      if (!otherId) return;

      const presUnsub = onSnapshot(
        doc(db, 'chats', chat.id, 'presence', otherId),
        (snap) => {
          const d = snap.data() as PresenceDoc | undefined;
          const fresh =
            d?.updatedAt instanceof Timestamp
              ? Date.now() - d.updatedAt.toMillis() < 60000
              : false;
          setOnlineMap((prev) => ({ ...prev, [otherId]: fresh }));
        }
      );
      unsubs.push(presUnsub);
    });

    return () => {
      unsubs.forEach((u) => u());
    };
  }, [chats, user?.uid]);

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

          const userProfile = profiles[otherId];
          const name =
            (userProfile?.fullName && userProfile.fullName.trim()) ||
            t('messages.unknownUser');
          const avatar = userProfile?.profileImageUrl || '';
          const preview =
            chat.lastMessage?.trim() || t('messages.noMessages');

          const online = onlineMap[otherId] ?? false;
          const timeText = timeLabel(chat.updatedAt, { locale, use24h: true });

          return (
            <li
              key={chat.id}
              onClick={() => onSelect(otherId, name, avatar)}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl border border-gray-300 bg-white/5 backdrop-blur-sm transition cursor-pointer',
                'bg-card hover:bg-muted/10 dark:bg-background-dark dark:hover:bg-background-dark/50',
                isSelected && 'bg-muted/20 dark:bg-background-dark/70',
              )}
            >
              {/* Аватар + online */}
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={avatar} alt={name} />
                  <AvatarFallback>{name[0]}</AvatarFallback>
                </Avatar>
                <span
                  className={cn(
                    'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-card',
                    online ? 'bg-emerald-500' : 'bg-gray-400 dark:bg-gray-500'
                  )}
                  aria-hidden="true"
                />
                {online && (
                  <span
                    className="absolute -bottom-[2px] -right-[2px] h-3 w-3 rounded-full bg-emerald-500/40 animate-ping"
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Имя + время */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {name}
                  </p>
                  <span className="ml-auto text-[11px] text-muted-foreground">
                    {timeText}
                  </span>
                </div>

                <div className="mt-0.5 flex items-center gap-2">
                  <p className="flex-1 text-xs text-muted-foreground truncate">
                    {preview}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
