// PropertyRentalTermsBlock.tsx
'use client';
import { Home, ShieldCheck, BadgeDollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PropertyRentalTermsBlockProps {
  housingType: string;
  insuranceIncluded: boolean;
  insuranceAmount: number;
  deposit: number;
  rentPrice: number;
}

export default function PropertyRentalTermsBlock({
  housingType,
  insuranceIncluded,
  insuranceAmount,
  deposit,
  rentPrice,
}: PropertyRentalTermsBlockProps) {
  const { t } = useTranslation();

  const terms = [
    {
      icon: <Home className="w-5 h-5 text-orange-500" />,
      label: t('property.housingType', 'Тип жилья'),
      value: housingType,
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-orange-500" />,
      label: t('property.insuranceIncluded', 'Страхование включено'),
      value: insuranceIncluded ? t('yes', 'Да') : t('no', 'Нет'),
    },
    {
      icon: <BadgeDollarSign className="w-5 h-5 text-orange-500" />,
      label: t('property.insuranceAmount', 'Сумма страхования'),
      value: insuranceIncluded ? `₴${insuranceAmount}` : '-',
    },
    {
      icon: <BadgeDollarSign className="w-5 h-5 text-orange-500" />,
      label: t('property.deposit', 'Залог'),
      value: deposit ? t('yes', 'Да') : t('no', 'Нет'),
    },
    {
      icon: <BadgeDollarSign className="w-5 h-5 text-orange-500" />,
      label: t('property.rentPrice', 'Аренда в месяц'),
      value: `₴${rentPrice.toLocaleString()}`,
    },
  ];

  return (
    <section className="py-10">
      <h2 className="text-xl font-semibold mb-4">
        {t('property.rentalTerms', 'Условия проживания')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {terms.map(({ icon, label, value }) => (
          <div
            key={label.toString()}
            className="flex items-start gap-3 p-4 rounded-xl border border-muted bg-card shadow-sm"
          >
            <div className="mt-1">{icon}</div>
            <div className="space-y-0.5">
              <p className="text-sm text-muted-foreground leading-none">{label}</p>
              <p className="text-base font-semibold text-foreground">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
