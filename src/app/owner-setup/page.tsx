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
import Image from 'next/image';

export default function OwnerSetupPage() {
  const { t } = useTranslation('ownerSetup');
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
      if (profileImage) {
        const imageRef = ref(storage, `owners/${user.uid}/profile.jpg`);
        await uploadBytes(imageRef, profileImage);
        profileImageUrl = await getDownloadURL(imageRef);
      }

      const ownerProfile = {
        uid: user.uid,
        ...formData,
        profileImageUrl: profileImageUrl || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        metrics: {
          listingsCount: 0,
          completedRentals: 0,
          averageRating: 0,
          responseTime: '30 минут', // метрика, не UI
        },
      };

      await setDoc(doc(db, 'owner', user.uid), ownerProfile);

      alert(t('successMessage'));

      if (user?.uid) {
        router.push(`/profile/owner/${user.uid}`);
      } else {
        console.error('UID not found');
        alert(t('errorMessageUser'));
      }
    } catch (error) {
      console.error('Save error:', error);
      alert(t('errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'instagram' || name === 'telegram') {
      setFormData((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfileImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
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
          {t('title')}
        </h1>

        {/* Фото профиля */}
        <div className="flex flex-col items-center gap-4">
          <Label>{t('photo')}</Label>
          <div className="w-32 h-32 rounded-full overflow-hidden border shadow">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt={t('avatarAlt')}
                width={120}
                height={120}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
                {t('noPhoto')}
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
          <Label htmlFor="fullName">{t('fullName')}</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            placeholder={t('placeholderFullName')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">{t('bio')}</Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            maxLength={300}
            required
            placeholder={t('placeholderBio')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">{t('city')}</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            placeholder={t('placeholderCity')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPhone">{t('phone')}</Label>
          <Input
            id="contactPhone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            placeholder={t('placeholderPhone')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">{t('email')}</Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            type="email"
            placeholder={t('placeholderEmail')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagram">{t('instagram')}</Label>
          <Input
            id="instagram"
            name="instagram"
            value={formData.socialLinks.instagram}
            onChange={handleChange}
            placeholder={t('placeholderInstagram')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telegram">{t('telegram')}</Label>
          <Input
            id="telegram"
            name="telegram"
            value={formData.socialLinks.telegram}
            onChange={handleChange}
            placeholder={t('placeholderTelegram')}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base py-6 rounded-xl mt-4 transition"
        >
          {isSubmitting ? t('saving') : t('save')}
        </Button>
      </form>
    </div>
  );
}
