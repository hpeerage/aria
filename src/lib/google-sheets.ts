import { Place } from "@/types/place";
import { getImagesByCategory, validateImagePaths } from "./place-images";

/**
 * 원본 대화식 카테고리명을 시스템 표준 키로 변환합니다.
 */
export function normalizeCategory(rawCategory: string): string {
  const c = rawCategory.toLowerCase();
  
  // 1. 자연/숲
  if (c.includes("자연") || c.includes("숲") || c.includes("nature")) return "nature";
  
  // 2. 동굴/수자원
  if (c.includes("동굴") || c.includes("수자원") || c.includes("water") || c.includes("cave")) return "water";
  
  // 3. 체험/액티비티
  if (c.includes("체험") || c.includes("액티비티") || c.includes("activity")) return "activity";
  
  // 4. 맛집
  if (c.includes("맛집") || c.includes("food") || c.includes("식당") || c.includes("카페")) return "food";
  
  // 5. 문화/시장/기타 (기존 문화, 시장, 역사 등 통합)
  if (c.includes("문화") || c.includes("시장") || c.includes("전통") || c.includes("culture") || c.includes("history") || c.includes("유적")) return "culture";
  
  // 6. 숙소
  if (c.includes("숙소") || c.includes("숙박") || c.includes("stay") || c.includes("호텔")) return "stay";
  
  return "culture"; // 기본값 (기타가 포함된 문화로 수렴)
}

/**
 * 구글 시트 데이터를 가져오는 유틸리티 (서버 전 전용)
 * @param sheetId 시트의 ID (브라우저 주소창에서 추출)
 * @param sheetName (선택) 시트 탭 이름
 */
export async function getPlacesFromGoogleSheet(sheetId: string, sheetName?: string): Promise<Place[]> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json${sheetName ? `&sheet=${sheetName}` : ''}`;

  try {
    const response = await fetch(url);

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

    // [v0.8.2] 정선군 기본 좌표 (좌표 누락 시 아프리카로 날아가는 것을 방지)
    const JEONGSEON_CENTER = { lat: 37.3806, lng: 128.6608 };

    // 기본 데이터 매핑
    const sourcePlaces = rows
      .filter(row => row.c[1]?.v)
      .map((row, index) => {
        const c = row.c;
        const rawCategory = String(c[5]?.v || '기타');
        const category = normalizeCategory(rawCategory);
        const id = index + 1;
        
        let lat = Number(c[2]?.v);
        let lng = Number(c[3]?.v);
        
        // 좌표가 0이거나 유효하지 않은 경우 정선군 기본 위치로 보정
        if (!lat || !lng || lat === 0 || lng === 0) {
          lat = JEONGSEON_CENTER.lat;
          lng = JEONGSEON_CENTER.lng;
        }

        return {
          id,
          name: String(c[1]?.v || '정선의 공간'),
          category,
          coordinates: { lat, lng },
          description: `${c[4]?.v || ''} ${c[6]?.v || ''}`.trim(),
          images: validateImagePaths(getImagesByCategory(category, id), id, category),
          icon: c[10]?.v ? String(c[10].v) : undefined, // [v0.11.0] 아이콘 데이터 매핑
        };
      });

    // --- [v0.8.0 / v0.8.3] GitHub 동기화 데이터 병합 및 빌드 시점 정합성 강화 ---
    try {
      let syncedPlaces: Place[] = [];
      const isServer = typeof window === 'undefined';
      
      // 서버/브라우저 환경 공통으로 fetch 시도 (캐시 무효화 포함)
      const isProd = !isServer && 
                    (window.location.hostname.includes('github.io') || window.location.hostname.includes('vercel.app'));
      const basePath = isProd ? '/aria' : '';
      const timestamp = new Date().getTime();
      
      // 빌드 시점에는 상대 경로 fetch가 실패할 수 있으므로 조용히 처리
      try {
        const syncRes = await fetch(`${basePath}/data/places.json?t=${timestamp}`);
        if (syncRes.ok) {
          syncedPlaces = await syncRes.json();
        }
      } catch {
        // 빌드 타임 환경 등에서 fetch 실패 시 로깅 생략 (폴백 작동)
      }

      if (syncedPlaces && syncedPlaces.length > 0) {
        const combinedMap = new Map<number, Place>();
        sourcePlaces.forEach(p => combinedMap.set(p.id, p));
        syncedPlaces.forEach(p => {
          if (p && p.id && p.coordinates) {
            // [v0.8.3] 병합 시에도 좌표 유효성 검사
            if (!p.coordinates.lat || !p.coordinates.lng || p.coordinates.lat === 0 || p.coordinates.lng === 0) {
              p.coordinates = JEONGSEON_CENTER;
            }
            combinedMap.set(p.id, p);
          }
        });
        return Array.from(combinedMap.values());
      }
    } catch (e) {
      console.warn("Synced data merge failed:", e);
    }

    return sourcePlaces;
  } catch (error) {
    console.error("Error fetching places from Google Sheets:", error);
    return [];
  }
}
