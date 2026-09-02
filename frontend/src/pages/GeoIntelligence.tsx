import { useEffect, useState } from "react";

export default function GeoIntelligence() {

  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/geo/reports")
      .then(res => res.json())
      .then(data => setReports(data));
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h1>Geo Intelligence Dashboard</h1>

      {reports.map((report: any) => (
        <div key={report.id}>
          <h3>{report.victim_name}</h3>
          <p>{report.city}</p>
          <p>{report.state}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}