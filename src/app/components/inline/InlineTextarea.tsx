'use client';

import { Textarea } from '@/components/ui/textarea';
import InlineEdit from './InlineEdit';

interface InlineTextareaProps {
  value: string;
  canEdit: boolean;
  placeholder?: string;
  rows?: number;
  onSave: (next: string) => Promise<void> | void;
  className?: string;
}

export default function InlineTextarea({
  value, canEdit, onSave, placeholder, rows = 4, className,
}: InlineTextareaProps) {
  return (
    <InlineEdit<string>
      value={value}
      canEdit={canEdit}
      onSave={onSave}
      className={className}
      renderView={(v) => v || <span className="text-muted-foreground">{placeholder}</span>}
      renderEditor={(v, setV) => (
        <Textarea value={v} onChange={(e) => setV(e.target.value)} rows={rows} className="min-w-[320px]" autoFocus />
      )}
    />
  );
}
