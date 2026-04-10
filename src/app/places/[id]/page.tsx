import { getPlacesFromGoogleSheet } from "@/lib/google-sheets";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import AriaPlaceDetail from "@/components/PlaceDetailClient";

const SHEET_ID = '1Setffm27HQ8LyOM3N9o9V8eA0ihGbZeZgN763jkm1WU';

// 정적 사이트 생성을 위해 동적 파라미터를 비활성화합니다.
export const dynamicParams = false;

// 정적 페이지 생성을 위한 파라미터 설정 (82개 장소 사전 빌드)
export async function generateStaticParams() {
  const places = await getPlacesFromGoogleSheet(SHEET_ID);
  return places.map((place) => ({
    id: place.id.toString(),
  }));
}

// 메타데이터 설정 (SEO 최적화)
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const places = await getPlacesFromGoogleSheet(SHEET_ID);
  const place = places.find((p) => p.id.toString() === params.id);
  
  if (!place) return { title: "Place Not Found - Jeongseon Aria" };

  return {
    title: `${place.name} - 정선 아리아 웰니스 큐레이션`,
    description: place.description || `${place.name}에서 경험하는 정선의 치유 에너지.`,
    alternates: {
      canonical: `https://hpeerage.github.io/aria/places/${params.id}`,
    },
    openGraph: {
      title: place.name,
      description: place.description,
      images: ["/aria/og-image.jpg"],
      url: `https://hpeerage.github.io/aria/places/${params.id}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: place.name,
      description: place.description,
      images: ["/aria/og-image.jpg"],
    },
  };
}

export default async function PlaceDetailPage({ params }: { params: { id: string } }) {
  const places = await getPlacesFromGoogleSheet(SHEET_ID);
  const place = places.find((p) => p.id.toString() === params.id);

  if (!place) {
    notFound();
  }

  // 주변 장소 추천 (거리 기반 정렬)
  const nearbyPlaces = places
    .filter((p) => p.id !== place.id)
    .sort((a, b) => {
      const distA = Math.pow(a.coordinates.lat - place.coordinates.lat, 2) + Math.pow(a.coordinates.lng - place.coordinates.lng, 2);
      const distB = Math.pow(b.coordinates.lat - place.coordinates.lat, 2) + Math.pow(b.coordinates.lng - place.coordinates.lng, 2);
      return distA - distB;
    })
    .slice(0, 4);

  // JSON-LD 구조화 데이터 생성
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": place.name,
    "description": place.description,
    "image": "https://hpeerage.github.io/aria/og-image.jpg",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": place.coordinates.lat,
      "longitude": place.coordinates.lng
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "정선군",
      "addressRegion": "강원도",
      "addressCountry": "KR"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AriaPlaceDetail place={place} nearbyPlaces={nearbyPlaces} />
    </>
  );
}
