// src/components/KpiCard.jsx
import React from "react";

const tones = {
  indigo:  { line: "#6366f1", wash: "#eef2ff" },
  amber:   { line: "#f59e0b", wash: "#fffbeb" },
  emerald: { line: "#10b981", wash: "#ecfdf5" },
  sky:     { line: "#0ea5e9", wash: "#f0f9ff" },
  slate:   { line: "#64748b", wash: "#f1f5f9" },
};

const fmtMoney = (n) => {
  const v = Number(n || 0);
  return isNaN(v) ? "—" : `$${v.toLocaleString()}`;
};

export default function KpiCard({
  title,
  value,
  subtitle = "",
  badge,
  tone = "indigo",
  loading = false,
  format = "money",        // "money" | "raw"
  density = "ultra",       // kept for API compatibility
  size = "hero",           // kept for API compatibility
}) {
  const c = tones[tone] || tones.indigo;
  const HEADER_H = 44;

  const amount =
    loading ? "—" : format === "money" ? fmtMoney(value) : String(value ?? "—");

  return (
    <div
      className="kpi-card"
      style={{
        position: "relative",
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #e9eef7",
        boxShadow: "0 1px 2px rgba(2,6,23,.04)",
        padding: 10,
        minHeight: 106,
        display: "grid",
        gridTemplateRows: "auto 1fr",
        gap: 6,
        overflow: "hidden",
      }}
    >
      {/* top accent */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: "0 0 auto 0",
          height: 3,
          background: `linear-gradient(90deg, ${c.line}, ${c.line}77)`,
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
        }}
      />
      {/* soft wash */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 8,
          right: 8,
          top: 10 + HEADER_H,
          bottom: 8,
          background: c.wash,
          borderRadius: 10,
        }}
      />

      {/* header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: HEADER_H,
          minWidth: 0,
        }}
      >
        <div
          style={{
            fontWeight: 900,
            color: "#0b1e33",
            fontSize: 14,
            letterSpacing: ".2px",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </div>
        {badge ? (
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: c.line,
              background: "#fff",
              border: `1px solid ${c.line}55`,
              padding: "2px 7px",
              borderRadius: 999,
            }}
          >
            {badge}
          </span>
        ) : null}
      </div>

      {/* amount */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 900,
            color: "#0b1e33",
            lineHeight: 1.1,
          }}
        >
          {amount}
        </div>
        {subtitle ? (
          <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>
            {subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
}
