'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useUserTypeWithProfile } from '@/hooks/useUserType';
import { useAgreement, AgreementStatus as AgreementStatusType } from '@/hooks/useAgreement';

interface AgreementStatusProps {
  agreementId: string; // мы передаём id договора, хук подхватит весь объект
  userType: 'owner' | 'renter';
}

export default function AgreementStatus({ agreementId, userType }: AgreementStatusProps) {
  // Хук работы с договором
  const { agreement, respondToRequest } = useAgreement(agreementId);

  const [status, setStatus] = useState<AgreementStatusType>('pending');

  // Участник (для отображения профиля)
  const [, participant, participantLoading] = useUserTypeWithProfile();

  useEffect(() => {
    if (agreement?.status) setStatus(agreement.status);
  }, [agreement?.status]);

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
    active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    declined: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
  };

  const statusIcons = {
    pending: <Clock className="w-5 h-5" />,
    active: <CheckCircle2 className="w-5 h-5" />,
    declined: <XCircle className="w-5 h-5" />,
  };

  const handleStatusChange = async (newStatus: 'active' | 'declined') => {
    if (!respondToRequest) return;
    try {
      await respondToRequest(newStatus);
      setStatus(newStatus);
    } catch (err) {
      console.error('Ошибка обновления статуса договора:', err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex items-center justify-between p-4 rounded-xl shadow-md ${statusColors[status]}`}
      >
        {/* Профиль участника */}
        <div className="flex items-center gap-3">
          {!participantLoading && participant ? (
            <>
              {participant.profileImageUrl && (
                <Image
                  src={participant.profileImageUrl}
                  alt={participant.fullName}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-medium">{participant.fullName || 'Без имени'}</p>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Загрузка данных участника...</p>
          )}
        </div>

        {/* Статус */}
        <div className="flex items-center gap-2">
          {statusIcons[status]}
          <span className="font-semibold capitalize">{status}</span>
        </div>
      </motion.div>

      {/* Кнопки действий для владельца */}
      {userType === 'owner' && status === 'pending' && (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => handleStatusChange('active')}
          >
            <CheckCircle2 className="w-4 h-4 text-green-600" /> Принять
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => handleStatusChange('declined')}
          >
            <XCircle className="w-4 h-4 text-red-600" /> Отклонить
          </Button>
        </div>
      )}
    </div>
  );
}
