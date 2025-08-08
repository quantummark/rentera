
import type { Metadata } from "next"; // Импортируем типы для метаданных из Next.js
import { Geist, Geist_Mono } from "next/font/google";   // Импортируем шрифты Geist и Geist Mono из Google Fonts
import "./globals.css"; // Импортируем глобальные стили
import { ThemeProvider } from "@/app/components/providers/ThemeProvider"; // Импортируем провайдер темы
import ClientRoot from '@/app/components/ClientRoot'; // Импортируем i18n для локализации
import Header from '@/app/components/layout/Header';
import Footer from '@/app/components/layout/Footer';
import QueryClientWrapper from '@/app/components/query-client-wrapper';





// Подключаем шрифты
const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

// Метаданные сайта
export const metadata: Metadata = {
  title: "Rentera",
  description: "Найди идеальное жильё — с комфортом отельного уровня",
};

// RootLayout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-theme="light" // Устанавливаем тему по умолчанию
      className={`${geistSans.variable} ${geistMono.variable} font-sans`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light"></meta>
      </head>
<body className="bg-background text-foreground min-h-screen antialiased">
  {/* Оборачиваем приложение в QueryClientWrapper */}
  <QueryClientWrapper>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="rentera-theme" disableTransitionOnChange={true}>
            <ClientRoot>
              {/* Компонент Header */}
              <Header />
              {/* Контейнер для контента */}
              <div className="container mx-auto py-8 px-4">{children}</div>
              <Footer />
            </ClientRoot>
          </ThemeProvider>
        </QueryClientWrapper>
      </body>
    </html>
  );
}
