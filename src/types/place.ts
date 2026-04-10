export interface Place {
  id: number;          // 번호
  name: string;        // 장소명
  category: string;    // 카테고리
  coordinates: {
    lat: number;       // 위도
    lng: number;       // 경도
  };
  description: string; // 설명
  images?: string[];   // 이미지 리스트 (갤러리용)
  wellnessTips?: string[]; // 웰니스 인사이트/팁 리스트
  icon?: string;       // 커스텀 마커 아이콘 이름
}
