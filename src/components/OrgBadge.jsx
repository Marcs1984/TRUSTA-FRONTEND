// src/components/OrgBadge.jsx
import React, { useMemo, useState } from "react";

export default function OrgBadge({ org: orgProp, compact = false }) {
  const [copied, setCopied] = useState(false);

  // Derive org info (prop first, otherwise try localStorage, otherwise defaults)
  const org = useMemo(() => {
    if (orgProp) return orgProp;
    const lsName =
      (typeof window !== "undefined" && localStorage.getItem("org_name")) || "";
    const lsCode =
      (typeof window !== "undefined" && localStorage.getItem("org_code")) || "";
    return {
      name: lsName || "Your organisation",
      org_code: lsCode || "ORG-TRU-000123",
    };
  }, [orgProp]);

  const pill = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "4px 8px",
    borderRadius: 999,
    border: "1px solid #dbeafe",
    background: "#eff6ff",
    color: "#1e3a8a",
    fontSize: 12,
    lineHeight: 1,
    whiteSpace: "nowrap",
  };

  const copy = async (text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* noop */
    }
  };

  return (
    <span
      style={pill}
      title={copied ? "Copied!" : "Organisation code"}
      role="group"
      aria-label={`Organisation ${org.name} with code ${org.org_code}`}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 18,
          height: 18,
          borderRadius: 4,
          background: "#0ea5e9",
          color: "#fff",
          fontSize: 11,
          fontWeight: 800,
          flex: "0 0 18px",
        }}
        aria-hidden
      >
        O
      </span>

      {!compact && <strong>{org.name || "Your organisation"}</strong>}
      {!compact && <span style={{ color: "#6b7280" }}>•</span>}

      <code style={{ fontWeight: 700 }}>{org.org_code || "—"}</code>

      <button
        type="button"
        onClick={() => copy(org.org_code || "")}
        disabled={!org.org_code}
        aria-label="Copy organisation code"
        style={{
          marginLeft: 4,
          padding: "2px 6px",
          borderRadius: 6,
          border: "1px solid #d1d5db",
          background: copied ? "#d1fae5" : "#fff",
          cursor: org.org_code ? "pointer" : "not-allowed",
          fontSize: 11,
          color: "#374151",
        }}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </span>
  );
}
