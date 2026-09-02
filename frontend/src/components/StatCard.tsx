import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function StatCard({
  label, value, delta, icon: Icon, accent = "cyan", children,
}: {
  label: string;
  value: ReactNode;
  delta?: string;
  icon: LucideIcon;
  accent?: "cyan" | "warning" | "destructive" | "success";
  children?: ReactNode;
}) {
  const accentMap = {
    cyan: "from-[oklch(0.82_0.15_210)] to-[oklch(0.55_0.18_255)]",
    warning: "from-[oklch(0.78_0.16_75)] to-[oklch(0.62_0.22_25)]",
    destructive: "from-[oklch(0.62_0.22_25)] to-[oklch(0.55_0.18_350)]",
    success: "from-[oklch(0.72_0.17_155)] to-[oklch(0.55_0.18_200)]",
  } as const;

  return (
    <div className="glass relative overflow-hidden rounded-2xl p-5">
      <div className={cn(
        "absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br opacity-20 blur-2xl",
        accentMap[accent],
      )} />
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</div>
          <div className="mt-2 font-display text-3xl font-bold tracking-tight">{value}</div>
          {delta && <div className="mt-1 text-xs text-[var(--success)]">{delta}</div>}
        </div>
        <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br", accentMap[accent])}>
          <Icon className="h-5 w-5 text-[oklch(0.15_0.04_255)]" />
        </div>
      </div>
      {children}
    </div>
  );
}
