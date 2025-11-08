// utils/date.ts

/** UI-поддерживаемые локали */
export type UILocale = 'en' | 'uk' | 'ru';

/** Минимальный интерфейс для Firestore Timestamp-подобных значений */
export interface TimestampLike {
  toDate: () => Date;
}

/** Допустимый вход для дат */
export type DateInput =
  | Date
  | number
  | string
  | TimestampLike
  | { seconds: number; nanoseconds: number }
  | null
  | undefined;

/** Внутренние type guards */
function isTimestampLike(x: unknown): x is TimestampLike {
  return !!x && typeof (x as { toDate: unknown }).toDate === 'function';
}
function isSecNanosLike(x: unknown): x is { seconds: number; nanoseconds: number } {
  return (
    !!x &&
    typeof (x as { seconds: unknown }).seconds === 'number' &&
    typeof (x as { nanoseconds: unknown }).nanoseconds === 'number'
  );
}

/** Нормализуем вход в Date (возвращает null, если дата невалидна/отсутствует) */
export function normalizeDate(input: DateInput): Date | null {
  if (input == null) return null;

  if (input instanceof Date) return Number.isNaN(input.getTime()) ? null : input;

  if (typeof input === 'number') {
    const d = new Date(input);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  if (typeof input === 'string') {
    const ms = Date.parse(input);
    if (Number.isNaN(ms)) return null;
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  if (isTimestampLike(input)) {
    const d = input.toDate();
    return Number.isNaN(d.getTime()) ? null : d;
  }

  if (isSecNanosLike(input)) {
    const d = new Date(input.seconds * 1000 + Math.floor(input.nanoseconds / 1_000_000));
    return Number.isNaN(d.getTime()) ? null : d;
  }

  return null;
}

/** Сравнение «тот же день» — безопасно к null */
export function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** «Вчера» относительно now — безопасно к null */
export function isYesterday(date: Date | null | undefined, now: Date = new Date()): boolean {
  if (!date) return false;
  const startOf = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x.getTime();
  };
  const d0 = startOf(date);
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  const y0 = startOf(y);
  return d0 === y0;
}

/** Ключ дня (YYYY-MM-DD) — безопасно к null (возвращает '') */
export function dayKey(date: Date | null | undefined): string {
  if (!date) return '';
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
  locale?: UILocale;
  t?: (key: string, defaultValue?: string) => string;
  now?: Date;
}

/** Заголовок дня в чате; пустая строка, если дата невалидна */
export function dayLabel(input: DateInput, opts?: DayLabelOptions): string {
  const d = normalizeDate(input);
  if (!d) return '';
  const now = opts?.now ?? new Date();
  const locale = opts?.locale ?? 'ru';

  const todayLabel =
    opts?.t?.('date.today', FALLBACK_LABELS[locale].today) ?? FALLBACK_LABELS[locale].today;
  const yesterdayLabel =
    opts?.t?.('date.yesterday', FALLBACK_LABELS[locale].yesterday) ?? FALLBACK_LABELS[locale].yesterday;

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
  locale?: UILocale;
  use24h?: boolean;
}

/** Время сообщения (HH:mm по умолчанию); пустая строка, если дата невалидна */
export function timeLabel(input: DateInput, opts?: TimeLabelOptions): string {
  const d = normalizeDate(input);
  if (!d) return '';
  const use24h = opts?.use24h ?? true;
  if (use24h) {
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }
  const locale = opts?.locale ?? 'ru';
  return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(d);
}

/** Длинная дата-время; пустая строка, если дата невалидна */
export function longDateTime(input: DateInput, locale: UILocale = 'ru'): string {
  const d = normalizeDate(input);
  if (!d) return '';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/** Приводим строку языка i18next к одной из наших UI-локалей */
export function resolveLocale(i18nLang?: string): UILocale {
  if (!i18nLang) return 'ru';
  const base = i18nLang.split('-')[0].toLowerCase();
  if (base === 'ru') return 'ru';
  if (base === 'uk' || base === 'ua') return 'uk';
  return 'en';
}
