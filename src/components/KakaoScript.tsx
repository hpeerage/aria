"use client";

import Script from "next/script";

export default function KakaoScript() {
  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js"
      strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== "undefined" && (window as any).Kakao) {
            if (!(window as any).Kakao.isInitialized()) {
              const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "";
              console.log("Initializing Kakao with key:", key.substring(0, 5) + "...");
              (window as any).Kakao.init(key);
              console.log("Kakao initialized status:", (window as any).Kakao.isInitialized());
            }
          }
        }}

    />
  );
}
