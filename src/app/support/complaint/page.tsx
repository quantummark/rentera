'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import SupportTopicLayout from '../components/SupportTopicLayout';
import SupportTips from '../components/SupportTips';
import ComplaintConfirmBlock from '../components/ComplaintConfirmBlock';
import TawkChatEmbed from '../components/TawkChatEmbed';

const CHAT_URLS: Record<'uk' | 'ru' | 'en', string> = {
  uk: 'https://tawk.to/chat/6962e076aae923197d506cf6/1jel3pk8f', // UA
  ru: 'https://tawk.to/chat/69694e41a64fd419807987bc/1jf1ljck8', // RU
  en: 'https://tawk.to/chat/69695239726a11197a5f9498/1jf1mic6e'  // EN
};

function normalizeLang(lang: string): 'uk' | 'ru' | 'en' {
  const l = (lang || '').toLowerCase();

  if (l === 'ua' || l.startsWith('uk')) return 'uk';
  if (l.startsWith('ru')) return 'ru';
  if (l.startsWith('en')) return 'en';

  return 'uk';
}

export default function ComplaintPage() {
  const { t, i18n } = useTranslation(['support']);
  const [confirmed, setConfirmed] = React.useState(false);

  const lang = normalizeLang(i18n.language);
  const chatUrl = CHAT_URLS[lang];

  return (
    <SupportTopicLayout
      title={t('support:complaintPage.title', 'Поскаржитися')}
      subtitle={t(
        'support:complaintPage.subtitle',
        'Опишіть ситуацію якомога детальніше. Ми розглянемо звернення протягом 24 годин.'
      )}
    >
      <SupportTips
        items={[
          t(
            'support:complaintPage.tips.1',
            'Опишіть, з чим саме виникла проблема'
          ),
          t(
            'support:complaintPage.tips.2',
            'Додайте деталі або приклади, якщо можливо'
          ),
          t(
            'support:complaintPage.tips.3',
            'Надавайте лише достовірну інформацію — це важливо для розгляду звернення'
          )
        ]}
      />

      <ComplaintConfirmBlock
        checked={confirmed}
        onCheckedChange={setConfirmed}
        label={t(
          'support:complaintPage.confirm',
          'Підтверджую, що надам правдиву інформацію і подаю звернення добросовісно.'
        )}
      />

      {confirmed ? (
        <TawkChatEmbed key={lang} chatUrl={chatUrl} />
      ) : null}
    </SupportTopicLayout>
  );
}
