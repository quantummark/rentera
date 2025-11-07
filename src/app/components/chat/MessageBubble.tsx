'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { resolveLocale, timeLabel } from '@/app/utils/date';
import { Check, CheckCheck } from 'lucide-react';

type MessageStatus = 'sent' | 'delivered' | 'read';

interface MessageBubbleProps {
  text: string;
  isMine: boolean;
  showAvatar?: boolean;
  avatarUrl?: string;
  userName?: string;
  /** Дата/время сообщения: Date | number | { toDate(): Date } */
  time?: Date | number | { toDate: () => Date };
  /** Статус для галочек (показываем только у своих сообщений) */
  status?: MessageStatus;
}

export function MessageBubble({
  text,
  isMine,
  showAvatar = false,
  avatarUrl,
  userName = 'User',
  time,
  status,
}: MessageBubbleProps) {
  const { i18n } = useTranslation();
  const locale = resolveLocale(i18n.language);
  const initials = (userName?.trim()?.[0] || '?').toUpperCase();

  // Форматируем время только если оно передано
  const timeText = time ? timeLabel(time, { locale, use24h: true }) : null;

  return (
    <div
      className={cn(
        'flex w-full items-end gap-2 mb-1',
        isMine ? 'justify-end' : 'justify-start'
      )}
    >
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

        {/* текст сообщения */}
        <div>{text}</div>

        {/* нижняя строка: время + галочки */}
        {(timeText || (isMine && status)) && (
          <div
            className={cn(
              'mt-1 flex items-center gap-1 text-[11px] opacity-80',
              isMine ? 'justify-end' : 'justify-start'
            )}
          >
            {timeText && <span>{timeText}</span>}

            {isMine && status && (
              <span
                className={cn(
                  'inline-flex items-center',
                  // делаем иконки белыми на оранжевом и тёмно-серыми на светлом
                  isMine ? 'text-white/95' : 'text-gray-600 dark:text-gray-300'
                )}
                aria-label={
                  status === 'read'
                    ? 'Read'
                    : status === 'delivered'
                    ? 'Delivered'
                    : 'Sent'
                }
                title={
                  status === 'read'
                    ? 'Read'
                    : status === 'delivered'
                    ? 'Delivered'
                    : 'Sent'
                }
              >
                {status === 'read' ? (
                  <CheckCheck className="w-3.5 h-3.5" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
              </span>
            )}
          </div>
        )}
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
