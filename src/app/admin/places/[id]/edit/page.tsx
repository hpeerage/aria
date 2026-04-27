import { getPlacesFromGoogleSheet } from "@/lib/google-sheets";
import PlaceEditForm from "@/components/admin/PlaceEditForm";

const SHEET_ID = '1Setffm27HQ8LyOM3N9o9V8eA0ihGbZeZgN763jkm1WU';

// 정적 페이지 생성을 위한 파라미터 설정 (82개 장소 사전 빌드)
export async function generateStaticParams() {
  const places = await getPlacesFromGoogleSheet(SHEET_ID);
  return places.map((place) => ({
    id: place.id.toString(),
  }));
}

export default function AdminPlaceEditServerPage({ params }: { params: { id: string } }) {
  return <PlaceEditForm />;
}
