'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ListingFormProvider, useListingForm } from '@/context/ListingFormContext';
import StepBasicInfo from './steps/StepBasicInfo';
import StepRentConditions from './steps/StepRentConditions';
import StepDescription from './steps/StepDescription';
import StepPhotos from './steps/StepPhotos';
import { cn } from '@/lib/utils';
import { db } from '@/app/firebase/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/hooks/useAuth'; // ✅ новый импорт
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation'; 

const steps = [
  { component: StepBasicInfo },
  { component: StepRentConditions },
  { component: StepDescription },
  { component: StepPhotos },
];

function ListingFormInner() {
  const [step, setStep] = useState(0);
  const { resetData, data } = useListingForm();
  const { user, loading } = useAuth(); // ✅ хук из hooks/useAuth
  const { t } = useTranslation();
  const router = useRouter();
  const StepComponent = steps[step].component;

  const nextStep = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const handlePublish = async () => {
  if (loading) {
    alert(t('listing:authLoading'));
    return;
  }

  if (!user) {
    alert(t('listing:authRequired'));
    return;
  }

  try {
    const storage = getStorage();
    const uploadPromises = data.photos.map(async (file, idx) => {
      const fileName = `${user.uid}/${Date.now()}_${idx}_${file.name}`;
      const fileRef = storageRef(storage, `listings/${fileName}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      return url;
    });

    const photoURLs = await Promise.all(uploadPromises);

    // 🧑‍💼 Подгружаем данные владельца из Firestore
    const ownerRef = collection(db, 'owner');
    const ownerDocSnap = await (await import('firebase/firestore')).getDoc(
      (await import('firebase/firestore')).doc(ownerRef, user.uid)
    );

    if (!ownerDocSnap.exists()) {
      alert('Профиль владельца не найден');
      return;
    }

    const ownerData = ownerDocSnap.data();

    const listingRef = collection(db, 'listings');
    const docRef = await addDoc(listingRef, {
    ...data,
    photos: photoURLs,
    ownerId: user.uid,
    ownerName: ownerData.fullName || '',
    ownerAvatar: ownerData.profileImageUrl || '',
    ownerRating: ownerData.metrics?.averageRating || 0,
    ownerCity: ownerData.city || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

    alert(t('listing:successMessage'));
    resetData();
    router.push(`/listing/${docRef.id}`);
  } catch (error) {
    console.error('Ошибка при сохранении:', error);
    alert(t('listing:errorMessage'));
  }
};

  if (loading) {
    return <div className="text-center py-10">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen px-4 md:px-10 py-10 bg-background flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="bg-card shadow-md rounded-2xl border p-6 md:p-10 space-y-6">
        <StepComponent />

        <div className={cn(
          'flex flex-col-reverse gap-4 sm:flex-row justify-between pt-6 border-t'
        )}>
          {step > 0 ? (
            <Button variant="outline" onClick={prevStep}>
              {t('listing:back')}
            </Button>
          ) : (
            <div />
          )}

          {step < steps.length - 1 ? (
            <Button onClick={nextStep} className="bg-orange-500 hover:bg-orange-600 text-white">
              {t('listing:next')}
            </Button>
          ) : (
            <Button
              onClick={handlePublish}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={loading}
            >
              {t('listing:publish')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ListingForm() {
  return (
    <ListingFormProvider>
      <ListingFormInner />
    </ListingFormProvider>
  );
}
