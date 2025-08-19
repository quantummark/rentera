'use client';

import { useParams } from 'next/navigation';
import { useUserTypeWithProfile } from '@/hooks/useUserType';
import { useAgreement } from '@/hooks/useAgreement';
import AgreementTabs from '@/app/components/Contract/AgreementTabs';
import { AgreementStatus } from '@/hooks/useAgreement';

export default function AgreementPage() {
  // получаем id напрямую из URL
  const params = useParams();
  const agreementId = params?.id as string;

  const [userType] = useUserTypeWithProfile();
  const { agreement, loading, updateAgreement } = useAgreement(agreementId);

  if (loading || !userType) return <div>Загрузка...</div>;
  if (!agreement)         return <div>Договор не найден</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
        <h1 className="text-2xl font-bold mb-2">
          Онлайн-договор аренды
        </h1>
        <p>
          На этой странице вы можете просмотреть, заполнить и подписать договор.
        </p>
      </div>

      <AgreementTabs
        agreementId={agreementId}
        userType={userType}
        onUpdateStatus={(status: AgreementStatus) =>
          updateAgreement({ status }, 'updateStatus')
        }
      />
    </div>
  );
}
