import { ReportsMenu } from "./components/ReportsMenu";
import { LocationIcon } from "./components/icons/LocationIcon";
import { useMap } from "react-map-gl";
import { useGeolocation } from "@uidotdev/usehooks";
import { Command, CommandInput } from "./components/ui/command";
import { useRouter } from "@tanstack/react-router";
import { FilterButton } from "./components/FilterButton";

export function Home() {
  const router = useRouter();
  const { map: mapRef } = useMap();
  const { latitude, longitude } = useGeolocation();

  function flyToCurrentLocation() {
    if (longitude === null || latitude === null) return;
    mapRef?.flyTo({
      center: [longitude, latitude],
      zoom: 18,
      speed: 3,
    });
  }

  return (
    <>
      <div className="pointer-events-auto">
        <Command shouldFilter={false} className="bg-transparent">
          <CommandInput
            placeholder="Find parking near..."
            onClick={() => router.navigate({ to: "/search" })}
          />
        </Command>
      </div>
      <div className="h-full justify-between flex flex-col">
        <div className="flex w-full justify-end">
          <FilterButton />
        </div>
        <div className="flex w-full justify-between items-end">
          <button
            type="button"
            className="bg-white h-min rounded-full pointer-events-auto grid place-content-center p-2.5 pt-3.5 pr-3.5 drop-shadow border border-slate-200"
            onClick={flyToCurrentLocation}
          >
            <LocationIcon className="w-7 h-7" />
          </button>

          <ReportsMenu />
        </div>
      </div>
    </>
  );
}
