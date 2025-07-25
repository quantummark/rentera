'use client';

import { Button } from '@/components/ui/button';

interface OwnerListingControlsProps {
  listingId: string; // Добавляем пропс listingId
}

export default function OwnerListingControls({ listingId }: OwnerListingControlsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="text-orange-600 border-orange-300 hover:bg-orange-100"
        onClick={() => console.log(`Просмотр листинга с ID: ${listingId}`)}
      >
        Просмотреть
      </Button>
      <Button
        variant="outline"
        className="text-orange-600 border-orange-300 hover:bg-orange-100"
        onClick={() => console.log(`Редактирование листинга с ID: ${listingId}`)}
      >
        Редактировать
      </Button>
      <Button
        variant="outline"
        className="text-red-600 border-red-300 hover:bg-red-100"
        onClick={() => console.log(`Удаление листинга с ID: ${listingId}`)}
      >
        Удалить
      </Button>
    </div>
  );
}
