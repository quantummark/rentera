'use client';

import { useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import app from '@/app/firebase/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FcGoogle } from 'react-icons/fc';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';

type Language = 'ru' | 'en' | 'ua';

interface AuthFormProps {
  language: Language;
}

export const AuthForm = ({ language }: AuthFormProps) => {
  const auth = getAuth(app);
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const texts = {
    ru: {
      email: 'Электронная почта',
      password: 'Пароль',
      signIn: 'Войти',
      register: 'Зарегистрироваться',
      toggleToRegister: 'Нет аккаунта? Зарегистрироваться',
      toggleToSignIn: 'Уже есть аккаунт? Войти',
      googleSignIn: 'Войти через Google',
    },
    en: {
      email: 'Email',
      password: 'Password',
      signIn: 'Sign In',
      register: 'Register',
      toggleToRegister: "Don't have an account? Register",
      toggleToSignIn: 'Already have an account? Sign in',
      googleSignIn: 'Sign in with Google',
    },
    ua: {
      email: 'Електронна пошта',
      password: 'Пароль',
      signIn: 'Увійти',
      register: 'Зареєструватися',
      toggleToRegister: 'Немає акаунта? Зареєструватися',
      toggleToSignIn: 'Вже є акаунт? Увійти',
      googleSignIn: 'Увійти через Google',
    },
  };

  const t = texts[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        router.push('/select-role');
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        const ownerDocRef = doc(db, 'owner', uid);
        const renterDocRef = doc(db, 'renter', uid);
        const [ownerSnap, renterSnap] = await Promise.all([
          getDoc(ownerDocRef),
          getDoc(renterDocRef),
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
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const uid = userCredential.user.uid;

      const ownerDocRef = doc(db, 'owner', uid);
      const renterDocRef = doc(db, 'renter', uid);
      const [ownerSnap, renterSnap] = await Promise.all([
        getDoc(ownerDocRef),
        getDoc(renterDocRef),
      ]);

      if (ownerSnap.exists()) {
        router.push(`/profile/owner/${uid}`);
      } else if (renterSnap.exists()) {
        router.push(`/profile/renter/${uid}`);
      } else {
        router.push('/select-role');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="bg-card p-6 rounded-xl shadow-md space-y-6 w-full">
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-left block">
            {t.email}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={t.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-left block">
            {t.password}
          </Label>
          <Input
            id="password"
            type="password"
            placeholder={t.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" className="w-full bg-orange-400 hover:bg-orange-500 text-white">
          {isRegistering ? t.register : t.signIn}
        </Button>
      </form>

      <div className="text-center">
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-sm text-blue-600 hover:underline"
        >
          {isRegistering ? t.toggleToSignIn : t.toggleToRegister}
        </button>
      </div>

      <div className="border-t pt-4">
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 justify-center"
          onClick={handleGoogleSignIn}
        >
          <FcGoogle size={20} />
          {t.googleSignIn}
        </Button>
      </div>
    </div>
  );
};
