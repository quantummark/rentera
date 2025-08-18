'use client';

import { useRef } from 'react';
import { useUserTypeWithProfile } from '@/hooks/useUserType';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import * as Yup from 'yup';

interface AgreementFormValues {
  rentalStart: string;
  rentalEnd: string;
  monthlyPrice: number;
  additionalTerms: string;
}

interface AgreementFormProps {
  onSubmit: (values: AgreementFormValues, signatures: { owner?: string; renter?: string }) => void;
  agreementId: string;
  userType: 'owner' | 'renter';
}

export default function AgreementForm({ onSubmit }: AgreementFormProps) {
  const [userType] = useUserTypeWithProfile(); // owner | renter
  const ownerSignRef = useRef<SignatureCanvas>(null);
  const renterSignRef = useRef<SignatureCanvas>(null);

  const initialValues: AgreementFormValues = {
    rentalStart: '',
    rentalEnd: '',
    monthlyPrice: 0,
    additionalTerms: '',
  };

  const validationSchema = Yup.object({
    rentalStart: Yup.string().required('Укажите дату начала аренды'),
    rentalEnd: Yup.string().required('Укажите дату окончания аренды'),
    monthlyPrice: Yup.number().required('Укажите цену аренды').min(0, 'Цена должна быть положительной'),
  });

  const clearSignature = (type: 'owner' | 'renter') => {
    if (type === 'owner') ownerSignRef.current?.clear();
    if (type === 'renter') renterSignRef.current?.clear();
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const signatures: { owner?: string; renter?: string } = {};
          if (ownerSignRef.current) signatures.owner = ownerSignRef.current.getTrimmedCanvas().toDataURL('image/png');
          if (renterSignRef.current) signatures.renter = renterSignRef.current.getTrimmedCanvas().toDataURL('image/png');
          onSubmit(values, signatures);
        }}
      >
        { (
          <Form className="space-y-4">
            {/* Даты аренды */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Дата начала аренды</Label>
                <Field type="date" name="rentalStart" className="input w-full" />
                <ErrorMessage name="rentalStart" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <Label>Дата окончания аренды</Label>
                <Field type="date" name="rentalEnd" className="input w-full" />
                <ErrorMessage name="rentalEnd" component="div" className="text-red-500 text-sm" />
              </div>
            </div>

            {/* Цена аренды */}
            <div>
              <Label>Цена аренды / месяц</Label>
              <Field type="number" name="monthlyPrice" className="input w-full" />
              <ErrorMessage name="monthlyPrice" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Дополнительные условия */}
            <div>
              <Label>Дополнительные условия</Label>
              <Field
                as="textarea"
                name="additionalTerms"
                className="input w-full h-24 resize-none"
                placeholder="Например: правила проживания, запрет на курение и т.д."
              />
            </div>

            {/* Подписи */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userType === 'owner' && (
                <div>
                  <Label>Подпись владельца</Label>
                  <SignatureCanvas
                    ref={ownerSignRef}
                    penColor="black"
                    canvasProps={{ className: 'border border-gray-300 w-full h-32 rounded-lg' }}
                  />
                  <Button type="button" onClick={() => clearSignature('owner')} className="mt-2">
                    Очистить подпись
                  </Button>
                </div>
              )}

              {userType === 'renter' && (
                <div>
                  <Label>Подпись арендатора</Label>
                  <SignatureCanvas
                    ref={renterSignRef}
                    penColor="black"
                    canvasProps={{ className: 'border border-gray-300 w-full h-32 rounded-lg' }}
                  />
                  <Button type="button" onClick={() => clearSignature('renter')} className="mt-2">
                    Очистить подпись
                  </Button>
                </div>
              )}
            </div>

            {/* Кнопка отправки */}
            <Button type="submit" className="w-full mt-4">
              Сохранить данные и подпись
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
