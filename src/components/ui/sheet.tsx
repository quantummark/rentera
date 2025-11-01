'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SheetSide = 'top' | 'right' | 'bottom' | 'left';

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

export const SheetPortal = DialogPrimitive.Portal;

export const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function SheetOverlay({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        'fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px]',
        // анимация появления/ухода
        'data-[state=open]:animate-in data-[state=open]:fade-in-0',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        className
      )}
      {...props}
    />
  );
});

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: SheetSide;
  /** Мобильная адаптация: на xs-экранах форсируем bottom-sheet */
  forceBottomOnMobile?: boolean;
}

export const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(function SheetContent(
  { side = 'right', className, children, forceBottomOnMobile = true, ...props },
  ref
) {
  // На мобильных можно форсить вариант 'bottom' — UX привычнее
  const mobileSideClass =
    forceBottomOnMobile
      ? 'max-sm:data-[side=right]:data-[side=bottom] max-sm:data-[side=left]:data-[side=bottom] max-sm:data-[side=top]:data-[side=bottom]'
      : '';

  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        data-side={side}
        className={cn(
          // базовая позиция
          'fixed z-50 grid gap-4 bg-background shadow-lg border',
          'data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:rounded-b-2xl',
          'data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:rounded-t-2xl',
          'data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-80 sm:data-[side=left]:w-96 data-[side=left]:rounded-r-2xl',
          'data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-80 sm:data-[side=right]:w-96 data-[side=right]:rounded-l-2xl',

          // анимации открытия/закрытия
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:duration-200 data-[state=open]:duration-200',
          'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
          'data-[side=bottom]:data-[state=open]:slide-in-from-bottom',
          'data-[side=bottom]:data-[state=closed]:slide-out-to-bottom',
          'data-[side=top]:data-[state=open]:slide-in-from-top',
          'data-[side=top]:data-[state=closed]:slide-out-to-top',
          'data-[side=left]:data-[state=open]:slide-in-from-left',
          'data-[side=left]:data-[state=closed]:slide-out-to-left',
          'data-[side=right]:data-[state=open]:slide-in-from-right',
          'data-[side=right]:data-[state=closed]:slide-out-to-right',

          // размеры для bottom-sheet
          'data-[side=bottom]:max-h-[85vh] data-[side=bottom]:w-full',
          'data-[side=top]:max-h-[85vh] data-[side=top]:w-full',

          // мобильный твик (см. выше)
          mobileSideClass,

          // внутренние отступы
          'p-4',
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className={cn(
            'absolute right-3 top-3 rounded-md p-2 text-foreground/60 transition',
            'hover:text-foreground hover:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-ring'
          )}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </SheetPortal>
  );
});

/** Заголовок/описание/футер как в shadcn */
export const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('space-y-1.5 text-center sm:text-left', className)} {...props} />
);

export const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
      className
    )}
    {...props}
  />
);

export const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function SheetTitle({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn('text-base font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  );
});

export const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function SheetDescription({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
});
