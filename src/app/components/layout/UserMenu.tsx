'use client';

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { LogOut, Home, PencilLine } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { useUserTypeWithProfile } from '@/hooks/useUserType';
import DropdownMenu from '@/components/ui/DropdownMenu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/firebase/firebase';

export default function UserMenu() {
  const { user } = useAuth();
  const { t } = useTranslation(['menu']);
  const [userType, profile, loading] = useUserTypeWithProfile();

  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  if (!user || loading || !userType || !profile) return null;

  const profileUrl = `/profile/${userType}/${user.uid}`;
  const isOnProfile = pathname?.startsWith(profileUrl);
  const isEdit = params.get('edit') === '1';

  const profileImageUrl = profile.profileImageUrl || '';
  const displayName = profile.fullName || user.displayName || 'User';

  const toggleEdit = () => {
    // Если мы не на странице профиля — переходим на неё с edit=1
    if (!isOnProfile) {
      router.push(`${profileUrl}?edit=1`);
      return;
    }
    // Если уже на профиле — просто переключаем query-параметр edit
    const usp = new URLSearchParams(params.toString());
    if (isEdit) {
      usp.delete('edit');
    } else {
      usp.set('edit', '1');
    }
    router.replace(`${pathname}?${usp.toString()}`);
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('userType');
  };

  return (
    <DropdownMenu
      trigger={
        <Avatar className="h-10 w-10 cursor-pointer border">
          <AvatarImage src={profileImageUrl} alt="avatar" />
          <AvatarFallback>{displayName[0]}</AvatarFallback>
        </Avatar>
      }
    >
      {/* Профиль */}
      <Link href={profileUrl} aria-label={t('menu:profileAria')}>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-4 py-2 text-left text-sm transition hover:ring-1 hover:ring-ring hover:ring-offset-1 hover:ring-offset-background"
        >
          <Home className="h-4 w-4" />
          {t('menu:profile')}
        </button>
      </Link>

      {/* Режим редактирования */}
      <button
        type="button"
        onClick={toggleEdit}
        className="flex w-full items-center gap-2 rounded-md px-4 py-2 text-left text-sm transition hover:ring-1 hover:ring-ring hover:ring-offset-1 hover:ring-offset-background"
        aria-pressed={isEdit}
        aria-label={isEdit ? t('menu:editOffAria') : t('menu:editOnAria')}
        title={isEdit ? t('menu:editOff') : t('menu:editOn')}
      >
        <PencilLine className="h-4 w-4" />
        {isEdit ? t('menu:editOff') : t('menu:editOn')}
      </button>

      {/* Выход */}
      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center gap-2 rounded-md px-4 py-2 text-left text-sm text-red-500 transition hover:ring-1 hover:ring-ring hover:ring-offset-1 hover:ring-offset-background"
      >
        <LogOut className="h-4 w-4" />
        {t('menu:logout')}
      </button>
    </DropdownMenu>
  );
}
