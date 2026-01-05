'use client';

import { useState } from 'react';
import { Link as LinkIcon, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface CopyLinkButtonProps {
  href: string; // относительный путь, типа /listing/123
  className?: string;
}

export default function CopyLinkButton({ href, className }: CopyLinkButtonProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const copy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const url =
        typeof window !== 'undefined'
          ? `${window.location.origin}${href}`
          : href;

      await navigator.clipboard.writeText(url);

      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // тихо, без ошибок в UI (можно потом добавить toast)
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={t('listing:copyLink', 'Скопировать ссылку')}
      className={cn(
        `
        relative inline-flex items-center justify-center
        w-9 h-9 rounded-full
        bg-black/30 backdrop-blur-md
        border border-white/10
        text-white
        hover:bg-black/45
        transition
        active:scale-95
        `,
        className
      )}
    >
      {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}

      {/* мини подсказка */}
      <span
        className={cn(
          "pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap",
          "rounded-md px-2 py-1 text-xs",
          "bg-black/70 text-white backdrop-blur-md",
          "transition-opacity",
          copied ? "opacity-100" : "opacity-0"
        )}
      >
        {t('listing:copied', 'Скопировано')}
      </span>
    </button>
  );
}
