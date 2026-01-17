'use client';

import { useTranslation } from 'react-i18next';

import SupportTopicLayout from '../components/SupportTopicLayout';
import SupportTips from '../components/SupportTips';
import TawkChatEmbed from '../components/TawkChatEmbed';

const CHAT_URLS: Record<'uk' | 'ru' | 'en', string> = {
  uk: 'https://tawk.to/chat/69696112a64fd4198079898c/1jf1q6cli', // UA
  ru: 'https://tawk.to/chat/6969637c6c89d8197d3cd7eb/1jf1qp8as', // RU
  en: 'https://tawk.to/chat/696965d3c03c961980f01449/1jf1rbh1n'  // EN
};

function normalizeLang(lang: string): 'uk' | 'ru' | 'en' {
  const l = (lang || '').toLowerCase();

  if (l === 'ua' || l.startsWith('uk')) return 'uk';
  if (l.startsWith('ru')) return 'ru';
  if (l.startsWith('en')) return 'en';

  return 'uk';
}

export default function IdeaPage() {
  const { t, i18n } = useTranslation(['support']);

  const lang = normalizeLang(i18n.language);
  const chatUrl = CHAT_URLS[lang];

  return (
    <SupportTopicLayout
      title={t('support:ideaPage.title', 'Запропонувати ідею')}
      subtitle={t(
        'support:ideaPage.subtitle',
        'Маєте думку, як зробити Rentera кращою? Напишіть нам — ми уважно читаємо всі пропозиції.'
      )}
    >
      <SupportTips
        items={[
          t('support:ideaPage.tips.1', 'Що саме ви хочете покращити?'),
          t('support:ideaPage.tips.2', 'Чому це важливо або зручно для користувачів?'),
          t(
            'support:ideaPage.tips.3',
            'Як ви уявляєте це в реальному використанні?'
          )
        ]}
      />

      <TawkChatEmbed key={lang} chatUrl={chatUrl} />
    </SupportTopicLayout>
  );
}
