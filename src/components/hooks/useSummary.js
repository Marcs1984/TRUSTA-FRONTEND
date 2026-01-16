import { useEffect, useState } from "react";

export function useSummary(API) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        // Fixed path: add /api
        const r = await fetch(`${API}/api/jobs/summary`);
        const d = await r.json();
        if (live) setSummary(d);
      } catch {
        if (live) setSummary(null);
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => { live = false; };
  }, [API]);
  return { summary, loading };
}
