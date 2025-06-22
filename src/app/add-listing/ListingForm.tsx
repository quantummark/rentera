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
import { useAuth } from '@/app/context/AuthContext'; // если ты его уже подключил

const steps = [
  { component: StepBasicInfo },
  { component: StepRentConditions },
  { component: StepDescription },
  { component: StepPhotos },
];

function ListingFormInner() {
  const [step, setStep] = useState(0);
  const { updateData, ...formContext } = useListingForm();
  const { user } = useAuth(); // uid для владельца
  const StepComponent = steps[step].component;

  const nextStep = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const handlePublish = async () => {
    if (!user) {
      alert('Вы должны быть авторизованы, чтобы опубликовать объект.');
      return;
    }

    try {
      const listingRef = collection(db, 'listings');
      await addDoc(listingRef, {
        ...formContext.data,
        ownerId: user?.uid,
        createdAt: serverTimestamp(),
      });
      alert('Объект успешно опубликован!');
      // сброс или переход на страницу
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      alert('Произошла ошибка при публикации. Попробуйте позже.');
    }
  };

  return (
    <div className="min-h-screen px-4 md:px-10 py-10 bg-background flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="bg-card shadow-md rounded-2xl border p-6 md:p-10 space-y-6">
        <StepComponent />

        <div className={cn(
          'flex flex-col-reverse gap-4 sm:flex-row justify-between pt-6 border-t'
        )}>
          {step > 0 ? (
            <Button variant="outline" onClick={prevStep}>
              Назад
            </Button>
          ) : (
            <div />
          )}

          {step < steps.length - 1 ? (
            <Button onClick={nextStep} className="bg-orange-500 hover:bg-orange-600 text-white">
              Далее
            </Button>
          ) : (
            <Button onClick={handlePublish} className="bg-green-600 hover:bg-green-700 text-white">
              Опубликовать
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
