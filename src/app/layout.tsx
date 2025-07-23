
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
      className={`${geistSans.variable} ${geistMono.variable} font-sans dark`}
    >
      <body className="bg-background text-foreground min-h-screen antialiased">
        {/* Оборачиваем приложение в QueryClientWrapper */}
        <QueryClientWrapper>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
