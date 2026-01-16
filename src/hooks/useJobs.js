import { useEffect, useState } from "react";

export function useJobs(API) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const r = await fetch(`${API}/api/jobs`);
        const d = await r.json();
        if (live && Array.isArray(d)) setJobs(d);
      } catch { if (live) setJobs([]); }
      finally { if (live) setLoading(false); }
    })();
    return () => { live = false; };
  }, [API]);
  return { jobs, loading };
}
