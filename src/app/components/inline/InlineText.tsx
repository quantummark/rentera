'use client';

import { Input } from '@/components/ui/input';
import InlineEdit from './InlineEdit';

interface InlineTextProps {
  value: string;
  canEdit: boolean;
  placeholder?: string;
  onSave: (next: string) => Promise<void> | void;
  className?: string;
}

export default function InlineText({ value, canEdit, onSave, placeholder, className }: InlineTextProps) {
  return (
    <InlineEdit<string>
      value={value}
      canEdit={canEdit}
      onSave={onSave}
      className={className}
      renderView={(v) => v || <span className="text-muted-foreground">{placeholder}</span>}
      renderEditor={(v, setV) => (
        <Input value={v} onChange={(e) => setV(e.target.value)} className="min-w-[260px]" autoFocus />
      )}
    />
  );
}
