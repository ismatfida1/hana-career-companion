import { useLocation } from "wouter";
import { careerCatalog, defaultCareerPath, type CareerPathId } from "@/data/careerCatalog";
import { useEffect, useState } from "react";

const worlds = [
  { name: "Origin Village", icon: "🌱", label: "Roadmap", href: "/roadmap" },
  { name: "Code Forge", icon: "⚒️", label: "Projects", href: "/projects" },
  { name: "Webwilds", icon: "🌐", label: "Opportunities", href: "/opportunities" },
  { name: "Skyforge", icon: "☁️", label: "Research", href: "/research" },
  { name: "Beacon Summit", icon: "🏔️", label: "Ask Hana", href: "/chat" },
] as const;

export default function JourneyStart() {
  const [, navigate] = useLocation();
  const [selectedPath, setSelectedPath] = useState<CareerPathId | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("hana-career-path") as CareerPathId | null;
    setSelectedPath(stored);
    setIsLoaded(true);
  }, []);

  const currentPath = careerCatalog.find(p => p.id === selectedPath)
    ?? careerCatalog.find(p => p.id === defaultCareerPath)
    ?? careerCatalog[0];

  const choosePath = (id: CareerPathId) => {
    localStorage.setItem("hana-career-path", id);
    setSelectedPath(id);
    navigate("/roadmap");
  };

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#07131d] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/worlds/origin-village.svg')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#06131e]/20 via-[#06131e]/45 to-[#06131e]/90" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_0%,rgba(3,10,15,.18)_55%,rgba(3,10,15,.72)_100%)]" aria-hidden="true" />

      <div className="relative z-10 mx-auto min-h-[100svh] w-full max-w-6xl px-4 py-5 sm:px-6 md:py-8">
        <header className={`flex items-center justify-between gap-3 transition-all duration-700 ${isLoaded ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"}`}>
          <button type="button" onClick={() => navigate("/")} className="rounded-full border border-white/15 bg-[#071722]/45 px-4 py-2 text-xs font-semibold text-white/70 backdrop-blur-md transition hover:border-[#f1c77b]/50 hover:text-white">
            ← Back
          </button>
          <span className="rounded-full border border-[#f1c77b]/35 bg-[#071722]/45 px-4 py-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#f1c77b] backdrop-blur-md">
            The adventure begins
          </span>
        </header>

        <section className={`mx-auto mt-10 max-w-4xl text-center transition-all duration-700 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}>
          <p className="text-[10px] font-bold uppercase tracking-[.42em] text-[#f1c77b] drop-shadow-md">Choose your destiny</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-wide text-white drop-shadow-[0_5px_24px_rgba(0,0,0,.75)] sm:text-6xl">
            Welcome, adventurer.
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/80 drop-shadow-md sm:text-base">
            Hana has opened five worlds for your CS journey. Choose a direction, then explore one quest at a time.
          </p>
        </section>

        <section className={`mx-auto mt-8 max-w-4xl rounded-[30px] border border-[#f1c77b]/25 bg-[#071722]/58 p-4 shadow-2xl backdrop-blur-xl transition-all duration-700 delay-100 sm:p-6 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-xs font-bold uppercase tracking-[.2em] text-[#f1c77b]">Choose your path</h2>
            <span className="text-[10px] uppercase tracking-wider text-white/35">{currentPath.shortTitle}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
            {careerCatalog.slice(0, 6).map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => choosePath(item.id)}
                className={`rounded-full border px-4 py-2.5 text-xs font-bold transition-all duration-200 ${currentPath.id === item.id ? "border-[#f1c77b] bg-[#f1c77b] text-[#13232b] shadow-[0_0_24px_rgba(241,199,123,.25)]" : "border-white/15 bg-white/[.05] text-white/75 hover:border-[#f1c77b]/45 hover:bg-[#f1c77b]/10 hover:text-white"}`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </section>

        <section className={`mx-auto mt-5 flex max-w-4xl items-center gap-3 rounded-[26px] border border-white/10 bg-[#071722]/50 p-4 shadow-xl backdrop-blur-xl transition-all duration-700 delay-200 ${isLoaded ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#f1c77b]/35 bg-gradient-to-b from-[#f1c77b] to-[#c9974d] text-3xl shadow-[0_0_24px_rgba(241,199,123,.18)]">🤖</div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-[#f1c77b]/80">Hana says</p>
            <p className="mt-1 text-sm leading-5 text-white/80">“Pick the path that excites you most. I’ll be with you every step.”</p>
          </div>
        </section>

        <section className={`mx-auto mt-6 max-w-5xl transition-all duration-700 delay-300 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}>
          <div className="mb-4 text-center">
            <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">Your world map</h2>
            <p className="mt-1 text-sm text-white/55">Where will Hana take you?</p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {worlds.map(world => (
              <button
                key={world.href}
                type="button"
                onClick={() => navigate(world.href)}
                className="group min-h-32 rounded-[24px] border border-white/10 bg-[#071722]/55 p-4 text-center shadow-xl backdrop-blur-md transition-all hover:-translate-y-1 hover:border-[#f1c77b]/45 hover:bg-[#071722]/75 hover:shadow-[0_12px_40px_rgba(0,0,0,.35)] active:scale-[.98]"
              >
                <div className="text-3xl transition-transform duration-200 group-hover:scale-110 sm:text-4xl">{world.icon}</div>
                <div className="mt-2 text-[9px] font-bold uppercase tracking-[.16em] text-[#f1c77b]">{world.label}</div>
                <div className="mt-1 text-sm font-semibold text-white/85">{world.name}</div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
