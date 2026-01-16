import React from "react";

/**
 * MilestonesCard — compact height with centered bars.
 * Props:
 *  - height?: number (default 230)
 */
export default function MilestonesCard({ height = 230 }) {
  const card = {
    position: "relative",
    background: "#fff",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 1px 2px rgba(0,0,0,.06), 0 1px 1px rgba(0,0,0,.04)",
    border: "1px solid #e9eef7",
  };
  const strip = (grad) => ({
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 4,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    background: grad,
  });
  const milestoneStatus = [
    { label: "Scheduled", color: "#2563eb", count: 7 },
    { label: "Awaiting Approval", color: "#d97706", count: 4 },
    { label: "Paid", color: "#16a34a", count: 5 },
    { label: "In QA", color: "#7c3aed", count: 2 },
  ];
  const msTotal = milestoneStatus.reduce((t, s) => t + s.count, 0) || 1;
  const pct = (n) => Math.round((n / msTotal) * 100);

  return (
    <div style={{ ...card, height, display: "grid", gridTemplateRows: "auto 1fr", gap: 8 }}>
      <div style={strip("linear-gradient(90deg,#2563eb 0%,#60a5fa 100%)")} />
      <div style={{ fontWeight: 600, color: "#111827" }}>Milestone Status</div>

      <div style={{ minHeight: 0, display: "grid", alignContent: "center", gap: 10 }}>
        {milestoneStatus.map((s) => {
          const widthPct = (s.count / msTotal) * 100;
          return (
            <div key={s.label} style={{ display: "grid", gridTemplateColumns: "180px 1fr 100px", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#111827", fontWeight: 600 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: s.color }} />
                {s.label}
              </div>
              <div style={{ background: "#eef2f7", height: 12, borderRadius: 10, overflow: "hidden", boxShadow: "inset 0 0 0 1px #e5e7eb" }}>
                <div style={{ width: `${widthPct}%`, height: "100%", background: s.color, borderRadius: 10 }} />
              </div>
              <div style={{ textAlign: "right", fontWeight: 800, color: "#111827" }}>
                {s.count} · {pct(s.count)}%
              </div>
            </div>
          );
        })}
        <div style={{ fontSize: 12, color: "#6b7280" }}>
          <strong style={{ color: "#111827" }}>{msTotal}</strong> milestones total
        </div>
      </div>
    </div>
  );
}
