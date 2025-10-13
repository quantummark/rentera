'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// ========================
// Variants для кнопок
// ========================
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

// ========================
// Контекст для Tabs
// ========================
interface TabsContextType {
  value: string;
  onValueChange: (val: string) => void;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

const useTabsContext = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
};

// ========================
// Tabs (контейнер всех табов)
// ========================
interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (val: string) => void;
  children: React.ReactNode;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ value, defaultValue, onValueChange, className, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || '');

    const currentValue = value ?? internalValue;

    const handleValueChange = (val: string) => {
      setInternalValue(val);
      onValueChange?.(val);
    };

    return (
      <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
        <div ref={ref} className={cn('flex flex-col', className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = 'Tabs';

// ========================
// TabsList (контейнер кнопок)
// ========================
export const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('flex border-b border-muted', className)} {...props} />;
  }
);
TabsList.displayName = 'TabsList';

// ========================
// TabsTrigger (кнопка таба)
// ========================
export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof tabsVariants> {
  value: string;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, size, value, ...props }, ref) => {
    const { value: activeValue, onValueChange } = useTabsContext();

    const isActive = value === activeValue;

    return (
      <button
        ref={ref}
        className={cn(
          tabsVariants({ size }),
          className,
          isActive ? 'bg-primary text-orange-500' : ''
        )}
        onClick={() => onValueChange(value)}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = 'TabsTrigger';

// ========================
// TabsContent (контент таба)
// ========================
export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: activeValue } = useTabsContext();

    if (value !== activeValue) return null;

    return (
      <div ref={ref} className={cn('mt-4', className)} {...props}>
        {children}
      </div>
    );
  }
);
TabsContent.displayName = 'TabsContent';
