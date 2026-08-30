import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Link, Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AdventureHome from "./pages/AdventureHome";
import CareerHub from "./pages/CareerHub";
import Home from "./pages/Home";
import CareerPath from "./pages/CareerPath";
import JourneyStart from "./pages/JourneyStart";
import Research from "./pages/Research";
import Projects from "./pages/Projects";
import Opportunities from "./pages/Opportunities";
import HanaChat from "./pages/HanaChat";

function Router() {
  return (
    <Switch>
      <Route path="/" component={AdventureHome} />
      <Route path="/journey" component={CareerHub} />
      <Route path="/path" component={CareerPath} />
      <Route path="/career-path" component={CareerPath} />
      <Route path="/projects" component={Projects} />
      <Route path="/opportunities" component={Opportunities} />
      <Route path="/research" component={Research} />
      <Route path="/chat" component={HanaChat} />
      <Route path="/home" component={Home} />
      <Route path="/:rest*" component={CareerHub} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function BackButton() {
  const [location] = useLocation();
  if (location === "/") return null;
  return <button onClick={() => window.history.back()} className="fixed bottom-4 left-4 z-50 inline-flex items-center gap-2 rounded-full border border-[#d9cfc2] bg-[#fffaf4]/95 px-4 py-2 text-xs font-semibold text-[#315d58] shadow-[0_10px_30px_rgba(49,44,35,.12)] backdrop-blur transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7eafa0]">← Back</button>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light" switchable><TooltipProvider><Toaster /><Router /><BackButton /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
