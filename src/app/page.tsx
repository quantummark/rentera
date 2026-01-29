import LandingHero from '@/app/components/landing/LandingHero';
import LandingTrustChips from '@/app/components/landing/LandingTrustChips';
import LandingHowItWorks from '@/app/components/landing/LandingHowItWorks';
import LandingWhyRentera from '@/app/components/landing/LandingWhyRentera';
import LandingDocumentsAndPayments from '@/app/components/landing/LandingDocumentsAndPayments';
import LandingCommunity from '@/app/components/landing/LandingCommunity';
import LandingForOwners from '@/app/components/landing/LandingForOwners';
import LandingFinalCTA from '@/app/components/landing/LandingFinalCTA';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6 sm:gap-10 px-1 sm:px-0">
      <LandingHero />
      <LandingTrustChips />
      <LandingHowItWorks />
      <LandingWhyRentera />
      <LandingDocumentsAndPayments />
      <LandingCommunity />
      <LandingForOwners />
      <LandingFinalCTA />
    </div>
  );
}
