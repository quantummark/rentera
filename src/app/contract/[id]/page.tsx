'use client';

import { useUserTypeWithProfile } from '@/hooks/useUserType';
import { useAgreement } from '@/hooks/useAgreement';
import AgreementTabs from '@/app/components/Contract/AgreementTabs';
import { AgreementStatus } from '@/hooks/useAgreement';

export default function AgreementPage({ params }: { params: { id: string } }) {
  const { id: agreementId } = params;
  const [userType] = useUserTypeWithProfile();
  const { agreement, loading, updateAgreement } = useAgreement(agreementId);

  if (loading || !userType) return <div>Загрузка...</div>;
  if (!agreement) return <div>Договор не найден</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Вводный блок */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
        <h1 className="text-2xl font-bold mb-2">Онлайн-договор аренды</h1>
        <p>
          На этой странице вы можете просмотреть, заполнить и подписать договор аренды.
          Владелец видит все запросы и может подтвердить аренду, арендатор — статус своего запроса.
        </p>
      </div>

      {/* Основные вкладки */}
      <AgreementTabs
        agreementId={agreementId}
        userType={userType}
        onUpdateStatus={(status: AgreementStatus) => updateAgreement({ status }, 'updateStatus')}
      />
    </div>
  );
}
