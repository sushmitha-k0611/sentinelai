import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Radar, ArrowRight, Lock, Globe2, BrainCircuit } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SentinelAI — AI-Powered Digital Public Safety & Fraud Intelligence" },
      { name: "description", content: "Protect citizens from scams, phishing, and digital fraud with real-time AI intelligence." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--gradient-cyan)] glow-cyan">
            <Radar className="h-5 w-5 text-[oklch(0.15_0.04_255)]" />
          </div>
          <div>
            <div className="font-display text-base font-bold">SentinelAI</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Public Safety</div>
          </div>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link to="/login" className="rounded-md px-3 py-2 hover:bg-secondary">Login</Link>
          <Link to="/register" className="rounded-md bg-[var(--gradient-cyan)] px-4 py-2 font-semibold text-[oklch(0.15_0.04_255)]">Get Started</Link>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-12 md:pt-24">
        <div className="glass mx-auto inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-cyan">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--cyan)] shadow-[0_0_8px_var(--cyan)]" />
          National-grade AI Defense Grid · v2.0
        </div>
        <h1 className="mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
          Defending citizens in the age of <span className="text-gradient-cyan">digital deception.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
          SentinelAI is an AI-powered Digital Public Safety & Fraud Intelligence Platform that detects scams, analyzes threats in real time, and arms law enforcement with actionable signal.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-lg bg-[var(--gradient-cyan)] px-5 py-3 font-semibold text-[oklch(0.15_0.04_255)] glow-cyan">
            Open Command Center <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/scam-detector" className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-5 py-3 font-semibold">
            Try Scam Detector
          </Link>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            { icon: BrainCircuit, t: "AI Scam Detection", d: "Multilingual LLM analysis of SMS, calls, email & chat." },
            { icon: Globe2, t: "Crime Intelligence", d: "Live fraud hotspot mapping across every Indian state." },
            { icon: Lock, t: "Citizen Shield", d: "24/7 conversational guidance for victims & first reporters." },
          ].map((f) => (
            <div key={f.t} className="glass rounded-2xl p-6">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--gradient-cyan)]">
                <f.icon className="h-5 w-5 text-[oklch(0.15_0.04_255)]" />
              </div>
              <div className="mt-4 font-display text-lg font-bold">{f.t}</div>
              <div className="mt-1 text-sm text-muted-foreground">{f.d}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
