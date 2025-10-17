'use client';

import { useTranslation } from 'react-i18next';
import { Handshake, ShieldCheck, CreditCard, Bitcoin } from 'lucide-react';

export default function Benefits() {
  const { t } = useTranslation('benefits');

  const benefits = [
    {
      icon: Handshake,
      label: t('benefits:noIntermediaries'),
      description: t('benefits:directCommunication'),
      gradientFrom: 'from-green-400/30',
      gradientTo: 'to-green-600/30',
      iconColor: 'text-green-600 dark:text-green-300',
    },
    {
      icon: ShieldCheck,
      label: t('benefits:insurance'),
      description: t('benefits:insuranceDescription'),
      gradientFrom: 'from-blue-400/30',
      gradientTo: 'to-blue-600/30',
      iconColor: 'text-blue-600 dark:text-blue-300',
    },
    {
      icon: CreditCard,
      label: t('benefits:onlinePayment'),
      description: t('benefits:paymentDescription'),
      gradientFrom: 'from-yellow-400/30',
      gradientTo: 'to-yellow-600/30',
      iconColor: 'text-yellow-600 dark:text-yellow-300',
    },
    {
      icon: Bitcoin,
      label: t('benefits:modernPlatform'),
      description: t('benefits:modernPlatformDescription'),
      gradientFrom: 'from-purple-400/30',
      gradientTo: 'to-purple-600/30',
      iconColor: 'text-purple-600 dark:text-purple-300',
    },
  ];

  return (
    <section className="w-full py-16 md:py-20 bg-background dark:bg-background-dark">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-semibold text-center mb-12 text-foreground dark:text-foreground-dark drop-shadow-lg">
          {t('benefits:title')}
        </h2>
        <p className="text-lg md:text-2xl text-center text-muted-foreground dark:text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed tracking-wide">
          {t('benefits:subtitle')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map(({ icon: Icon, label, description, gradientFrom, gradientTo, iconColor }, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-6 bg-card rounded-3xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 hover:scale-105"
            >
              <div
  className={`w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br ${gradientFrom} ${gradientTo} shadow-md aspect-square`}
>
  <Icon className={`w-10 h-10 ${iconColor}`} />
</div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground dark:text-foreground-dark">{label}</h3>
                <p className="text-base text-muted-foreground dark:text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
