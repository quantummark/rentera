'use client';

import InlineEdit from './InlineEdit';
import { Input } from '@/components/ui/input';

interface InlineDateProps {
  value: string; // ISO yyyy-mm-dd
  canEdit: boolean;
  onSave: (nextISO: string) => Promise<void> | void;
  className?: string;
  locale?: string; // для будущего форматтера
}

export default function InlineDate({ value, canEdit, onSave, className }: InlineDateProps) {
  return (
    <InlineEdit<string>
      value={value}
      canEdit={canEdit}
      onSave={onSave}
      className={className}
      renderView={(v) => v || <span className="text-muted-foreground">—</span>}
      renderEditor={(v, setV) => (
        <Input type="date" value={v} onChange={(e) => setV(e.target.value)} className="min-w-[200px]" />
      )}
    />
  );
}
