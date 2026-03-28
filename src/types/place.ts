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
}
