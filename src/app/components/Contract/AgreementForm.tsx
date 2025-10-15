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
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';                // общий тип договора
import { GeneratePdfData } from '@/app/types/pdfTypes' // новый тип для PDF
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

// Интерфейс пользователя договора
interface AgreementUser {
  fullName?: string;
  email?: string;
  phone?: string;
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
  const { t } = useTranslation();

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
        console.error('Ошибка автосохранения:', err);
      } finally {
        setIsSaving(false);
      }
    },
    700
  );

  if (loading) return <p>Загрузка договора…</p>;

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
      console.error('Ошибка сохранения подписи:', err);
    } finally {
      setOwnerSaving(false);
    }
  };

  // 5) Проверка состояний
  const bothSigned =
    !!agreement?.signatures?.owner && !!agreement?.signatures?.renter;
  const isFrozen = agreement?.isFrozen === true;

  // 6) Заморозка / разморозка договора
  const handleFreeze = async () => {
    if (!bothSigned) return;
    try {
      const docRef = doc(db, 'contracts', agreementId);
      await updateDoc(docRef, {
        isFrozen: true,
        lastUpdated: serverTimestamp(),
      });
      setAgreement((prev) => ({ ...(prev ?? {}), isFrozen: true }));
      // generateAndSavePdf(agreement, agreementId); // используйте нужную функцию
      await generateAndSavePdf(
      {
        owner: agreement.owner,
        renter: agreement.renter,
        address: typeof agreement.address === 'string' ? agreement.address : undefined,
        rentalStart: typeof agreement.rentalStart === 'string' ? agreement.rentalStart : undefined,
        rentalEnd: typeof agreement.rentalEnd === 'string' ? agreement.rentalEnd : undefined,
        rentAmount: typeof agreement.rentAmount === 'string' || typeof agreement.rentAmount === 'number' ? agreement.rentAmount : undefined,
        additionalTerms: typeof agreement.additionalTerms === 'string' ? agreement.additionalTerms : undefined,
        signatures: agreement.signatures,
      },
      agreementId
    );
    } catch (err: unknown) {
      console.error('Ошибка заморозки договора:', err);
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
      console.error('Ошибка разморозки договора:', err);
    }
  };

 async function generateAndSavePdf(
  data: GeneratePdfData,
  agreementId: string
): Promise<string> {
  const storage = getStorage()

  try {
    // 1. Создаём PDF
    const pdfDoc = await PDFDocument.create()
    pdfDoc.registerFontkit(fontkit)
    const page = pdfDoc.addPage([595, 842])
    const { height } = page.getSize()
    let yPos = height - 50
    const lineHeight = 20

    // 2. Встраиваем шрифт
    const fontBytes = await fetch('/fonts/OpenSans-Regular.ttf')
      .then(res => res.arrayBuffer())
    const openSans = await pdfDoc.embedFont(fontBytes, { subset: true })

    // 3. Пишем заголовок
    page.drawText('Договор аренды', {
      x: 50,
      y: yPos,
      size: 20,
      font: openSans,
      color: rgb(0, 0, 0),
    })
    yPos -= lineHeight * 2

    // 4. Распаковываем данные
    const {
      owner,
      renter,
      address,
      rentalStart,
      rentalEnd,
      rentAmount,
      additionalTerms,
      signatures,
    } = data

    // 5. Рисуем текст полей
    page.drawText(`Владелец: ${owner?.fullName ?? ''}`, {
      x: 50,
      y: yPos,
      size: 12,
      font: openSans,
    })
    yPos -= lineHeight
    page.drawText(`Телефон владельца: ${owner?.phone ?? ''}`, {
      x: 50,
      y: yPos,
      size: 12,
      font: openSans,
    })
    yPos -= lineHeight

    page.drawText(`Арендатор: ${renter?.fullName ?? ''}`, {
      x: 50,
      y: yPos,
      size: 12,
      font: openSans,
    })
    yPos -= lineHeight
    page.drawText(`Телефон арендатора: ${renter?.phone ?? ''}`, {
      x: 50,
      y: yPos,
      size: 12,
      font: openSans,
    })
    yPos -= lineHeight

    page.drawText(`Адрес объекта: ${address ?? ''}`, {
      x: 50,
      y: yPos,
      size: 12,
      font: openSans,
    })
    yPos -= lineHeight
    page.drawText(`Срок аренды: ${rentalStart ?? ''} – ${rentalEnd ?? ''}`, {
      x: 50,
      y: yPos,
      size: 12,
      font: openSans,
    })
    yPos -= lineHeight
    page.drawText(`Арендная плата: ${rentAmount ?? ''} грн.`, {
      x: 50,
      y: yPos,
      size: 12,
      font: openSans,
    })
    yPos -= lineHeight
    page.drawText(`Дополнительные условия: ${additionalTerms ?? ''}`, {
      x: 50,
      y: yPos,
      size: 12,
      font: openSans,
    })
    yPos -= lineHeight * 2

    page.drawText('Подписи:', {
      x: 50,
      y: yPos,
      size: 14,
      font: openSans,
    })
    yPos -= lineHeight

    // 6. Встраиваем подписи, если они есть
    if (signatures?.owner) {
      page.drawText('Владелец:', { x: 50, y: yPos, size: 12, font: openSans })
      yPos -= lineHeight
      const ownerImg = await pdfDoc.embedPng(signatures.owner)
      page.drawImage(ownerImg, {
        x: 50,
        y: yPos - 50,
        width: 150,
        height: 50,
      })
      yPos -= 60
    }

    if (signatures?.renter) {
      page.drawText('Арендатор:', { x: 50, y: yPos, size: 12, font: openSans })
      yPos -= lineHeight
      const renterImg = await pdfDoc.embedPng(signatures.renter)
      page.drawImage(renterImg, {
        x: 50,
        y: yPos - 50,
        width: 150,
        height: 50,
      })
      yPos -= 60
    }

    // 7. Сохраняем в Storage
    const pdfBytes = await pdfDoc.save()
    const pdfReference = storageRef(storage, `agreements/${agreementId}.pdf`)
    await uploadBytes(pdfReference, pdfBytes, {
      contentType: 'application/pdf',
    })
    const pdfUrl = await getDownloadURL(pdfReference)

    // 8. Обновляем Firestore и переводим статус в signed
    await updateDoc(doc(db, 'contracts', agreementId), {
      status: 'signed' as const,
      pdfUrl,
      lastUpdated: serverTimestamp(),
    })

    console.log('PDF успешно создан и сохранён:', pdfUrl)
    return pdfUrl
  } catch (error: unknown) {
    console.error('Ошибка генерации PDF:', error)
    throw error
  }
}

 // Если нужно дизейблить форму, задаём булевый флаг
 const formDisabled: boolean = isFrozen

  return (
  <div className="w-full py-12 md:py-16 lg:py-20 bg-background dark:bg-background-dark rounded-lg shadow-md">
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-0 space-y-6">
      <h2 className="text-3xl font-bold text-center text-foreground dark:text-foreground-dark">
        Договор аренды
      </h2>
      <p className="text-sm text-center text-foreground/70 dark:text-foreground-dark/70">
        Изменения сохраняются автоматически.
      </p>

      {/* Текст договора с полями */}
<div className="space-y-6 text-foreground dark:text-foreground-dark">
  <p className="flex flex-wrap items-center gap-2">
    Этот договор заключён между
    <Input
      className="inline w-full sm:w-60 px-3 py-2 mx-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
      value={agreement?.owner?.fullName ?? ''}
      onChange={e => handleInputChange('owner.fullName', e.target.value)}
      disabled={!isOwner || formDisabled}
      placeholder="ФИО владельца"
    />
    (в дальнейшем &quot;Владелец&quot;)
    и
    <Input
      className="inline w-full sm:w-60 px-3 py-2 mx-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
      value={agreement?.renter?.fullName ?? ''}
      onChange={e => handleInputChange('renter.fullName', e.target.value)}
      disabled={!isRenter || formDisabled}
      placeholder="ФИО арендатора"
    />
    (в дальнейшем &quot;Арендатор&quot;).
  </p>

  <p className="flex flex-wrap items-center gap-2">
    Владелец предоставляет Арендатору в аренду недвижимое имущество по адресу
    <Input
      className="inline w-full sm:w-80 px-3 py-2 mx-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
      value={typeof agreement?.address === 'string' ? agreement.address : ''}
      onChange={e => handleInputChange('address', e.target.value)}
      disabled={formDisabled}
      placeholder="Адрес объекта"
    />
    на срок с
    <Input
      type="date"
      className="inline w-full sm:w-40 px-3 py-2 mx-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
      value={typeof agreement?.rentalStart === 'string' ? agreement.rentalStart : ''}
      onChange={e => handleInputChange('rentalStart', e.target.value)}
      disabled={formDisabled}
    />
    по
    <Input
      type="date"
      className="inline w-full sm:w-40 px-3 py-2 mx-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
      value={typeof agreement?.rentalEnd === 'string' ? agreement.rentalEnd : ''}
      onChange={e => handleInputChange('rentalEnd', e.target.value)}
      disabled={formDisabled}
    />
  </p>

  <p className="flex flex-col sm:flex-row sm:items-center gap-2">
    Месячная арендная плата составляет
    <Input
      type="number"
      className="inline w-full sm:w-32 px-3 py-2 mx-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
      value={agreement?.rentAmount?.toString() ?? ''}
      onChange={e =>
        handleInputChange('rentAmount', parseFloat(e.target.value))
      }
      disabled={formDisabled}
    />
    грн.
  </p>

  <Textarea
    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
    value={typeof agreement?.additionalTerms === 'string' ? agreement.additionalTerms : ''}
    onChange={e => handleInputChange('additionalTerms', e.target.value)}
    placeholder="Дополнительные условия: правила проживания, курение, животные..."
    disabled={formDisabled}
  />

  <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
    <div className="flex-1 flex flex-col">
      <Label className="text-foreground dark:text-foreground-dark">
        Контактные данные владельца
      </Label>
      <Input
        className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
        value={agreement?.owner?.phone ?? ''}
        onChange={e => handleInputChange('owner.phone', e.target.value)}
        disabled={!isOwner || formDisabled}
        placeholder="Телефон владельца"
      />
    </div>

    <div className="flex-1 flex flex-col">
      <Label className="text-foreground dark:text-foreground-dark">
        Контактные данные арендатора
      </Label>
      <Input
        className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
        value={agreement?.renter?.phone ?? ''}
        onChange={e => handleInputChange('renter.phone', e.target.value)}
        disabled={!isRenter || formDisabled}
        placeholder="Телефон арендатора"
      />
    </div>
  </div>
</div>

      {/* Подписи */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
  {/* Владелец */}
  <div className="flex flex-col">
    <Label className="text-foreground dark:text-foreground-dark">
      Подпись владельца
    </Label>

    {/* Если не заморожено и это владелец — показываем пад, иначе статичное изображение */}
    {!isFrozen && isOwner ? (
      <>
        {ownerSigUrl ? (
          <img
            src={ownerSigUrl}
            alt="Подпись владельца"
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
              Очистить
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
              ? 'Сохраняем…'
              : ownerSigUrl
              ? 'Сохранено'
              : 'Сохранить'}
          </Button>
        </div>
      </>
    ) : (
      /* Статичное изображение (и для арендодателя, и для пост-фри́з) */
      agreement?.signatures?.owner && (
        <img
          src={agreement.signatures.owner}
          alt="Подпись владельца"
          className="w-full h-32 border border-gray-300 dark:border-gray-700 rounded-lg object-contain"
        />
      )
    )}
  </div>

  {/* Арендатор */}
  <div className="flex flex-col">
    <Label className="text-foreground dark:text-foreground-dark">
      Подпись арендатора
    </Label>

    {!isFrozen && isRenter ? (
      <>
        {renterSigUrl ? (
          <img
            src={renterSigUrl}
            alt="Подпись арендатора"
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
              Очистить
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
              ? 'Сохраняем…'
              : renterSigUrl
              ? 'Сохранено'
              : 'Сохранить'}
          </Button>
        </div>
      </>
    ) : (
      agreement?.signatures?.renter && (
        <img
          src={agreement.signatures.renter}
          alt="Подпись арендатора"
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
      'agreement.confirmRules',
      'Я подтверждаю, что ознакомлен с правилами платформы Rentera и согласен с ними'
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
    Подписать и сохранить договор
  </Button>
) : (
  <div className="mt-6 flex flex-col items-center">
    {/* 1) «Договор сохранён» — full width */}
    <Button
      type="button"
      disabled
      className="w-full bg-green-500 hover:bg-green-600 text-white"
    >
      Договор сохранён
    </Button>

    {/* 2) «Разморозить договор» — под первой, по центру */}
    <Button
      type="button"
      onClick={handleUnfreeze}
      disabled={!isOwner}
      className="mt-2 text-red-600 border border-red-300 bg-red-50 hover:bg-red-100"
    >
      Разморозить договор
    </Button>
  </div>
)}
<p className="mt-2 text-sm text-center text-foreground/70 dark:text-foreground-dark/70">
  Кнопка станет активной, после сохранения обеих подписей и подтверждения правил.
</p>

      {isSaving && (
        <p className="text-base text-foreground/70 dark:text-foreground-dark/70 mt-2">
          Сохраняем изменения...
        </p>
      )}
    </div>
  </div>
);
}


