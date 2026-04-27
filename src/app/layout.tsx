import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
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
    icon: "/aria/favicon.svg",
    apple: "/aria/apple-icon.png",
  },
  manifest: "/aria/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "정선 아리아",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport = {
  themeColor: "#13342b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { LanguageProvider } from "@/lib/i18n/context";
import { WishlistProvider } from "@/lib/wishlist/context";
import FloatingCart from "@/components/FloatingCart";
import WishlistPanel from "@/components/WishlistPanel";

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
          <WishlistProvider>
            {children}
            <FloatingCart />
            <WishlistPanel />
            <Script
              src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js"
              strategy="afterInteractive"
              onLoad={() => {
                if (typeof window !== "undefined" && (window as any).Kakao && !(window as any).Kakao.isInitialized()) {
                  (window as any).Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "");
                }
              }}
            />
          </WishlistProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
