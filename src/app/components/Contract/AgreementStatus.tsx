'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface AgreementType {
  id: string;
  renterName: string;
  renterAvatar?: string;
  requestDate: string; // ISO string
  status: 'pending' | 'accepted' | 'rejected';
}

interface AgreementStatusProps {
  agreement: AgreementType;
  userType: 'owner' | 'renter';
  onUpdateStatus: (status: 'accepted' | 'rejected') => void;
  agreementId: string;
}

export default function AgreementStatus({ agreement, userType, onUpdateStatus }: AgreementStatusProps) {
  const [status, setStatus] = useState<AgreementType['status']>(agreement.status);
  const statusColors = {
    pending: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
    accepted: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
  };

  const statusIcons = {
    pending: <Clock className="w-5 h-5" />,
    accepted: <CheckCircle2 className="w-5 h-5" />,
    rejected: <XCircle className="w-5 h-5" />,
  };

  const handleStatusChange = (newStatus: 'accepted' | 'rejected') => {
    setStatus(newStatus);
    onUpdateStatus(newStatus);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex items-center justify-between p-4 rounded-xl shadow-md ${statusColors[status]}`}
      >
        <div className="flex items-center gap-3">
          {agreement.renterAvatar && (
            <Image
              src={agreement.renterAvatar}
              alt={agreement.renterName}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-medium">{agreement.renterName}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(agreement.requestDate).toLocaleDateString()} 
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {statusIcons[status]}
          <span className="font-semibold capitalize">{status}</span>
        </div>
      </motion.div>

      {userType === 'owner' && status === 'pending' && (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => handleStatusChange('accepted')}
          >
            <CheckCircle2 className="w-4 h-4 text-green-600" /> Принять
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => handleStatusChange('rejected')}
          >
            <XCircle className="w-4 h-4 text-red-600" /> Отклонить
          </Button>
        </div>
      )}
    </div>
  );
}
