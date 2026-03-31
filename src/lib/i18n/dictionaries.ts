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
    categories: {
      nature: "자연",
      culture: "문화/전통",
      wellness: "체험/웰니스",
      food: "맛집",
      history: "역사/유적",
      stay: "숙소",
      etc: "기타"
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
    },
    admin: {
      dashboard: "대시보드",
      places: "장소 관리",
      settings: "설정",
      logout: "로그아웃",
      addPlace: "신규 장소 등록",
      editPlace: "장소 정보 수정",
      save: "정보 저장하기",
      saving: "저장하는 중...",
      saveSuccess: "장소 정보가 성공적으로 업데이트되었습니다.",
      saveError: "저장 중 오류가 발생했습니다.",
      basicInfo: "기본 정보",
      assetRegistry: "시각 자원 관리",
      name: "장소명",
      category: "카테고리",
      coordinates: "좌표 (위도, 경도)",
      description: "상세 설명",
      wellnessInsight: "웰니스 인사이트 & 팁",
      addInsight: "인사이트 추가",
      uploadImage: "이미지 업로드",
      removeImage: "이미지 삭제",
      loginTitle: "관리자 로그인",
      loginSubtitle: "정선 아리아 통합 관리 시스템 접속",
      placeholderName: "장소 이름을 입력하세요",
      placeholderDesc: "장소에 대한 웰니스 이야기를 들려주세요...",
      placeholderInsight: "웰니스 팁을 입력하세요 (예: 새벽 명상에 최적)",
      mapView: "지도 시각화",
      explorerTitle: "장소 탐색기",
      explorerDesc: "정선의 모든 82개 웰니스 자원을 실시간으로 관리하고 모니터링합니다.",
      syncing: "레지스트리 동기화 중...",
      noImage: "이미지가 없습니다.",
      assetStats: "자원 현황",
      lastSync: "최근 동기화"
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
      nearbyPlaces: "Nearby Places",
      story: "The Story",
      copyRight: "© 2026 Jeongseon Wellness Tourism Project. All Rights Reserved."
    },
    categories: {
      nature: "Nature",
      culture: "Culture",
      wellness: "Wellness",
      food: "Food",
      history: "History",
      stay: "Stay",
      etc: "ETC"
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
      wellness: "Wellness Index",
      newPlaces: "New Places"
    },
    admin: {
      dashboard: "Dashboard",
      places: "Manage Places",
      settings: "Settings",
      logout: "Logout",
      addPlace: "Register New Asset",
      editPlace: "Edit Place Info",
      save: "Save Changes",
      saving: "Saving Changes...",
      saveSuccess: "Place information updated successfully.",
      saveError: "An error occurred while saving.",
      basicInfo: "Basic Information",
      assetRegistry: "Visual Asset Registry",
      name: "Place Name",
      category: "Category",
      coordinates: "Coordinates (Lat, Lng)",
      description: "Detailed Description",
      wellnessInsight: "Wellness Insights & Tips",
      addInsight: "Add Insight",
      uploadImage: "Upload Image",
      removeImage: "Remove Image",
      loginTitle: "Admin Login",
      loginSubtitle: "Access to Aria Management System",
      placeholderName: "Enter place name",
      placeholderDesc: "Tell the wellness story of this place...",
      placeholderInsight: "Enter a wellness tip (e.g., Best for meditation)",
      mapView: "Map Visualization",
      explorerTitle: "Place Explorer",
      explorerDesc: "Manage and monitor all 82 wellness assets in real-time.",
      syncing: "Syncing with Registry...",
      noImage: "No images.",
      assetStats: "Asset Stats",
      lastSync: "Last Sync"
    }
  }
}
;

export type Locale = keyof typeof dictionaries;
export type Dictionary = typeof dictionaries.ko;
