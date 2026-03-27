import { Place } from "@/types/place";

/**
 * 구글 시트 데이터를 가져오는 유틸리티 (서버 전 전용)
 * @param sheetId 시트의 ID (브라우저 주소창에서 추출)
 * @param sheetName (선택) 시트 탭 이름
 */
export async function getPlacesFromGoogleSheet(sheetId: string, sheetName?: string): Promise<Place[]> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json${sheetName ? `&sheet=${sheetName}` : ''}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // 1시간 캐싱 (서버 컴포넌트 최적화)
    });

    if (!response.ok) {
      throw new Error(`Google Sheets fetch failed: ${response.statusText}`);
    }

    const text = await response.text();
    // Google Visualization API는 JSON을 특정 접두사로 감싸서 반환하므로 이를 제거해야 함.
    const jsonData = JSON.parse(text.substring(47).slice(0, -2));
    
    // Google Visualization API 응답 타입 정의
    interface GoogleSheetRow {
      c: (
        | {
            v: string | number | null;
          }
        | null
      )[];
    }

    const rows = jsonData.table.rows as GoogleSheetRow[];
    
    return rows.map((row) => {
      const c = row.c;
      return {
        id: Number(c[0]?.v) || 0,
        category: String(c[1]?.v || ''),
        name: String(c[2]?.v || ''),
        coordinates: {
          lat: Number(c[3]?.v) || 0,
          lng: Number(c[4]?.v) || 0,
        },
        description: String(c[5]?.v || ''), // 설명 필드가 있을 경우 대비
      };
    });
  } catch (error) {
    console.error("Error fetching places from Google Sheets:", error);
    return [];
  }
}
