'use client';

import { useState } from 'react';
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

export default function AgreementTabs({ agreementId }: AgreementTabsProps) {
  const [userType] = useUserTypeWithProfile();
  const { agreement, loading } = useAgreement(agreementId);

  const [activeTab, setActiveTab] = useState<'status' | 'form' | 'documents'>('status');

  if (loading) return <div>Загрузка...</div>;
  if (!agreement) return <div>Договор не найден</div>;

  return (
    <div className="w-full px-4 mx-auto">
  {/* На мобилках max-w-full, с >sm — max-w-6xl */}
  <div className="w-full max-w-full sm:max-w-6xl mx-auto">
    <Tabs
      value={activeTab}
      onValueChange={val => setActiveTab(val as 'status' | 'form' | 'documents')}
      className="space-y-4"
    >
      {/* Добавили overflow и w-full */}
      <TabsList className="w-full bg-muted rounded-xl p-1 flex gap-1 overflow-x-auto">
        <TabsTrigger
          value="status"
          className="flex-1 min-w-[100px] text-center rounded-lg data-[state=active]:bg-primary data-[state=active]:!text-orange-500 transition"
        >
          Статус
        </TabsTrigger>
        <TabsTrigger
          value="form"
          className="flex-1 min-w-[120px] text-center rounded-lg data-[state=active]:bg-primary data-[state=active]:text-orange-500 transition"
        >
          Подписание договора
        </TabsTrigger>
        <TabsTrigger
          value="documents"
          className="flex-1 min-w-[120px] text-center rounded-lg data-[state=active]:bg-primary data-[state=active]:text-orange-500 transition"
        >
          Мои документы
        </TabsTrigger>
      </TabsList>

      <TabsContent value="status">
        { (userType === 'owner' || userType === 'renter') && agreement ? (
          <AgreementStatus agreementId={agreementId} userType={userType} />
        ) : (
          <p className="text-center py-4">Загрузка данных...</p>
        )}
      </TabsContent>

      <TabsContent value="form">
        { (userType === 'owner' || userType === 'renter') ? (
          <AgreementForm agreementId={agreementId} />
        ) : (
          <p className="text-center py-4">Нет доступа к форме</p>
        )}
      </TabsContent>

      <TabsContent value="documents">
        <AgreementDocuments />
      </TabsContent>
    </Tabs>
  </div>
</div>
  );
}
