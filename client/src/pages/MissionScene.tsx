import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import CareerPath from "./CareerPath";

const states = [
  { key: "concept", label: "Concept", image: "/manus-storage/hana-mission-concept_f48fe2c0.png", accent: "#f1c77b", glow: "rgba(241,199,123,.24)", note: "The world is waking up." },
  { key: "example", label: "Explore", image: "/manus-storage/hana-mission-example_b1399bbd.png", accent: "#9dd5c7", glow: "rgba(157,213,199,.24)", note: "Hana is guiding your next discovery." },
  { key: "try-it", label: "Practice", image: "/manus-storage/hana-mission-try_3d4722c1.png", accent: "#a9c9f4", glow: "rgba(169,201,244,.24)", note: "The path responds as you experiment." },
  { key: "feedback", label: "Build", image: "/manus-storage/hana-mission-feedback_6d89ab7b.png", accent: "#e6a5bc", glow: "rgba(230,165,188,.24)", note: "Hana is watching for the moment it clicks." },
  { key: "apply-it", label: "Apply", image: "/manus-storage/hana-mission-apply_e5a97fa2.png", accent: "#d8bd8b", glow: "rgba(216,189,139,.24)", note: "Your world expands with what you build." },
  { key: "reflect", label: "Reflect", image: "/manus-storage/hana-mission-reflect_447ec078.png", accent: "#c4b4ef", glow: "rgba(196,180,239,.24)", note: "A quiet checkpoint before the next world." },
] as const;

const fallback = "/assets/hana-phase1-approved-opening.png";

export default function MissionScene() {
  const [step, setStep] = useState(0);
  const [broken, setBroken] = useState(false);
  const state = states[step];

  useEffect(() => {
    const readStage = () => {
      const text = document.body.innerText;
      const match = text.match(/World\s+(\d+)\s+of\s+\d+/i);
      if (match) setStep(Math.max(0, Math.min(states.length - 1, Number(match[1]) - 1)));
    };
    readStage();
    const observer = new MutationObserver(readStage);
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => setBroken(false), [step]);

  const particles = useMemo(() => Array.from({ length: 14 }, (_, index) => index), []);

  return (
    <div className="mission-scene" data-mission-state={state.key} data-world-step={step + 1} style={{ "--mission-accent": state.accent, "--mission-glow": state.glow } as React.CSSProperties}>
      <style>{`
        .mission-scene{position:relative;min-height:100svh;isolation:isolate;overflow-x:clip;background:radial-gradient(circle at 76% 18%,var(--mission-glow),transparent 28%),linear-gradient(180deg,#081725 0%,#0c1d2b 46%,#102738 100%)}
        .mission-scene__world{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden}
        .mission-scene__mist{position:absolute;inset:-15%;background:radial-gradient(ellipse at 50% 30%,var(--mission-glow),transparent 45%);filter:blur(22px);animation:mission-breathe 7s ease-in-out infinite}
        .mission-scene__portal{position:absolute;right:9%;top:7%;width:min(42vw,520px);aspect-ratio:1;border-radius:50%;border:1px solid color-mix(in srgb,var(--mission-accent) 55%,transparent);box-shadow:0 0 45px var(--mission-glow),inset 0 0 55px var(--mission-glow);opacity:.72;animation:mission-pulse 5s ease-in-out infinite}
        .mission-scene__portal:after{content:"";position:absolute;inset:10%;border-radius:50%;border:1px solid color-mix(in srgb,var(--mission-accent) 32%,transparent);box-shadow:0 0 80px var(--mission-glow)}
        .mission-scene__hana{position:absolute;right:4%;bottom:3%;width:min(34vw,430px);height:min(60vh,570px);display:flex;align-items:flex-end;justify-content:center;animation:mission-float 6s ease-in-out infinite;filter:drop-shadow(0 22px 34px rgba(0,0,0,.28))}
        .mission-scene__hana img{width:100%;height:100%;object-fit:contain;object-position:center bottom;display:block;mix-blend-mode:normal;transition:opacity .25s ease,transform .5s ease}
        .mission-scene__halo{position:absolute;inset:auto 7% 4% 7%;height:22%;border-radius:50%;background:radial-gradient(ellipse,var(--mission-glow),transparent 70%);filter:blur(18px)}
        .mission-particle{position:absolute;width:4px;height:4px;border-radius:50%;background:var(--mission-accent);box-shadow:0 0 12px var(--mission-accent);opacity:.55;animation:mission-drift var(--delay) ease-in-out infinite alternate}
        .mission-scene__content{position:relative;z-index:2;min-width:0;width:100%;max-width:100%;padding:clamp(90px,9vh,125px) clamp(12px,3vw,40px) 32px}
        .mission-scene__state{position:absolute;top:18px;left:50%;transform:translateX(-50%);z-index:3;display:flex;align-items:center;gap:8px;max-width:calc(100% - 32px);border:1px solid color-mix(in srgb,var(--mission-accent) 35%,transparent);background:rgba(6,17,28,.62);backdrop-filter:blur(12px);border-radius:999px;padding:8px 13px;color:rgba(255,255,255,.78);font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .mission-scene__state span{color:var(--mission-accent)}
        @keyframes mission-float{50%{transform:translate3d(0,-10px,0)}}
        @keyframes mission-breathe{50%{transform:scale(1.06);opacity:.78}}
        @keyframes mission-pulse{50%{transform:scale(1.035);opacity:.92}}
        @keyframes mission-drift{from{transform:translate3d(0,18px,0);opacity:.18}to{transform:translate3d(18px,-34px,0);opacity:.72}}
        @media (max-width:900px){
          .mission-scene__world{height:300px;inset:0 0 auto}
          .mission-scene__portal{right:-7%;top:42px;width:330px}
          .mission-scene__hana{right:2%;bottom:auto;top:52px;width:min(42vw,280px);height:245px}
          .mission-scene__content{padding-top:315px}
          .mission-scene__state{top:12px}
        }
        @media (max-width:560px){
          .mission-scene__world{height:250px}
          .mission-scene__portal{right:50%;transform:translateX(50%);top:55px;width:245px}
          .mission-scene__hana{position:absolute;right:0;top:74px;width:150px;height:170px;opacity:.96}
          .mission-scene__content{padding:275px 12px 24px}
          .mission-scene__state{top:10px;max-width:calc(100% - 20px);font-size:9px;letter-spacing:.08em}
          .mission-particle{display:none}
        }
        @media (prefers-reduced-motion:reduce){.mission-scene__mist,.mission-scene__portal,.mission-scene__hana,.mission-particle{animation:none!important}.mission-scene__hana img{transition:none}}
      `}</style>
      <div className="mission-scene__world" aria-hidden="true">
        <div className="mission-scene__mist" />
        <div className="mission-scene__portal" />
        {particles.map((particle) => <span key={particle} className="mission-particle" style={{ left: `${8 + ((particle * 17) % 84)}%`, top: `${8 + ((particle * 23) % 68)}%`, "--delay": `${3 + (particle % 5)}s` } as React.CSSProperties} />)}
        <div className="mission-scene__halo" />
        <div className="mission-scene__hana">
          <img src={broken ? fallback : state.image} alt="Hana, your fantasy learning companion" onError={() => setBroken(true)} />
        </div>
      </div>
      <div className="mission-scene__state"><Sparkles className="h-3.5 w-3.5 shrink-0" /><span>{state.label}</span><span aria-hidden="true"> · </span><span className="!text-white/70 normal-case tracking-normal">{state.note}</span></div>
      <main className="mission-scene__content"><CareerPath /></main>
    </div>
  );
}
