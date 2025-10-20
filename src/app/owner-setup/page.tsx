'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';

import { db, storage } from '@/app/firebase/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

// ----- Types & Schema -----
type OwnerFormValues = {
  fullName: string;
  bio: string;
  city: string;
  contactPhone?: string;
  contactEmail?: string;
  instagram?: string;
  telegram?: string;
  profileImage?: File;
};

export default function OwnerSetupPage() {
  const { t } = useTranslation('ownerSetup');
  const { user } = useAuth();
  const router = useRouter();
  const [globalError, setGlobalError] = useState<string | null>(null);

  // локализованные сообщения валидации через t()
  const phoneRegex = /^(\+?\d[\d\s\-()]{6,20}\d)?$/; // мягкая проверка
  const instagramRegex = /^(https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._%-]+\/?|@[A-Za-z0-9._%-]+)?$/;
  const telegramRegex = /^(https?:\/\/t\.me\/[A-Za-z0-9_]{3,}|@[A-Za-z0-9_]{3,})?$/;

  const ownerSchema = useMemo(
    () =>
      z.object({
        fullName: z.string().min(1, t('errors.fullNameRequired')),
        bio: z.string().max(300, t('errors.bioMax')),
        city: z.string().min(1, t('errors.cityRequired')),
        contactPhone: z
          .string()
          .optional()
          .refine((v) => !v || phoneRegex.test(v), t('errors.phoneInvalid')),
        contactEmail: z
          .string()
          .optional()
          .refine((v) => !v || z.string().email().safeParse(v).success, t('errors.emailInvalid')),
        instagram: z
          .string()
          .optional()
          .refine((v) => !v || instagramRegex.test(v), t('errors.instagramInvalid')),
        telegram: z
          .string()
          .optional()
          .refine((v) => !v || telegramRegex.test(v), t('errors.telegramInvalid')),
        profileImage: z
          .instanceof(File)
          .optional()
          .refine((f) => !f || f.size <= 2e6, t('errors.photoMax')),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<OwnerFormValues>({
    resolver: zodResolver(ownerSchema),
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      bio: '',
      city: '',
      contactPhone: '',
      contactEmail: '',
      instagram: '',
      telegram: '',
      profileImage: undefined,
    },
  });

  const file = watch('profileImage');
  const previewUrl = file ? URL.createObjectURL(file) : null;

  // ----- Save -----
  const saveProfile = async (data: OwnerFormValues) => {
    if (!user) throw new Error(t('errorMessageUser'));

    let profileImageUrl = '';
    if (data.profileImage) {
      const imageRef = ref(storage, `owners/${user.uid}/profile.jpg`);
      await uploadBytes(imageRef, data.profileImage);
      profileImageUrl = await getDownloadURL(imageRef);
    }

    await setDoc(doc(db, 'owner', user.uid), {
      uid: user.uid,
      fullName: data.fullName,
      bio: data.bio,
      city: data.city,
      contactPhone: data.contactPhone ?? '',
      contactEmail: data.contactEmail ?? '',
      socialLinks: {
        instagram: data.instagram ?? '',
        telegram: data.telegram ?? '',
      },
      profileImageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      metrics: {
        listingsCount: 0,
        completedRentals: 0,
        averageRating: 0,
        responseTime: '30 минут', // сервисная метрика
      },
    });
  };

  // ----- Submit -----
  const onSubmit = async (data: OwnerFormValues) => {
    setGlobalError(null);
    try {
      await saveProfile(data);
      alert(t('successMessage'));
      if (!user) {
        setGlobalError(t('errorMessageUser'));
        return;
      }
      router.push(`/profile/owner/${user.uid}`);
    } catch (e) {
      console.error(e);
      setGlobalError(t('errorMessage'));
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 flex justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl space-y-8 bg-card p-8 rounded-2xl shadow-md border"
      >
        <h1 className="text-2xl font-bold text-center">{t('title')}</h1>

        {/* Фото профиля */}
        <div className="flex flex-col items-center gap-3">
          <Label>{t('photo')}</Label>
          <div className="w-32 h-32 rounded-full overflow-hidden border shadow">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt={t('avatarAlt')}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-sm">
                {t('noPhoto')}
              </div>
            )}
          </div>

          {/* Кастомная кнопка выбора файла */}
          <div className="flex items-center gap-3">
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setValue('profileImage', f);
              }}
            />
            <label
              htmlFor="profileImage"
              className="inline-flex items-center px-4 py-2 rounded-lg border border-input bg-background hover:bg-accent cursor-pointer"
            >
              {t('choosePhoto')}
            </label>
            <span className="text-sm text-muted-foreground truncate max-w-[220px]">
              {file?.name ?? t('noFile')}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {t('photoHint', { size: '2 MB' })} · {t('photoFormats', { formats: 'JPG, PNG, WebP' })}
          </p>

          {errors.profileImage && (
            <p className="text-destructive text-sm">{errors.profileImage.message as string}</p>
          )}
        </div>

        <Separator />

        {/* ФИО */}
        <div className="space-y-1">
          <Label htmlFor="fullName">{t('fullName')}</Label>
          <Input
            id="fullName"
            placeholder={t('placeholderFullName')}
            {...register('fullName')}
          />
          {errors.fullName && (
            <p className="text-destructive text-sm">{errors.fullName.message}</p>
          )}
        </div>

        {/* О себе */}
        <div className="space-y-1">
          <Label htmlFor="bio">{t('bio')}</Label>
          <Textarea
            id="bio"
            rows={4}
            placeholder={t('placeholderBio')}
            {...register('bio')}
          />
          {errors.bio && <p className="text-destructive text-sm">{errors.bio.message}</p>}
        </div>

        {/* Город */}
        <div className="space-y-1">
          <Label htmlFor="city">{t('city')}</Label>
          <Input id="city" placeholder={t('placeholderCity')} {...register('city')} />
          {errors.city && <p className="text-destructive text-sm">{errors.city.message}</p>}
        </div>

        {/* Телефон */}
        <div className="space-y-1">
          <Label htmlFor="contactPhone">{t('phone')}</Label>
          <Input
            id="contactPhone"
            placeholder={t('placeholderPhone')}
            {...register('contactPhone')}
          />
          {errors.contactPhone && (
            <p className="text-destructive text-sm">{errors.contactPhone.message as string}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <Label htmlFor="contactEmail">{t('email')}</Label>
          <Input
            id="contactEmail"
            type="email"
            placeholder={t('placeholderEmail')}
            {...register('contactEmail')}
          />
          {errors.contactEmail && (
            <p className="text-destructive text-sm">{errors.contactEmail.message as string}</p>
          )}
        </div>

        {/* Instagram */}
        <div className="space-y-1">
          <Label htmlFor="instagram">{t('instagram')}</Label>
          <Input
            id="instagram"
            placeholder={t('placeholderInstagram')}
            {...register('instagram')}
          />
          {errors.instagram && (
            <p className="text-destructive text-sm">{errors.instagram.message as string}</p>
          )}
        </div>

        {/* Telegram */}
        <div className="space-y-1">
          <Label htmlFor="telegram">{t('telegram')}</Label>
          <Input
            id="telegram"
            placeholder={t('placeholderTelegram')}
            {...register('telegram')}
          />
          {errors.telegram && (
            <p className="text-destructive text-sm">{errors.telegram.message as string}</p>
          )}
        </div>

        {/* Общая ошибка */}
        {globalError && <p className="text-center text-destructive">{globalError}</p>}

        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base py-6 rounded-xl mt-2 transition"
        >
          {isSubmitting ? t('saving') : t('save')}
        </Button>
      </form>
    </div>
  );
}
