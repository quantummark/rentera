// components/chat/ChatHeader.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  otherUserName: string;
  otherUserAvatar?: string;
  isOnline?: boolean;
  onBack?: () => void;          // ← добавили «назад»
  onDeleteChat: () => void;
  onBlockUser: () => void;
  onReportUser: () => void;
}

export function ChatHeader({
  otherUserName,
  otherUserAvatar,
  isOnline = false,
  onBack,
  onDeleteChat,
  onBlockUser,
  onReportUser,
}: ChatHeaderProps) {
  const { t } = useTranslation('messages');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Закрытие меню кликом вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={cn(
        'relative flex items-center px-4 py-2 space-x-3',
        'bg-card shadow-sm',          // ← карточный фон и тень
        'sticky top-0 z-10'
      )}
    >
      {onBack && (
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-muted/20 md:hidden"
          aria-label={t('messages.back')}
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      )}

      <Avatar className="w-10 h-10">
        {otherUserAvatar ? (
          <AvatarImage src={otherUserAvatar} alt={otherUserName} />
        ) : (
          <AvatarFallback>{otherUserName[0]}</AvatarFallback>
        )}
      </Avatar>

      <div className="flex flex-col leading-tight">
        <span className="text-base font-semibold text-foreground">
          {otherUserName}
        </span>
        <span
          className={cn(
            'text-xs',
            isOnline ? 'text-green-500' : 'text-gray-500'
          )}
        >
          {isOnline
            ? t('messages.online')
            : t('messages.offline')}
        </span>
      </div>

      <div className="ml-auto relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="p-2 rounded-full hover:bg-muted/20"
          aria-label={t('messages.menuLabel')}
        >
          <MoreHorizontal className="w-5 h-5 text-foreground" />
        </button>

        {menuOpen && (
          <div
            className="absolute z-50 right-0 mt-2 w-44 rounded-lg bg-white
                       shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
          >
            <button
              onClick={onDeleteChat}
              className="block w-full px-4 py-2 text-sm text-red-500 hover:bg-muted/20 text-left"
            >
              {t('messages.delete')}
            </button>
            <button
              onClick={onBlockUser}
              className="block w-full px-4 py-2 text-sm text-orange-500 hover:bg-muted/20 text-left"
            >
              {t('messages.block')}
            </button>
            <button
              onClick={onReportUser}
              className="block w-full px-4 py-2 text-sm text-blue-500 hover:bg-muted/20 text-left"
            >
              {t('messages.report')}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
