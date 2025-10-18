'use client';

import ModeToggle from '@/app/components/ui/ThemeToggle';
import { AuthForm } from '@/app/components/forms/AuthForm';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/app/components/ui/LanguageSwitcher';

export default function LoginPage() {
  const { t } = useTranslation('login'); // <- используем namespace "login"

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background transition-colors px-4">
      {/* Верхняя панель: переключатель темы + языков */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageSwitcher />
        <ModeToggle />
      </div>

      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">
            {t('title')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('description')}
          </p>
        </div>

        <AuthForm /> {/* уже локализован через namespace "auth" */}

        {/* Магическая карточка уведомления */}
        <div className="mt-4 p-4 rounded-xl border border-orange-400 bg-orange-50 dark:bg-orange-900 dark:border-orange-700 text-left shadow-md">
          <h2 className="text-lg font-bold text-orange-600 dark:text-orange-300 mb-2">
            {t('magicTitle')}
          </h2>
          <p className="text-sm text-orange-800 dark:text-orange-200">
            {t('magicText')}
          </p>
        </div>
      </div>
    </div>
  );
}
