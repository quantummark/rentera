'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Настройки для кнопок табов
const tabsVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary data-[state=active]:bg-primary data-[state=active]:text-white',
  {
    variants: {
      size: {
        default: 'px-4 py-2',
        sm: 'px-3 py-1 text-xs',
        lg: 'px-6 py-3 text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

// ===================================================
// Tabs (контейнер всех табов)
// ===================================================
export const Tabs = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('flex flex-col', className)} {...props} />;
  }
);
Tabs.displayName = 'Tabs';

// ===================================================
// TabsList (контейнер для кнопок)
// ===================================================
export const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('flex border-b border-muted', className)} {...props} />;
  }
);
TabsList.displayName = 'TabsList';

// ===================================================
// TabsTrigger (кнопка таба)
// ===================================================
export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof tabsVariants> {
  value: string;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, size, ...props }, ref) => {
    return <button ref={ref} className={cn(tabsVariants({ size }), className)} {...props} />;
  }
);
TabsTrigger.displayName = 'TabsTrigger';

// ===================================================
// TabsContent (контент таба)
// ===================================================
export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('mt-4', className)} {...props} />;
  }
);
TabsContent.displayName = 'TabsContent';
