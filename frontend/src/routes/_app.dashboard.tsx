import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle, Users, ShieldAlert, Activity, ArrowUpRight,
  FileWarning, Map as MapIcon, MessageSquareWarning, Plus,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { StatCard } from "@/components/StatCard";
import { Topbar } from "@/components/Topbar";
import { useEffect, useState } from "react";

import {
  getDashboardStats,
  getFraudTypes,
  getStateAnalytics,
  getRecentReports,
} from "@/services/dashboard";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · SentinelAI" }] }),
  component: Dashboard,
});

function RiskPill({ risk }: { risk: number }) {
  const level = risk >= 85 ? "Critical" : risk >= 70 ? "High" : risk >= 50 ? "Medium" : "Low";
  const color = risk >= 85 ? "var(--destructive)" : risk >= 70 ? "var(--warning)" : risk >= 50 ? "var(--cyan)" : "var(--success)";
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium" style={{ borderColor: color, color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
      {level} · {risk}
    </span>
  );
}

function Dashboard() {
  const [stats, setStats] = useState<any>(null);

const [fraudTypes, setFraudTypes] = useState<any[]>([]);

const [stateAnalytics, setStateAnalytics] = useState<any[]>([]);

const [recentReports, setRecentReports] = useState<any[]>([]);
useEffect(() => {
    loadDashboard();
}, []);

async function loadDashboard() {

    try {

        const statsData = await getDashboardStats();

        const fraudData = await getFraudTypes();

        const stateData = await getStateAnalytics();

        const reports = await getRecentReports();

        setStats(statsData);

        setFraudTypes(fraudData);

        setStateAnalytics(stateData);

        setRecentReports(reports);

    } catch (err) {

        console.log(err);

    }

}
const trendData = stateAnalytics.map((item: any) => ({
    month: item.state,
    reports: item.total_reports,
    blocked: Math.round(item.total_reports * 0.85),
}));

const hotspots = stateAnalytics.map((item: any, index: number) => ({
    city: item.state,
    state: item.state,
    reports: item.total_reports,
    lat: 10 + index * 3,
    lng: 70 + index * 2,
}));

const pieData = fraudTypes.map((item: any, index: number) => ({
    name: item.name,
    value: item.value,
    color: [
        "#00E5FF",
        "#00C853",
        "#FFD600",
        "#FF5252",
        "#AB47BC",
        "#FF9800",
    ][index % 6],
}));
  return (
    <>
      <Topbar title="Command Dashboard" subtitle="AI-Powered Digital Public Safety & Fraud Intelligence" />
      <main className="space-y-6 p-4 md:p-8">
        {/* Welcome */}
        <section className="glass relative overflow-hidden rounded-2xl p-6 md:p-8">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[var(--gradient-cyan)] opacity-20 blur-3xl" />
          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-widest text-cyan" style={{ color: "var(--cyan)" }}>Live · National Grid</div>
              <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">Welcome back, Officer .</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
               SentinelAI processed

<span className="font-semibold text-foreground">
    {stats?.total_reports ?? 0}
</span>

citizen reports and currently

<span className="font-semibold text-foreground">
    {stats?.pending_reports ?? 0}
</span>

cases are awaiting investigation.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/scam-detector" className="inline-flex items-center gap-2 rounded-lg bg-[var(--gradient-cyan)] px-4 py-2 text-sm font-semibold text-[oklch(0.15_0.04_255)]">
                <ShieldAlert className="h-4 w-4" /> Analyze Message
              </Link>
              <Link to="/report-fraud" className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-4 py-2 text-sm font-semibold">
                <Plus className="h-4 w-4" /> New Report
              </Link>
            </div>
          </div>
        </section>

        {/* Stat cards */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Scam Reports" value={stats?.total_reports ?? 0} delta="↑ 12.4% vs last week" icon={FileWarning} accent="cyan" />
          <StatCard label="High Risk Alerts" value={stats?.pending_reports ?? 0} delta="↑ 8.1% spike detected" icon={AlertTriangle} accent="destructive" />
          <StatCard label="Fraud Types Tracked" value={fraudTypes.length} delta="3 new categories" icon={Activity} accent="warning" />
          <StatCard label="Active Citizens" value={stats?.total_reports ?? 0} delta="↑ 4,212 today" icon={Users} accent="success" />
        </section>

        {/* Charts row */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="glass rounded-2xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold">Fraud Trends</h3>
                <p className="text-xs text-muted-foreground">Reports vs blocked attempts · last 6 months</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-[var(--success)]">
                <ArrowUpRight className="h-3 w-3" /> 91% block rate
              </span>
            </div>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.82 0.15 210)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="oklch(0.82 0.15 210)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.72 0.17 155)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="oklch(0.72 0.17 155)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                  <XAxis dataKey="month" stroke="oklch(0.72 0.03 250)" fontSize={11} />
                  <YAxis stroke="oklch(0.72 0.03 250)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "oklch(0.2 0.05 257)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8 }} />
                  <Area type="monotone" dataKey="reports" stroke="oklch(0.82 0.15 210)" strokeWidth={2} fill="url(#g1)" />
                  <Area type="monotone" dataKey="blocked" stroke="oklch(0.72 0.17 155)" strokeWidth={2} fill="url(#g2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-bold">Fraud Categories</h3>
            <p className="text-xs text-muted-foreground">Share of reports this month</p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
    data={pieData}
    dataKey="value"
    innerRadius={55}
    outerRadius={85}
    paddingAngle={3}
>
    {pieData.map((d) => (
        <Cell
            key={d.name}
            fill={d.color}
        />
    ))}
</Pie>
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "oklch(0.2 0.05 257)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Map + Quick Actions */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="glass relative overflow-hidden rounded-2xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold">Crime Hotspot Map</h3>
                <p className="text-xs text-muted-foreground">India · live fraud intensity</p>
              </div>
              <Link to="/crime-intelligence" className="text-xs text-cyan hover:underline" style={{ color: "var(--cyan)" }}>Open intelligence →</Link>
            </div>
            <div className="relative mt-4 h-80 overflow-hidden rounded-xl border border-border/60 bg-[radial-gradient(ellipse_at_center,oklch(0.25_0.06_240)_0%,oklch(0.16_0.04_255)_100%)]">
              {/* Map placeholder — wire Leaflet here */}
              <div className="absolute inset-0 grid place-items-center">
                <MapIcon className="h-10 w-10 text-muted-foreground/40" />
              </div>
              {hotspots.map((h, i) => (
                <div
                  key={h.city}
                  className="absolute"
                  style={{
                    left: `${((h.lng - 68) / (97 - 68)) * 100}%`,
                    top: `${((37 - h.lat) / (37 - 8)) * 100}%`,
                  }}
                >
                  <span className="relative flex h-3 w-3 -translate-x-1/2 -translate-y-1/2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--cyan)] opacity-75" style={{ animationDelay: `${i * 0.3}s` }} />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-[var(--cyan)] shadow-[0_0_12px_var(--cyan)]" />
                  </span>
                  <span className="absolute left-3 top-0 whitespace-nowrap text-[10px] font-medium text-foreground/80">{h.city}</span>
                </div>
              ))}
              <div className="absolute bottom-3 left-3 rounded-md border border-border/60 bg-background/60 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur">
                Leaflet integration placeholder · plug coordinates from /api/hotspots
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-bold">Quick Actions</h3>
            <div className="mt-4 space-y-2">
              {[
                { to: "/scam-detector", icon: ShieldAlert, label: "Scan a suspicious message" },
                { to: "/report-fraud", icon: FileWarning, label: "File a new fraud report" },
                { to: "/fraud-shield", icon: MessageSquareWarning, label: "Ask SentinelAI assistant" },
                { to: "/crime-intelligence", icon: MapIcon, label: "Open intelligence map" },
                { to: "/admin", icon: Users, label: "Manage citizens & alerts" },
              ].map((a) => (
                <Link key={a.to} to={a.to} className="group flex items-center gap-3 rounded-lg border border-border/60 bg-secondary/30 px-3 py-3 text-sm transition hover:border-[var(--cyan)]/40 hover:bg-secondary/60">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[var(--gradient-cyan)]">
                    <a.icon className="h-4 w-4 text-[oklch(0.15_0.04_255)]" />
                  </div>
                  <span className="min-w-0 flex-1 truncate">{a.label}</span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-[var(--cyan)]" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Reports */}
        <section className="glass rounded-2xl">
          <div className="flex items-center justify-between border-b border-border/60 p-6">
            <div>
              <h3 className="font-display text-lg font-bold">Recent Scam Reports</h3>
              <p className="text-xs text-muted-foreground">Latest signals from citizens & officers</p>
            </div>
            <Link to="/admin" className="text-xs text-cyan hover:underline" style={{ color: "var(--cyan)" }}>View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-3">Reporter</th>
                  <th className="px-6 py-3">Message</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">City</th>
                  <th className="px-6 py-3">Risk</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
    {recentReports.map((report: any) => (
        <tr
            key={report.id}
            className="border-t border-border/60"
        >
            <td className="px-6 py-4">
                {report.victim_name}
            </td>

            <td className="px-6 py-4">
                {report.description}
            </td>

            <td className="px-6 py-4">
                {report.fraud_type}
            </td>

            <td className="px-6 py-4">
                {report.city}
            </td>

            <td className="px-6 py-4">
                <RiskPill
                    risk={
                        report.status === "Pending"
                            ? 90
                            : report.status === "Investigating"
                            ? 70
                            : 40
                    }
                />
            </td>

            <td className="px-6 py-4">
                {new Date(report.created_at).toLocaleDateString()}
            </td>
        </tr>
    ))}
</tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}
