import { MetadataRoute } from 'next';
import { getPlacesFromGoogleSheet } from '@/lib/google-sheets';

const SHEET_ID = '1Setffm27HQ8LyOM3N9o9V8eA0ihGbZeZgN763jkm1WU';
const BASE_URL = 'https://hpeerage.github.io/aria';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const places = await getPlacesFromGoogleSheet(SHEET_ID);
  
  const placeUrls = places.map((place) => ({
    url: `${BASE_URL}/places/${place.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    ...placeUrls,
  ];
}
