import React, { useMemo } from "react";

/**
 * PipelineCard — compact bars with equal height to FundsChart.
 * Props:
 *  - rows: [{ label, value, color }]
 *  - height?: number (default 280)
 */
export default function PipelineCard({ rows = [], height = 280 }) {
  const msMax = useMemo(() => Math.max(...rows.map((r) => r.value), 1), [rows]);

  const card = {
    position: "relative",
    background: "#fff",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 1px 2px rgba(0,0,0,.06), 0 1px 1px rgba(0,0,0,.04)",
    border: "1px solid #e9eef7",
  };

  return (
    <div style={{ ...card, height, display: "grid", gridTemplateRows: "auto auto 1fr", gap: 8 }}>
      <div
        aria-hidden
        style={{ position: "absolute", inset: "0 0 auto 0", height: 4,
                 background: "linear-gradient(90deg,#0ea5e9 0%,#22d3ee 100%)",
                 borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
      />
      <div style={{ fontWeight: 600, color: "#111827" }}>Pipeline</div>
      <div style={{ fontSize: 12, color: "#6b7280" }}>
        Snapshot of <strong>Funds Secured (FYTD)</strong> by status — reconciled to Secured (FYTD)
      </div>

      <div style={{ minHeight: 0, display: "grid", alignContent: "center", gap: 12 }}>
        {rows.map((row) => {
          const widthPct = Math.max(6, Math.round((row.value / msMax) * 100));
          return (
            <div key={row.label} style={{ display: "grid", gridTemplateColumns: "220px 1fr 120px", alignItems: "center", gap: 10 }}>
              <div style={{ color: "#374151", fontWeight: 600 }}>{row.label}</div>
              <div style={{ background: "#f3f4f6", borderRadius: 999, overflow: "hidden", height: 10 }}>
                <div
                  style={{
                    width: `${widthPct}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${row.color} 0%, ${row.color}33 100%)`,
                  }}
                />
              </div>
              <div style={{ textAlign: "right", fontWeight: 700, color: "#111827" }}>
                ${row.value.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
