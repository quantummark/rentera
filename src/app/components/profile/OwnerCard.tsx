'use client';

import { useMemo } from 'react';
import { Mail, MapPin, Phone, Instagram, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Timestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { useEditMode } from '@/app/components/inline/useEditMode';
import InlineText from '@/app/components/inline/InlineText';
import InlineTextarea from '@/app/components/inline/InlineTextarea';
import InlineSocialLink from '@/app/components/inline/InlineSocialLink';
import { patchOwner } from '@/app/lib/firestore/profiles';
import InlineAvatar from '@/app/components/inline/InlineAvatar';

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
  const { t, i18n } = useTranslation(['ownerCard', 'common']);
  const router = useRouter();
  const isEdit = useEditMode();
  const canEdit = isEdit && /* user?.uid === owner.uid */ true;
  const onSaveFullName = async (next: string) => {
    await patchOwner(owner.uid, { fullName: next });
  }
  const onSaveBio = async (next: string) => {
    await patchOwner(owner.uid, { bio: next });
  }
  const onSavePhone = async (next: string) => {
  await patchOwner(owner.uid, { contactPhone: next.trim() });
};

const onSaveEmail = async (next: string) => {
  const val = next.trim();
  // легкая валидация email (нестрогая)
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (val && !re.test(val)) {
    alert(t('common:invalidEmail'));
    return;
  }
  await patchOwner(owner.uid, { contactEmail: val.toLowerCase() });
};

const onSaveTelegram = async (next: string) => {
  await patchOwner(owner.uid, { 'socialLinks.telegram': next.trim() });
};

const onSaveInstagram = async (next: string) => {
  await patchOwner(owner.uid, { 'socialLinks.instagram': next.trim() });
};

const onChangeAvatarUrl = async (nextUrl: string) => {
  await patchOwner(owner.uid, { profileImageUrl: nextUrl });
};

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
            <h2 className="text-2xl font-semibold text-foreground">
  <InlineText
    value={owner.fullName}
    canEdit={canEdit}
    onSave={onSaveFullName}
  />
</h2>

            <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground md:justify-start">
              <MapPin className="h-4 w-4 shrink-0 text-orange-500" />
              {sinceText}
            </p>

            <div className="max-w-prose pt-2 text-base text-foreground">
  <div className="leading-relaxed">
    <InlineTextarea
      value={owner.bio || ''}
      placeholder={t('ownerCard:noBio')}
      canEdit={canEdit}
      onSave={onSaveBio}
    />
  </div>
</div>

            {/* Контакты / соцсети (показываем только существующие; «Добавить …» — только в edit-режиме) */}
<div className="flex flex-wrap items-center justify-center gap-3 pt-3 text-base text-muted-foreground md:justify-start">
  {/* Телефон */}
  {owner.contactPhone ? (
    <span className="inline-flex items-center gap-1">
      <Phone className="h-4 w-4 text-green-500" />
      <InlineText
        value={owner.contactPhone}
        canEdit={canEdit}
        onSave={onSavePhone}
      />
    </span>
  ) : (
    canEdit && (
      <span className="inline-flex items-center gap-1">
        <Phone className="h-4 w-4 text-green-500" />
        <InlineText
          value=""
          canEdit={canEdit}
          onSave={onSavePhone}
          placeholder={t('ownerCard:addPhone')}
        />
      </span>
    )
  )}

  {/* Email */}
  {owner.contactEmail ? (
    <span className="inline-flex items-center gap-1">
      <Mail className="h-4 w-4 text-blue-500" />
      <InlineText
        value={owner.contactEmail}
        canEdit={canEdit}
        onSave={onSaveEmail}
      />
    </span>
  ) : (
    canEdit && (
      <span className="inline-flex items-center gap-1">
        <Mail className="h-4 w-4 text-blue-500" />
        <InlineText
          value=""
          canEdit={canEdit}
          onSave={onSaveEmail}
          placeholder={t('ownerCard:addEmail')}
        />
      </span>
    )
  )}

  {/* Telegram */}
{owner.socialLinks?.telegram ? (
  <span className="inline-flex items-center gap-1">
    <Send className="h-4 w-4 text-sky-500" />

    <InlineSocialLink
      value={owner.socialLinks.telegram}
      canEdit={canEdit}
      onSave={onSaveTelegram}
      label="Telegram" // 👈 показываем красивое слово вместо ссылки
    />
  </span>
) : (
  canEdit && (
    <span className="inline-flex items-center gap-1">
      <Send className="h-4 w-4 text-sky-500" />
      <InlineSocialLink
        value=""
        canEdit={canEdit}
        onSave={onSaveTelegram}
        placeholder={t('ownerCard:addTelegram')}
      />
    </span>
  )
)}

  {/* Instagram */}
{owner.socialLinks?.instagram ? (
  <span className="inline-flex items-center gap-1">
    <Instagram className="h-4 w-4 text-pink-500" />

    <InlineSocialLink
      value={owner.socialLinks.instagram}
      canEdit={canEdit}
      onSave={onSaveInstagram}
      label="Instagram" // 👈 показываем слово вместо ссылки
    />
  </span>
) : (
  canEdit && (
    <span className="inline-flex items-center gap-1">
      <Instagram className="h-4 w-4 text-pink-500" />
      <InlineSocialLink
        value=""
        canEdit={canEdit}
        onSave={onSaveInstagram}
        placeholder={t('ownerCard:addInstagram')}
      />
    </span>
  )
)}
</div>
          </div>

          {/* Центральная колонка — аватар (с инлайн-редактированием) */}
<div className="flex items-center justify-center">
  <InlineAvatar
    uid={owner.uid}
    value={owner.profileImageUrl || ''}
    canEdit={canEdit}
    onChangeUrl={onChangeAvatarUrl}
    alt={owner.fullName}
    size={164}
    // maxBytes={2*1024*1024} // можно поменять
    // acceptTypes={['image/jpeg','image/png','image/webp']}
    allowRemove
  />
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

        {/* Вместо p → div, чтобы можно было рендерить любые элементы */}
        <div className="truncate text-foreground">
          <span className="text-base font-semibold">{String(value)}</span>
          {hint ? <span className="opacity-70"> {hint}</span> : null}
        </div>
      </div>
    </div>
  );
}
