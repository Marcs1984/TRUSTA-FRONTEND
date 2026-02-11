// C:\TRUSTA-FRONTEND\src\pages\ProjectDetail.jsx
import React from "react";
import { Link, useParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// money formatter
const money = (v) => `$${(v || 0).toLocaleString()}`;

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
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 700,
};
const btnPrimary = {
  ...btn,
  background: "#0ea5e9",
  border: "1px solid #0ea5e9",
  color: "#fff",
};

// ---- DEMO DATA (J-1001 only) ----
// This MUST NOT leak into real jobs.
const DEMO_TRADES = [
  {
    id: "T-PLUMB",
    name: "Plumbing",
    contractorName: "YDIG Relining",
    status: "Approved",
  },
  {
    id: "T-ELEC",
    name: "Electrical",
    contractorName: "SparkPro Electrical",
    status: "Approved",
  },
  {
    id: "T-HVAC",
    name: "HVAC",
    contractorName: "CoolAir Mechanical",
    status: "Pending",
  },
];

// Example trade list (for real jobs onboarding)
const TRADE_TEMPLATES = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "Carpentry",
  "Roofing",
  "Waterproofing",
  "Painting",
  "Landscaping",
  "Other",
];

// Example companies per trade (demo only / onboarding)
const EXAMPLE_COMPANIES_BY_TRADE = {
  Plumbing: ["YDIG Relining", "Rapid Plumbing Co", "DrainPro Services"],
  Electrical: ["SparkPro Electrical", "VoltWorks Electrical", "BrightWire Group"],
  HVAC: ["CoolAir Mechanical", "ArcticFlow HVAC", "ClimatePro Services"],
  Carpentry: ["TimberLine Carpentry", "FrameRight Carpentry", "Urban Joinery"],
  Roofing: ["PeakRoof Solutions", "Apex Roofing Group", "Skyline Roof & Gutter"],
  Waterproofing: ["SealSafe Waterproofing", "DryShield Systems", "AquaGuard Coatings"],
  Painting: ["FreshCoat Painters", "ProFinish Painting", "ColourCraft Group"],
  Landscaping: ["GreenScape Landscaping", "YardMasters", "Stone & Turf Co"],
};

// localStorage key for remembered custom trades
const LS_CUSTOM_TRADES_KEY = "trusta_custom_trades_v1";

// localStorage key for remembered companies per trade
const LS_COMPANIES_BY_TRADE_KEY = "trusta_companies_by_trade_v1";

// --- Safe, simple normalisation / de-dup rules (client-side only) ---
function collapseSpaces(s) {
  return String(s || "")
    .replace(/\s+/g, " ")
    .trim();
}
function toTitleCase(s) {
  const str = collapseSpaces(s);
  if (!str) return "";
  return str
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ");
}
function normKey(s) {
  return collapseSpaces(s).toLowerCase();
}
function uniqueByNorm(list) {
  const seen = new Set();
  const out = [];
  for (const item of list) {
    const key = normKey(item);
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function loadCustomTrades() {
  try {
    const raw = localStorage.getItem(LS_CUSTOM_TRADES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function saveCustomTrades(list) {
  try {
    localStorage.setItem(LS_CUSTOM_TRADES_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

function loadCompaniesByTrade() {
  try {
    const raw = localStorage.getItem(LS_COMPANIES_BY_TRADE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveCompaniesByTrade(obj) {
  try {
    localStorage.setItem(LS_COMPANIES_BY_TRADE_KEY, JSON.stringify(obj));
  } catch {
    // ignore
  }
}

function getRememberedCompaniesForTrade(tradeName) {
  const key = normKey(tradeName);
  const map = loadCompaniesByTrade();
  const list = Array.isArray(map?.[key]) ? map[key] : [];
  const normalised = list.map((x) => toTitleCase(x)).filter(Boolean);
  return uniqueByNorm(normalised);
}

function rememberCompanyForTrade(tradeName, companyName) {
  const tKey = normKey(tradeName);
  const company = toTitleCase(companyName);
  if (!tKey || !company) return;

  const map = loadCompaniesByTrade();
  const existing = Array.isArray(map[tKey]) ? map[tKey] : [];
  const next = uniqueByNorm([company, ...existing]).slice(0, 50); // keep recent-first
  map[tKey] = next;
  saveCompaniesByTrade(map);
}

export default function ProjectDetail() {
  const { id } = useParams();
  const isDemo = id === "J-1001";

  // ===== Load job from API =====
  const [project, setProject] = React.useState(null);
  const [trades, setTrades] = React.useState([]);
  const [error, setError] = React.useState("");
  const [tradesError, setTradesError] = React.useState("");

  // Local (client-side) draft trades for real jobs (so Add Trade can show how it works)
  const [draftTrades, setDraftTrades] = React.useState([]);
  const [showAddTrade, setShowAddTrade] = React.useState(false);

  // Add Trade modal state (simple 2-step)
  const [addStep, setAddStep] = React.useState("trade"); // "trade" | "company" | "custom"
  const [selectedTrade, setSelectedTrade] = React.useState("");
  const [customTradeName, setCustomTradeName] = React.useState("");
  const [customTrades, setCustomTrades] = React.useState([]);

  // Invite modal (custom trade invite / new company invite)
  const [showInvite, setShowInvite] = React.useState(false);
  const [inviteTradeName, setInviteTradeName] = React.useState("");
  const [inviteCompanyName, setInviteCompanyName] = React.useState("");
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteAbn, setInviteAbn] = React.useState("");

  // Load remembered custom trades once (and clean them up)
  React.useEffect(() => {
    if (isDemo) return;

    const raw = loadCustomTrades();
    const normalised = raw.map((t) => toTitleCase(t)).filter(Boolean);
    const deduped = uniqueByNorm(normalised);

    setCustomTrades(deduped);

    // If we cleaned anything up, persist the cleaned list
    if (JSON.stringify(raw) !== JSON.stringify(deduped)) {
      saveCustomTrades(deduped);
    }
  }, [isDemo]);

  React.useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setError("");
        setProject(null);

        // ✅ use the same API prefix as useJobs(): `${API_BASE}/api/jobs`
        const res = await fetch(`${API_BASE}/api/jobs/${encodeURIComponent(id)}`);

        if (!res.ok) throw new Error(`Could not load job "${id}" (HTTP ${res.status}).`);

        const data = await res.json();
        if (alive) setProject(data);
      } catch (e) {
        if (alive) setError(e?.message || "Failed to load job.");
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  // Reset local drafts when switching jobs (real jobs only)
  React.useEffect(() => {
    if (!isDemo) {
      setDraftTrades([]);
      setAddStep("trade");
      setSelectedTrade("");
      setCustomTradeName("");

      // reset invite modal
      setShowInvite(false);
      setInviteTradeName("");
      setInviteCompanyName("");
      setInviteEmail("");
      setInviteAbn("");
    }
  }, [id, isDemo]);

  // ===== Load trades for this job (REAL jobs only) =====
  // Demo job must ALWAYS show demo trades regardless of API.
  React.useEffect(() => {
    let alive = true;

    // DEMO MODE: force demo trades and clear any trades errors.
    if (isDemo) {
      setTradesError("");
      setTrades(DEMO_TRADES);
      return () => {
        alive = false;
      };
    }

    (async () => {
      try {
        setTradesError("");
        setTrades([]);

        // If your backend doesn’t have this route yet, it will 404 and we’ll just show “No trades yet”.
        const res = await fetch(`${API_BASE}/api/jobs/${encodeURIComponent(id)}/trades`);

        if (!res.ok) {
          throw new Error(`Trades not available (HTTP ${res.status}).`);
        }

        const data = await res.json();
        if (!alive) return;

        const list = Array.isArray(data) ? data : Array.isArray(data?.trades) ? data.trades : [];
        setTrades(list);
      } catch (e) {
        if (!alive) return;
        setTradesError(e?.message || "Trades not available yet.");
        setTrades([]);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id, isDemo]);

  if (error) return <div style={{ padding: 16, color: "#b91c1c" }}>{error}</div>;
  if (!project) return <div style={{ padding: 16 }}>Loading job…</div>;

  // Normalise common field names
  const title = project.title ?? project.name ?? project.jobTitle ?? "Untitled Job";
  const client = project.client ?? project.clientName ?? project.customer ?? "—";
  const status = project.status ?? project.state ?? "—";
  const value = project.value ?? project.amount ?? project.total ?? 0;

  // Trades resolution rules:
  const backendTrades =
    !isDemo && Array.isArray(project.trades) && project.trades.length ? project.trades : null;

  const apiTrades = isDemo ? DEMO_TRADES : backendTrades ?? trades;

  // For real jobs, show draft trades as immediate onboarding examples
  const resolvedTrades = isDemo ? DEMO_TRADES : [...apiTrades, ...draftTrades];
  const hasTrades = Array.isArray(resolvedTrades) && resolvedTrades.length > 0;

  const onInvite = () => {
    // Placeholder until we wire the real invite flow (Team/Invites modal)
    alert(`Invite contractors to Job ${id} (coming next).`);
  };

  const openAddTrade = () => {
    setShowAddTrade(true);
    setAddStep("trade");
    setSelectedTrade("");
    setCustomTradeName("");
  };

  const closeAddTrade = () => {
    setShowAddTrade(false);
    setAddStep("trade");
    setSelectedTrade("");
    setCustomTradeName("");
  };

  const goChooseTrade = () => {
    setAddStep("trade");
    setSelectedTrade("");
    setCustomTradeName("");
  };

  const goChooseCompany = (tradeName) => {
    setSelectedTrade(tradeName);
    setAddStep("company");
  };

  const goCustomTrade = () => {
    setAddStep("custom");
    setCustomTradeName("");
  };

  // Selecting a known company should auto-send invite (no ABN/email)
  const addTradeAndAutoInvite = (tradeName, contractorName) => {
    if (isDemo) return;

    const nowIso = new Date().toISOString();
    const now = Date.now();

    // Remember this company for this trade (so it shows as "previously used" next time)
    rememberCompanyForTrade(tradeName, contractorName);

    setDraftTrades((prev) => [
      ...prev,
      {
        id: `TMP-${now}`,
        name: tradeName,
        contractorName: contractorName,
        status: "Invite sent (pending acceptance)",
        invite: {
          method: "known_company",
          value: contractorName,
          sentAt: nowIso,
        },
      },
    ]);

    closeAddTrade();
  };

  const openCustomInvite = () => {
    if (isDemo) return;

    const raw = String(customTradeName || "");
    const pretty = toTitleCase(raw);
    if (!pretty) return;

    const exists =
      customTrades.some((t) => normKey(t) === normKey(pretty)) ||
      TRADE_TEMPLATES.some((t) => normKey(t) === normKey(pretty));

    if (!exists) {
      const next = uniqueByNorm([...customTrades, pretty]).slice(0, 50);
      setCustomTrades(next);
      saveCustomTrades(next);
    }

    // Open invite modal FIRST; only create the trade row after "Send invite"
    setInviteTradeName(String(pretty));
    setInviteCompanyName("");
    setInviteEmail("");
    setInviteAbn("");
    setShowInvite(true);

    closeAddTrade();
  };

  // Invite new company for a standard trade (treated as a new invite)
  const openNewCompanyInviteForTrade = (tradeName) => {
    if (isDemo) return;

    setInviteTradeName(String(tradeName));
    setInviteCompanyName("");
    setInviteEmail("");
    setInviteAbn("");
    setShowInvite(true);

    closeAddTrade();
  };

  const companiesForSelectedTrade = () => {
    const t = selectedTrade;
    if (!t) return [];

    // Start with remembered companies (previously used), then fallback examples
    const remembered = getRememberedCompaniesForTrade(t);
    const base = EXAMPLE_COMPANIES_BY_TRADE[t] ? EXAMPLE_COMPANIES_BY_TRADE[t] : ["Example Contractor Pty Ltd", "Example Trade Co", "Example Services Group"];
    return uniqueByNorm([...remembered, ...base].map((x) => toTitleCase(x)).filter(Boolean));
  };

  // Build trade buttons list:
  // - show custom trades first (remembered)
  // - then templates (excluding "Other" which is special)
  const tradeButtons = [...customTrades, ...TRADE_TEMPLATES.filter((t) => t !== "Other")];

  // ---- Invite modal handlers (custom trade invite / new company invite) ----
  const closeInvite = () => {
    setShowInvite(false);
    setInviteTradeName("");
    setInviteCompanyName("");
    setInviteEmail("");
    setInviteAbn("");
  };

  const canSendCustomInvite = () => {
    const company = collapseSpaces(inviteCompanyName);
    const email = collapseSpaces(inviteEmail);
    const abn = collapseSpaces(inviteAbn);
    return Boolean(company) && (Boolean(email) || Boolean(abn));
  };

  const sendInvite = () => {
    if (isDemo) return;
    if (!canSendCustomInvite()) return;

    const company = collapseSpaces(inviteCompanyName);
    const email = collapseSpaces(inviteEmail);
    const abn = collapseSpaces(inviteAbn);
    const nowIso = new Date().toISOString();
    const now = Date.now();

    // Remember company for this trade (so it appears in that trade's company list next time)
    rememberCompanyForTrade(inviteTradeName, company);

    // Create the trade row ONLY after invite is sent
    setDraftTrades((prev) => [
      ...prev,
      {
        id: `TMP-${now}`,
        name: inviteTradeName,
        contractorName: company,
        status: "Invite sent (pending acceptance)",
        invite: {
          method: "invite_new_company",
          companyName: company,
          email: email || null,
          abn: abn || null,
          sentAt: nowIso,
        },
      },
    ]);

    closeInvite();
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
          {title}
        </h2>
        <span style={{ color: "#6b7280" }}>(Job #{id})</span>
      </div>

      {/* Job Info */}
      <section style={{ ...card, marginBottom: 12 }}>
        <div style={strip("linear-gradient(90deg,#2563eb 0%,#60a5fa 100%)")} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
          <div>
            <div style={label}>Title</div>
            <div style={h6}>{title}</div>
          </div>
          <div>
            <div style={label}>Client</div>
            <div style={h6}>{client}</div>
          </div>
          <div>
            <div style={label}>Status</div>
            <div style={h6}>{status}</div>
          </div>
          <div>
            <div style={label}>Value</div>
            <div style={h6}>{money(value)}</div>
          </div>
        </div>
      </section>

      {/* Trades */}
      <section style={{ ...card, marginBottom: 12 }}>
        <div style={strip("linear-gradient(90deg,#0ea5e9 0%,#22d3ee 100%)")} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={h6}>{isDemo ? "Trades (for this project)" : "Trades"}</div>

          {!isDemo ? (
            <div style={{ display: "flex", gap: 10 }}>
              <button style={btnPrimary} onClick={onInvite}>
                Invite Contractor
              </button>
              <button style={btn} onClick={openAddTrade}>
                + Add Trade
              </button>
            </div>
          ) : (
            <div style={{ color: "#6b7280", fontSize: 13, fontWeight: 600 }}>Demo walkthrough</div>
          )}
        </div>

        {!hasTrades ? (
          <div style={{ marginTop: 10, color: "#6b7280", fontSize: 13 }}>
            No trades have been added to this job yet.
            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button style={btnPrimary} onClick={onInvite}>
                Invite Contractor
              </button>
              <button style={btn} onClick={openAddTrade}>
                + Add Trade
              </button>
            </div>

            {tradesError ? (
              <div style={{ marginTop: 10, fontSize: 12, color: "#94a3b8" }}>{tradesError}</div>
            ) : null}
          </div>
        ) : (
          <div style={{ border: "1px solid #eef2f7", borderRadius: 10, overflow: "hidden", marginTop: 10 }}>
            <div
              style={{
                ...headerRow,
                padding: "10px 12px",
                background: "#fafafa",
                gridTemplateColumns: "1.2fr 1.4fr 1fr 120px",
              }}
            >
              <div>Trade</div>
              <div>Contractor</div>
              <div>Status</div>
              <div style={{ textAlign: "right" }}>Action</div>
            </div>

            {resolvedTrades.map((t) => {
              const tradeId = t.id ?? t.tradeId ?? t.code ?? "TRADE";
              const name = t.name ?? t.tradeName ?? "Trade";
              const contractor = t.contractor ?? t.contractorName ?? "—";
              const statusText = t.status?.text ?? t.status ?? "—";
              const tone =
                String(statusText).toLowerCase().includes("approve")
                  ? "ok"
                  : String(statusText).toLowerCase().includes("invite sent")
                    ? "qa"
                    : String(statusText).toLowerCase().includes("invite")
                      ? "qa"
                      : String(statusText).toLowerCase().includes("pend")
                        ? "pending"
                        : "neutral";

              const isLocalDraft = String(tradeId).startsWith("TMP-");

              return (
                <div
                  key={tradeId}
                  style={{
                    ...row,
                    padding: "12px",
                    gridTemplateColumns: "1.2fr 1.4fr 1fr 120px",
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#111827" }}>{name}</div>
                  <div>{contractor}</div>
                  <div>
                    <Chip text={statusText} tone={tone} />
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {isLocalDraft ? (
                      <span style={{ color: "#94a3b8", fontWeight: 700 }}>Setup →</span>
                    ) : (
                      <Link
                        to={`/projects/${id}/trades/${tradeId}`}
                        style={{ color: "#0ea5e9", textDecoration: "none", fontWeight: 700 }}
                      >
                        View →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Milestones */}
      <section style={{ ...card, marginBottom: 12 }}>
        <div style={strip("linear-gradient(90deg,#2563eb 0%,#60a5fa 100%)")} />
        <div style={h6}>Milestones</div>

        {!hasTrades ? (
          <div style={{ color: "#6b7280", fontSize: 13 }}>
            Milestones are created per-trade. Add/Invite a trade first to see milestone costings.
          </div>
        ) : (
          <div style={{ color: "#6b7280", fontSize: 13 }}>
            Select a trade above to view milestones for that trade.
          </div>
        )}

        <div style={{ marginTop: 10 }}>
          <button style={{ ...btn, opacity: 0.6, cursor: "not-allowed" }} disabled>
            Release Escrow (available per-trade)
          </button>
        </div>
      </section>

      {/* Add Trade Modal (real jobs only) */}
      {!isDemo && showAddTrade ? (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(17, 24, 39, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 16,
          }}
          onClick={closeAddTrade}
        >
          <div
            style={{
              width: "min(620px, 100%)",
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 10px 30px rgba(0,0,0,.18)",
              padding: 16,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>
                {addStep === "trade" ? "Add a trade" : addStep === "company" ? "Choose a company" : "Custom trade"}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                {addStep !== "trade" ? <button style={btn} onClick={goChooseTrade}>Back</button> : null}
                <button style={btn} onClick={closeAddTrade}>Close</button>
              </div>
            </div>

            {/* Step: Choose Trade */}
            {addStep === "trade" ? (
              <>
                <div style={{ marginTop: 10, color: "#6b7280", fontSize: 13 }}>
                  Choose a trade. If you pick a company you’ve used before, we auto-send the invite.
                  For a custom trade, you’ll enter company name + email/ABN, then send invite.
                </div>

                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {tradeButtons.map((t) => (
                    <button key={`trade-${t}`} style={btn} onClick={() => goChooseCompany(t)}>
                      {t}
                    </button>
                  ))}

                  <button style={btn} onClick={goCustomTrade}>
                    Other (custom)
                  </button>
                </div>

                {customTrades.length ? (
                  <div style={{ marginTop: 10, color: "#94a3b8", fontSize: 12 }}>
                    Custom trades are remembered on this device.
                  </div>
                ) : null}
              </>
            ) : null}

            {/* Step: Custom Trade */}
            {addStep === "custom" ? (
              <>
                <div style={{ marginTop: 10, color: "#6b7280", fontSize: 13 }}>
                  Enter the new trade name. Next you’ll enter company name + email/ABN, then send the invite.
                </div>

                <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                  <input
                    value={customTradeName}
                    onChange={(e) => setCustomTradeName(e.target.value)}
                    placeholder="e.g. Glazing"
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid #e5e7eb",
                      outline: "none",
                      fontSize: 14,
                    }}
                  />
                  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button style={btn} onClick={goChooseTrade}>Cancel</button>
                    <button style={btnPrimary} onClick={openCustomInvite} disabled={!collapseSpaces(customTradeName)}>
                      Continue to invite
                    </button>
                  </div>
                </div>
              </>
            ) : null}

            {/* Step: Choose Company */}
            {addStep === "company" ? (
              <>
                <div style={{ marginTop: 10, color: "#6b7280", fontSize: 13 }}>
                  Trade: <span style={{ fontWeight: 800, color: "#111827" }}>{selectedTrade}</span>
                </div>

                <div style={{ marginTop: 10, color: "#94a3b8", fontSize: 12 }}>
                  Selecting a company auto-sends the invite (secure flow comes later). Or invite a new company.
                </div>

                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {companiesForSelectedTrade().map((c) => (
                    <button key={`co-${c}`} style={btn} onClick={() => addTradeAndAutoInvite(selectedTrade, c)}>
                      {c}
                    </button>
                  ))}

                  <button style={btnPrimary} onClick={() => openNewCompanyInviteForTrade(selectedTrade)}>
                    + Invite new company
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Invite Modal (company name + email/ABN for custom trades / new company) */}
      {!isDemo && showInvite ? (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(17, 24, 39, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            padding: 16,
          }}
          onClick={closeInvite}
        >
          <div
            style={{
              width: "min(520px, 100%)",
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 10px 30px rgba(0,0,0,.18)",
              padding: 16,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>Send invite</div>
              <button style={btn} onClick={closeInvite}>Close</button>
            </div>

            <div style={{ marginTop: 10, color: "#6b7280", fontSize: 13 }}>
              Trade: <span style={{ fontWeight: 800, color: "#111827" }}>{inviteTradeName}</span>
            </div>

            <div style={{ marginTop: 10, color: "#94a3b8", fontSize: 12 }}>
              Enter company name + (email or ABN). Once sent, the trade will show “Invite sent (pending acceptance)”.
            </div>

            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              <input
                value={inviteCompanyName}
                onChange={(e) => setInviteCompanyName(e.target.value)}
                placeholder="Company name (required)"
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #e5e7eb",
                  outline: "none",
                  fontSize: 14,
                }}
              />

              <input
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Email (optional — enter email OR ABN)"
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #e5e7eb",
                  outline: "none",
                  fontSize: 14,
                }}
              />

              <input
                value={inviteAbn}
                onChange={(e) => setInviteAbn(e.target.value)}
                placeholder="ABN (optional — enter email OR ABN)"
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #e5e7eb",
                  outline: "none",
                  fontSize: 14,
                }}
              />

              {!canSendCustomInvite() ? (
                <div style={{ fontSize: 12, color: "#b91c1c" }}>
                  Company name is required, and you must enter at least one of Email or ABN.
                </div>
              ) : null}

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button style={btn} onClick={closeInvite}>Cancel</button>
                <button style={btnPrimary} onClick={sendInvite} disabled={!canSendCustomInvite()}>
                  Send invite
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
