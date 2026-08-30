import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Link, Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CareerPath from "./pages/CareerPath";
import JourneyStart from "./pages/JourneyStart";

function Router() {
  return (
    <Switch>
      <Route path="/" component={JourneyStart} />
      <Route path="/path" component={CareerPath} />
      <Route path="/home" component={Home} />
      <Route path="/:rest*" component={Home} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function CareerPathShortcut() {
  const [location] = useLocation();
  if (location === "/" || location === "/path") return null;
  return (
    <Link href="/path" className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-[#d9cfc2] bg-[#fffaf4]/95 px-4 py-2 text-xs font-semibold text-[#315d58] shadow-[0_10px_30px_rgba(49,44,35,.12)] backdrop-blur transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7eafa0]">
      Choose path
    </Link>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
          <CareerPathShortcut />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
