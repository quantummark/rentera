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
  const initials = (userName?.trim()?.[0] || '?').toUpperCase();

  return (
    <div className={cn('flex w-full items-end gap-2 mb-1', isMine ? 'justify-end' : 'justify-start')}>
      {/* аватар чужого */}
      {!isMine && showAvatar && (
        <Avatar className="w-7 h-7 shrink-0">
          <AvatarImage src={avatarUrl || ''} alt={userName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      )}

      {/* пузырь */}
      <div
        className={cn(
          'relative px-4 py-2 text-sm shadow-sm',
          'max-w-[75%] sm:max-w-[60%] break-words whitespace-pre-line',
          'rounded-2xl',
          isMine
            ? 'bg-orange-500 text-white rounded-br-none'
            : 'bg-gray-200 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
        )}
      >
        {/* хвостик */}
        <span
          className={cn(
            'absolute bottom-0',
            isMine
              ? 'right-[-6px] border-[6px] border-transparent border-b-orange-500'
              : 'left-[-6px] border-[6px] border-transparent border-b-gray-200 dark:border-b-neutral-700'
          )}
          style={{ borderBottomWidth: 8 }}
        />
        {text}
      </div>

      {/* аватар свой */}
      {isMine && showAvatar && (
        <Avatar className="w-7 h-7 shrink-0">
          <AvatarImage src={avatarUrl || ''} alt={userName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
