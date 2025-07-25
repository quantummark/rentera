'use client';

import { Button } from '@/components/ui/button';

export default function OwnerListingControls() {
  return (
    <div className="flex gap-2">
      <Button variant="outline" className="text-orange-600 border-orange-300 hover:bg-orange-100">
        Просмотреть
      </Button>
      <Button variant="outline" className="text-orange-600 border-orange-300 hover:bg-orange-100">
        Редактировать
      </Button>
      <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-100">
        Удалить
      </Button>
    </div>
  );
}
