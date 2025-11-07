// components/chat/ChatHeader.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  otherUserName: string;
  otherUserAvatar?: string;
  /** Онлайн индикатор из presence */
  isOnline?: boolean;
  /** Если true — отображаем "Печатает…" вместо статуса */
  typing?: boolean;
  onBack?: () => void;
  onDeleteChat: () => void;
  onBlockUser: () => void;
  onReportUser: () => void;
}

export function ChatHeader({
  otherUserName,
  otherUserAvatar,
  isOnline = false,
  typing = false,
  onBack,
  onDeleteChat,
  onBlockUser,
  onReportUser,
}: ChatHeaderProps) {
  const { t } = useTranslation('messages');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Закрытие меню кликом вне
  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, []);

  // Закрытие по Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((o) => !o);
  }, []);

  const closeMenuAnd = (fn: () => void) => {
    setMenuOpen(false);
    fn();
  };

  const statusText = typing
    ? t('messages.typing', 'Печатает…')
    : isOnline
    ? t('messages.online', 'В сети')
    : t('messages.offline', 'Не в сети');

  return (
    <header
      className={cn(
        'relative flex items-center px-4 py-2 gap-3',
        'bg-card shadow-sm',
        'sticky top-0 z-10'
      )}
    >
      {onBack && (
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-muted/20 md:hidden"
          aria-label={t('messages.back', 'Назад')}
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      )}

      {/* Аватар с индикатором статуса */}
      <div className="relative">
        <Avatar className="w-10 h-10">
          {otherUserAvatar ? (
            <AvatarImage src={otherUserAvatar} alt={otherUserName} />
          ) : (
            <AvatarFallback>{otherUserName?.[0] ?? '?'}</AvatarFallback>
          )}
        </Avatar>

        {/* статус-точка */}
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-card',
            isOnline ? 'bg-emerald-500' : 'bg-gray-400 dark:bg-gray-500'
          )}
          aria-hidden="true"
        />
        {/* лёгкая анимация пульса для online */}
        {isOnline && (
          <span
            className={cn(
              'absolute -bottom-[2px] -right-[2px] h-3.5 w-3.5 rounded-full',
              'animate-ping',
              'bg-emerald-500/40'
            )}
            aria-hidden="true"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-base font-semibold text-foreground">
          {otherUserName}
        </span>
        <span
          className={cn(
            'text-xs',
            typing
              ? 'text-orange-500'
              : isOnline
              ? 'text-emerald-600'
              : 'text-muted-foreground'
          )}
        >
          {statusText}
        </span>
      </div>

      <div className="ml-auto relative" ref={menuRef}>
        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className="p-2 rounded-full hover:bg-muted/20"
          aria-label={t('messages.menuLabel')}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          <MoreHorizontal className="w-5 h-5 text-foreground" />
        </button>

        {menuOpen && (
          <div
            role="menu"
            aria-orientation="vertical"
            className={cn(
              'absolute z-50 right-0 mt-2 w-44 overflow-hidden rounded-lg',
              'bg-popover shadow-lg ring-1 ring-black/10',
              'backdrop-blur supports-[backdrop-filter]:bg-popover/90'
            )}
          >
            <button
              role="menuitem"
              onClick={() => closeMenuAnd(onDeleteChat)}
              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-muted/20"
            >
              {t('messages.delete')}
            </button>
            <button
              role="menuitem"
              onClick={() => closeMenuAnd(onBlockUser)}
              className="block w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-muted/20"
            >
              {t('messages.block')}
            </button>
            <button
              role="menuitem"
              onClick={() => closeMenuAnd(onReportUser)}
              className="block w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-muted/20"
            >
              {t('messages.report')}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
