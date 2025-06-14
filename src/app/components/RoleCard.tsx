// components/RoleCard.tsx
'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface RoleCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  onSelect: () => void;
  isSelected?: boolean;
}

export const RoleCard = ({
  title,
  description,
  icon,
  onSelect,
  isSelected = false,
}: RoleCardProps) => {
  return (
    <Card
      onClick={onSelect}
      className={cn(
        'cursor-pointer transition-all border-2 rounded-xl shadow-sm hover:shadow-md',
        isSelected
          ? 'border-orange-500 bg-orange-100 dark:bg-orange-950 dark:border-orange-400'
          : 'border-transparent hover:border-muted bg-muted/30 dark:bg-muted/20'
      )}
    >
      <CardHeader className="flex flex-col items-center space-y-2">
        <div className="text-4xl">{icon}</div>
        <h3 className="text-lg font-semibold text-center">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-center text-muted-foreground px-2">
          {description}
        </p>
        <div className="flex justify-center mt-4">
          <Button
            variant={isSelected ? 'default' : 'outline'}
            className={cn(
              isSelected
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'hover:border-orange-500 hover:text-orange-500'
            )}
          >
            {isSelected ? 'Выбрано' : 'Выбрать'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
