// components/ui/SelectItem.tsx
import React from 'react';

interface SelectItemProps {
  value: string;
  label: string;
  onClick: (value: string) => void;
  isSelected?: boolean;
}

export const SelectItem: React.FC<SelectItemProps> = ({ value, label, onClick, isSelected }) => {
  return (
    <div
      onClick={() => onClick(value)}
      className={`cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
        isSelected ? 'bg-gray-200 dark:bg-gray-800 font-semibold' : ''
      }`}
    >
      {label}
    </div>
  );
};

                 