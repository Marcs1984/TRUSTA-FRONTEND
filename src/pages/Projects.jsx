// src/pages/Projects.jsx
import React, { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJobs } from "./Projects/useJobs";

// Lazy-load the heavy wizard (keeps this page small & fast)
const NewJobWizard = React.lazy(() => import("../features/newJob/NewJobWizard.jsx"));

const AUD = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

export default function Projects() {
  const navigate = useNavigate();
  const { jobs, loading, err } = useJobs();
  const [showWizard, setShowWizard] = useState(false);

  return (
    <div>
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <h2 style={{ margin: 0 }}>Jobs</h2>
        <button style={newBtn} onClick={() => setShowWizard(true)}>
          + New Job
        </button>
      </div>

      {/* Table */}
      <div className="kpi-card">
        {loading ? (
          <div>Loading jobs…</div>
        ) : err ? (
          <div style={{ color: "#b91c1c" }}>Error: {err}</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Job ID</th>
                <th style={th}>Title</th>
                <th style={th}>Client</th>
                <th style={th}>Status</th>
                <th style={{ ...th, textAlign: "right" }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr
                  key={j.id}
                  onClick={() => navigate(`/projects/${j.id}`)}
                  style={row}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                >
                  <td style={td}>{j.id}</td>
                  <td style={td}>{j.title}</td>
                  <td style={td}>{j.client}</td>
                  <td style={td}>{j.status}</td>
                  <td style={{ ...td, textAlign: "right" }}>{AUD.format(j.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Lazy wizard (mounted only when needed so overlay never blocks clicks) */}
      {showWizard && (
        <Suspense fallback={null}>
          <NewJobWizard onClose={() => setShowWizard(false)} />
        </Suspense>
      )}
    </div>
  );
}

/* ---- styles ---- */
const th = {
  textAlign: "left",
  padding: "10px",
  borderBottom: "1px solid #e5e7eb",
  fontWeight: 700,
  fontSize: ".9rem",
  color: "#374151",
};

const td = {
  padding: "10px",
  borderBottom: "1px solid #f3f4f6",
  fontSize: ".92rem",
  color: "#111827",
};

const row = {
  cursor: "pointer",
  transition: "background .15s ease",
};

const newBtn = {
  padding: "8px 12px",
  background: "#0ea5e9",
  color: "#fff",
  border: 0,
  borderRadius: 8,
  cursor: "pointer",
};
