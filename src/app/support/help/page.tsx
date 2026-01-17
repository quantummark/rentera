'use client';

import { useTranslation } from 'react-i18next';

import SupportTopicLayout from '../components/SupportTopicLayout';
import QuickLinks from '../components/QuickLinks';
import TawkChatEmbed from '../components/TawkChatEmbed';

const CHAT_URLS: Record<'uk' | 'ru' | 'en', string> = {
  uk: 'https://tawk.to/chat/696967a0a7b529197918b3f8/1jf1rpiir', // UA
  ru: 'https://tawk.to/chat/69696988726a11197a5f9598/1jf1s8fpi', // RU
  en: 'https://tawk.to/chat/69696bea0762d91978fe1c55/1jf1sr34q'  // EN
};

function normalizeLang(lang: string): 'uk' | 'ru' | 'en' {
  const l = (lang || '').toLowerCase();

  if (l === 'ua' || l.startsWith('uk')) return 'uk';
  if (l.startsWith('ru')) return 'ru';
  if (l.startsWith('en')) return 'en';

  return 'uk';
}

export default function HelpPage() {
  const { t, i18n } = useTranslation(['support']);

  const lang = normalizeLang(i18n.language);
  const chatUrl = CHAT_URLS[lang];

  return (
    <SupportTopicLayout
      title={t('support:helpPage.title', 'Допомога з платформою')}
      subtitle={t(
        'support:helpPage.subtitle',
        'Спробуйте знайти відповідь нижче — або напишіть нам у чаті, якщо потрібна допомога.'
      )}
    >
      <QuickLinks />

      <div className="rounded-2xl border bg-background/60 p-4 md:p-6 shadow-sm">
        <h2 className="text-base md:text-lg font-semibold">
          {t('support:helpPage.chatTitle', 'Не знайшли відповідь?')}
        </h2>
        <p className="mt-1 text-sm opacity-80 max-w-2xl">
          {t(
            'support:helpPage.chatSubtitle',
            'Опишіть, що саме не виходить — і ми підкажемо, що робити далі.'
          )}
        </p>
      </div>

      <TawkChatEmbed key={lang} chatUrl={chatUrl} />
    </SupportTopicLayout>
  );
}
