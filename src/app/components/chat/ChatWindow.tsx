// components/chat/ChatWindow.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { Loader2, MessageCircle } from 'lucide-react';

import { ChatHeader } from '@/app/components/chat/ChatHeader';
import { MessageBubble } from '@/app/components/chat/MessageBubble';
import { ChatInput } from '@/app/components/chat/ChatInput';

interface ChatWindowProps {
  otherUserId: string;
  otherUserName?: string;
  otherUserAvatar?: string;
  onBack?: () => void; // функция для возврата назад
}

export function ChatWindow({
  otherUserId,
  otherUserName = 'Пользователь',
  otherUserAvatar,
  onBack,
}: ChatWindowProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { messages, isLoading, sendMessage } = useChat(user?.uid || '', otherUserId);

  const [profile, setProfile] = useState<any>(null);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1) загрузка профиля
  useEffect(() => {
    const load = async () => {
      const rRef = doc(db, 'renter', otherUserId);
      const rs = await getDoc(rRef);
      if (rs.exists()) setProfile(rs.data());
      else {
        const oRef = doc(db, 'owner', otherUserId);
        const os = await getDoc(oRef);
        if (os.exists()) setProfile(os.data());
      }
    };
    if (otherUserId) load();
  }, [otherUserId]);

  // 2) автоскролл
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // 3) отправка
  const handleSend = async () => {
    if (!newMsg.trim() || sending) return;
    setSending(true);
    await sendMessage(newMsg.trim());
    setNewMsg('');
    setSending(false);
  };

  // 4) удаление чата
  const handleDeleteChat = async () => {
    const chatId = [user?.uid, otherUserId].sort().join('_');
    await deleteDoc(doc(db, 'chats', chatId));
    router.back();
  };

  

  return (
    <div className="flex flex-col h-[80vh] md:h-full w-full max-w-2xl mx-auto">
      {/* Header в карточке */}
      <ChatHeader
        otherUserName={profile?.fullName || otherUserName}
        otherUserAvatar={profile?.profileImageUrl || otherUserAvatar}
        isOnline={!!profile?.isOnline}
        onBack={onBack} 
        onDeleteChat={handleDeleteChat}
        onBlockUser={() => alert('Заблокировано')}
        onReportUser={() => alert('Жалоба отправлена')}
      />

      {/* Body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-transparent">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground text-sm">
            <MessageCircle className="w-8 h-8 opacity-30" />
            <p>У вас пока нет сообщений</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMine = msg.senderId === user?.uid;
            const next = messages[idx + 1];
            const showAvatar = !next || next.senderId !== msg.senderId;

            return (
              <MessageBubble
                key={msg.id}
                text={msg.text}
                isMine={isMine}
                showAvatar={showAvatar}
                avatarUrl={isMine ? user?.photoURL || '' : profile?.profileImageUrl || ''}
                userName={isMine ? user?.displayName || '' : profile?.fullName || ''}
              />
            );
          })
        )}
      </div>

      {/* Input в карточке */}
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
