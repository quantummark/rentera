'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import PostFullView from '@/app/CommunityScreen/PostFullView';
import type { CommunityPostWithId } from '@/app/types/communityTypes';

interface PostModalProps {
  open: boolean;
  postId: string | null;
  initialPost?: CommunityPostWithId;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export default function PostModal({
  open,
  postId,
  initialPost,
  onOpenChange,
  className,
}: PostModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open || !postId) {
    return null;
  }

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-40 flex items-center justify-center px-2 sm:px-4',
        'bg-black/40 backdrop-blur-sm',
      )}
      aria-modal="true"
      role="dialog"
      onClick={handleClose}
    >
      <div
        className={cn(
          'relative w-full max-w-4xl max-h-[90vh] overflow-y-auto',
          'rounded-3xl bg-transparent',
          className,
        )}
        onClick={event => event.stopPropagation()}
      >
        {/* кнопка закрытия */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          aria-label="Close"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <PostFullView postId={postId} initialPost={initialPost} className="mt-6" />
      </div>
    </div>
  );
}
