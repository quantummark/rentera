// components/listing/OwnerListingControls.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { deleteListing } from '@/app/lib/firestore/deleteListing';

interface Props {
  listingId: string;
}

export default function OwnerListingControls({ listingId }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirm = window.confirm('Вы уверены, что хотите удалить объект?');
    if (!confirm) return;

    await deleteListing(listingId);
    router.refresh();
  };

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
