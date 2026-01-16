import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

/**
 * VariationsCard — compact donut with right legend.
 * Props:
 *  - height?: number (default 230)
 */
export default function VariationsCard({ height = 230 }) {
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
  const data = [
    { key: "pending",       name: "Pending approval", value: 6, color: "#3b82f6" },
    { key: "clarification", name: "In clarification", value: 2, color: "#f97316" },
    { key: "watchlist",     name: "Watchlist",        value: 3, color: "#ef4444" },
  ];
  const total = data.reduce((t, v) => t + v.value, 0);

  // compute a square size for the donut inside the given height
  const innerPadding = 18;
  const CHART_SIDE = Math.min(190, Math.max(160, height - innerPadding * 2));

  return (
    <div style={{ ...card, height, display: "grid", gridTemplateRows: "auto 1fr", gap: 8 }}>
      <div style={strip("linear-gradient(90deg,#f59e0b 0%,#f97316 100%)")} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, color: "#111827" }}>
        Variations & Disputes
        <span
          title={"Pending approval — waiting on approval.\nIn clarification — clarification/dispute in progress.\nWatchlist — trending towards delay."}
          style={{ width: 16, height: 16, borderRadius: 999, border: "1px solid #d1d5db", color: "#6b7280",
                   display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, cursor: "help" }}
        >
          i
        </span>
      </div>

      <div style={{ minHeight: 0, display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "center", gap: 16 }}>
        <div style={{ width: CHART_SIDE, height: CHART_SIDE }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={CHART_SIDE * 0.27}
                outerRadius={CHART_SIDE * 0.36}
                paddingAngle={2}
                label={false}
                labelLine={false}
                isAnimationActive={false}
              >
                {data.map((d) => <Cell key={d.key} fill={d.color} />)}
              </Pie>
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 20, fontWeight: 700, fill: "#111827" }}>{total}</text>
              <Tooltip formatter={(val, _name, payload) => [`${val}`, payload?.payload?.name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: "grid", gap: 6, fontSize: 13 }}>
          {data.map((d) => (
            <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: 4, background: d.color, display: "inline-block" }} />
              <span style={{ color: "#111827" }}>{d.name}</span>
              <span style={{ marginLeft: "auto", color: "#374151", fontWeight: 700 }}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
