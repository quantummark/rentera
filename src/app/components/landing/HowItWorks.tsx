'use client';

import { useTranslation } from 'react-i18next';
import {
  Search,
  Users,
  FileText,
  CheckCircle,
  ArrowDown,
} from 'lucide-react';

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      icon: Search,
      number: 1,
      title: t('howItWorks.step1.title', 'Регистрация'),
      description: t(
        'howItWorks.step1.description',
        'Создайте аккаунт как арендатор или владелец и заполните профиль.'
      ),
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      color: 'text-blue-600 dark:text-blue-300',
    },
    {
      icon: Users,
      number: 2,
      title: t('howItWorks.step2.title', 'Поиск или добавление жилья'),
      description: t(
        'howItWorks.step2.description',
        'Начните искать жильё или добавьте собственное для аренды.'
      ),
      bg: 'bg-green-100 dark:bg-green-900/20',
      color: 'text-green-600 dark:text-green-300',
    },
    {
      icon: FileText,
      number: 3,
      title: t('howItWorks.step3.title', 'Условия аренды'),
      description: t(
        'howItWorks.step3.description',
        'Согласуйте условия аренды через платформу — без лишних звонков и бумажной работы.'
      ),
      bg: 'bg-yellow-100 dark:bg-yellow-900/20',
      color: 'text-yellow-600 dark:text-yellow-300',
    },
    {
      icon: CheckCircle,
      number: 4,
      title: t('howItWorks.step4.title', 'Подписание и оплата'),
      description: t(
        'howItWorks.step4.description',
        'Подпишите договор и оплатите аренду онлайн прямо через платформу.'
      ),
      bg: 'bg-purple-100 dark:bg-purple-900/20',
      color: 'text-purple-600 dark:text-purple-300',
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-background dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl text-center font-semibold mb-10 text-foreground dark:text-white">
          {t('howItWorks.title', 'Как это работает?')}
        </h2>
        <p className="text-lg md:text-2xl text-muted-foreground dark:text-muted-foreground text-center mb-12">
          {t(
            'howItWorks.subtitle',
            'Rentera упрощает процесс аренды жилья, делая его быстрым для всех участников.'
          )}
        </p>
        <div className="space-y-12">
          {steps.map(({ number, title, description, bg, color }, idx) => (
  <div key={idx} className="relative mb-12">
    <div className="flex items-start gap-6 bg-card border border-muted rounded-2xl p-6 shadow-sm transition-all">
      <div className={`flex items-center justify-center w-16 h-16 rounded-full ${bg}`}>
        <div className={`w-8 h-8 flex items-center justify-center ${color} font-bold`}>
          {number}
        </div>
      </div>

      <div className="space-y-2 flex-1">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-base text-muted-foreground dark:text-muted-foreground">
          {description}
        </p>
      </div>
    </div>

    {idx < steps.length - 1 && (
      <ArrowDown
        className="absolute left-1/2 -bottom-9 transform -translate-x-1/2
                   w-6 h-6 text-muted-foreground dark:text-muted-foreground"
      />
    )}
  </div>
))}
        </div>
      </div>
    </section>
  );
}
