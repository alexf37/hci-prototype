import { create } from "zustand";

export type Place = {
  id: number;
  name: string;
  isRecent: boolean;
  isSaved: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
};

export const permits = [
  "All",
  "None",
  "A2",
  "B2",
  "B5",
  "E3",
  "E4",
  "F10",
  "G6",
  "S6",
  "T3",
  "T4",
  "Red",
] as const;
export type Permit = (typeof permits)[number];

export const places: Place[] = [
  {
    id: 0,
    name: "Rice Hall",
    isRecent: false,
    isSaved: true,
    location: {
      latitude: 38.031979,
      longitude: -78.511192,
    },
    address: "85 Engineer's Way, Charlottesville, VA 22904",
  },
  {
    id: 1,
    name: "Ridley Hall",
    isRecent: false,
    isSaved: false,
    location: {
      latitude: 38.034851,
      longitude: -78.509308,
    },
    address: "405 Emmet St S, Charlottesville, VA 22904",
  },
  {
    id: 2,
    name: "Richmond, VA",
    isRecent: false,
    isSaved: false,
    location: {
      latitude: 37.540726,
      longitude: -77.43605,
    },
    address: "Richmond, VA",
  },
  {
    id: 3,
    name: "Olsson Hall",
    isRecent: false,
    isSaved: true,
    location: {
      latitude: 38.0321969,
      longitude: -78.5106805,
    },
    address: "151 Engineer's Way, Charlottesville, VA 22904",
  },
  {
    id: 4,
    name: "Thornton Hall",
    isRecent: false,
    isSaved: true,
    location: {
      latitude: 38.03286,
      longitude: -78.50996,
    },
    address: "351 McCormick Rd, Charlottesville, VA 22904",
  },
  {
    id: 5,
    name: "Clemons Library",
    isRecent: true,
    isSaved: false,
    location: {
      latitude: 38.0363754,
      longitude: -78.5061131,
    },
    address: "1328 McCormick Rd, Charlottesville, VA 22904",
  },
  {
    id: 6,
    name: "Wilson Hall",
    isRecent: true,
    isSaved: false,
    location: {
      latitude: 38.0324774,
      longitude: -78.504062,
    },
    address: "114 McCormick Rd, Charlottesville, VA 22904",
  },
  {
    id: 7,
    name: "Aquatic & Fitness Center",
    isRecent: true,
    isSaved: false,
    location: {
      latitude: 38.0329403,
      longitude: -78.5134577,
    },
    address: "450 Whitehead Rd, Charlottesville, VA 22904",
  },
];

export const lotTypes = ["free", "paid", "permit"] as const;
export type LotTypes = (typeof lotTypes)[number];

export type ParkingLot = {
  id: number;
  name: string;
  type: LotTypes;
  permit?: Permit;
  open: boolean;
  capacity?: number;
  location: {
    latitude: number;
    longitude: number;
  };
};

export const lots: ParkingLot[] = [
  {
    id: 0,
    name: "Central Grounds Garage",
    type: "paid",
    open: true,
    capacity: 0.8,
    location: {
      latitude: 38.036319,
      longitude: -78.507547,
    },
  },
  {
    id: 1,
    name: "East A",
    type: "permit",
    permit: "A2",
    open: true,
    capacity: 0.4,
    location: {
      latitude: 38.031566,
      longitude: -78.511971,
    },
  },
  {
    id: 2,
    name: "South Lot",
    type: "free",
    open: true,
    capacity: 0.7,
    location: {
      latitude: 38.030935,
      longitude: -78.511463,
    },
  },
  {
    id: 3,
    name: "Small Lot",
    type: "permit",
    permit: "B2",
    open: false,
    capacity: 0.5,
    location: {
      latitude: 38.032078,
      longitude: -78.511774,
    },
  },
  {
    id: 4,
    name: "Life Sciences Lot",
    type: "paid",
    open: true,
    capacity: 0.2,
    location: {
      latitude: 38.032395,
      longitude: -78.512439,
    },
  },
];

export const INITIAL_VIEWPORT = {
  latitude: 38.035629,
  longitude: -78.508403,
  zoom: 14,
};

export type Filters = {
  free: boolean;
  paid: boolean;
  permit: Permit;
  open: boolean;
};

export type Viewport = {
  latitude: number;
  longitude: number;
  zoom: number;
};

export type Report = {
  type: ReportTypes;
  location: {
    latitude: number;
    longitude: number;
  };
};

export const reportTypes = ["construction", "police"] as const;
export type ReportTypes = (typeof reportTypes)[number];

export type Store = {
  filters: Filters;
  updateFilters: (to: Filters) => void;
  viewport: Viewport;
  setViewport: (to: Viewport) => void;
  reports: Report[];
  setReports: (to: Report[]) => void;
};

export const useStore = create<Store>((set) => ({
  filters: {
    free: true,
    paid: true,
    permit: "All",
    open: false,
  },
  viewport: INITIAL_VIEWPORT,
  reports: [
    {
      type: "construction",
      location: {
        latitude: 38.030569,
        longitude: -78.511776,
      },
    },
  ],
  updateFilters: (to) => set({ filters: to }),
  setViewport: (to) => set({ viewport: to }),
  setReports: (to) => set({ reports: to }),
}));
