'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import {
  MapPin, Calendar, PawPrint, Baby, Briefcase,
  Wallet, Cigarette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Timestamp } from 'firebase/firestore';

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
  const { t } = useTranslation();
  const router = useRouter();

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp?.toDate) return '';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('ru-RU', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const getPetsText = () => {
    switch (renter.hasPets) {
      case 'cat': return t('renterCard.cat', 'Кошка');
      case 'dog': return t('renterCard.dog', 'Собака');
      default: return t('renterCard.noPets', 'Нет');
    }
  };

  return (
    <div className="max-w-8xl w-full mx-auto bg-card border border-muted rounded-2xl p-6 shadow-sm space-y-6 overflow-visible">
      <div className="text-center">
        <div className="flex flex-col items-center space-y-3">
          {renter.profileImageUrl ? (
            <Image
              src={renter.profileImageUrl}
              alt={renter.fullName}
              width={120}
              height={120}
              className="rounded-full object-cover shadow-sm border"
            />
          ) : (
            <div className="w-[120px] h-[120px] rounded-full bg-muted flex items-center justify-center text-xl font-bold">
              {renter.fullName?.slice(0, 2).toUpperCase()}
            </div>
          )}

          <h2 className="text-2xl font-semibold text-foreground">{renter.fullName}</h2>

          <p className="text-gray-500 text-sm flex items-center gap-1">
            <MapPin className="w-4 h-4 text-orange-500" />
            г. {renter.city} · с нами с {formatDate(renter.createdAt)}
          </p>

          <div className="pt-4 max-w-xl text-base text-center text-foreground">
            <p className="line-clamp-4 leading-relaxed">
              {renter.bio || t('renterCard.noBio', 'Арендатор пока не добавил описание.')}
            </p>
          </div>

          <h3 className="text-base font-semibold text-foreground pt-6 mb-2 text-center w-full">
            🧾 {t('renterCard.parameters', 'Параметры арендатора')}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 justify-center">
            <InfoCard icon={Calendar} label={t('renterCard.rentDuration', 'Срок аренды')} value={renter.rentDuration} color="text-indigo-500" />
            <InfoCard icon={Wallet} label={t('renterCard.budget', 'Бюджет')} value={`$${renter.budgetFrom}–${renter.budgetTo}`} color="text-emerald-500" />
            <InfoCard icon={Briefcase} label={t('renterCard.occupation', 'Занятость')} value={renter.occupation} color="text-blue-500" />
            <InfoCard icon={PawPrint} label={t('renterCard.pets', 'Животные')} value={getPetsText()} color="text-amber-500" />
            <InfoCard icon={Baby} label={t('renterCard.kids', 'Дети')} value={renter.hasKids === 'yes' ? t('yes', 'Да') : t('no', 'Нет')} color="text-pink-500" />
            <InfoCard icon={Cigarette} label={t('renterCard.smoking', 'Курение')} value={renter.smoking === 'yes' ? t('yes', 'Да') : t('no', 'Нет')} color="text-red-500" />
          </div>

          <div className="pt-6">
            <Button
              onClick={() => router.push(`/messages?userId=${renter.uid}`)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 text-sm font-medium"
            >
              💬 {t('renterCard.contact', 'Написать')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
  color
}: {
  icon: React.ComponentType<any>;  // Используем компонент иконки как тип
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-muted p-3 rounded-xl flex items-center gap-3 shadow-sm">
      <Icon className={`w-5 h-5 ${color}`} />
      <div className="text-sm">
        <p className="text-muted-foreground">{label}</p>
        <p className="text-foreground font-medium">{value}</p>
      </div>
    </div>
  );
}
