import PropertyHero from '@/app/components/property/PropertyHero';
import PropertyInfoBlock from '@/app/components/property/PropertyInfoBlock';
import PropertyDescription from '@/app/components/property/PropertyDescription';
import PropertyRentalTermsBlock from '@/app/components/property/PropertyRentalTermsBlock';

export default function PropertyPage() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-10 space-y-12">
      <PropertyHero />

      {/* Краткая информация */}
      <section>
        <PropertyInfoBlock
          rooms={2}
          area={58}
          floor="3 из 5"
          furnished={true}
          withChildren={true}
          withPets={false}
          smokingAllowed={false}
          longTerm={true}
          amenities={['wifi', 'ac', 'parking', 'heating', 'washer', 'fridge', 'smarttv', 'balcony']}
        />
      </section>

      {/* Описание */}
      <div className="mt-10">
        <PropertyDescription />
      </div>

      {/* Финансовые условия аренды */}
      <div className="mt-10">
<PropertyRentalTermsBlock
  housingType="Квартира"
  insuranceIncluded={true}
  insuranceAmount={10000}
  deposit={20000}
  rentPrice={50000}
/>
      </div>

      {/* Далее пойдут: описание, условия аренды, владелец, отзывы, карта */}
    </div>
  );
}
