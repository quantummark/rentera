'use client';

import { useTranslation } from 'react-i18next';
import { UserRoundPen, Globe, Store } from 'lucide-react';

export default function Motivation() {
  const { t } = useTranslation();

  const beliefs = [
    {
      icon: UserRoundPen,
      label: t('motivation.belief1', 'Профили владельцев и арендаторов'),
      description: t(
        'motivation.belief1Desc',
        'Личные страницы с рейтингами, отзывами и верификацией создают прозрачность и доверие.'
      ),
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      color: 'text-blue-600 dark:text-blue-300',
    },
    {
      icon: Globe,
      label: t('motivation.belief2', 'Социальная сеть аренды'),
      description: t(
        'motivation.belief2Desc',
        'Пользователи могут общаться, делиться опытом, писать посты и находить единомышленников.'
      ),
      bg: 'bg-green-100 dark:bg-green-900/20',
      color: 'text-green-600 dark:text-green-300',
    },
    {
      icon: Store,
      label: t('motivation.belief3', 'Маркетплейс “Услуги для жилья”'),
      description: t(
        'motivation.belief3Desc',
        'Сборка мебели, клининг, сантехники, доставка и т.д. — всё для удобства арендаторов и владельцев.'
      ),
      bg: 'bg-orange-100 dark:bg-orange-900/20',
      color: 'text-orange-600 dark:text-orange-300',
    },
  ];

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-background dark:bg-background-dark">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl text-center font-semibold mb-10 text-foreground dark:text-foreground-dark">
          {t('motivation.title', 'Строим экосистему аренды')}
        </h2>
        <p className="text-lg md:text-2xl text-muted-foreground dark:text-muted-foreground text-center mb-12">
          {t(
            'motivation.subtitle',
            'В Rentera вы можете не только найти и сдать жильё, но и получить доступ к проверенным профилям, общению с другими пользователями и даже заказать необходимые услуги для жилья. Всё, что вам нужно для комфортной аренды — на одной платформе.'
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {beliefs.map(({ icon: Icon, label, description, bg, color }, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 bg-card border border-muted rounded-2xl p-6 shadow-sm transition-all"
            >
              <div className={`p-2 rounded-xl ${bg}`}>
                <Icon className={`w-8 h-8 ${color}`} />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{label}</h3>
                <p className="text-base text-muted-foreground dark:text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
