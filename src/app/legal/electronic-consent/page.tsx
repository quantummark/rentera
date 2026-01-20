'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { PenTool, ChevronRight, ExternalLink } from 'lucide-react';

type Section = {
  id: string;
  titleKey: string;
  blocks: Array<
    | { type: 'p'; key: string }
    | { type: 'ul'; keys: string[] }
  >;
};

const SECTIONS: Section[] = [
  {
    id: 'intro',
    titleKey: 'electronicConsent:sections.intro.title',
    blocks: [
      { type: 'p', key: 'electronicConsent:sections.intro.p1' },
      { type: 'p', key: 'electronicConsent:sections.intro.p2' }
    ]
  },
  {
    id: 'e-form',
    titleKey: 'electronicConsent:sections.eForm.title',
    blocks: [
      { type: 'p', key: 'electronicConsent:sections.eForm.p1' },
      { type: 'ul', keys: ['electronicConsent:sections.eForm.li1', 'electronicConsent:sections.eForm.li2', 'electronicConsent:sections.eForm.li3'] }
    ]
  },
  {
    id: 'signature',
    titleKey: 'electronicConsent:sections.signature.title',
    blocks: [
      { type: 'p', key: 'electronicConsent:sections.signature.p1' },
      { type: 'ul', keys: ['electronicConsent:sections.signature.li1', 'electronicConsent:sections.signature.li2', 'electronicConsent:sections.signature.li3', 'electronicConsent:sections.signature.li4'] },
      { type: 'p', key: 'electronicConsent:sections.signature.p2' }
    ]
  },
  {
    id: 'legal',
    titleKey: 'electronicConsent:sections.legal.title',
    blocks: [
      { type: 'p', key: 'electronicConsent:sections.legal.p1' },
      { type: 'p', key: 'electronicConsent:sections.legal.p2' }
    ]
  },
  {
    id: 'responsibility',
    titleKey: 'electronicConsent:sections.responsibility.title',
    blocks: [
      { type: 'p', key: 'electronicConsent:sections.responsibility.p1' },
      { type: 'ul', keys: ['electronicConsent:sections.responsibility.li1', 'electronicConsent:sections.responsibility.li2', 'electronicConsent:sections.responsibility.li3'] }
    ]
  },
  {
    id: 'final',
    titleKey: 'electronicConsent:sections.final.title',
    blocks: [
      { type: 'p', key: 'electronicConsent:sections.final.p1' },
      { type: 'p', key: 'electronicConsent:sections.final.p2' }
    ]
  }
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function ElectronicConsentPage() {
  const { t } = useTranslation(['electronicConsent']);

  return (
    <main className="mx-auto w-full max-w-5xl px-1 sm:px-4 md:px-6 py-8 md:py-12">
      {/* Header */}
      <header className="rounded-3xl border bg-background/60 p-5 md:p-8 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-2xl border bg-background p-3 shadow-sm shrink-0">
            <PenTool className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl md:text-4xl font-semibold leading-tight">
              {t(
                'electronicConsent:title',
                'Згода на використання електронної форми договору та електронного підпису'
              )}
            </h1>

            <p className="mt-2 text-sm md:text-base opacity-80 leading-relaxed max-w-3xl">
              {t(
                'electronicConsent:subtitle',
                'Цей документ пояснює, як працює електронний формат договору на Renterya та як фіксується підтвердження підписання.'
              )}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs opacity-80">
              <span className="rounded-full border bg-background px-3 py-1">
                {t('electronicConsent:meta.site', 'Сайт')}: renterya.com
              </span>

              <span className="rounded-full border bg-background px-3 py-1">
                {t('electronicConsent:meta.updated', 'Останнє оновлення')}: {t('electronicConsent:meta.updatedValue', '—')}
              </span>

              <Link
                href="/terms"
                className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1 hover:shadow-sm transition"
              >
                {t('electronicConsent:meta.termsLink', 'Умови використання')}
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>

              <Link
                href="/privacy"
                className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1 hover:shadow-sm transition"
              >
                {t('electronicConsent:meta.privacyLink', 'Політика конфіденційності')}
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
          {/* Callout */}
          <div className="rounded-2xl border bg-background/70 p-4 md:p-5 shadow-sm">
            <div className="text-sm md:text-base font-semibold">
              {t('electronicConsent:callout.title', 'Коротко: що ви підтверджуєте')}
            </div>
            <ul className="mt-2 list-disc pl-5 space-y-2 text-sm md:text-base opacity-90 leading-relaxed">
              <li>{t('electronicConsent:callout.li1', 'Електронний формат договору є прийнятним для вас.')}</li>
              <li>{t('electronicConsent:callout.li2', 'Ви підписуєте договір добровільно та усвідомлено.')}</li>
              <li>{t('electronicConsent:callout.li3', 'Технічні дані підписання можуть бути використані як доказ у разі спору.')}</li>
            </ul>
          </div>

          <div className="mt-6" />

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
              'electronicConsent:footerNote',
              'Цей документ є базовою версією для MVP та може оновлюватися у процесі розвитку сервісу.'
            )}
          </div>
        </article>

        {/* TOC */}
        <aside className="md:sticky md:top-24 h-fit rounded-3xl border bg-background/60 p-4 shadow-sm">
          <div className="text-sm font-semibold">
            {t('electronicConsent:toc.title', 'Зміст')}
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
