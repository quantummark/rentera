'use client';

import { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import AgreementStatus from './AgreementStatus';
import AgreementForm from './AgreementForm';
import AgreementDocuments from './AgreementDocuments';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { useAgreement, AgreementStatus as AgreementStatusType } from '@/hooks/useAgreement';
import { useUserTypeWithProfile } from '@/hooks/useUserType';

interface AgreementTabsProps {
  agreementId: string;
  userType: 'owner' | 'renter';
  onUpdateStatus: (status: AgreementStatusType) => Promise<void>;
}

export default function AgreementTabs({ agreementId, onUpdateStatus }: AgreementTabsProps) {
  const [userType] = useUserTypeWithProfile();
  const { agreement, loading } = useAgreement(agreementId);

  const [activeTab, setActiveTab] = useState<'status' | 'form' | 'documents'>('status');

  if (loading) return <div>Загрузка...</div>;
  if (!agreement) return <div>Договор не найден</div>;

  // Преобразуем createdAt в ISO string для AgreementStatus
  const requestDate = agreement.createdAt
    ? agreement.createdAt instanceof Timestamp
      ? agreement.createdAt.toDate().toISOString()
      : new Date(agreement.createdAt).toISOString()
    : new Date().toISOString();

  // Безопасный доступ к owner/renter
  const ownerId = agreement.owner?.id || '';
  const renterId = agreement.renter?.id || '';

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'status' | 'form' | 'documents')} className="space-y-4">
        <TabsList className="bg-muted rounded-xl p-1 flex gap-1">
          <TabsTrigger
            value="status"
            className="flex-1 text-center rounded-lg data-[state=active]:bg-primary data-[state=active]:!text-orange-500 transition"
          >
            Статус
          </TabsTrigger>
          <TabsTrigger
            value="form"
            className="flex-1 text-center rounded-lg data-[state=active]:bg-primary data-[state=active]:text-orange-500 transition"
          >
            Подписание договора
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="flex-1 text-center rounded-lg data-[state=active]:bg-primary data-[state=active]:text-orange-500 transition"
          >
            Мои документы
          </TabsTrigger>
        </TabsList>

        {/* Вкладка "Статус" */}
        <TabsContent value="status">
  {(userType === 'owner' || userType === 'renter') && agreement ? (
    <AgreementStatus
      agreementId={agreementId} // передаем только id
      userType={userType}        // роль текущего пользователя
    />
  ) : (
    <p className="text-center py-4">Загрузка данных...</p>
  )}
</TabsContent>

        {/* Вкладка "Подписание договора" */}
<TabsContent value="form">
  {(userType === 'owner' || userType === 'renter') ? (
    <AgreementForm
      agreementId={agreementId}
    />
  ) : (
    <p className="text-center py-4">Нет доступа к форме</p>
  )}
</TabsContent>

        {/* Вкладка "Мои документы" */}
        <TabsContent value="documents">
  <AgreementDocuments
    ownerId={ownerId || ''}
    renterId={renterId || ''}
  />
</TabsContent>
      </Tabs>
    </div>
  );
}
