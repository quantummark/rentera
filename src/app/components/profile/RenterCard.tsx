'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Calendar, PawPrint, Baby, Briefcase, Wallet, Cigarette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Timestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';

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

  const petsText = useMemo(() => {
    switch (renter.hasPets) {
      case 'cat':
        return t('renterCard:cat');
      case 'dog':
        return t('renterCard:dog');
      default:
        return t('renterCard:noPets');
    }
  }, [renter.hasPets, t]);

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
            <h2 className="text-2xl font-semibold text-foreground">{renter.fullName}</h2>

            <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground md:justify-start">
              <MapPin className="h-4 w-4 shrink-0 text-orange-500" />
              {t('renterCard:locationSince', {
                city: renter.city,
                date: formatDateLocalized(renter.createdAt, i18n.language),
              })}
            </p>

            <div className="max-w-prose pt-2 text-base text-foreground">
              <p className="leading-relaxed">{renter.bio || t('renterCard:noBio')}</p>
            </div>
          </div>

          {/* Center column — avatar (always centered) */}
          <div className="flex items-center justify-center">
            {renter.profileImageUrl ? (
              <Image
                src={renter.profileImageUrl}
                alt={renter.fullName}
                width={164}
                height={164}
                className="h-[164px] w-[164px] rounded-full border object-cover shadow-md"
                priority
              />
            ) : (
              <div
                className="flex h-[164px] w-[164px] items-center justify-center rounded-full border border-white/10 bg-muted text-2xl font-bold"
                aria-label={renter.fullName}
              >
                {renter.fullName?.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          {/* Right column — parameters */}
          <div>
            <h3 className="mb-3 text-base font-semibold text-foreground">🧾 {t('renterCard:parameters')}</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoCard
                icon={Calendar}
                label={t('renterCard:rentDuration')}
                value={renter.rentDuration}
                colorClass="text-indigo-500"
              />
              <InfoCard
                icon={Wallet}
                label={t('renterCard:budget')}
                value={`$${renter.budgetFrom}–${renter.budgetTo}`}
                colorClass="text-emerald-500"
              />
              <InfoCard
                icon={Briefcase}
                label={t('renterCard:occupation')}
                value={renter.occupation}
                colorClass="text-blue-500"
              />
              <InfoCard icon={PawPrint} label={t('renterCard:pets')} value={petsText} colorClass="text-amber-500" />
              <InfoCard
                icon={Baby}
                label={t('renterCard:kids')}
                value={renter.hasKids === 'yes' ? t('common:yes') : t('common:no')}
                colorClass="text-pink-500"
              />
              <InfoCard
                icon={Cigarette}
                label={t('renterCard:smoking')}
                value={renter.smoking === 'yes' ? t('common:yes') : t('common:no')}
                colorClass="text-red-500"
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
  value: string | number;
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
      <div className="leading-tight">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
