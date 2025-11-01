'use client';

import InlineEdit from './InlineEdit';
import { Switch } from '@/components/ui/switch';

interface InlineSwitchProps {
  value: boolean;
  canEdit: boolean;
  onSave: (next: boolean) => Promise<void> | void;
  className?: string;
  trueLabel?: string;
  falseLabel?: string;
}

export default function InlineSwitch({
  value, canEdit, onSave, className, trueLabel = 'Yes', falseLabel = 'No',
}: InlineSwitchProps) {
  return (
    <InlineEdit<boolean>
      value={value}
      canEdit={canEdit}
      onSave={onSave}
      className={className}
      showIconOnHover={false}
      renderView={(v) => <span className="font-medium">{v ? trueLabel : falseLabel}</span>}
      renderEditor={(v, setV) => (
        <div className="flex items-center gap-2">
          <Switch checked={v} onCheckedChange={setV} />
          <span className="text-sm text-muted-foreground">{v ? trueLabel : falseLabel}</span>
        </div>
      )}
    />
  );
}
