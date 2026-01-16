// C:\TRUSTA-FRONTEND\src\pages\ProjectDetail.jsx
import React from "react";
import { Link, useParams } from "react-router-dom";

// money formatter
const money = (v) => `$${(v || 0).toLocaleString()}`;

// status chip
const Chip = ({ text, tone = "neutral" }) => {
  const tones = {
    neutral: { bg: "#eef2f7", fg: "#374151", bd: "#e5e7eb" },
    warn:    { bg: "#fff7ed", fg: "#d97706", bd: "#fb923c" },
    qa:      { bg: "#f0f9ff", fg: "#0284c7", bd: "#bae6fd" },
    sched:   { bg: "#f5f3ff", fg: "#7c3aed", bd: "#ddd6fe" },
    pending: { bg: "#fef2f2", fg: "#b91c1c", bd: "#fecaca" },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 22,
        padding: "0 8px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.bd}`,
      }}
    >
      {text}
    </span>
  );
};

// card styles (match the dashboard)
const card = {
  background: "#fff",
  borderRadius: 12,
  padding: 16,
  boxShadow: "0 1px 2px rgba(0,0,0,.06), 0 1px 1px rgba(0,0,0,.04)",
};
const strip = (grad) => ({
  position: "relative",
  margin: "-16px -16px 12px -16px",
  height: 6,
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  background: grad,
});
const label = { fontSize: 12, color: "#6b7280" };
const h6 = { fontWeight: 700, color: "#111827", marginBottom: 6 };
const row = {
  display: "grid",
  gridTemplateColumns: "1.4fr 0.8fr 1fr 1fr",
  alignItems: "center",
  padding: "10px 0",
  borderBottom: "1px solid #f3f4f6",
};
const headerRow = {
  ...row,
  fontSize: 12,
  color: "#6b7280",
  paddingTop: 0,
  paddingBottom: 6,
  borderBottom: "1px solid #e5e7eb",
};
const btn = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  background: "#fff",
  cursor: "pointer",
};

export default function ProjectDetail() {
  const { id } = useParams();

  // ===== Demo data (swap to API later) =====
  const project = {
    id,
    title: "High St Apartments",
    client: "CityBuild Pty Ltd",
    status: "Active",
    value: 2400000,
    variations: [
      { id: "V-9001", title: "Extra risers", amount: 18000, reason: "Scope change", status: "Pending" },
    ],
  };

  // Milestones — mirrors your modal screenshot
  const milestonesPaid = [
    { id: "M-1", title: "Deposit",  amount: 84000, paidOn: "2025-08-03" },
    { id: "M-2", title: "Rough-in", amount: 84000, paidOn: "2025-08-18" },
  ];
  const milestonesTodo = [
    { id: "M-3", title: "Fit-off",        amount: 84000, status: { text: "Awaiting Approval", tone: "warn" }, due: "2025-09-05" },
    { id: "M-4", title: "Testing",        amount: 84000, status: { text: "In QA",              tone: "qa"   }, due: "2025-09-20" },
    { id: "M-5", title: "Practical Comp", amount: 84000, status: { text: "Scheduled",          tone: "sched"}, due: "2025-10-01" },
  ];
  const totalPaid = milestonesPaid.reduce((t, m) => t + m.amount, 0);
  const totalTodo = milestonesTodo.reduce((t, m) => t + m.amount, 0);

  const onReleaseEscrow = (m) => {
    // hook this to your API
    alert(`Release escrow for "${m.title}" (${money(m.amount)})`);
  };

  return (
    <div style={{ padding: 16 }}>
      {/* Back + title */}
      <div style={{ marginBottom: 10 }}>
        <Link to="/projects" style={{ textDecoration: "none", color: "#0ea5e9" }}>
          ← Back to Jobs
        </Link>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111827" }}>
          {project.title}
        </h2>
        <span style={{ color: "#6b7280" }}>(J-1001)</span>
      </div>

      {/* Job Info */}
      <section style={{ ...card, marginBottom: 12 }}>
        <div style={strip("linear-gradient(90deg,#2563eb 0%,#60a5fa 100%)")} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: 12,
          }}
        >
          <div>
            <div style={label}>Title</div>
            <div style={h6}>{project.title}</div>
          </div>
          <div>
            <div style={label}>Client</div>
            <div style={h6}>{project.client}</div>
          </div>
          <div>
            <div style={label}>Status</div>
            <div style={h6}>{project.status}</div>
          </div>
          <div>
            <div style={label}>Value</div>
            <div style={h6}>{money(project.value)}</div>
          </div>
        </div>
      </section>

      {/* Variations */}
      <section style={{ ...card, marginBottom: 12 }}>
        <div style={strip("linear-gradient(90deg,#0ea5e9 0%,#22d3ee 100%)")} />
        <div style={h6}>Variations</div>

        <div style={{ border: "1px solid #eef2f7", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ ...headerRow, padding: "10px 12px", background: "#fafafa", gridTemplateColumns: "1fr 2fr 1fr 2fr 1fr" }}>
            <div>ID</div>
            <div>Title</div>
            <div>Amount</div>
            <div>Reason</div>
            <div>Status</div>
          </div>

          {project.variations.map((v) => (
            <div key={v.id} style={{ ...row, padding: "12px", gridTemplateColumns: "1fr 2fr 1fr 2fr 1fr" }}>
              <div>{v.id}</div>
              <div>
                <Link to="#" style={{ color: "#0ea5e9", textDecoration: "none" }}>{v.title}</Link>
              </div>
              <div style={{ fontWeight: 700, color: "#111827" }}>{money(v.amount)}</div>
              <div>{v.reason}</div>
              <div><Chip text={v.status} tone="pending" /></div>
            </div>
          ))}
        </div>
      </section>

      {/* Milestones (REPLACES the old "Contractors & Contracts" table) */}
      <section style={{ ...card, marginBottom: 12 }}>
        <div style={strip("linear-gradient(90deg,#2563eb 0%,#60a5fa 100%)")} />
        <div style={h6}>Milestones</div>

        {/* Paid */}
        <div style={{ ...card, padding: 12, margin: "12px 0", boxShadow: "none", border: "1px solid #eef2f7" }}>
          <div style={{ ...h6, marginBottom: 12 }}>
            Paid ({milestonesPaid.length}) — <span style={{ color: "#111827" }}>{money(totalPaid)}</span>
          </div>
          <div style={{ ...headerRow, gridTemplateColumns: "2fr 1fr 1fr", paddingTop: 0 }}>
            <div>Milestone</div>
            <div>Amount</div>
            <div>Paid On</div>
          </div>
          {milestonesPaid.map((m) => (
            <div key={m.id} style={{ ...row, gridTemplateColumns: "2fr 1fr 1fr" }}>
              <div>
                <Link to="#" style={{ color: "#0ea5e9", textDecoration: "none" }}>{m.title}</Link>
              </div>
              <div style={{ fontWeight: 700, color: "#111827" }}>{money(m.amount)}</div>
              <div>{m.paidOn}</div>
            </div>
          ))}
        </div>

        {/* To be done */}
        <div style={{ ...card, padding: 12, margin: "12px 0 0", boxShadow: "none", border: "1px solid #eef2f7" }}>
          <div style={{ ...h6, marginBottom: 12 }}>
            To be done ({milestonesTodo.length}) — <span style={{ color: "#111827" }}>{money(totalTodo)}</span>
          </div>
          <div style={{ ...headerRow, gridTemplateColumns: "2fr 1fr 1fr 1fr", paddingTop: 0 }}>
            <div>Milestone</div>
            <div>Amount</div>
            <div>Status</div>
            <div style={{ textAlign: "right" }}>Due / Actions</div>
          </div>
          {milestonesTodo.map((m) => (
            <div key={m.id} style={{ ...row, gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
              <div>
                <Link to="#" style={{ color: "#0ea5e9", textDecoration: "none" }}>{m.title}</Link>
              </div>
              <div style={{ fontWeight: 700, color: "#111827" }}>{money(m.amount)}</div>
              <div><Chip text={m.status.text} tone={m.status.tone} /></div>
              <div style={{ textAlign: "right", display: "flex", gap: 8, justifyContent: "flex-end", alignItems: "center" }}>
                <span style={{ color: "#6b7280", fontSize: 12 }}>{m.due}</span>
                <button style={btn} onClick={() => onReleaseEscrow(m)}>Release Escrow</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

