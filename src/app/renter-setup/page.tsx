'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Path, PathValue } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { db, storage } from '@/app/firebase/firebase';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

// Значения enum остаются стабильными в БД, а лейблы переводим
type RentDuration = '1-3' | '3-6' | '6+' | '12+';
type Pets = 'no' | 'cat' | 'dog';
type YesNo = 'yes' | 'no';

type RenterFormValues = {
  fullName: string;
  bio: string;
  city: string;
  rentDuration: RentDuration;
  hasPets: Pets;
  hasKids: YesNo;
  smoking: YesNo;
  occupation: string;
  budgetFrom: number;
  budgetTo: number;
  profileImage?: File;
};

export default function RenterSetupPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useTranslation('renterSetup');

  // Схему строим после получения t(), чтобы локализовать сообщения
  const renterSchema = useMemo(
    () =>
      z.object({
        fullName: z.string().min(1, t('errors.fullNameRequired')),
        bio: z.string().max(300, t('errors.bioMax')),
        city: z.string().min(1, t('errors.cityRequired')),
        rentDuration: z.enum(['1-3', '3-6', '6+', '12+'] as const),
        hasPets: z.enum(['no', 'cat', 'dog'] as const),
        hasKids: z.enum(['yes', 'no'] as const),
        smoking: z.enum(['yes', 'no'] as const),
        occupation: z.string().min(1, t('errors.occupationRequired')),
        budgetFrom: z.number().min(100, t('errors.budgetMin')),
        budgetTo: z.number().max(1500, t('errors.budgetMax')),
        profileImage: z
          .instanceof(File)
          .optional()
          .refine(f => !f || f.size <= 2e6, t('errors.photoMax')),
      }),
    [t]
  );

  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RenterFormValues>({
    resolver: zodResolver(renterSchema),
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      bio: '',
      city: '',
      rentDuration: '1-3',
      hasPets: 'no',
      hasKids: 'no',
      smoking: 'no',
      occupation: '',
      budgetFrom: 300,
      budgetTo: 500,
      profileImage: undefined,
    },
  });

  // typed setValue helper
  const setTypedValue = <K extends Path<RenterFormValues>>(
    field: K,
    value: PathValue<RenterFormValues, K>
  ) => setValue(field, value);

  // Локализованные наборы опций
  const durationOptions: ReadonlyArray<RentDuration> = ['1-3', '3-6', '6+', '12+'] as const;
  const petsOptions: ReadonlyArray<Pets> = ['no', 'cat', 'dog'] as const;
  const yesNoOptions: ReadonlyArray<YesNo> = ['no', 'yes'] as const;

  const durationLabel = (v: RentDuration) =>
    v === '1-3'
      ? t('options.duration.1_3')
      : v === '3-6'
      ? t('options.duration.3_6')
      : v === '6+'
      ? t('options.duration.6_plus')
      : t('options.duration.12_plus');

  const petsLabel = (v: Pets) =>
    v === 'no' ? t('options.pets.none') : v === 'cat' ? t('options.pets.cat') : t('options.pets.dog');

  const yesNoLabel = (v: YesNo) => (v === 'yes' ? t('options.common.yes') : t('options.common.no'));

  // Превью файла
  const file = watch('profileImage');
  const previewUrl = file ? URL.createObjectURL(file) : null;

  // Сохранение профиля
  const saveProfile = async (data: RenterFormValues) => {
    if (!user) throw new Error(t('errors.unauthorized'));

    let profileImageUrl = '';
    if (data.profileImage) {
      const imageRef = ref(storage, `renterAvatars/${user.uid}`);
      await uploadBytes(imageRef, data.profileImage);
      profileImageUrl = await getDownloadURL(imageRef);
    }

    await setDoc(doc(db, 'renter', user.uid), {
      uid: user.uid,
      fullName: data.fullName,
      bio: data.bio,
      city: data.city,
      rentDuration: data.rentDuration,
      hasPets: data.hasPets,
      hasKids: data.hasKids,
      smoking: data.smoking,
      occupation: data.occupation,
      budgetFrom: data.budgetFrom,
      budgetTo: data.budgetTo,
      profileImageUrl,
      createdAt: serverTimestamp(),
    });
  };

  const onSubmit = async (data: RenterFormValues) => {
    setGlobalError(null);
    try {
      await saveProfile(data);
      if (!user) {
        setGlobalError(t('errors.unauthorized'));
        return;
      }
      router.push(`/profile/renter/${user.uid}`);
    } catch (err) {
      console.error(err);
      setGlobalError(t('errors.saveFailed'));
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
        <div className="flex flex-col items-center gap-2">
          <Label>{t('photoLabel')}</Label>
          <div className="w-32 h-32 rounded-full overflow-hidden border">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt={t('avatarAlt')}
                className="w-full h-full object-cover"
                width={128}
                height={128}
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-sm">
                {t('noPhoto')}
              </div>
            )}
          </div>
          {/* Кнопка выбора файла с переводом */}
<div className="flex items-center gap-3">
  <input
    id="profileImage"
    type="file"
    accept="image/*"
    className="sr-only"
    onChange={e => {
      const f = e.target.files?.[0];
      if (f) setValue('profileImage', f); // или setProfileImage(f) в OwnerSetup
    }}
  />
  <label
    htmlFor="profileImage"
    className="inline-flex items-center px-4 py-2 rounded-lg border border-input bg-background hover:bg-accent cursor-pointer"
  >
    {t('choosePhoto')} {/* <-- локализованный текст */}
  </label>

  {/* Показать имя выбранного файла */}
  <span className="text-sm text-muted-foreground truncate max-w-[220px]">
    {file?.name ?? t('noFile')}
  </span>
</div>

{/* Подсказка под кнопкой */}
<p className="text-xs text-muted-foreground mt-1">
  {t('photoHint', { size: '2 MB' })} · {t('photoFormats', { formats: 'JPG, PNG, WebP' })}
</p>
          {errors.profileImage && (
            <p className="text-destructive text-sm">{errors.profileImage.message as string}</p>
          )}
        </div>

        <Separator />

        {/* Текстовые поля */}
        <div className="space-y-1">
          <Label htmlFor="fullName">{t('fullName')}</Label>
          <Input id="fullName" placeholder={t('placeholderFullName')} {...register('fullName')} />
          {errors.fullName && <p className="text-destructive text-sm">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="bio">{t('bio')}</Label>
          <Textarea id="bio" rows={4} placeholder={t('placeholderBio')} {...register('bio')} />
          {errors.bio && <p className="text-destructive text-sm">{errors.bio.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="city">{t('city')}</Label>
          <Input id="city" placeholder={t('placeholderCity')} {...register('city')} />
          {errors.city && <p className="text-destructive text-sm">{errors.city.message}</p>}
        </div>

        {/* Слайдер бюджета */}
        <div className="space-y-4">
          <Label>{t('budgetLabel')}</Label>
          <Slider
            min={100}
            max={1500}
            step={50}
            defaultValue={[300, 500]}
            onValueChange={([from, to]) => {
              setTypedValue('budgetFrom', from);
              setTypedValue('budgetTo', to);
            }}
          />
          <div className="text-sm text-muted-foreground">
            {t('budgetRange', { from: watch('budgetFrom'), to: watch('budgetTo') })}
          </div>
        </div>

        {/* Селекты */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>{t('rentDuration')}</Label>
            <Select onValueChange={val => setTypedValue('rentDuration', val as RentDuration)}>
              <SelectTrigger>
                <SelectValue placeholder={t('choose')} />
              </SelectTrigger>
              <SelectContent>
                {durationOptions.map(opt => (
                  <SelectItem key={opt} value={opt}>
                    {durationLabel(opt)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>{t('hasPets')}</Label>
            <Select onValueChange={val => setTypedValue('hasPets', val as Pets)}>
              <SelectTrigger>
                <SelectValue placeholder={t('choose')} />
              </SelectTrigger>
              <SelectContent>
                {petsOptions.map(opt => (
                  <SelectItem key={opt} value={opt}>
                    {petsLabel(opt)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>{t('hasKids')}</Label>
            <Select onValueChange={val => setTypedValue('hasKids', val as YesNo)}>
              <SelectTrigger>
                <SelectValue placeholder={t('choose')} />
              </SelectTrigger>
              <SelectContent>
                {yesNoOptions.map(opt => (
                  <SelectItem key={opt} value={opt}>
                    {yesNoLabel(opt)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>{t('smoking')}</Label>
            <Select onValueChange={val => setTypedValue('smoking', val as YesNo)}>
              <SelectTrigger>
                <SelectValue placeholder={t('choose')} />
              </SelectTrigger>
              <SelectContent>
                {yesNoOptions.map(opt => (
                  <SelectItem key={opt} value={opt}>
                    {yesNoLabel(opt)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Профессия */}
        <div className="space-y-1">
          <Label htmlFor="occupation">{t('occupation')}</Label>
          <Input id="occupation" placeholder={t('placeholderOccupation')} {...register('occupation')} />
          {errors.occupation && <p className="text-destructive text-sm">{errors.occupation.message}</p>}
        </div>

        {/* Общая ошибка */}
        {globalError && <p className="text-center text-destructive">{globalError}</p>}

        <Button type="submit" disabled={!isValid || isSubmitting} className="w-full py-4">
          {isSubmitting ? t('saving') : t('save')}
        </Button>
      </form>
    </div>
  );
}
