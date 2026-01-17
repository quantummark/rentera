'use client';

import * as Accordion from '@radix-ui/react-accordion';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export type FaqItem = {
  id: string;
  title: string;
  teaser?: string;
  href: string;
};

type Props = {
  items: FaqItem[];
  ariaLabel?: string;
};

export default function FaqAccordion({ items, ariaLabel }: Props) {
  return (
    <div className="rounded-2xl border bg-background/60 p-4 md:p-6 shadow-sm">
      <Accordion.Root
        type="single"
        collapsible
        className="w-full"
        aria-label={ariaLabel ?? 'FAQ'}
      >
        <div className="space-y-2">
          {items.map((item) => (
            <Accordion.Item
              key={item.id}
              value={item.id}
              className="rounded-xl border bg-background"
            >
              <Accordion.Header>
                <Accordion.Trigger
                  className="group flex w-full items-center justify-between gap-3 px-4 py-3 text-left
                             text-sm md:text-base font-medium"
                >
                  <span className="min-w-0">{item.title}</span>

                  <ChevronDown
                    className="h-4 w-4 shrink-0 opacity-70 transition-transform duration-200
                               group-data-[state=open]:rotate-180"
                  />
                </Accordion.Trigger>
              </Accordion.Header>

              <Accordion.Content className="px-4 pb-4 text-sm">
                {item.teaser ? (
                  <p className="opacity-80 leading-relaxed">{item.teaser}</p>
                ) : null}

                <div className="mt-3">
                  <Link
                    href={item.href}
                    className="inline-flex items-center rounded-xl border bg-background px-3 py-2
                               text-sm font-medium shadow-sm transition hover:shadow-md"
                  >
                    Детальніше
                  </Link>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </div>
      </Accordion.Root>
    </div>
  );
}
