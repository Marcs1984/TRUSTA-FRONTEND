// src/theme/palette.js
// A cohesive, distinct palette (accessible, non-tacky).

// Neutrals
export const neutral = {
  ink: "#0b1e33",
  text: "#111827",
  subtext: "#6b7280",
  border: "#e9eef7",
  surface: "#ffffff",
};

// KPI tones (accent line + soft wash)
export const tones = {
  indigo:  { line: "#4f46e5", wash: "#eef2ff" },
  sky:     { line: "#0ea5e9", wash: "#f0f9ff" },
  emerald: { line: "#10b981", wash: "#ecfdf5" },
  amber:   { line: "#f59e0b", wash: "#fffbeb" },
  rose:    { line: "#f43f5e", wash: "#fff1f2" },
  violet:  { line: "#7c3aed", wash: "#f5f3ff" },
  cyan:    { line: "#06b6d4", wash: "#ecfeff" },
  slate:   { line: "#64748b", wash: "#f1f5f9" },
};

// Charts
export const charts = {
  secured:  { stroke: "#2563eb" },
  released: { stroke: "#10b981" },
};

// Pipeline bars
export const pipeline = {
  secured:  "#60a5fa",
  upcoming: "#0ea5e9",
  released: "#10b981",
};

// Milestones
export const milestones = {
  scheduled: "#2563eb",
  awaiting:  "#f59e0b",
  paid:      "#16a34a",
  qa:        "#7c3aed",
};

// Variations & disputes
export const variations = {
  pending:       "#2563eb",
  clarification:  "#f59e0b",
  watchlist:      "#f43f5e",
};
