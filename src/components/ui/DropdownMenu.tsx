'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

type Align = 'start' | 'center' | 'end';
type Side = 'bottom' | 'top';

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  align?: Align;
  side?: Side;
  sideOffset?: number;
  open?: boolean;
  onOpenChange?: (next: boolean) => void;
  closeOnSelect?: boolean;
}

/** Пункт меню: премиум hover/focus */
export function DropdownItem({
  children,
  onSelect,
  disabled = false,
  className,
  role = 'menuitem',
}: {
  children: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  className?: string;
  role?: 'menuitem';
}) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) return;
      onSelect?.();
    },
    [disabled, onSelect]
  );

  return (
    <button
      type="button"
      role={role}
      data-menu-item
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        'w-full text-left text-sm px-3 py-2 rounded-xl',
        'text-foreground transition-colors',
        'hover:bg-foreground/5',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/35',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
}

export function DropdownDivider() {
  return <div className="my-1 h-px bg-border/70" role="separator" />;
}

export default function DropdownMenu({
  trigger,
  children,
  className,
  align = 'end',
  side = 'bottom',
  sideOffset = 10,
  open: controlledOpen,
  onOpenChange,
  closeOnSelect = true,
}: DropdownMenuProps) {
  // ✅ хуки всегда в одном и том же порядке
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const [computedSide, setComputedSide] = useState<Side>(side);

  useEffect(() => setMounted(true), []);

  const open = controlledOpen ?? uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [controlledOpen, onOpenChange]
  );

  const onTriggerClick = useCallback(() => setOpen(!open), [open, setOpen]);

  // theme может быть undefined до маунта — подстрахуем
  const safeTheme = mounted ? theme : 'light';
  const isDark = safeTheme === 'dark';

  // клик вне
  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current && !rootRef.current.contains(target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [open, setOpen]);

  // клавиатура
  useEffect(() => {
    if (!open) return;

    const getItems = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>('[data-menu-item]:not([disabled])') ?? []
      );

    let focusIndex = -1;
    const focusItem = (idx: number) => {
      const items = getItems();
      if (items.length === 0) return;
      const next = ((idx % items.length) + items.length) % items.length;
      focusIndex = next;
      items[next].focus({ preventScroll: true });
    };

    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          setOpen(false);
          break;
        case 'ArrowDown':
          e.preventDefault();
          focusItem(focusIndex + 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          focusItem(focusIndex - 1);
          break;
        case 'Home':
          e.preventDefault();
          focusItem(0);
          break;
        case 'End':
          e.preventDefault();
          focusItem(Number.MAX_SAFE_INTEGER);
          break;
        case 'Enter': {
          const el = document.activeElement as HTMLElement | null;
          if (el?.dataset?.menuItem !== undefined) {
            el.click();
            if (closeOnSelect) setOpen(false);
          }
          break;
        }
        default:
          break;
      }
    };

    document.addEventListener('keydown', onKey);
    setTimeout(() => focusItem(0), 0);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, setOpen, closeOnSelect]);

  // авто-flip
  useEffect(() => {
    if (!open) return;
    const trig = triggerRef.current;
    const panel = panelRef.current;
    if (!trig || !panel) return;

    const trigRect = trig.getBoundingClientRect();
    const panelHeight = panel.offsetHeight;

    const spaceBottom = window.innerHeight - trigRect.bottom - sideOffset;
    const spaceTop = trigRect.top - sideOffset;

    if (side === 'bottom' && spaceBottom < panelHeight && spaceTop > panelHeight) {
      setComputedSide('top');
    } else if (side === 'top' && spaceTop < panelHeight && spaceBottom > panelHeight) {
      setComputedSide('bottom');
    } else {
      setComputedSide(side);
    }
  }, [open, side, sideOffset]);

  // закрытие при клике на item
  const onItemClickCapture = useCallback(
    (e: React.SyntheticEvent) => {
      if (!closeOnSelect) return;
      const target = e.target as HTMLElement;
      if (target.closest('[data-menu-item]')) setOpen(false);
    },
    [closeOnSelect, setOpen]
  );

  const sideClass = computedSide === 'bottom' ? 'top-full' : 'bottom-full';
  const alignClass =
    align === 'start'
      ? 'left-0'
      : align === 'center'
        ? 'left-1/2 -translate-x-1/2'
        : 'right-0';

  return (
    <div ref={rootRef} className="relative inline-block text-left">
      {/* Триггер */}
      <div ref={triggerRef} onClick={onTriggerClick} className="select-none">
        {trigger}
      </div>

      {/* Меню */}
      <div
        hidden={!open}
        ref={panelRef}
        role="menu"
        aria-hidden={!open}
        className={cn(
          'absolute z-[9999] min-w-[12rem] overflow-hidden',
          'rounded-2xl border border-border/70',
          'backdrop-blur-xl backdrop-saturate-150',
          isDark
  ? 'bg-zinc-950/92 text-foreground'
  : 'bg-white/98 text-foreground ring-1 ring-black/10',
          'shadow-[0_18px_60px_-24px_rgba(0,0,0,0.65)]',
          'origin-top-right transition-all duration-150 ease-out motion-reduce:transition-none',
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
          sideClass,
          alignClass,
          className
        )}
        style={{
          marginTop: computedSide === 'bottom' ? sideOffset : undefined,
          marginBottom: computedSide === 'top' ? sideOffset : undefined,
          colorScheme: isDark ? 'dark' : 'light',
        }}
        onClickCapture={onItemClickCapture}
      >
        <div className="relative z-10 p-2 space-y-1">{children}</div>
      </div>
    </div>
  );
}
