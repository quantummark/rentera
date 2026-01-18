'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, FileSignature, Sparkles, Globe, Users, HeartHandshake } from 'lucide-react';

type ValueCard = {
  icon: React.ReactNode;
  title: string;
  desc: string;
};

export default function AboutPage() {
  const { t } = useTranslation(['about']);

  const values: ValueCard[] = [
    {
      icon: <HeartHandshake className="h-5 w-5" />,
      title: t('about:values.direct.title', 'Прямі домовленості'),
      desc: t(
        'about:values.direct.desc',
        'Rentera створена для прямої оренди без посередників — прозоро і чесно.'
      )
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: t('about:values.safety.title', 'Безпека і довіра'),
      desc: t(
        'about:values.safety.desc',
        'Ми будуємо правила та інструменти, що захищають обидві сторони.'
      )
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: t('about:values.simple.title', 'Простота'),
      desc: t(
        'about:values.simple.desc',
        'Менше бюрократії — більше зручності. Все важливе в кілька кліків.'
      )
    }
  ];

  const steps: ValueCard[] = [
    {
      icon: <Globe className="h-5 w-5" />,
      title: t('about:direction.launch.title', 'Запуск у Києві'),
      desc: t(
        'about:direction.launch.desc',
        'Починаємо з реального ринку та реальних користувачів — перевіряємо цінність.'
      )
    },
    {
      icon: <FileSignature className="h-5 w-5" />,
      title: t('about:direction.contracts.title', 'Онлайн-договір і оплата'),
      desc: t(
        'about:direction.contracts.desc',
        'Підписання та платежі — у єдиному потоці, без хаосу і “скиньте в месенджер”.'
      )
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: t('about:direction.community.title', 'Комʼюніті та підтримка'),
      desc: t(
        'about:direction.community.desc',
        'Знання, досвід і рекомендації від людей — щоб орендувати було спокійніше.'
      )
    }
  ];

  return (
    <main className="mx-auto w-full max-w-5xl px-1 sm:px-4 md:px-6 py-8 md:py-12">
      {/* Hero */}
      <section className="rounded-3xl border bg-background/60 p-5 md:p-8 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-2xl md:text-4xl font-semibold leading-tight">
              {t('about:hero.title', 'Rentera — платформа прямої оренди житла')}
            </h1>
            <p className="mt-3 text-sm md:text-base opacity-80 leading-relaxed">
              {t(
                'about:hero.subtitle',
                'Ми допомагаємо власникам і орендарям домовлятися напряму: швидко, зрозуміло та без зайвих посередників.'
              )}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border bg-background px-3 py-1 text-xs opacity-80">
                {t('about:hero.badge1', 'Без посередників')}
              </span>
              <span className="rounded-full border bg-background px-3 py-1 text-xs opacity-80">
                {t('about:hero.badge2', 'Договір онлайн')}
              </span>
              <span className="rounded-full border bg-background px-3 py-1 text-xs opacity-80">
                {t('about:hero.badge3', 'Підтримка 24h')}
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border bg-background shadow-sm">
            <Image
              src="/images/about/hero.jpg"
              alt={t('about:hero.imageAlt', 'Rentera — About')}
              width={1200}
              height={800}
              className="h-56 w-full object-cover md:h-72"
              priority
            />
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="mt-6 rounded-3xl border bg-background/60 p-5 md:p-8 shadow-sm">
        <h2 className="text-lg md:text-2xl font-semibold">
          {t('about:what.title', 'Що ми робимо')}
        </h2>
        <p className="mt-2 text-sm md:text-base opacity-80 max-w-3xl leading-relaxed">
          {t(
            'about:what.subtitle',
            'Rentera обʼєднує пошук житла, комунікацію, домовленості та підтримку в одному місці — щоб оренда була простішою.'
          )}
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          {values.map((v, idx) => (
            <div key={idx} className="rounded-2xl border bg-background p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="shrink-0 rounded-xl border bg-background p-2 shadow-sm">
                  {v.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-sm md:text-base font-semibold">{v.title}</div>
                  <p className="mt-1 text-sm opacity-80 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Image strip */}
      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl border bg-background shadow-sm">
          <Image
            src="/images/about/city.jpg"
            alt={t('about:images.cityAlt', 'City')}
            width={1200}
            height={800}
            className="h-48 w-full object-cover md:h-64"
          />
        </div>
        <div className="relative overflow-hidden rounded-3xl border bg-background shadow-sm">
          <Image
            src="/images/about/home.jpg"
            alt={t('about:images.homeAlt', 'Home')}
            width={1200}
            height={800}
            className="h-48 w-full object-cover md:h-64"
          />
        </div>
      </section>

      {/* Direction */}
      <section className="mt-6 rounded-3xl border bg-background/60 p-5 md:p-8 shadow-sm">
        <h2 className="text-lg md:text-2xl font-semibold">
          {t('about:direction.title', 'Куди ми йдемо')}
        </h2>
        <p className="mt-2 text-sm md:text-base opacity-80 max-w-3xl leading-relaxed">
          {t(
            'about:direction.subtitle',
            'Ми рухаємося крок за кроком: запускаємося, перевіряємо гіпотези, покращуємо продукт і масштабуємося.'
          )}
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((s, idx) => (
            <div key={idx} className="rounded-2xl border bg-background p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="shrink-0 rounded-xl border bg-background p-2 shadow-sm">
                  {s.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-sm md:text-base font-semibold">{s.title}</div>
                  <p className="mt-1 text-sm opacity-80 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer note */}
      <section className="mt-6 rounded-3xl border bg-background/60 p-5 md:p-8 shadow-sm">
        <h2 className="text-lg md:text-2xl font-semibold">
          {t('about:belief.title', 'У що ми віримо')}
        </h2>
        <p className="mt-2 text-sm md:text-base opacity-80 leading-relaxed max-w-3xl">
          {t(
            'about:belief.text',
            'Оренда має бути спокійною: чесні правила, зрозумілі умови та підтримка, коли вона потрібна. Саме це ми й будуємо.'
          )}
        </p>
      </section>
    </main>
  );
}
