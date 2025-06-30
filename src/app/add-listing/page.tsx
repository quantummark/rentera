// app/(dashboard)/owner/add-listing/page.tsx

import ListingForm from '@/app/add-listing/ListingForm';

export default function AddListingPage() {
  return (
    <div className="min-h-screen py-10 px-4 md:px-6 bg-background flex justify-center items-start">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Добавление нового объекта
          </h1>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Заполните информацию о вашем жилье. Это займёт всего пару минут и поможет арендатору лучше понять ваш объект.
          </p>
        </div>

        <ListingForm />
      </div>
    </div>
  );
}
