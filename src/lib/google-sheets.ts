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
    
    return rows.map((row, index) => {
      const c = row.c;
      /* 원본 시트 구조 분석 결과 (1Setffm...): 
         c[0]: 지역 (강원도 정선군)
         c[1]: 장소명
         c[2]: 위도
         c[3]: 경도
         c[4]: 주소
         c[5]: 카테고리
         c[6]: 태그
      */
      return {
        id: index + 1, // 행 번호 기반 ID 생성
        name: String(c[1]?.v || '정선의 공간'),
        category: String(c[5]?.v || '기타'),
        coordinates: {
          lat: Number(c[2]?.v) || 0,
          lng: Number(c[3]?.v) || 0,
        },
        description: `${c[4]?.v || ''} ${c[6]?.v || ''}`.trim(), // 주소와 태그 결합
      };
    });
  } catch (error) {
    console.error("Error fetching places from Google Sheets:", error);
    return [];
  }
}
