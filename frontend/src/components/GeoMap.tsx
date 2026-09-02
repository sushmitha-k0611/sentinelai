import "leaflet/dist/leaflet.css";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import MarkerClusterGroup from "react-leaflet-cluster";
import HeatMapLayer from "./HeatMapLayer";

type GeoReport = {
  id: number;
  victim_name: string;
  city: string;
  state: string;
  fraud_type: string;
  amount: number;
  status: string;
  latitude: number | string | null;
  longitude: number | string | null;
};

interface GeoMapProps {
  geoReports: GeoReport[];
  q: string;
  filter: string;
  statusFilter: string;
}

export default function GeoMap({
  geoReports,
  q,
  filter,
  statusFilter,
}: GeoMapProps) {

  // Search + Filter
  const filteredReports = geoReports.filter((report) => {

    const matchesState =
      !q ||
      report.state
        ?.toLowerCase()
        .includes(q.toLowerCase());

    const matchesType =
  filter === "All" ||
  report.fraud_type === filter;

const matchesStatus =
  statusFilter === "All" ||
  report.status === statusFilter;

return matchesState && matchesType && matchesStatus;
  });

  // Heatmap Points
  const heatPoints: [number, number, number?][] = filteredReports
    .filter(
      (report) =>
        report.latitude != null &&
        report.longitude != null
    )
    .map((report) => [
      Number(report.latitude),
      Number(report.longitude),
      1,
    ]);
  

  console.log("Geo Reports:", geoReports);
  console.log("Filtered:", filteredReports);

  return (
<div className="mt-5 h-[470px] w-full rounded-xl overflow-hidden border">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom={true}
        className="h-full w-full"
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Heat Map */}
        <HeatMapLayer points={heatPoints} />

        {/* Marker Clusters */}
        <MarkerClusterGroup>

          {filteredReports.map((report) => {

            if (
              report.latitude == null ||
              report.longitude == null
            ) {
              return null;
            }

            return (
              <Marker
                key={report.id}
                position={[
                  Number(report.latitude),
                  Number(report.longitude),
                ]}
              >
                <Popup>

  <div className="w-64 rounded-lg">

    <h2 className="text-lg font-bold mb-2">
      {report.victim_name}
    </h2>

    <div className="space-y-2 text-sm">

      <div className="flex justify-between">
        <span className="font-semibold">Fraud Type</span>
        <span>{report.fraud_type}</span>
      </div>

      <div className="flex justify-between">
        <span className="font-semibold">State</span>
        <span>{report.state}</span>
      </div>

      <div className="flex justify-between">
        <span className="font-semibold">City</span>
        <span>{report.city}</span>
      </div>

      <div className="flex justify-between">
        <span className="font-semibold">Amount</span>
        <span className="text-red-500 font-bold">
          ₹{Number(report.amount).toLocaleString()}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="font-semibold">Status</span>

        <span
          className={
            report.status === "Resolved"
              ? "text-green-500 font-bold"
              : report.status === "Investigating"
              ? "text-yellow-500 font-bold"
              : "text-red-500 font-bold"
          }
        >
          {report.status}
        </span>

      </div>

    </div>

  </div>

</Popup>
              </Marker>
            );

          })}

        </MarkerClusterGroup>

      </MapContainer>

    </div>
  );
}