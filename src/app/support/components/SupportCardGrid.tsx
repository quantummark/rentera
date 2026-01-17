'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Lightbulb, Flag, LifeBuoy, ArrowRight } from 'lucide-react';

type Card = {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
};

export default function SupportCardGrid() {
  const { t } = useTranslation(['support']);

  const cards: Card[] = [
    {
      href: '/support/idea',
      icon: <Lightbulb className="h-5 w-5" />,
      title: t('support:cards.idea.title', 'Запропонувати ідею'),
      description: t(
        'support:cards.idea.desc',
        'Є думка, як зробити Rentera кращою? Напишіть — ми прочитаємо.'
      ),
      cta: t('support:cards.idea.cta', 'Залишити ідею')
    },
    {
      href: '/support/complaint',
      icon: <Flag className="h-5 w-5" />,
      title: t('support:cards.complaint.title', 'Поскаржитися'),
      description: t(
        'support:cards.complaint.desc',
        "Проблема з користувачем, обʼєктом або поведінкою в чаті? Розберемося."
      ),
      cta: t('support:cards.complaint.cta', 'Подати скаргу')
    },
    {
      href: '/support/help',
      icon: <LifeBuoy className="h-5 w-5" />,
      title: t('support:cards.help.title', 'Допомога з платформою'),
      description: t(
        'support:cards.help.desc',
        'Не знаєте, як щось зробити? Підкажемо та проведемо крок за кроком.'
      ),
      cta: t('support:cards.help.cta', 'Отримати допомогу')
    }
  ];

  return (
    <section aria-label={t('support:home.cardsAria', 'Основні сценарії підтримки')}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group rounded-2xl border bg-background/60 p-5 shadow-sm transition
                       hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus:outline-none
                       focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-xl border bg-background p-2 shadow-sm">
                {c.icon}
              </div>

              <div className="min-w-0">
                <h2 className="text-base md:text-lg font-semibold leading-snug">
                  {c.title}
                </h2>

                <p className="mt-1 text-sm opacity-80 leading-relaxed">
                  {c.description}
                </p>

                <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium">
                  <span className="underline-offset-4 group-hover:underline">
                    {c.cta}
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-6 text-xs opacity-70">
        {t(
          'support:home.slaNote',
          'Зазвичай відповідаємо протягом 24 годин. Якщо ви офлайн — залиште email у чаті.'
        )}
      </p>
    </section>
  );
}
