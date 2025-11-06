'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { Loader2, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { ChatHeader } from '@/app/components/chat/ChatHeader';
import { MessageBubble } from '@/app/components/chat/MessageBubble';
import { ChatInput } from '@/app/components/chat/ChatInput';
import { useUserTypeWithProfile } from '@/hooks/useUserType';

interface ChatWindowProps {
  otherUserId: string;
  otherUserName?: string;
  otherUserAvatar?: string;
  onBack?: () => void;
}

interface UserProfile {
  fullName: string;
  profileImageUrl: string;
  isOnline?: boolean;
}

export function ChatWindow({
  otherUserId,
  otherUserName = 'Пользователь',
  otherUserAvatar,
  onBack,
}: ChatWindowProps) {
  const router = useRouter();
  const { user } = useAuth();

  // стабильный chatId (для ссылок/удаления и просто удобства)
  const chatId = useMemo(() => {
    if (!user?.uid || !otherUserId) return null;
    return [user.uid, otherUserId].sort().join('_');
  }, [user?.uid, otherUserId]);

  // не дергаем useChat, пока нет uid
  const { messages, isLoading, sendMessage } = useChat(user?.uid ?? '', otherUserId);

  // профиль собеседника
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const { t } = useTranslation('messages');

  // мой профиль (owner/renter) — для корректного аватара отправителя
  const [, myProfile] = useUserTypeWithProfile();

  const myAvatar =
    (myProfile && 'profileImageUrl' in myProfile && typeof myProfile.profileImageUrl === 'string'
      ? myProfile.profileImageUrl
      : '') || user?.photoURL || '';

  const myName =
    (myProfile && 'fullName' in myProfile ? myProfile.fullName : '') ||
    user?.displayName ||
    'You';

  // — автоскролл —
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  const updateIsAtBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const threshold = 64; // px
    isAtBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  }, []);

  // подгрузка профиля собеседника
  useEffect(() => {
    let cancelled = false;

    async function loadProfile(uid: string) {
      const [renterSnap, ownerSnap] = await Promise.all([
        getDoc(doc(db, 'renter', uid)),
        getDoc(doc(db, 'owner', uid)),
      ]);

      if (cancelled) return;
      if (renterSnap.exists()) {
        setProfile(renterSnap.data() as UserProfile);
      } else if (ownerSnap.exists()) {
        setProfile(ownerSnap.data() as UserProfile);
      } else {
        setProfile(null);
      }
    }

    if (otherUserId) loadProfile(otherUserId);
    return () => {
      cancelled = true;
    };
  }, [otherUserId]);

  // автоскролл вниз (только если пользователь уже внизу)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (isAtBottomRef.current) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleScroll = useCallback(() => {
    updateIsAtBottom();
  }, [updateIsAtBottom]);

  // отправка
  const handleSend = useCallback(async () => {
    if (!newMsg.trim() || sending) return;
    setSending(true);
    try {
      await sendMessage(newMsg.trim());
      setNewMsg('');
      const el = scrollRef.current;
      el?.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    } finally {
      setSending(false);
    }
  }, [newMsg, sendMessage, sending]);

  // удаление чата (внимание: подколлекции не удаляются)
  const handleDeleteChat = useCallback(async () => {
    if (!chatId) return;
    if (!confirm(t('messages.deleteChat'))) return;
    await deleteDoc(doc(db, 'chats', chatId));
    router.back();
  }, [chatId, router]);

  if (!user?.uid) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-muted-foreground">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  const displayName = profile?.fullName || otherUserName;
  const displayAvatar = profile?.profileImageUrl || otherUserAvatar || '';

  return (
    <div className="flex flex-col h-[80vh] md:h/full w-full max-w-2xl mx-auto">
      <ChatHeader
        otherUserName={displayName}
        otherUserAvatar={displayAvatar}
        isOnline={!!profile?.isOnline}
        onBack={onBack}
        onDeleteChat={handleDeleteChat}
        onBlockUser={() => alert(t('messages.blocked'))}
        onReportUser={() => alert(t('messages.reported'))}
      />

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-transparent"
      >
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground text-sm">
            <MessageCircle className="w-8 h-8 opacity-30" />
            <p>{t('messages.noChat')}</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMine = msg.senderId === user.uid;
            const next = messages[idx + 1];
            const showAvatar = !next || next.senderId !== msg.senderId;

            const senderAvatar = isMine ? myAvatar : displayAvatar;
            const senderName = isMine ? myName : displayName;

            // без any: если нет id (старые доки) — используем детерминированный ключ
            const key = msg.id ?? `${msg.senderId}-${msg.createdAt.toMillis()}`;

            return (
              <MessageBubble
                key={key}
                text={msg.text}
                isMine={isMine}
                showAvatar={showAvatar}
                avatarUrl={senderAvatar}
                userName={senderName}
              />
            );
          })
        )}
      </div>

      <ChatInput
        message={newMsg}
        onMessageChange={setNewMsg}
        onSend={handleSend}
        onAttachFile={(f) => console.log('attach file', f)}
        onAttachPhoto={(f) => console.log('attach photo', f)}
        isSending={sending}
      />
    </div>
  );
}
