'use client';

import { useState, useMemo } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import app, { db } from '@/app/firebase/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FcGoogle } from 'react-icons/fc';
import { doc, getDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

export const AuthForm = () => {
  const { t } = useTranslation('auth'); // <-- ВАЖНО: неймспейс auth
  const auth = getAuth(app);
  const router = useRouter();

  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const submitLabel = useMemo(
    () => (isRegistering ? t('register') : t('signIn')),
    [isRegistering, t]
  );

  const translateAuthError = (code?: string) => {
    // Мягкая подмена дефолтных ошибок Firebase на локализованные ключи
    // Ключи добавим следующим шагом (auth.errors.*)
    switch (code) {
      case 'auth/invalid-email':
        return t('errors.invalidEmail');
      case 'auth/missing-password':
      case 'auth/weak-password':
        return t('errors.passwordInvalid');
      case 'auth/email-already-in-use':
        return t('errors.emailInUse');
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return t('errors.invalidCredentials');
      case 'auth/popup-closed-by-user':
        return t('errors.popupClosed');
      case 'auth/network-request-failed':
        return t('errors.network');
      default:
        return t('errors.unexpected');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorCode(null);
    setLoading(true);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        router.push('/select-role');
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        const [ownerSnap, renterSnap] = await Promise.all([
          getDoc(doc(db, 'owner', uid)),
          getDoc(doc(db, 'renter', uid)),
        ]);

        if (ownerSnap.exists()) {
          router.push(`/profile/owner/${uid}`);
        } else if (renterSnap.exists()) {
          router.push(`/profile/renter/${uid}`);
        } else {
          router.push('/select-role');
        }
      }
    } catch (err: unknown) {
  if (err && typeof err === 'object' && 'code' in err) {
    const error = err as { code?: string };
    setErrorCode(error.code || 'auth/unexpected');
  } else {
    setErrorCode('auth/unexpected');
  }
} finally {
  setLoading(false);
}
  };

  const handleGoogleSignIn = async () => {
    setErrorCode(null);
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const uid = userCredential.user.uid;

      const [ownerSnap, renterSnap] = await Promise.all([
        getDoc(doc(db, 'owner', uid)),
        getDoc(doc(db, 'renter', uid)),
      ]);

      if (ownerSnap.exists()) {
        router.push(`/profile/owner/${uid}`);
      } else if (renterSnap.exists()) {
        router.push(`/profile/renter/${uid}`);
      } else {
        router.push('/select-role');
      }
    } catch (err: unknown) {
  if (err && typeof err === 'object' && 'code' in err) {
    const error = err as { code?: string };
    setErrorCode(error.code || 'auth/unexpected');
  } else {
    setErrorCode('auth/unexpected');
  }
} finally {
  setLoading(false);
}
  };

  return (
    <div className="bg-card p-6 rounded-xl shadow-md space-y-6 w-full">
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-left block">
            {t('email')}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={t('emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-left block">
            {t('password')}
          </Label>
          <Input
            id="password"
            type="password"
            placeholder={t('passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isRegistering ? 'new-password' : 'current-password'}
            required
          />
        </div>

        {errorCode && (
          <p className="text-red-500 text-sm">
            {translateAuthError(errorCode)}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-400 hover:bg-orange-500 text-white"
        >
          {loading ? t('loading') : submitLabel}
        </Button>
      </form>

      <div className="text-center">
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-sm text-blue-600 hover:underline"
        >
          {isRegistering ? t('toggleToSignIn') : t('toggleToRegister')}
        </button>
      </div>

      <div className="border-t pt-4">
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 justify-center"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <FcGoogle size={20} />
          {t('googleSignIn')}
        </Button>
      </div>
    </div>
  );
};