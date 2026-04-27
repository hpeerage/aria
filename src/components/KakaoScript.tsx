"use client";

import Script from "next/script";

export default function KakaoScript() {
  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js"
      strategy="afterInteractive"
      onLoad={() => {
        if (typeof window !== "undefined" && (window as any).Kakao && !(window as any).Kakao.isInitialized()) {
          (window as any).Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "");
        }
      }}
    />
  );
}
