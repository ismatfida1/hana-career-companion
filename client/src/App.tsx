import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CareerPath from "./pages/CareerPath";
import AdventureHome from "./pages/AdventureHome";
import { Link } from "wouter";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/roadmap" component={Home} />
      <Route path="/mission" component={Home} />
      <Route path="/projects" component={Home} />
      <Route path="/opportunities" component={Home} />
      <Route path="/chat" component={Home} />
      <Route path="/profile" component={Home} />
      <Route path="/settings" component={Home} />
      <Route path="/onboarding" component={Home} />
      <Route path="/path" component={CareerPath} />
      <Route path="/career-path" component={CareerPath} />
      <Route path="/journey" component={AdventureHome} />
      <Route path="/404" component={NotFound} />
      <Route component={Home} />
    </Switch>
  );
}

function BackToAdventure() {
  const [location] = useLocation();
  if (location === "/") return null;
  return <Link href="/" className="fixed bottom-4 left-4 z-[80] inline-flex items-center gap-2 rounded-full border border-[#d9cfc2] bg-[#fffaf4]/95 px-4 py-2 text-xs font-bold text-[#315d58] shadow-[0_10px_30px_rgba(49,44,35,.15)] backdrop-blur-xl transition hover:bg-white">← Back to title</Link>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light" switchable><TooltipProvider><Toaster/><Router/><BackToAdventure/></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
