import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Topbar } from "@/components/Topbar";
import { Input } from "@/components/ui/input";
import { Bot, Send, User, Globe2 } from "lucide-react";
import { chatHistory, suggestedQuestions } from "@/lib/dummy-data";
import api from "@/services/api";
export const Route = createFileRoute("/_app/fraud-shield")({
  head: () => ({ meta: [{ title: "Citizen Fraud Shield · SentinelAI" }] }),
  component: FraudShield,
});

const languages = ["English", "हिन्दी", "தமிழ்", "తెలుగు", "বাংলা", "मराठी", "ગુજરાતી"];

type Msg = { id: number; role: "user" | "ai"; text: string };

function FraudShield() {
  const [messages, setMessages] = useState<Msg[]>([
  {
    id: 1,
    role: "ai",
    text: "Hello 👋 I'm SentinelAI Fraud Shield. Ask me anything related to cyber fraud, phishing, banking scams, UPI frauds, OTP scams or digital arrest scams.",
  },
]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("English");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const suggestedQuestions = [

"What is Digital Arrest Scam?",

"Someone asked my OTP. Is it safe?",

"I clicked a phishing link.",

"I paid a scammer using UPI.",

"How do I report cybercrime?"

];
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  async function send(text: string) {

  if (!text.trim()) return;
const userMsg: Msg = {
  id: Date.now(),
  role: "user",
  text,
};

  setMessages((m) => [...m, userMsg]);
  setInput("");
  setTyping(true);

  try {

    const response = await api.post("/chatbot/chat", {
      message: text,
      language: language,
    });

    const aiMsg: Msg = {
    id: Date.now() + 1,
    role: "ai",
    text: response.data.reply,
};

    setMessages((m) => [...m, aiMsg]);

  } catch (err) {
  const errorMsg: Msg = {
    id: Date.now() + 1,
    role: "ai",
    text: "Unable to contact AI server.",
};

setMessages((m) => [...m, errorMsg]);
  

  } finally {

    setTyping(false);

  }
}

  return (
    <>
      <Topbar title="Citizen Fraud Shield" subtitle="Conversational AI assistant — multilingual, 24/7" />
      <main className="grid h-[calc(100vh-8rem)] grid-cols-1 gap-6 p-4 md:p-8 lg:grid-cols-[1fr_280px]">
        <section className="glass flex min-h-0 flex-col rounded-2xl">
          <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/60 p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--gradient-cyan)]">
                <Bot className="h-5 w-5 text-[oklch(0.15_0.04_255)]" />
              </div>
              <div className="min-w-0">
                <div className="truncate font-semibold">SentinelAI Shield</div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)] shadow-[0_0_8px_var(--success)]" /> Online
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 rounded-lg border border-border/60 bg-secondary/40 px-2 py-1.5 text-xs">
              <Globe2 className="h-3.5 w-3.5 text-[var(--cyan)]" />
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-transparent outline-none">
                {languages.map((l) => <option key={l} value={l} className="bg-popover">{l}</option>)}
              </select>
            </div>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex items-start gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${m.role === "user" ? "bg-secondary" : "bg-[var(--gradient-cyan)]"}`}>
                  {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-[oklch(0.15_0.04_255)]" />}
                </div>
                <div className={`max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "rounded-tr-sm bg-[var(--gradient-cyan)] text-[oklch(0.15_0.04_255)]"
                    : "rounded-tl-sm border border-border/60 bg-secondary/40"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex items-start gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--gradient-cyan)]"><Bot className="h-4 w-4 text-[oklch(0.15_0.04_255)]" /></div>
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-border/60 bg-secondary/40 px-4 py-3">
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="h-2 w-2 animate-pulse rounded-full bg-[var(--cyan)]" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 border-t border-border/60 p-4"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask in ${language}…`}
              className="border-border/60 bg-secondary/40"
            />
            <button type="submit" className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--gradient-cyan)] text-[oklch(0.15_0.04_255)]">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>

        <aside className="space-y-4">
          <div className="glass rounded-2xl p-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Suggested questions</h4>
            <div className="mt-3 space-y-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3 py-2 text-left text-sm transition hover:border-[var(--cyan)]/40 hover:bg-secondary/60"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
          <div className="glass rounded-2xl p-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Helplines</h4>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Cyber Crime</span><span className="font-mono">1930</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">SMS Spam</span><span className="font-mono">1909</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Women Safety</span><span className="font-mono">181</span></div>
            </div>
          </div>
        </aside>
      </main>
    </>
  );
}
