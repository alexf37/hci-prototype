import { useParams, useRouter } from "@tanstack/react-router";
import { LeftChevronIcon } from "./components/icons/LeftChevron";
import { places } from "./lib/store";
import { useEffect } from "react";
import { useMap } from "react-map-gl";
import { Search } from "lucide-react";
import { FilterButton } from "./components/FilterButton";

export function SearchResults() {
  const router = useRouter();
  const { query } = useParams(router.routeTree.parentRoute);
  const placeIdx = parseInt(query);
  const place = places[placeIdx];

  const { map: mapRef } = useMap();
  useEffect(() => {
    const speed = 3;
    const oldMapViewport = {
      center: mapRef?.getCenter(),
      zoom: mapRef?.getZoom(),
    };
    mapRef?.flyTo({
      center: [place.location.longitude, place.location.latitude],
      zoom: 17,
      speed,
    });
    return () => {
      mapRef?.flyTo({
        center: oldMapViewport.center,
        zoom: oldMapViewport.zoom,
        speed,
      });
    };
  }, [place.location.latitude, place.location.longitude, mapRef]);

  return (
    <div className="h-full w-full flex flex-col justify-between">
      <button
        className="py-2.5 px-3.5 pointer-events-auto bg-white border text-sm border-slate-300 shadow rounded-xl flex text-slate-900 items-center gap-1 w-full"
        onClick={() => router.history.back()}
      >
        <Search className="w-4 h-4 text-slate-500 mr-1" />
        Results near <span className="font-semibold">{place.name}</span>
      </button>
      <div className="flex justify-between items-end">
        <button
          type="button"
          className="py-2.5 px-3.5 h-fit pointer-events-auto bg-white border text-sm font-medium border-slate-300 shadow rounded-xl flex text-slate-900 items-center gap-1"
          onClick={() => router.history.back()}
        >
          <LeftChevronIcon className="w-5 h-5" />
          Back
        </button>
        <FilterButton />
      </div>
    </div>
  );
}
