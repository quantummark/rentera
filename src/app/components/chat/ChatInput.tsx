'use client';

import { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Paperclip, Image as ImageIcon, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  message: string;
  onMessageChange: (val: string) => void;
  onSend: () => void;
  onAttachFile: (file: File) => void;
  onAttachPhoto: (file: File) => void;
  isSending?: boolean;
}

export function ChatInput({
  message,
  onMessageChange,
  onSend,
  onAttachFile,
  onAttachPhoto,
  isSending = false,
}: ChatInputProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onAttachFile(f);
    e.target.value = '';
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onAttachPhoto(f);
    e.target.value = '';
  };

  return (
    <div
      className={cn(
        'flex items-center px-4 py-3 space-x-2',
        'bg-card shadow-sm',        // ← карточный фон и тень
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
        <Paperclip className="w-5 h-5 text-foreground" aria-label="Attach file" />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFile}
      />

      {/* attach photo */}
      <button
        type="button"
        onClick={() => photoInputRef.current?.click()}
        className="p-2 rounded-full hover:bg-muted/20"
        aria-label={t('chat.input.attachPhoto', 'Attach photo')}
      >
        <ImageIcon className="w-5 h-5 text-foreground" aria-label="Attach photo" />
      </button>
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhoto}
      />

      {/* message input */}
      <Input
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        placeholder={t('chat.input.placeholder', 'Напишите сообщение...')}
        className="flex-1 text-sm"
        disabled={isSending}
      />

      {/* send */}
      <Button
        onClick={onSend}
        disabled={isSending || !message.trim()}
        className="p-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white"
        aria-label={t('chat.input.send', 'Send')}
      >
        <Send className="w-5 h-5" />
      </Button>
    </div>
  );
}
