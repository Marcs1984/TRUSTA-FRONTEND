// src/pages/BuilderDashboard.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import KpiCard from "../components/KpiCard";
import TrustScoreCard from "../components/TrustScoreCard";
import FundsChart from "../components/FundsChart";
import PipelineCard from "../components/PipelineCard";
import MilestonesCard from "../components/MilestonesCard";
import VariationsCard from "../components/VariationsCard";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function BuilderDashboard() {
  /* =======================
     Fetch: Summary + Jobs
     ======================= */
  const [summary, setSummary] = useState(null);
  const [loadingAll, setLoadingAll] = useState(true);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const r = await fetch(`${API}/jobs/summary`);
        const d = await r.json();
        if (live) setSummary(d);
      } catch {
        if (live) setSummary(null);
      } finally {
        if (live) setLoadingAll(false);
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const r = await fetch(`${API}/api/jobs`);
        const d = await r.json();
        if (live && Array.isArray(d)) setJobs(d);
      } catch {
        if (live) setJobs([]);
      } finally {
        if (live) setLoadingJobs(false);
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  /* =======================
     Numbers (memoized)
     ======================= */
  const {
    releasedFYTD,
    securedInvoicedFYTD,
    securedTotalFYTD,
    escrowBalance,
    jobsWonCount,
    jobsWonTotal,
  } = useMemo(() => {
    const released = Number(summary?.releasedFunds || 0);
    const securedInv = Number(summary?.securedFunds || 0);
    const escrow = Number(summary?.fundsInEscrow || 0);
    const totalWon = jobs.reduce((t, j) => t + (Number(j.value) || 0), 0);

    return {
      releasedFYTD: released,
      securedInvoicedFYTD: securedInv,
      securedTotalFYTD: released + securedInv,
      escrowBalance: escrow,
      jobsWonCount: jobs.length,
      jobsWonTotal: totalWon,
    };
  }, [summary, jobs]);

  /* =======================
     UI State
     ======================= */
  const [groupBy, setGroupBy] = useState("month");

  const pipelineRows = useMemo(
    () => [
      { label: "Secured (FYTD)", value: securedTotalFYTD, color: "#60a5fa" },
      { label: "Upcoming Releases", value: securedInvoicedFYTD, color: "#0ea5e9" },
      { label: "Released (FYTD)", value: releasedFYTD, color: "#10b981" },
    ],
    [securedTotalFYTD, securedInvoicedFYTD, releasedFYTD]
  );

  /* =======================
     Fill viewport (no gap)
     ======================= */
  const ref = useRef(null);
  const [vh, setVh] = useState("calc(100vh - 64px)");

  useEffect(() => {
    const measure = () => {
      if (!ref.current) return;
      const top = ref.current.getBoundingClientRect().top;
      setVh(`${Math.max(340, Math.floor(window.innerHeight - top - 8))}px`);
    };
    measure();
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  /* =======================
     Shared heights (rows align)
     ======================= */
  const ROW2_H = 260; // funds + pipeline
  const ROW3_H = 220; // milestones + variations

  return (
    <div
      ref={ref}
      style={{
        padding: "12px 16px",
        overflow: "hidden",
        minWidth: 0,
        height: vh,
        display: "grid",
        gridTemplateRows: "auto auto 1fr",
        gap: 10,
      }}
    >
      {/* Row 1 — KPIs + Trust */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gap: 10,
          alignItems: "stretch",
        }}
      >
        <KpiCard
          title="Jobs Won"
          value={jobsWonTotal}
          subtitle={!loadingJobs ? plural(jobsWonCount, "job") : ""}
          badge="FYTD"
          tone="indigo"
          loading={loadingJobs}
          format="money"
          density="ultra"
          size="hero"
        />
        <KpiCard
          title="Invoiced"
          value={securedTotalFYTD}
          subtitle="FYTD"
          badge="FYTD"
          tone="amber"
          loading={loadingAll}
          format="money"
          density="ultra"
          size="hero"
        />
        <KpiCard
          title="Paid"
          value={releasedFYTD}
          subtitle="FYTD"
          badge="FYTD"
          tone="emerald"
          loading={loadingAll}
          format="money"
          density="ultra"
          size="hero"
        />
        <KpiCard
          title="Escrow Balance"
          value={escrowBalance}
          subtitle="as of today"
          badge="as of today"
          tone="sky"
          loading={loadingAll}
          format="money"
          density="ultra"
          size="hero"
        />
        <TrustScoreCard />
      </section>

      {/* Row 2 — Funds vs Released + Pipeline (same height) */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 10,
          alignItems: "stretch",
          minHeight: 0,
        }}
      >
        <div style={{ minHeight: ROW2_H }}>
          <FundsChart
            api={API}
            groupBy={groupBy}
            setGroupBy={setGroupBy}
            securedFYTD={securedInvoicedFYTD}
            releasedFYTD={releasedFYTD}
            height={ROW2_H}
          />
        </div>
        <PipelineCard rows={pipelineRows} height={ROW2_H} />
      </section>

      {/* Row 3 — Milestones + Variations (same height) */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 2fr",
          gap: 10,
          alignItems: "stretch",
        }}
      >
        <MilestonesCard height={ROW3_H} />
        <VariationsCard height={ROW3_H} />
      </section>
    </div>
  );
}

/* -------- helpers -------- */
function plural(n, w) {
  return `${n} ${w}${n === 1 ? "" : "s"}`;
}
