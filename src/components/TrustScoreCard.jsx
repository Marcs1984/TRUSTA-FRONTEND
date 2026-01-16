import React, { useEffect, useRef, useState } from "react";

const API_FALLBACK = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Trust score gauge card (compact) + click-to-toggle tooltip.
 * Header row: "Trust Score" (top-left) and Tier (top-right).
 * Tooltip shows BELOW the KPI and doesn't cover the card.
 * Hover chip is pinned inside the KPI box on the right.
 * Clicking while hovering a segment opens a detail view for that segment.
 */
export default function TrustScoreCard({ api = API_FALLBACK }) {
  const [trust, setTrust] = useState({
    score: 0,
    tier: { label: "Basic", discount: 0 },
    breakdown: {
      docs: { missing: 0, expired: 0 },
      timeliness: { overdue: 0 },
      disputes: { count: 0 },
      release: { pending: 0 },
    },
  });

  const [showTip, setShowTip] = useState(false);
  const [hoverKey, setHoverKey] = useState(null);      // 'docs' | 'timeliness' | 'disputes' | 'release' | null
  const [selectedKey, setSelectedKey] = useState(null); // which segment the popup should focus on
  const cardRef = useRef(null);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const r = await fetch(`${api}/api/trust/J-1001`);
        const d = await r.json();
        if (live && d?.trust) {
          setTrust((prev) => ({
            ...prev,
            ...d.trust,
            breakdown: { ...prev.breakdown, ...(d.trust.breakdown || {}) },
          }));
        }
      } catch {
        /* keep defaults on error */
      }
    })();
    return () => { live = false; };
  }, [api]);

  // Close tooltip on outside click or ESC
  useEffect(() => {
    function handleClick(e) {
      if (!cardRef.current) return;
      if (!cardRef.current.contains(e.target)) setShowTip(false);
    }
    function handleKey(e) {
      if (e.key === "Escape") setShowTip(false);
    }
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const SCORE = Math.max(0, Math.min(100, Number(trust.score) || 0));

  // --- Gauge geometry ---
  const cx = 62, cy = 62, R = 38, STROKE = 9;
  const toRad = (a) => (Math.PI / 180) * a;
  const polar = (a) => ({ x: cx + R * Math.cos(toRad(a)), y: cy + R * Math.sin(toRad(a)) });
  const arcPath = (startDeg, endDeg) => {
    const s = polar(startDeg), e = polar(endDeg);
    const large = endDeg - startDeg <= 180 ? 0 : 1;
    return `M ${s.x} ${s.y} A ${R} ${R} 0 ${large} 1 ${e.x} ${e.y}`;
  };
  const deg = (SCORE / 100) * 360 - 90;

  // --- Tier + discount ---
  const tierLabel =
    trust.tier?.label ||
    (SCORE >= 85 ? "Premium" : SCORE >= 70 ? "Preferred" : SCORE >= 50 ? "Plus" : "Low Trust");
  const discountPct =
    typeof trust.tier?.discount === "number"
      ? trust.tier.discount > 1 ? trust.tier.discount : Math.round(trust.tier.discount * 100)
      : (SCORE >= 85 ? 15 : SCORE >= 70 ? 10 : SCORE >= 50 ? 5 : 0);

  // Hover chip text (preview)
  const b = trust.breakdown || {};
  const hoverText =
    hoverKey === "docs"
      ? `${(b.docs?.missing || 0) + (b.docs?.expired || 0)} document issue(s): missing/expired`
      : hoverKey === "timeliness"
      ? `${b.timeliness?.overdue || 0} approval(s) overdue`
      : hoverKey === "disputes"
      ? `${b.disputes?.count || 0} dispute(s) open`
      : hoverKey === "release"
      ? `${b.release?.pending || 0} payment(s) pending release`
      : "Hover a segment to see what needs attention";

  // Popup body when a segment is selected
  function renderSelectedDetails() {
    const header = {
      docs: "Documentation issues",
      timeliness: "Timeliness issues",
      disputes: "Disputes",
      release: "Pending releases",
    }[selectedKey];

    if (!selectedKey) return null;

    return (
      <>
        <div style={{ background: "#f8fafc", padding: "10px 14px", fontWeight: 800 }}>
          {header}
        </div>
        <div style={{ padding: "12px 14px", fontSize: 13, color: "#0f172a", lineHeight: 1.5 }}>
          {selectedKey === "docs" && (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li><strong>{b.docs?.missing || 0}</strong> missing document(s)</li>
              <li><strong>{b.docs?.expired || 0}</strong> expired document(s)</li>
              <li style={{ marginTop: 8 }}>Upload/renew docs from the <em>Compliance</em> tab to recover points.</li>
            </ul>
          )}
          {selectedKey === "timeliness" && (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li><strong>{b.timeliness?.overdue || 0}</strong> approval(s) overdue</li>
              <li style={{ marginTop: 8 }}>Approve within 48h to avoid score decay.</li>
            </ul>
          )}
          {selectedKey === "disputes" && (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li><strong>{b.disputes?.count || 0}</strong> dispute(s) open</li>
              <li style={{ marginTop: 8 }}>Resolve or update dispute status to restore points.</li>
            </ul>
          )}
          {selectedKey === "release" && (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li><strong>{b.release?.pending || 0}</strong> payment(s) pending release</li>
              <li style={{ marginTop: 8 }}>Verify docs then release payments to improve trust.</li>
            </ul>
          )}
        </div>
      </>
    );
  }

  // Generic helper for when nothing is selected (original content)
  function renderGenericTips() {
    return (
      <>
        <div style={{ background: "#f8fafc", padding: "10px 14px", fontWeight: 800 }}>
          Improve your Trust Score
        </div>
        <div style={{ padding: "12px 14px" }}>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li><strong>Client-funded</strong>: review &amp; forward claims promptly.</li>
            <li><strong>Self-funded</strong>: verify docs, then approve &amp; release.</li>
          </ul>
          <div style={{ marginTop: 10, fontSize: 12, color: "#475569" }}>
            Tip: keeping docs current and acting within 48h lifts scores fastest.
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      ref={cardRef}
      className="topkpi topkpi--slate"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        paddingRight: 8,
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #e9eef7",
        boxShadow: "0 1px 2px rgba(2,6,23,.04)",
        overflow: "visible",
        position: "relative",
        minHeight: 126,
        padding: 14
      }}
    >
      {/* top accent (rounded like the card) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 4,
          background: "linear-gradient(90deg,#64748b,#94a3b8)",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          // ensure perfect rounding on all browsers while keeping parent overflow visible
          clipPath: "inset(0 round 16px 16px 0 0)",
          pointerEvents: "none"
        }}
      />

      {/* header row */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 14,
          right: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          pointerEvents: "none"
        }}
      >
        <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Trust Score</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>{tierLabel}</div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "#0f172a",
              background: "#e2e8f0",
              border: "1px solid #cbd5e1",
              padding: "3px 8px",
              borderRadius: 999
            }}
          >
            {discountPct}% discount
          </span>
        </div>
      </div>

      {/* provide extra top padding so content clears the header */}
      <div style={{ height: 24, position: "absolute", top: 0 }} />

      {/* Gauge (click to toggle tooltip; click with hover → show that segment) */}
      <div
        style={{ position: "relative", width: 124, height: 124, marginTop: 6, cursor: "pointer" }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedKey(hoverKey || null);
          setShowTip((s) => !s);
        }}
        title="Click for tips. Hover color bands for details."
      >
        <svg width="124" height="124" viewBox="0 0 124 124" role="img" aria-label={`Trust score ${SCORE}%`}>
          {/* base ring */}
          <circle cx={62} cy={62} r={R} fill="none" stroke="#e5e7eb" strokeWidth={STROKE} />

          {/* colored bands with hover states */}
          {[
            { key: "disputes",   label: "Low Trust",  min: 0,  max: 49,  color: "#ef4444" },
            { key: "timeliness", label: "Plus",       min: 50, max: 69,  color: "#f59e0b" },
            { key: "release",    label: "Preferred",  min: 70, max: 84,  color: "#38bdf8" },
            { key: "docs",       label: "Premium",    min: 85, max: 100, color: "#10b981" },
          ].map((t) => {
            const start = (t.min / 100) * 360 - 90;
            const end = (t.max / 100) * 360 - 90;
            const path = arcPath(start, end);
            const dim = hoverKey && hoverKey !== t.key ? 0.35 : 1;
            return (
              <g
                key={t.key}
                onMouseEnter={() => setHoverKey(t.key)}
                onMouseLeave={() => setHoverKey(null)}
              >
                <path
                  d={path}
                  fill="none"
                  stroke={t.color}
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  style={{ opacity: dim }}
                />
                {hoverKey === t.key && (
                  <path
                    d={path}
                    fill="none"
                    stroke={t.color}
                    strokeWidth={STROKE + 4}
                    strokeLinecap="round"
                    style={{ opacity: 0.15 }}
                  />
                )}
              </g>
            );
          })}

          {/* indicator dot */}
          <circle cx={polar(deg).x} cy={polar(deg).y} r="5" fill="#111827" stroke="#fff" strokeWidth="2" />
          <text x={62} y={60} textAnchor="middle" fontSize="18" fontWeight="800" fill="#111827">
            {Math.round(SCORE)}%
          </text>
          <text x={62} y={76} textAnchor="middle" fontSize="9" fill="#6b7280">target bands</text>
        </svg>

        {/* Tooltip BELOW (generic or segment-specific) */}
        {showTip && (
          <div
            role="dialog"
            aria-label={selectedKey ? "Trust Score details" : "Improve your Trust Score"}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              zIndex: 20,
              marginTop: 10,
              width: 300,
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              boxShadow: "0 16px 40px rgba(2,6,23,.18)",
              borderRadius: 14,
              overflow: "hidden",
              color: "#0f172a",
              lineHeight: 1.5,
              fontSize: 13
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {selectedKey ? renderSelectedDetails() : renderGenericTips()}

            {/* arrow */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: -8,
                left: 40,
                width: 16,
                height: 16,
                background: "#ffffff",
                borderLeft: "1px solid #e5e7eb",
                borderTop: "1px solid #e5e7eb",
                transform: "rotate(45deg)"
              }}
            />
          </div>
        )}
      </div>

      {/* RIGHT-SIDE hover chip pinned inside the card (preview) */}
      <div
        style={{
          position: "absolute",
          top: 56,           // vertically aligned with gauge center area
          left: 154,         // 14 (card padding) + 124 (gauge) + 16 (gap)
          right: 14,         // keep inside the card
          fontSize: 12,
          lineHeight: 1.4,
          color: hoverKey ? "#0f172a" : "#64748b",
          fontWeight: hoverKey ? 700 : 500,
          pointerEvents: "none",
          whiteSpace: "normal",
          wordBreak: "break-word"
        }}
      >
        {hoverKey ? hoverText : "Hover a segment to see what needs attention"}
      </div>
    </div>
  );
}
