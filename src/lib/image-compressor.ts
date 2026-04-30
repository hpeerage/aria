/**
 * 브라우저 캔버스를 사용하여 이미지를 리사이징하고 압축합니다.
 * @param base64 원본 Base64 문자열
 * @param maxWidth 최대 가로 너비 (기본 1200px)
 * @param quality JPEG 압축 품질 (0.0 ~ 1.0, 기본 0.7)
 */
export async function compressImage(
  base64: string,
  maxWidth: number = 1000,
  quality: number = 0.6
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // 리사이징 비율 계산
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context is not available"));
        return;
      }

      // 이미지 그리기
      ctx.drawImage(img, 0, 0, width, height);

      // 압축된 Base64 반환 (차세대 형식인 WebP로 변환하여 용량 극대화)
      const compressedBase64 = canvas.toDataURL("image/webp", quality);
      resolve(compressedBase64);
    };

    img.onerror = (err) => {
      reject(err);
    };
  });
}

/**
 * 데이터의 전체 크기를 바이트 단위로 계산합니다.
 */
export function getStorageSize(data: unknown): number {
  const str = typeof data === "string" ? data : JSON.stringify(data);
  return new TextEncoder().encode(str).length;
}
