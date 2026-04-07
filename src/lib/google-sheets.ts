import { Place } from "@/types/place";
import { getImagesByCategory, validateImagePaths } from "./place-images";

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

    let rows = jsonData.table.rows as GoogleSheetRow[];
    
    // 첫 번째 행이 헤더인지 확인 (장소명 등 텍스트 포함 여부)
    if (rows.length > 0 && String(rows[0].c[1]?.v).includes('장소명')) {
      rows = rows.slice(1);
    }

    // 유효한 데이터가 있는 행만 필터링 (장소명이 없는 빈 행 제외)
    return rows
      .filter(row => row.c[1]?.v)
      .map((row, index) => {
        const c = row.c;
        const category = String(c[5]?.v || '기타');
        const id = index + 1;

        return {
          id,
          name: String(c[1]?.v || '정선의 공간'),
          category,
          coordinates: {
            lat: Number(c[2]?.v) || 0,
            lng: Number(c[3]?.v) || 0,
          },
          description: `${c[4]?.v || ''} ${c[6]?.v || ''}`.trim(),
          images: validateImagePaths(getImagesByCategory(category, id), id, category),
        };
      });
  } catch (error) {
    console.error("Error fetching places from Google Sheets:", error);
    return [];
  }
}
