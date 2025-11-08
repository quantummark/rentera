'use client';

import { useEffect, useRef, useCallback } from 'react';
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
  onTyping?: (state: boolean) => void;
  typingIdleMs?: number;
  maxRows?: number;
}

export function ChatInput({
  message,
  onMessageChange,
  onSend,
  onAttachFile,
  isSending = false,
  onTyping,
  typingIdleMs = 3000,
  maxRows = 6,
}: ChatInputProps) {
  const { t } = useTranslation('messages');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimerRef = useRef<number | null>(null);
  const lastValueRef = useRef<string>(message);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // typing timers
  const clearTypingTimer = useCallback(() => {
    if (typingTimerRef.current !== null) {
      window.clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
  }, []);

  const kickTypingIdle = useCallback(() => {
    clearTypingTimer();
    if (!onTyping) return;
    typingTimerRef.current = window.setTimeout(() => {
      onTyping(false);
      typingTimerRef.current = null;
    }, typingIdleMs);
  }, [clearTypingTimer, onTyping, typingIdleMs]);

  // file
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onAttachFile(f);
    e.target.value = '';
  };

  // autosize textarea
  const autosize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = '0px';
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight || '20');
    const maxHeight = lineHeight * maxRows;
    const next = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${next}px`;
  }, [maxRows]);

  useEffect(() => {
    autosize();
  }, [message, autosize]);

  const handleChange = (val: string) => {
    onMessageChange(val);
    if (!onTyping) return;
    const prev = lastValueRef.current;
    lastValueRef.current = val;
    if (val !== prev) {
      onTyping(true);
      kickTypingIdle();
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleBlur = () => {
    if (!onTyping) return;
    clearTypingTimer();
    onTyping(false);
  };

  useEffect(() => {
    return () => {
      clearTypingTimer();
    };
  }, [clearTypingTimer]);

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3',
        'bg-card shadow-sm'
      )}
    >
      {/* attach file */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-muted/20 transition-colors"
        aria-label={t('messages.attachFile')}
      >
        <Paperclip className="h-5 w-5 text-foreground" />
      </button>
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFile} />

      {/* textarea — прямоугольная с мягким скруглением */}
      <div className="flex-1 flex items-center">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={t('messages.input')}
          className={cn(
            'w-full resize-none overflow-y-auto',
            'rounded-lg bg-background px-3 py-2 text-sm leading-6',
            'text-foreground placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-orange-500/40'
          )}
          rows={1}
          maxLength={4000}
          disabled={isSending}
        />
      </div>

      {/* send */}
      <Button
        onClick={onSend}
        disabled={isSending || !message.trim()}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors"
        aria-label={t('messages.send')}
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
}
