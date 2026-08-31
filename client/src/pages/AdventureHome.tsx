import { ArrowRight, Play, Volume2, VolumeX } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

export default function AdventureHome() {
  const [, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isMuted, setIsMuted] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const dark = theme === "dark";

  const startJourney = () => {
    setTransitioning(true);
    window.setTimeout(() => navigate("/journey"), 360);
  };

  useEffect(() => {
    document.title = "HANA — Your CS Adventure";
  }, []);

  return (
    <main className={`game-entry ${dark ? "game-entry-dark" : "game-entry-bright"} ${transitioning ? "game-entry-transitioning" : ""}`}>
      <div className="game-sky-glow" aria-hidden="true" />
      <div className="game-constellation constellation-one" aria-hidden="true" />
      <div className="game-constellation constellation-two" aria-hidden="true" />
      <div className="game-mist mist-one" aria-hidden="true" />
      <div className="game-mist mist-two" aria-hidden="true" />

      <div className="game-world-art" aria-hidden="true">
        <div className="game-floating-island island-one" />
        <div className="game-floating-island island-two" />
        <div className="game-academy" />
        <div className="game-tree"><span /><span /><span /></div>
        <div className="game-path" />
        <div className="game-path path-two" />
      </div>

      <div className="game-entry-vignette" aria-hidden="true" />

      <header className="game-entry-copy">
        <div className="game-brand-lockup"><span className="game-brand-star">✦</span> HANA</div>
        <p className="game-kicker">Your CS adventure</p>
      </header>

      <section className="game-title-block" aria-labelledby="hana-title">
        <p className="game-title-eyebrow">Enter the world</p>
        <h1 id="hana-title">HANA</h1>
        <p className="game-title-subtitle">The journey begins.</p>
        <p className="game-title-description">
          Learn computer science, build real projects, discover opportunities, and grow one quest at a time with Hana.
        </p>

        <div className="game-entry-actions">
          <button type="button" onClick={startJourney} className="game-action-button game-action-primary" aria-label="Start Hana journey">
            <span className="game-action-orb" aria-hidden="true" />
            <Play className="mr-2 inline h-4 w-4 fill-current" />
            Start journey
            <ArrowRight className="ml-2 inline h-4 w-4" />
          </button>

          <button type="button" onClick={toggleTheme} className="game-action-secondary" aria-label="Switch between bright and dark world">
            <span className="game-action-orb" aria-hidden="true" />
            {dark ? "Bright world" : "Dark world"}
          </button>

          <p className="game-theme-note">A thoughtful path, not a race.</p>
        </div>
      </section>

      <section className="game-companion-stage" aria-label="Hana companion">
        <div className="game-portal" aria-hidden="true"><span /><span /><span /></div>
        <div className="game-companion-glow" aria-hidden="true" />
        <img
          className="game-companion"
          src="/manus-storage/hana-new-companion-concept_628f65ae.png"
          alt="Hana, your fantasy learning companion"
          onError={(event) => {
            const image = event.currentTarget;
            image.onerror = null;
            image.src = "/assets/hana-phase1-approved-opening.png";
          }}
        />
        <p className="game-companion-caption">Hana will guide you through learning, building, and finding your next brave step.</p>
      </section>

      <footer className="game-entry-footer">
        <span>One quest at a time.</span>
        <span className="flex items-center gap-2">
          <button type="button" onClick={() => setIsMuted(value => !value)} aria-label={isMuted ? "Unmute" : "Mute"} className="inline-flex items-center gap-2">
            {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
            {isMuted ? "Sound off" : "Sound on"}
          </button>
          <span aria-hidden="true">·</span>
          <button type="button" onClick={() => navigate("/journey")}>Enter world</button>
        </span>
      </footer>
    </main>
  );
}
