'use client';

import { useState } from 'react';
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

// 1) Схема валидации и типы
const renterSchema = z.object({
  fullName: z.string().min(1, 'Введите имя'),
  bio: z.string().max(300, 'Не более 300 символов'),
  city: z.string().min(1, 'Введите город'),
  rentDuration: z.enum(['1-3', '3-6', '6+', '12+']),
  hasPets: z.enum(['no', 'cat', 'dog']),
  hasKids: z.enum(['yes', 'no']),
  smoking: z.enum(['yes', 'no']),
  occupation: z.string().min(1, 'Укажите род деятельности'),
  budgetFrom: z.number().min(100),
  budgetTo: z.number().max(1500),
  profileImage: z
    .instanceof(File)
    .optional()
    .refine(f => !f || f.size <= 2e6, 'Макс. 2 МБ'),
});

type RenterFormValues = z.infer<typeof renterSchema>;

export default function RenterSetupPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [globalError, setGlobalError] = useState<string | null>(null);

  // 2) Настраиваем React Hook Form с Zod
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

  // Утилита для типобезопасного setValue
  const setTypedValue = <K extends Path<RenterFormValues>>(
    field: K,
    value: PathValue<RenterFormValues, K>
  ) => {
    setValue(field, value);
  };

  // Вспомогательные описания полей
  const textFields = [
    { id: 'fullName', label: 'Имя или ник', type: 'input' },
    { id: 'bio', label: 'О себе', type: 'textarea' },
    { id: 'city', label: 'Город', type: 'input' },
  ] as const;

  const selectFields = [
    {
      name: 'rentDuration',
      label: 'Срок аренды',
      options: ['1-3', '3-6', '6+', '12+'] as RenterFormValues['rentDuration'][],
    },
    {
      name: 'hasPets',
      label: 'Животные',
      options: ['no', 'cat', 'dog'] as RenterFormValues['hasPets'][],
    },
    {
      name: 'hasKids',
      label: 'Дети',
      options: ['no', 'yes'] as RenterFormValues['hasKids'][],
    },
    {
      name: 'smoking',
      label: 'Курение',
      options: ['no', 'yes'] as RenterFormValues['smoking'][],
    },
  ] as const;

  // 3) Загрузка фото и запись профиля
  const saveProfile = async (data: RenterFormValues) => {
    if (!user) throw new Error('Неавторизован');

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

  // 4) Обработчик сабмита
  const onSubmit = async (data: RenterFormValues) => {
    setGlobalError(null);
    try {
      await saveProfile(data);
      if (!user) {
        setGlobalError('Неавторизован');
        return;
      }
      router.push(`/profile/renter/${user.uid}`);
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : 'Не удалось сохранить профиль';
      setGlobalError(message);
    }
  };

  // Для превью загруженного файла
  const file = watch('profileImage');
  const previewUrl = file ? URL.createObjectURL(file) : null;

  return (
    <div className="min-h-screen bg-background py-12 px-4 flex justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl space-y-8 bg-card p-8 rounded-2xl shadow-md border"
      >
        <h1 className="text-2xl font-bold text-center">
          Настройка профиля арендатора
        </h1>

        {/* Фото профиля */}
        <div className="flex flex-col items-center gap-2">
          <Label>Фото профиля (макс 2 МБ)</Label>
          <div className="w-32 h-32 rounded-full overflow-hidden border">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                width={128}
                height={128}
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-sm">
                Нет фото
              </div>
            )}
          </div>
          <Input
            type="file"
            accept="image/*"
            onChange={e => {
              const f = e.target.files?.[0];
              if (f) setValue('profileImage', f);
            }}
          />
          {errors.profileImage && (
            <p className="text-destructive text-sm">
              {errors.profileImage.message}
            </p>
          )}
        </div>

        <Separator />

        {/* Текстовые поля */}
        {textFields.map(({ id, label, type }) => (
          <div key={id} className="space-y-1">
            <Label htmlFor={id}>{label}</Label>
            {type === 'input' ? (
              <Input id={id} {...register(id as Path<RenterFormValues>)} />
            ) : (
              <Textarea
                id={id}
                {...register(id as Path<RenterFormValues>)}
                rows={4}
              />
            )}
            {errors[id] && (
              <p className="text-destructive text-sm">
                {errors[id]?.message}
              </p>
            )}
          </div>
        ))}

        {/* Слайдер бюджета */}
        <div className="space-y-4">
          <Label>Бюджет ($/мес)</Label>
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
            От {watch('budgetFrom')}$ до {watch('budgetTo')}$
          </div>
        </div>

        {/* Селекты */}
        <div className="grid grid-cols-2 gap-4">
          {selectFields.map(({ name, label, options }) => (
            <div key={name} className="space-y-1">
              <Label>{label}</Label>
              <Select onValueChange={val => setTypedValue(name, val as (typeof options)[number])}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите..." />
                </SelectTrigger>
                <SelectContent>
                  {options.map(opt => (
                    <SelectItem key={opt} value={opt}>
                      {opt === 'no'
                        ? 'Нет'
                        : opt === 'yes'
                        ? 'Да'
                        : opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors[name] && (
                <p className="text-destructive text-sm">
                  {errors[name]?.message}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Профессия */}
        <div className="space-y-1">
          <Label htmlFor="occupation">Работа / занятость</Label>
          <Input id="occupation" {...register('occupation')} />
          {errors.occupation && (
            <p className="text-destructive text-sm">
              {errors.occupation.message}
            </p>
          )}
        </div>

        {/* Общая ошибка */}
        {globalError && (
          <p className="text-center text-destructive">{globalError}</p>
        )}

        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full py-4"
        >
          {isSubmitting ? 'Сохраняем…' : 'Сохранить и продолжить'}
        </Button>
      </form>
    </div>
  );
}
