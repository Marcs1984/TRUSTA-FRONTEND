// src/pages/Projects/useJobs.js
import { useEffect, useMemo, useState, useCallback } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Local “DB” key for MVP (wizard can write here)
const LS_KEY = "trusta_jobs_v1";

function safeParse(json, fallback) {
  try {
    const v = JSON.parse(json);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function readLocalJobs() {
  const raw = localStorage.getItem(LS_KEY);
  const arr = safeParse(raw, []);
  return Array.isArray(arr) ? arr : [];
}

function writeLocalJobs(jobs) {
  localStorage.setItem(LS_KEY, JSON.stringify(jobs));
  // notify any listeners (Projects table, sidebar widgets later, etc.)
  window.dispatchEvent(new Event("trusta:jobs-changed"));
}

function normalizeJob(j) {
  // keep it tolerant for both API + local shapes
  return {
    id: String(j?.id ?? ""),
    title: j?.title ?? "",
    client: j?.client ?? "",
    status: j?.status ?? "Planning",
    value: Number(j?.value ?? 0),
  };
}

function mergeJobs(apiJobs, localJobs) {
  // local wins if same id (so edits show immediately)
  const map = new Map();

  (apiJobs || []).forEach((j) => {
    const n = normalizeJob(j);
    if (n.id) map.set(n.id, n);
  });

  (localJobs || []).forEach((j) => {
    const n = normalizeJob(j);
    if (n.id) map.set(n.id, n);
  });

  // return sorted newest-first by numeric portion (J-1003 > J-1002)
  const out = Array.from(map.values());
  out.sort((a, b) => {
    const an = Number(String(a.id).replace(/[^\d]/g, "")) || 0;
    const bn = Number(String(b.id).replace(/[^\d]/g, "")) || 0;
    return bn - an;
  });
  return out;
}

/**
 * Tiny hook that fetches the jobs list.
 * MVP upgrade: merges API jobs + localStorage jobs (so the wizard can add jobs today).
 */
export function useJobs() {
  const [apiJobs, setApiJobs] = useState([]);
  const [localJobs, setLocalJobs] = useState(() => readLocalJobs());
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const jobs = useMemo(() => mergeJobs(apiJobs, localJobs), [apiJobs, localJobs]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setErr("");

    // Always re-read local in case something updated it
    setLocalJobs(readLocalJobs());

    try {
      const r = await fetch(`${API}/api/jobs`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      setApiJobs(Array.isArray(data) ? data : []);
    } catch (e) {
      // If API fails, we still show local jobs (MVP friendly)
      setErr(e?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (cancelled) return;
      await refresh();
    })();

    // Listen for wizard/local updates
    const onChanged = () => setLocalJobs(readLocalJobs());
    window.addEventListener("trusta:jobs-changed", onChanged);

    return () => {
      cancelled = true;
      window.removeEventListener("trusta:jobs-changed", onChanged);
    };
  }, [refresh]);

  // Optional helpers (won’t break Projects.jsx if unused)
  const upsertJob = useCallback((job) => {
    const next = normalizeJob(job);
    if (!next.id) return;

    const existing = readLocalJobs();
    const idx = existing.findIndex((x) => String(x?.id) === next.id);

    const updated = idx >= 0
      ? [...existing.slice(0, idx), next, ...existing.slice(idx + 1)]
      : [next, ...existing];

    writeLocalJobs(updated);
  }, []);

  return { jobs, loading, err, refresh, upsertJob, LS_KEY };
}
