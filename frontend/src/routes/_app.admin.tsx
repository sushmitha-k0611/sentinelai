import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/Topbar";
import { StatCard } from "@/components/StatCard";
import { Users, AlertTriangle, FileWarning, ShieldCheck, Download, MoreHorizontal } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { scamReports, adminAlerts, users, trendData } from "@/lib/dummy-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin")({
  head: () => ({ meta: [{ title: "Admin · SentinelAI" }] }),
  component: Admin,
});

function sevColor(s: string) {
  return s === "Critical" ? "var(--destructive)" : s === "High" ? "var(--warning)" : "var(--cyan)";
}

function Admin() {
  return (
    <>
      <Topbar title="Admin Operations Center" subtitle="Manage citizens, alerts & national fraud signal" />
      <main className="space-y-6 p-4 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold">Overview</h2>
            <p className="text-xs text-muted-foreground">Snapshot of the last 30 days</p>
          </div>
          <button
            onClick={() => toast.success("Report exported (CSV)")}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--gradient-cyan)] px-4 py-2 text-sm font-semibold text-[oklch(0.15_0.04_255)] glow-cyan"
          >
            <Download className="h-4 w-4" /> Export Reports
          </button>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Registered Citizens" value="142,330" delta="↑ 4.2k this week" icon={Users} accent="cyan" />
          <StatCard label="Open Investigations" value="3,217" delta="248 escalated" icon={FileWarning} accent="warning" />
          <StatCard label="Critical Alerts" value="142" delta="↑ surge detected" icon={AlertTriangle} accent="destructive" />
          <StatCard label="Cases Closed" value="9,841" delta="92% resolution" icon={ShieldCheck} accent="success" />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="glass rounded-2xl p-6 lg:col-span-2">
            <h3 className="font-display text-lg font-bold">Fraud Analytics</h3>
            <p className="text-xs text-muted-foreground">Reports received vs blocked</p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                  <XAxis dataKey="month" stroke="oklch(0.72 0.03 250)" fontSize={11} />
                  <YAxis stroke="oklch(0.72 0.03 250)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "oklch(0.2 0.05 257)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="reports" name="Reports" fill="oklch(0.82 0.15 210)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="blocked" name="Blocked" fill="oklch(0.72 0.17 155)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass rounded-2xl">
            <div className="border-b border-border/60 p-6">
              <h3 className="font-display text-lg font-bold">High Risk Alerts</h3>
              <p className="text-xs text-muted-foreground">Auto-flagged by AI · last 24h</p>
            </div>
            <div className="divide-y divide-border/40">
              {adminAlerts.map((a) => (
                <div key={a.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 p-4">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: sevColor(a.severity), boxShadow: `0 0 8px ${sevColor(a.severity)}` }} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{a.count} reports · {a.time}</div>
                  </div>
                  <span className="rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider" style={{ borderColor: sevColor(a.severity), color: sevColor(a.severity) }}>
                    {a.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-2xl">
            <div className="border-b border-border/60 p-6">
              <h3 className="font-display text-lg font-bold">Recent Fraud Reports</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-6 py-3">Reporter</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">City</th>
                    <th className="px-6 py-3">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {scamReports.slice(0, 5).map((r) => (
                    <tr key={r.id} className="border-t border-border/40 hover:bg-secondary/30">
                      <td className="px-6 py-3 font-medium">{r.user}</td>
                      <td className="px-6 py-3">{r.scam_type}</td>
                      <td className="px-6 py-3">{r.city}</td>
                      <td className="px-6 py-3 font-semibold" style={{ color: r.risk >= 85 ? "var(--destructive)" : "var(--warning)" }}>{r.risk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass rounded-2xl">
            <div className="border-b border-border/60 p-6">
              <h3 className="font-display text-lg font-bold">User Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Reports</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t border-border/40 hover:bg-secondary/30">
                      <td className="px-6 py-3">
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </td>
                      <td className="px-6 py-3"><span className="rounded-full border border-border bg-secondary/40 px-2 py-0.5 text-xs capitalize">{u.role}</span></td>
                      <td className="px-6 py-3 font-mono">{u.reports}</td>
                      <td className="px-6 py-3 text-right"><button className="rounded p-1 hover:bg-secondary"><MoreHorizontal className="h-4 w-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
