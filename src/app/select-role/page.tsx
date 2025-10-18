'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Home } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/app/firebase/firebase';
import { useTranslation } from 'react-i18next';

const SelectRolePage = () => {
  const router = useRouter();
  const { t } = useTranslation('selectRole'); // <-- namespace

  const roles = [
    {
      key: 'owner',
      title: t('roles.owner.title'),
      description: t('roles.owner.description'),
      icon: <Building2 className="w-8 h-8 text-orange-500" />,
    },
    {
      key: 'renter',
      title: t('roles.renter.title'),
      description: t('roles.renter.description'),
      icon: <Home className="w-8 h-8 text-orange-500" />,
    },
  ] as const;

  const roleRoutes = {
    owner: '/owner-setup',
    renter: '/renter-setup',
  } as const;

  const handleSelect = async (role: 'owner' | 'renter') => {
    const user = auth.currentUser;

    if (!user) {
      alert(t('errors.notAuthorized'));
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
      console.error('Error saving role:', error);
      alert(t('errors.saveFailed'));
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
        {t('title')}
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
                  {t('selectButton')}
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
