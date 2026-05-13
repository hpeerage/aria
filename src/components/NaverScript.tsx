"use client";

import Script from "next/script";

export default function NaverScript() {
  const clientId = process.env.NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID;

  if (!clientId) return null;

  return (
    <Script
      strategy="afterInteractive"
      src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}&submodules=geocoder&mapStyleId=ca4b0f70-d886-4556-bf11-e06f5ac5a743`}
    />
  );
}
