import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Default to disabling fetch (prevents 404 spam) unless explicitly turned ON
const DISABLE_FETCH =
  (import.meta.env.VITE_DISABLE_FUNDS_FETCH ?? "true") === "true";

const API_FALLBACK = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * FundsChart (compact) — equal height card with header, view switch, and area chart.
 * Props:
 *  - api
 *  - groupBy: 'month' | 'quarter' | 'year' | 'fytd'
 *  - setGroupBy(fn)
 *  - securedFYTD (number)
 *  - releasedFYTD (number)
 *  - height? number (default 280)
 */
export default function FundsChart({
  api = API_FALLBACK,
  groupBy,
  setGroupBy,
  securedFYTD = 0,
  releasedFYTD = 0,
  height = 280,
}) {
  // synthetic helpers (same seed across renders for stability)
  const mulberry32 = (seed) => {
    return function () {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  const hash = (str) => {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };
  const monthShort = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const lastNYears = (n) => {
    const y = new Date().getFullYear();
    return Array.from({ length: n }, (_, i) => `${y - (n - 1 - i)}`);
  };

  function distribute(total, n, seasonStrength = 0.25, noise = 0.35, cycle = n) {
    const seed = hash(String(securedFYTD)) ^ hash(String(releasedFYTD)) ^ (n << 5) ^ hash(String(groupBy));
    const rand = mulberry32(seed);
    let weights = [];
    for (let i = 0; i < n; i++) {
      const phase = (2 * Math.PI * i) / cycle;
      const seasonal = 1 + seasonStrength * Math.sin(phase);
      const jitter = 1 + noise * (rand() * 2 - 1);
      const w = Math.max(0.15, seasonal * jitter);
      weights.push(w);
    }
    const sum = weights.reduce((a, b) => a + b, 0);
    let vals = weights.map((w) => (total * w) / sum);
    let rounded = vals.map((v) => Math.round(v / 1000) * 1000);
    const diff = total - rounded.reduce((a, b) => a + b, 0);
    rounded[rounded.length - 1] += diff;
    return rounded;
  }

  const synth = useMemo(() => {
    return (mode) => {
      let n, labels, cycle;
      if (mode === "month") { n = 12; labels = monthShort; cycle = 12; }
      else if (mode === "quarter") { n = 8; labels = ["Q1","Q2","Q3","Q4","Q1","Q2","Q3","Q4"]; cycle = 4; }
      else { n = 5; labels = lastNYears(5); cycle = 5; }
      const securedFlow = distribute(securedFYTD, n, 0.28, 0.38, cycle);
      const releasedFlow = distribute(releasedFYTD, n, 0.22, 0.33, cycle);
      let sCum = 0, rCum = 0;
      return Array.from({ length: n }, (_, i) => {
        sCum += securedFlow[i]; rCum += releasedFlow[i];
        return {
          label: labels[i],
          secured_m: securedFlow[i],
          released_m: releasedFlow[i],
          secured: sCum,
          released: rCum,
        };
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [securedFYTD, releasedFYTD, groupBy]);

  const fytdSeries = [
    { label: "Start", secured: 0, released: 0 },
    { label: "FYTD", secured: securedFYTD, released: releasedFYTD },
  ];

  const [rows, setRows] = useState(groupBy === "fytd" ? fytdSeries : synth(groupBy));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      if (groupBy === "fytd") {
        setRows(fytdSeries); setLoading(false); return;
      }
      if (DISABLE_FETCH) {
        setRows(synth(groupBy)); setLoading(false); return;
      }
      try {
        const r = await fetch(`${api}/analytics/funds?groupBy=${groupBy}`);
        if (!r.ok) throw new Error("fetch failed");
        const data = await r.json();
        const out = Array.isArray(data?.rows) ? data.rows : synth(groupBy);
        if (!cancelled) setRows(out);
      } catch {
        if (!cancelled) setRows(synth(groupBy));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupBy, api, securedFYTD, releasedFYTD]);

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
                 background: "linear-gradient(90deg,#3b82f6 0%,#10b981 100%)",
                 borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, color: "#6b7280" }}>
          Funds Secured vs Released{" "}
          <strong>({groupBy === "fytd" ? "FYTD snapshot" : groupBy === "month" ? "Monthly (last 12)" : groupBy === "quarter" ? "Quarterly (last 8)" : "Yearly (last 5)"})</strong>
        </div>
        <div style={{ fontSize: 12, color: "#6b7280" }}>
          <strong>Secured:</strong> ${securedFYTD.toLocaleString()} &nbsp;•&nbsp;
          <strong>Released:</strong> ${releasedFYTD.toLocaleString()}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {["month","quarter","year","fytd"].map((k) => (
          <button
            key={k}
            onClick={() => setGroupBy(k)}
            style={{
              fontSize: 12,
              padding: "6px 10px",
              borderRadius: 999,
              border: "1px solid " + (groupBy === k ? "#93c5fd" : "#e5e7eb"),
              background: groupBy === k ? "#e0f2fe" : "#fff",
              color: "#0b1e33",
              cursor: "pointer",
            }}
          >
            {k === "month" ? "Monthly" : k === "quarter" ? "Quarterly" : k === "year" ? "Yearly" : "FYTD"}
          </button>
        ))}
      </div>

      <div style={{ minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rows} margin={{ left: 0, right: 8, top: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="label" />
            <YAxis tickFormatter={(v) => `$${Math.round(v / 1000)}k`} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} iconSize={10} />
            <defs>
              <linearGradient id="g-sec" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.06" />
              </linearGradient>
              <linearGradient id="g-rel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.06" />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey={groupBy === "fytd" ? "secured" : "secured_m"}
              name="secured"
              stroke="#3b82f6"
              fill="url(#g-sec)"
              strokeWidth={2}
              dot={{ r: 2.5 }}
              activeDot={{ r: 4 }}
            />
            <Area
              type="monotone"
              dataKey={groupBy === "fytd" ? "released" : "released_m"}
              name="released"
              stroke="#10b981"
              fill="url(#g-rel)"
              strokeWidth={2}
              dot={{ r: 2.5 }}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
