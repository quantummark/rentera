import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cn } from '@/lib/utils';

interface CustomToggleProps {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export function CustomToggle({ pressed, onPressedChange, children, className }: CustomToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{children}</span>
      <TogglePrimitive.Root
        pressed={pressed}
        onPressedChange={onPressedChange}
        className={cn(
          'w-10 h-6 rounded-full relative transition-colors border border-border',
          pressed ? 'bg-orange-500' : 'bg-muted',
          className
        )}
      >
        <div
          className={cn(
            'absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform',
            pressed ? 'translate-x-4' : 'translate-x-0'
          )}
        />
      </TogglePrimitive.Root>
    </div>
  );
}
