import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, lazy, Suspense } from "react";
import { Topbar } from "@/components/Topbar";
import { Input } from "@/components/ui/input";


import {
  Search,
  Filter,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";



import {
  getDashboardStats,
  getFraudTypes,
  getStateAnalytics,
  getRecentReports,
} from "@/services/dashboard";

import { getGeoReports } from "@/services/geo";
const GeoMap = lazy(() => import("@/components/GeoMap"));

export const Route = createFileRoute("/_app/crime-intelligence")({
  ssr: false,

  head: () => ({
    meta: [{ title: "Crime Intelligence · SentinelAI" }],
  }),

  component: CrimeIntel,
});

function CrimeIntel() {

  const [q, setQ] = useState("");

  const [filter, setFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [stats, setStats] = useState<any>(null);

  const [fraudTypes, setFraudTypes] = useState<any[]>([]);

  const [stateData, setStateData] = useState<any[]>([]);

  const [recentReports, setRecentReports] = useState<any[]>([]);

  const [geoReports,setGeoReports]=useState([]);

  useEffect(() => {

  loadDashboard();

  const interval = setInterval(() => {
    loadDashboard();
  }, 30000); // Refresh every 30 seconds

  return () => clearInterval(interval);

}, []);

  async function loadDashboard() {

    try {


      const statsData = await getDashboardStats();

      const fraudData = await getFraudTypes();

      const stateAnalytics = await getStateAnalytics();

      const reports = await getRecentReports();

      const geo=await getGeoReports();
      console.log("Geo Reports:", geo);

setGeoReports(geo);

      setStats(statsData);

      setFraudTypes(fraudData);

      setStateData(stateAnalytics);

      setRecentReports(reports);

    } catch (err) {

      console.log(err);

    }

  }

  const filtered = stateData.filter((item: any) => {

    const search = item.state
      ?.toLowerCase()
      .includes(q.toLowerCase());

    const scam =
      filter === "All" ||
      item.fraud_type === filter;

    return search && scam;

  });

  const cityBars = stateData.map((item: any) => ({

    city: item.state,

    reports: item.reports,

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
  <Topbar
    title="Crime Intelligence"
    subtitle="Geospatial fraud signal · India · Live Dashboard"
  />

  <main className="space-y-6 p-4 md:p-8">

    {/* Dashboard Cards */}

    <div className="grid gap-4 md:grid-cols-4">

      <div className="glass rounded-2xl p-5">
        <p className="text-xs text-muted-foreground">
          Total Reports
        </p>

        <h2 className="mt-2 text-3xl font-bold text-cyan-400">
          {stats?.total_reports ?? 0}
        </h2>
      </div>

      <div className="glass rounded-2xl p-5">
        <p className="text-xs text-muted-foreground">
          Pending
        </p>

        <h2 className="mt-2 text-3xl font-bold text-yellow-400">
          {stats?.pending ?? 0}
        </h2>
      </div>

      <div className="glass rounded-2xl p-5">
        <p className="text-xs text-muted-foreground">
          Investigating
        </p>

        <h2 className="mt-2 text-3xl font-bold text-orange-400">
          {stats?.investigating ?? 0}
        </h2>
      </div>

      <div className="glass rounded-2xl p-5">
        <p className="text-xs text-muted-foreground">
          Resolved
        </p>

        <h2 className="mt-2 text-3xl font-bold text-green-400">
          {stats?.resolved ?? 0}
        </h2>
      </div>

    </div>

    <div className="grid gap-6 lg:grid-cols-3">

      <div className="glass relative overflow-hidden rounded-2xl p-6 lg:col-span-2">

        <div className="grid grid-cols-[1fr_auto] gap-3">

          <div>

            <h3 className="text-lg font-bold">
              Interactive Fraud Hotspot Map
            </h3>

            <p className="text-xs text-muted-foreground">
              AI Generated Hotspots
            </p>

          </div>

          <div className="flex gap-2">

            <div className="relative">

              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>

              <Input
                value={q}
                onChange={(e)=>setQ(e.target.value)}
                placeholder="Search State"
                className="pl-10"
              />

            </div>

            <div className="flex items-center rounded-lg border px-2">

              <Filter className="mr-2 h-4 w-4"/>

              <select
                value={filter}
                onChange={(e)=>setFilter(e.target.value)}
                className="bg-transparent outline-none"
              >

                <option value="All">
                  All
                </option>

                {fraudTypes.map((item: any) => (
                  <option
                    key={item.name}
                    value={item.name}
                  >
                    {item.name}
                  </option>
                ))}

              </select>

            </div>
            <div className="flex items-center rounded-lg border px-2">

  <Filter className="mr-2 h-4 w-4" />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="bg-transparent outline-none"
  >
    <option value="All">All Status</option>
    <option value="Pending">Pending</option>
    <option value="Investigating">Investigating</option>
    <option value="Resolved">Resolved</option>
  </select>

</div>

          </div>

        <Suspense fallback={<div>Loading map...</div>}>
        <div className="mt-5 w-full h-[470px]"></div>
  <GeoMap
  geoReports={geoReports}
  q={q}
  filter={filter}
  statusFilter={statusFilter}
/>
</Suspense>
</div>

      </div>
            <div className="space-y-6">

        {/* Top States */}

        <div className="glass rounded-2xl p-6">

          <h3 className="text-lg font-bold">
            Top States
          </h3>

          <p className="text-xs text-muted-foreground">
            Based on Report Count
          </p>

          <div className="mt-4 space-y-3">

            {[...stateData]
              .sort(
                (a: any, b: any) =>
                  b.reports - a.reports
              )
              .slice(0, 5)
              .map((item: any, index: number) => (

                <div
                  key={index}
                  className="grid grid-cols-[35px_1fr_auto] items-center gap-3"
                >

                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-secondary font-bold">
                    {index + 1}
                  </div>

                  <div>

                    <div className="font-semibold">
                      {item.state}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {item.reports} Reports
                    </div>

                  </div>

                  <div className="font-bold text-cyan-400">

                    {item.reports}

                  </div>

                </div>

              ))}

          </div>

        </div>

        {/* Pie Chart */}

        <div className="glass rounded-2xl p-6">

          <h3 className="text-lg font-bold">
            Fraud Category Distribution
          </h3>

          <div className="mt-4 h-64">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={80}
                  paddingAngle={3}
                >

                  {pieData.map((item: any) => (

                    <Cell
                      key={item.name}
                      fill={item.color}
                    />

                  ))}

                </Pie>

                <Legend />

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </div>
            <div className="glass rounded-2xl p-6">

          <h3 className="text-lg font-bold">
            State-wise Fraud Reports
          </h3>

          <div className="mt-5 h-72">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={cityBars}
                margin={{
                  left: -10,
                  right: 10,
                  top: 10,
                  bottom: 0,
                }}
              >

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="city"
                  fontSize={11}
                />

                <YAxis
                  fontSize={11}
                />

                <Tooltip />

                <Bar
                  dataKey="reports"
                  fill="#00E5FF"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* Recent Reports */}

        <div className="glass rounded-2xl p-6">

          <h3 className="text-lg font-bold">
            Recent Fraud Reports
          </h3>

          <div className="mt-5 overflow-x-auto">

            <table className="w-full text-sm">

              <thead>

                <tr className="border-b border-border">

                  <th className="py-3 text-left">
                    Victim
                  </th>

                  <th className="py-3 text-left">
                    Fraud Type
                  </th>

                  <th className="py-3 text-left">
                    State
                  </th>

                  <th className="py-3 text-left">
                    Amount
                  </th>

                  <th className="py-3 text-left">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {recentReports.map((report: any) => (

                  <tr
                    key={report.id}
                    className="border-b border-border/50"
                  >

                    <td className="py-3">
                      {report.victim_name}
                    </td>

                    <td className="py-3">
                      {report.fraud_type}
                    </td>

                    <td className="py-3">
                      {report.state}
                    </td>

                    <td className="py-3">
                      ₹{Number(report.amount).toLocaleString()}
                    </td>

                    <td className="py-3">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold
                        ${
                          report.status === "Resolved"
                            ? "bg-green-500/20 text-green-400"
                            : report.status === "Investigating"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >

                        {report.status}

                      </span>

                    </td>

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

export default CrimeIntel;


