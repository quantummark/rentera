'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// импортируем модули, но подключаем их к i18n только в браузере
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

if (!i18n.isInitialized) {
  i18n.use(initReactI18next);

  // Эти плагины завязаны на window/cookie/localStorage.
  if (typeof window !== 'undefined') {
    i18n.use(HttpApi).use(LanguageDetector);
  }

  i18n.init({
    // Совет: официальный код украинского — 'uk'. Если не критично, лучше перейти на 'uk'
    supportedLngs: ['uk', 'ru', 'en'],
    lng: 'uk',
    fallbackLng: 'uk',
    ns: ['common'],
    defaultNS: 'common',
    backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
    detection: {
      // если не используешь локаль в URL, убери 'path', оставь cookie/localStorage/navigator
      order: ['cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie'],
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    debug: false,
  });
}

export default i18n;
