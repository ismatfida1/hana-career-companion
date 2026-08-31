import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AdventureHome from "./pages/AdventureHome";
import JourneyStart from "./pages/JourneyStart";
import Home from "./pages/Home";
import CareerPath from "./pages/CareerPath";
import MissionScene from "./pages/MissionScene";
import Research from "./pages/Research";
import Projects from "./pages/Projects";
import Opportunities from "./pages/Opportunities";
import HanaChat from "./pages/HanaChat";
import CareerHub from "./pages/CareerHub";

function Router() {
  const base = typeof window !== "undefined" && window.location.hostname.endsWith("github.io") ? "/hana-career-companion" : "";
  return <WouterRouter base={base}><Switch>
    <Route path="/" component={AdventureHome} />
    <Route path="/roadmap" component={CareerPath} />
    <Route path="/mission" component={MissionScene} />
    <Route path="/projects" component={Projects} />
    <Route path="/opportunities" component={Opportunities} />
    <Route path="/chat" component={HanaChat} />
    <Route path="/research" component={Research} />
    <Route path="/profile" component={CareerHub} />
    <Route path="/settings" component={CareerHub} />
    <Route path="/onboarding" component={JourneyStart} />
    <Route path="/path" component={JourneyStart} />
    <Route path="/career-path" component={CareerPath} />
    <Route path="/journey" component={CareerHub} />
    <Route path="/adventure" component={AdventureHome} />
    <Route path="/legacy-adventure" component={AdventureHome} />
    <Route path="/:rest*" component={NotFound} />
    <Route component={NotFound} />
  </Switch></WouterRouter>;
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
  return <ErrorBoundary><ThemeProvider defaultTheme="light" switchable><TooltipProvider><Toaster/><Router/><DynamicDateFix/></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
