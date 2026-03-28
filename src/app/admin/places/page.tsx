import { getPlacesFromGoogleSheet } from "@/lib/google-sheets";
import AriaPlacesList from "@/components/admin/AriaPlacesList";
import AriaMap from "@/components/AriaMap";

export default async function AdminPlacesPage() {
  const places = await getPlacesFromGoogleSheet('1Setffm27HQ8LyOM3N9o9V8eA0ihGbZeZgN763jkm1WU');

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="flex justify-between items-center bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl">
        <div className="space-y-2">
          <h3 className="text-3xl font-black text-white tracking-tighter">Place Explorer</h3>
          <p className="text-white/40 text-sm font-bold">Manage and monitor all 82 wellness assets in real-time.</p>
        </div>
        <button className="px-8 py-4 bg-accent text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-forest transition-all shadow-xl shadow-accent/20">
          + Registry New Asset
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3 px-6">
          <div className="w-1.5 h-6 bg-accent rounded-full" />
          <h4 className="text-xl font-bold text-white uppercase tracking-widest">Map Visualization</h4>
        </div>
        <AriaMap places={places} />
      </div>

      <AriaPlacesList initialPlaces={places} />
    </div>
  );
}
