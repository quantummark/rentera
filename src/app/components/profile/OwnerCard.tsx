'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { Mail, MapPin, Phone, Instagram, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Timestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';

function formatDateLocalized(ts: Timestamp, locale: string): string {
  if (!ts?.toDate) return '';
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(ts.toDate());
}

interface OwnerMetrics {
  listingsCount: number;
  completedRentals: number;
  averageRating: number;
  responseTime: string;
  responseRate?: string;
}

interface SocialLinks {
  instagram?: string;
  telegram?: string;
}

interface OwnerProfile {
  uid: string;
  fullName: string;
  bio?: string;
  city: string;
  contactPhone?: string;
  contactEmail?: string;
  profileImageUrl?: string;
  socialLinks?: SocialLinks;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  metrics?: OwnerMetrics;
}

interface OwnerCardProps {
  owner: OwnerProfile;
}

export default function OwnerCard({ owner }: OwnerCardProps) {
  const { t, i18n } = useTranslation(['ownerCard']);
  const router = useRouter();

  const sinceText = useMemo(
    () =>
      t('ownerCard:locationSince', {
        city: owner.city,
        date: formatDateLocalized(owner.createdAt, i18n.language),
      }),
    [owner.city, owner.createdAt, i18n.language, t]
  );

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {/* depth/glow layer */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-br from-orange-500/30 via-zinc-500/5 to-transparent blur-2xl"
      />
      <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-md md:p-8 dark:bg-white/5">
        {/* 3-колонная сетка: слева текст, по центру фото, справа параметры */}
        <div className="grid grid-cols-1 items-center gap-8 text-center md:grid-cols-[1fr_auto_1fr] md:text-left">
          {/* Левая колонка — имя, город+дата, био, контакты */}
          <div className="flex flex-col items-center gap-3 md:items-start">
            <h2 className="text-2xl font-semibold text-foreground">{owner.fullName}</h2>

            <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground md:justify-start">
              <MapPin className="h-4 w-4 shrink-0 text-orange-500" />
              {sinceText}
            </p>

            <div className="max-w-prose pt-2 text-base text-foreground">
              <p className="leading-relaxed">{owner.bio || t('ownerCard:noBio')}</p>
            </div>

            {/* Контакты / соцсети */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3 text-sm text-muted-foreground md:justify-start">
              {owner.contactPhone && (
                <span className="inline-flex items-center gap-1">
                  <Phone className="h-4 w-4 text-green-500" />
                  {owner.contactPhone}
                </span>
              )}
              {owner.contactEmail && (
                <span className="inline-flex items-center gap-1">
                  <Mail className="h-4 w-4 text-blue-500" />
                  {owner.contactEmail}
                </span>
              )}
              {owner.socialLinks?.telegram && (
                <a
                  href={owner.socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:underline"
                >
                  <Send className="h-4 w-4 text-sky-500" />
                  Telegram
                </a>
              )}
              {owner.socialLinks?.instagram && (
                <a
                  href={owner.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:underline"
                >
                  <Instagram className="h-4 w-4 text-pink-500" />
                  Instagram
                </a>
              )}
            </div>
          </div>

          {/* Центральная колонка — аватар (всегда по центру) */}
          <div className="flex items-center justify-center">
            {owner.profileImageUrl ? (
              <Image
                src={owner.profileImageUrl}
                alt={owner.fullName}
                width={164}
                height={164}
                className="h-[164px] w-[164px] rounded-full border object-cover shadow-md"
                priority
              />
            ) : (
              <div
                className="flex h-[164px] w-[164px] items-center justify-center rounded-full border border-white/10 bg-muted text-2xl font-bold"
                aria-label={owner.fullName}
              >
                {owner.fullName?.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          {/* Правая колонка — параметры/метрики */}
          <div>
            <h3 className="mb-3 text-base font-semibold text-foreground">🧾 {t('ownerCard:parameters')}</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <MetricCard
                label={t('ownerCard:listings')}
                value={owner.metrics?.listingsCount ?? 0}
                hint=""
              />
              <MetricCard
                label={t('ownerCard:completedRentals')}
                value={owner.metrics?.completedRentals ?? 0}
                hint=""
              />
              <MetricCard
                label={t('ownerCard:rating')}
                value={owner.metrics?.averageRating ?? 0}
                hint="★"
              />
              <MetricCard
                label={t('ownerCard:responseTime')}
                value={owner.metrics?.responseTime ?? '—'}
                hint=""
              />
              {owner.metrics?.responseRate && (
                <MetricCard
                  label={t('ownerCard:responseRate')}
                  value={owner.metrics.responseRate}
                  hint=""
                />
              )}
            </div>
          </div>
        </div>

        {/* CTA — снизу по центру */}
        <div className="flex justify-center pt-8">
          <Button
            onClick={() => router.push(`/messages?userId=${owner.uid}`)}
            className="px-6 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
          >
            💬 {t('ownerCard:contact')}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-xl bg-white/5 p-3 shadow-sm backdrop-blur-sm',
        'border border-white/10'
      )}
    >
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="truncate text-foreground">
          <span className="text-base font-semibold">{String(value)}</span>{' '}
          {hint ? <span className="opacity-70">{hint}</span> : null}
        </p>
      </div>
    </div>
  );
}
