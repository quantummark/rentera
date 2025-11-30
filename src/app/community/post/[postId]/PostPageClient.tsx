'use client';

import type { ReactElement } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import PostFullView from '@/app/CommunityScreen/PostFullView';
import { useTranslation } from 'react-i18next';

interface PostPageClientProps {
  postId: string;
}

export default function PostPageClient({
  postId,
}: PostPageClientProps): ReactElement {
  const router = useRouter();
  const { t } = useTranslation('community');

  const handleBack = (): void => {
  const isInternalNavigation =
    document.referrer.includes(window.location.origin);

  if (isInternalNavigation) {
    router.back();
  } else {
    router.replace('/community');
  }
};

  return (
    <main className="min-h-screen w-full bg-background">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-1 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8">
        {/* Навигация назад */}
        <section className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border border-white/50 dark:border-white/15',
              'bg-white/5 dark:bg-background-dark',
              'px-3 py-1.5 text-xs sm:text-sm font-medium text-foreground',
              'shadow-sm hover:shadow-md hover:bg-white/10 dark:hover:bg-background-dark',
              'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
            )}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline"> {t('post.backToCommunity')}</span>
            <span className="sm:hidden">{t('post.back')}</span>
          </button>
        </section>

        {/* Полный пост с лайками и комментами */}
        <PostFullView postId={postId} />
      </div>
    </main>
  );
}
