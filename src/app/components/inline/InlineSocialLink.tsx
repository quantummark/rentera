'use client';

import InlineEdit from './InlineEdit';
import { Input } from '@/components/ui/input';

interface InlineSocialLinkProps {
  value: string;
  canEdit: boolean;
  onSave: (next: string) => Promise<void> | void;
  placeholder?: string;
  className?: string;
  label?: string; // 👈 добавили
}

function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export default function InlineSocialLink({
  value,
  canEdit,
  onSave,
  placeholder,
  className,
  label, // 👈 получаем
}: InlineSocialLinkProps) {
  return (
    <InlineEdit<string>
      value={value}
      canEdit={canEdit}
      onSave={(v) => onSave(sanitizeUrl(v))}
      className={className}
      renderView={(v) =>
        v ? (
          <a
            href={v}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 text-foreground hover:text-orange-500 transition"
          >
            {label ?? v} {/* 👈 если есть label — показываем слово */}
          </a>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )
      }
      renderEditor={(v, setV) => (
        <Input
          value={v}
          onChange={(e) => setV(e.target.value)}
          placeholder={placeholder}
          className="min-w-[320px]"
          autoFocus
        />
      )}
    />
  );
}
