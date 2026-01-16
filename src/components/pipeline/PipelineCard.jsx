import React from "react";
import { money } from "../../utils/format";

export default function PipelineCard({ rows }) {
  const max = Math.max(...rows.map(r => r.value), 1);

  return (
    <div style={{
      position: "relative",
      background: "#fff",
      borderRadius: 16,
      padding: 16,
      boxShadow: "0 1px 2px rgba(0,0,0,.06), 0 1px 1px rgba(0,0,0,.04)",
      minHeight: 220
    }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 4,
          background: "linear-gradient(90deg,#0ea5e9 0%,#22d3ee 100%)",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16
        }}
      />
      <div style={{ fontWeight: 600, color: "#111827" }}>Pipeline</div>
      <div style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 6px" }}>
        Snapshot of <strong>Funds Secured (FYTD)</strong> by status — reconciled to Secured (FYTD)
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        {rows.map((r) => {
          const w = Math.max(6, Math.round((r.value / max) * 100));
          return (
            <div
              key={r.label}
              style={{ display: "grid", gridTemplateColumns: "220px 1fr 120px", alignItems: "center", gap: 10 }}
            >
              <div style={{ color: "#374151", fontWeight: 600 }}>{r.label}</div>
              <div style={{ background: "#f3f4f6", borderRadius: 999, overflow: "hidden", height: 10 }}>
                <div
                  style={{
                    width: `${w}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${r.color} 0%, ${r.color}33 100%)`
                  }}
                />
              </div>
              <div style={{ textAlign: "right", fontWeight: 700, color: "#111827" }}>{money(r.value)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
