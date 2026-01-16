import React, { useEffect, useState } from "react";
import TrustScoreCard from "../components/TrustScoreCard.jsx";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ClientDashboard = () => {
  const [trust, setTrust] = useState({ score: 0, tier: { label: "Basic", discount: 0 } });

  useEffect(() => {
    // Example: load trust score for demo job (replace with client’s active job(s) later)
    const jobId = "J-1001";
    fetch(`${API}/api/trust/${jobId}`)
      .then(r => r.json())
      .then(data => {
        if (data && data.trust) setTrust(data.trust);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Client Dashboard</h1>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-sm text-gray-500">Funds Secured</div>
          <div className="text-2xl font-bold text-gray-800">$2.4m</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-sm text-gray-500">Released (MTD)</div>
          <div className="text-2xl font-bold text-gray-800">$1.8m</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-sm text-gray-500">Outstanding Approvals</div>
          <div className="text-2xl font-bold text-gray-800">$420k</div>
        </div>
        {/* Trust Score KPI */}
        <TrustScoreCard
          score={trust.score}
          tier={trust.tier?.label}
          discount={trust.tier?.discount}
        />
      </div>

      {/* Welcome Message */}
      <p className="text-gray-700">
        Welcome, Client! Here you can view your projects, monitor payment status, and manage approvals.
      </p>
    </div>
  );
};

export default ClientDashboard;
