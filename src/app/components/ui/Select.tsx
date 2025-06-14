'use client';

import { FC, ChangeEvent } from 'react';
import { SelectItem } from './SelectItem';

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
};

export const Select: FC<SelectProps> = ({ name, value, onChange, options }) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700 bg-white text-gray-900"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};
