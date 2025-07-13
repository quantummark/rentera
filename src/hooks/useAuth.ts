'use client';

import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/firebase/firebase';
import type { User } from 'firebase/auth';

export function useAuth(options?: { redirectTo?: string; requireAuth?: boolean }) {
  const [user, loading, error] = useAuthState(auth) as [User | null, boolean, Error | undefined];
  const router = useRouter();

  const requireAuth = options?.requireAuth ?? false; // ✅ По умолчанию не требует авторизации
  const redirectTo = options?.redirectTo ?? '/login';

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, requireAuth, redirectTo, router]);

  return { user, loading, error };
}
// This hook provides authentication state management using Firebase.
// It handles user state, loading status, and redirects based on authentication requirements.