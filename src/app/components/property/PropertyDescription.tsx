// PropertyDescriptionBlock.tsx
'use client';
import { useTranslation } from 'react-i18next';

export default function PropertyDescriptionBlock() {
  const { t } = useTranslation();

  const description = t(
    'property.description.text',
    'Светлая, уютная квартира с современной техникой. Идеально для пары или одного человека. Рядом метро и парк, в шаговой доступности магазины и кафе. В квартире есть всё для комфортного проживания: стиральная машина, кондиционер и быстрый интернет. Без комиссии, с официальным договором. Готовы к заселению!'
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">
        {t('property.description.title', 'Описание объекта')}
      </h2>
      <div className="border border-muted rounded-xl bg-card p-5 shadow-sm">
        <p className="text-base text-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}