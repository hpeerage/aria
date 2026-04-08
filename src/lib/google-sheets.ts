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

    // 기본 데이터 매핑
    const sourcePlaces = rows
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

    // --- [v0.6.0] GitHub 동기화 데이터 병합 로직 추가 ---
    try {
      // 배포 환경 및 로컬 환경에서 동기화된 JSON 파일 페칭
      const syncRes = await fetch('/aria/data/places.json', { cache: 'no-store' });
      if (syncRes.ok) {
        const syncedPlaces: Place[] = await syncRes.json();
        
        // ID를 기준으로 병합 (동기화된 데이터가 우선권을 가짐)
        const combinedMap = new Map<number, Place>();
        
        // 1. 기본 데이터 추가
        sourcePlaces.forEach(p => combinedMap.set(p.id, p));
        
        // 2. 동기화 데이터로 덮어쓰기 또는 추가
        syncedPlaces.forEach(p => {
          combinedMap.set(p.id, p);
        });
        
        return Array.from(combinedMap.values());
      }
    } catch (e) {
      console.warn("Synced data not found or failed to fetch, using default sheets data.");
    }

    return sourcePlaces;
  } catch (error) {
    console.error("Error fetching places from Google Sheets:", error);
    return [];
  }
}
