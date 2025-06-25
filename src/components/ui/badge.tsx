// components/ui/badge.tsx
'use client';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode | string;
  variant?: 'default' | 'highlight' | 'subtle';
  className?: string;
}

export default function Badge({
  children,
  icon,
  variant = 'default',
  className,
}: BadgeProps) {
  const baseStyle =
    'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition';
  const variants: Record<string, string> = {
    default: 'bg-muted text-foreground',
    highlight: 'bg-orange-100 text-orange-800',
    subtle: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  };

  return (
    <span className={cn(baseStyle, variants[variant], className)}>
      {icon && <span className="text-sm">{icon}</span>}
      {children}
    </span>
  );
}
