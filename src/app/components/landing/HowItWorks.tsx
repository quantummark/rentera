'use client';

import { useTranslation } from 'react-i18next';
import { CircleUser, Home, FileCheck, ClipboardPenLine } from 'lucide-react';

export default function HowItWorks() {
  const { t } = useTranslation('howItWorks');

  const steps = [
    {
      icon: CircleUser,
      number: 1,
      title: t('howItWorks:step1.title'),
      description: t('howItWorks:step1.description'),
      gradientFrom: 'from-blue-400/30',
      gradientTo: 'to-blue-600/30',
      iconColor: 'text-blue-600 dark:text-blue-300',
    },
    {
      icon: Home,
      number: 2,
      title: t('howItWorks:step2.title'),
      description: t(
        'howItWorks:step2.description',
      ),
      gradientFrom: 'from-green-400/30',
      gradientTo: 'to-green-600/30',
      iconColor: 'text-green-600 dark:text-green-300',
    },
    {
      icon: FileCheck,
      number: 3,
      title: t('howItWorks:step3.title'),
      description: t(
        'howItWorks:step3.description',
      ),
      gradientFrom: 'from-yellow-400/30',
      gradientTo: 'to-yellow-600/30',
      iconColor: 'text-yellow-600 dark:text-yellow-300',
    },
    {
      icon: ClipboardPenLine,
      number: 4,
      title: t('howItWorks:step4.title'),
      description: t('howItWorks:step4.description'),
      gradientFrom: 'from-purple-400/30',
      gradientTo: 'to-purple-600/30',
      iconColor: 'text-purple-600 dark:text-purple-300',
    },
  ];

  return (
    <section className="py-16 bg-background dark:bg-background-dark">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-semibold text-center mb-12 text-foreground dark:text-foreground-dark drop-shadow-lg">
          {t('howItWorks:title')}
        </h2>
        <p className="text-lg md:text-2xl text-center text-muted-foreground dark:text-muted-foreground mb-16 max-w-3xl mx-auto leading-relaxed tracking-wide">
          {t('howItWorks:subtitle')}
        </p>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, description, gradientFrom, gradientTo, iconColor }, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-6 bg-card rounded-3xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 hover:scale-105"
            >
              <div
                className={`flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${gradientFrom} ${gradientTo} mb-4 shadow-md`}
              >
                <Icon className={`w-10 h-10 ${iconColor}`} />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-foreground dark:text-foreground-dark">
                {title}
              </h3>
              <p className="text-base text-muted-foreground dark:text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
