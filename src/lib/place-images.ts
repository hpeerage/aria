/**
 * 정선의 웰니스 테마에 어울리는 고해상도 Unsplash 이미지 큐레이션
 */
const CATEGORY_IMAGES: Record<string, string[]> = {
  "기본": [
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071"
  ],
  "관광": [
    "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1950",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070"
  ],
  "카페/식당": [
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070",
    "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070"
  ],
  "힐링/전통": [
    "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1974",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073"
  ],
  "숙소": [
    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070",
    "https://images.unsplash.com/photo-1432339463661-89d81617477c?q=80&w=2072"
  ],
  "정선맛집": [
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070",
    "https://images.unsplash.com/photo-1476224484781-a35ca36b60ef?q=80&w=2070"
  ]
};

export function getImagesByCategory(category: string, id: number): string[] {
  // 카테고리별 매칭 (없으면 기본 이미지셋 사용)
  let images = CATEGORY_IMAGES["기본"];
  
  if (category.includes("맛집") || category.includes("정선맛집") || category.includes("food")) {
    images = CATEGORY_IMAGES["정선맛집"];
  } else if (category.includes("식음") || category.includes("카페") || category.includes("맛") || category.includes("restaurant")) {
    images = CATEGORY_IMAGES["카페/식당"];
  } else if (category.includes("문화") || category.includes("유적") || category.includes("전통") || category.includes("culture") || category.includes("history")) {
    images = CATEGORY_IMAGES["힐링/전통"];
  } else if (category.includes("웰니스") || category.includes("자원") || category.includes("치유") || category.includes("nature") || category.includes("wellness")) {
    images = CATEGORY_IMAGES["관광"];
  } else if (category.includes("숙박") || category.includes("펜션") || category.includes("호텔") || category.includes("stay") || category.includes("accommodation")) {
    images = CATEGORY_IMAGES["숙소"];
  }

  // ID를 시드로 사용하여 매번 같은 리스트 내에서 섞어서 반환
  const result = [...images];
  const seed = id % result.length;
  // 간단한 스왑을 통해 다양성 확보
  [result[0], result[seed]] = [result[seed], result[0]];
  
  // 로컬 이미지 경로 우선 추가 (/aria/images/{id}_01.jpg)
  // 파일 확장자 다양성(jpg, jpeg, webp)을 고려하여 기본적으로 jpg를 시도하고 필요시 프로젝트의 실제 파일들을 매핑
  const localImg = `/aria/images/${String(id).padStart(2, '0')}_01.jpg`;
  
  return [localImg, ...result];
}
