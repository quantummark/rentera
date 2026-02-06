'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { BookText, ChevronRight, ExternalLink } from 'lucide-react';

type TermsSection = {
  id: string;
  titleKey: string;
  blocks: Array<
    | { type: 'p'; key: string }
    | { type: 'ul'; keys: string[] }
  >;
};

const SECTIONS: TermsSection[] = [
  {
    id: 'intro',
    titleKey: 'terms:sections.intro.title',
    blocks: [
      { type: 'p', key: 'terms:sections.intro.p1' },
      { type: 'p', key: 'terms:sections.intro.p2' }
    ]
  },
  {
    id: 'about',
    titleKey: 'terms:sections.about.title',
    blocks: [
      { type: 'p', key: 'terms:sections.about.p1' },
      { type: 'ul', keys: ['terms:sections.about.li1', 'terms:sections.about.li2'] }
    ]
  },
  {
    id: 'eligibility',
    titleKey: 'terms:sections.eligibility.title',
    blocks: [
      { type: 'p', key: 'terms:sections.eligibility.p1' },
      { type: 'ul', keys: ['terms:sections.eligibility.li1', 'terms:sections.eligibility.li2'] }
    ]
  },
  {
    id: 'account',
    titleKey: 'terms:sections.account.title',
    blocks: [
      { type: 'p', key: 'terms:sections.account.p1' },
      { type: 'ul', keys: ['terms:sections.account.li1', 'terms:sections.account.li2', 'terms:sections.account.li3'] }
    ]
  },
  {
    id: 'direct-rent',
    titleKey: 'terms:sections.directRent.title',
    blocks: [
      { type: 'p', key: 'terms:sections.directRent.p1' },
      { type: 'ul', keys: ['terms:sections.directRent.li1', 'terms:sections.directRent.li2'] }
    ]
  },
  {
    id: 'contracts',
    titleKey: 'terms:sections.contracts.title',
    blocks: [
      { type: 'p', key: 'terms:sections.contracts.p1' },
      { type: 'p', key: 'terms:sections.contracts.p2' }
    ]
  },
  {
    id: 'payments',
    titleKey: 'terms:sections.payments.title',
    blocks: [
      { type: 'p', key: 'terms:sections.payments.p1' },
      { type: 'ul', keys: ['terms:sections.payments.li1', 'terms:sections.payments.li2', 'terms:sections.payments.li3', 'terms:sections.payments.li4'] }
    ]
  },
  {
    id: 'content',
    titleKey: 'terms:sections.content.title',
    blocks: [
      { type: 'p', key: 'terms:sections.content.p1' },
      { type: 'ul', keys: ['terms:sections.content.li1', 'terms:sections.content.li2', 'terms:sections.content.li3', 'terms:sections.content.li4'] }
    ]
  },
  {
    id: 'community',
    titleKey: 'terms:sections.community.title',
    blocks: [
      { type: 'p', key: 'terms:sections.community.p1' },
      { type: 'ul', keys: ['terms:sections.community.li1', 'terms:sections.community.li2'] }
    ]
  },
  {
    id: 'blocking',
    titleKey: 'terms:sections.blocking.title',
    blocks: [
      { type: 'p', key: 'terms:sections.blocking.p1' },
      { type: 'ul', keys: ['terms:sections.blocking.li1', 'terms:sections.blocking.li2', 'terms:sections.blocking.li3'] }
    ]
  },
  {
    id: 'liability',
    titleKey: 'terms:sections.liability.title',
    blocks: [
      { type: 'p', key: 'terms:sections.liability.p1' },
      { type: 'ul', keys: ['terms:sections.liability.li1', 'terms:sections.liability.li2', 'terms:sections.liability.li3'] }
    ]
  },
  {
    id: 'privacy',
    titleKey: 'terms:sections.privacy.title',
    blocks: [
      { type: 'p', key: 'terms:sections.privacy.p1' }
    ]
  },
  {
    id: 'changes',
    titleKey: 'terms:sections.changes.title',
    blocks: [
      { type: 'p', key: 'terms:sections.changes.p1' }
    ]
  },
  {
    id: 'jurisdiction',
    titleKey: 'terms:sections.jurisdiction.title',
    blocks: [
      { type: 'p', key: 'terms:sections.jurisdiction.p1' }
    ]
  },
  {
    id: 'contacts',
    titleKey: 'terms:sections.contacts.title',
    blocks: [
      { type: 'p', key: 'terms:sections.contacts.p1' },
      { type: 'p', key: 'terms:sections.contacts.p2' }
    ]
  }
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function TermsPage() {
  const { t } = useTranslation(['terms']);

  return (
    <main className="mx-auto w-full max-w-5xl px-1 sm:px-4 md:px-6 py-8 md:py-12">
      {/* Header */}
      <header className="rounded-3xl border bg-background/60 p-5 md:p-8 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-2xl border bg-background p-3 shadow-sm shrink-0">
            <BookText className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-4xl font-semibold leading-tight">
              {t('terms:title', 'Умови використання')}
            </h1>
            <p className="mt-2 text-sm md:text-base opacity-80 leading-relaxed max-w-3xl">
              {t(
                'terms:subtitle',
                'Ці Умови регулюють використання платформи Renterya. Будь ласка, ознайомтеся перед використанням сервісу.'
              )}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs opacity-80">
              <span className="rounded-full border bg-background px-3 py-1">
                {t('terms:meta.site', 'Сайт')}: renterya.com
              </span>
              <span className="rounded-full border bg-background px-3 py-1">
                {t('terms:meta.updated', 'Останнє оновлення')}: {t('terms:meta.updatedValue', '___')}
              </span>
              <Link
                href="/privacy"
                className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1 hover:shadow-sm transition"
              >
                {t('terms:meta.privacyLink', 'Політика конфіденційності')}
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
              'terms:footerNote',
              'Цей документ є базовою версією для MVP та може оновлюватися у процесі розвитку сервісу.'
            )}
          </div>
        </article>

        {/* TOC */}
        <aside className="md:sticky md:top-24 h-fit rounded-3xl border bg-background/60 p-4 shadow-sm">
          <div className="text-sm font-semibold">
            {t('terms:toc.title', 'Зміст')}
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
