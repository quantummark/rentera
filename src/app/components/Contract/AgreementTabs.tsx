'use client';

import { useState } from 'react';
import AgreementStatus from './AgreementStatus';
import AgreementForm from './AgreementForm';
import AgreementDocuments from './AgreementDocuments';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { useUserTypeWithProfile } from '@/hooks/useUserType';

interface AgreementTabsProps {
  
  agreementId: string;
  userType: "owner" | "renter";
  onUpdateStatus: (status: any) => Promise<void>;
}

export default function AgreementTabs({ agreementId }: AgreementTabsProps) {
  const [userType] = useUserTypeWithProfile();
  const [activeTab] = useState<'status' | 'form' | 'documents'>('status');

  const tabs = [
    { id: 'status', label: 'Статус' },
    { id: 'form', label: 'Подписание договора' },
    { id: 'documents', label: 'Мои документы' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <Tabs defaultValue={activeTab} className="space-y-4">
        <TabsList className="bg-muted rounded-xl p-1 flex gap-1">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex-1 text-center rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="status">
        {userType === 'owner' || userType === 'renter' ? (
        <AgreementStatus
         agreementId={agreementId}
         agreement={{
        id: agreementId,
        renterName: 'Иван Иванов',        // имя арендатора, можно брать из данных
        renterAvatar: '/avatar.png',       // если есть аватар
        requestDate: new Date().toISOString(), // текущая дата для примера
        status: 'pending',                 // статус по умолчанию
      }}
      userType={userType}
      onUpdateStatus={(status) => {
        console.log('Новый статус:', status);
        // Здесь можно обновить статус через хук или Firebase
      }}
      />
        ) : null}
        </TabsContent>

        <TabsContent value="form">
          {(userType === 'owner' || userType === 'renter') ? (
            <AgreementForm
              agreementId={agreementId}
              userType={userType}
              onSubmit={(values, signatures) => {
                // TODO: Implement form submission logic here
                console.log('Form submitted:', values, signatures);
              }}
            />
          ) : null}
        </TabsContent>

        <TabsContent value="documents">
          <AgreementDocuments />
        </TabsContent>
      </Tabs>
    </div>
  );
}
