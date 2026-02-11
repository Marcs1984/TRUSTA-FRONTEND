// src/pages/Projects.jsx
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJobs } from "./Projects/useJobs";

// Lazy-load the heavy wizard (keeps this page small & fast)
const NewJobWizard = React.lazy(() => import("../features/newJob/NewJobWizard.jsx"));

const AUD = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

// localStorage key for hiding jobs locally (safe stub)
const LS_HIDDEN_JOBS_KEY = "trusta_hidden_jobs_v1";

function loadHiddenJobs() {
  try {
    const raw = localStorage.getItem(LS_HIDDEN_JOBS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function saveHiddenJobs(list) {
  try {
    localStorage.setItem(LS_HIDDEN_JOBS_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export default function Projects() {
  const navigate = useNavigate();
  const { jobs: hookJobs, loading, err } = useJobs();
  const [showWizard, setShowWizard] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [hiddenJobIds, setHiddenJobIds] = useState(() => loadHiddenJobs());
  const hiddenSet = useMemo(() => new Set(hiddenJobIds.map(String)), [hiddenJobIds]);

  useEffect(() => {
    setJobs(Array.isArray(hookJobs) ? hookJobs : []);
  }, [hookJobs]);

  useEffect(() => {
    saveHiddenJobs(hiddenJobIds);
  }, [hiddenJobIds]);

  const handleSaved = (createdJob) => {
    if (!createdJob) return;

    setJobs((prev) => {
      const next = [...prev];
      const idx = next.findIndex((x) => String(x.id) === String(createdJob.id));
      if (idx >= 0) next[idx] = createdJob;
      else next.unshift(createdJob);
      return next;
    });

    setHiddenJobIds((prev) => prev.filter((x) => String(x) !== String(createdJob.id)));
    setShowWizard(false);
  };

  // ✅ REAL DELETE FUNCTION
  const deleteJob = async (jobId) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this job?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Delete failed");
        return;
      }

      // remove from screen instantly
      setJobs((prev) => prev.filter((j) => String(j.id) !== String(jobId)));
    } catch (err) {
      console.error(err);
      alert("Server error deleting job");
    }
  };

  const unhideAll = () => {
    setHiddenJobIds([]);
  };

  const rows = useMemo(() => {
    const list = jobs || [];
    return list.filter((j) => !hiddenSet.has(String(j.id)));
  }, [jobs, hiddenSet]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <h2 style={{ margin: 0 }}>Jobs</h2>

          {hiddenJobIds.length ? (
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              ({hiddenJobIds.length} hidden){" "}
              <button
                type="button"
                style={linkBtn}
                onClick={unhideAll}
                title="Show all hidden jobs again"
              >
                Reset hidden
              </button>
            </div>
          ) : null}
        </div>

        <button style={newBtn} onClick={() => setShowWizard(true)}>
          + New Job
        </button>
      </div>

      <div className="kpi-card">
        {loading ? (
          <div>Loading jobs…</div>
        ) : err ? (
          <div style={{ color: "#b91c1c" }}>Error: {err}</div>
        ) : rows.length === 0 ? (
          <div style={{ padding: 12, color: "#6b7280" }}>
            No jobs yet. Click <b>+ New Job</b> to create one.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Job ID</th>
                <th style={th}>Title</th>
                <th style={th}>Client</th>
                <th style={th}>Status</th>
                <th style={{ ...th, textAlign: "right" }}>Value</th>
                <th style={{ ...th, textAlign: "right", width: 110 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((j) => (
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
                  <td style={{ ...td, textAlign: "right" }}>
                    {AUD.format(Number(j.value) || 0)}
                  </td>

                  <td style={{ ...td, textAlign: "right" }}>
                    <button
                      type="button"
                      style={hideBtn}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteJob(j.id);
                      }}
                      title="Permanently delete job"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && !err && hiddenJobIds.length ? (
          <div style={{ padding: 10, fontSize: 12, color: "#6b7280" }}>
            Hidden jobs are only hidden on this browser/device. Use <b>Reset hidden</b> to show them again.
          </div>
        ) : null}
      </div>

      {showWizard && (
        <Suspense fallback={null}>
          <NewJobWizard onClose={() => setShowWizard(false)} onSaved={handleSaved} />
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

const hideBtn = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 12,
  color: "#111827",
};

const linkBtn = {
  border: 0,
  background: "transparent",
  color: "#0ea5e9",
  cursor: "pointer",
  fontWeight: 700,
  padding: 0,
};
