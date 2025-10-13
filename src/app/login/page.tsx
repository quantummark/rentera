'use client';

import ModeToggle from '@/app/components/ui/ThemeToggle';
import { AuthForm } from '@/app/components/forms/AuthForm';
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

  {/* ===== Магическая карточка уведомления ===== */}
  <div className="mt-4 p-4 rounded-xl border border-orange-400 bg-orange-50 dark:bg-orange-900 dark:border-orange-700 text-left shadow-md">
    <h2 className="text-lg font-bold text-orange-600 dark:text-orange-300 mb-2">
      Магия аренды включена 🔮
    </h2>
    <p className="text-sm text-orange-800 dark:text-orange-200">
      Агентов сюда не пустим — их чары слишком коварны. Только владельцы и жильцы с чистым сердцем! Попробуете пройти без разрешения — превратим ваш аккаунт в кота 🐱… шучу, но магия следит!
    </p>
  </div>
</div>
    </div>
  );
}
