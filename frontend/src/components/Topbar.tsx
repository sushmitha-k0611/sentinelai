import { Bell, Search, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border/60 bg-background/40 px-4 py-4 backdrop-blur-md md:px-8">
      <div className="min-w-0">
        <h1 className="truncate font-display text-xl font-bold tracking-tight md:text-2xl">{title}</h1>
        {subtitle && <p className="truncate text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2 md:gap-3">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search reports, cities, types…" className="h-10 w-72 border-border/60 bg-secondary/40 pl-9" />
        </div>
        <button className="relative grid h-10 w-10 place-items-center rounded-lg border border-border/60 bg-secondary/40 transition hover:bg-secondary">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--cyan)] shadow-[0_0_8px_var(--cyan)]" />
        </button>
        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/40 px-2 py-1.5">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-[var(--gradient-cyan)]">
            <ShieldCheck className="h-4 w-4 text-[oklch(0.15_0.04_255)]" />
          </div>
          <div className="hidden text-xs leading-tight sm:block">
            <div className="font-semibold">Officer Nair</div>
            <div className="text-muted-foreground">Cyber Cell</div>
          </div>
        </div>
      </div>
    </header>
  );
}
