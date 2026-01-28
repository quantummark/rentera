'use client';

import RentOutHero from './RentOutHero';
import RentOutTrustChips from './RentOutTrustChips';
import RentOutHowItWorks from './RentOutHowItWorks';
import RentOutBenefits from './RentOutBenefits';
import RentOutProtection from './RentOutProtection';
import RentOutRenterProfile from './RentOutRenterProfile';
import RentOutCommunity from './RentOutCommunity';
import RentOutDocumentsAndPayments from './RentOutDocumentsAndPayments';
import RentOutPricing from './RentOutPricing';
import RentOutFinalCTA from './RentOutFinalCTA';

export default function RentOutPage() {
  return (
    <main className="w-full">
      {/* 
        px-1 — мобілка
        sm:px-0 — щоб великі екрани не мали зайвих внутрішніх полів
      */}
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 sm:gap-10 px-1 sm:px-0">
        <RentOutHero />

        <RentOutTrustChips />

        <RentOutHowItWorks />

        <RentOutBenefits />

        <RentOutProtection />

        <RentOutRenterProfile />

        <RentOutCommunity />

        <RentOutDocumentsAndPayments />

        <RentOutPricing />

        <RentOutFinalCTA />
      </div>
    </main>
  );
}
