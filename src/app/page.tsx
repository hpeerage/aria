import HomeClient from "@/components/HomeClient";
import { getPlacesFromGoogleSheet } from "@/lib/google-sheets";

export default async function Home() {
  const places = await getPlacesFromGoogleSheet();

  return <HomeClient places={places} />;
}
