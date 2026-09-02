import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Topbar } from "@/components/Topbar";
import { Loader2, ShieldAlert, Sparkles, AlertTriangle, CheckCircle2, Brain } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";
import { useEffect } from "react";
export const Route = createFileRoute("/_app/scam-detector")({
  head: () => ({ meta: [{ title: "Scam Detector · SentinelAI" }] }),
  component: ScamDetector,
});

type Result = {
  risk: number;
  scam_type: string;
  confidence: number;
  indicators: string[];
  explanation: string;
};



function ScamDetector() {
  const [text, setText] = useState("Dear customer, your SBI account will be blocked today. Update your KYC immediately at http://sbi-kyc-update.in/login or your account will be suspended.");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const loadHistory = async () => {

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user.id) return;

  try {

    const res = await api.get(`/scam/history/${user.id}`);

    setHistory(res.data);

  } catch (err) {

    console.log(err);

  }

};
useEffect(() => {
  loadHistory();
}, []);
const analyze = async () => {
  if (!text.trim()) {
    toast.error("Paste a message to analyze");
    return;
  }

  try {
    setLoading(true);
    setResult(null);

 const user = JSON.parse(localStorage.getItem("user") || "{}");

console.log("User from localStorage:", user);

const payload = {
  message: text,
  user_id: user.id,
};

console.log("Payload:", payload);

const response = await api.post("/scam/analyze", payload);

    setResult({
      risk: response.data.risk_score,
      scam_type: response.data.scam_type,
      confidence: response.data.confidence_score,
      indicators: [
        "AI detected suspicious keywords",
        "Pattern matched known fraud templates",
        "Behavior analysis completed",
      ],
      explanation: response.data.explanation,
    });

    toast.success("Analysis completed");
    loadHistory();
  } catch (error) {
    console.error(error);
    toast.error("Backend connection failed");
  } finally {
    setLoading(false);
  }
};

  const riskColor = (r: number) =>
    r >= 85 ? "var(--destructive)" : r >= 70 ? "var(--warning)" : r >= 50 ? "var(--cyan)" : "var(--success)";

  return (
    <>
      <Topbar title="AI Scam Detector" subtitle="Analyze SMS, email, WhatsApp, or call transcripts in real time" />
      <main className="space-y-6 p-4 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--cyan)]" />
              <h3 className="font-display text-lg font-bold">Paste suspicious content</h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Works on Hindi, English & 22 Indian languages.</p>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              className="mt-4 resize-none border-border/60 bg-secondary/30 font-mono text-sm"
              placeholder="Paste SMS, email body, WhatsApp text, or call transcript here…"
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">{text.length} characters</span>
              <button
                onClick={analyze}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--gradient-cyan)] px-5 py-2.5 font-semibold text-[oklch(0.15_0.04_255)] disabled:opacity-60 glow-cyan"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}
                {loading ? "Analyzing…" : "Analyze with AI"}
              </button>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-[var(--cyan)]" />
              <h3 className="font-display text-lg font-bold">AI Analysis Result</h3>
            </div>

            {!result && !loading && (
              <div className="mt-10 grid place-items-center text-center text-sm text-muted-foreground">
                <div className="grid h-14 w-14 place-items-center rounded-full border border-dashed border-border">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <p className="mt-3 max-w-xs">Results appear here. Try the example loaded in the box.</p>
              </div>
            )}

            {loading && (
              <div className="mt-10 grid place-items-center text-center">
                <Loader2 className="h-7 w-7 animate-spin text-[var(--cyan)]" />
                <p className="mt-3 text-sm text-muted-foreground">Running multi-model inference…</p>
              </div>
            )}

            {result && (
              <div className="mt-6 space-y-5">
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Risk Score</span>
                    <span className="font-mono font-semibold" style={{ color: riskColor(result.risk) }}>{result.risk}/100</span>
                  </div>
                  <Progress value={result.risk} className="mt-2 h-2" />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: `${riskColor(result.risk)}22`, color: riskColor(result.risk), border: `1px solid ${riskColor(result.risk)}` }}>
                    <AlertTriangle className="h-3 w-3" /> {result.scam_type}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs">
                    <CheckCircle2 className="h-3 w-3 text-[var(--success)]" /> Confidence {result.confidence}%
                  </span>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Indicators</div>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {result.indicators.map((i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--cyan)]" />
                        <span>{i}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-border/60 bg-secondary/30 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI Explanation</div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90">{result.explanation}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl">
          <div className="border-b border-border/60 p-6">
            <h3 className="font-display text-lg font-bold">Analysis History</h3>
            <p className="text-xs text-muted-foreground">Your last analyses · stored in <code>scam_analysis</code></p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-3">Message</th>
                  <th className="px-6 py-3">Scam Type</th>
                  <th className="px-6 py-3">Risk</th>
                  <th className="px-6 py-3">Analyzed</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h: any) => (
                  <tr key={h.id} className="border-t border-border/40 hover:bg-secondary/30">
                    <td className="max-w-sm truncate px-6 py-4 font-mono text-xs">{h.message}</td>
                    <td className="px-6 py-4">{h.scam_type}</td>
                    <td className="px-6 py-4 font-semibold" style={{ color: riskColor(h.risk_score) }}>{h.risk_score}</td>
                    <td className="px-6 py-4 text-muted-foreground">{new Date(h.analyzed_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
