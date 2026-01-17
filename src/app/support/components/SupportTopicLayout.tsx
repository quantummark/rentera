'use client';

import type { ReactNode } from 'react';

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function SupportTopicLayout({ title, subtitle, children }: Props) {
  return (
    <main className="mx-auto w-full max-w-5xl px-1 py-8 md:py-12">
      <header className="mb-6 md:mb-8">
        <div className="rounded-2xl border bg-background/60 p-5 md:p-8 shadow-sm">
          <h1 className="text-2xl md:text-4xl font-semibold tracking-tight">
            {title}
          </h1>

          {subtitle ? (
            <p className="mt-2 md:mt-3 text-sm md:text-base opacity-80 max-w-2xl">
              {subtitle}
            </p>
          ) : null}
        </div>
      </header>

      <section className="space-y-6">{children}</section>
    </main>
  );
}
