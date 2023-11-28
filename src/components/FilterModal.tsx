import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import { Filters, Permit, permits, useStore } from "@/lib/store";

export function FilterModal({ children }: React.PropsWithChildren) {
  const filters = useStore((state) => state.filters);
  const updateStore = useStore((state) => state.updateFilters);
  function updateFilters(newstate: Partial<Filters>) {
    updateStore({
      ...filters,
      ...newstate,
    });
  }
  return (
    <Dialog>
      <DialogTrigger className="bg-white rounded-full pointer-events-auto grid place-content-center p-3 drop-shadow border border-slate-200">
        {children}
      </DialogTrigger>
      <DialogContent className="rounded-xl">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl">Filters</DialogTitle>
          <DialogDescription className="">
            Select which parking lots you would like to see on the map.
          </DialogDescription>
          <ul className="space-y-3 pt-2">
            <li className="flex justify-between items-center font-medium">
              <h3>Free</h3>
              <Checkbox
                className="w-5 h-5"
                checked={filters.free}
                onClick={() => updateFilters({ free: !filters.free })}
              />
            </li>
            <li className="flex justify-between items-center font-medium pt-2">
              <h3>Paid</h3>
              <Checkbox
                className="w-5 h-5"
                checked={filters.paid}
                onClick={() => updateFilters({ paid: !filters.paid })}
              />
            </li>
            <li className="flex justify-between items-center font-medium">
              <h3>Permit</h3>
              <Select
                defaultValue={filters.permit}
                onValueChange={(val: Permit) => {
                  updateFilters({ permit: val });
                }}
              >
                <SelectTrigger className="w-[80px] h-9">
                  <SelectValue placeholder="Choose" />
                </SelectTrigger>
                <SelectContent>
                  {permits.map((permit) => (
                    <SelectItem key={permit} value={permit}>
                      {permit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </li>
            <li className="flex justify-between items-center font-medium">
              <h3>Open Now</h3>
              <Checkbox
                className="w-5 h-5"
                checked={filters.open}
                onClick={() => updateFilters({ open: !filters.open })}
              />
            </li>
          </ul>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
