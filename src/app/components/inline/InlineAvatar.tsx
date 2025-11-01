'use client';

import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { Camera, Loader2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { storage } from '@/app/firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useTranslation } from 'react-i18next';

type AcceptType = 'image/jpeg' | 'image/png' | 'image/webp';

interface InlineAvatarProps {
  uid: string;
  value: string;
  canEdit: boolean;
  onChangeUrl: (nextUrl: string) => Promise<void> | void;
  alt: string;
  size?: number;
  maxBytes?: number;
  acceptTypes?: AcceptType[];
  className?: string;
  allowRemove?: boolean;
  /** 🆕 куда грузим: 'owner' | 'renter' (default: 'owner') */
  pathPrefix?: 'owner' | 'renter';
}

export default function InlineAvatar({
  uid,
  value,
  canEdit,
  onChangeUrl,
  alt,
  size = 164,
  maxBytes = 2 * 1024 * 1024,
  acceptTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className,
  allowRemove = true,
  pathPrefix = 'owner',
}: InlineAvatarProps) {

  const { t } = useTranslation('inlineAvatar');
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openPicker = () => {
    if (!canEdit || uploading) return;
    inputRef.current?.click();
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!acceptTypes.includes(file.type as AcceptType)) {
      setError(t('errorType'));
      return;
    }
    if (file.size > maxBytes) {
      setError(t('errorSize', { mb: (maxBytes / (1024 * 1024)).toFixed(0) }));
      return;
    }

    try {
      setUploading(true);
      const ext = file.type.split('/')[1] || 'jpg';
      const storageRef = ref(storage, `${pathPrefix}/${uid}/avatar_${Date.now()}.${ext}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await onChangeUrl(url);
    } catch (err) {
      console.error(err);
      setError(t('errorUpload'));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const initials =
    (alt || '')
      .split(' ')
      .map(s => s[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <div
        className={cn(
          'rounded-full border overflow-hidden flex items-center justify-center bg-muted text-2xl font-bold',
          uploading && 'opacity-70'
        )}
        style={{ width: size, height: size }}
        aria-label={alt}
      >
        {value ? (
          <Image
            src={value}
            alt={alt}
            width={size}
            height={size}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="select-none">{initials}</span>
        )}
      </div>

      {canEdit && (
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-2">
          <div className="pointer-events-auto flex gap-2">
            <Button
              type="button"
              onClick={openPicker}
              className="h-9 px-3 text-xs bg-black/60 hover:bg-black/80 text-white rounded-full"
              disabled={uploading}
            >
              {uploading ? (
                <span className="inline-flex items-center gap-1">
                  <Loader2 className="h-4 w-4 animate-spin" /> {t('uploading')}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <Camera className="h-4 w-4" /> {t('change')}
                </span>
              )}
            </Button>

            {allowRemove && value && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => onChangeUrl('')}
                className="h-9 px-3 text-xs bg-white/70 hover:bg-white text-foreground rounded-full"
                disabled={uploading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      <input ref={inputRef} type="file" accept={acceptTypes.join(',')} className="sr-only" onChange={handleFileChange} />
      {error && <p className="mt-2 text-center text-xs text-destructive">{error}</p>}
    </div>
  );
}
