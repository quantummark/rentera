// components/chat/MessageBubble.tsx
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  text: string;
  isMine: boolean;
  showAvatar?: boolean;
  avatarUrl?: string;
  userName?: string;
}

export function MessageBubble({
  text,
  isMine,
  showAvatar = false,
  avatarUrl,
  userName = 'User',
}: MessageBubbleProps) {
  return (
    <div
      className={cn(
        'flex items-end mb-2',
        isMine ? 'justify-end' : 'justify-start'
      )}
    >
      {/* Аватар слева у чужих */}
      {!isMine && showAvatar && (
        <Avatar className="w-8 h-8">
          <AvatarImage src={avatarUrl || ''} alt={userName} />
          <AvatarFallback>{userName[0]}</AvatarFallback>
        </Avatar>
      )}

      {/* Сообщение «пузырьком» */}
      <div
        className={cn(
          'px-4 py-2 text-sm whitespace-pre-line break-words shadow',
          'max-w-[75%] sm:max-w-[60%]',
          'rounded-2xl',
          isMine
            ? 'bg-orange-500 text-white rounded-tr-none'
            : 'bg-gray-200 text-gray-900 rounded-bl-none'
        )}
      >
        {text}
      </div>

      {/* Аватар справа у своих */}
      {isMine && showAvatar && (
        <Avatar className="w-8 h-8">
          <AvatarImage src={avatarUrl || ''} alt={userName} />
          <AvatarFallback>{userName[0]}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
