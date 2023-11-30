import { useParams, useRouter } from "@tanstack/react-router";
import { Drawer } from "vaul";
import { lots } from "./lib/store";
import { LeftChevronIcon } from "./components/icons/LeftChevron";
import { useMap } from "react-map-gl";
import React, { useEffect, useState } from "react";
import { CategoryBar } from "@tremor/react";
import { BarChart } from "@tremor/react";
import { SavedIcon } from "./components/icons/SavedIcon";
import { useToast } from "./components/ui/use-toast";

type LotDetailProps = React.PropsWithChildren<{
  label: string;
}>;

const chartdata4 = [
  {
    date: "12AM",
    "% Capacity": 25,
  },
  {
    date: "2AM",
    "% Capacity": 16,
  },
  {
    date: "4AM",
    "% Capacity": 29,
  },
  {
    date: "6AM",
    "% Capacity": 45,
  },
  {
    date: "8AM",
    "% Capacity": 53,
  },
  {
    date: "10AM",
    "% Capacity": 58,
  },
  {
    date: "12PM",
    "% Capacity": 64,
  },
  {
    date: "2PM",
    "% Capacity": 56,
  },
  {
    date: "4PM",
    "% Capacity": 62,
  },
  {
    date: "6PM",
    "% Capacity": 40,
  },
  {
    date: "8PM",
    "% Capacity": 32,
  },
  {
    date: "10PM",
    "% Capacity": 21,
  },
];

function LotDetail({ children, label }: LotDetailProps) {
  return (
    <div className="py-2">
      <div className="flex justify-between items-center">
        <div className="text-slate-500">{label}</div>
        <div className="font-semibold">{children}</div>
      </div>
    </div>
  );
}

export function Lot() {
  const router = useRouter();
  const { id } = useParams(router.routeTree.parentRoute);
  const lotIdx = parseInt(id);
  const lot = lots[lotIdx];

  const { toast } = useToast();

  const [saved, setSaved] = useState(false);

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
          <Drawer.Content className="fixed bottom-16 left-0 right-0 max-h-[50%] h-full !outline-none">
            <div className="flex justify-between w-full px-4 pb-3 items-end">
              <button
                type="button"
                className="bg-green-500 border border-green-200 text-white px-4 py-2.5 rounded-full shadow-lg text-3xl font-bold"
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
              {lot.type === "paid" && (
                <button
                  type="button"
                  className="bg-green-500 border border-green-200 text-white px-4 py-2.5 rounded-full shadow-lg text-xl font-bold"
                  onClick={() => {
                    window.open(
                      "https://parkmobile.app.link/SYLSYDYShR",
                      "_blank"
                    );
                  }}
                >
                  <span className="text-slate-800 font-semibold">Pay with</span>{" "}
                  ParkMobile
                </button>
              )}
            </div>
            <div className="bg-white border border-slate-300 flex flex-col rounded-t-2xl pt-4 shadow-2xl h-full">
              <div className="overflow-y-auto">
                <div className="max-w-md w-full mx-auto flex flex-col p-4 px-8 h-full">
                  <div className="flex justify-between items-center pb-2">
                    <h1 className="font-semibold text-3xl">{lot.name}</h1>
                    <SavedIcon
                      filled={saved}
                      className="w-6 h-6 cursor-pointer"
                      onClick={() => {
                        toast({
                          title: saved ? "Lot unsaved" : "Lot saved",
                          description: `${
                            saved
                              ? `Removed ${lot.name} from`
                              : `Added ${lot.name} to`
                          } your saved lots.`,
                          className: "rounded-xl",
                        });
                        setSaved(!saved);
                      }}
                    />
                  </div>
                  <div className="divide-y divide-slate-300">
                    {lot.type !== "permit" && (
                      <LotDetail label="Price">
                        {lot.type === "free" ? "Free" : "$4.00/hr"}
                      </LotDetail>
                    )}
                    {lot.type === "permit" && (
                      <LotDetail label="Permit(s)">{lot.permit}</LotDetail>
                    )}
                    <LotDetail label="Time limit">3hrs</LotDetail>
                    <LotDetail label="Hours">5pm-8pm, Mon-Fri</LotDetail>
                    <LotDetail label="Current Capacity">
                      {lot.capacity ? `${lot.capacity * 100}%` : "Unavailable"}
                    </LotDetail>
                    <div className="py-2">
                      <div className="text-slate-500">Activity</div>
                      <BarChart
                        className="pt-4 h-24"
                        data={chartdata4}
                        index="date"
                        categories={["% Capacity"]}
                        colors={["blue"]}
                        showYAxis={false}
                        showLegend={false}
                        showGridLines={false}
                        showTooltip={false}
                      />
                    </div>
                    <div className="pt-3 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="text-slate-500">Towing Probability</div>
                        <div className="font-semibold">62%</div>
                      </div>
                      <CategoryBar
                        values={[40, 30, 20, 10]}
                        colors={["emerald", "yellow", "orange", "rose"]}
                        markerValue={62}
                        className="pt-3"
                      />
                    </div>
                    <div className="py-2 pb-8">
                      <div className="flex items-center justify-between">
                        <div className="text-slate-500">
                          Ticketing Probability
                        </div>
                        <div className="font-semibold">27%</div>
                      </div>
                      <CategoryBar
                        values={[40, 30, 20, 10]}
                        colors={["emerald", "yellow", "orange", "rose"]}
                        markerValue={27}
                        className="pt-3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}
