'use client';

import Image from 'next/image';
import { useState } from 'react';
import { signOut, getAuth } from 'firebase/auth';
import { Mail, MapPin, Phone, Instagram, Send, LogOut, Trash2, Edit, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

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
  isCurrentUser: boolean; // 👈 Новый проп
}

export default function OwnerCard({ owner, isCurrentUser }: OwnerCardProps) {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const formatDate = (timestamp: any) => {
    if (!timestamp?.toDate) return '';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('ru-RU', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="max-w-8xl w-full mx-auto bg-card border border-muted rounded-2xl p-6 shadow-sm space-y-6 overflow-visible">
      <div className="relative text-center">
        {isCurrentUser && (
          <div className="absolute right-0 top-0">
            <Button size="icon" variant="ghost" onClick={() => setShowMenu(!showMenu)}>
              <Settings className="relative z-50" />
            </Button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-56 max-w-[90vw] bg-white shadow-md rounded-lg p-3 z-50 space-y-2 dark:bg-background">
                <Button
                  className="w-full justify-start text-sm"
                  variant="ghost"
                  onClick={() => router.push('/owner-edit')}
                >
                  <Edit className="w-4 h-4 mr-2" /> {t('ownerCard.editProfile', 'Редактировать профиль')}
                </Button>
                <Button className="w-full justify-start text-sm text-red-500" variant="ghost">
                  <Trash2 className="w-4 h-4 mr-2" /> {t('ownerCard.deleteProfile', 'Удалить профиль')}
                </Button>
                <Button
                  className="w-full justify-start text-sm text-muted-foreground"
                  variant="ghost"
                  onClick={() => signOut(getAuth())}
                >
                  <LogOut className="w-4 h-4 mr-2" /> {t('ownerCard.logout', 'Выйти')}
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col items-center space-y-3">
          {owner.profileImageUrl ? (
            <Image
              src={owner.profileImageUrl}
              alt={owner.fullName}
              width={120}
              height={120}
              className="rounded-full object-cover shadow-sm border"
            />
          ) : (
            <div className="w-[120px] h-[120px] rounded-full bg-muted flex items-center justify-center text-xl font-bold">
              {owner.fullName?.slice(0, 2).toUpperCase()}
            </div>
          )}

          <h2 className="text-2xl font-semibold text-foreground">{owner.fullName}</h2>

          <p className="text-gray-500 text-sm flex items-center gap-1">
            <MapPin className="w-4 h-4 text-orange-500" /> г. {owner.city} · с нами с {formatDate(owner.createdAt)}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground pt-2">
            {owner.contactPhone && (
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4 text-green-500" /> {owner.contactPhone}
              </div>
            )}
            {owner.contactEmail && (
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4 text-blue-500" /> {owner.contactEmail}
              </div>
            )}
            {owner.socialLinks.telegram && (
              <a href={owner.socialLinks.telegram} target="_blank" className="flex items-center gap-1">
                <Send className="w-4 h-4 text-sky-500" /> Telegram
              </a>
            )}
            {owner.socialLinks.instagram && (
              <a href={owner.socialLinks.instagram} target="_blank" className="flex items-center gap-1">
                <Instagram className="w-4 h-4 text-pink-500" /> Instagram
              </a>
            )}
          </div>

          <div className="pt-4 max-w-xl text-base text-center text-foreground">
            <p className="line-clamp-4 leading-relaxed">
              {owner.bio || t('ownerCard.noBio', 'Владелец пока не добавил описание.')}
            </p>
          </div>

          {owner.metrics && (
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <Metric label="📦" value={owner.metrics.listingsCount} title={t('ownerCard.listings', 'Объектов')} />
              <Metric label="⭐" value={owner.metrics.averageRating} title={t('ownerCard.rating', 'Рейтинг')} />
              <Metric label="⏱" value={owner.metrics.responseTime} title={t('ownerCard.response', 'Отклик')} />
              <Metric label="📅" value={owner.metrics.completedRentals} title={t('ownerCard.completed', 'Аренд')} />
            </div>
          )}

          <div className="pt-6">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 text-sm font-medium">
              💬 {t('ownerCard.contact', 'Написать')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, title }: { label: string; value: string | number; title: string }) {
  return (
    <div className="rounded-xl bg-muted px-4 py-2 text-sm text-center">
      <p className="text-foreground font-medium">{label} {value}</p>
      <p className="text-muted-foreground text-xs mt-1">{title}</p>
    </div>
  );
}
