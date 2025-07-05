'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { UploadCloud } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { db, storage } from '@/app/firebase/firebase';
import { setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/hooks/useAuth'; // предполагаем, что у тебя есть этот хук
import { useRouter } from 'next/navigation';

export default function RenterSetupPage() {
  const { t } = useTranslation();
  const { user } = useAuth(); // получаем пользователя

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [budget, setBudget] = useState<[number, number]>([300, 500]);

  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [duration, setDuration] = useState('');
  const [pets, setPets] = useState('');
  const [kids, setKids] = useState('');
  const [smoking, setSmoking] = useState('')
  const [job, setJob] = useState('');
  const router = useRouter();
  

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!user) {
    alert('Вы не авторизованы');
    return;
  }

  

    try {
      let photoURL = '';

      if (profileImage) {
        const imageRef = ref(storage, `renterAvatars/${user.uid}`);
        await uploadBytes(imageRef, profileImage);
        photoURL = await getDownloadURL(imageRef);
      }

      await setDoc(doc(db, 'renter', user.uid), {
        fullName,
        bio,
        city,
        rentDuration: duration,
        hasPets: pets,
        hasKids: kids,
        smoking, 
        occupation: job,
        budgetFrom: budget[0],
        budgetTo: budget[1],
        photoURL,
        createdAt: new Date(),
      });

      alert('Профиль успешно сохранён!');
      // ✅ Уверены, что user есть — значит можно безопасно использовать user.uid
      router.push(`/profile/renter/${user.uid}`);
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      alert('Не удалось сохранить профиль.');
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 flex justify-center items-start">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl space-y-8 bg-card p-8 rounded-2xl shadow-md border"
      >
        <h1 className="text-2xl font-bold text-center">
          {t('renter.setup.title', 'Настройка профиля арендатора')}
        </h1>

        {/* Фото профиля */}
        <div className="flex flex-col items-center gap-4">
          <Label>{t('renter.setup.photo', 'Фото профиля')}</Label>
          <div className="w-32 h-32 rounded-full overflow-hidden border shadow">
            {previewUrl ? (
              <img src={previewUrl} alt="Аватар" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
                {t('renter.setup.noPhoto', 'Нет фото')}
              </div>
            )}
          </div>
          <Input type="file" accept="image/*" onChange={handleImageChange} className="max-w-xs" />
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="name">{t('renter.setup.name', 'Имя или ник')}</Label>
          <Input
  id="name"
  placeholder="Андрей, Марина, айтишница..."
  value={fullName}
  onChange={(e) => setFullName(e.target.value)}
  required
/>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">{t('renter.setup.bio', 'О себе / Кто вы?')}</Label>
          <Textarea
  id="bio"
  maxLength={300}
  value={bio}
  onChange={(e) => setBio(e.target.value)} // ← вот он
  placeholder="Работаю дизайнером, тихий, без животных. Ищу жильё на 6 месяцев."
  required
/>
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">{t('renter.setup.city', 'Город, где ищете жильё')}</Label>
          <Input
  id="city"
  placeholder="Киев, Львов и т.д."
  value={city}
  onChange={(e) => setCity(e.target.value)}
  required
/>
        </div>

        <div className="space-y-2">
          <Label>{t('renter.setup.budget', 'Бюджет в месяц ($)')}</Label>
          <Slider
            min={100}
            max={1500}
            step={50}
            defaultValue={budget}
            onValueChange={(val) => setBudget(val as [number, number])}
          />
          <div className="text-sm text-muted-foreground">
            {t('renter.setup.budgetRange', 'От')} {budget[0]}$ {t('renter.setup.to', 'до')} {budget[1]}$
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t('renter.setup.duration', 'Желаемый срок аренды')}</Label>
          <Select onValueChange={setDuration}>
            <SelectTrigger>
              <SelectValue placeholder={t('renter.setup.durationPlaceholder', 'Выберите срок аренды')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-3">1–3 месяца</SelectItem>
              <SelectItem value="3-6">3–6 месяцев</SelectItem>
              <SelectItem value="6+">6+ месяцев</SelectItem>
              <SelectItem value="12+">Год и больше</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t('renter.setup.pets', 'Животные')}</Label>
          <Select onValueChange={setPets}>
            <SelectTrigger>
              <SelectValue placeholder={t('renter.setup.petsPlaceholder', 'Есть ли у вас животные?')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">Нет</SelectItem>
              <SelectItem value="cat">Кошка</SelectItem>
              <SelectItem value="dog">Собака</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t('renter.setup.kids', 'Дети')}</Label>
          <Select onValueChange={setKids}>
            <SelectTrigger>
              <SelectValue placeholder={t('renter.setup.kidsPlaceholder', 'Есть ли у вас дети?')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">Нет</SelectItem>
              <SelectItem value="yes">Да</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
  <Label>{t('renter.setup.smoking', 'Курение')}</Label>
  <Select onValueChange={setSmoking}>
    <SelectTrigger>
      <SelectValue placeholder={t('renter.setup.smokingPlaceholder', 'Курите ли вы?')} />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="no">{t('renter.setup.smokingNo', 'Нет')}</SelectItem>
      <SelectItem value="yes">{t('renter.setup.smokingYes', 'Да')}</SelectItem>
    </SelectContent>
  </Select>
</div>

        <div className="space-y-2">
          <Label htmlFor="job">{t('renter.setup.job', 'Работа / занятость')}</Label>
          <Input
            id="job"
            value={job}
            onChange={(e) => setJob(e.target.value)}
            placeholder="Фрилансер, студент, разработчик..."
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base py-6 rounded-xl mt-4 transition"
        >
          {t('renter.setup.save', 'Сохранить и продолжить')}
        </Button>
      </form>
    </div>
  );
}
