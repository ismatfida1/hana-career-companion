import { useLocation } from "wouter";
import { careerCatalog, defaultCareerPath, type CareerPathId } from "@/data/careerCatalog";
import { useState, useEffect } from "react";

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
    <div className="min-h-screen bg-[#0d1b2a] text-white overflow-hidden relative">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-b from-[#1a2a3a] via-[#0d1b2a] to-[#0a1520]">
          <div className="absolute top-20 right-20 text-7xl opacity-10">🗺️</div>
          <div className="absolute bottom-32 left-16 text-6xl opacity-10">🧭</div>
          <div className="absolute top-1/2 left-1/3 text-5xl opacity-5">✦</div>
          <div className="absolute bottom-1/3 right-1/4 text-4xl opacity-5">✦</div>
        </div>
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 md:py-10">
        <div className={`flex items-center justify-between mb-6 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <button onClick={() => navigate("/")} className="text-sm text-white/40 hover:text-white/80 transition flex items-center gap-2">← Back</button>
          <span className="text-xs text-[#f1c77b] border border-[#f1c77b]/30 px-4 py-1.5 rounded-full font-mono tracking-wider">THE ADVENTURE BEGINS</span>
        </div>
        <div className={`mb-8 transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome, adventurer.</h1>
          <p className="text-white/60 max-w-xl text-base md:text-lg leading-relaxed">Hana has opened five worlds for your CS journey. Choose your direction and explore at your own pace.</p>
        </div>
        <div className={`mb-10 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-sm font-mono text-white/40 tracking-wider mb-3">CHOOSE YOUR PATH</h2>
          <div className="flex flex-wrap gap-2">
            {careerCatalog.slice(0, 6).map((item) => (
              <button key={item.id} onClick={() => choosePath(item.id)} className={`rounded-full border px-5 py-2.5 text-xs font-semibold transition-all duration-300 ${currentPath.id === item.id ? "border-[#f1c77b] bg-[#f1c77b] text-[#12212a] shadow-lg shadow-[#f1c77b]/20" : "border-white/15 bg-black/25 text-white/75 hover:bg-white/10 hover:border-white/30"}`}>{item.title}</button>
            ))}
          </div>
        </div>
        <div className={`mb-8 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-b from-[#f1c77b] to-[#d4a050] flex items-center justify-center shadow-lg shadow-[#f1c77b]/20 border-2 border-[#f1c77b]/30"><span className="text-2xl">🤖</span></div>
            <div><p className="text-sm text-white/60">Hana says:</p><p className="text-sm text-white/80 italic">"Pick the path that excites you most. I'll be with you every step."</p></div>
          </div>
        </div>
        <div className={`mb-8 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-2xl font-semibold mb-1">Your world map</h2>
          <p className="text-white/60 mb-5 text-sm">Where will Hana take you?</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {worlds.map((world) => (
              <button key={world.href} onClick={() => navigate(world.href)} className="group bg-white/5 hover:bg-white/10 rounded-xl p-4 text-center transition-all border border-white/5 hover:border-[#f1c77b]/30 hover:shadow-lg hover:shadow-[#f1c77b]/5">
                <div className="text-3xl md:text-4xl mb-2 transition-transform group-hover:scale-110">{world.icon}</div>
                <div className="text-[10px] text-[#f1c77b] font-mono tracking-wider uppercase">{world.label}</div>
                <div className="text-sm font-semibold mt-0.5 text-white/80">{world.name}</div>
              </button>
            ))}
          </div>
        </div>
        <div className={`flex justify-center gap-6 text-xs text-white/30 font-mono tracking-wider transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}><span>Roadmap</span><span>Opportunities</span><span>Ask Hana</span></div>
      </div>
    </div>
  );
}
