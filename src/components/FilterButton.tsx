import { useStore } from "@/lib/store";
import { FilterModal } from "./FilterModal";
import { FilterIcon } from "./icons/FilterIcon";

export function FilterButton() {
  const filters = useStore((state) => state.filters);
  const filterCount = Object.values(filters).filter((val) => {
    if (typeof val === "string") {
      return val !== "None";
    }
    return val;
  }).length;
  return (
    <FilterModal>
      <button
        type="button"
        className="bg-white relative rounded-full pointer-events-auto grid place-content-center p-3 drop-shadow border border-slate-200"
      >
        <FilterIcon className="w-7 h-7" />
        {filterCount > 0 && (
          <div className="rounded-full text-white w-5 h-5 bg-red-500 absolute -bottom-1 -right-1 text-sm">
            {filterCount}
          </div>
        )}
      </button>
    </FilterModal>
  );
}
