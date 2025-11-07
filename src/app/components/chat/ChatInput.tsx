'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Paperclip, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  message: string;
  onMessageChange: (val: string) => void;
  onSend: () => void;
  onAttachFile: (file: File) => void;
  isSending?: boolean;
  /** Для presence: true при наборе, false — при паузе/blur */
  onTyping?: (state: boolean) => void;
  /** Таймаут «тихого режима» (мс) после последнего ввода */
  typingIdleMs?: number;
}

export function ChatInput({
  message,
  onMessageChange,
  onSend,
  onAttachFile,
  isSending = false,
  onTyping,
  typingIdleMs = 3000,
}: ChatInputProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimerRef = useRef<number | null>(null);
  const lastValueRef = useRef<string>(message);

  // Очистка таймера
  const clearTypingTimer = useCallback(() => {
    if (typingTimerRef.current !== null) {
      window.clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
  }, []);

  // Запустить/перезапустить idle-таймер
  const kickTypingIdle = useCallback(() => {
    clearTypingTimer();
    if (!onTyping) return;
    typingTimerRef.current = window.setTimeout(() => {
      onTyping(false);
      typingTimerRef.current = null;
    }, typingIdleMs);
  }, [clearTypingTimer, onTyping, typingIdleMs]);

  // Обработчик файла
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onAttachFile(f);
    // сброс для повторной загрузки одного и того же файла
    e.target.value = '';
  };

  // Изменение текста + триггер onTyping(true)
  const handleChange = (val: string) => {
    onMessageChange(val);
    if (!onTyping) return;
    const prev = lastValueRef.current;
    lastValueRef.current = val;

    // Если реально появилась активность
    if (val !== prev) {
      onTyping(true);
      kickTypingIdle();
    }
  };

  // Отправка по Enter (без Shift)
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  // При потере фокуса — перестаём «печатать»
  const handleBlur = () => {
    if (!onTyping) return;
    clearTypingTimer();
    onTyping(false);
  };

  // Очистить таймеры на размонтировании
  useEffect(() => {
    return () => {
      clearTypingTimer();
    };
  }, [clearTypingTimer]);

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-3',
        'bg-card shadow-sm',
        'sticky bottom-0 z-10'
      )}
    >
      {/* attach file */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="p-2 rounded-full hover:bg-muted/20"
        aria-label={t('chat.input.attachFile', 'Attach file')}
      >
        <Paperclip className="w-5 h-5 text-foreground" aria-hidden="true" />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFile}
      />

      {/* message input — шире и выше */}
      <Input
        value={message}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={t('chat.input.placeholder', 'Напишите сообщение...')}
        className={cn(
          'flex-1 text-sm',
          'h-11 md:h-12', // повыше поля
          'rounded-full px-4' // более «мессенджерный» вид
        )}
        disabled={isSending}
        aria-label={t('chat.input.placeholder', 'Напишите сообщение...')}
      />

      {/* send */}
      <Button
        onClick={onSend}
        disabled={isSending || !message.trim()}
        className="p-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white"
        aria-label={t('chat.input.send', 'Send')}
      >
        <Send className="w-5 h-5" aria-hidden="true" />
      </Button>
    </div>
  );
}
