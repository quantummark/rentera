// app/renter-profile/page.tsx
'use client'; // Этот компонент будет клиентским

import { useQuery } from '@tanstack/react-query'; // Импортируем React Query
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { useAuth } from '@/hooks/useAuth';
import RenterCard from '@/app/components/profile/RenterCard';
import FavoriteListings from '@/app/components/profile/FavoriteListings';
import CommentSection from '@/app/components/comments/CommentSection';
import { Separator } from '@/components/ui/separator';
import { useParams } from 'next/navigation'; // Используем useParams для получения параметров URL
 // Импортируем QueryClientWrapper

interface RenterProfile {
  uid: string;
  fullName: string;
  bio?: string;
  city: string;
  rentDuration: string;
  hasPets: 'no' | 'cat' | 'dog';
  hasKids: 'yes' | 'no';
  smoking: 'yes' | 'no';
  occupation: string;
  budgetFrom: number;
  budgetTo: number;
  profileImageUrl?: string;
  createdAt: any;
}

// Функция для получения данных арендатора
const fetchRenter = async (id: string): Promise<RenterProfile> => {
  const docRef = doc(db, 'renter', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error('Профиль арендатора не найден');
  }
  return docSnap.data() as RenterProfile;
};

export default function RenterProfilePage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();

  // Используем React Query для загрузки данных арендатора
  const { data: renter, isLoading, isError, error } = useQuery({
    queryKey: ['renter', id],  // Ключ запроса
    queryFn: () => fetchRenter(typeof id === 'string' ? id : ''),  // Функция загрузки
    enabled: !!id && !authLoading, // Запускаем запрос только если id есть и аутентификация завершена
  });

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-solid"></div>
      </div>
    );
  }

  if (isError) {
    return <p className="text-center mt-10 text-destructive">{error.message}</p>;
  }

  if (!renter) {
    return <p className="text-center mt-10 text-destructive">Профиль не найден</p>;
  }

  const isrenter = user?.uid === id; // Проверяем, является ли текущий пользователь владельцем профиля

  return (
      <div className="min-h-screen bg-background py-8 px-4 md:px-10 space-y-8">
        <RenterCard renter={renter} renterId={user?.uid || ''} isCurrentUser={isrenter} />
        <Separator className="my-4" />
        <FavoriteListings userId={String(id)} />
        <Separator className="my-4" />
        <CommentSection contextType="renter" contextId={typeof id === 'string' ? id : ''} />
      </div>
  );
}
