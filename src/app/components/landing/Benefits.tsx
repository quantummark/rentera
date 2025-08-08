'use client';

import { useTranslation } from 'react-i18next';
import { Handshake, ShieldCheck, CreditCard, Bitcoin } from 'lucide-react';

export default function Benefits() {
  const { t } = useTranslation();

  const benefits = [
    {
      icon: Handshake,
      label: t('benefits.noIntermediaries', 'Без посредников'),
      description: t('benefits.directCommunication', 'Прямое общение между владельцем и арендатором'),
      bg: 'bg-green-100 dark:bg-green-900/20',
      color: 'text-green-600 dark:text-green-300',
    },
    {
      icon: ShieldCheck,
      label: t('benefits.insurance', 'Страховка объекта'),
      description: t('benefits.insuranceDescription', 'Страхуем объекты на сумму 250000 грн'),
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      color: 'text-blue-600 dark:text-blue-300',
    },
    {
      icon: CreditCard,
      label: t('benefits.onlinePayment', 'Онлайн-оплата и договор'),
      description: t('benefits.paymentDescription', 'Удобно и прозрачно прямо на платформе'),
      bg: 'bg-yellow-100 dark:bg-yellow-900/20',
      color: 'text-yellow-600 dark:text-yellow-300',
    },
    {
      icon: Bitcoin,
      label: t('benefits.modernPlatform', 'Web3 и криптовалюта'),
      description: t('benefits.modernPlatformDescription', 'Возможность добавить оплату в криптовалюте'),
      bg: 'bg-purple-100 dark:bg-purple-900/20',
      color: 'text-purple-600 dark:text-purple-300',
    },
  ];

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-background dark:bg-background-dark">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl text-center font-semibold mb-10 text-foreground dark:text-foreground-dark">
          {t('benefits.title', 'Преимущества Rentera')}
        </h2>
        <p className="text-lg md:text-2xl text-muted-foreground dark:text-muted-foreground text-center mb-12">
          {t(
            'benefits.subtitle',
            'Rentera предлагает уникальные преимущества для арендаторов и владельцев жилья, делая процесс аренды безопасным и удобным.'
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map(({ icon: Icon, label, description, bg, color }, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 bg-card border border-muted rounded-2xl p-5 shadow-sm transition-all"
            >
              <div className={`p-2 rounded-xl ${bg}`}>
                <Icon className={`w-8 h-8 ${color}`} />
              </div>
              <div className="space-y-2">
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
