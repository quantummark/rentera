'use client';

import { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatWindowProps {
  otherUserId: string;
  otherUserName?: string;
  otherUserAvatar?: string;
}

export default function ChatWindow({ otherUserId, otherUserName = 'Пользователь', otherUserAvatar }: ChatWindowProps) {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const { messages, isLoading, sendMessage } = useChat(user?.uid || '', otherUserId);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    await sendMessage(newMessage.trim());
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[500px] md:h-[600px] w-full max-w-2xl border border-muted rounded-2xl overflow-hidden shadow-md bg-card">
      {/* Верхняя панель */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-muted bg-muted/30">
        <Avatar className="w-8 h-8">
          <AvatarImage src={otherUserAvatar || ''} alt={otherUserName} />
          <AvatarFallback>{otherUserName[0]}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-semibold text-foreground">{otherUserName}</span>
      </div>

      {/* Сообщения */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <Loader2 className="animate-spin w-6 h-6" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
            <MessageCircle className="w-8 h-8 opacity-30" />
            <p>У вас пока что нет ни одного сообщения</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-md whitespace-pre-line break-words',
                msg.senderId === user?.uid
                  ? 'ml-auto bg-orange-500 text-white rounded-br-none'
                  : 'mr-auto bg-muted rounded-bl-none'
              )}
            >
              {msg.text}
            </div>
          ))
        )}
      </div>

      {/* Ввод сообщения */}
      <div className="border-t border-muted bg-muted/20 p-3">
        <div className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Напишите сообщение..."
            className="flex-1 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend} disabled={!newMessage.trim()} className="bg-orange-500 hover:bg-orange-600 text-white">
            Отправить
          </Button>
        </div>
      </div>
    </div>
  );
}
