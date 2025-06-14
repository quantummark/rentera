'use client';

import ModeToggle from '@/app/components/ui/ThemeToggle';
import { AuthForm } from '@/app/components/forms/AuthForm';
import { LanguageSwitcher } from '@/app/components/ui/LanguageSwitcher'
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const translations = {
  ru: {
    title: 'Пожалуйста, войдите',
    description: 'Для полноценного использования платформы авторизуйтесь — откроется доступ ко всем функциям.',
  },
  en: {
    title: 'Please sign in',
    description: 'To fully use the platform, please sign in — all features will become available.',
  },
  ua: {
    title: 'Будь ласка, увійдіть',
    description: 'Щоб повністю використовувати платформу, авторизуйтесь — всі функції стануть доступні.',
  },
};

export default function LoginPage() {
  const [language, setLanguage] = useState<'ru' | 'en' | 'ua'>('ru');
  const { title, description } = translations[language];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background transition-colors px-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="flex gap-1">
          {(['ru', 'en', 'ua'] as const).map((lang) => (
            <Button
              key={lang}
              variant={language === lang ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLanguage(lang)}
            >
              {lang.toUpperCase()}
            </Button>
          ))}
        </div>
        <ModeToggle />
      </div>

      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        <AuthForm language={language} />
      </div>
    </div>
  );
}
