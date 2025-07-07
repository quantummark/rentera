'use client';

import { useEffect } from 'react';

export default function ScrollbarFixer() {
  useEffect(() => {
    const body = document.body;

    const observer = new MutationObserver(() => {
      if (body.style.overflow === 'hidden') {
        body.style.overflow = 'scroll';
        body.style.paddingRight = '0px';
      }
    });

    observer.observe(body, {
      attributes: true,
      attributeFilter: ['style'],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
