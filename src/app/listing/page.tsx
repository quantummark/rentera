import PropertyHero from '@/app/components/property/PropertyHero';
import PropertyInfoBlock from '@/app/components/property/PropertyInfoBlock';

export default function PropertyPage() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-10">
      <PropertyHero />
      
      {/* Далее пойдут блоки: краткая инфа, описание, условия, владелец, отзывы, карта */}
    </div>

    
  );
}