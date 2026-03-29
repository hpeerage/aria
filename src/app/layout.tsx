import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hpeerage.github.io/aria"),
  title: "정선 아리아 (Jeongseon Aria) | 웰니스 관광 큐레이션",
  description: "정선의 82개 관광 자원을 기반으로 당신만의 특별한 웰니스 여정을 큐레이션해드립니다. 정선 아리아와 함께 진정한 힐링을 경험하세요.",
  openGraph: {
    title: "정선 아리아 (Jeongseon Aria)",
    description: "정선 웰니스 관광 브랜드 큐레이션 플랫폼",
    url: "https://hpeerage.github.io/aria",
    siteName: "정선 아리아",
    locale: "ko_KR",
    type: "website",
  },
  icons: {
    icon: "/aria/icon.svg",
    apple: "/aria/icon.svg",
  },
};

import { LanguageProvider } from "@/lib/i18n/context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
