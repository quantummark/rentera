'use client';

import { useParams } from 'next/navigation';
import { useUserTypeWithProfile } from '@/hooks/useUserType';
import { useAgreement } from '@/hooks/useAgreement';
import AgreementTabs from '@/app/components/Contract/AgreementTabs';
import { useTranslation } from 'react-i18next';

export default function AgreementPage() {
  // получаем id напрямую из URL
  const params = useParams();
  const agreementId = params?.id as string;
  const { t } = useTranslation(['contracts', 'common']);

  const [userType] = useUserTypeWithProfile();
  const { agreement, loading, updateAgreement } = useAgreement(agreementId);

  if (loading || !userType) return <div>{t('common:loading')}</div>;
  if (!agreement)         return <div>{t('contracts:notFound')}</div>;

  return (
    <div className="w-full max-w-full sm:max-w-5xl mx-auto px-2 sm:px-4 space-y-6">
  {/* Информационный баннер */}
  <div className="rounded-xl
    border border-gray-300
    bg-white/5
    backdrop-blur-sm
    px-4 py-3">
    {/* Внутренние паддинги чуть меньше на мобилках */}
    <div className="px-4 py-3 sm:px-6 sm:py-4">
      <h1 className="text-lg sm:text-1xl font-bold mb-2 text-foreground dark:text-white">
        {t('contracts:title')}
      </h1>
      <p className="text-sm sm:text-base text-foreground/70 dark:text-white/70">
        {t('contracts:description')}
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
