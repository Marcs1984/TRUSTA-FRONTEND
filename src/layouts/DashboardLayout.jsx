// src/layouts/DashboardLayout.jsx
import React, { useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";

export default function DashboardLayout({
  orgName = "TRUSTA",
  logoSrc = "/logo-trusta.png", // matches /public
  displayName = "Multicon Builders",
  accountNumber = "TRU-000123",
}) {
  const navigate = useNavigate();

  // layout constants
  const HEADER_H = 140;
  const PAD = 12;
  const RAIL_W = 300;

  const [showLogo, setShowLogo] = useState(true);

  const css = `
    :root{
      --navBg:#0b1e33;

      /* ✅ Give the wider logo its own lane so it can't overlap the title */
      --logo-height:110px;
      --logo-reserve:360px;    /* was 240px */
      --logo-maxw:340px;       /* cap logo width */

      /* ✅ Cleaner, modern dashboard typography */
      --ui-font: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
    }

    .h-shell{
      position:relative;
      height:${HEADER_H}px;
      background:var(--navBg);
      color:#fff;
      display:grid;
      grid-template-columns:1fr auto;
      align-items:center;
      gap:18px;
      padding:0 18px;
      padding-left:calc(18px + var(--logo-reserve));
      box-shadow:0 1px 0 rgba(0,0,0,.08);
      font-family: var(--ui-font);
    }

    .crest-abs{
      position:absolute;
      left:18px;
      top:50%;
      transform:translateY(-50%);
      height:var(--logo-height);
      width:var(--logo-reserve);         /* ✅ fixed lane */
      display:flex;
      align-items:center;
      justify-content:flex-start;
      overflow:hidden;                   /* ✅ prevents spill into title */
    }

    .crest-abs img{
      height:100%;
      width:auto;
      max-width:var(--logo-maxw);        /* ✅ hard cap */
      object-fit:contain;
      filter:drop-shadow(0 1px 0 rgba(0,0,0,.18));
      display:block;
    }

    .brand{
      display:flex;
      align-items:center;
      gap:14px;
      min-width:0;                       /* ✅ allow ellipsis */
    }

    .title{
      font-weight:800;                   /* ✅ less "ugly" than 900 */
      font-size:30px;                    /* cleaner scale */
      line-height:1.1;
      letter-spacing:-0.3px;             /* modern */
      text-shadow:0 1px 0 rgba(0,0,0,.18);
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;            /* ✅ no overlap, trims nicely */
      max-width:520px;
    }

    .chip{
      font-size:11px;
      font-weight:800;
      letter-spacing:.5px;
      text-transform:uppercase;
      padding:6px 10px;
      border-radius:999px;
      color:#cfe2ff;
      border:1px solid rgba(200,220,255,.24);
      background:rgba(230,242,255,.06);
      font-family: var(--ui-font);
    }

    .pill-org{
      display:inline-flex;
      align-items:center;
      gap:8px;
      margin-left:10px;
      padding:6px 10px;
      border-radius:999px;
      background:#0e2a4d;
      border:1px solid #223d5c;
      color:#e5efff;
      line-height:1;
      font-family: var(--ui-font);
    }

    .pill-org .copy{
      margin-left:6px;
      padding:4px 8px;
      border-radius:999px;
      border:1px solid #223d5c;
      background:#0b1e33;
      color:#e5efff;
      cursor:pointer;
      font-family: var(--ui-font);
    }

    .nav-actions{ display:flex; align-items:center; gap:10px; }
    .link{
      color:#e5efff;
      text-decoration:none;
      font-size:14px;
      padding:8px 10px;
      border-radius:8px;
      border:1px solid transparent;
      font-family: var(--ui-font);
    }
    .link:hover{ border-color:rgba(245,158,11,.9); box-shadow:0 0 0 1px rgba(245,158,11,.9), 0 0 10px rgba(245,158,11,.35); background:#0e2a4d; }
    .search-wrap{ position:relative; }
    .search{
      width:320px;
      height:38px;
      border-radius:10px;
      border:1px solid #223d5c;
      background:#0e2a4d;
      color:#e5efff;
      padding:0 12px 0 34px;
      font-family: var(--ui-font);
    }
    .search-icon{ position:absolute; left:10px; top:50%; transform:translateY(-50%); opacity:.8; }
    .accent{ height:2px; background:linear-gradient(90deg, rgba(245,158,11,.65), rgba(96,165,250,.45), rgba(245,158,11,.65)); opacity:.35; }

    @media (max-width:1280px){
      :root{ --logo-height:104px; --logo-reserve:320px; --logo-maxw:300px; }
      .search{ width:260px; }
      .title{ font-size:28px; max-width:420px; }
    }

    @media (max-width:980px){
      :root{ --logo-height:92px; --logo-reserve:260px; --logo-maxw:240px; }
      .title{ max-width:320px; }
    }
  `;

  const NAV = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/projects", label: "Projects" },
    { to: "/compliance", label: "Compliance" },
    { to: "/finance", label: "Finance" },
    { to: "/team", label: "Team" },
    { to: "/integrations", label: "Integrations" },
  ];

  const railCardStyleTight = { background:"#fff", borderRadius:14, padding:10, boxShadow:"0 1px 2px rgba(0,0,0,.06), 0 1px 1px rgba(0,0,0,.04)" };
  const railTitleStyle = { fontWeight:700, color:"#0b1e33", marginBottom:6, fontSize:14 };
  const metricStyle = { background:"#f8fafc", borderRadius:10, padding:8, textAlign:"center" };
  const metricNumStyle = { fontSize:16, fontWeight:800, color:"#0b1e33" };
  const metricLabelStyle = { fontSize:11, color:"#64748b" };
  const railBtnStyle = { width:"100%", padding:"9px 12px", borderRadius:10, border:"1px solid #e5e7eb", background:"#f8fafc", color:"#0b1e33", cursor:"pointer", textAlign:"center", textDecoration:"none", marginTop:6, fontSize:14 };

  return (
    <div style={{ position:"fixed", inset:0, display:"flex", flexDirection:"column", background:"#f6f7fb", overflow:"hidden" }}>
      <style>{css}</style>

      {/* HEADER */}
      <header className="h-shell">
        <div className="crest-abs">
          <button
            title="Main Menu"
            onClick={() => navigate("/builder-dashboard")}
            style={{ all:"unset", cursor:"pointer", display:"flex", alignItems:"center" }}
          >
            {showLogo ? (
              <img
                src={logoSrc}
                alt={`${orgName} logo`}
                onError={() => setShowLogo(false)}
              />
            ) : (
              <span style={{ fontWeight:800, letterSpacing:".3px" }}>{orgName}</span>
            )}
          </button>
        </div>

        <div className="brand">
          <div className="title" title={displayName}>{displayName}</div>
          <div className="chip">Dashboard</div>

          <div className="pill-org" title="Account number">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="#cfe2ff" strokeWidth="1.6" />
              <path d="M8.5 12h7M12 8.5v7" stroke="#cfe2ff" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span style={{ opacity:.9, fontSize:12 }}>Account Number:</span>
            <strong style={{ fontSize:12 }}>{accountNumber}</strong>
            <button className="copy" onClick={() => navigator.clipboard.writeText(accountNumber)}>Copy</button>
          </div>
        </div>

        <div className="nav-actions">
          <Link to="/" className="link">Home</Link>
          <Link to="/builder-dashboard" className="link">Main Menu</Link>

          <div className="search-wrap">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="#cfe2ff" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input className="search" placeholder="Search…" aria-label="Search" />
          </div>

          <button title="Notifications" className="link" style={{ display:"inline-flex", alignItems:"center" }}>🔔</button>
          <button title="Profile" className="link" style={{ display:"inline-flex", alignItems:"center" }}>👤</button>
        </div>
      </header>
      <div className="accent" />

      {/* BODY */}
      <div
        style={{
          height:`calc(100vh - ${HEADER_H}px - 2px)`,
          display:"grid",
          gridTemplateColumns:`1fr ${RAIL_W}px`,
          gap:12,
          padding:PAD,
          overflow:"hidden",
          boxSizing:"border-box",
        }}
      >
        <main style={{ minHeight:0, overflow:"hidden" }}>
          <Outlet />
        </main>

        <aside style={{ minHeight:0, overflow:"hidden", display:"grid", gridAutoRows:"max-content", alignContent:"start", gap:8 }}>
          <nav style={{ display:"grid", gap:6 }}>
            {NAV.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                style={({ isActive }) => ({
                  padding:"6px 8px",
                  borderRadius:8,
                  textDecoration:"none",
                  fontSize:14,
                  color: isActive ? "#0b1e33" : "#334155",
                  background: isActive ? "#e2efff" : "transparent",
                  border: "1px solid " + (isActive ? "#b6d4ff" : "transparent"),
                })}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div style={{ height:1, background:"#e5e7eb", margin:"4px 0" }} />

          {/* Jobs */}
          <section style={railCardStyleTight}>
            <div style={railTitleStyle}>Jobs</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:6 }}>
              <div style={metricStyle}><div style={metricNumStyle}>7</div><div style={metricLabelStyle}>Ongoing</div></div>
              <div style={metricStyle}><div style={metricNumStyle}>2</div><div style={metricLabelStyle}>New Today</div></div>
            </div>
            <NavLink to="/projects?new=1" style={railBtnStyle}>+ New Job</NavLink>
          </section>

          {/* Milestones */}
          <section style={railCardStyleTight}>
            <div style={railTitleStyle}>Milestones</div>
            <ul style={{ listStyle:"none", padding:0, margin:0, display:"grid", gap:4 }}>
              {[
                { id:"M-1042", title:"Stage 2 – Rough-in", status:"Awaiting Approval" },
                { id:"M-1039", title:"Concrete Pour", status:"In QA" },
                { id:"M-1034", title:"Progress Claim #3", status:"Ready to Release" },
              ].map(m => (
                <li key={m.id} style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:600, color:"#0b1e33", fontSize:14 }}>{m.title}</div>
                    <div style={{ fontSize:11, color:"#64748b" }}>{m.id}</div>
                  </div>
                  <span style={badgeStyle(m.status)}>{m.status}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Quick Actions */}
          <section style={railCardStyleTight}>
            <div style={railTitleStyle}>Quick Actions</div>
            <button style={railBtnStyle}>Raise Variation</button>
            <button style={railBtnStyle}>Invite Contractor</button>
            <button style={railBtnStyle}>Request Release</button>
          </section>
        </aside>
      </div>
    </div>
  );
}

function badgeStyle(status) {
  let bg = "#e0f2fe", color = "#0369a1", border = "#bae6fd";
  if (status.includes("QA")) { bg="#fff7ed"; color="#b45309"; border="#fed7aa"; }
  if (status.includes("Release")) { bg="#ecfdf5"; color="#065f46"; border="#bbf7d0"; }
  return { fontSize:11, fontWeight:700, padding:"4px 7px", borderRadius:999, background:bg, color, border:`1px solid ${border}`, whiteSpace:"nowrap" };
}

