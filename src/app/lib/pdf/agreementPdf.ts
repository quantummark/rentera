// app/lib/pdf/agreementPdf.ts
'use client';

import { PDFDocument, rgb, PageSizes, PDFFont, PDFPage, PDFImage } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { createHash } from 'crypto';

// ====== Типы входных данных ======
export type CurrencyCode = 'UAH' | 'USD' | 'EUR' | 'BTC' | 'ETH' | 'USDT' | 'SOL';

export interface Party {
  fullName: string;
  phone?: string;
  email?: string;
}

export interface Signatures {
  owner?: string;  // dataURL (png)
  renter?: string; // dataURL (png)
}

export interface AgreementPdfData {
  agreementId: string;
  agreementNumber?: string;
  owner: Party;
  renter: Party;
  address: string;
  rentalStart: string | Date;
  rentalEnd: string | Date;
  rentAmount: number;
  currency: CurrencyCode;
  additionalTerms?: string;
  signatures?: Signatures;
  city?: string;
  generatedAt?: Date;
  version?: string; // Версия договора (например "1.0")
}

// Универсальный i18n-геттер
export type TFunc = (key: string, vars?: Record<string, string | number>) => string;

// Опции генерации
export interface AgreementPdfOptions {
  locale: 'ru' | 'uk' | 'en';
  logoUrl?: string;          // PNG логотип для хедера
  fontUrl?: string;          // TTF с кириллицей (по умолчанию OpenSans)
  pageMargin?: number;       // поля страницы (pt)
}

// ====== Публичные API ======
export async function createAgreementPdf(
  data: AgreementPdfData,
  t: TFunc,
  opts: AgreementPdfOptions
): Promise<Uint8Array> {
  const {
    locale,
    logoUrl = '/images/logo.png',
    fontUrl = '/fonts/OpenSans-Regular.ttf',
    pageMargin = 40,
  } = opts;

  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);

  // Шрифт (кириллица/латиница)
  const fontBytes = await fetch(fontUrl).then((r) => r.arrayBuffer());
  const regular = await pdf.embedFont(fontBytes, { subset: true });

  const bold = await pdf.embedFont(await loadFallbackBoldFont(), { subset: true });

  // Первая страница
  const page = pdf.addPage(PageSizes.A4);
  const { width, height } = page.getSize();

  // Ресурсы (логотип)
  const logoPng = logoUrl ? await tryFetchPng(pdf, logoUrl) : undefined;

  // Макетные параметры
  const contentWidth = width - pageMargin * 2;
  let cursorY = height - pageMargin;

  // Хедер (логотип + заголовок)
  cursorY = drawHeader(page, {
    regular,
    bold,
    logoPng,
    x: pageMargin,
    yTop: cursorY,
    title: t('title'), // "Договор аренды"
    contentWidth,
  });

  // Параметры текста
  const sizes = {
    h1: 18,
    h2: 14,
    body: 11.5,
    small: 10,
    line: 16,
    gap: 10,
  };

  // Подготовка форматтеров
  const fmtDate = (d: Date | string) =>
    new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: '2-digit' }).format(
      typeof d === 'string' ? new Date(d) : d
    );

  const fmtMoney = (amount: number, currency: CurrencyCode) => {
    // Для криптовалют лучше без символа валюты, но оставим единообразно:
    const isFiat = currency === 'UAH' || currency === 'USD' || currency === 'EUR';
    return new Intl.NumberFormat(locale, {
      style: isFiat ? 'currency' : 'decimal',
      currency: isFiat ? (currency as 'UAH' | 'USD' | 'EUR') : undefined,
      maximumFractionDigits: isFiat ? 2 : 8,
    }).format(amount);
  };

  // Хелперы разметки
  const ctx: DrawContext = {
    pdf,
    page,
    regular,
    bold,
    sizes,
    contentWidth,
    margin: pageMargin,
    cursorY,
  };

  // Преамбула
  sectionTitle(ctx, t('section.preamble'));
  cursorY = ctx.cursorY;
  cursorY = drawWrappedText(ctx, t('preambleText', {
    ownerName: data.owner.fullName,
    renterName: data.renter.fullName,
    city: data.city ?? '',
    date: fmtDate(data.generatedAt ?? new Date()),
  }));

  // Реквизиты сторон (как таблица-«плашки»)
  spacer(ctx, 8);
  subsectionTitle(ctx, t('section.parties'));
  kv(ctx, t('field.owner'), data.owner.fullName);
  kv(ctx, t('field.ownerPhone'), data.owner.phone ?? '');
  if (data.owner.email) kv(ctx, t('field.ownerEmail'), data.owner.email);
  spacer(ctx, 4);
  kv(ctx, t('field.renter'), data.renter.fullName);
  kv(ctx, t('field.renterPhone'), data.renter.phone ?? '');
  if (data.renter.email) kv(ctx, t('field.renterEmail'), data.renter.email);
  // Определения
  spacer(ctx, 12);
  sectionTitle(ctx, t('section.definitions'));
  bulletList(ctx, [
    t('def.leaseObject', { address: data.address }),
    t('def.parties'),
    t('def.term'),
  ]);

  // Предмет договора
  spacer(ctx, 12);
  sectionTitle(ctx, t('section.subject'));
  paragraph(ctx, t('subjectText', { address: data.address }));

  // Платежи
  spacer(ctx, 12);
  sectionTitle(ctx, t('section.payments'));
  paragraph(
    ctx,
    t('paymentsText', {
      amount: fmtMoney(data.rentAmount, data.currency),
      start: fmtDate(data.rentalStart),
      end: fmtDate(data.rentalEnd),
      currency: data.currency,
    })
  );

  // Права и обязанности
  spacer(ctx, 12);
  sectionTitle(ctx, t('section.rights'));
  bulletList(ctx, [
    t('rights.owner1'),
    t('rights.owner2'),
  ]);
  spacer(ctx, 6);
  subsectionTitle(ctx, t('section.obligations'));
  bulletList(ctx, [
    t('obligations.renter1'),
    t('obligations.renter2'),
  ]);

  // Ответственность
  spacer(ctx, 12);
  sectionTitle(ctx, t('section.liability'));
  paragraph(ctx, t('liabilityText'));

  // Форс-мажор
  spacer(ctx, 12);
  sectionTitle(ctx, t('section.forceMajeure'));
  paragraph(ctx, t('forceMajeureText'));

  // Расторжение
  spacer(ctx, 12);
  sectionTitle(ctx, t('section.termination'));
  paragraph(ctx, t('terminationText'));

  // Прочие условия
  spacer(ctx, 12);
  sectionTitle(ctx, t('section.misc'));
  if (data.additionalTerms) {
    paragraph(ctx, data.additionalTerms);
  } else {
    paragraph(ctx, t('miscText'));
  }

  // Подписи
  spacer(ctx, 14);
  sectionTitle(ctx, t('section.signatures'));
  await drawSignatures(ctx, data, t);

  // Футер на всех страницах (нумерация, дата, версия, хэш)
  const totalPages = pdf.getPageCount();
  const hash = await computeSha256Hex(
    JSON.stringify({
      id: data.agreementId,
      ts: (data.generatedAt ?? new Date()).toISOString(),
      amount: data.rentAmount,
      currency: data.currency,
    })
  );
  for (let i = 0; i < totalPages; i++) {
    const p = pdf.getPage(i);
    drawFooter(p, {
      width,
      margin: pageMargin,
      regular,
      smallSize: sizes.small,
      text: t('footer.page', { page: i + 1, total: totalPages }),
      generatedAt: t('footer.generatedAt', {
        date: fmtDate(data.generatedAt ?? new Date()),
      }),
      version: data.version ?? '1.0',
      hash,
    });
  }

  return pdf.save();
}

// Имя файла (опционально используешь при сохранении)
export function getAgreementPdfFileName(data: AgreementPdfData, locale: 'ru' | 'uk' | 'en') {
  const date = new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit' })
    .format(data.generatedAt ?? new Date())
    .replace(/\./g, '-')
    .replace(/\//g, '-');
  const num = data.agreementNumber ? `_${data.agreementNumber}` : '';
  return `Agreement${num}_${date}_${data.agreementId}.pdf`;
}

// ====== Внутренние утилиты верстки ======
type TextSizes = {
  h1: number;
  h2: number;
  body: number;
  small: number;
  line: number;
  gap: number;
};

type DrawContext = {
  pdf: PDFDocument;
  page: PDFPage;
  regular: PDFFont;
  bold: PDFFont;
  sizes: TextSizes;
  contentWidth: number;
  margin: number;
  cursorY: number;
};

async function tryFetchPng(pdf: PDFDocument, url?: string) {
  if (!url) return undefined;
  try {
    const bytes = await fetch(url).then((r) => r.arrayBuffer());
    return pdf.embedPng(bytes);
  } catch {
    return undefined;
  }
}

function drawHeader(
  page: PDFPage,
  args: {
    regular: PDFFont;
    bold: PDFFont;
    logoPng?: PDFImage;
    x: number;
    yTop: number;
    title: string;
    contentWidth: number;
  }
) {
  const { bold, logoPng, x, yTop, title, contentWidth } = args;

  // Начальная точка
  const y = yTop;

  // --- ЛОГОТИП ---
  const logoMaxHeight = 60;   // стало больше, но аккуратно
  let logoWidth = 0;
  let logoHeight = 0;

  if (logoPng) {
    const ratio = logoPng.width / logoPng.height;
    logoHeight = logoMaxHeight;
    logoWidth = logoHeight * ratio;

    page.drawImage(logoPng, {
      x,
      y: y - logoHeight,  // размещаем ровно под y-top
      width: logoWidth,
      height: logoHeight,
    });
  }

  // --- ЗАГОЛОВОК ПО ЦЕНТРУ ---
  const titleSize = 20;
  const titleWidth = bold.widthOfTextAtSize(title, titleSize);

  const centerX =
    x + (contentWidth - titleWidth) / 2; // центрируем по рабочей области

  // Отступ сверху от логотипа или страницы
  const titleYOffset = logoHeight > 0 ? logoHeight / 2 : 12;

  page.drawText(title, {
    x: centerX,
    y: y - titleYOffset,
    size: titleSize,
    font: bold,
    color: rgb(0, 0, 0),
  });

  // --- РАЗДЕЛИТЕЛЬНАЯ ЛИНИЯ ---
  // Подстраиваем Y под самую нижнюю часть логотипа или текст
  const bottomY = y - (logoHeight > 0 ? logoHeight : 28) - 10;

  page.drawLine({
    start: { x, y: bottomY },
    end: { x: x + contentWidth, y: bottomY },
    thickness: 0.6,
    color: rgb(0.80, 0.80, 0.80),
  });

  // Возвращаем позицию для текста тела
  return bottomY - 16;
}

function drawFooter(
  page: PDFPage,
  args: {
    width: number;
    margin: number;
    regular: PDFFont;
    smallSize: number;
    text: string;
    generatedAt: string;
    version: string;
    hash: string;
  }
) {
  const { width, margin, regular, smallSize, text, generatedAt, version, hash } = args;
  const y = margin - 18;

  const left = `${text}  •  ${generatedAt}`;
  const right = `v${version}  •  ${hash.slice(0, 10)}`;

  page.drawText(left, {
    x: margin,
    y,
    size: smallSize,
    font: regular,
    color: rgb(0.35, 0.35, 0.35),
  });

  const rightWidth = regular.widthOfTextAtSize(right, smallSize);
  page.drawText(right, {
    x: width - margin - rightWidth,
    y,
    size: smallSize,
    font: regular,
    color: rgb(0.35, 0.35, 0.35),
  });
}

function ensureSpace(ctx: DrawContext, need: number) {
  const { margin } = ctx;
  if (ctx.cursorY - need < margin + 40) {
    // Новая страница
    const newPage = ctx.pdf.addPage(PageSizes.A4);
    ctx.page = newPage;
    ctx.cursorY = newPage.getSize().height - ctx.margin;
  }
}

function spacer(ctx: DrawContext, h: number) {
  ensureSpace(ctx, h);
  ctx.cursorY -= h;
}

function sectionTitle(ctx: DrawContext, text: string) {
  const { bold, sizes, margin, contentWidth } = ctx;

  ensureSpace(ctx, sizes.line * 2);

  const page = ctx.page;

  page.drawText(text, {
    x: margin,
    y: ctx.cursorY - sizes.h2,
    size: sizes.h2,
    font: bold,
    color: rgb(0, 0, 0),
  });

  ctx.cursorY -= sizes.line + 2;

  page.drawLine({
    start: { x: margin, y: ctx.cursorY },
    end: { x: margin + contentWidth, y: ctx.cursorY },
    thickness: 0.25,
    color: rgb(0.9, 0.9, 0.9),
  });

  ctx.cursorY -= sizes.gap;
}

function subsectionTitle(ctx: DrawContext, text: string) {
  const { bold, sizes, margin, contentWidth } = ctx;

  ensureSpace(ctx, sizes.line * 2);

  const page = ctx.page;

  page.drawText(text, {
    x: margin,
    y: ctx.cursorY - sizes.h2,
    size: sizes.h2,
    font: bold,
    color: rgb(0, 0, 0),
  });

  ctx.cursorY -= sizes.line + 2;

  page.drawLine({
    start: { x: margin, y: ctx.cursorY },
    end: { x: margin + contentWidth, y: ctx.cursorY },
    thickness: 0.25,
    color: rgb(0.9, 0.9, 0.9),
  });

  ctx.cursorY -= sizes.gap;
}

function paragraph(ctx: DrawContext, text: string) {
  ctx.cursorY = drawWrappedText(ctx, text);
}

function bulletList(ctx: DrawContext, items: string[]) {
  const { regular, sizes, margin } = ctx;

  for (const item of items) {
    ensureSpace(ctx, sizes.line);

    // актуальная страница после возможного переноса
    const page = ctx.page;

    // точка (bullet)
    page.drawText('•', {
      x: margin,
      y: ctx.cursorY - sizes.body,
      size: sizes.body,
      font: regular,
      color: rgb(0, 0, 0),
    });

    const textX = margin + 14;
    ctx.cursorY = drawWrappedText(ctx, item, textX);
  }
}

function kv(ctx: DrawContext, key: string, value: string) {
  const { page, bold, regular, sizes, margin } = ctx;
  ensureSpace(ctx, sizes.line);
  page.drawText(`${key}: `, {
    x: margin,
    y: ctx.cursorY - sizes.body,
    size: sizes.body,
    font: bold,
    color: rgb(0, 0, 0),
  });
  const keyWidth = bold.widthOfTextAtSize(`${key}: `, sizes.body);
  page.drawText(value, {
    x: margin + keyWidth,
    y: ctx.cursorY - sizes.body,
    size: sizes.body,
    font: regular,
    color: rgb(0.1, 0.1, 0.1),
  });
  ctx.cursorY -= sizes.line;
}

function drawWrappedText(ctx: DrawContext, text: string, x?: number) {
  const { regular, sizes, margin, contentWidth } = ctx;
  const maxWidth = contentWidth - (x ? x - margin : 0);
  const lines = wrap(regular, text, sizes.body, maxWidth);

  for (const line of lines) {
    // сначала проверяем, хватит ли места
    ensureSpace(ctx, sizes.line);

    // берем актуальную страницу ПОСЛЕ ensureSpace
    const page = ctx.page;

    page.drawText(line, {
      x: x ?? margin,
      y: ctx.cursorY - sizes.body,
      size: sizes.body,
      font: regular,
      color: rgb(0.05, 0.05, 0.05),
    });

    ctx.cursorY -= sizes.line;
  }

  return ctx.cursorY;
}

function wrap(font: PDFFont, text: string, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/g);
  const lines: string[] = [];
  let current = '';
  for (const w of words) {
    const trial = current ? `${current} ${w}` : w;
    const width = font.widthOfTextAtSize(trial, size);
    if (width <= maxWidth) {
      current = trial;
    } else {
      if (current) lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  // Ожидаем формат: data:image/png;base64,XXXXX
  const parts = dataUrl.split(',');
  const base64 = parts[1] ?? '';
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

async function drawSignatures(
  ctx: DrawContext,
  data: AgreementPdfData,
  t: TFunc
): Promise<void> {
  const { regular, sizes, margin, contentWidth } = ctx;

  const blockW = (contentWidth - 20) / 2;
  const blockH = 90;

  ensureSpace(ctx, blockH + sizes.line);

  let page = ctx.page;

  // ---- ВЛАДЕЛЕЦ ----
  page.drawText(`${t('field.owner')}: ${data.owner.fullName}`, {
    x: margin,
    y: ctx.cursorY - sizes.body,
    size: sizes.body,
    font: regular,
    color: rgb(0, 0, 0),
  });

  if (data.signatures?.owner) {
    try {
      const ownerBytes = dataUrlToUint8Array(data.signatures.owner);
      const ownerImg = await ctx.pdf.embedPng(ownerBytes);

      page = ctx.page; // на случай будущих переносов
      page.drawImage(ownerImg, {
        x: margin,
        y: ctx.cursorY - 70,
        width: 150,
        height: 50,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error embedding owner signature', err);
    }
  }

  // ---- АРЕНДАТОР ----
  const rightX = margin + blockW + 20;
  page = ctx.page;

  page.drawText(`${t('field.renter')}: ${data.renter.fullName}`, {
    x: rightX,
    y: ctx.cursorY - sizes.body,
    size: sizes.body,
    font: regular,
    color: rgb(0, 0, 0),
  });

  if (data.signatures?.renter) {
    try {
      const renterBytes = dataUrlToUint8Array(data.signatures.renter);
      const renterImg = await ctx.pdf.embedPng(renterBytes);

      page = ctx.page;
      page.drawImage(renterImg, {
        x: rightX,
        y: ctx.cursorY - 70,
        width: 150,
        height: 50,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error embedding renter signature', err);
    }
  }

  ctx.cursorY -= blockH;
}

// ====== Хэширующая утилита ======
export async function computeSha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);

  // 🔥 1. Если есть WebCrypto (браузер, edge-runtime, Vercel), используем его
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // 🔥 2. Node.js fallback (SSR, build, API routes)
  return createHash('sha256').update(input).digest('hex');
}

// ====== Фолбэк жирного шрифта (используем встроенный) ======
async function loadFallbackBoldFont(): Promise<ArrayBuffer> {
  // В качестве простого болда — стандартный Helvetica-Bold (через pdf-lib нельзя напрямую embed StandardFonts)
  // Поэтому используем тот же regular (OpenSans) и имитируем «болд» через тот же шрифт.
  // Если нужен настоящий болд — передай fontUrlBold в опциях и внедри по аналогии.
  // Для совместимости возвращаем regular-файл ещё раз.
  // В проде лучше хранить отдельный OpenSans-Bold.ttf и загрузить его отдельно.
  const bytes = await fetch('/fonts/OpenSans-Regular.ttf').then((r) => r.arrayBuffer());
  return bytes;
}
