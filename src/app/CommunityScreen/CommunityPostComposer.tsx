'use client';

import { FormEvent, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { collection, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from '@/app/firebase/firebase';
import { cn } from '@/lib/utils';
import { useUserTypeWithProfile } from '@/hooks/useUserType';
import type { CommunityTopic } from '@/hooks/useCommunityPosts';
import { Image as ImageIcon } from 'lucide-react';
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

  // Загружаем по очереди, чтобы не спамить Storage
  // (можно потом оптимизировать в Promise.all)
  // eslint-disable-next-line no-restricted-syntax
  for (const [index, item] of media.entries()) {
    const folder =
      item.type === 'image'
        ? 'community_posts/images'
        : 'community_posts/videos';

    const fileRef = ref(
      storage,
      `${folder}/${postId}_${index}_${Date.now()}`,
    );

    // eslint-disable-next-line no-await-in-loop
    await uploadBytes(fileRef, item.file);
    // eslint-disable-next-line no-await-in-loop
    const url = await getDownloadURL(fileRef);

    if (item.type === 'image') {
      imageUrls.push(url);
    } else {
      videoUrls.push(url);
    }
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

  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const MAX_MEDIA_FILES = 6;
  const MAX_FILE_SIZE_MB = 20;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const handleMediaButtonClick = (): void => {
  if (fileInputRef.current) {
    fileInputRef.current.click();
  }
};

  const handleMediaChange = (
  event: React.ChangeEvent<HTMLInputElement>,
): void => {
  const files = event.target.files;
  if (!files) return;

  const existingCount = selectedMedia.length;
  const remainingSlots = MAX_MEDIA_FILES - existingCount;

  const next: SelectedMedia[] = [];
  let localError = '';

  // eslint-disable-next-line no-restricted-syntax
  for (const file of Array.from(files)) {
    if (next.length >= remainingSlots) {
      localError = t('community:composer.errors.maxMediaFiles', { maxFiles: MAX_MEDIA_FILES });
      break;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      localError = t('community:composer.errors.fileTooLarge', { fileName: file.name, maxSize: MAX_FILE_SIZE_MB });
      // пропускаем этот файл, но даём выбрать остальные
      // eslint-disable-next-line no-continue
      continue;
    }

    const type: MediaType | null =
      file.type.startsWith('image/')
        ? 'image'
        : file.type.startsWith('video/')
          ? 'video'
          : null;

    if (!type) {
      localError = t('community:composer.errors.generic');
      // eslint-disable-next-line no-continue
      continue;
    }

    const previewUrl = URL.createObjectURL(file);

    next.push({
      file,
      previewUrl,
      type,
    });
  }

  if (localError) {
    setErrorMessage(localError);
  } else {
    setErrorMessage('');
  }

  setSelectedMedia(prev => [...prev, ...next]);

  // сбрасываем value, чтобы один и тот же файл можно было выбрать снова
  event.target.value = '';
};

  const handleRemoveMedia = (index: number): void => {
  setSelectedMedia(prev => {
    const copy = [...prev];

    // освобождаем blob-память для превью
    const item = copy[index];
    if (item) {
      URL.revokeObjectURL(item.previewUrl);
    }

    copy.splice(index, 1);
    return copy;
  });
};

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

    // заранее создаём ссылку на документ, чтобы получить стабильный postId
    const postRef = doc(collection(db, 'community_posts'));
    const postId = postRef.id;

    // по умолчанию пустые массивы, если медиа нет
    let imageUrls: string[] = [];
    let videoUrls: string[] = [];

    // если пользователь выбрал медиа — загружаем в Storage
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
      // у owner есть обязательный profileImageUrl, у renter — опциональный
      authorAvatarUrl:
        'profileImageUrl' in profile && profile.profileImageUrl
          ? profile.profileImageUrl
          : undefined,
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

    // очищаем форму
    setContent('');
    if (canSelectTopicInline) {
      setSelectedTopic(null);
    }
    setCity('');
    setSelectedMedia([]);
    setErrorMessage('');

    if (onPostCreated) {
      onPostCreated(postId);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating community post with media:', error);
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

        {/* выбранные медиа */}
        {selectedMedia.length > 0 && (
  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
    {selectedMedia.map((item, index) => (
      <div
        key={item.previewUrl}
        className="relative overflow-hidden rounded-xl border border-white/40 bg-white/10 backdrop-blur-sm"
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
            <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white">
             {t('community:composer.video')}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => handleRemoveMedia(index)}
          className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-[10px] font-semibold text-white hover:bg-black/80"
          aria-label={t('community:composer.removeMedia')}
        >
          ✕
        </button>
      </div>
    ))}
  </div>
)}

        {/* нижняя панель: кнопки */}
        <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  <div className="flex items-center gap-3">
    <button
      type="button"
      onClick={handleMediaButtonClick}
      className="inline-flex items-center gap-2 rounded-full border border-white/60 dark:border-white/15 bg-white/10 dark:bg-slate-950/60 px-3 py-1.5 text-xs sm:text-sm text-foreground shadow-sm hover:bg-white/20 dark:hover:bg-slate-900/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
    >
      <ImageIcon className="h-4 w-4" aria-hidden="true" />
      <span>
        {t('community:composer.addPhotoDisabled')}
      </span>
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

  <div className="flex items-center justify-end gap-2">
    {errorMessage && (
      <span className="max-w-xs text-right text-xs text-red-500">
        {errorMessage}
      </span>
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
