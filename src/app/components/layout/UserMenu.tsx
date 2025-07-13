'use client';

import { useAuth } from '@/hooks/useAuth';
import { useUserTypeWithProfile } from '@/hooks/useUserType';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { LogOut, Home } from 'lucide-react';
import DropdownMenu from '@/components/ui/DropdownMenu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/firebase/firebase';

export default function UserMenu() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [userType, profile, loading] = useUserTypeWithProfile();

  if (!user || loading || !userType || !profile) return null;

  const profileImageUrl = profile.profileImageUrl;
  const displayName = profile.fullName || user.displayName || 'User';

  return (
    <DropdownMenu
      trigger={
        <Avatar className="w-10 h-10 cursor-pointer border">
          <AvatarImage src={profileImageUrl || ''} alt="avatar" />
          <AvatarFallback>{displayName[0]}</AvatarFallback>
        </Avatar>
      }
    >
      <Link href={`/profile/${userType}/${user.uid}`}>
        <button className="w-full text-left px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition flex items-center gap-2">
          <Home className="w-4 h-4" />
          {t('menu.settings', 'Профиль')}
        </button>
      </Link>

      <button
        onClick={() => {
          signOut(auth);
          localStorage.removeItem('userType');
        }}
        className="w-full text-left px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition flex items-center gap-2 text-red-500"
      >
        <LogOut className="w-4 h-4" />
        {t('menu.logout', 'Выйти')}
      </button>
    </DropdownMenu>
  );
}
