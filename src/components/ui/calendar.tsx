'use client';

import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as BaseCalendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export function Calendar({
  date,
  onChange,
}: {
  date: Date | null;
  onChange: (date: Date) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex w-full justify-between items-center rounded-md border px-3 py-2 text-sm shadow-sm',
            'hover:bg-accent hover:text-accent-foreground focus:outline-none'
          )}
        >
          {date ? format(date, 'dd.MM.yyyy') : 'Выберите дату'}
          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <BaseCalendar
          date={date || new Date()}
          onChange={(val: Date) => {
        setOpen(false);
        onChange(val);
          }}
          color="#f97316"
        />
      </PopoverContent>
    </Popover>
  );
}
