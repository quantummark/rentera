import type { Metadata } from "next"; // Импортируем типы для метаданных из Next.js
import { Geist, Geist_Mono } from "next/font/google";   // Импортируем шрифты Geist и Geist Mono из Google Fonts
import "./globals.css"; // Импортируем глобальные стили
import { ThemeProvider } from "@/app/components/providers/ThemeProvider"; // Импортируем провайдер темы
import ClientRoot from '@/app/components/ClientRoot'; // Импортируем i18n для локализации

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
      className={`${geistSans.variable} ${geistMono.variable} font-sans`}
    >
      <body className="bg-background text-foreground min-h-screen antialiased">
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <ClientRoot>
      <div className="container mx-auto py-8 px-4">{children}</div>
    </ClientRoot>
  </ThemeProvider>
</body>
    </html>
  );
}
