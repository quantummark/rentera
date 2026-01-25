'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ListingFormProvider, useListingForm } from '@/context/ListingFormContext';
import { useAuth } from '@/hooks/useAuth';

import StepBasicInfo from './steps/StepBasicInfo';
import StepRentConditions from './steps/StepRentConditions';
import StepDescription from './steps/StepDescription';
import StepPhotos from './steps/StepPhotos';

import { db } from '@/app/firebase/firebase';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
  type DocumentData,
} from 'firebase/firestore';

import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const steps = [
  { component: StepBasicInfo },
  { component: StepRentConditions },
  { component: StepDescription },
  { component: StepPhotos },
] as const;

/** ---------- City normalization helpers (лучше потом вынести в /lib/search/city.ts) ---------- */

function normalizeCityInput(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[’'`]/g, '')
    .replace(/[-.,/\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toCityKey(city: string): string {
  const c = normalizeCityInput(city);

  const map: Record<string, string> = {
    киев: 'kyiv',
    київ: 'kyiv',
    kiev: 'kyiv',
    kyiv: 'kyiv',

    одесса: 'odesa',
    одеса: 'odesa',
    odessa: 'odesa',
    odesa: 'odesa',

    харьков: 'kharkiv',
    харків: 'kharkiv',
    kharkov: 'kharkiv',
    kharkiv: 'kharkiv',

    львов: 'lviv',
    львів: 'lviv',
    lvov: 'lviv',
    lviv: 'lviv',

    днепр: 'dnipro',
    дніпро: 'dnipro',
    dnepr: 'dnipro',
    dnipro: 'dnipro',
  };

  return map[c] ?? c;
}

function buildCityAliases(city: string): string[] {
  const originalNorm = normalizeCityInput(city);
  const key = toCityKey(city);

  const aliases = new Set<string>();
  if (key) aliases.add(key);
  if (originalNorm) aliases.add(originalNorm);

  // Доп. популярные варианты для ключевых городов (можно расширять)
  if (key === 'kyiv') {
    aliases.add('kiev');
    aliases.add('киев');
    aliases.add('київ');
  }

  return Array.from(aliases);
}

/** ---------- Safe owner data helpers ---------- */

function getStringField(obj: DocumentData, key: string): string {
  const v = obj[key];
  return typeof v === 'string' ? v : '';
}

function getNumberField(obj: DocumentData, key: string): number {
  const v = obj[key];
  return typeof v === 'number' ? v : 0;
}

function getNestedNumber(obj: DocumentData, path: string[]): number {
  let cur: unknown = obj;
  for (const k of path) {
    if (typeof cur !== 'object' || cur === null) return 0;
    cur = (cur as Record<string, unknown>)[k];
  }
  return typeof cur === 'number' ? cur : 0;
}

function ListingFormInner() {
  const [step, setStep] = useState(0);

  const { resetData, data } = useListingForm();
  const { user, loading } = useAuth();

  const { t } = useTranslation();
  const router = useRouter();

  const StepComponent = steps[step].component;

  const nextStep = () => {
    if (step < steps.length - 1) setStep((s) => s + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep((s) => s - 1);
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
      // 1) Upload photos
      const storage = getStorage();
      const photoURLs = await Promise.all(
        data.photos.map(async (file, idx) => {
          const fileName = `${user.uid}/${Date.now()}_${idx}_${file.name}`;
          const fileRef = storageRef(storage, `listings/${fileName}`);
          await uploadBytes(fileRef, file);
          return getDownloadURL(fileRef);
        })
      );

      // 2) Load owner profile
      const ownerDocSnap = await getDoc(doc(db, 'owner', user.uid));

      if (!ownerDocSnap.exists()) {
        alert(t('listing:ownerProfileNotFound') || 'Профиль владельца не найден');
        return;
      }

      const ownerData = ownerDocSnap.data();

      const ownerName = getStringField(ownerData, 'fullName');
      const ownerAvatar = getStringField(ownerData, 'profileImageUrl');
      const ownerCity = getStringField(ownerData, 'city');
      const ownerRating = getNestedNumber(ownerData, ['metrics', 'averageRating']);

      // 3) City search fields
      const cityKey = toCityKey(data.city);
      const cityAliases = buildCityAliases(data.city);

      // 4) Build payload (Firestore-ready)
      const payload = {
        ...data,
        photos: photoURLs,

        // Date -> Timestamp (чтобы потом удобно фильтровать/сортировать)
        availableFrom: data.availableFrom ? Timestamp.fromDate(data.availableFrom) : null,

        // 🔥 “умный” город
        cityKey,
        cityAliases,

        // Owner
        ownerId: user.uid,
        ownerName: ownerName || user.displayName || '',
        ownerAvatar,
        ownerRating,
        ownerCity,

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // 5) Save listing
      const listingRef = collection(db, 'listings');
      const docRef = await addDoc(listingRef, payload);

      alert(t('listing:successMessage'));
      resetData();
      router.push(`/listing/${docRef.id}`);
    } catch (err: unknown) {
      // eslint-friendly error handling
      // (не пишем any)
      const message = err instanceof Error ? err.message : 'Unknown error';
      // лог полезен для дебага
      // eslint-disable-next-line no-console
      console.error('Ошибка при сохранении:', message, err);

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

        <div className={cn('flex flex-col-reverse gap-4 sm:flex-row justify-between pt-6 border-t')}>
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
