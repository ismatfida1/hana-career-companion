import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Link, Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CareerPath from "./pages/CareerPath";
import AdventureHome from "./pages/AdventureHome";
import Research from "./pages/Research";
import Projects from "./pages/Projects";
import Opportunities from "./pages/Opportunities";
import HanaChat from "./pages/HanaChat";
import CareerHub from "./pages/CareerHub";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/roadmap" component={Home} />
      <Route path="/mission" component={Home} />
      <Route path="/projects" component={Projects} />
      <Route path="/opportunities" component={Opportunities} />
      <Route path="/chat" component={HanaChat} />
      <Route path="/research" component={Research} />
      <Route path="/profile" component={Home} />
      <Route path="/settings" component={Home} />
      <Route path="/onboarding" component={Home} />
      <Route path="/path" component={CareerPath} />
      <Route path="/career-path" component={CareerPath} />
      <Route path="/journey" component={CareerHub} />
      <Route path="/legacy-adventure" component={AdventureHome} />
      <Route path="/:rest*" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function BackToAdventure() {
  const [location] = useLocation();
  if (location === "/") return null;
  return <Link href="/" className="fixed bottom-4 left-4 z-[80] inline-flex items-center gap-2 rounded-full border border-[#d9cfc2] bg-[#fffaf4]/95 px-4 py-2 text-xs font-bold text-[#315d58] shadow-[0_10px_30px_rgba(49,44,35,.15)] backdrop-blur-xl transition hover:bg-white">← Back to title</Link>;
}

function DynamicDateFix() {
  const [location] = useLocation();
  useEffect(() => {
    const current = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date());
    const short = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(new Date());
    const replace = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      while (walker.nextNode()) nodes.push(walker.currentNode as Text);
      nodes.forEach(node => {
        if (node.nodeValue?.includes("Tuesday, October 15")) node.nodeValue = node.nodeValue.replaceAll("Tuesday, October 15", short);
        if (node.nodeValue?.includes("October 15, 2024")) node.nodeValue = node.nodeValue.replaceAll("October 15, 2024", current);
      });
    };
    replace();
    const observer = new MutationObserver(replace);
    observer.observe(document.body, { subtree: true, childList: true });
    return () => observer.disconnect();
  }, [location]);
  return null;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light" switchable><TooltipProvider><Toaster/><Router/><BackToAdventure/><DynamicDateFix/></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
