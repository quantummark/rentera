'use client';

import InlineEdit from './InlineEdit';
import { Input } from '@/components/ui/input';

interface InlineNumberProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  canEdit: boolean;
  onSave: (next: number) => Promise<void> | void;
  suffix?: string;
  className?: string;
}

export default function InlineNumber({
  value, min, max, step = 1, canEdit, onSave, suffix, className,
}: InlineNumberProps) {
  return (
    <InlineEdit<number>
      value={value}
      canEdit={canEdit}
      onSave={onSave}
      className={className}
      renderView={(v) => (
        <span className="font-medium">
          {v}{suffix ? ` ${suffix}` : ''}
        </span>
      )}
      renderEditor={(v, setV) => (
        <Input
          type="number"
          value={Number.isFinite(v) ? v : 0}
          onChange={(e) => setV(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="min-w-[160px]"
          autoFocus
        />
      )}
    />
  );
}
