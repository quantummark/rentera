'use client';

import { useTranslation } from 'react-i18next';
import { Handshake, ShieldCheck, CreditCard, Smartphone } from 'lucide-react';

export default function Benefits() {
  const { t } = useTranslation();

  const benefits = [
    {
      icon: Handshake,
      label: t('Без посредников'),
      description: t('Прямое общение между владельцем и арендатором'),
      bg: 'bg-green-100 dark:bg-green-900/20',
      color: 'text-green-600 dark:text-green-300',
    },
    {
      icon: ShieldCheck,
      label: t('Страховка объекта'),
      description: t('Страхуем объекты на сумму 250000 грн'),
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      color: 'text-blue-600 dark:text-blue-300',
    },
    {
      icon: CreditCard,
      label: t('Онлайн-оплата и договор'),
      description: t('Удобно и прозрачно прямо на платформе'),
      bg: 'bg-yellow-100 dark:bg-yellow-900/20',
      color: 'text-yellow-600 dark:text-yellow-300',
    },
    {
      icon: Smartphone,
      label: t('Современная платформа'),
      description: t('Продуманный UX и мобильная адаптация'),
      bg: 'bg-purple-100 dark:bg-purple-900/20',
      color: 'text-purple-600 dark:text-purple-300',
    },
  ];

  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map(({ icon: Icon, label, description, bg, color }, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 bg-card border border-muted rounded-2xl p-5 shadow-sm"
            >
              <div className={`p-2 rounded-xl ${bg}`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div className="space-y-1">
                <h4 className={`text-lg font-semibold`}>{label}</h4>
                <p className="text-base text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}