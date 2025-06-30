'use client';

import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/firebase/firebase';

export function useAuth(options?: { redirectTo?: string; requireAuth?: boolean }) {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  const requireAuth = options?.requireAuth ?? true;
  const redirectTo = options?.redirectTo ?? '/login';

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, requireAuth, redirectTo, router]);

  return { user, loading, error };
}
