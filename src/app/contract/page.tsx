'use client';

import { useUserTypeWithProfile } from '@/hooks/useUserType';
import { useContracts, AgreementType } from '@/hooks/useContracts';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Clock, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ContractsLanding() {
  const [userType] = useUserTypeWithProfile();
  const { contracts, loading } = useContracts();
  const { t } = useTranslation(['contracts', 'common']);

  const { deleteContract } = useContracts(); // предполагаем, что есть такой хук
const handleDeleteContract = (id: string) => {
  if (confirm(t('contracts:deleteConfirmation'))) {
    deleteContract(id);
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
    <div className="max-w-4xl mx-auto p-4 space-y-6">
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
  const isPaid = c.isPaid ?? false; // предполагаем, что поле isPaid есть в объекте договора
  const otherUserName = isOwner ? c.renterName : c.ownerName;
  const otherUserAvatar = isOwner ? c.renterAvatar : c.ownerAvatar;

  // Цвет и иконка статуса
  const statusColor =
    c.status === 'active'      ? 'text-green-600' :
    c.status === 'declined'    ? 'text-red-600' :
    c.status === 'pending'     ? 'text-yellow-500' :
    c.status === 'signed'      ? (isPaid ? 'text-green-600' : 'text-green-600') :
    'text-gray-500';

  const statusIcon =
    c.status === 'active'      ? <CheckCircle className="inline w-5 h-5 mr-1" /> :
    c.status === 'declined'    ? <XCircle className="inline w-5 h-5 mr-1" /> :
    c.status === 'pending'     ? <Clock className="inline w-5 h-5 mr-1" /> :
    c.status === 'signed'      ? (isPaid ? <Check className="inline w-5 h-5 mr-1" /> : <Check className="inline w-5 h-5 mr-1" />) :
    null;

  return (
    <div
      key={c.id}
      className="flex flex-col md:flex-row border rounded-xl p-4 hover:shadow-md transition gap-4 items-center"
    >
      {/* Фото объекта */}
      {c.listingImageUrl && (
        <img
          src={c.listingImageUrl}
          alt={c.title}
          className="w-28 h-20 object-cover rounded-lg"
        />
      )}

      <div className="flex-1 flex flex-col gap-2">
        {/* Название объекта */}
        <p className="font-semibold text-lg">{c.title || t('common:untitled')}</p>

        {/* Другой пользователь */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {otherUserAvatar && (
              <img
                src={otherUserAvatar}
                alt={otherUserName}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-sm font-medium">{otherUserName}</span>
          </div>

          {/* Ссылка на профиль */}
          <Link
            href={isOwner ? `/profile/renter/${c.renterId}` : `/profile/owner/${c.ownerId}`}
            className="text-sm text-black-500 hover:underline"
          >
            {t('common:goToProfile')}
          </Link>
        </div>

        {/* Статус */}
        <p className={`flex items-center text-sm font-medium ${statusColor}`}>
          {statusIcon} {c.status.toUpperCase()}
        </p>

        {/* Дата запроса */}
        <p className="text-sm text-muted-foreground">
          {t('contracts:requestDate')} {c.requestDate ? new Date(c.requestDate).toLocaleDateString() : '-'}
        </p>
      </div>

      {/* Действия */}
      <div className="flex flex-col gap-2 md:justify-end">
        <div className="flex flex-wrap gap-2">
          {/* Кнопка Перейти к договору */}
          <Link href={`/contract/${c.id}`}>
            <Button
              size="sm"
              className="text-orange-600 border border-orange-300 bg-orange-50 hover:bg-orange-100"
            >
              {t('contracts:goToContract')}
            </Button>
          </Link>

          {isRenter && c.status === 'signed' && !isPaid && (
  <div className="relative inline-block">
    {/* Пульсирующее кольцо */}
    <span
      className={`
        absolute inset-0
        rounded-full
        bg-green-300/50
        animate-[ping_3s_infinite]
      `}
    />

    {/* Ваша кнопка поверх анимации */}
    <Button
      size="sm"
      className={`
        relative
        text-green-600 border border-green-300 bg-green-50
        hover:bg-green-100
        transition
      `}
      onClick={() => alert('Запускаем процесс оплаты…')}
    >
      {t('contracts:pay')}
    </Button>
  </div>
)}

          {/* Кнопка Удалить */}
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteContract(c.id)}
            className="text-red-600 border border-red-300 bg-red-50 hover:bg-red-100"
          >
            {t('contracts:delete')}
          </Button>
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
