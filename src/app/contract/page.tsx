'use client';

import { useUserTypeWithProfile } from '@/hooks/useUserType';
import { useContracts, AgreementType } from '@/hooks/useContracts';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Clock, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Timestamp } from 'firebase/firestore';

export default function ContractsLanding() {
  const [userType] = useUserTypeWithProfile();
  const { contracts, loading, deleteContract } = useContracts();
  const { t } = useTranslation(['contracts', 'common']);

  const handleDeleteContract = (id: string) => {
    if (confirm(t('contracts:deleteConfirmation'))) {
      deleteContract(id);
    }
  };

  const statusUi = (status?: string) => {
    switch (status) {
      case 'signed':
        return {
          label: t('contracts:status.signed'),
          icon: <Check className="h-4 w-4" />,
          chip: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
        };
      case 'active':
        return {
          label: t('contracts:status.active'),
          icon: <CheckCircle className="h-4 w-4" />,
          chip: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
        };
      case 'pending':
        return {
          label: t('contracts:status.pending'),
          icon: <Clock className="h-4 w-4" />,
          chip: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
        };
      case 'declined':
        return {
          label: t('contracts:status.declined'),
          icon: <XCircle className="h-4 w-4" />,
          chip: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
        };
      default:
        return {
          label: (status ?? '').toUpperCase() || t('contracts:status.unknown'),
          icon: null,
          chip: 'bg-slate-500/10 text-slate-700 border-slate-500/20',
        };
    }
  };

  type DateLike = Date | Timestamp | string | number | null | undefined;

  const fmtDate = (value?: DateLike): string => {
  if (!value) return '-';

  try {
    let date: Date;

    if (value instanceof Date) {
      date = value;
    } else if (value instanceof Timestamp) {
      date = value.toDate();
    } else {
      date = new Date(value);
    }

    if (isNaN(date.getTime())) return '-';

    return date.toLocaleDateString('uk-UA');
  } catch {
    return '-';
  }
};

  if (!userType) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-4">
        <p className="text-lg font-medium text-muted-foreground">
          {t('common:loginPrompt')} 🙂
        </p>
        <Link href="/login">
          <Button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 transition text-white rounded-lg text-sm font-semibold">
            {t('common:login')}
          </Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div
  className="
    min-h-screen
    max-w-5xl
    mx-auto
    px-4 sm:px-6 lg:px-8
    pt-6 pb-16
    space-y-6
  "
>
      <h1 className="text-2xl font-bold">{t('contracts:myContracts')}</h1>

      {contracts.length === 0 ? (
        <div className="text-center py-20 border rounded-xl">
          <p className="mb-4 text-lg">{t('contracts:noActiveContracts')}</p>
          <p className="mb-6 text-sm text-muted-foreground">
            {t('contracts:noActiveContractsDescription')}
          </p>
          <Link href="/search">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 text-sm font-medium">
              {t('contracts:startSearch')}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {contracts.map((c: AgreementType) => {
            const isOwner = userType === 'owner';
            const isRenter = userType === 'renter';
            const isPaid = c.isPaid ?? false;

            const otherUserName = isOwner ? c.renterName : c.ownerName;
            const otherUserAvatar = isOwner ? c.renterAvatar : c.ownerAvatar;
            const profileHref = isOwner
              ? `/profile/renter/${c.renterId}`
              : `/profile/owner/${c.ownerId}`;

            const s = statusUi(c.status);

            const canPay = isRenter && c.status === 'signed' && !isPaid;

            return (
              <div
                key={c.id}
                className="
                  group relative
                  rounded-2xl border border-border/60
                  bg-background
                  p-4 sm:p-5
                  shadow-sm hover:shadow-lg hover:shadow-black/5
                  transition-all
                "
              >
                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                  {/* Фото объекта */}
                  <div className="w-full md:w-[170px] shrink-0">
                    <div className="relative w-full h-[110px] rounded-xl overflow-hidden border border-border/50 bg-muted">
                      {c.listingImageUrl ? (
  <img
    src={c.listingImageUrl}
    alt={c.title || 'Listing'}
    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
    onLoad={() => console.log('✅ IMG loaded:', c.listingImageUrl)}
    onError={(e) => {
      console.log('❌ IMG failed:', c.listingImageUrl);
      console.log('Contract id:', c.id);
      (e.currentTarget as HTMLImageElement).src = '/placeholder.png';
    }}
  />
) : (
  <div className="w-full h-full grid place-items-center text-sm text-muted-foreground">
    {t('contracts:noImage')}
  </div>
)}

                      {/* Статус на фото */}
                      <div className="absolute top-2 left-2">
                        <span
                          className={`
                            inline-flex items-center gap-1.5
                            rounded-full border
                            px-2.5 py-1 text-xs font-semibold
                            backdrop-blur-md
                            ${s.chip}
                          `}
                        >
                          {s.icon}
                          {s.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Контент */}
                  <div className="flex-1 min-w-0">
                    {/* Заголовок */}
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/contract/${c.id}`}
                        className="
                          text-lg sm:text-xl font-bold text-foreground
                          leading-snug
                          hover:underline underline-offset-4
                          line-clamp-1
                        "
                      >
                        {c.title || t('common:untitled')}
                      </Link>

                      {/* Статус справа на ПК (дублируем как «премиум» якорь) */}
                      <span
                        className={`
                          hidden md:inline-flex
                          items-center gap-1.5
                          rounded-full border
                          px-3 py-1.5 text-xs font-semibold
                          backdrop-blur-md
                          ${s.chip}
                        `}
                      >
                        {s.icon}
                        {s.label}
                      </span>
                    </div>

                    {/* Другой пользователь (аватар+имя = ссылка) */}
                    <Link
                      href={profileHref}
                      className="
                        mt-2 inline-flex items-center gap-2
                        max-w-full
                        group/user
                      "
                    >
                      <img
                        src={otherUserAvatar || '/avatar-placeholder.png'}
                        alt={otherUserName || 'User'}
                        className="w-9 h-9 rounded-full object-cover border border-border/60"
                      />
                      <span className="text-sm font-semibold text-foreground truncate group-hover/user:underline underline-offset-4">
                        {otherUserName || t('common:unknownUser')}
                      </span>
                    </Link>

                    {/* Метаданные */}
                    <div className="mt-2 text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                      <span>
                        {t('contracts:requestDate')}{' '}
                        <span className="font-medium text-foreground/80">
                          {fmtDate(c.requestDate)}
                        </span>
                      </span>

                      {c.status === 'signed' && (
                        <span>
                          {t('contracts:paymentStatus')}{' '}
                          <span
                            className={
                              isPaid
                                ? 'font-semibold text-emerald-700'
                                : 'font-semibold text-amber-700'
                            }
                          >
                            {isPaid
                              ? t('contracts:paid')
                              : t('contracts:notPaid')}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Действия */}
                  <div className="md:w-[290px] shrink-0">
                    <div className="flex flex-col gap-2">
                      <Link href={`/contract/${c.id}`} className="w-full">
                        <Button
                          size="sm"
                          className="
                            w-full rounded-xl
                            bg-orange-500/15
                            text-orange-700
                            border border-orange-500/20
                            hover:bg-orange-500/20
                            transition
                          "
                        >
                          {t('contracts:goToContract')}
                        </Button>
                      </Link>

                      {canPay && (
                        <Button
                          size="sm"
                          className="
                            relative w-full rounded-xl
                            bg-emerald-500/15
                            text-emerald-700
                            border border-emerald-500/20
                            hover:bg-emerald-500/20
                            transition
                            shadow-sm
                          "
                          onClick={() => alert('Запускаем процесс оплаты…')}
                        >
                          <span className="pointer-events-none absolute inset-0 rounded-xl bg-emerald-400/10 animate-[pulse_2.5s_ease-in-out_infinite]" />
                          <span className="relative">{t('contracts:pay')}</span>
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteContract(c.id)}
                        className="
                          w-full rounded-xl
                          bg-rose-500/10
                          text-rose-700
                          border border-rose-500/20
                          hover:bg-rose-500/15
                          transition
                        "
                      >
                        {t('contracts:delete')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
