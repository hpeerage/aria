import HomeClient from "@/components/HomeClient";
import { getPlacesFromGoogleSheet } from "@/lib/google-sheets";

export default async function Home() {
  const places = await getPlacesFromGoogleSheet('1Setffm27HQ8LyOM3N9o9V8eA0ihGbZeZgN763jkm1WU');

  return <HomeClient places={places} />;
}
