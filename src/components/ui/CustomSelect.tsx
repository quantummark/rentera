'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;

  compact?: boolean;
  maxCompactWidthClassName?: string;
}

type DropdownPos = {
  top: number;
  left: number;
  width: number;
  // maxHeight для безопасного размещения
  maxHeight: number;
  // открываемся вверх или вниз
  placement: 'bottom' | 'top';
};

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Выберите...',
  className = '',
  compact = true,
  maxCompactWidthClassName = 'max-w-[220px] sm:max-w-[260px]',
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<DropdownPos | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const selected = useMemo(() => options.find(opt => opt.value === value), [options, value]);
  const isScrollable = options.length > 7;

  const surface = isDark
    ? 'bg-white/8 border-white/15 text-white hover:bg-white/10'
    : 'bg-white/70 border-slate-200 text-slate-900 hover:bg-white';

  const surfaceOpen = isDark
    ? 'ring-1 ring-orange-400/35 border-orange-300/30'
    : 'ring-1 ring-orange-400/25 border-orange-300/35';

  const dropdownSurface = isDark
    ? 'bg-zinc-950/85 border-white/15 text-white'
    : 'bg-white/95 border-slate-200 text-slate-900';

  const optionHover = isDark ? 'hover:bg-white/8' : 'hover:bg-slate-50';
  const optionActive = isDark ? 'bg-white/10 text-orange-300' : 'bg-orange-50 text-orange-700';

  // чтобы портал не ломался на SSR
  useEffect(() => setMounted(true), []);

  const computePosition = useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const gap = 8; // расстояние от кнопки до dropdown
    const viewportPadding = 12;

    // ширина dropdown: либо по кнопке (в full), либо min(по контенту, но не меньше кнопки) в compact
    const desiredWidth = compact ? Math.max(220, rect.width) : rect.width;

    // посчитаем доступное место сверху/снизу
    const spaceBelow = window.innerHeight - rect.bottom - viewportPadding;
    const spaceAbove = rect.top - viewportPadding;

    // maxHeight — чтобы не улетало за экран
    const maxHeight = Math.max(160, Math.min(360, Math.max(spaceBelow, spaceAbove)));

    // решаем, куда открываться
    const placement: 'bottom' | 'top' = spaceBelow >= 220 || spaceBelow >= spaceAbove ? 'bottom' : 'top';

    const top =
      placement === 'bottom'
        ? rect.bottom + gap
        : Math.max(viewportPadding, rect.top - gap - maxHeight);

    // clamp left, чтобы dropdown не вылазил за экран
    const left = Math.min(
      Math.max(viewportPadding, rect.left),
      window.innerWidth - viewportPadding - desiredWidth
    );

    setPos({
      top,
      left,
      width: desiredWidth,
      maxHeight,
      placement,
    });
  }, [compact]);

  // пересчитывать позицию при открытии
  useEffect(() => {
    if (!open) return;
    computePosition();

    const onScroll = () => computePosition();
    const onResize = () => computePosition();

    // capture=true чтобы ловить скролл даже внутри вложенных контейнеров
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [open, computePosition]);

  // Закрыть при клике вне (учитываем dropdown в портале)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const rootEl = rootRef.current;
      const dropEl = dropdownRef.current;

      if (rootEl && rootEl.contains(target)) return;
      if (dropEl && dropEl.contains(target)) return;

      setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Закрыть по ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const dropdown = open && mounted && pos
    ? createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            width: pos.width,
            zIndex: 9999,
          }}
          className={cn(
            'overflow-hidden rounded-2xl border shadow-lg backdrop-blur-md',
            dropdownSurface,
            'animate-in fade-in-0 zoom-in-95 duration-150'
          )}
        >
          <div
            className={cn(
              'flex flex-col py-1',
              isScrollable && 'overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-400/40 scrollbar-track-transparent'
            )}
            style={{ maxHeight: pos.maxHeight }}
          >
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  'text-left px-4 py-2',
                  'text-sm md:text-base',
                  'transition-colors duration-150',
                  optionHover,
                  value === opt.value && cn(optionActive, 'font-semibold')
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(prev => !prev)}
        aria-expanded={open}
        className={cn(
          compact ? 'inline-flex w-auto' : 'flex w-full',
          compact ? maxCompactWidthClassName : '',
          'items-center justify-between gap-2',
          'px-4 py-2.5',
          'rounded-full border',
          'text-sm md:text-base font-medium',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-orange-400/35',
          surface,
          open && surfaceOpen
        )}
      >
        <span className={cn('truncate', compact ? 'max-w-full' : '')}>
          {selected?.label || placeholder}
        </span>

        <ChevronDown
          className={cn(
            'w-4 h-4 opacity-70 transition-transform duration-200 shrink-0',
            open && 'rotate-180'
          )}
        />
      </button>

      {dropdown}
    </div>
  );
}
