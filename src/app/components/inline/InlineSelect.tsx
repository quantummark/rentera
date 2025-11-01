'use client';

import InlineEdit from './InlineEdit';
import CustomSelect from '@/components/ui/CustomSelect';
import { cn } from '@/lib/utils';

// Где показывать редактор
export type Presentation = 'auto' | 'inline' | 'popover' | 'sheet';

// Опция селекта
export interface InlineSelectOption<T extends string> {
  value: T;
  label: string;
}

export interface InlineSelectProps<T extends string = string> {
  value: T;
  options: InlineSelectOption<T>[];
  canEdit: boolean;
  onSave: (next: T) => Promise<void> | void;
  placeholder?: string;
  className?: string;
  /** ✏️ только по hover на md+ (на мобилке и так видно) */
  showIconOnHover?: boolean;
  /** Заголовок для Sheet (мобилка) */
  title?: string;
  /** auto = desktop→popover, mobile→sheet */
  presentation?: Presentation;
}

function getLabelByValue<T extends string>(value: T, options: InlineSelectOption<T>[]) {
  return options.find(o => o.value === value)?.label ?? String(value);
}

export default function InlineSelect<T extends string = string>({
  value,
  options,
  canEdit,
  onSave,
  placeholder,
  className,
  showIconOnHover,
  title,
  presentation = 'auto',
}: InlineSelectProps<T>) {
  const viewLabel = getLabelByValue(value, options);

  return (
    <InlineEdit<T>
      value={value}
      canEdit={canEdit}
      onSave={onSave}
      className={className}
      showIconOnHover={showIconOnHover}
      title={title}
      presentation={presentation}
      renderView={(v) =>
        viewLabel
          ? <span className="inline-block">{getLabelByValue(v, options)}</span>
          : <span className={cn('text-muted-foreground', !canEdit && 'italic')}>
              {placeholder ?? ''}
            </span>
      }
      renderEditor={(draft, setDraft) => (
        <CustomSelect
          value={draft}
          onChange={(next) => setDraft(next as T)}
          options={options}
          placeholder={placeholder}
          className="min-w-[260px]"
        />
      )}
    />
  );
}