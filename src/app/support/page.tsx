// Делаем страницу с информацией о том что страница скоро появится
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

export default function SupportPage() {
    const { t } = useTranslation('common');

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark px-4">
            <h1 className="text-3xl font-bold mb-4">{t('common:comingSoon')} 😉</h1> 
            <p className="text-lg text-center max-w-xl">{t('common:workingOnIt')}</p>
        </div>
    );
}