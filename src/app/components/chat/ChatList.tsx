'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Users } from 'lucide-react';

interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  updatedAt: any;
}

export default function ChatList({ onSelect }: { onSelect: (userId: string) => void }) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [chats, setChats] = useState<Chat[]>([]);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, 'users', user.uid, 'chats'),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatData: Chat[] = snapshot.docs.map((doc) => {
        const { id: _id, ...data } = doc.data() as Chat;
        return {
          id: doc.id,
          ...data,
        };
      });

      setChats(chatData);
      setHasLoadedOnce(true);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 bg-card rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-2 text-foreground">💬 {t('chat.yourChats', 'Ваши чаты')}</h2>

      {!hasLoadedOnce ? (
        <div className="flex justify-center py-8 text-muted-foreground">
          <Loader2 className="animate-spin w-6 h-6" />
        </div>
      ) : chats.length === 0 ? (
        <div className="text-muted-foreground text-sm flex flex-col items-center gap-2 py-8">
          <Users className="w-8 h-8 opacity-30" />
          <p>{t('chat.noChats', 'У вас пока что нет чатов')}</p>
        </div>
      ) : (
        chats.map((chat) => {
          if (!user?.uid) return null;
          const otherUserId = chat.participants.find((id) => id !== user.uid);

          // ⛔ Заменить этот блок на реальный хук/данные для получения профиля другого пользователя:
          const userName = 'Пользователь'; // <- заменить на имя другого юзера
          const userAvatar = ''; // <- заменить на avatar другого юзера

          return (
            <div
              key={chat.id}
              onClick={() => onSelect(otherUserId!)}
              className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-xl cursor-pointer transition"
            >
              <Avatar className="w-9 h-9">
                <AvatarImage src={userAvatar} />
                <AvatarFallback>{userName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
