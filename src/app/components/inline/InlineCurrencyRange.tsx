'use client';

import InlineEdit from './InlineEdit';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CurrencyRange {
  from: number | null;
  to: number | null;
  currency: string;
}

interface InlineCurrencyRangeProps {
  value: CurrencyRange;
  canEdit: boolean;
  onSave: (next: CurrencyRange) => Promise<void> | void;
  className?: string;
}

export default function InlineCurrencyRange({ value, canEdit, onSave, className }: InlineCurrencyRangeProps) {
  return (
    <InlineEdit<CurrencyRange>
      value={value}
      canEdit={canEdit}
      onSave={onSave}
      className={className}
      renderView={(v) => (
        <span className="font-medium">
          {v.from ?? '—'}–{v.to ?? '—'} {v.currency}
        </span>
      )}
      renderEditor={(v, setV) => (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="From"
            value={v.from ?? ''}
            onChange={(e) => setV({ ...v, from: e.target.value === '' ? null : Number(e.target.value) })}
            className={cn('w-28')}
          />
          <span className="text-muted-foreground">—</span>
          <Input
            type="number"
            placeholder="To"
            value={v.to ?? ''}
            onChange={(e) => setV({ ...v, to: e.target.value === '' ? null : Number(e.target.value) })}
            className={cn('w-28')}
          />
          <Input
            type="text"
            placeholder="USD"
            value={v.currency}
            onChange={(e) => setV({ ...v, currency: e.target.value.toUpperCase().slice(0, 3) })}
            className="w-20 uppercase"
          />
        </div>
      )}
    />
  );
}
