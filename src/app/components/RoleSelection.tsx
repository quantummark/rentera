// RoleSelection.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RoleCard } from './RoleCard';
import { Home, User } from 'lucide-react';

const roles = [
  {
    role: 'renter',
    title: 'Я арендатор',
    description: 'Хочу арендовать жильё для жизни или работы',
    icon: <User className="w-8 h-8" />,
  },
  {
    role: 'owner',
    title: 'Я владелец',
    description: 'Хочу сдать жильё в аренду и получать доход',
    icon: <Home className="w-8 h-8" />,
  },
];

export const RoleSelection = () => {
  const router = useRouter();

  const handleSelect = (role: string) => {
    router.push(`/${role}/profile-settings`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Выберите свою роль</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          {roles.map((roleInfo) => (
            <RoleCard
              key={roleInfo.role}
              title={roleInfo.title}
              description={roleInfo.description}
              icon={roleInfo.icon}
              onSelect={() => handleSelect(roleInfo.role)}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

// (RoleCard component moved to its own file: RoleCard.tsx)