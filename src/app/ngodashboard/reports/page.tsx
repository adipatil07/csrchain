"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  TrendingUp, Users, Target, DollarSign, CheckCircle2, Award,
  FileText, FileSpreadsheet, FileDown, Download, Loader2, BarChart3,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────
interface KPI {
  totalFundsFormatted: string; totalDisbursedFormatted: string;
  totalBeneficiaries: number; milestoneSuccessRate: number;
  activeProjects: number; completedProjects: number;
  volunteerCount: number; volunteerHours: number; totalProjects: number;
}
interface SectorItem { name: string; funds: number; projects: number; color: string }
interface FlowPoint { month: string; received: number; released: number }
interface MilestoneStatus { name: string; value: number; color: string }
interface ProjectProgress {
  id: string; name: string; sector: string; progress: number;
  budget: number; disbursed: number; beneficiaries: number; status: string;
}
interface BenefTrend { month: string; beneficiaries: number }
interface Report { name: string; type: string; size: string; generated: boolean }

interface ReportData {
  kpi: KPI; sectorData: SectorItem[]; monthlyFlow: FlowPoint[];
  milestoneStatus: MilestoneStatus[]; projectProgress: ProjectProgress[];
  benefTrend: BenefTrend[]; reports: Report[]; ngoName: string; generatedAt: string;
}

const fmt = (n: number) =>
  n >= 10000000 ? `₹${(n / 10000000).toFixed(2)} Cr` :
  n >= 100000 ? `₹${(n / 100000).toFixed(2)} L` : `₹${n.toLocaleString("en-IN")}`;

// ─── Component ──────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "reports">("overview");

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/ngo/reports", {
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
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const kpi = data?.kpi;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="text-blue-600" size={24} />
            Impact Reports & Analytics
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {data?.ngoName} · Generated {data ? new Date(data.generatedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : "—"}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition">
          <Download size={16} /> Export Full Report
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {(["overview", "projects", "reports"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-semibold capitalize transition border-b-2 -mb-px ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab === "overview" ? "Impact Overview" : tab === "projects" ? "Project Progress" : "Downloadable Reports"}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: DollarSign, label: "Total Funds Received", value: kpi?.totalFundsFormatted || "₹0", color: "from-blue-600 to-blue-700", sub: `${kpi?.totalDisbursedFormatted || "₹0"} disbursed` },
              { icon: Users, label: "Total Beneficiaries", value: (kpi?.totalBeneficiaries || 0).toLocaleString("en-IN"), color: "from-cyan-500 to-blue-500", sub: "across all projects" },
              { icon: Target, label: "Projects", value: `${kpi?.activeProjects || 0} Active`, color: "from-purple-500 to-pink-500", sub: `${kpi?.completedProjects || 0} completed` },
              { icon: CheckCircle2, label: "Milestone Success", value: `${kpi?.milestoneSuccessRate || 0}%`, color: "from-green-500 to-emerald-600", sub: "completion rate" },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className={`bg-gradient-to-br ${c.color} rounded-2xl p-5 text-white shadow-lg`}>
                  <Icon size={20} className="mb-3 opacity-80" />
                  <p className="text-xs opacity-80 mb-1">{c.label}</p>
                  <p className="text-2xl font-bold">{c.value}</p>
                  <p className="text-xs opacity-70 mt-1">{c.sub}</p>
                </div>
              );
            })}
          </div>

          {/* Volunteer KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Award size={24} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Volunteers Engaged</p>
                <p className="text-3xl font-bold text-slate-900">{kpi?.volunteerCount || 0}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <TrendingUp size={24} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Volunteer Hours</p>
                <p className="text-3xl font-bold text-slate-900">{(kpi?.volunteerHours || 0).toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                <Target size={24} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Total Proposals</p>
                <p className="text-3xl font-bold text-slate-900">{kpi?.totalProjects || 0}</p>
              </div>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Fund Flow */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Monthly Fund Flow</h3>
              {(data?.monthlyFlow || []).every((d) => d.received === 0 && d.released === 0) ? (
                <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No fund data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data?.monthlyFlow || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${v}L`} />
                    <Tooltip formatter={(v: number) => `₹${v} L`} contentStyle={{ borderRadius: "12px", border: "none" }} />
                    <Legend />
                    <Bar dataKey="received" fill="#3b82f6" name="Received (L)" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="released" fill="#10b981" name="Released (L)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Milestone Status Pie */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Milestone Status</h3>
              {(data?.milestoneStatus || []).length === 0 ? (
                <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No milestones yet</div>
              ) : (
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="60%" height={200}>
                    <PieChart>
                      <Pie data={data?.milestoneStatus} dataKey="value" cx="50%" cy="50%" outerRadius={80} label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}>
                        {(data?.milestoneStatus || []).map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-2">
                    {(data?.milestoneStatus || []).map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }}></span>
                        <span className="text-sm text-slate-600">{s.name}</span>
                        <span className="ml-auto font-bold text-slate-900">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sector Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Sector Fund Allocation (₹ Lakhs)</h3>
              {(data?.sectorData || []).length === 0 ? (
                <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No sector data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data?.sectorData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                    <YAxis type="category" dataKey="name" stroke="#94a3b8" width={90} fontSize={11} />
                    <Tooltip formatter={(v: number) => `₹${v} L`} contentStyle={{ borderRadius: "12px", border: "none" }} />
                    {(data?.sectorData || []).map((s, i) => (
                      <Bar key={i} dataKey="funds" fill={s.color} radius={[0, 6, 6, 0]} />
                    )).slice(0, 1)}
                    <Bar dataKey="funds" radius={[0, 6, 6, 0]}>
                      {(data?.sectorData || []).map((s, i) => (
                        <Cell key={i} fill={s.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Beneficiary Trend */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Cumulative Beneficiaries</h3>
              {(data?.benefTrend || []).every((d) => d.beneficiaries === 0) ? (
                <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No beneficiary data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={data?.benefTrend || []}>
                    <defs>
                      <linearGradient id="bGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
                    <Area type="monotone" dataKey="beneficiaries" stroke="#3b82f6" fill="url(#bGrad)" strokeWidth={2} name="Beneficiaries" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── PROJECT PROGRESS TAB ── */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          {(data?.projectProgress || []).length === 0 ? (
            <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-200">
              <Target size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No active or completed projects yet</p>
              <p className="text-sm mt-2">Submit proposals to get started.</p>
            </div>
          ) : (
            (data?.projectProgress || []).map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h4 className="font-bold text-slate-900">{p.name}</h4>
                    <p className="text-sm text-slate-500">{p.sector}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                    p.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                    p.status === "COMPLETED" ? "bg-blue-100 text-blue-700" :
                    "bg-slate-100 text-slate-700"
                  }`}>{p.status}</span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Overall Progress</span>
                    <span className="font-bold text-slate-900">{p.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-3 rounded-full transition-all" style={{ width: `${p.progress}%` }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500">Budget</p>
                    <p className="font-bold text-slate-900 text-sm">{fmt(p.budget)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Disbursed</p>
                    <p className="font-bold text-green-600 text-sm">{fmt(p.disbursed)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Beneficiaries</p>
                    <p className="font-bold text-slate-900 text-sm">{p.beneficiaries.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── REPORTS TAB ── */}
      {activeTab === "reports" && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
            <strong>Note:</strong> Report generation is simulated for demonstration. In production, these would be generated from live data and IPFS-anchored documents.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(data?.reports || []).map((r, i) => (
              <div key={i} className={`bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition flex items-center gap-4 ${r.generated ? "border-slate-200" : "border-dashed border-slate-300 opacity-60"}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${r.type === "PDF" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                  {r.type === "PDF" ? <FileText size={22} /> : <FileSpreadsheet size={22} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{r.name}</p>
                  <p className="text-xs text-slate-500">{r.type} · {r.size}</p>
                </div>
                <button
                  disabled={!r.generated}
                  className={`p-2 rounded-lg ${r.generated ? "hover:bg-slate-100 text-slate-700" : "text-slate-300 cursor-not-allowed"}`}
                  title={r.generated ? "Download" : "Not yet generated"}
                >
                  <FileDown size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
