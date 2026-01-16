import React from "react";

export default function MilestonesCard() {
  const rows = [
    { label: "Scheduled",         color: "#1d4ed8", count: 7 },
    { label: "Awaiting Approval", color: "#d97706", count: 4 },
    { label: "Paid",              color: "#16a34a", count: 5 },
    { label: "In QA",             color: "#7c3aed", count: 2 },
  ];
  const total = rows.reduce((t,r)=>t+r.count,0) || 1;

  return (
    <div style={{ position:"relative", background:"#fff", borderRadius:16, padding:16,
      boxShadow:"0 1px 2px rgba(0,0,0,.06), 0 1px 1px rgba(0,0,0,.04)" }}>
      <div style={{position:"absolute",left:0,right:0,top:0,height:4,background:"linear-gradient(90deg,#2563eb 0%,#60a5fa 100%)",
        borderTopLeftRadius:16,borderTopRightRadius:16}}/>
      <div style={{ fontWeight:600, color:"#111827", marginBottom:8 }}>Milestone Status</div>

      <div style={{ display:"grid", gap:10 }}>
        {rows.map((r)=>(
          <div key={r.label} style={{ display:"grid", gridTemplateColumns:"180px 1fr 100px", alignItems:"center", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, color:"#111827", fontWeight:600 }}>
              <span style={{ width:12, height:12, borderRadius:3, background:r.color }} />{r.label}
            </div>
            <div style={{ background:"#eef2f7", height:14, borderRadius:10, overflow:"hidden", boxShadow:"inset 0 0 0 1px #e5e7eb" }}>
              <div style={{ width:`${(r.count/total)*100}%`, height:"100%", background:r.color, borderRadius:10 }}/>
            </div>
            <div style={{ textAlign:"right", fontWeight:800, color:"#111827" }}>
              {r.count} · {Math.round((r.count/total)*100)}%
            </div>
          </div>
        ))}
        <div style={{ fontSize:12, color:"#6b7280" }}>
          <strong style={{ color:"#111827" }}>{total}</strong> milestones total
        </div>
      </div>
    </div>
  );
}
