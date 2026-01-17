'use client';

import { Checkbox } from '@/components/ui/checkbox';

type Props = {
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  label: string;
};

export default function ComplaintConfirmBlock({
  checked,
  onCheckedChange: onChange,
  label
}: Props) {
  return (
    <div className="rounded-2xl border bg-background/60 p-4 md:p-6 shadow-sm">
      <label className="flex cursor-pointer items-start gap-3 text-sm">
        <Checkbox
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1"
        />
        <span className="opacity-90">{label}</span>
      </label>
    </div>
  );
}
