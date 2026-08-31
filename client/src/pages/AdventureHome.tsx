import { Play, Volume2, VolumeX } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";

export default function AdventureHome() {
  const [, navigate] = useLocation();
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    navigate("/journey-start");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0d1b2a]">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-b from-[#1a2a3a] via-[#0d1b2a] to-[#0a1520]">
          <div className="absolute top-10 left-10 text-6xl opacity-20">🏰</div>
          <div className="absolute bottom-20 right-10 text-8xl opacity-10">🌙</div>
          <div className="absolute top-1/3 left-1/4 text-4xl opacity-15">✨</div>
          <div className="absolute bottom-1/3 right-1/4 text-5xl opacity-15">🌿</div>
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="absolute w-0.5 h-0.5 bg-white rounded-full animate-twinkle" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s`, opacity: 0.3 + Math.random() * 0.7 }} />
          ))}
        </div>
      </div>
      <div className="absolute z-10 top-1/4 left-1/2 -translate-x-1/2 animate-float">
        <div className="relative">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-b from-[#f1c77b] to-[#d4a050] flex items-center justify-center shadow-2xl shadow-[#f1c77b]/20 border-4 border-[#f1c77b]/30"><span className="text-6xl md:text-7xl">🤖</span></div>
          <div className="absolute -inset-4 rounded-full border-2 border-[#f1c77b]/10 animate-pulse" />
          <div className="absolute -inset-8 rounded-full border border-[#f1c77b]/5 animate-pulse delay-300" />
        </div>
      </div>
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="absolute top-4 right-4 flex gap-3">
          <button onClick={() => setIsMuted(!isMuted)} className="p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition">{isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
        </div>
        <div className={`text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-2"><span className="text-xs tracking-[0.3em] text-[#f1c77b]/60 font-mono">HANA OPTIONS</span></div>
          <h1 className="text-7xl md:text-8xl font-bold text-white mb-2 tracking-tight">HANA</h1>
          <p className="text-lg md:text-xl text-white/70 max-w-md mx-auto mb-8 font-light">Your CS Adventure</p>
          <p className="text-sm text-white/50 max-w-sm mx-auto mb-10 leading-relaxed">The journey begins. Enter the fantasy-tech world. Hana will guide you through learning, building, opportunities, and your path into computer science.</p>
          <button onClick={handleStart} className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-[#f1c77b] to-[#e8b86d] text-[#0d1b2a] font-bold text-lg shadow-lg shadow-[#f1c77b]/20 hover:shadow-[#f1c77b]/40 transition-all hover:scale-105 active:scale-95"><Play size={20} className="fill-[#0d1b2a]" />Start Journey</button>
        </div>
        <div className="absolute bottom-8 flex gap-8 text-xs text-white/30 font-mono tracking-wider"><span>Roadmap</span><span>Projects</span><span>Opportunities</span><span>Ask Hana</span></div>
      </div>
      <style>{`@keyframes float { 0%, 100% { transform: translate(-50%, 0px); } 50% { transform: translate(-50%, -12px); } } @keyframes twinkle { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } } .animate-float { animation: float 4s ease-in-out infinite; } .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }`}</style>
    </div>
  );
}
