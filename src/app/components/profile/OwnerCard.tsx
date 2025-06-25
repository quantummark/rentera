'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { Mail, MapPin, Phone, Instagram, Send, Info } from 'lucide-react';
import Badge from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Pencil } from 'lucide-react';

interface OwnerProfile {
  fullName: string;
  bio: string;
  city: string;
  contactPhone: string;
  contactEmail: string;
  profileImageUrl: string;
  socialLinks: {
    instagram: string;
    telegram: string;
  };
  createdAt: any;
  updatedAt: any;
  metrics?: {
    listingsCount: number;
    completedRentals: number;
    averageRating: number;
    responseTime: string;
  };
}

interface OwnerCardProps {
  owner: OwnerProfile;
}

export default function OwnerCard({ owner }: OwnerCardProps) {
  const { t } = useTranslation();
  const [uid, setUid] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-card border border-muted rounded-2xl p-6 shadow-sm space-y-6">
      {/* Верхний блок */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <Image
          src={owner.profileImageUrl || '/placeholder-avatar.jpg'}
          alt={owner.fullName}
          width={96}
          height={96}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h2 className="text-xl font-bold">{owner.fullName}</h2>
            <Badge variant="highlight">🔥 {t('ownerCard.popularHost', 'Популярный владелец')}</Badge>
          </div>

          {/* Контактная инфа */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
            {owner.city && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{owner.city}</span>
              </div>
            )}
            {owner.contactPhone && (
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>{owner.contactPhone}</span>
              </div>
            )}
            {owner.contactEmail && (
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>{owner.contactEmail}</span>
              </div>
            )}
          </div>

          {/* Описание */}
          <div className="pt-2 text-sm text-foreground flex gap-2 items-start">
            <Info className="w-4 h-4 text-orange-500 mt-0.5" />
            <p className="leading-relaxed">
              {owner.bio || t('ownerCard.noBio', 'Владелец пока не добавил описание.')}
            </p>
          </div>

          {/* Соцсети */}
          <div className="flex justify-center md:justify-start gap-3 pt-2">
            {owner.socialLinks.telegram && (
              <a href={owner.socialLinks.telegram} target="_blank" rel="noopener noreferrer">
                <Send className="w-5 h-5 text-blue-500" />
              </a>
            )}
            {owner.socialLinks.instagram && (
              <a href={owner.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                <Instagram className="w-5 h-5 text-pink-500" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Метрики */}
      {owner.metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title={t('ownerCard.listings', 'Объектов размещено')} value={owner.metrics.listingsCount} />
          <MetricCard title={t('ownerCard.completed', 'Завершённых аренд')} value={owner.metrics.completedRentals} />
          <MetricCard title={t('ownerCard.rating', 'Средняя оценка')} value={`★ ${owner.metrics.averageRating}`} />
          <MetricCard title={t('ownerCard.response', 'Ответ на сообщения')} value={owner.metrics.responseTime} />
        </div>
      )}

      {/* Кнопка редактирования */}
      {uid && (
  <div className="flex justify-end">
    <Button
      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
      onClick={() => router.push('/owner-edit')}
    >
      {t('ownerCard.editProfile', 'Редактировать профиль')}
    </Button>
  </div>
)}
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-muted bg-muted/50 p-4 shadow-sm text-center space-y-1">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="text-base font-bold text-foreground">{value}</p>
    </div>
  );
}