'use client';

import { useParams } from 'next/navigation';
import { useUserTypeWithProfile } from '@/hooks/useUserType';
import { useAgreement } from '@/hooks/useAgreement';
import AgreementTabs from '@/app/components/Contract/AgreementTabs';

export default function AgreementPage() {
  // получаем id напрямую из URL
  const params = useParams();
  const agreementId = params?.id as string;

  const [userType] = useUserTypeWithProfile();
  const { agreement, loading, updateAgreement } = useAgreement(agreementId);

  if (loading || !userType) return <div>Загрузка...</div>;
  if (!agreement)         return <div>Договор не найден</div>;

  return (
    <div className="w-full max-w-full sm:max-w-5xl mx-auto px-2 sm:px-4 space-y-6">
  {/* Информационный баннер */}
  <div className="rounded-xl bg-blue-50 dark:bg-blue-900 overflow-hidden">
    {/* Внутренние паддинги чуть меньше на мобилках */}
    <div className="px-4 py-3 sm:px-6 sm:py-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-2 text-foreground dark:text-white">
        Онлайн-договор аренды
      </h1>
      <p className="text-sm sm:text-base text-foreground/70 dark:text-white/70">
        На этой странице вы можете просмотреть, заполнить и подписать договор.
      </p>
    </div>
  </div>

  {/* Табуляция договора */}
  <AgreementTabs
    agreementId={agreementId}
    userType={userType}
    onUpdateStatus={async status => {
      if (updateAgreement) {
        await updateAgreement({ status }, 'updateStatus');
      }
    }}
  />
</div>
  );
}
