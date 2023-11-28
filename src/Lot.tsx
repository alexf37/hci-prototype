import { useParams, useRouter } from "@tanstack/react-router";
import { Drawer } from "vaul";
import { lots } from "./lib/store";
import { LeftChevronIcon } from "./components/icons/LeftChevron";
import { useMap } from "react-map-gl";
import { useEffect } from "react";

export function Lot() {
  const router = useRouter();
  const { id } = useParams(router.routeTree.parentRoute);
  const lotIdx = parseInt(id);
  const lot = lots[lotIdx];

  const { map: mapRef } = useMap();
  useEffect(() => {
    const speed = 3;
    const oldMapViewport = {
      center: mapRef?.getCenter(),
      zoom: mapRef?.getZoom(),
    };
    mapRef?.flyTo({
      center: [lot.location.longitude, lot.location.latitude],
      zoom: 18,
      offset: [0, -200],
      speed,
    });
    return () => {
      mapRef?.flyTo({
        center: oldMapViewport.center,
        zoom: oldMapViewport.zoom,
        speed,
      });
    };
  }, [lot.location.latitude, lot.location.longitude, mapRef]);

  return (
    <div className="h-full w-full">
      <button
        type="button"
        className="py-2.5 px-3.5 pointer-events-auto bg-white border text-sm font-medium border-slate-300 shadow rounded-xl flex text-slate-900 items-center gap-1"
        onClick={() => router.history.back()}
      >
        <LeftChevronIcon className="w-5 h-5" />
        Back
      </button>

      <Drawer.Root open={true} dismissible={false}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 max-h-[55%] h-full">
            <button
              type="button"
              className="bg-green-500 border border-green-200 text-white px-4 py-2.5 rounded-full shadow-lg text-3xl font-bold mb-3 ml-4"
              onClick={() => {
                window.open(
                  "https://maps.google.com?q=" +
                    lot.location.latitude +
                    "," +
                    lot.location.longitude,
                  "_blank"
                );
              }}
            >
              GO
            </button>
            <div className="bg-white border border-slate-300 flex flex-col rounded-t-2xl h-full pt-4 shadow-2xl">
              <div className="overflow-y-auto">
                <div className="max-w-md w-full mx-auto flex flex-col p-4 px-8 h-full">
                  <h1 className="font-semibold text-3xl">{lot.name}</h1>
                </div>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}
