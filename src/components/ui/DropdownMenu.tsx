'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function DropdownMenu({
  trigger,
  children,
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      {/* Кнопка открытия */}
      <div onClick={() => setOpen(prev => !prev)}>{trigger}</div>

      {/* Выпадающее меню */}
      {open && (
        <div
          className={cn(
            'absolute right-0 mt-2 rounded-xl shadow-lg border border-border z-50 transition-all',
            'bg-white dark:bg-zinc-900 text-foreground',
            'py-2 min-w-max',
            className
          )}
        >
          {/* Обёртка для элементов */}
          <div className="flex flex-col">{children}</div>
        </div>
      )}
    </div>
  );
}
