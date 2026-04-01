import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '정선 아리아 (Jeongseon Aria)',
    short_name: '정선 아리아',
    description: '정선 웰니스 관광 큐레이션 플랫폼',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#13342b',
    icons: [
      {
        src: '/aria/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/aria/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
