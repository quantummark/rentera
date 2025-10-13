'use client';

import { useEffect, useRef, useState } from 'react';
import { useUserTypeWithProfile } from '@/hooks/useUserType';

import { db } from '@/app/firebase/firebase';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import debounce from 'lodash/debounce';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from 'react-i18next';
import SignaturePad, { type SignatureCanvas } from 'react-signature-canvas';
import { trimCanvas } from '@/app/utils/trimCanvas';

interface AgreementFormProps {
  agreementId: string;
}

export default function AgreementTextForm({ agreementId }: AgreementFormProps) {
  const [userType] = useUserTypeWithProfile(); // 'owner' | 'renter'
  const [agreement, setAgreement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const storage = getStorage();
  const [isChecked, setIsChecked] = useState(false);
  const { t } = useTranslation();
  const ownerSignRef = useRef<SignatureCanvas>(null);
  const renterSignRef = useRef<SignatureCanvas>(null);
  const [isSavingOwner, setIsSavingOwner] = useState(false);
const [isSavedOwner, setIsSavedOwner] = useState(false);
const [isSavingRenter, setIsSavingRenter] = useState(false);
const [isSavedRenter, setIsSavedRenter] = useState(false);
const [ownerSigUrl, setOwnerSigUrl] = useState<string | null>(
  agreement?.signatures?.owner || null
);
const [renterSigUrl, setRenterSigUrl] = useState<string | null>(
  agreement?.signatures?.renter || null
);

  useEffect(() => {
    const docRef = doc(db, 'contracts', agreementId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setAgreement(docSnap.data());
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [agreementId]);

  const saveField = debounce(async (field: string, value: any) => {
    if (!agreement) return;
    setIsSaving(true);
    try {
      const docRef = doc(db, 'contracts', agreementId);
      await updateDoc(docRef, { [field]: value, lastUpdated: serverTimestamp() });
    } catch (err) {
      console.error('Ошибка автосохранения:', err);
    } finally {
      setIsSaving(false);
    }
  }, 700);

  if (loading) return <p>Загрузка договора...</p>;

  const isOwner = userType === 'owner';
  const isRenter = userType === 'renter';

  const handleInputChange = (fieldPath: string, value: any) => {
  setAgreement((prev: any) => {
    const updated = { ...prev };
    const keys = fieldPath.split('.');

    if (keys.length === 2) {
      // Если объект по ключу ещё не существует, создаём пустой объект
      if (!updated[keys[0]]) updated[keys[0]] = {};
      updated[keys[0]][keys[1]] = value;
    } else {
      updated[fieldPath] = value;
    }

    return updated;
  });

  saveField(fieldPath, value);
};

  const getSignatureUrl = (type: 'owner' | 'renter') => {
  const sig = (type === 'owner' ? ownerSignRef : renterSignRef).current;
  if (!sig) return null;

  // берём полный canvas, обрезаем руками и превращаем в dataURL
  const rawCanvas = sig.getCanvas();
  const cropped = trimCanvas(rawCanvas);
  return cropped.toDataURL('image/png');
};

  const saveSignature = async (type: 'owner' | 'renter') => {
  const sigRef = type === 'owner' ? ownerSignRef : renterSignRef;
  const setUrl = type === 'owner' ? setOwnerSigUrl : setRenterSigUrl;
  const setIsSaving = type === 'owner' ? setIsSavingOwner : setIsSavingRenter;
  const setIsSaved = type === 'owner' ? setIsSavedOwner : setIsSavedRenter;

  const rawUrl = getSignatureUrl(type);
  if (!rawUrl) return;

  setIsSaving(true);
  setIsSaved(false);
  try {
    // 1. загрузка в Storage (если нужно) и получение финального URL
    // const finalUrl = await uploadSignatureToStorage(type, rawUrl);
    // 2. или сразу сохраняем base64 в Firestore
    const docRef = doc(db, 'contracts', agreementId);
    await updateDoc(docRef, {
      [`signatures.${type}`]: rawUrl,
      lastUpdated: serverTimestamp(),
    });
    // 3. обновляем локальный стейт, чтобы картинка отобразилась мгновенно
    setUrl(rawUrl);
    setIsSaved(true);
  } catch (err) {
    console.error('Ошибка сохранения подписи:', err);
  } finally {
    setIsSaving(false);
  }
};

     // Проверка, что оба участника подписали
    const bothSigned = agreement?.signatures?.owner && agreement?.signatures?.renter;

      // Проверка, можно ли заморозить поля
     const isFrozen = agreement?.isFrozen;

     // Функция заморозки договора
const handleFreeze = async () => {
  if (!bothSigned) return;
  try {
    const docRef = doc(db, 'contracts', agreementId);
    await updateDoc(docRef, { isFrozen: true, lastUpdated: serverTimestamp() });
    setAgreement((prev: any) => ({ ...prev, isFrozen: true }));
    await generateAndSavePdf(agreement, agreementId);
  } catch (err) {
    console.error('Ошибка заморозки договора:', err);
  }
};

// Только владелец может разморозить
const handleUnfreeze = async () => {
  try {
    const docRef = doc(db, 'contracts', agreementId);
    await updateDoc(docRef, {
      isFrozen: false,
      lastUpdated: serverTimestamp(),
    });
    setAgreement((prev: any) => ({ ...prev, isFrozen: false }));
  } catch (err) {
    console.error('Ошибка разморозки договора:', err);
  }
};

async function generateAndSavePdf(agreement: any, agreementId: string) {
  try {
    // 1. Создаём PDF
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const page = pdfDoc.addPage([595, 842]);
    const { height } = page.getSize();
    let y = height - 50;
    const lineHeight = 20;

    // 2. Загружаем и встраиваем Open Sans
    const fontUrl = '/fonts/OpenSans-Regular.ttf';
    const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
    const openSans = await pdfDoc.embedFont(fontBytes, { subset: true });

    // 3. Рисуем текст с кириллицей
    page.drawText('Договор аренды', {
      x: 50,
      y,
      size: 20,
      font: openSans,
      color: rgb(0, 0, 0),
    });
    y -= lineHeight * 2;

    page.drawText(`Владелец: ${agreement.owner?.fullName || ''}`, {
      x: 50,
      y,
      size: 12,
      font: openSans,
    });
    y -= lineHeight;
    page.drawText(`Телефон владельца: ${agreement.owner?.phone || ''}`, {
      x: 50,
      y,
      size: 12,
      font: openSans,
    });
    y -= lineHeight;

    page.drawText(`Арендатор: ${agreement.renter?.fullName || ''}`, {
      x: 50,
      y,
      size: 12,
      font: openSans,
    });
    y -= lineHeight;
    page.drawText(`Телефон арендатора: ${agreement.renter?.phone || ''}`, {
      x: 50,
      y,
      size: 12,
      font: openSans,
    });
    y -= lineHeight;

    page.drawText(`Адрес объекта: ${agreement.address || ''}`, {
      x: 50,
      y,
      size: 12,
      font: openSans,
    });
    y -= lineHeight;
    page.drawText(
      `Срок аренды: ${agreement.rentalStart || ''} – ${agreement.rentalEnd || ''}`,
      { x: 50, y, size: 12, font: openSans }
    );
    y -= lineHeight;
    page.drawText(
      `Арендная плата: ${agreement.rentAmount || ''} грн.`,
      { x: 50, y, size: 12, font: openSans }
    );
    y -= lineHeight;
    page.drawText(`Дополнительные условия: ${agreement.additionalTerms || ''}`, {
      x: 50,
      y,
      size: 12,
      font: openSans,
    });
    y -= lineHeight * 2;

    page.drawText('Подписи:', { x: 50, y, size: 14, font: openSans });
    y -= lineHeight;

    // 4. Встраиваем подписи, если есть
    if (agreement.signatures?.owner) {
      page.drawText('Владелец:', { x: 50, y, size: 12, font: openSans });
      y -= lineHeight;
      const ownerImg = await pdfDoc.embedPng(agreement.signatures.owner);
      page.drawImage(ownerImg, { x: 50, y: y - 50, width: 150, height: 50 });
      y -= 60;
    }

    if (agreement.signatures?.renter) {
      page.drawText('Арендатор:', { x: 50, y, size: 12, font: openSans });
      y -= lineHeight;
      const renterImg = await pdfDoc.embedPng(agreement.signatures.renter);
      page.drawImage(renterImg, { x: 50, y: y - 50, width: 150, height: 50 });
      y -= 60;
    }

    // 5. Сохраняем PDF и заливаем в Storage
    const pdfBytes = await pdfDoc.save();
    const pdfRef = ref(storage, `agreements/${agreementId}.pdf`);
    await uploadBytes(pdfRef, pdfBytes, { contentType: 'application/pdf' });
    const pdfUrl = await getDownloadURL(pdfRef);

    // 6. Обновляем Firestore
    await updateDoc(doc(db, 'contracts', agreementId), {
      status: 'signed',
      pdfUrl,
      lastUpdated: serverTimestamp(),
    });

    console.log('PDF успешно создан и сохранён:', pdfUrl);
    return pdfUrl;
  } catch (err) {
    console.error('Ошибка генерации PDF:', err);
  }
}

const formDisabled = isFrozen;

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
      value={agreement?.owner?.fullName || ''}
      onChange={(e) => handleInputChange('owner.fullName', e.target.value)}
      disabled={!isOwner || formDisabled}
      placeholder="ФИО владельца"
    />
    (в дальнейшем "Владелец") и
    <Input
      className="inline w-full sm:w-60 px-3 py-2 mx-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
      value={agreement?.renter?.fullName || ''}
      onChange={(e) => handleInputChange('renter.fullName', e.target.value)}
      disabled={!isRenter || formDisabled}
      placeholder="ФИО арендатора"
    />
    (в дальнейшем "Арендатор").
  </p>

  <p className="flex flex-wrap items-center gap-2">
    Владелец предоставляет Арендатору в аренду недвижимое имущество по адресу
    <Input
      className="inline w-full sm:w-80 px-3 py-2 mx-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
      value={agreement.address || ''}
      onChange={(e) => handleInputChange('address', e.target.value)}
      disabled={formDisabled}
      placeholder="Адрес объекта"
    />
    на срок с
    <Input
      type="date"
      className="inline w-full sm:w-40 px-3 py-2 mx-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
      value={agreement.rentalStart || ''}
      onChange={(e) => handleInputChange('rentalStart', e.target.value)}
      disabled={formDisabled}
    />
    по
    <Input
      type="date"
      className="inline w-full sm:w-40 px-3 py-2 mx-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
      value={agreement.rentalEnd || ''}
      onChange={(e) => handleInputChange('rentalEnd', e.target.value)}
      disabled={formDisabled}
    />
  </p>

  <p className="flex flex-col sm:flex-row sm:items-center gap-2">
    Месячная арендная плата составляет
    <Input
      type="number"
      className="inline w-full sm:w-32 px-3 py-2 mx-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
      value={agreement.rentAmount || ''}
      onChange={(e) => handleInputChange('rentAmount', parseFloat(e.target.value))}
      disabled={formDisabled}
    />
    грн.
  </p>

  <Textarea
    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
    value={agreement.additionalTerms || ''}
    onChange={(e) => handleInputChange('additionalTerms', e.target.value)}
    placeholder="Дополнительные условия: правила проживания, курение, животные..."
    disabled={formDisabled}
  />

  <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
    <div className="flex-1 flex flex-col">
      <Label className="text-foreground dark:text-foreground-dark">
        Контактные данные Владелеца
      </Label>
      <Input
        className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
        value={agreement?.owner?.phone || ''}
        onChange={(e) => handleInputChange('owner.phone', e.target.value)}
        disabled={!isOwner || formDisabled}
        placeholder="Телефон владельца"
      />
    </div>

    <div className="flex-1 flex flex-col">
      <Label className="text-foreground dark:text-foreground-dark">
        Контактные данные Арендатора
      </Label>
      <Input
        className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
        value={agreement?.renter?.phone || ''}
        onChange={(e) => handleInputChange('renter.phone', e.target.value)}
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


