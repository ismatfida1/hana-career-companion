import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import EmergencyHana from "./pages/EmergencyHana";

export default function App() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <Toaster />
        <EmergencyHana />
      </TooltipProvider>
    </ErrorBoundary>
  );
}
