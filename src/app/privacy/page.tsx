'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Shield, ChevronRight, ExternalLink } from 'lucide-react';

type PrivacySection = {
  id: string;
  titleKey: string;
  blocks: Array<
    | { type: 'p'; key: string }
    | { type: 'ul'; keys: string[] }
  >;
};

const SECTIONS: PrivacySection[] = [
  {
    id: 'intro',
    titleKey: 'privacy:sections.intro.title',
    blocks: [
      { type: 'p', key: 'privacy:sections.intro.p1' },
      { type: 'p', key: 'privacy:sections.intro.p2' }
    ]
  },
  {
    id: 'data',
    titleKey: 'privacy:sections.data.title',
    blocks: [
      { type: 'p', key: 'privacy:sections.data.p1' },
      {
        type: 'ul',
        keys: [
          'privacy:sections.data.li1',
          'privacy:sections.data.li2',
          'privacy:sections.data.li3',
          'privacy:sections.data.li4',
          'privacy:sections.data.li5',
          'privacy:sections.data.li6',
          'privacy:sections.data.li7'
        ]
      }
    ]
  },
  {
    id: 'purpose',
    titleKey: 'privacy:sections.purpose.title',
    blocks: [
      { type: 'p', key: 'privacy:sections.purpose.p1' },
      {
        type: 'ul',
        keys: [
          'privacy:sections.purpose.li1',
          'privacy:sections.purpose.li2',
          'privacy:sections.purpose.li3',
          'privacy:sections.purpose.li4',
          'privacy:sections.purpose.li5',
          'privacy:sections.purpose.li6'
        ]
      }
    ]
  },
  {
    id: 'payments',
    titleKey: 'privacy:sections.payments.title',
    blocks: [
      { type: 'p', key: 'privacy:sections.payments.p1' },
      { type: 'p', key: 'privacy:sections.payments.p2' },
      { type: 'p', key: 'privacy:sections.payments.p3' }
    ]
  },
  {
    id: 'sharing',
    titleKey: 'privacy:sections.sharing.title',
    blocks: [
      { type: 'p', key: 'privacy:sections.sharing.p1' },
      {
        type: 'ul',
        keys: [
          'privacy:sections.sharing.li1',
          'privacy:sections.sharing.li2',
          'privacy:sections.sharing.li3',
          'privacy:sections.sharing.li4'
        ]
      },
      { type: 'p', key: 'privacy:sections.sharing.p2' }
    ]
  },
  {
    id: 'cookies',
    titleKey: 'privacy:sections.cookies.title',
    blocks: [
      { type: 'p', key: 'privacy:sections.cookies.p1' },
      {
        type: 'ul',
        keys: [
          'privacy:sections.cookies.li1',
          'privacy:sections.cookies.li2',
          'privacy:sections.cookies.li3'
        ]
      },
      { type: 'p', key: 'privacy:sections.cookies.p2' }
    ]
  },
  {
    id: 'storage',
    titleKey: 'privacy:sections.storage.title',
    blocks: [
      { type: 'p', key: 'privacy:sections.storage.p1' },
      { type: 'p', key: 'privacy:sections.storage.p2' }
    ]
  },
  {
    id: 'rights',
    titleKey: 'privacy:sections.rights.title',
    blocks: [
      { type: 'p', key: 'privacy:sections.rights.p1' },
      {
        type: 'ul',
        keys: [
          'privacy:sections.rights.li1',
          'privacy:sections.rights.li2',
          'privacy:sections.rights.li3',
          'privacy:sections.rights.li4',
          'privacy:sections.rights.li5'
        ]
      },
      { type: 'p', key: 'privacy:sections.rights.p2' }
    ]
  },
  {
    id: 'deletion',
    titleKey: 'privacy:sections.deletion.title',
    blocks: [
      { type: 'p', key: 'privacy:sections.deletion.p1' },
      { type: 'p', key: 'privacy:sections.deletion.p2' }
    ]
  },
  {
    id: 'security',
    titleKey: 'privacy:sections.security.title',
    blocks: [
      { type: 'p', key: 'privacy:sections.security.p1' }
    ]
  },
  {
    id: 'changes',
    titleKey: 'privacy:sections.changes.title',
    blocks: [
      { type: 'p', key: 'privacy:sections.changes.p1' }
    ]
  },
  {
    id: 'contacts',
    titleKey: 'privacy:sections.contacts.title',
    blocks: [
      { type: 'p', key: 'privacy:sections.contacts.p1' },
      { type: 'p', key: 'privacy:sections.contacts.p2' },
      { type: 'p', key: 'privacy:sections.contacts.p3' },
      { type: 'p', key: 'privacy:sections.contacts.p4' },
      { type: 'p', key: 'privacy:sections.contacts.p5' }
    ]
  }
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function PrivacyPage() {
  const { t } = useTranslation(['privacy']);

  return (
    <main className="mx-auto w-full max-w-5xl px-1 sm:px-4 md:px-6 py-8 md:py-12">
      {/* Header */}
      <header className="rounded-3xl border bg-background/60 p-5 md:p-8 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-2xl border bg-background p-3 shadow-sm shrink-0">
            <Shield className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-4xl font-semibold leading-tight">
              {t('privacy:title', 'Політика конфіденційності')}
            </h1>
            <p className="mt-2 text-sm md:text-base opacity-80 leading-relaxed max-w-3xl">
              {t(
                'privacy:subtitle',
                'Ця Політика пояснює, які дані ми збираємо, навіщо це потрібно та як ми їх захищаємо.'
              )}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs opacity-80">
              <span className="rounded-full border bg-background px-3 py-1">
                {t('privacy:meta.site', 'Сайт')}: renterya.com
              </span>
              <span className="rounded-full border bg-background px-3 py-1">
                {t('privacy:meta.updated', 'Останнє оновлення')}: {t('privacy:meta.updatedValue', '—')}
              </span>
              <Link
                href="/terms"
                className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1 hover:shadow-sm transition"
              >
                {t('privacy:meta.termsLink', 'Умови використання')}
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_280px]">
        {/* Content */}
        <article className="rounded-3xl border bg-background/60 p-5 md:p-8 shadow-sm">
          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="text-lg md:text-2xl font-semibold leading-snug">
                {t(s.titleKey)}
              </h2>

              <div className="mt-3 space-y-3">
                {s.blocks.map((b, idx) => {
                  if (b.type === 'p') {
                    return (
                      <p
                        key={`${s.id}-p-${idx}`}
                        className="text-sm md:text-base opacity-90 leading-relaxed"
                      >
                        {t(b.key)}
                      </p>
                    );
                  }

                  return (
                    <ul
                      key={`${s.id}-ul-${idx}`}
                      className="list-disc pl-5 space-y-2 text-sm md:text-base opacity-90 leading-relaxed"
                    >
                      {b.keys.map((k) => (
                        <li key={k}>{t(k)}</li>
                      ))}
                    </ul>
                  );
                })}
              </div>

              <div className="my-6 h-px w-full bg-border/70" />
            </section>
          ))}

          <div className="text-xs opacity-70">
            {t(
              'privacy:footerNote',
              'Цей документ є базовою версією для MVP та може оновлюватися у процесі розвитку сервісу.'
            )}
          </div>
        </article>

        {/* TOC */}
        <aside className="md:sticky md:top-24 h-fit rounded-3xl border bg-background/60 p-4 shadow-sm">
          <div className="text-sm font-semibold">
            {t('privacy:toc.title', 'Зміст')}
          </div>

          <nav className="mt-3 space-y-1">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollToId(s.id)}
                className="w-full text-left group flex items-start gap-2 rounded-xl px-3 py-2 text-sm
                           hover:bg-background/70 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ChevronRight className="h-4 w-4 mt-0.5 opacity-60 group-hover:opacity-90 shrink-0" />
                <span className="opacity-85 group-hover:opacity-100 leading-snug">
                  {t(s.titleKey)}
                </span>
              </button>
            ))}
          </nav>
        </aside>
      </div>
    </main>
  );
}
