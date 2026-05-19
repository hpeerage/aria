// [v1.1.0] Force reset and re-fetch from Google Sheets
import { Place } from "@/types/place";
import { getImagesByCategory, validateImagePaths } from "./place-images";
import customPlacesData from "../../public/data/places.json";

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
 * 카테고리별로 최적화된 웰니스 팁 5개씩을 생성하여 비어있는 곳을 완벽하게 채워줍니다.
 */
export function getWellnessTipsByCategory(category: string): string[] {
  switch (category) {
    case "nature":
      return [
        "피톤치드가 가장 풍부한 오전 10시에서 오후 2시 사이에 숲길을 천천히 걸어보세요.",
        "스마트폰을 잠시 끄고 정선 자연의 고요한 바람 소리와 새소리에 온전히 귀를 기울입니다.",
        "깊고 느린 복식 호흡을 통해 청정한 강원도의 맑은 산소로 내면을 가득 채워보세요.",
        "초록색 나뭇잎에 시선을 고정하고 지쳐있던 눈의 피로를 부드럽게 이완시켜 줍니다.",
        "자연과 온전히 하나가 되는 느낌으로 마음속의 스트레스와 무거운 짐을 가만히 내려놓으세요."
      ];
    case "water":
      return [
        "흐르는 맑은 물소리에 마음을 얹고 내면의 불안감을 씻어내는 명상을 해보세요.",
        "동굴 특유의 서늘하고 정갈한 공기를 깊이 들이마시며 복잡한 머리를 맑게 식혀 줍니다.",
        "일정한 물소리의 리듬에 호흡 속도를 맞추며 정서적인 안정감을 극대화합니다.",
        "물방울이 뚝뚝 떨어지는 고요한 소리에 집중하는 소리 명상(Sound Bath)을 시도해 보세요.",
        "자연의 영겁의 시간이 빚어낸 경이로운 바위와 맑은 물을 바라보며 시각적인 리프레시를 경험합니다."
      ];
    case "activity":
      return [
        "온몸의 잠들어 있던 근육과 감각을 활성화하여 일상의 무기력함에서 벗어나는 활력을 느껴보세요.",
        "역동적인 움직임 속에서 호흡의 균형을 유지하며 신체와 정신의 완벽한 조화를 이끌어냅니다.",
        "속도와 도전을 즐기되, 그 과정에서 느껴지는 짜릿함과 맑은 해방감에 온전히 몰입해 보세요.",
        "체험이 끝난 직후 온몸으로 흐르는 건강한 아드레날린과 활기찬 열정을 기분 좋게 음미합니다.",
        "새로운 환경에서의 감각적인 도전으로 내면의 숨겨진 잠재력과 자신감을 가득 깨우세요."
      ];
    case "food":
      return [
        "음식을 한 입 먹기 전 눈과 코로 먼저 깊게 음미하는 ‘마인드풀 이팅(Mindful Eating)’을 실천해 보세요.",
        "정선 현지의 신선하고 청정한 농특산물이 선사하는 건강한 맛과 대지의 활력을 온전히 느껴봅니다.",
        "음식을 꼭꼭 씹으며 입안 가득 퍼지는 맛의 고유한 레이어와 텍스처에 부드럽게 집중해 봅니다.",
        "맑은 차 한 잔이나 따뜻한 커피의 온기가 온몸으로 고르게 퍼지는 편안한 이완을 경험해 보세요.",
        "소중한 사람들과 맛있는 음식을 나누며 깊은 정서적 교감과 소통의 즐거움을 따뜻하게 채워갑니다."
      ];
    case "culture":
      return [
        "정선의 오랜 역사와 전통이 담긴 발자취를 따라 고요히 걸으며 옛 선조들의 지혜로운 숨결을 느껴보세요.",
        "정겨운 시장 상인들의 따뜻한 정과 활기 넘치는 대화를 통해 긍정적인 삶의 에너지를 충전합니다.",
        "과거와 현재가 평온하게 공존하는 공간 속에서 가볍게 사색하며 나만의 철학적 성찰의 시간을 가집니다.",
        "다양한 향토 문화재나 깊이 있는 예술 작품을 시각적으로 탐색하며 창의적인 영감을 깨워보세요.",
        "오랜 시간 동안 정성스레 지켜져 온 고유의 정서와 문화를 감상하며 마음속에 잔잔한 울림을 채워보세요."
      ];
    case "stay":
      return [
        "체크인 즉시 모든 디지털 기기를 내려놓고, 온전히 머무는 나를 위한 ‘디지털 디톡스’를 시작해 보세요.",
        "쏟아질 듯 맑은 정선의 밤하늘과 별빛을 조용히 바라보며 하루 동안 쌓인 긴장을 눈 녹이듯 씻어냅니다.",
        "안락한 자연의 품속 같은 침구에서 깊고 아늑한 수면을 취하여 신체의 천연 치유력을 높여줍니다.",
        "눈부신 아침 햇살이 넓은 창가로 부드럽게 찾아올 때, 고요하고 평화롭게 하루를 시작해 보세요.",
        "머무는 숙소 공간 전체를 따뜻한 나만의 은신처로 삼고, 아무것도 하지 않는 온전한 자유를 누리세요."
      ];
    default:
      return [
        "지치고 지친 지친 마음을 잠시 멈추고 정선의 따스한 공기 속에서 깊은 휴식을 취해 봅니다.",
        "복잡하게 얽혀 있던 생각을 부드럽게 비워내고 나만의 속도와 호흡에 가만히 집중해 보세요.",
        "자연이 빚어낸 고요한 풍경을 멍하니 바라보는 ‘풍경 멍’을 통해 마음을 평온하게 채워줍니다.",
        "오늘 하루 나 자신에게 수고했다는 인사를 건네며 내면의 행복한 긍정 기운을 북돋워 줍니다.",
        "바람이 머물다 가는 길을 따라 걸으며 세상의 스트레스에서 한 걸음 멀어지는 이완을 느껴보세요."
      ];
  }
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
          wellnessTips: getWellnessTipsByCategory(category), // 카테고리별 정밀 웰니스 팁 5개 자동 주입!
          icon: c[10]?.v ? String(c[10].v) : undefined, // [v0.11.0] 아이콘 데이터 매핑
        };
      });

    // [v1.2.0] Merge custom images from public/data/places.json
    try {
      if (customPlacesData && Array.isArray(customPlacesData)) {
        const customPlaces: Place[] = customPlacesData as Place[];
        
        customPlaces.forEach(customPlace => {
          const target = sourcePlaces.find(p => p.id === customPlace.id);
          if (target && customPlace.images && customPlace.images.length > 0) {
            target.images = customPlace.images;
          }
        });
      }
    } catch (fsError) {
      console.warn("Failed to merge public/data/places.json:", fsError);
    }

    return sourcePlaces;
  } catch (error) {
    console.error("Error fetching places from Google Sheets:", error);
    return [];
  }
}

