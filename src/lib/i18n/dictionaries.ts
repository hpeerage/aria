export const dictionaries = {
  ko: {
    common: {
      explore: "지금 탐험하기",
      download: "기획서 내려받기",
      backToList: "목록으로 돌아가기",
      nearMe: "내 주변",
      all: "전체",
      searchPlaceholder: "어떤 치유의 공간을 찾으시나요?",
      viewCuration: "상세 보기",
      placesFound: "당신을 위해 선별된 {count}개의 공간들",
      quickFact: "주요 정보",
      location: "위치",
      category: "카테고리",
      coordinates: "좌표",
      findRoute: "길 찾기",
      wellnessTip: "정선 아리아가 전하는 웰니스 팁",
      nearbyTreasures: "주변의 또 다른 보물들",
      story: "장소의 이야기",
      copyRight: "© 2026 정선 웰니스 관광 프로젝트. All Rights Reserved."
    },
    hero: {
      subtitle: "Wellness Curation Platform",
      title1: "JEONGSEON",
      title2: "ARIA",
      description: "어머니의 아리랑처럼 깊고 고요한 정선의 82개 치유 거점을 당신의 리듬에 맞춰 큐레이션합니다."
    },
    stats: {
      assets: "관광 자원",
      paths: "추천 경로",
      wellness: "웰니스 지수",
      newPlaces: "신규 장소"
    }
  },
  en: {
    common: {
      explore: "Explore Now",
      download: "Download Plan",
      backToList: "Back to List",
      nearMe: "Near Me",
      all: "All",
      searchPlaceholder: "Find your healing space...",
      viewCuration: "View Details",
      placesFound: "{count} places curated for you",
      quickFact: "Quick Fact",
      location: "Location",
      category: "Category",
      coordinates: "Coordinates",
      findRoute: "Get Directions",
      wellnessTip: "Aria's Wellness Tip",
      nearbyTreasures: "Nearby Treasures",
      story: "The Story",
      copyRight: "© 2026 Jeongseon Wellness Tourism Project. All Rights Reserved."
    },
    hero: {
      subtitle: "Wellness Curation Platform",
      title1: "JEONGSEON",
      title2: "ARIA",
      description: "Curating 82 healing points of Jeongseon, deep and calm like Mother's Arirang, to your unique rhythm."
    },
    stats: {
      assets: "Assets",
      paths: "Paths",
      wellness: "Wellness",
      newPlaces: "Updated"
    }
  }
};

export type Locale = keyof typeof dictionaries;
export type Dictionary = typeof dictionaries.ko;
