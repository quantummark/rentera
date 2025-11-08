'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

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

/** Элемент меню: без какого-либо выделения (hover/focus/active) */
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
        // типографика
        'w-full text-left text-sm px-3 py-2 rounded-md',
        // базовые цвета из темы
        'bg-transparent text-foreground',
        // никаких эффектов выделения
        '!outline-none focus:!outline-none',
        '!ring-0 focus:!ring-0 focus-visible:!ring-0',
        '!shadow-none focus:!shadow-none active:!shadow-none',
        '!bg-transparent hover:!bg-transparent focus:!bg-transparent active:!bg-transparent',
        '!text-foreground hover:!text-foreground focus:!text-foreground active:!text-foreground',
        // disabled
        'disabled:opacity-50 disabled:cursor-not-allowed',
        // плавности тут не нужны, но оставим если вдруг текст/иконки меняются
        'transition-none',
        className
      )}
    >
      {children}
    </button>
  );
}

export function DropdownDivider() {
  return <div className="my-1 h-px bg-border" role="separator" />;
}

export default function DropdownMenu({
  trigger,
  children,
  className,
  align = 'end',
  side = 'bottom',
  sideOffset = 8,
  open: controlledOpen,
  onOpenChange,
  closeOnSelect = true,
}: DropdownMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;

  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [computedSide, setComputedSide] = useState<Side>(side);

  const setOpen = useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [controlledOpen, onOpenChange]
  );

  const onTriggerClick = useCallback(() => setOpen(!open), [open, setOpen]);

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

  // клавиатура (без визуального фокуса у пунктов)
  useEffect(() => {
    if (!open) return;

    const getItems = () =>
      Array.from(panelRef.current?.querySelectorAll<HTMLElement>('[data-menu-item]:not([disabled])') ?? []);

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
    align === 'start' ? 'left-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'right-0';

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
          'absolute z-50 min-w-[12rem] rounded-xl',
          sideClass,
          alignClass,
          'origin-top-right transition-all duration-150 ease-out motion-reduce:transition-none',
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
          // визуал панели
          'bg-popover text-popover-foreground shadow-lg ring-1 ring-black/10',
          'backdrop-blur supports-[backdrop-filter]:bg-popover/90',

          // ❌ глобальный сброс: никакого фона/тени/рамки на hover/focus/active
          '[&_[data-menu-item]:hover]:!bg-transparent [&_[data-menu-item]:focus]:!bg-transparent [&_[data-menu-item]:active]:!bg-transparent',
          '[&_[data-menu-item]_*:hover]:!bg-transparent [&_[data-menu-item]_*:focus]:!bg-transparent [&_[data-menu-item]_*:active]:!bg-transparent',
          '[&_[data-menu-item]:hover]:!shadow-none [&_[data-menu-item]:focus]:!shadow-none [&_[data-menu-item]:active]:!shadow-none',
          '[&_[data-menu-item]:hover]:!ring-0 [&_[data-menu-item]:focus]:!ring-0 [&_[data-menu-item]:active]:!ring-0',

          // фикс схемы цветов строго по теме сайта
          '[color-scheme:light] dark:[color-scheme:dark]',

          className
        )}
        style={{
          marginTop: computedSide === 'bottom' ? sideOffset : undefined,
          marginBottom: computedSide === 'top' ? sideOffset : undefined,
        }}
        onClickCapture={onItemClickCapture}
      >

        {/* контент */}
        <div className="relative z-10 p-2 space-y-1">
          {children}
        </div>
      </div>
    </div>
  );
}
