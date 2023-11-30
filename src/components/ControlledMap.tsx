import {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Marker, type MapRef } from "react-map-gl";
import { Map } from "./Map";
import { LocationMarker } from "./LocationMarker";
import { useGeolocation } from "@uidotdev/usehooks";
import { PinIcon } from "./icons/PinIcon";
import { ConstructionIcon } from "./icons/ConstructionIcon";
import { PoliceIcon } from "./icons/PoliceIcon";
import {
  ReportTypes,
  useStore,
  Report,
  LotTypes,
  ParkingLot,
  lots,
  places,
  Place,
} from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Link, useParams, useRouter } from "@tanstack/react-router";
import { LockIcon } from "./icons/LockIcon";
import { Search } from "lucide-react";

const INITIAL_VIEWPORT = {
  latitude: 38.035629,
  longitude: -78.508403,
  zoom: 17,
};

const lotTypeColors = {
  paid: "#f59e0b",
  permit: "#ef4444",
  free: "#22c55e",
} as const as Record<LotTypes, string>;

const reportTypeIcons = {
  construction: <ConstructionIcon className="w-6 h-6" />,
  police: <PoliceIcon className="w-5 h-5" />,
} as const as Record<ReportTypes, ReactNode>;

function LotMarker({ lot }: { lot: ParkingLot }) {
  const router = useRouter();
  const { id } = useParams(router.routeTree.parentRoute);
  const lotDetailsIsActive = id !== undefined && lot.id.toString() === id;
  return (
    <Marker latitude={lot.location.latitude} longitude={lot.location.longitude}>
      <div className="relative text-white cursor-pointer">
        {lot.type === "permit" && (
          <LockIcon className="absolute z-20 w-5 h-5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        )}
        {lot.type === "paid" && (
          <div className="absolute z-20 text-2xl font-bold left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center leading-4 font-sans">
            $
          </div>
        )}
        {lot.type === "free" && (
          <div className="absolute z-20 text-2xl font-bold left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center leading-4 font-sans">
            P
          </div>
        )}
        <PinIcon
          className="h-14 w-14 text-white pointer-events-auto relative z-10"
          color={lotTypeColors[lot.type]}
        />
      </div>
      {lot.capacity && (
        <div className="h-2 w-10 rounded-full mx-auto bg-white shadow">
          <div
            className="h-full rounded-full bg-blue-400"
            style={{ width: `${lot.capacity * 100}%` }}
          />
        </div>
      )}
      {lotDetailsIsActive && (
        <div className="-space-y-1 text-center font-semibold text-md">
          <div className="pt-2 ">0.4 miles</div>
          <div>5 minutes</div>
        </div>
      )}
    </Marker>
  );
}

function ReportMarker({ report }: { report: Report }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Marker
          latitude={report.location.latitude}
          longitude={report.location.longitude}
        >
          <div className="h-10 w-10 text-white pointer-events-auto cursor-pointer bg-white rounded-full border border-slate-300 grid place-content-center">
            {reportTypeIcons[report.type]}
          </div>
        </Marker>
      </DialogTrigger>
      <DialogContent className="py-8">
        <DialogHeader>
          <DialogTitle className="">
            {report.type === "construction"
              ? "Construction reported"
              : "Police activity reported"}
          </DialogTitle>
          <DialogDescription>
            {report.type === "construction"
              ? "This may slow down nearby traffic or limit parking availability."
              : "This may increase the chances of ticketing in this area. Please be careful when driving or parking here."}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function QueryMarker({ place }: { place: Place }) {
  return (
    <Marker
      latitude={place.location.latitude}
      longitude={place.location.longitude}
    >
      <div className="relative text-slate-500">
        <Search
          strokeWidth={3}
          className="absolute z-20 w-6 h-6 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pb-1"
        />

        <PinIcon className="h-16 w-16 text-white pointer-events-auto cursor-pointer relative z-10" />
      </div>
    </Marker>
  );
}

export function ControlledMap({ children }: PropsWithChildren) {
  const mapRef = useRef<MapRef>(null);
  const { latitude, longitude } = useGeolocation();
  const [mapViewport, setMapViewport] = useState(INITIAL_VIEWPORT);
  const filters = useStore((state) => state.filters);
  const reports = useStore((state) => state.reports);

  const router = useRouter();
  const { query } = useParams(router.routeTree.parentRoute);
  const placeIdx = new Number(query).valueOf();
  const place = places[placeIdx];

  useEffect(() => {
    mapRef.current?.flyTo({
      center: [INITIAL_VIEWPORT.longitude, INITIAL_VIEWPORT.latitude],
    });
  }, []);
  const success = latitude !== null && longitude !== null;
  useEffect(() => {
    if (success)
      setMapViewport((prev) => ({
        ...prev,
        latitude,
        longitude,
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  return (
    <div className="fixed z-0 h-full w-full">
      <Map
        ref={mapRef}
        id="map"
        {...mapViewport}
        onMove={({ viewState: { latitude, longitude, zoom } }) => {
          setMapViewport({ latitude, longitude, zoom });
        }}
        optimizeForTerrain={true}
      >
        {place && <QueryMarker place={place} />}
        {lots.map(
          (lot, idx) =>
            filters[lot.type] &&
            (filters.open ? filters.open === lot.open : true) &&
            (lot.type === "permit"
              ? lot.permit === filters.permit || filters.permit === "All"
              : true) && (
              <Link
                key={lot.id}
                to={`/lot/$id`}
                params={{ id: idx.toString() }}
              >
                <LotMarker lot={lot} />
              </Link>
            )
        )}
        {reports.map((report) => (
          <ReportMarker key={report.location.latitude} report={report} />
        ))}
        {success &&
          [true].map(() => (
            <LocationMarker
              latitude={latitude}
              longitude={longitude}
              // SUUUUUPER hacky way to force a re-render, pls ignore this lol
              key={reports.length}
            />
          ))}
        {children}
      </Map>
    </div>
  );
}
