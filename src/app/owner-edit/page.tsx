'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/app/firebase/firebase';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function OwnerEditPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

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

  useEffect(() => {
    const fetchOwner = async () => {
      if (!user) return;
      const ref = doc(db, 'owner', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setFormData({
          fullName: data.fullName || '',
          bio: data.bio || '',
          city: data.city || '',
          contactPhone: data.contactPhone || '',
          contactEmail: data.contactEmail || '',
          socialLinks: data.socialLinks || { instagram: '', telegram: '' },
        });
        setPreviewUrl(data.profileImageUrl);
      }
    };

    fetchOwner();
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name in formData.socialLinks) {
      setFormData((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    let profileImageUrl = previewUrl || '';

    try {
      if (profileImage) {
        const imageRef = ref(storage, `owner/${user.uid}/profile.jpg`);
        await uploadBytes(imageRef, profileImage);
        profileImageUrl = await getDownloadURL(imageRef);
      }

      const updatedData = {
        ...formData,
        profileImageUrl,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(doc(db, 'owner', user.uid), updatedData);

      alert(t('ownerEdit.success', 'Профиль успешно обновлён'));
      router.push('/profile/owner');
    } catch (err) {
      console.error('Ошибка обновления профиля:', err);
      alert(t('ownerEdit.error', 'Ошибка при обновлении профиля'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 flex justify-center items-start">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl space-y-8 bg-card p-8 rounded-2xl shadow-md border text-sm"
      >
        <h1 className="text-xl font-bold text-center">
          {t('ownerEdit.title', 'Редактирование профиля владельца')}
        </h1>

        <div className="flex flex-col items-center gap-4">
          <Label>{t('ownerEdit.photo', 'Фото профиля')}</Label>
          <div className="w-32 h-32 rounded-full overflow-hidden border shadow">
            {previewUrl ? (
              <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
                {t('ownerEdit.noPhoto', 'Нет фото')}
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
          <Label htmlFor="fullName">{t('ownerEdit.fullName', 'Имя или ник')}</Label>
          <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">{t('ownerEdit.bio', 'О себе')}</Label>
          <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">{t('ownerEdit.city', 'Город')}</Label>
          <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPhone">{t('ownerEdit.phone', 'Телефон')}</Label>
          <Input id="contactPhone" name="contactPhone" value={formData.contactPhone} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email</Label>
          <Input id="contactEmail" name="contactEmail" type="email" value={formData.contactEmail} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram</Label>
          <Input id="instagram" name="instagram" value={formData.socialLinks.instagram} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telegram">Telegram</Label>
          <Input id="telegram" name="telegram" value={formData.socialLinks.telegram} onChange={handleChange} />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base py-6 rounded-xl mt-4"
        >
          {isSubmitting ? t('ownerEdit.saving', 'Сохраняем...') : t('ownerEdit.save', 'Сохранить изменения')}
        </Button>
      </form>
    </div>
  );
}