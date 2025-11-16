'use client';

import { useEffect, useRef, useState } from 'react';
import { useUserTypeWithProfile } from '@/hooks/useUserType';
import { db } from '@/app/firebase/firebase';
import {
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import debounce from 'lodash/debounce';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from 'react-i18next';
import SignaturePad, { type SignatureCanvas } from 'react-signature-canvas';
import { trimCanvas } from '@/app/utils/trimCanvas';

import {
  createAgreementPdf,
  type AgreementPdfData,
  type CurrencyCode,
} from '@/app/lib/pdf/agreementPdf';

type ExtendedAgreement = Agreement & {
  number?: string;
  address?: string;
  rentalStart?: Timestamp | string | Date;
  rentalEnd?: Timestamp | string | Date;
  currency?: string;
  additionalTerms?: string;
  city?: string;
  signatures?: AgreementPdfData['signatures'];
};

// Интерфейс пользователя договора
interface AgreementUser {
  fullName?: string;
  email?: string;
  phone?: string;
  currency?: string;
  [key: string]: unknown;
}

// Интерфейс документа договоров
interface Agreement {
  title?: string;
  status?: 'draft' | 'signed' | 'paid';
  pdfUrl?: string;
  ownerId?: string;
  renterId?: string;
  owner?: AgreementUser;
  renter?: AgreementUser;
  currency?: string;
  signatures?: {
    owner?: string;
    renter?: string;
  };
  isFrozen?: boolean;
  lastUpdated?: Timestamp;
  // …другие поля
  [key: string]: unknown;
}

// Тип значения для полей автосохранения
type FieldValue = string | number | boolean | Date | null | undefined;

// Пропсы компонента
interface AgreementFormProps {
  agreementId: string;
}

export default function AgreementTextForm({ agreementId }: AgreementFormProps) {
  const [userType] = useUserTypeWithProfile(); // 'owner' | 'renter' | null
  const currentUserType = userType ?? null;

  // Состояние документа договора
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const { t, i18n } = useTranslation(['AgreementForm', 'common']);
  const { t: tAgreementPdf } = useTranslation('agreementPdf');

  // Ссылки на canvas-подписи
  const ownerSignRef = useRef<SignatureCanvas>(null);
  const renterSignRef = useRef<SignatureCanvas>(null);

  // Стейт для сохранения подписей
  const [isSavingOwner, setIsSavingOwner] = useState<boolean>(false);
const [, setIsSavedOwner] = useState<boolean>(false);

const [isSavingRenter, setIsSavingRenter] = useState<boolean>(false);
const [, setIsSavedRenter] = useState<boolean>(false);


  const [ownerSigUrl, setOwnerSigUrl] = useState<string | null>(
    null
  );
  const [renterSigUrl, setRenterSigUrl] = useState<string | null>(
    null
  );

  // Подписываемся на документ Firestore
  useEffect(() => {
    const docRef = doc(db, 'contracts', agreementId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setAgreement(docSnap.data() as Agreement);
        setOwnerSigUrl(
          (docSnap.data() as Agreement).signatures?.owner as string | null
        );
        setRenterSigUrl(
          (docSnap.data() as Agreement).signatures?.renter as string | null
        );
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [agreementId]);

  // 1) Функция автосохранения поля с debounce
  const saveField = debounce(
    async (field: keyof Agreement, value: FieldValue) => {
      if (!agreement) return;
      setIsSaving(true);

      try {
        const docRef = doc(db, 'contracts', agreementId);
        await updateDoc(docRef, {
          [field]: value,
          lastUpdated: serverTimestamp(),
        });
      } catch (err: unknown) {
        console.error('Auto-save error:', err);
      } finally {
        setIsSaving(false);
      }
    },
    700
  );

  if (loading) return <p>{t('common:loading')}</p>;

  const isOwner = currentUserType === 'owner';
  const isRenter = currentUserType === 'renter';

  // 2) Обработчик изменения любого поля
  const handleInputChange = (fieldPath: string, value: FieldValue) => {
    setAgreement((prev) => {
      const updated: Agreement = { ...(prev ?? {}) };

      const keys = fieldPath.split('.');
      if (keys.length === 2) {
        const [parent, child] = keys;
        const nested = {
          ...(typeof updated[parent] === 'object'
            ? (updated[parent] as Record<string, unknown>)
            : {}),
        };
        nested[child] = value;
        updated[parent] = nested;
      } else {
        updated[fieldPath] = value;
      }

      return updated;
    });

    // Делаем автосохранение с правильными типами
    saveField(fieldPath as keyof Agreement, value);
  };

  // 3) Получение dataURL из подписи
  const getSignatureUrl = (type: 'owner' | 'renter'): string | null => {
    const sigRef = type === 'owner' ? ownerSignRef : renterSignRef;
    const sig = sigRef.current;
    if (!sig) return null;

    const rawCanvas = sig.getCanvas();
    const cropped = trimCanvas(rawCanvas);
    return cropped.toDataURL('image/png');
  };

  // 4) Сохранение подписи в Firestore
  const saveSignature = async (type: 'owner' | 'renter') => {
    const setUrl = type === 'owner' ? setOwnerSigUrl : setRenterSigUrl;
    const setOwnerSaving = type === 'owner' ? setIsSavingOwner : setIsSavingRenter;
    const setOwnerSaved = type === 'owner' ? setIsSavedOwner : setIsSavedRenter;

    const rawUrl = getSignatureUrl(type);
    if (!rawUrl) return;

    setOwnerSaving(true);
    setOwnerSaved(false);

    try {
      const docRef = doc(db, 'contracts', agreementId);
      await updateDoc(docRef, {
        [`signatures.${type}`]: rawUrl,
        lastUpdated: serverTimestamp(),
      });
      setUrl(rawUrl);
      setOwnerSaved(true);
    } catch (err: unknown) {
      console.error(t('AgreementForm:errorSavingSignature'), err);
    } finally {
      setOwnerSaving(false);
    }
  };

  // 5) Проверка состояний
  const bothSigned =
    !!agreement?.signatures?.owner && !!agreement?.signatures?.renter;
  const isFrozen = agreement?.isFrozen === true;

  function normalizeDateField(value: unknown): string | Date {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === 'string') {
    return value;
  }
  // Фолбэк — сегодняшняя дата
  return new Date();
}

function normalizeNumberField(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const n = Number(value.replace(',', '.'));
    if (!Number.isNaN(n)) return n;
  }
  return 0;
}

function normalizeStringField(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value;
  return fallback;
}


  // 6) Заморозка / разморозка договора
  const handleFreeze = async (): Promise<void> => {
  if (!bothSigned || !agreement) return;

  try {
    const contractRef = doc(db, 'contracts', agreementId);

    const locale = (i18n.language as 'ru' | 'uk' | 'en') || 'uk';

    // локальная переменная с расширенным типом (без any)
    const extended: ExtendedAgreement = agreement;

    // ✅ 1) Собираем данные для PDF безопасно
    const pdfData: AgreementPdfData = {
      agreementId,

      // Если у тебя есть номер договора в agreement — используем его
      agreementNumber:
        typeof extended.number === 'string' ? extended.number : undefined,

      owner: {
        fullName: normalizeStringField(extended.owner?.fullName, ''),
        phone: normalizeStringField(extended.owner?.phone, ''),
        email: normalizeStringField(extended.owner?.email, ''),
      },

      renter: {
        fullName: normalizeStringField(extended.renter?.fullName, ''),
        phone: normalizeStringField(extended.renter?.phone, ''),
        email: normalizeStringField(extended.renter?.email, ''),
      },

      // адрес может быть опциональным / unknown — нормализуем
      address: normalizeStringField(extended.address, ''),

      // даты могут быть Timestamp | string | Date
      rentalStart: normalizeDateField(extended.rentalStart ?? extended.createdAt),
      rentalEnd: normalizeDateField(extended.rentalEnd ?? extended.updatedAt),

      // сумма — number | string → number
      rentAmount: normalizeNumberField(extended.rentAmount),

      // валюта — если нет, ставим, например, UAH
      currency: normalizeStringField(extended.currency, 'UAH') as CurrencyCode,

      // доп. условия — опционально
      additionalTerms: normalizeStringField(extended.additionalTerms, '') || undefined,

      // подписи — берём из agreement.signatures (то, что у тебя уже работает)
      signatures: extended.signatures,

      city: normalizeStringField(extended.city, '') || undefined,
      generatedAt: new Date(),
      version: '1.0',
    };

    // ✅ 2) Генерируем PDF
    const pdfBytes = await createAgreementPdf(pdfData, tAgreementPdf, {
      locale,
      logoUrl: '/images/logo.png',
      fontUrl: '/fonts/OpenSans-Regular.ttf',
      pageMargin: 40,
    });

    // ✅ 3) Сохраняем PDF в Storage
    const storage = getStorage();
    const pdfRef = storageRef(storage, `agreements/${agreementId}.pdf`);

    await uploadBytes(pdfRef, pdfBytes, { contentType: 'application/pdf' });
    const pdfUrl = await getDownloadURL(pdfRef);

    // ✅ 4) Обновляем контракт в Firestore
    await updateDoc(contractRef, {
      isFrozen: true,
      status: 'signed' as const,
      pdfUrl,
      lastUpdated: serverTimestamp(),
    });

    // ✅ 5) Синхронизируем локальный стейт
    setAgreement((prev) =>
      prev
        ? {
            ...prev,
            isFrozen: true,
            status: 'signed',
            pdfUrl,
          }
        : prev
    );

    // eslint-disable-next-line no-console
    console.log(t('AgreementForm:pdfCreatedAndSaved'), pdfUrl);
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error(t('AgreementForm:errorFreezingAgreement'), err);
  }
};


  const handleUnfreeze = async () => {
    try {
      const docRef = doc(db, 'contracts', agreementId);
      await updateDoc(docRef, {
        isFrozen: false,
        lastUpdated: serverTimestamp(),
      });
      setAgreement((prev) => ({ ...(prev ?? {}), isFrozen: false }));
    } catch (err: unknown) {
      console.error(t('AgreementForm:errorUnfreezingAgreement'), err);
    }
  };

 // Если нужно дизейблить форму, задаём булевый флаг
 const formDisabled: boolean = isFrozen

  return (
  <div className="w-full py-12 md:py-16 lg:py-20 bg-background dark:bg-background-dark rounded-lg shadow-md">
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-0 space-y-6">
      <h2 className="text-3xl font-bold text-center text-foreground dark:text-foreground-dark">
        {t('AgreementForm:title')}
      </h2>
      <p className="text-sm text-center text-foreground/70 dark:text-foreground-dark/70">
        {t('AgreementForm:changesSavedAutomatically')}
      </p>

      {/* Текст договора с полями */}
<div className="space-y-6 text-foreground dark:text-foreground-dark">
  <p className="flex flex-wrap items-center gap-2">
    {t('AgreementForm:thisAgreementIsMadeBetween')}
    <Input
      className="inline w-full sm:w-60 px-3 py-2 mx-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
      value={agreement?.owner?.fullName ?? ''}
      onChange={e => handleInputChange('owner.fullName', e.target.value)}
      disabled={!isOwner || formDisabled}
      placeholder={t('AgreementForm:ownerFullName')}
    />
    ({t('AgreementForm:owner')})
    {'  '}
    {t('AgreementForm:and')}
    <Input
      className="inline w-full sm:w-60 px-3 py-2 mx-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
      value={agreement?.renter?.fullName ?? ''}
      onChange={e => handleInputChange('renter.fullName', e.target.value)}
      disabled={!isRenter || formDisabled}
      placeholder={t('AgreementForm:renterFullName')}
    />
    ({t('AgreementForm:renter')})
  </p>

  <p className="flex flex-wrap items-center gap-2">
    {t('AgreementForm:ownerProvidesRentalPropertyAt')}
    <Input
      className="inline w-full sm:w-80 px-3 py-2 mx-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
      value={typeof agreement?.address === 'string' ? agreement.address : ''}
      onChange={e => handleInputChange('address', e.target.value)}
      disabled={formDisabled}
      placeholder={t('AgreementForm:propertyAddress')}
    />
    {t('AgreementForm:forThePeriodFrom')}
    <Input
      type="date"
      className="inline w-full sm:w-40 px-3 py-2 mx-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
      value={typeof agreement?.rentalStart === 'string' ? agreement.rentalStart : ''}
      onChange={e => handleInputChange('rentalStart', e.target.value)}
      disabled={formDisabled}
    />
    {t('AgreementForm:to')}
    <Input
      type="date"
      className="inline w-full sm:w-40 px-3 py-2 mx-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
      value={typeof agreement?.rentalEnd === 'string' ? agreement.rentalEnd : ''}
      onChange={e => handleInputChange('rentalEnd', e.target.value)}
      disabled={formDisabled}
    />
  </p>

  <p className="flex flex-col sm:flex-row sm:items-center gap-2">
    {t('AgreementForm:monthlyRentAmountIs')}
    <Input
      type="number"
      className="inline w-full sm:w-32 px-3 py-2 mx-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
      value={agreement?.rentAmount?.toString() ?? ''}
      onChange={e =>
        handleInputChange('rentAmount', parseFloat(e.target.value))
      }
      disabled={formDisabled}
    />
  </p>


  <p className="flex flex-col sm:flex-row sm:items-center gap-2">
    {t('AgreementForm:currencyOfRentIs')}
    <Input
      type="text"
      className="inline w-full sm:w-32 px-3 py-2 mx-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
      value={agreement?.currency ?? ''}
      onChange={e =>
        handleInputChange('currency', e.target.value)
      }
      disabled={formDisabled}
      placeholder="UAH, USD, EUR..."
    />
  </p>
  
  

  <Textarea
    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
    value={typeof agreement?.additionalTerms === 'string' ? agreement.additionalTerms : ''}
    onChange={e => handleInputChange('additionalTerms', e.target.value)}
    placeholder={t('AgreementForm:additionalTermsPlaceholder')}
    disabled={formDisabled}
  />

  <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
    <div className="flex-1 flex flex-col">
      <Label className="text-foreground dark:text-foreground-dark">
        {t('AgreementForm:ownerContactDetails')}
      </Label>
      <Input
        className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
        value={agreement?.owner?.phone ?? ''}
        onChange={e => handleInputChange('owner.phone', e.target.value)}
        disabled={!isOwner || formDisabled}
        placeholder={t('AgreementForm:ownerPhonePlaceholder')}
      />
    </div>

    <div className="flex-1 flex flex-col">
      <Label className="text-foreground dark:text-foreground-dark">
        {t('AgreementForm:renterContactDetails')}
      </Label>
      <Input
        className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
        value={agreement?.renter?.phone ?? ''}
        onChange={e => handleInputChange('renter.phone', e.target.value)}
        disabled={!isRenter || formDisabled}
        placeholder={t('AgreementForm:renterPhonePlaceholder')}
      />
    </div>
  </div>
</div>

      {/* Подписи */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
  {/* Владелец */}
  <div className="flex flex-col">
    <Label className="text-foreground dark:text-foreground-dark">
      {t('AgreementForm:ownerSignature')}
    </Label>

    {/* Если не заморожено и это владелец — показываем пад, иначе статичное изображение */}
    {!isFrozen && isOwner ? (
      <>
        {ownerSigUrl ? (
          <img
            src={ownerSigUrl}
            alt= {t('AgreementForm:ownerSignature')}
            className="w-full h-32 border border-gray-300 dark:border-gray-700 rounded-lg object-contain"
          />
        ) : (
          <SignaturePad
            ref={ownerSignRef}
            penColor="black"
            canvasProps={{
              className:
                'border border-gray-300 dark:border-gray-700 w-full h-32 rounded-lg bg-background dark:bg-background-dark shadow-sm',
            }}
          />
        )}
        <div className="flex gap-2 mt-2">
          {!ownerSigUrl && (
            <Button
              type="button"
              className="text-orange-600 border border-orange-300 bg-orange-50 hover:bg-orange-100"
              onClick={() => ownerSignRef.current?.clear()}
            >
              {t('AgreementForm:clear')}
            </Button>
          )}
          <Button
            type="button"
            className={`border ${
              isSavingOwner
                ? 'text-gray-600 border-gray-300 bg-gray-50'
                : ownerSigUrl
                ? 'text-green-600 border-green-300 bg-green-50'
                : 'text-green-600 border-green-300 bg-green-50 hover:bg-green-100'
            }`}
            disabled={isSavingOwner || !!ownerSigUrl}
            onClick={() => saveSignature('owner')}
          >
            {isSavingOwner
              ? t('AgreementForm:saving')
              : ownerSigUrl
              ? t('AgreementForm:saved')
              : t('AgreementForm:save')}
          </Button>
        </div>
      </>
    ) : (
      /* Статичное изображение (и для арендодателя, и для пост-фри́з) */
      agreement?.signatures?.owner && (
        <img
          src={agreement.signatures.owner}
          alt={t('AgreementForm:ownerSignature')}
          className="w-full h-32 border border-gray-300 dark:border-gray-700 rounded-lg object-contain"
        />
      )
    )}
  </div>

  {/* Арендатор */}
  <div className="flex flex-col">
    <Label className="text-foreground dark:text-foreground-dark">
      {t('AgreementForm:renterSignature')}
    </Label>

    {!isFrozen && isRenter ? (
      <>
        {renterSigUrl ? (
          <img
            src={renterSigUrl}
            alt={t('AgreementForm:renterSignature')}
            className="w-full h-32 border border-gray-300 dark:border-gray-700 rounded-lg object-contain"
          />
        ) : (
          <SignaturePad
            ref={renterSignRef}
            penColor="black"
            canvasProps={{
              className:
                'border border-gray-300 dark:border-gray-700 w-full h-32 rounded-lg bg-background dark:bg-background-dark shadow-sm',
            }}
          />
        )}
        <div className="flex gap-2 mt-2">
          {!renterSigUrl && (
            <Button
              type="button"
              className="text-orange-600 border border-orange-300 bg-orange-50 hover:bg-orange-100"
              onClick={() => renterSignRef.current?.clear()}
            >
              {t('AgreementForm:clear')}
            </Button>
          )}
          <Button
            type="button"
            className={`border ${
              isSavingRenter
                ? 'text-gray-600 border-gray-300 bg-gray-50'
                : renterSigUrl
                ? 'text-green-600 border-green-300 bg-green-50'
                : 'text-green-600 border-green-300 bg-green-50 hover:bg-green-100'
            }`}
            disabled={isSavingRenter || !!renterSigUrl}
            onClick={() => saveSignature('renter')}
          >
            {isSavingRenter
              ? t('AgreementForm:saving')
              : renterSigUrl
              ? t('AgreementForm:saved')
              : t('AgreementForm:save')}
          </Button>
        </div>
      </>
    ) : (
      agreement?.signatures?.renter && (
        <img
          src={agreement.signatures.renter}
          alt={t('AgreementForm:renterSignature')}
          className="w-full h-32 border border-gray-300 dark:border-gray-700 rounded-lg object-contain"
        />
      )
    )}
  </div>
</div>

{/* Галочка подтверждения правил */}
<div className="flex items-center space-x-2 mt-6">
  <Checkbox
    id="agreement-confirm"
    checked={isChecked}
    onChange={(e) => setIsChecked(e.target.checked)}
    disabled={isFrozen}
  />
  <label
    htmlFor="agreement-confirm"
    className="text-sm text-foreground/70 dark:text-foreground-dark/70"
  >
    {t(
      'AgreementForm:confirmRulesAcknowledgment'
    )}
  </label>
</div>

      {!isFrozen ? (
  <Button
    type="button"
    onClick={handleFreeze}
    disabled={!bothSigned || !isChecked}
    className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white"
  >
    {t('AgreementForm:signAndSaveAgreement')}
  </Button>
) : (
  <div className="mt-6 flex flex-col items-center">
    {/* 1) «Договор сохранён» — full width */}
    <Button
      type="button"
      disabled
      className="w-full bg-green-500 hover:bg-green-600 text-white"
    >
      {t('AgreementForm:agreementSaved')}
    </Button>

    {/* 2) «Разморозить договор» — под первой, по центру */}
    <Button
      type="button"
      onClick={handleUnfreeze}
      disabled={!isOwner}
      className="mt-2 text-red-600 border border-red-300 bg-red-50 hover:bg-red-100"
    >
      {t('AgreementForm:unfreezeAgreement')}
    </Button>
  </div>
)}
<p className="mt-2 text-sm text-center text-foreground/70 dark:text-foreground-dark/70">
  {t('AgreementForm:buttonActivationInfo')}
</p>

      {isSaving && (
        <p className="text-base text-foreground/70 dark:text-foreground-dark/70 mt-2">
          {t('AgreementForm:savingChanges')}
        </p>
      )}
    </div>
  </div>
);
}


