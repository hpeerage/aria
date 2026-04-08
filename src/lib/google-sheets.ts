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

    // --- [v0.8.0] GitHub 동기화 데이터 병합 및 빌드 시점 정합성 강화 ---
    try {
      let syncedPlaces: Place[] = [];
      const isServer = typeof window === 'undefined';
      
      if (isServer) {
        // 서버 측(빌드 타임)에서는 파일 시스템에서 직접 읽기 (가장 정확하고 빠름)
        try {
          const fs = await import('fs');
          const path = await import('path');
          const filePath = path.join(process.cwd(), 'public', 'data', 'places.json');
          if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            syncedPlaces = JSON.parse(fileContent);
          }
        } catch (fsError) {
          console.warn("Server-side file read failed, attempting fetch fallback:", fsError);
        }
      }

      // 서버 읽기에 실패했거나 브라우저 환경인 경우 fetch 시도
      if (syncedPlaces.length === 0) {
        const isProd = !isServer && 
                      (window.location.hostname.includes('github.io') || window.location.hostname.includes('vercel.app'));
        const basePath = isProd ? '/aria' : '';
        const timestamp = new Date().getTime();
        const syncRes = await fetch(`${basePath}/data/places.json?t=${timestamp}`);
        if (syncRes.ok) {
          syncedPlaces = await syncRes.json();
        }
      }

      if (syncedPlaces.length > 0) {
        const combinedMap = new Map<number, Place>();
        sourcePlaces.forEach(p => combinedMap.set(p.id, p));
        syncedPlaces.forEach(p => {
          if (p && p.id) {
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
