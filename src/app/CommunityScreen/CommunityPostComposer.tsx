'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { cn } from '@/lib/utils';
import { useUserTypeWithProfile } from '@/hooks/useUserType';
import type { CommunityTopic } from '@/hooks/useCommunityPosts';
import { Image as ImageIcon } from 'lucide-react';
import type { CommunityTopicFilter } from './CommunityTopicMenu';

interface CommunityPostComposerProps {
  activeTopic: CommunityTopicFilter;
  onPostCreated?: (postId: string) => void;
  onRequireAuth?: () => void;
  className?: string;
}

type CurrentProfile = {
  uid: string;
  fullName: string;
  city?: string;
  profileImageUrl?: string;
};

// локальный список тем только для выбора внутри композера
interface TopicOption {
  id: CommunityTopic;
  labelKey: string;
}

const TOPIC_OPTIONS: TopicOption[] = [
  { id: 'experience', labelKey: 'community:topics.experience' },
  { id: 'roommates', labelKey: 'community:topics.roommates' },
  { id: 'household', labelKey: 'community:topics.household' },
  { id: 'moving', labelKey: 'community:topics.moving' },
  { id: 'finance', labelKey: 'community:topics.finance' },
  { id: 'fun', labelKey: 'community:topics.fun' },
  { id: 'recommendations', labelKey: 'community:topics.recommendations' },
];

export default function CommunityPostComposer({
  activeTopic,
  onPostCreated,
  onRequireAuth,
  className,
}: CommunityPostComposerProps) {
  const { t } = useTranslation('community');
  const router = useRouter();

  const [userType, userProfile, loadingUser] = useUserTypeWithProfile();
  const [content, setContent] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<CommunityTopic | null>(null);
  const [city, setCity] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const effectiveTopic: CommunityTopic | null = useMemo(() => {
    if (activeTopic !== 'all') {
      return activeTopic;
    }
    return selectedTopic;
  }, [activeTopic, selectedTopic]);

  const canSelectTopicInline = activeTopic === 'all';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    if (loadingUser) {
      return;
    }

    if (!userType || !userProfile) {
      if (onRequireAuth) {
        onRequireAuth();
      } else {
        router.push('/login');
      }
      return;
    }

    const profile: CurrentProfile = userProfile;

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setErrorMessage(t('community:composer.errors.emptyContent'));
      return;
    }

    if (!effectiveTopic) {
      setErrorMessage(t('community:composer.errors.noTopic'));
      return;
    }

    setSubmitting(true);

    try {
      const authorCity = city || profile.city || '';

      const newPost = {
        authorUid: profile.uid,
        authorRole: userType,
        authorName: profile.fullName,
        // у owner есть обязательный profileImageUrl, у renter — опциональный
        authorAvatarUrl:
          'profileImageUrl' in profile && profile.profileImageUrl
            ? profile.profileImageUrl
            : undefined,
        authorCity: authorCity || undefined,

        topic: effectiveTopic,
        city: authorCity || undefined,
        content: trimmedContent,

        images: [] as string[],

        likesCount: 0,
        commentsCount: 0,
        savesCount: 0,

        createdAt: serverTimestamp(),
        lastActivityAt: serverTimestamp(),
        isPinned: false,
        isDeleted: false,
        status: 'active',
      };

      const docRef = await addDoc(collection(db, 'community_posts'), newPost);

      setContent('');
      if (canSelectTopicInline) {
        setSelectedTopic(null);
      }
      setCity('');
      if (onPostCreated) {
        onPostCreated(docRef.id);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error creating community post:', error);
      setErrorMessage(t('community:composer.errors.generic'));
    } finally {
      setSubmitting(false);
    }
  };

  const topicLabel = useMemo(() => {
    if (activeTopic !== 'all') {
      const match = TOPIC_OPTIONS.find(option => option.id === activeTopic);
      if (match) {
        return t(match.labelKey);
      }
      return t('community:topics.all');
    }

    if (selectedTopic) {
      const match = TOPIC_OPTIONS.find(option => option.id === selectedTopic);
      if (match) {
        return t(match.labelKey);
      }
    }

    return t('community:composer.topicPlaceholder');
  }, [activeTopic, selectedTopic, t]);

  const isSubmitDisabled =
    submitting ||
    loadingUser ||
    !content.trim() ||
    effectiveTopic === null;

  return (
    <section
      className={cn(
        'w-full rounded-2xl md:rounded-3xl bg-card/90',
        'border border-slate-100/80 dark:border-slate-100/80',
        'shadow-md px-4 sm:px-5 md:px-6 py-4 sm:py-5 md:py-6',
        className,
      )}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
        {/* верхняя строка: тема + город (опционально) */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              {t('community:composer.topicLabel')}
            </span>

            <div
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs sm:text-sm',
                'bg-background/60 dark:bg-background-dark text-muted-foreground dark:text-muted-foreground',
                'border-slate-200/80 dark:border-slate-200/80',
                canSelectTopicInline ? 'cursor-pointer' : 'cursor-default',
              )}
            >
              {canSelectTopicInline ? (
                <>
                  <select
                    className="bg-transparent pr-4 text-xs sm:text-sm outline-none border-none focus:ring-0 focus:outline-none cursor-pointer"
                    value={selectedTopic ?? ''}
                    onChange={event => {
                      const value = event.target.value as CommunityTopic | '';
                      if (value === '') {
                        setSelectedTopic(null);
                      } else {
                        setSelectedTopic(value);
                      }
                    }}
                  >
                    <option value="">{t('community:composer.topicSelectPlaceholder')}</option>
                    {TOPIC_OPTIONS.map(option => (
                      <option key={option.id} value={option.id}>
                        {t(option.labelKey)}
                      </option>
                    ))}
                  </select>
                  
                </>
              ) : (
                <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100">
                  {topicLabel}
                </span>
              )}
            </div>
          </div>

          {/* город — опциональный, можно оставить пустым */}
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-muted-foreground">
              {t('community:composer.cityLabel')}
            </span>
            <input
              type="text"
              value={city}
              onChange={event => setCity(event.target.value)}
              placeholder={t('community:composer.cityPlaceholder')}
              className="w-full sm:w-44 rounded-full border border-slate-200/80 dark:border-slate-200/80 bg-background/60 dark:bg-background-dark px-3 py-1.5 text-xs sm:text-sm text-foreground placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1"
            />
          </div>
        </div>

        {/* textarea */}
        <div className="mt-1">
          <textarea
            value={content}
            onChange={event => setContent(event.target.value)}
            rows={3}
            maxLength={3000}
            className="w-full resize-none rounded-2xl border border-slate-200/80 dark:border-slate-200/80 bg-background/60 dark:bg-background-dark px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-foreground placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1"
            placeholder={t('community:composer.placeholder')}
          />
        </div>

        {/* нижняя панель: кнопки */}
        <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 dark:border-slate-200/80 bg-background/60 dark:bg-background-dark px-3 py-1.5 text-xs sm:text-sm text-muted-foreground cursor-not-allowed opacity-60"
            >
              <ImageIcon className="h-4 w-4" aria-hidden="true" />
              <span>{t('community:composer.addPhotoDisabled')}</span>
            </button>
            <p className="hidden sm:block text-xs text-muted-foreground">
              {t('community:composer.hint')}
            </p>
          </div>

          <div className="flex items-center justify-end gap-2">
            {errorMessage && (
              <span className="text-xs text-red-500 max-w-xs text-right">{errorMessage}</span>
            )}
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={cn(
                'inline-flex items-center justify-center rounded-full px-5 sm:px-6 py-2 text-sm sm:text-base font-semibold transition-transform shadow-md',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500',
                isSubmitDisabled
                  ? 'bg-slate-300 text-slate-600 dark:bg-slate-300 dark:text-slate-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:scale-[1.03] hover:shadow-lg',
              )}
            >
              {userType && userProfile
                ? submitting
                  ? t('community:composer.posting')
                  : t('community:composer.postButton')
                : t('community:composer.loginToPost')}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
