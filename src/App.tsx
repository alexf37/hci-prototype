import { MapProvider } from "react-map-gl";
import { ControlledMap } from "./components/ControlledMap";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient();

export function App({ children }: React.PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <MapProvider>
        <div className="fixed font-sans z-10 h-full w-full p-8 py-safe-10 pointer-events-none flex flex-col gap-4">
          {children}
        </div>
        <ControlledMap></ControlledMap>
        <Toaster />
      </MapProvider>
    </QueryClientProvider>
  );
}
