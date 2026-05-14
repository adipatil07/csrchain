"use client";

import React, { useCallback, useEffect, useState } from "react";
import { BarChart3, TrendingUp, Users, Target, Loader2 } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────
interface KPIs { totalBeneficiaries: number; milestoneSuccess: number; costPerBeneficiary: number }
interface SectorSpend { sector: string; spend: number }
interface GeoImpact { state: string; beneficiaries: number }
interface MilestoneTrend { month: string; completed: number; delayed: number }
interface BenefTrend { month: string; people: number }

interface AnalyticsData {
  kpis: KPIs;
  sectorSpend: SectorSpend[];
  geoImpact: GeoImpact[];
  milestoneTrend: MilestoneTrend[];
  beneficiariesTrend: BenefTrend[];
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/company/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#0ea5e9]" />
      </div>
    );
  }

  const kpis = data?.kpis;
  const kpiCards = [
    { label: "Total Beneficiaries", value: (kpis?.totalBeneficiaries ?? 0).toLocaleString("en-IN"), icon: Users, trend: "Live count", grad: "from-[#1e90ff] to-[#0066cc]" },
    { label: "Milestone Success", value: `${kpis?.milestoneSuccess ?? 0}%`, icon: Target, trend: "Approved / total", grad: "from-[#0ea5e9] to-[#06b6d4]" },
    { label: "Cost per Beneficiary", value: `₹${(kpis?.costPerBeneficiary ?? 0).toLocaleString("en-IN")}`, icon: TrendingUp, trend: "Total spend / beneficiaries", grad: "from-[#10b981] to-[#059669]" },
    { label: "Active Sectors", value: String(data?.sectorSpend?.length ?? 0), icon: BarChart3, trend: "Sectors funded", grad: "from-[#8b5cf6] to-[#6d28d9]" },
  ];

  const hasData = (data?.sectorSpend?.length ?? 0) > 0;

  const empty = (
    <div className="flex items-center justify-center h-64 text-[#64748b] text-sm">
      No data yet. Approve proposals to populate analytics.
    </div>
  );

  return (
    <>
      <div className="bg-white border-b border-[#e5e7eb] px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#1a2847]">Impact Analytics</h2>
            <p className="text-[#64748b] text-sm mt-1">Deep insights into CSR spend effectiveness and beneficiary reach.</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {kpiCards.map((k) => (
            <div key={k.label} className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5e7eb]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#64748b] text-xs">{k.label}</p>
                  <p className="text-2xl font-bold text-[#1a2847] mt-1">{k.value}</p>
                  <p className="text-xs text-[#10b981] mt-1">{k.trend}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${k.grad} flex items-center justify-center`}>
                  <k.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sector spend */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
            <h3 className="text-lg font-bold text-[#1a2847] mb-4">Sector-wise Spend (₹ Lakh)</h3>
            {hasData ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data?.sectorSpend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="sector" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, color: "#1a2847" }} />
                  <Bar dataKey="spend" fill="url(#sg)" radius={[8, 8, 0, 0]} name="Spend (L)" />
                  <defs>
                    <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : empty}
          </div>

          {/* Geo impact */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
            <h3 className="text-lg font-bold text-[#1a2847] mb-4">Geographical Impact (Beneficiaries)</h3>
            {(data?.geoImpact?.length ?? 0) > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data?.geoImpact} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#64748b" />
                  <YAxis type="category" dataKey="state" stroke="#64748b" width={100} />
                  <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, color: "#1a2847" }} />
                  <Bar dataKey="beneficiaries" fill="#8b5cf6" radius={[0, 8, 8, 0]} name="Beneficiaries" />
                </BarChart>
              </ResponsiveContainer>
            ) : empty}
          </div>

          {/* Milestone trend */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
            <h3 className="text-lg font-bold text-[#1a2847] mb-4">Milestone Completion Rate</h3>
            {(data?.milestoneTrend?.length ?? 0) > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data?.milestoneTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, color: "#1a2847" }} />
                  <Legend />
                  <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} name="Completed" />
                  <Line type="monotone" dataKey="delayed" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5 }} name="Delayed" />
                </LineChart>
              </ResponsiveContainer>
            ) : empty}
          </div>

          {/* Beneficiaries trend */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
            <h3 className="text-lg font-bold text-[#1a2847] mb-4">Cumulative Beneficiaries Reached</h3>
            {(data?.beneficiariesTrend?.some((d) => d.people > 0)) ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data?.beneficiariesTrend}>
                  <defs>
                    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, color: "#1a2847" }} />
                  <Area type="monotone" dataKey="people" stroke="#0ea5e9" strokeWidth={3} fill="url(#bg)" name="Beneficiaries" />
                </AreaChart>
              </ResponsiveContainer>
            ) : empty}
          </div>
        </div>
      </div>
    </>
  );
}
