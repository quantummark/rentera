// utils/date.ts

/** UI-поддерживаемые локали */
export type UILocale = 'en' | 'uk' | 'ru';

/** Минимальный интерфейс для Firestore Timestamp-подобных значений */
export interface TimestampLike {
  toDate: () => Date;
}

/** Допустимый вход для дат */
export type DateInput = Date | number | TimestampLike;

/** Нормализуем вход в Date */
export function normalizeDate(input: DateInput): Date {
  if (input instanceof Date) return input;
  if (typeof input === 'number') return new Date(input);
  // Timestamp-like
  return input.toDate();
}

/** Сравнение на "тот же день" (локальное время) */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** "Вчера" относительно now (локально) */
export function isYesterday(date: Date, now: Date = new Date()): boolean {
  const startOf = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x.getTime();
  };
  const d0 = startOf(date);
  const y0 = startOf(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
  return d0 === y0;
}

/** Ключ дня (YYYY-MM-DD) для группировок */
export function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Фолбэки для Today/Yesterday, если t не передали */
const FALLBACK_LABELS: Record<UILocale, { today: string; yesterday: string }> = {
  en: { today: 'Today', yesterday: 'Yesterday' },
  uk: { today: 'Сьогодні', yesterday: 'Вчора' },
  ru: { today: 'Сегодня', yesterday: 'Вчера' },
};

export interface DayLabelOptions {
  /** Локаль для форматирования дат (если не используете i18n.t) */
  locale?: UILocale;
  /** Транслятор из react-i18next: t('date.today'), t('date.yesterday') */
  t?: (key: string, defaultValue?: string) => string;
  /** Точка отсчёта "сейчас" (для тестов/контроля) */
  now?: Date;
}

/**
 * Заголовок дня в чате:
 *  - «Сегодня / Вчора / Yesterday» (через t или фолбэк)
 *  - иначе дата: 12 серп. / 12 Aug / 12 авг. (+ год, если отличается)
 */
export function dayLabel(input: DateInput, opts?: DayLabelOptions): string {
  const d = normalizeDate(input);
  const now = opts?.now ?? new Date();
  const locale = opts?.locale ?? 'ru';

  const todayLabel =
    opts?.t?.('date.today', FALLBACK_LABELS[locale].today) ??
    FALLBACK_LABELS[locale].today;
  const yesterdayLabel =
    opts?.t?.('date.yesterday', FALLBACK_LABELS[locale].yesterday) ??
    FALLBACK_LABELS[locale].yesterday;

  if (isSameDay(d, now)) return todayLabel;
  if (isYesterday(d, now)) return yesterdayLabel;

  const showYear = d.getFullYear() !== now.getFullYear();
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    ...(showYear ? { year: 'numeric' } : {}),
  }).format(d);
}

export interface TimeLabelOptions {
  /** Локаль для Intl при use24h=false */
  locale?: UILocale;
  /** Принудительно 24-часовой формат как в Telegram */
  use24h?: boolean;
}

/**
 * Время сообщения (по умолчанию как в Telegram): HH:mm (24h).
 * Если use24h=false — доверяем системным настройкам через Intl.
 */
export function timeLabel(input: DateInput, opts?: TimeLabelOptions): string {
  const d = normalizeDate(input);
  const use24h = opts?.use24h ?? true;
  if (use24h) {
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }
  const locale = opts?.locale ?? 'ru';
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/** Длинная дата-время для тултипов/деталей */
export function longDateTime(input: DateInput, locale: UILocale = 'ru'): string {
  const d = normalizeDate(input);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/** Утилита: привести строку языка i18next к одной из наших UI-локалей */
export function resolveLocale(i18nLang?: string): UILocale {
  if (!i18nLang) return 'ru';
  const base = i18nLang.split('-')[0].toLowerCase();
  if (base === 'ru') return 'ru';
  if (base === 'uk' || base === 'ua') return 'uk';
  return 'en';
}
