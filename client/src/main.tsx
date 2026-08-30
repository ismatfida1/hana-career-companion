import { trpc } from "@/lib/trpc";
import { COOKIE_NAME } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import "./index.css";
import "./layout-hardening.css";
import "./styles/hana-game-layout-fixes.css";

const queryClient = new QueryClient();

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      headers() {
        try {
          const raw = sessionStorage.getItem("manus-cookie");
          if (raw) {
            const prefix = `${COOKIE_NAME}=`;
            const pair = raw.split(";").find(s => s.trim().startsWith(prefix));
            const token = pair?.trim().slice(prefix.length);
            if (token) return { Authorization: `Bearer ${token}` };
          }
        } catch {}
        return {};
      },
      fetch(input, init) { return globalThis.fetch(input, { ...(init ?? {}), credentials: "include" }); },
    }),
  ],
});

const refreshVisibleDates = () => {
  if (typeof document === "undefined") return;
  const formatter = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" });
  const today = formatter.format(new Date());
  const stale = document.querySelectorAll<HTMLElement>("p,span,h1,h2,h3");
  stale.forEach(node => {
    if (/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}$/.test(node.textContent?.trim() ?? "")) node.textContent = today;
  });
};

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}><App /></QueryClientProvider>
  </trpc.Provider>
);

if (typeof window !== "undefined") {
  const observer = new MutationObserver(refreshVisibleDates);
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  window.setTimeout(refreshVisibleDates, 0);
  window.setTimeout(refreshVisibleDates, 500);
}
