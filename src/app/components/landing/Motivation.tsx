'use client';

import { useTranslation } from 'react-i18next';
import { UserRoundPen, Globe, Store } from 'lucide-react';

export default function Motivation() {
  const { t } = useTranslation('motivation');

  const beliefs = [
    {
      icon: UserRoundPen,
      label: t('motivation:belief1'),
      description: t('motivation:belief1Desc'),
      gradientFrom: 'from-blue-400/30',
      gradientTo: 'to-blue-600/30',
      iconColor: 'text-blue-600 dark:text-blue-300',
    },
    {
      icon: Globe,
      label: t('motivation:belief2'),
      description: t('motivation:belief2Desc'),
      gradientFrom: 'from-green-400/30',
      gradientTo: 'to-green-600/30',
      iconColor: 'text-green-600 dark:text-green-300',
    },
    {
      icon: Store,
      label: t('motivation:belief3'),
      description: t('motivation:belief3Desc'),
      gradientFrom: 'from-orange-400/30',
      gradientTo: 'to-orange-600/30',
      iconColor: 'text-orange-600 dark:text-orange-300',
    },
  ];

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-background dark:bg-background-dark">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-semibold text-center mb-12 text-foreground dark:text-foreground-dark drop-shadow-lg">
          {t('motivation:title')}
        </h2>
        <p className="text-lg md:text-2xl text-muted-foreground dark:text-muted-foreground text-center mb-12 max-w-3xl mx-auto leading-relaxed tracking-wide">
          {t('motivation:subtitle')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {beliefs.map(({ icon: Icon, label, description, gradientFrom, gradientTo, iconColor }, idx) => (
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