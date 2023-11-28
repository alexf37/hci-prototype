import { useState } from "react";
import { FlagIcon } from "./icons/FlagIcon";
import { ConstructionIcon } from "./icons/ConstructionIcon";
import { PoliceIcon } from "./icons/PoliceIcon";
import { CloseIcon } from "./icons/CloseIcon";
import { useGeolocation } from "@uidotdev/usehooks";
import { Report, useStore } from "@/lib/store";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CLASSNAME =
  "bg-white rounded-full pointer-events-auto grid place-content-center p-3 drop-shadow border border-slate-200";

export function ReportsMenu() {
  const [open, setOpen] = useState(false);
  const { latitude, longitude } = useGeolocation();
  const success = latitude !== null && longitude !== null;
  const reports = useStore((state) => state.reports);
  const setReports = useStore((state) => state.setReports);
  function addReport(type: Report["type"]) {
    if (!success) return;
    setReports([
      ...reports,
      {
        type,
        location: {
          latitude,
          longitude,
        },
      },
    ]);
    setOpen(false);
  }
  return (
    <div className="flex flex-col items-end justify-end gap-2 ml-auto">
      {open && (
        <ul className="space-y-2">
          <li className={CLASSNAME}>
            <AlertDialog>
              <AlertDialogTrigger>
                <ConstructionIcon className="w-7 h-7" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will mark your location as an ongoing construction
                    site. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => addReport("construction")}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </li>
          <li className={CLASSNAME}>
            <AlertDialog>
              <AlertDialogTrigger>
                <PoliceIcon className="w-7 h-7" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will show police activity at your location on the map.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => addReport("police")}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </li>
        </ul>
      )}
      <button
        type="button"
        className={CLASSNAME}
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <CloseIcon className="w-7 h-7" />
        ) : (
          <FlagIcon className="w-7 h-7" />
        )}
      </button>
    </div>
  );
}
