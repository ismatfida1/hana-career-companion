import type { ReactNode } from "react";
import { ArrowLeft, Home, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";

const pageWorlds = {
  "/roadmap": { world: "Code Forge", image: "/assets/worlds/code-forge.svg" },
  "/mission": { world: "Code Forge", image: "/assets/worlds/code-forge.svg" },
  "/career-path": { world: "Code Forge", image: "/assets/worlds/code-forge.svg" },
  "/path": { world: "Origin Village", image: "/assets/worlds/origin-village.svg" },
  "/onboarding": { world: "Origin Village", image: "/assets/worlds/origin-village.svg" },
  "/projects": { world: "Weblands", image: "/assets/worlds/webwilds.svg" },
  "/opportunities": { world: "Summit of Builders", image: "/assets/worlds/beacon-summit.svg" },
  "/research": { world: "Cloudspire", image: "/assets/worlds/skyforge.svg" },
  "/chat": { world: "Origin Village", image: "/assets/worlds/origin-village.svg" },
  "/journey": { world: "Origin Village", image: "/assets/worlds/origin-village.svg" },
  "/profile": { world: "Origin Village", image: "/assets/worlds/origin-village.svg" },
  "/settings": { world: "Origin Village", image: "/assets/worlds/origin-village.svg" },
} as const;

export default function HanaGameFrame({ children, title }: { children: ReactNode; title: string }) {
  const [location] = useLocation();
  const baseLocation = location.split("?")[0];
  const world = pageWorlds[baseLocation as keyof typeof pageWorlds] ?? pageWorlds["/roadmap"];

  const goBack = () => {
    if (typeof window === "undefined") return;
    if (document.referrer.startsWith(window.location.origin) && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.assign(baseLocation === "/roadmap" ? "/" : "/roadmap");
    }
  };

  return (
    <main className="hana-game-frame" data-world={world.world}>
      <div className="hana-game-backdrop" aria-hidden="true">
        <img src={world.image} alt="" className="hana-game-backdrop-art" />
        <div className="hana-game-backdrop-shade" />
        <div className="hana-game-backdrop-vignette" />
        <div className="hana-game-stars" />
      </div>

      <header className="hana-game-nav">
        <div className="hana-game-nav-inner">
          <button type="button" onClick={goBack} aria-label="Go back" className="hana-game-nav-button">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <Link href="/" className="hana-game-brand" aria-label="Hana home">
            <Sparkles className="h-4 w-4" />
            <span>HANA</span>
          </Link>
          <div className="hana-game-nav-title">
            <span>{world.world}</span>
            <strong>{title}</strong>
          </div>
          <Link href="/" aria-label="Home" className="hana-game-nav-button">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
        </div>
      </header>

      <div className="hana-game-shell">
        <section className="hana-game-world" aria-label={`${world.world} world`}>
          <div className="hana-game-world-copy">
            <span>Hana adventure · {world.world}</span>
            <h1>{title}</h1>
            <p>One clear step at a time. Hana will guide you through this world.</p>
          </div>
          <div className="hana-game-companion" aria-label="Hana, your companion">
            <img src="/assets/hana-phase1-approved-opening.png" alt="Hana, your companion" loading="eager" />
          </div>
        </section>

        <div className="hana-game-content">{children}</div>
      </div>
    </main>
  );
}
