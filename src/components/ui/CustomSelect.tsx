'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Выберите...',
  className = '',
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Закрыть при клике вне селекта
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find(opt => opt.value === value);

  const isScrollable = options.length > 6;

  return (
    <div ref={ref} className={cn('relative', className)}>
      {/* Кнопка селекта */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex justify-between items-center px-4 py-2 border border-input rounded-md bg-background hover:bg-muted transition text-sm md:text-base"
      >
        <span className="truncate">{selected?.label || placeholder}</span>
        <ChevronDown className="w-4 h-4 opacity-60" />
      </button>

      {/* Выпадающий список */}
      {open && (
        <div
          className={cn(
            'absolute z-50 mt-1 w-full rounded-xl bg-zinc-900 border border-white/20 shadow-lg overflow-hidden',
            'animate-in fade-in-0 zoom-in-95 duration-150'
          )}
        >
          <div
            className={cn(
              'flex flex-col',
              isScrollable && 'max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent'
            )}
          >
            {options.map(opt => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  'px-4 py-2 text-sm md:text-base text-white hover:bg-zinc-800 hover:text-orange-400 cursor-pointer transition-colors duration-150',
                  value === opt.value && 'bg-zinc-800 text-orange-400 font-medium'
                )}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
