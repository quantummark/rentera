'use client';

import Image from 'next/image';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  GripVertical,
  Trash2,
  Star,
  Upload,
  Crown,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';

type Url = string;

interface ListingGalleryEditorProps {
  value: Url[];                                // первый элемент = обложка
  onChange: (urls: Url[]) => void;             // вернуть итоговый массив
  onUpload?: (files: File[]) => Promise<Url[]>;// загрузка файлов -> URL'ы
  max?: number;                                // лимит фото
  className?: string;
  title?: string;                              // заголовок во viewer
}

export default function ListingGalleryEditor({
  value,
  onChange,
  onUpload,
  max = 10,             // по умолчанию 10
  className,
  title = 'Gallery',
}: ListingGalleryEditorProps) {
  const { t } = useTranslation('gallery');
  const [items, setItems] = React.useState<Url[]>(value ?? []);
  const [busy, setBusy] = React.useState(false);
  const [viewerOpen, setViewerOpen] = React.useState(false);
  const [viewerIndex, setViewerIndex] = React.useState(0);
  const dragIndexRef = React.useRef<number | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // sync с внешним value
  React.useEffect(() => {
    setItems(value ?? []);
  }, [value]);

  // защита viewer от выхода за границы
  React.useEffect(() => {
    if (items.length === 0) {
      setViewerOpen(false);
      setViewerIndex(0);
    } else if (viewerIndex > items.length - 1) {
      setViewerIndex(items.length - 1);
    }
  }, [items, viewerIndex]);

  const canAddMore = items.length < max;

  const commit = React.useCallback(
    (next: Url[]) => {
      setItems(next);
      onChange(next);
    },
    [onChange]
  );

  const onPickFiles = React.useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFiles = React.useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      if (!onUpload) return;

      try {
        setBusy(true);
        const arr = Array.from(files);
        const remaining = Math.max(0, max - items.length);
        const toUpload = remaining > 0 ? arr.slice(0, remaining) : [];
        if (toUpload.length === 0) return;

        const uploaded = await onUpload(toUpload);

        // уникализируем
        const uniq = [...items, ...uploaded].filter(
          (url, i, self) => self.indexOf(url) === i
        );

        commit(uniq);
      } finally {
        setBusy(false);
        if (inputRef.current) inputRef.current.value = '';
      }
    },
    [commit, items, max, onUpload]
  );

  const removeAt = React.useCallback(
    (idx: number) => {
      const next = items.filter((_, i) => i !== idx);
      commit(next);
      if (viewerIndex >= next.length) {
        setViewerIndex(Math.max(0, next.length - 1));
      }
    },
    [commit, items, viewerIndex]
  );

  const setCover = React.useCallback(
    (idx: number) => {
      if (idx === 0) return;
      const next = [items[idx], ...items.filter((_, i) => i !== idx)];
      commit(next);
    },
    [commit, items]
  );

  // HTML5 DnD
  const onDragStart = (idx: number) => (e: React.DragEvent) => {
    dragIndexRef.current = idx;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(idx));
  };

  const onDragOver = () => (e: React.DragEvent) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
};

  const onDrop = (idx: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const from = dragIndexRef.current;
    dragIndexRef.current = null;
    if (from == null || from === idx) return;

    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(idx, 0, moved);
    commit(next);
  };

  // клавиатура
  const moveLeft = (idx: number) => {
    if (idx <= 0) return;
    const next = [...items];
    const [m] = next.splice(idx, 1);
    next.splice(idx - 1, 0, m);
    commit(next);
  };
  const moveRight = (idx: number) => {
    if (idx >= items.length - 1) return;
    const next = [...items];
    const [m] = next.splice(idx, 1);
    next.splice(idx + 1, 0, m);
    commit(next);
  };

  const openViewer = (idx: number) => {
    setViewerIndex(idx);
    setViewerOpen(true);
  };
  const nextViewer = () => setViewerIndex((p) => (p + 1) % items.length);
  const prevViewer = () => setViewerIndex((p) => (p - 1 + items.length) % items.length);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Панель действий — адаптивная */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onPickFiles}
            disabled={!canAddMore || busy}
          >
            <Upload className="mr-2 h-4 w-4" />
            {busy ? t('gallery.uploading') : t('gallery.addPhotos')}
          </Button>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            aria-label={t('gallery.fileInputAria') as string}
          />

          <span className="text-sm text-muted-foreground">
            {t('gallery.counter', { current: items.length, max })}
          </span>
        </div>

        {items.length > 0 && (
          <div className="flex">
            <Button
              type="button"
              variant="outline"
              onClick={() => openViewer(0)}
              title={t('gallery.openPreview') as string}
            >
              <Maximize2 className="mr-2 h-4 w-4" />
              {t('gallery.preview')}
            </Button>
          </div>
        )}
      </div>

      {/* Сетка: мобилка — 1 колонка на всю ширину */}
      <div
        className={cn(
          'grid gap-4',
          'grid-cols-1',                 // мобайл
          'sm:grid-cols-2',              // планшет
          'md:grid-cols-3',              // десктоп
          'xl:grid-cols-4'
        )}
      >
        {items.map((url, idx) => (
          <div
            key={url}
            className={cn(
              'group relative rounded-2xl overflow-hidden border bg-card/70',
              'shadow-sm hover:shadow-md transition-shadow',
              idx === 0 && 'ring-2 ring-amber-400/60'
            )}
            draggable
            onDragStart={onDragStart(idx)}
            onDragOver={onDragOver()}
            onDrop={onDrop(idx)}
          >
            {/* Изображение: на мобиле aspect выше для ощущения полноэкранности */}
            <button
              type="button"
              className="relative block w-full aspect-[4/3] sm:aspect-[3/2]"
              onClick={() => openViewer(idx)}
              aria-label={t('gallery.openPhotoN', { n: idx + 1 }) as string}
            >
              <Image
                src={url}
                alt={t('gallery.photoAltN', { n: idx + 1 }) as string}
                fill
                className="object-cover"
                sizes="100vw"
                priority={idx < 6}
                unoptimized={url.startsWith('blob:') || url.startsWith('data:')}
              />

              {/* низ — мягкий градиент для читаемости подписей */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
            </button>

            {/* Бейдж слева сверху */}
            <div className="absolute top-2 left-2 flex items-center gap-1">
              <span
                className="inline-flex items-center gap-1 rounded-full bg-black/50 text-white px-2 py-1 text-xs backdrop-blur"
                title={idx === 0 ? (t('gallery.coverTitle') as string) : (t('gallery.makeCoverTitle') as string)}
              >
                {idx === 0 ? (
                  <>
                    <Crown className="h-3.5 w-3.5" /> {t('gallery.cover')}
                  </>
                ) : (
                  <>
                    <Star className="h-3.5 w-3.5" /> {t('gallery.photoN', { n: idx + 1 })}
                  </>
                )}
              </span>
            </div>

            {/* Кнопки действий: на мобиле всегда видны, на десктопе по hover */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              {idx !== 0 && (
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="h-10 w-10 sm:h-8 sm:w-8 bg-black/55 text-white hover:bg-black/70"
                  onClick={() => setCover(idx)}
                  title={t('gallery.makeCover') as string}
                  aria-label={t('gallery.makeCover') as string}
                >
                  <Star className="h-5 w-5 sm:h-4 sm:w-4" />
                </Button>
              )}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-10 w-10 sm:h-8 sm:w-8"
                onClick={() => removeAt(idx)}
                title={t('gallery.delete') as string}
                aria-label={t('gallery.delete') as string}
              >
                <Trash2 className="h-5 w-5 sm:h-4 sm:w-4" />
              </Button>
            </div>

            {/* Нижняя панель: drag-hint + стрелки */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-black/45 px-2 py-1 text-white text-xs backdrop-blur">
                <GripVertical className="h-4 w-4" />
                {t('gallery.drag')}
              </span>
              <div className="flex gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="h-9 w-9 p-0 bg-black/55 text-white hover:bg-black/70 sm:h-7 sm:w-7"
                  onClick={() => moveLeft(idx)}
                  disabled={idx === 0}
                  aria-label={t('gallery.moveLeft') as string}
                >
                  ←
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="h-9 w-9 p-0 bg-black/55 text-white hover:bg-black/70 sm:h-7 sm:w-7"
                  onClick={() => moveRight(idx)}
                  disabled={idx === items.length - 1}
                  aria-label={t('gallery.moveRight') as string}
                >
                  →
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Плитка-дропзона (тоже растягивается на мобиле) */}
        {canAddMore && (
          <label
            className={cn(
              'flex items-center justify-center rounded-2xl border border-dashed hover:border-ring transition cursor-pointer min-h-40',
              'bg-muted/40 text-muted-foreground shadow-inner'
            )}
            title={t('gallery.dropTitle') as string}
          >
            <div className="flex flex-col items-center gap-1 text-center px-4 py-8">
              <Upload className="h-5 w-5" />
              <span className="text-sm">{t('gallery.dropHint')}</span>
              <span className="text-xs">{t('gallery.dropTypes', { max })}</span>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
              aria-label={t('gallery.fileInputAria') as string}
            />
          </label>
        )}
      </div>

      {/* Viewer */}
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-screen-xl w-full h-[92vh] p-0 bg-black text-white">
          {items.length > 0 && (
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={items[viewerIndex]}
                alt={t('gallery.photoAltN', { n: viewerIndex + 1 }) as string}
                fill
                className="object-contain"
                sizes="100vw"
                unoptimized={
                  items[viewerIndex].startsWith('blob:') ||
                  items[viewerIndex].startsWith('data:')
                }
              />

              <button
                onClick={prevViewer}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 p-3 sm:p-2 bg-black/70 rounded-full"
                aria-label={t('gallery.viewerPrev') as string}
              >
                <ChevronLeft className="h-7 w-7 sm:h-6 sm:w-6" />
              </button>
              <button
                onClick={nextViewer}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-3 sm:p-2 bg-black/70 rounded-full"
                aria-label={t('gallery.viewerNext') as string}
              >
                <ChevronRight className="h-7 w-7 sm:h-6 sm:w-6" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs bg-black/60 rounded-full px-3 py-1">
                {viewerIndex + 1} / {items.length} — {title}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
