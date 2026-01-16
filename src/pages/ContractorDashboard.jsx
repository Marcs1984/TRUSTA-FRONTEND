// C:\TRUSTA-FRONTEND\src\pages\ContractorDashboard.jsx
import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ===== Demo FYTD data (wire to API later) =====
const KPI = {
  jobsWonCountFYTD: 22,
  jobsWonValueFYTD: 6_900_000,  // total contract value won FYTD
  invoicedFYTD:     4_120_000,  // invoices issued FYTD
  paidFYTD:         3_480_000,  // cash received FYTD
  milestonesPaid:   96,
  milestonesTotal:  140,
};
// Derived (reconciled)
const outstandingAR = Math.max(0, KPI.invoicedFYTD - KPI.paidFYTD); // = 640,000
const escrowBalance = Math.max(0, KPI.jobsWonValueFYTD - KPI.paidFYTD); // everything not yet paid
const notYetInvoiced = Math.max(0, escrowBalance - outstandingAR);      // portion still un-invoiced
const milestonesRemaining = Math.max(0, KPI.milestonesTotal - KPI.milestonesPaid);

// AR aging must sum to outstandingAR
const arAging = [
  { key: "current",  name: "0–30d",  value: 420_000, color: "#60a5fa" },
  { key: "overdue1", name: "31–60d", value: 160_000, color: "#f59e0b" },
  { key: "disputed", name: "Disputed", value: 60_000, color: "#ef4444" },
]; // 420k + 160k + 60k = 640k

// Backlog breakdown must sum to jobsWonValueFYTD
const backlogBreakdown = [
  { stage: "Paid (FYTD)",            value: KPI.paidFYTD,         color: "#10b981" },
  { stage: "Outstanding A/R",        value: outstandingAR,        color: "#f59e0b" },
  { stage: "Not Yet Invoiced",       value: notYetInvoiced,       color: "#38bdf8" },
];

// Trend ends at KPI totals
const fundsTrend = [
  { m: "Jul", invoiced:  300_000, paid:  180_000 },
  { m: "Aug", invoiced:  650_000, paid:  420_000 },
  { m: "Sep", invoiced:  980_000, paid:  640_000 },
  { m: "Oct", invoiced: 1_350_000, paid:  920_000 },
  { m: "Nov", invoiced: 1_740_000, paid: 1_230_000 },
  { m: "Dec", invoiced: 2_120_000, paid: 1_560_000 },
  { m: "Jan", invoiced: 2_680_000, paid: 2_120_000 },
  { m: "Feb", invoiced: 3_200_000, paid: 2_720_000 },
  { m: "Mar", invoiced: 3_720_000, paid: 3_200_000 },
  { m: "Apr", invoiced: 4_120_000, paid: 3_480_000 }, // === KPI
];

// Milestone status small-multiples
const milestoneStatus = [
  { label: "Paid",              color: "#10b981", count: KPI.milestonesPaid },
  { label: "Scheduled",         color: "#1d4ed8", count: 28 },
  { label: "Awaiting Approval", color: "#d97706", count: 10 },
  { label: "In QA",             color: "#7c3aed", count: 6 },
];

const money = (v) => `$${(v || 0).toLocaleString()}`;

// ------- styles (identical to Builder) -------
const wrapper = { padding: "12px 16px 8px 16px", overflowX: "hidden", minWidth: 0 };
const grid4   = { display: "grid", gap: 12, gridTemplateColumns: "repeat(4, minmax(0, 1fr))" };
const grid2   = { display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" };
const grid31  = { display: "grid", gap: 12, gridTemplateColumns: "3fr 2fr" };
const card = {
  position: "relative",
  background: "#fff",
  borderRadius: 16,
  padding: 16,
  boxShadow: "0 1px 2px rgba(0,0,0,.06), 0 1px 1px rgba(0,0,0,.04)",
  minHeight: 124,
};
const strip = (grad) => ({
  position: "absolute",
  left: 0, right: 0, top: 0,
  height: 6,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  background: grad,
});
const label = { fontSize: 12, color: "#6b7280" };
const big   = { marginTop: 4, fontSize: 22, lineHeight: "28px", fontWeight: 700, color: "#111827" };
const pill  = (type) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "2px 8px",
  borderRadius: 999,
  fontSize: 11,
  ...(type === "up"
    ? { background: "#ecfdf5", color: "#047857", border: "1px solid #a7f3d0" }
    : type === "down"
    ? { background: "#ffe4e6", color: "#be123c", border: "1px solid #fecdd3" }
    : { background: "#f3f4f6", color: "#4b5563", border: "1px solid #e5e7eb" }),
});
const Pill = ({ type, text }) => (
  <span style={pill(type)}>
    <span aria-hidden>{type === "up" ? "▲" : type === "down" ? "▼" : "•"}</span>
    <span>{text}</span>
  </span>
);

// Reusable KPI card with optional hover popover
const KpiCard = ({ title, period, value, grad, deltaText, deltaType="flat", info=[] , badgeText, badgeVariant="error" }) => {
  const [hover, setHover] = useState(false);
  return (
    <div style={card} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
      <div style={strip(grad)} />
      {badgeText && (
        <span style={{
          position: "absolute", top: 8, right: 8, fontSize: 11, padding: "4px 8px",
          borderRadius: 999, fontWeight: 700,
          color: badgeVariant === "error" ? "#991b1b" : "#1f2937",
          background: badgeVariant === "error" ? "#fee2e2" : "#e5e7eb",
          border: badgeVariant === "error" ? "1px solid #fecaca" : "1px solid #e5e7eb",
        }}>
          {badgeText}
        </span>
      )}
      <div style={label}>
        {title} {period && <strong>({period})</strong>}
      </div>
      <div style={big}>{value}</div>
      {deltaText && <div style={{ marginTop: 8 }}><Pill type={deltaType} text={deltaText} /></div>}

      {hover && info.length > 0 && (
        <div style={{
          position: "absolute", top: 8, right: 8, zIndex: 10, width: 300,
          background: "#fff", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,.12)",
          border: "1px solid #eef2f7", padding: 12,
        }}>
          <div style={{ fontWeight: 700, color: "#111827", marginBottom: 6 }}>{title} details</div>
          <div style={{ display: "grid", gap: 6, fontSize: 12, color: "#6b7280" }}>
            {info.map((t, i) => <div key={i} style={{ lineHeight: 1.3 }}>{t}</div>)}
          </div>
        </div>
      )}
    </div>
  );
};

export default function ContractorDashboard() {
  const maxBacklog = useMemo(
    () => Math.max(...backlogBreakdown.map((x) => x.value), 1),
    []
  );
  const pctMilestones = Math.round((KPI.milestonesPaid / Math.max(1, KPI.milestonesTotal)) * 100);

  return (
    <div style={wrapper}>
      {/* ===== KPI Row ===== */}
      <section style={grid4}>
        <KpiCard
          title="Jobs Won"
          period="FYTD"
          value={`${money(KPI.jobsWonValueFYTD)} · ${KPI.jobsWonCountFYTD} jobs`}
          grad="linear-gradient(90deg,#2563eb 0%,#60a5fa 100%)"
          deltaText="+2 won this month"
          deltaType="up"
          info={[
            "Total contract value awarded FYTD.",
            `Milestones total: ${KPI.milestonesTotal} (${KPI.milestonesPaid} paid, ${milestonesRemaining} remaining).`,
          ]}
        />

        <KpiCard
          title="Invoiced"
          period="FYTD"
          value={money(KPI.invoicedFYTD)}
          grad="linear-gradient(90deg,#3b82f6 0%,#10b981 100%)"
          deltaText="+12.4% vs last month"
          deltaType="up"
          badgeText={KPI.invoicedFYTD < KPI.paidFYTD ? "Check data" : undefined}
          info={[
            `Paid FYTD: ${money(KPI.paidFYTD)}`,
            `Outstanding A/R: ${money(outstandingAR)}`,
          ]}
        />

        <KpiCard
          title="Paid"
          period="FYTD"
          value={money(KPI.paidFYTD)}
          grad="linear-gradient(90deg,#10b981 0%,#34d399 100%)"
          deltaText="+18.7% vs same period last year"
          deltaType="up"
        />

        <KpiCard
          title="Escrow Balance"
          period="as of today"
          value={money(escrowBalance)}
          grad="linear-gradient(90deg,#0ea5e9 0%,#22d3ee 100%)"
          info={[
            `Outstanding A/R (part of escrow): ${money(outstandingAR)}`,
            `Not yet invoiced: ${money(notYetInvoiced)}`,
            `Covers ~${milestonesRemaining} remaining milestones across ${KPI.jobsWonCountFYTD} jobs.`,
          ]}
        />
      </section>

      {/* ===== Row 1: Backlog Breakdown + Trend ===== */}
      <section style={{ ...grid2, marginTop: 12 }}>
        {/* Backlog Breakdown (reconciles to Jobs Won) */}
        <div style={card}>
          <div style={strip("linear-gradient(90deg,#0ea5e9 0%,#22d3ee 100%)")} />
          <div style={{ fontWeight: 600, color: "#111827" }}>Backlog Breakdown</div>
          <div style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 8px" }}>
            Paid + Outstanding A/R + Not Yet Invoiced = <strong>{money(KPI.jobsWonValueFYTD)}</strong>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {backlogBreakdown.map((row) => {
              const widthPct = Math.max(6, Math.round((row.value / maxBacklog) * 100));
              return (
                <div key={row.stage} style={{ display: "grid", gridTemplateColumns: "200px 1fr 140px", alignItems: "center", gap: 10 }}>
                  <div style={{ color: "#374151", fontWeight: 600 }}>{row.stage}</div>
                  <div style={{ background: "#f3f4f6", borderRadius: 999, overflow: "hidden", height: 12 }}>
                    <div style={{ width: `${widthPct}%`, height: "100%", background: `linear-gradient(90deg, ${row.color} 0%, ${row.color}33 100%)` }} />
                  </div>
                  <div style={{ textAlign: "right", fontWeight: 700, color: "#111827" }}>{money(row.value)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Invoiced vs Paid Trend */}
        <div style={card}>
          <div style={strip("linear-gradient(90deg,#3b82f6 0%,#10b981 100%)")} />
          <div style={{ fontWeight: 600, color: "#111827", margin: "6px 0 8px" }}>Invoiced vs Paid (FYTD)</div>

          <svg width="0" height="0" aria-hidden>
            <defs>
              <linearGradient id="g-inv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="g-paid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0.05" />
              </linearGradient>
            </defs>
          </svg>

          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={fundsTrend} margin={{ left: 0, right: 8, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="m" />
              <YAxis tickFormatter={(v) => `$${Math.round(v / 1000)}k`} />
              <Tooltip formatter={(v) => money(v)} />
              <Legend wrapperStyle={{ fontSize: 12 }} iconSize={10} />
              <Area type="monotone" dataKey="invoiced" stroke="#3b82f6" fill="url(#g-inv)" strokeWidth={2} dot={{ r: 2.5 }} activeDot={{ r: 4 }} />
              <Area type="monotone" dataKey="paid"     stroke="#10b981" fill="url(#g-paid)" strokeWidth={2} dot={{ r: 2.5 }} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ===== Row 2: Milestones + A/R Aging ===== */}
      <section style={{ ...grid31, marginTop: 12, marginBottom: 0 }}>
        {/* Milestone Status — small-multiples */}
        <div style={{ ...card, minHeight: 220 }}>
          <div style={strip("linear-gradient(90deg,#2563eb 0%,#60a5fa 100%)")} />
          <div style={{ fontWeight: 600, color: "#111827", marginBottom: 8 }}>Milestone Status</div>

          <div style={{ display: "grid", gap: 12 }}>
            {milestoneStatus.map((s) => {
              const widthPct = (s.count / Math.max(1, KPI.milestonesTotal)) * 100;
              return (
                <div key={s.label} style={{ display: "grid", gridTemplateColumns: "180px 1fr 120px", alignItems: "center", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#111827", fontWeight: 600 }}>
                    <span style={{ width: 12, height: 12, borderRadius: 3, background: s.color }} />
                    {s.label}
                  </div>
                  <div style={{ background: "#eef2f7", height: 18, borderRadius: 10, overflow: "hidden", boxShadow: "inset 0 0 0 1px #e5e7eb" }}>
                    <div style={{ width: `${widthPct}%`, height: "100%", background: s.color, borderRadius: 10 }} />
                  </div>
                  <div style={{ textAlign: "right", fontWeight: 800, color: "#111827" }}>
                    {s.count} · {Math.round(widthPct)}%
                  </div>
                </div>
              );
            })}
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              <strong style={{ color: "#111827" }}>{KPI.milestonesPaid}</strong> paid of{" "}
              <strong style={{ color: "#111827" }}>{KPI.milestonesTotal}</strong> total — {pctMilestones}% complete
            </div>
          </div>
        </div>

        {/* A/R Aging (pie + legend) */}
        <div style={{ ...card, minHeight: 220 }}>
          <div style={strip("linear-gradient(90deg,#f59e0b 0%,#f97316 100%)")} />
          <div style={{ fontWeight: 600, color: "#111827", margin: "6px 0 2px" }}>A/R Aging</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>
            Outstanding A/R: <strong style={{ color: "#111827" }}>{money(outstandingAR)}</strong>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ flex: "0 0 180px" }}>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={arAging} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={48} outerRadius={64} paddingAngle={2}>
                    {arAging.map((d) => <Cell key={d.key} fill={d.color} />)}
                  </Pie>
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 18, fontWeight: 700, fill: "#111827" }}>
                    {money(outstandingAR)}
                  </text>
                  <Tooltip formatter={(val, _name, payload) => [money(val), payload?.payload?.name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: "grid", gap: 6, fontSize: 13, width: "100%" }}>
              {arAging.map((d) => (
                <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 4, background: d.color, display: "inline-block" }} />
                  <span style={{ color: "#111827" }}>{d.name}</span>
                  <span style={{ marginLeft: "auto", color: "#374151", fontWeight: 700 }}>{money(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

