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

    // --- [v0.6.1] GitHub 동기화 데이터 병합 로직 고도화 ---
    try {
      // 1. 배포 환경(GitHub Pages)과 로컬 환경에 따른 베이스 경로 처리
      const isProd = typeof window !== 'undefined' && 
                     (window.location.hostname.includes('github.io') || window.location.hostname.includes('vercel.app'));
      const basePath = isProd ? '/aria' : '';
      
      // 2. 캐시 무시를 위해 타임스탬프 추가 (Cache Busting)
      const timestamp = new Date().getTime();
      const syncRes = await fetch(`${basePath}/data/places.json?t=${timestamp}`, { 
        cache: 'no-store',
        headers: {
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache'
        }
      });

      if (syncRes.ok) {
        const syncedPlaces: Place[] = await syncRes.json();
        
        // ID를 기준으로 병합 (관리자가 명시적으로 저장한 데이터가 항상 우선)
        const combinedMap = new Map<number, Place>();
        
        // 시트 원본 데이터 먼저 채움
        sourcePlaces.forEach(p => combinedMap.set(p.id, p));
        
        // 동기화 데이터(Base64 이미지 포함)로 강력 덮어쓰기
        syncedPlaces.forEach(p => {
          if (p && p.id) {
            combinedMap.set(p.id, p);
          }
        });
        
        return Array.from(combinedMap.values());
      }
    } catch (e) {
      console.warn("Synced data fetch failed, falling back to Sheets only:", e);
    }

    return sourcePlaces;
  } catch (error) {
    console.error("Error fetching places from Google Sheets:", error);
    return [];
  }
}
