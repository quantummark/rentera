'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Home } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/app/firebase/firebase'; // ✅ импорт auth из firebase.ts

const roles = [
  {
    key: 'owner',
    title: 'Владелец жилья',
    description: 'Сдавайте жильё, управляйте объявлениями и получайте доход.',
    icon: <Building2 className="w-8 h-8 text-orange-500" />,
  },
  {
    key: 'renter',
    title: 'Арендатор',
    description: 'Ищите жильё, бронируйте онлайн и живите комфортно.',
    icon: <Home className="w-8 h-8 text-orange-500" />,
  },
] as const;

type RoleKey = (typeof roles)[number]['key'];

const roleRoutes: Record<RoleKey, string> = {
  owner: '/owner-setup',
  renter: '/renter-setup',
};

const SelectRolePage = () => {
  const router = useRouter();

  const handleSelect = async (role: RoleKey) => {
    const user = auth.currentUser; // ✅ используем auth из центра

    if (!user) {
      alert('Вы должны быть авторизованы, чтобы выбрать роль.');
      return;
    }

    const roleCollection = role === 'owner' ? 'owner' : 'renter';

    try {
      await setDoc(doc(db, roleCollection, user.uid), {
        email: user.email,
        createdAt: serverTimestamp(),
      });

      router.push(roleRoutes[role]);
    } catch (error) {
      console.error('Ошибка при сохранении роли:', error);
      alert('Не удалось сохранить роль. Попробуйте позже.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background transition-colors space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl sm:text-3xl font-bold text-foreground text-center"
      >
        Выберите, что вы хотите делать на платформе
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 sm:grid-cols-2 w-full max-w-4xl"
      >
        {roles.map((role) => (
          <motion.div
            key={role.key}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer"
            onClick={() => handleSelect(role.key)}
          >
            <Card className="h-full shadow-md hover:shadow-lg transition-shadow bg-card">
              <CardContent className="flex flex-col gap-4 items-start p-6">
                <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full">
                  {role.icon}
                </div>
                <h3 className="text-xl font-semibold">{role.title}</h3>
                <p className="text-muted-foreground">{role.description}</p>
                <Button variant="outline" className="mt-2">
                  Выбрать
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SelectRolePage;