// C:\TRUSTA-FRONTEND\src\pages\TradeDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

// money formatter
const money = (v) => `$${(v || 0).toLocaleString()}`;

// date formatter (YYYY-MM-DD)
const todayISO = () => new Date().toISOString().slice(0, 10);

// status chip
const Chip = ({ text, tone = "neutral" }) => {
  const tones = {
    neutral: { bg: "#eef2f7", fg: "#374151", bd: "#e5e7eb" },
    warn: { bg: "#fff7ed", fg: "#d97706", bd: "#fb923c" },
    qa: { bg: "#f0f9ff", fg: "#0284c7", bd: "#bae6fd" },
    sched: { bg: "#f5f3ff", fg: "#7c3aed", bd: "#ddd6fe" },
    pending: { bg: "#fef2f2", fg: "#b91c1c", bd: "#fecaca" },
    ok: { bg: "#ecfdf5", fg: "#047857", bd: "#a7f3d0" },
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
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
};

// card styles (match your existing feel)
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
const h6 = { fontWeight: 800, color: "#111827", marginBottom: 6 };
const headerRowBase = {
  fontSize: 12,
  color: "#6b7280",
  padding: "10px 12px",
  borderBottom: "1px solid #e5e7eb",
  background: "#fafafa",
};
const rowBase = {
  padding: "12px",
  borderBottom: "1px solid #f3f4f6",
};
const btn = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  background: "#fff",
  cursor: "pointer",
};

// ✅ KPI card (minimal + consistent with your UI)
const kpiCard = {
  background: "#fff",
  borderRadius: 12,
  padding: 12,
  border: "1px solid #eef2f7",
  minWidth: 0,
};
const kpiLabel = { fontSize: 12, color: "#6b7280", fontWeight: 700, letterSpacing: 0.2 };
const kpiValue = { fontSize: 18, fontWeight: 900, color: "#111827", marginTop: 6, lineHeight: 1.1 };
const kpiSub = {
  fontSize: 12,
  color: "#6b7280",
  marginTop: 6,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export default function TradeDetail() {
  const { id: projectId, tradeId } = useParams();

  // ✅ Trade lookup (demo mapping, swap to API later)
  const tradeName = useMemo(() => {
    const map = {
      "T-PLUMB": "Plumbing",
      "T-ELEC": "Electrical",
      "T-HVAC": "HVAC",
    };
    return map[tradeId] || tradeId || "Trade";
  }, [tradeId]);

  const contractorName = useMemo(() => {
    const map = {
      "T-PLUMB": "YDIG Relining",
      "T-ELEC": "SparkPro Electrical",
      "T-HVAC": "CoolAir Mechanical",
    };
    return map[tradeId] || "Assigned Contractor";
  }, [tradeId]);

  // ✅ Demo milestones per trade (source-of-truth for initial render)
  const initialData = useMemo(() => {
    if (tradeId === "T-ELEC") {
      return {
        milestonesPaid: [{ id: "M-E1", title: "Mobilisation", amount: 42000, paidOn: "2025-08-06" }],
        milestonesTodo: [
          { id: "M-E2", title: "Rough-in (Level 1–3)", amount: 68000, status: { text: "In QA", tone: "qa" }, due: "2025-09-03" },
          { id: "M-E3", title: "Fit-off", amount: 68000, status: { text: "Scheduled", tone: "sched" }, due: "2025-09-22" },
        ],
        variations: [
          { id: "V-E9002", title: "Extra data points", amount: 9500, reason: "Client request", status: { text: "Pending", tone: "pending" } },
          // Example approved variation (uncomment to see it included in escrow totals)
          // { id: "V-E9003", title: "Switchboard upgrade", amount: 12000, reason: "Scope agreed", status: { text: "Approved", tone: "ok" } },
        ],
      };
    }

    if (tradeId === "T-HVAC") {
      return {
        milestonesPaid: [],
        milestonesTodo: [
          { id: "M-H1", title: "Design + shop drawings", amount: 18000, status: { text: "Awaiting Approval", tone: "warn" }, due: "2025-09-10" },
          { id: "M-H2", title: "Install (duct + plant)", amount: 98000, status: { text: "Scheduled", tone: "sched" }, due: "2025-10-05" },
        ],
        variations: [],
      };
    }

    // Default: Plumbing
    return {
      milestonesPaid: [
        { id: "M-P1", title: "Deposit", amount: 84000, paidOn: "2025-08-03" },
        { id: "M-P2", title: "Rough-in", amount: 84000, paidOn: "2025-08-18" },
      ],
      milestonesTodo: [
        { id: "M-P3", title: "Fit-off", amount: 84000, status: { text: "Awaiting Approval", tone: "warn" }, due: "2025-09-05" },
        { id: "M-P4", title: "Testing", amount: 84000, status: { text: "In QA", tone: "qa" }, due: "2025-09-20" },
        { id: "M-P5", title: "Practical Completion", amount: 84000, status: { text: "Scheduled", tone: "sched" }, due: "2025-10-01" },
      ],
      variations: [
        { id: "V-9001", title: "Extra risers", amount: 18000, reason: "Scope change", status: { text: "Pending", tone: "pending" } },
        // Example approved variation (uncomment to see it included in escrow totals)
        // { id: "V-9002", title: "Additional stack work", amount: 9500, reason: "Approved", status: { text: "Approved", tone: "ok" } },
      ],
    };
  }, [tradeId]);

  // ✅ Make milestones editable (so "Release Escrow" actually changes the page)
  const [milestonesPaid, setMilestonesPaid] = useState(initialData.milestonesPaid);
  const [milestonesTodo, setMilestonesTodo] = useState(initialData.milestonesTodo);

  // When tradeId changes, reset state to that trade's demo data
  useEffect(() => {
    setMilestonesPaid(initialData.milestonesPaid);
    setMilestonesTodo(initialData.milestonesTodo);
  }, [initialData]);

  // Lightweight success message (MVP demo polish)
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const totalPaid = useMemo(
    () => milestonesPaid.reduce((t, m) => t + (Number(m.amount) || 0), 0),
    [milestonesPaid]
  );
  const totalTodo = useMemo(
    () => milestonesTodo.reduce((t, m) => t + (Number(m.amount) || 0), 0),
    [milestonesTodo]
  );

  // Demo variations remain static (MVP)
  const variations = initialData.variations || [];

  // ✅ Variation classification (MVP rules)
  // Pending = NOT in escrow totals
  // Approved/Agreed = YES in escrow totals
  const approvedVariations = useMemo(() => {
    return variations.filter((v) => {
      const s = (v?.status?.text || "").toLowerCase();
      return s === "approved" || s === "agreed";
    });
  }, [variations]);

  const pendingVariations = useMemo(() => {
    return variations.filter((v) => (v?.status?.text || "").toLowerCase() === "pending");
  }, [variations]);

  const approvedVarTotal = useMemo(
    () => approvedVariations.reduce((t, v) => t + (Number(v.amount) || 0), 0),
    [approvedVariations]
  );

  const pendingVarTotal = useMemo(
    () => pendingVariations.reduce((t, v) => t + (Number(v.amount) || 0), 0),
    [pendingVariations]
  );

  // ✅ KPI numbers (live)
  // Trade Value (Agreed) = milestones (paid+todo) + approved variations
  const tradeValueAgreed = useMemo(
    () => totalPaid + totalTodo + approvedVarTotal,
    [totalPaid, totalTodo, approvedVarTotal]
  );

  // Outstanding should also include approved variations (they're agreed but not released yet)
  const outstandingAgreed = useMemo(
    () => totalTodo + approvedVarTotal,
    [totalTodo, approvedVarTotal]
  );

  const onReleaseEscrow = (m) => {
    // MVP demo behaviour: confirm, then move milestone from Todo -> Paid
    const ok = window.confirm(`Release escrow for "${m.title}" (${money(m.amount)})?`);
    if (!ok) return;

    setMilestonesTodo((prev) => prev.filter((x) => x.id !== m.id));
    setMilestonesPaid((prev) => [{ id: m.id, title: m.title, amount: m.amount, paidOn: todayISO() }, ...prev]);
    setToast(`Escrow released: ${m.title} (${money(m.amount)})`);
  };

  return (
    <div style={{ padding: 16 }}>
      {/* MVP toast */}
      {toast && (
        <div
          style={{
            position: "sticky",
            top: 10,
            zIndex: 10,
            marginBottom: 10,
            background: "#ecfdf5",
            color: "#065f46",
            border: "1px solid #a7f3d0",
            borderRadius: 10,
            padding: "10px 12px",
            fontWeight: 700,
          }}
        >
          {toast}
        </div>
      )}

      {/* Back */}
      <div style={{ marginBottom: 10, display: "flex", gap: 12, alignItems: "center" }}>
        <Link to={`/projects/${projectId}`} style={{ textDecoration: "none", color: "#0ea5e9" }}>
          ← Back to Trades
        </Link>
        <div style={{ color: "#9ca3af" }}>|</div>
        <Link to="/projects" style={{ textDecoration: "none", color: "#0ea5e9" }}>
          Back to Jobs
        </Link>
      </div>

      {/* Title */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#111827" }}>{tradeName}</h2>
        <span style={{ color: "#6b7280" }}>
          (Trade {tradeId} • Project #{projectId})
        </span>
      </div>

      {/* ✅ KPIs (MVP) */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <div style={kpiCard}>
          <div style={kpiLabel}>Trade Value (Agreed)</div>
          <div style={kpiValue}>{money(tradeValueAgreed)}</div>
          <div style={kpiSub}>Milestones + approved variations (escrow basis)</div>
        </div>

        <div style={kpiCard}>
          <div style={kpiLabel}>Paid</div>
          <div style={kpiValue}>{money(totalPaid)}</div>
          <div style={kpiSub}>{milestonesPaid.length} paid milestone{milestonesPaid.length === 1 ? "" : "s"}</div>
        </div>

        <div style={kpiCard}>
          <div style={kpiLabel}>Outstanding (Agreed)</div>
          <div style={kpiValue}>{money(outstandingAgreed)}</div>
          <div style={kpiSub}>
            {milestonesTodo.length} remaining milestone{milestonesTodo.length === 1 ? "" : "s"}
            {approvedVariations.length ? ` • +${approvedVariations.length} approved var` : ""}
          </div>
        </div>

        <div style={kpiCard}>
          <div style={kpiLabel}>Variations</div>
          <div style={kpiValue}>{money(approvedVarTotal + pendingVarTotal)}</div>
          <div style={kpiSub}>
            {approvedVarTotal ? `Approved ${money(approvedVarTotal)}` : "Approved $0"}
            {" • "}
            {pendingVarTotal ? `Pending ${money(pendingVarTotal)}` : "Pending $0"}
          </div>
        </div>
      </section>

      {/* Trade Info */}
      <section style={{ ...card, marginBottom: 12 }}>
        <div style={strip("linear-gradient(90deg,#0ea5e9 0%,#22d3ee 100%)")} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
          <div>
            <div style={label}>Trade</div>
            <div style={h6}>{tradeName}</div>
          </div>
          <div>
            <div style={label}>Contractor</div>
            <div style={h6}>{contractorName}</div>
          </div>
          <div>
            <div style={label}>Status</div>
            <div style={{ ...h6, display: "flex", alignItems: "center", gap: 8 }}>
              <Chip text={tradeId === "T-HVAC" ? "Pending" : "Approved"} tone={tradeId === "T-HVAC" ? "pending" : "ok"} />
            </div>
          </div>
          <div>
            <div style={label}>Scope Value (demo)</div>
            <div style={h6}>{money(totalPaid + totalTodo)}</div>
          </div>
        </div>
      </section>

      {/* Variations */}
      <section style={{ ...card, marginBottom: 12 }}>
        <div style={strip("linear-gradient(90deg,#2563eb 0%,#60a5fa 100%)")} />
        <div style={h6}>Variations</div>

        <div style={{ border: "1px solid #eef2f7", borderRadius: 10, overflow: "hidden" }}>
          <div
            style={{
              ...headerRowBase,
              display: "grid",
              gridTemplateColumns: "1fr 2fr 1fr 2fr 1fr",
            }}
          >
            <div>ID</div>
            <div>Title</div>
            <div>Amount</div>
            <div>Reason</div>
            <div>Status</div>
          </div>

          {variations.length === 0 ? (
            <div style={{ padding: 12, color: "#6b7280" }}>No variations for this trade.</div>
          ) : (
            variations.map((v) => (
              <div
                key={v.id}
                style={{
                  ...rowBase,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr 1fr 2fr 1fr",
                  alignItems: "center",
                }}
              >
                <div>{v.id}</div>
                <div style={{ fontWeight: 700, color: "#111827" }}>{v.title}</div>
                <div style={{ fontWeight: 800, color: "#111827" }}>{money(v.amount)}</div>
                <div>{v.reason}</div>
                <div>
                  <Chip text={v.status.text} tone={v.status.tone} />
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Milestones */}
      <section style={{ ...card, marginBottom: 12 }}>
        <div style={strip("linear-gradient(90deg,#0ea5e9 0%,#22d3ee 100%)")} />
        <div style={h6}>Milestones</div>

        {/* Paid */}
        <div style={{ ...card, padding: 12, margin: "12px 0", boxShadow: "none", border: "1px solid #eef2f7" }}>
          <div style={{ ...h6, marginBottom: 12 }}>
            Paid ({milestonesPaid.length}) — <span style={{ color: "#111827" }}>{money(totalPaid)}</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              gap: 0,
              ...headerRowBase,
              background: "transparent",
              padding: 0,
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div style={{ padding: "0 0 10px 0" }}>Milestone</div>
            <div style={{ padding: "0 0 10px 0" }}>Amount</div>
            <div style={{ padding: "0 0 10px 0" }}>Paid On</div>
          </div>

          {milestonesPaid.length === 0 ? (
            <div style={{ paddingTop: 10, color: "#6b7280" }}>No paid milestones yet.</div>
          ) : (
            milestonesPaid.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <div style={{ fontWeight: 700, color: "#111827" }}>{m.title}</div>
                <div style={{ fontWeight: 800, color: "#111827" }}>{money(m.amount)}</div>
                <div>{m.paidOn}</div>
              </div>
            ))
          )}
        </div>

        {/* To be done */}
        <div style={{ ...card, padding: 12, margin: "12px 0 0", boxShadow: "none", border: "1px solid #eef2f7" }}>
          <div style={{ ...h6, marginBottom: 12 }}>
            To be done ({milestonesTodo.length}) — <span style={{ color: "#111827" }}>{money(totalTodo)}</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              ...headerRowBase,
              background: "transparent",
              padding: 0,
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div style={{ padding: "0 0 10px 0" }}>Milestone</div>
            <div style={{ padding: "0 0 10px 0" }}>Amount</div>
            <div style={{ padding: "0 0 10px 0" }}>Status</div>
            <div style={{ padding: "0 0 10px 0", textAlign: "right" }}>Due / Actions</div>
          </div>

          {milestonesTodo.length === 0 ? (
            <div style={{ paddingTop: 10, color: "#6b7280" }}>No upcoming milestones.</div>
          ) : (
            milestonesTodo.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <div style={{ fontWeight: 700, color: "#111827" }}>{m.title}</div>
                <div style={{ fontWeight: 800, color: "#111827" }}>{money(m.amount)}</div>
                <div>
                  <Chip text={m.status.text} tone={m.status.tone} />
                </div>
                <div style={{ textAlign: "right", display: "flex", gap: 8, justifyContent: "flex-end", alignItems: "center" }}>
                  <span style={{ color: "#6b7280", fontSize: 12 }}>{m.due}</span>
                  <button style={btn} onClick={() => onReleaseEscrow(m)}>
                    Release Escrow
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
