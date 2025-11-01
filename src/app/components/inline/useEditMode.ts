'use client';

import { useSearchParams } from 'next/navigation';

export function useEditMode(): boolean {
  const params = useSearchParams();
  return params.get('edit') === '1';
}
