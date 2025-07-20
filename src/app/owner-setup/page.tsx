'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

import { db, storage } from '@/app/firebase/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

   export default function OwnerSetupPage() {
   const { t } = useTranslation();
   const { user } = useAuth();

   const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    city: '',
    contactPhone: '',
    contactEmail: '',
    socialLinks: {
      instagram: '',
      telegram: '',
    },
   });

   const [profileImage, setProfileImage] = useState<File | null>(null);
   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const router = useRouter();

   const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   if (!user) return;

   setIsSubmitting(true);

   let profileImageUrl = '';

   try {
  // Загружаем фото, если есть
  if (profileImage) {
    const imageRef = ref(storage, `owners/${user.uid}/profile.jpg`);
    await uploadBytes(imageRef, profileImage);
    profileImageUrl = await getDownloadURL(imageRef);
  }

  // Собираем данные
  const ownerProfile = {
    uid: user.uid,
    ...formData,
    profileImageUrl: profileImageUrl || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),

    // Стартовые метрики (можно потом обновить из админки)
    metrics: {
      listingsCount: 0,
      completedRentals: 0,
      averageRating: 0,
      responseTime: '30 минут',
    },
  };

  // Сохраняем в Firestore
  await setDoc(doc(db, 'owner', user.uid), ownerProfile);

  // Уведомление и переход
  alert(t('ownerSetup.successMessage', 'Профиль успешно сохранён!'));

  if (user?.uid) {
    router.push(`/profile/owner/${user.uid}`);
  } else {
    console.error('UID пользователя не найден');
    alert(t('ownerSetup.errorMessage', 'Ошибка: не удалось определить пользователя.'));
  }
} catch (error) {
  console.error('Ошибка при сохранении профиля:', error);
  alert(t('ownerSetup.errorMessage', 'Ошибка при сохранении профиля'));
} finally {
  setIsSubmitting(false);
}

    
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Handle nested socialLinks fields
    if (name === 'instagram' || name === 'telegram') {
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle profile image file input
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfileImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 flex justify-center items-start">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl space-y-8 bg-card p-8 rounded-2xl shadow-md border"
      >
        <h1 className="text-2xl font-bold text-center">
          {t('ownerSetup.title', 'Настройка профиля владельца')}
        </h1>

        {/* Фото профиля */}
        <div className="flex flex-col items-center gap-4">
          <Label>{t('ownerSetup.photo', 'Фото профиля')}</Label>
          <div className="w-32 h-32 rounded-full overflow-hidden border shadow">
            {previewUrl ? (
              <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
                {t('ownerSetup.noPhoto', 'Нет фото')}
              </div>
            )}
          </div>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="max-w-xs"
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="fullName">{t('ownerSetup.fullName', 'Имя или ник')}</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            placeholder="Ирина Коваль"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">{t('ownerSetup.bio', 'О себе')}</Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            maxLength={300}
            required
            placeholder="Сдаю жильё более 5 лет, предпочитаю долгосрочных арендаторов..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">{t('ownerSetup.city', 'Город')}</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            placeholder="Киев"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPhone">{t('ownerSetup.phone', 'Телефон')}</Label>
          <Input
            id="contactPhone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            placeholder="+380501234567"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email</Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            type="email"
            placeholder="owner@email.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            name="instagram"
            value={formData.socialLinks.instagram}
            onChange={handleChange}
            placeholder="https://instagram.com/..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telegram">Telegram</Label>
          <Input
            id="telegram"
            name="telegram"
            value={formData.socialLinks.telegram}
            onChange={handleChange}
            placeholder="@owner"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base py-6 rounded-xl mt-4 transition"
        >
          {isSubmitting
            ? t('ownerSetup.saving', 'Сохраняем...')
            : t('ownerSetup.save', 'Сохранить и продолжить')}
        </Button>
      </form>
    </div>
  );
}
