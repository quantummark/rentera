'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { collection, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { storage, db } from '@/app/firebase/firebase';
import { cn } from '@/lib/utils';
import { useUserTypeWithProfile } from '@/hooks/useUserType';
import type { CommunityTopic } from '@/hooks/useCommunityPosts';

import DropdownMenu, { DropdownItem } from '@/components/ui/DropdownMenu';
import { Image as ImageIcon, Tag, Lock } from 'lucide-react';
import type { CommunityTopicFilter } from './CommunityTopicMenu';

type MediaType = 'image' | 'video';

interface SelectedMedia {
  file: File;
  previewUrl: string;
  type: MediaType;
}

async function uploadMediaForPost(
  postId: string,
  media: SelectedMedia[],
): Promise<{ imageUrls: string[]; videoUrls: string[] }> {
  const imageUrls: string[] = [];
  const videoUrls: string[] = [];

  for (let index = 0; index < media.length; index += 1) {
    const item = media[index];
    if (!item) continue;

    const folder = item.type === 'image' ? 'community_posts/images' : 'community_posts/videos';
    const fileRef = ref(storage, `${folder}/${postId}_${index}_${Date.now()}`);

    // eslint-disable-next-line no-await-in-loop
    await uploadBytes(fileRef, item.file);
    // eslint-disable-next-line no-await-in-loop
    const url = await getDownloadURL(fileRef);

    if (item.type === 'image') imageUrls.push(url);
    else videoUrls.push(url);
  }

  return { imageUrls, videoUrls };
}

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

  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const MAX_MEDIA_FILES = 6;
  const MAX_FILE_SIZE_MB = 20;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const isAuthed = Boolean(userType && userProfile);

  // аккуратная очистка objectURL, чтобы не текла память
  useEffect(() => {
    return () => {
      selectedMedia.forEach((m) => URL.revokeObjectURL(m.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMediaButtonClick = useCallback((): void => {
    fileInputRef.current?.click();
  }, []);

  const handleMediaChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const files = event.target.files;
      if (!files) return;

      const existingCount = selectedMedia.length;
      const remainingSlots = MAX_MEDIA_FILES - existingCount;

      const next: SelectedMedia[] = [];
      let localError = '';

      const filesArr = Array.from(files);
      for (let i = 0; i < filesArr.length; i += 1) {
        const file = filesArr[i];
        if (!file) continue;

        if (next.length >= remainingSlots) {
          localError = t('community:composer.errors.maxMediaFiles', { maxFiles: MAX_MEDIA_FILES });
          break;
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
          localError = t('community:composer.errors.fileTooLarge', {
            fileName: file.name,
            maxSize: MAX_FILE_SIZE_MB,
          });
          continue;
        }

        const type: MediaType | null =
          file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : null;

        if (!type) {
          localError = t('community:composer.errors.generic');
          continue;
        }

        const previewUrl = URL.createObjectURL(file);
        next.push({ file, previewUrl, type });
      }

      setErrorMessage(localError);
      if (next.length) setSelectedMedia((prev) => [...prev, ...next]);

      // сбрасываем value, чтобы можно было выбрать тот же файл снова
      event.target.value = '';
    },
    [MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB, MAX_MEDIA_FILES, selectedMedia.length, t],
  );

  const handleRemoveMedia = useCallback((index: number): void => {
    setSelectedMedia((prev) => {
      const copy = [...prev];
      const item = copy[index];
      if (item) URL.revokeObjectURL(item.previewUrl);
      copy.splice(index, 1);
      return copy;
    });
  }, []);

  const canSelectTopicInline = activeTopic === 'all';

  const effectiveTopic: CommunityTopic | null = useMemo(() => {
    if (activeTopic !== 'all') return activeTopic;
    return selectedTopic;
  }, [activeTopic, selectedTopic]);

  const topicLabel = useMemo(() => {
    if (activeTopic !== 'all') {
      const match = TOPIC_OPTIONS.find((o) => o.id === activeTopic);
      return match ? t(match.labelKey) : t('community:topics.all');
    }

    if (selectedTopic) {
      const match = TOPIC_OPTIONS.find((o) => o.id === selectedTopic);
      if (match) return t(match.labelKey);
    }

    return t('community:composer.topicPlaceholder');
  }, [activeTopic, selectedTopic, t]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setErrorMessage('');

      if (loadingUser) return;

      if (!userType || !userProfile) {
        // кнопка уже будет disabled, но на всякий — если сабмит с клавы
        if (onRequireAuth) onRequireAuth();
        else router.push('/login');
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

        const postRef = doc(collection(db, 'community_posts'));
        const postId = postRef.id;

        let imageUrls: string[] = [];
        let videoUrls: string[] = [];

        if (selectedMedia.length > 0) {
          const uploaded = await uploadMediaForPost(postId, selectedMedia);
          imageUrls = uploaded.imageUrls;
          videoUrls = uploaded.videoUrls;
        }

        const newPost = {
          id: postId,
          authorUid: profile.uid,
          authorRole: userType,
          authorName: profile.fullName,
          authorAvatarUrl: profile.profileImageUrl || undefined,
          authorCity: authorCity || undefined,

          topic: effectiveTopic,
          city: authorCity || undefined,
          content: trimmedContent,

          images: imageUrls,
          videos: videoUrls,

          likesCount: 0,
          commentsCount: 0,
          savesCount: 0,

          createdAt: serverTimestamp(),
          lastActivityAt: serverTimestamp(),
          isPinned: false,
          isDeleted: false,
          status: 'active',
        };

        await setDoc(postRef, newPost);

        // очистка формы + очистка превьюшек
        selectedMedia.forEach((m) => URL.revokeObjectURL(m.previewUrl));

        setContent('');
        if (canSelectTopicInline) setSelectedTopic(null);
        setCity('');
        setSelectedMedia([]);
        setErrorMessage('');

        onPostCreated?.(postId);
      } catch (err: unknown) {
        // eslint-disable-next-line no-console
        console.error('Error creating community post with media:', err);
        setErrorMessage(t('community:composer.errors.generic'));
      } finally {
        setSubmitting(false);
      }
    },
    [
      canSelectTopicInline,
      city,
      content,
      effectiveTopic,
      loadingUser,
      onPostCreated,
      onRequireAuth,
      router,
      selectedMedia,
      t,
      userProfile,
      userType,
    ],
  );

  const isSubmitDisabled =
    submitting ||
    loadingUser ||
    !isAuthed ||
    !content.trim() ||
    effectiveTopic === null;

  const shellClass = cn(
  'relative rounded-2xl md:rounded-3xl border border-gray-300 dark:border-gray-300',
  'bg-background/60 backdrop-blur-xl',
  'shadow-[0_10px_30px_-20px_rgba(0,0,0,0.35)]',
  'px-4 sm:px-5 md:px-6 py-4 sm:py-5 md:py-6',
);

  const glowClass =
    'pointer-events-none absolute inset-0 ' +
    'bg-[radial-gradient(700px_circle_at_15%_20%,rgba(249,115,22,0.10),transparent_55%),radial-gradient(700px_circle_at_85%_25%,rgba(255,255,255,0.06),transparent_60%)]';

  const pillClass = cn(
    'inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-300',
    'bg-background/40 px-3 py-1.5 text-xs sm:text-sm text-foreground/90',
    'backdrop-blur-md',
  );

  const inputClass = cn(
    'w-full rounded-full border border-gray-300 dark:border-gray-300 bg-background/40 px-3 py-1.5',
    'text-xs sm:text-sm text-foreground placeholder:text-muted-foreground',
    'backdrop-blur-md',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  );

  const textareaClass = cn(
    'w-full resize-none rounded-2xl border border-gray-300 dark:border-gray-300 bg-background/40',
    'px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-foreground placeholder:text-muted-foreground',
    'backdrop-blur-md',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  );

  return (
    <section className={cn('w-full', className)}>
      <div className={shellClass}>
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl md:rounded-3xl">
  <div
    aria-hidden
    className="
      absolute inset-0
      bg-[radial-gradient(700px_circle_at_15%_20%,rgba(249,115,22,0.10),transparent_55%),
          radial-gradient(700px_circle_at_85%_25%,rgba(255,255,255,0.06),transparent_60%)]
    "
  />
</div>
        <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-3 sm:gap-4">
          {/* верхняя строка */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                {t('community:composer.topicLabel')}
              </span>

              {/* topic selector */}
              {canSelectTopicInline ? (
                <DropdownMenu
                  align="start"
                  trigger={
                    <button type="button" className={cn(pillClass, 'hover:bg-foreground/5')}>
                      <Tag className="h-4 w-4 text-orange-500" aria-hidden="true" />
                      <span className="font-medium">{topicLabel}</span>
                    </button>
                  }
                >
                  <DropdownItem
                    onSelect={() => setSelectedTopic(null)}
                    className="text-muted-foreground"
                  >
                    {t('community:composer.topicSelectPlaceholder')}
                  </DropdownItem>

                  {TOPIC_OPTIONS.map((opt) => (
                    <DropdownItem key={opt.id} onSelect={() => setSelectedTopic(opt.id)}>
                      {t(opt.labelKey)}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              ) : (
                <span className={pillClass}>
                  <Tag className="h-4 w-4 text-orange-500" aria-hidden="true" />
                  <span className="font-medium">{topicLabel}</span>
                </span>
              )}
            </div>

            {/* city */}
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground">
                {t('community:composer.cityLabel')}
              </span>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={t('community:composer.cityPlaceholder')}
                className={cn(inputClass, 'sm:w-44')}
              />
            </div>
          </div>

          {/* textarea */}
          <div className="mt-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              maxLength={3000}
              className={textareaClass}
              placeholder={t('community:composer.placeholder')}
            />
          </div>

          {/* media preview */}
          {selectedMedia.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {selectedMedia.map((item, index) => (
                <div
                  key={item.previewUrl}
                  className={cn(
                    'relative overflow-hidden rounded-xl border border-gray-300 dark:border-gray-300',
                    'bg-background/30 backdrop-blur-md',
                  )}
                >
                  {item.type === 'image' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.previewUrl}
                      alt={t('community:composer.imageAlt')}
                      className="h-24 w-full object-cover sm:h-28"
                    />
                  ) : (
                    <div className="flex h-24 w-full items-center justify-center sm:h-28">
                      <span className="rounded-full border border-gray-300 dark:border-gray-300 bg-background/40 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-md">
                        {t('community:composer.video')}
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(index)}
                    className={cn(
                      'absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full',
                      'border border-border/50 bg-background/60 text-xs font-semibold text-foreground',
                      'backdrop-blur-md hover:bg-foreground/5 transition-colors',
                    )}
                    aria-label={t('community:composer.removeMedia')}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* нижняя панель */}
          <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleMediaButtonClick}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-300',
                  'bg-background/40 px-3 py-1.5 text-xs sm:text-sm text-foreground',
                  'backdrop-blur-md shadow-sm hover:bg-foreground/5 transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                )}
              >
                <ImageIcon className="h-4 w-4" aria-hidden="true" />
                <span>{t('community:composer.addPhotoDisabled')}</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={handleMediaChange}
              />

              <p className="hidden sm:block text-xs text-muted-foreground">
                {t('community:composer.hint')}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              {/* errors */}
              {errorMessage && (
                <span className="max-w-xs text-right text-xs text-red-500">
                  {errorMessage}
                </span>
              )}

              <div className="flex flex-col items-end gap-2">
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className={cn(
                    'inline-flex items-center justify-center rounded-full px-5 sm:px-6 py-2 text-sm sm:text-base font-semibold',
                    'transition-transform shadow-md',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500/50 focus-visible:ring-offset-background',
                    isSubmitDisabled
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:scale-[1.03] hover:shadow-lg',
                  )}
                >
                  {submitting ? t('community:composer.posting') : t('community:composer.postButton')}
                </button>

                {!isAuthed && !loadingUser && (
                  <div
                    className={cn(
                      'inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-300',
                      'bg-background/40 px-3 py-2 text-xs text-muted-foreground',
                      'backdrop-blur-md',
                    )}
                  >
                    <Lock className="h-4 w-4 text-orange-500" aria-hidden="true" />
                    <span>
                      {t('community:composer.loginHintPrefix')}{' '}
                      <Link
                        href="/login"
                        className="text-orange-500 hover:underline underline-offset-4"
                        onClick={(e) => {
                          // если хочешь открывать модалку — используем коллбек
                          if (onRequireAuth) {
                            e.preventDefault();
                            onRequireAuth();
                          }
                        }}
                      >
                        {t('community:composer.loginHintLink')}
                      </Link>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
