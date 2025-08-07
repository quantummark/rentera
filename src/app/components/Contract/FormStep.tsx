import { Formik, Field, Form } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

interface FormValues {
  renterName: string;
  renterPhone: string;
  renterEmail: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  rentalAmount: string;
  startDate: string;
  endDate: string;
  insuranceAmount: string;
}

const QuickContractForm: React.FC = () => {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);

  // Валидация формы
  const validationSchema = Yup.object({
    renterName: Yup.string().required(t('renterNameRequired', 'Имя арендатора обязательно')),
    renterPhone: Yup.string().required(t('renterPhoneRequired', 'Телефон арендатора обязателен')),
    renterEmail: Yup.string().email(t('invalidEmail', 'Неверный email')).required(t('renterEmailRequired', 'Email арендатора обязателен')),
    ownerName: Yup.string().required(t('ownerNameRequired', 'Имя владельца обязательно')),
    ownerPhone: Yup.string().required(t('ownerPhoneRequired', 'Телефон владельца обязателен')),
    ownerEmail: Yup.string().email(t('invalidEmail', 'Неверный email')).required(t('ownerEmailRequired', 'Email владельца обязателен')),
    rentalAmount: Yup.number().required(t('rentalAmountRequired', 'Сумма аренды обязательна')),
    startDate: Yup.date().required(t('startDateRequired', 'Дата начала аренды обязательна')),
    endDate: Yup.date().required(t('endDateRequired', 'Дата окончания аренды обязательна')),
    insuranceAmount: Yup.number().required(t('insuranceAmountRequired', 'Размер страховки обязателен')),
  });

  return (
    <div className={darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}>
      <div className="p-4">
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 mb-4 text-sm">
          {darkMode ? t('lightTheme', 'Светлая тема') : t('darkTheme', 'Тёмная тема')}
        </button>

        <Formik
          initialValues={{
            renterName: '',
            renterPhone: '',
            renterEmail: '',
            ownerName: '',
            ownerPhone: '',
            ownerEmail: '',
            rentalAmount: '',
            startDate: '',
            endDate: '',
            insuranceAmount: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values: FormValues) => {
            console.log('Данные договора:', values);
            // Здесь можно отправить данные на сервер или создать PDF
          }}
        >
          {({ isValid, touched }) => (
            <Form>
              <h2 className="text-lg sm:text-xl">{t('contractTitle', 'ДОГОВОР АРЕНДЫ НЕДВИЖИМОСТИ')}</h2>

              <div className="mb-4">
                <h3 className="text-md sm:text-lg">{t('partyTitle', '1. Стороны договора')}</h3>
                <div>
                  <label htmlFor="renterName" className="block">{t('renterNameLabel', 'Арендатор - ФИО:')}</label>
                  <Field name="renterName" id="renterName" placeholder={t('enterRenterName', 'Введите имя арендатора')} className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label htmlFor="renterPhone" className="block">{t('renterPhoneLabel', 'Телефон арендатора:')}</label>
                  <Field name="renterPhone" id="renterPhone" placeholder={t('enterRenterPhone', 'Введите телефон арендатора')} className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label htmlFor="renterEmail" className="block">{t('renterEmailLabel', 'Email арендатора:')}</label>
                  <Field name="renterEmail" id="renterEmail" placeholder={t('enterRenterEmail', 'Введите email арендатора')} className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-md sm:text-lg">{t('ownerTitle', '2. Данные владельца')}</h3>
                <div>
                  <label htmlFor="ownerName" className="block">{t('ownerNameLabel', 'Владелец - ФИО:')}</label>
                  <Field name="ownerName" id="ownerName" placeholder={t('enterOwnerName', 'Введите имя владельца')} className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label htmlFor="ownerPhone" className="block">{t('ownerPhoneLabel', 'Телефон владельца:')}</label>
                  <Field name="ownerPhone" id="ownerPhone" placeholder={t('enterOwnerPhone', 'Введите телефон владельца')} className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label htmlFor="ownerEmail" className="block">{t('ownerEmailLabel', 'Email владельца:')}</label>
                  <Field name="ownerEmail" id="ownerEmail" placeholder={t('enterOwnerEmail', 'Введите email владельца')} className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-md sm:text-lg">{t('rentalInfo', '3. Описание арендуемой недвижимости')}</h3>
                <div>
                  <label htmlFor="rentalAmount" className="block">{t('rentalAmountLabel', 'Сумма аренды:')}</label>
                  <Field name="rentalAmount" id="rentalAmount" placeholder={t('enterRentalAmount', 'Введите сумму аренды')} className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label htmlFor="startDate" className="block">{t('startDateLabel', 'Дата начала аренды:')}</label>
                  <Field type="date" name="startDate" id="startDate" className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label htmlFor="endDate" className="block">{t('endDateLabel', 'Дата окончания аренды:')}</label>
                  <Field type="date" name="endDate" id="endDate" className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-md sm:text-lg">{t('insuranceInfo', '4. Страховка')}</h3>
                <div>
                  <label htmlFor="insuranceAmount" className="block">{t('insuranceAmountLabel', 'Размер страховки (если применяется):')}</label>
                  <Field name="insuranceAmount" id="insuranceAmount" placeholder={t('enterInsuranceAmount', 'Введите размер страховки')} className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
              </div>

              <div className="mb-4">
                <button type="submit" disabled={!isValid} className="w-full p-3 bg-blue-500 text-white rounded-md sm:w-auto">
                  {t('signContract', 'Подписать договор')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default QuickContractForm;
