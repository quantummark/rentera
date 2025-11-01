'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useTranslation } from 'react-i18next';

export interface InlineEditProps<T> {
  value: T;
  canEdit: boolean;
  renderView: (value: T) => React.ReactNode;
  renderEditor: (value: T, setValue: (next: T) => void) => React.ReactNode;
  onSave: (next: T) => Promise<void> | void;
  className?: string;
  /**
   * Если true — показывать ✏️ только по hover (на md+),
   * на мобильных всё равно видно сразу.
   * По умолчанию false — ✏️ видно сразу в режиме редактирования.
   */
  showIconOnHover?: boolean;
  /**
   * Способ показа редактора:
   *  - 'auto' (по умолчанию): sheet на мобилке, popover на десктопе
   *  - 'inline': как было раньше — без оверлеев
   *  - 'popover': всегда поповер
   *  - 'sheet': всегда шит
   */
  presentation?: 'auto' | 'inline' | 'popover' | 'sheet';
  /** Коллбек для внешнего управления стилями контейнера (напр. поднимать z-index плитки) */
  onEditingChange?: (editing: boolean) => void;
  /** Заголовок редактора (для sheet; можно i18n-ить снаружи) */
  title?: string;
}

function useIsMobile(breakpoint = 640) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = () => setMobile(mq.matches);
    handler();
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, [breakpoint]);
  return mobile;
}

export default function InlineEdit<T>({
  value,
  canEdit,
  renderView,
  renderEditor,
  onSave,
  className,
  showIconOnHover = false,
  presentation = 'auto',
  onEditingChange,
  title,
}: InlineEditProps<T>) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<T>(value);
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile(); // sm breakpoint
  const { t } = useTranslation('common');

  useEffect(() => {
    onEditingChange?.(editing);
  }, [editing, onEditingChange]);

  // ресолвим способ показа
  const resolvedPresentation = useMemo<'inline' | 'popover' | 'sheet'>(() => {
    if (presentation === 'auto') return isMobile ? 'sheet' : 'popover';
    if (presentation === 'popover' || presentation === 'sheet' || presentation === 'inline') {
      return presentation;
    }
    return 'inline';
  }, [presentation, isMobile]);

  const start = () => {
    if (!canEdit) return;
    setDraft(value);
    setEditing(true);
  };

  const cancel = () => {
    setEditing(false);
    setDraft(value);
  };

  const save = async () => {
    setLoading(true);
    try {
      await onSave(draft);
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  // На мобильных ✏️ всегда видно; на десктопе — либо всегда,
  // либо только по hover (если showIconOnHover=true)
  const iconVisibility = showIconOnHover
    ? 'md:opacity-0 md:group-hover:opacity-100 opacity-100'
    : 'opacity-100';

  // ===== inline presentation (старый режим) =====
  if (resolvedPresentation === 'inline') {
    return (
      <div className={cn('group relative', className)}>
        {!editing ? (
          <div className="inline-flex items-center gap-2">
            <span>{renderView(value)}</span>
            {canEdit && (
              <button
                type="button"
                onClick={start}
                className={cn('text-muted-foreground hover:text-foreground transition', iconVisibility)}
                aria-label="Edit field"
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-start gap-2">
            {renderEditor(draft, setDraft)}
            <div className="flex gap-1 pt-1">
              <Button size="sm" onClick={save} disabled={loading}>
                <Check className="mr-1 h-4 w-4" /> {t('common:ok')}
              </Button>
              <Button size="sm" variant="ghost" onClick={cancel} disabled={loading}>
                <X className="mr-1 h-4 w-4" /> {t('common:cancel')}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ===== popover (desktop) =====
if (resolvedPresentation === 'popover') {
  return (
    <Popover open={editing} onOpenChange={(open) => (open ? start() : cancel())}>
      <PopoverTrigger asChild>
        <div className={cn('group inline-flex items-center gap-2 cursor-text', className)}>
          <span>{renderView(value)}</span>
          {canEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                start();
              }}
              className={cn('text-muted-foreground hover:text-foreground transition', iconVisibility)}
              aria-label="Edit field"
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="z-[60] w-[min(96vw,560px)] max-h-[80vh] overflow-auto p-4 sm:p-5"
        align="start"
        sideOffset={10}
      >
        {/* Контент + действия разнесены по вертикали */}
        <div
          className="space-y-4"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) save();
            if (e.key === 'Escape') cancel();
          }}
        >
          {/* редактор на всю ширину, без сжатия */}
          <div className="w-full">{renderEditor(draft, setDraft)}</div>

          {/* футер с кнопками отдельно, чисто и опрятно */}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button size="sm" variant="ghost" onClick={cancel} disabled={loading}>
              <X className="mr-1 h-4 w-4" /> {t('common:cancel')}
            </Button>
            <Button size="sm" onClick={save} disabled={loading}>
              <Check className="mr-1 h-4 w-4" /> {t('common:ok')}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

  {/* ===== sheet (mobile) ===== */}
return (
  <div className={cn('group inline-flex items-center gap-2', className)}>
    <span>{renderView(value)}</span>
    {canEdit && (
      <button
        type="button"
        onClick={start}
        className="text-muted-foreground hover:text-foreground transition opacity-100"
        aria-label="Edit field"
        title="Edit"
      >
        <Pencil className="h-4 w-4" />
      </button>
    )}

    <Sheet open={editing} onOpenChange={(open) => (open ? start() : cancel())}>
      <SheetContent
        side="bottom"
        className={cn(
          "space-y-4",
          "max-h-[85vh] overflow-y-auto",
          "pb-[env(safe-area-inset-bottom)] pb-6",
          "animate-in slide-in-from-bottom duration-200 ease-out"
        )}
      >
        <SheetHeader>
          <SheetTitle>{title ?? t('common:edit')}</SheetTitle>
        </SheetHeader>

        <div className="pt-1">{renderEditor(draft, setDraft)}</div>

        <SheetFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button className="w-full sm:w-auto" onClick={save} disabled={loading}>
            <Check className="mr-1 h-4 w-4" /> {t('common:ok')}
          </Button>
          <Button className="w-full sm:w-auto" variant="ghost" onClick={cancel} disabled={loading}>
            <X className="mr-1 h-4 w-4" /> {t('common:cancel')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </div>
);
}
