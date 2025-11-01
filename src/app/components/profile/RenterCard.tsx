'use client';

import { useTranslation } from 'react-i18next';
import { MapPin, Calendar, PawPrint, Baby, Briefcase, Wallet, Cigarette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Timestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import InlineSelect from '@/app/components/inline/InlineSelect';
import InlineCurrencyRange from '@/app/components/inline/InlineCurrencyRange';
import { patchRenter } from '@/app/lib/firestore/profiles';
import { useEditMode } from '@/app/components/inline/useEditMode';
import InlineText from '@/app/components/inline/InlineText';
import InlineTextarea from '@/app/components/inline/InlineTextarea';
import InlineAvatar from '@/app/components/inline/InlineAvatar';

function formatDateLocalized(ts: Timestamp, locale: string): string {
  if (!ts?.toDate) return '';
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(ts.toDate());
}

interface RenterProfile {
  uid: string;
  fullName: string;
  bio?: string;
  city: string;
  rentDuration: string;
  hasPets: 'no' | 'cat' | 'dog';
  hasKids: 'yes' | 'no';
  smoking: 'yes' | 'no';
  occupation: string;
  budgetFrom: number;
  budgetTo: number;
  profileImageUrl?: string;
  createdAt: Timestamp;
}

interface RenterCardProps {
  renter: RenterProfile;
  isCurrentUser: boolean;
}

export default function RenterCard({ renter }: RenterCardProps) {
  const { t, i18n } = useTranslation(['renterCard', 'common']);
  const router = useRouter();
  const isEdit = useEditMode();
const canEdit = isEdit && /* user?.uid === renter.uid */ true;

const petsOptions = [
  { value: 'no',  label: t('renterCard:noPets') },
  { value: 'cat', label: t('renterCard:cat') },
  { value: 'dog', label: t('renterCard:dog') },
];

const rentDurationOptions = [
  { value: '1-3',  label: t('renterCard:rentDuration_1_3',  '1–3 мес.') },
  { value: '3-6',  label: t('renterCard:rentDuration_3_6',  '3–6 мес.') },
  { value: '6-12', label: t('renterCard:rentDuration_6_12', '6–12 мес.') },
  { value: '12+',  label: t('renterCard:rentDuration_12p',  '12+ мес.') },
];

const yesNoOptions = [
  { value: 'yes', label: t('common:yes') },
  { value: 'no',  label: t('common:no') },
];

  const onSaveFullName = (next: string) => {
    patchRenter(renter.uid, { fullName: next });
  }

  const onSaveBio = (next: string) => {
    patchRenter(renter.uid, { bio: next });
  };

  const saveRentDuration = (next: string) =>
  patchRenter(renter.uid, { rentDuration: next });

const savePets = (next: 'no' | 'cat' | 'dog') =>
  patchRenter(renter.uid, { hasPets: next });

const saveKids = (next: 'yes' | 'no') =>
  patchRenter(renter.uid, { hasKids: next });

const saveSmoking = (next: 'yes' | 'no') =>
  patchRenter(renter.uid, { smoking: next });

const saveOccupation = (next: string) =>
  patchRenter(renter.uid, { occupation: next });

const onChangeRenterAvatar = async (nextUrl: string) => {
  await patchRenter(renter.uid, { profileImageUrl: nextUrl });
};

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {/* Depth / Glow layer */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-br from-orange-500/30 via-zinc-500/5 to-transparent blur-2xl"
      />
      <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-md md:p-8 dark:bg-white/5">
        {/* Outer container */}
        <div className="grid grid-cols-1 items-center gap-8 text-center md:grid-cols-[1fr_auto_1fr] md:text-left">
          {/* Left column — name, city/date, bio */}
          <div className="flex flex-col items-center gap-3 md:items-start">
            <h2 className="text-2xl font-semibold text-foreground">
              <InlineText
  value={renter.fullName}
  canEdit={canEdit}
  onSave={onSaveFullName}
/>
            </h2>

            <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground md:justify-start">
              <MapPin className="h-4 w-4 shrink-0 text-orange-500" />
              {t('renterCard:locationSince', {
                city: renter.city,
                date: formatDateLocalized(renter.createdAt, i18n.language),
              })}
            </p>

            <div className="max-w-prose pt-2 text-base text-foreground">
              <InlineTextarea
  value={renter.bio || ''}
  placeholder={t('renterCard:noBio')}
  canEdit={canEdit}
  onSave={onSaveBio}
/>
            </div>
          </div>

          {/* Center column — avatar (always centered) */}
<div className="flex items-center justify-center">
  <InlineAvatar
    uid={renter.uid}
    value={renter.profileImageUrl || ''}
    canEdit={canEdit}
    onChangeUrl={onChangeRenterAvatar}
    alt={renter.fullName}
    size={164}
    pathPrefix="renter"      // ← ключевая разница с Owner
    allowRemove
  />
</div>

          {/* Right column — parameters */}
<div>
  <h3 className="mb-3 text-base font-semibold text-foreground">
    🧾 {t('renterCard:parameters')}
  </h3>

  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
    {/* Срок аренды — селект */}
    <InfoCard
      icon={Calendar}
      label={t('renterCard:rentDuration')}
      colorClass="text-indigo-500"
      value={
        <InlineSelect
          value={renter.rentDuration}
          options={rentDurationOptions}
          canEdit={canEdit}
          onSave={saveRentDuration}
          presentation="auto"                 
        />
      }
    />

    {/* Бюджет — уже inline range */}
    <InfoCard
      icon={Wallet}
      label={t('renterCard:budget')}
      colorClass="text-emerald-500"
      value={
        <InlineCurrencyRange
          value={{ from: renter.budgetFrom, to: renter.budgetTo, currency: 'USD' }}
          canEdit={canEdit}
          onSave={(next) =>
            patchRenter(renter.uid, { budgetFrom: next.from, budgetTo: next.to })
          }
        />
      }
    />

    {/* Занятость — текст */}
    <InfoCard
      icon={Briefcase}
      label={t('renterCard:occupation')}
      colorClass="text-blue-500"
      value={
        <InlineText
          value={renter.occupation}
          canEdit={canEdit}
          onSave={saveOccupation}
        />
      }
    />

    {/* Питомцы — селект */}
    <InfoCard
      icon={PawPrint}
      label={t('renterCard:pets')}
      colorClass="text-amber-500"
      value={
        <InlineSelect
          value={renter.hasPets}
          options={petsOptions}
          canEdit={canEdit}
          onSave={(next) => savePets(next as 'no' | 'cat' | 'dog')}
          presentation="auto"
        />
      }
    />

    {/* Дети — селект «да/нет» */}
    <InfoCard
      icon={Baby}
      label={t('renterCard:kids')}
      colorClass="text-pink-500"
      value={
        <InlineSelect
          value={renter.hasKids}
          options={yesNoOptions}
          canEdit={canEdit}
          onSave={(next) => saveKids(next as 'no' | 'yes')}
          presentation="auto"
        />
      }
    />

    {/* Курение — селект «да/нет» */}
    <InfoCard
      icon={Cigarette}
      label={t('renterCard:smoking')}
      colorClass="text-red-500"
      value={
        <InlineSelect
          value={renter.smoking}
          options={yesNoOptions}
          canEdit={canEdit}
          onSave={(next) => saveSmoking(next as 'no' | 'yes')}
          presentation="auto"
        />
      }
    />
  </div>
</div>
        </div>

        {/* CTA */}
        <div className="flex justify-center pt-8">
          <Button
            onClick={() => router.push(`/messages?userId=${renter.uid}`)}
            className="px-6 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
          >
            💬 {t('renterCard:contact')}
          </Button>
        </div>
      </div>
    </div>
  );
}

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface InfoCardProps {
  icon: IconType;
  label: string;
  value: React.ReactNode;
  colorClass: string;
}

function InfoCard({ icon: Icon, label, value, colorClass }: InfoCardProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl bg-white/5 p-3 shadow-sm backdrop-blur-sm',
        'border border-white/10'
      )}
    >
      {/* prevent icon shrinking on mobile */}
      <div className="flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-white/10 bg-background/60">
        <Icon className={cn('h-5 w-5', colorClass)} />
      </div>

      <div className="text-sm leading-tight min-w-0">
        <p className="text-muted-foreground">{label}</p>
        {/* ⬇️ НЕ p, чтобы можно было рендерить редакторы с div внутри */}
        <div className="font-medium text-foreground break-words [&_p]:m-0">
          {value}
        </div>
      </div>
    </div>
  );
}
