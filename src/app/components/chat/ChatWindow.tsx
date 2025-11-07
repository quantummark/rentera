'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import {
  doc,
  getDoc,
  deleteDoc,
  onSnapshot,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { Loader2, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { ChatHeader } from '@/app/components/chat/ChatHeader';
import { MessageBubble } from '@/app/components/chat/MessageBubble';
import { ChatInput } from '@/app/components/chat/ChatInput';
import { useUserTypeWithProfile } from '@/hooks/useUserType';

import { dayLabel, resolveLocale, normalizeDate, isSameDay } from '@/app/utils/date';

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

type ReadCursors = Record<string, Timestamp | undefined>;

function DayDivider({ label }: { label: string }) {
  return (
    <div className="my-3 flex items-center justify-center">
      <span className="px-3 py-1 text-xs rounded-full bg-muted/40 text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function ChatWindow({
  otherUserId,
  otherUserName = 'User',
  otherUserAvatar,
  onBack,
}: ChatWindowProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const uiLocale = resolveLocale(i18n.language);

  // стабильный chatId
  const chatId = useMemo(() => {
    if (!user?.uid || !otherUserId) return null;
    return [user.uid, otherUserId].sort().join('_');
  }, [user?.uid, otherUserId]);

  // сообщения
  const { messages, isLoading, sendMessage } = useChat(user?.uid ?? '', otherUserId);

  // профиль собеседника
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);

  // мой профиль (owner/renter) — для аватарки/имени отправителя
  const [, myProfile] = useUserTypeWithProfile();
  const myAvatar =
    (myProfile && 'profileImageUrl' in myProfile && typeof myProfile.profileImageUrl === 'string'
      ? myProfile.profileImageUrl
      : '') || user?.photoURL || '';
  const myName =
    (myProfile && 'fullName' in myProfile ? myProfile.fullName : '') ||
    user?.displayName ||
    'You';

  // presence: "печатает..."
  const [isTyping, setIsTyping] = useState(false);

  // read cursors: { [uid]: Timestamp }
  const [readCursors, setReadCursors] = useState<ReadCursors>({});

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

    if (otherUserId) void loadProfile(otherUserId);
    return () => {
      cancelled = true;
    };
  }, [otherUserId]);

  // подписка на чат-документ: считываем readCursors
  useEffect(() => {
    if (!chatId) return;
    const unsub = onSnapshot(doc(db, 'chats', chatId), (snap) => {
      const data = snap.data() as { readCursors?: ReadCursors } | undefined;
      setReadCursors(data?.readCursors ?? {});
    });
    return unsub;
  }, [chatId]);

  // подписка на presence собеседника (typing)
  useEffect(() => {
    if (!chatId || !otherUserId) return;
    const unsub = onSnapshot(doc(db, 'chats', chatId, 'presence', otherUserId), (snap) => {
      const d = snap.data() as { typing?: boolean; updatedAt?: Timestamp } | undefined;
      const fresh =
        d?.updatedAt instanceof Timestamp ? Date.now() - d.updatedAt.toMillis() < 6000 : false;
      setIsTyping(!!d?.typing && fresh);
    });
    return unsub;
  }, [chatId, otherUserId]);

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

  // обновление своего readCursor
  const touchReadCursor = useCallback(async () => {
    if (!chatId || !user?.uid) return;
    try {
      await updateDoc(doc(db, 'chats', chatId), {
        [`readCursors.${user.uid}`]: serverTimestamp(),
      });
    } catch {
      // no-op
    }
  }, [chatId, user?.uid]);

  // при входе в чат — отметить прочитанным
  useEffect(() => {
    void touchReadCursor();
  }, [touchReadCursor]);

  // при новых сообщениях — если окно активно и пользователь «внизу» — тоже
  useEffect(() => {
    if (document.visibilityState === 'visible' && isAtBottomRef.current) {
      void touchReadCursor();
    }
  }, [messages, touchReadCursor]);

  // реакция на восстановление видимости
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'visible') {
        void touchReadCursor();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [touchReadCursor]);

  // отправка
  const handleSend = useCallback(async () => {
    if (!newMsg.trim() || sending) return;
    setSending(true);
    try {
      await sendMessage(newMsg.trim());
      setNewMsg('');
      const el = scrollRef.current;
      el?.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      // обновим курсор на всякий случай
      void touchReadCursor();
    } finally {
      setSending(false);
    }
  }, [newMsg, sendMessage, sending, touchReadCursor]);

  // удалить чат (подколлекции не удаляются)
  const handleDeleteChat = useCallback(async () => {
    if (!chatId) return;
    if (!confirm(t('messages.deleteChat', 'Удалить чат?'))) return;
    await deleteDoc(doc(db, 'chats', chatId));
    router.back();
  }, [chatId, router, t]);

  // писать presence: typing
  const setTyping = useCallback(
    async (state: boolean) => {
      if (!chatId || !user?.uid) return;
      try {
        await setDoc(
          doc(db, 'chats', chatId, 'presence', user.uid),
          { typing: state, updatedAt: serverTimestamp() },
          { merge: true }
        );
      } catch {
        // no-op
      }
    },
    [chatId, user?.uid]
  );

  if (!user?.uid) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-muted-foreground">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  const displayName = profile?.fullName || otherUserName;
  const displayAvatar = profile?.profileImageUrl || otherUserAvatar || '';

  // другой пользователь: курсор прочтения
  const otherReadAt = readCursors[otherUserId];

  return (
    <div className="flex flex-col h-[80vh] md:h-full w-full max-w-2xl mx-auto">
      <ChatHeader
        otherUserName={displayName}
        otherUserAvatar={displayAvatar}
        isOnline={!!profile?.isOnline}
        onBack={onBack}
        onDeleteChat={handleDeleteChat}
        onBlockUser={() => alert(t('messages.blocked', 'Заблокировано'))}
        onReportUser={() => alert(t('messages.reported', 'Жалоба отправлена'))}
      />

      {/* typing indicator */}
      {isTyping && (
        <div className="px-4 pt-1 text-xs text-muted-foreground">{t('messages.typing', 'Печатает…')}</div>
      )}

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
            <p>{t('messages.noChat', 'У вас пока нет сообщений')}</p>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => {
              const isMine = msg.senderId === user.uid;
              const previous = messages[idx - 1];
              const currentDate = normalizeDate(msg.createdAt);
              const needDivider =
                !previous || !isSameDay(currentDate, normalizeDate(previous.createdAt));

              const next = messages[idx + 1];
              const showAvatar = !next || next.senderId !== msg.senderId;

              const senderAvatar = isMine ? myAvatar : displayAvatar;
              const senderName = isMine ? myName : displayName;

              // статус: прочитано, если у другого readCursor >= времени моего сообщения
              let status: 'sent' | 'delivered' | 'read' | undefined;
              if (isMine) {
                if (otherReadAt instanceof Timestamp) {
                  status = msg.createdAt.toMillis() <= otherReadAt.toMillis() ? 'read' : 'sent';
                } else {
                  status = 'sent';
                }
              }

              const key = msg.id ?? `${msg.senderId}-${msg.createdAt.toMillis()}`;

              return (
                <div key={key}>
                  {needDivider && (
                    <DayDivider label={dayLabel(currentDate, { 
                      locale: uiLocale, 
                      t: (key: string, defaultValue?: string) => t(key, defaultValue || key)
                    })} />
                  )}
                  <MessageBubble
                    text={msg.text}
                    isMine={isMine}
                    showAvatar={showAvatar}
                    avatarUrl={senderAvatar}
                    userName={senderName}
                    time={msg.createdAt}
                    status={status}
                  />
                </div>
              );
            })}
          </>
        )}
      </div>

      <ChatInput
        message={newMsg}
        onMessageChange={setNewMsg}
        onSend={handleSend}
        onAttachFile={(f) => console.log('attach file', f)}
        isSending={sending}
        onTyping={setTyping}
      />
    </div>
  );
}
