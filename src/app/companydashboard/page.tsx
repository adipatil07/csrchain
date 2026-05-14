"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Activity,
  Clock,
  Download,
  Link2,
  ChevronDown,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Stats {
  totalBudget: number;
  totalAllocated: number;
  activeProjects: number;
  utilization: number;
  pendingMilestones: number;
  totalDisbursed: number;
}

interface RecentProject {
  id: string;
  name: string;
  ngo: string;
  amount: number;
  status: string;
  progress: number;
  tx: string;
}

interface FlowPoint { month: string; allocated: number; utilized: number }
interface SectorSlice { name: string; value: number; color: string }

interface DashData {
  companyName: string;
  stats: Stats;
  recentProjects: RecentProject[];
  fundFlowData: FlowPoint[];
  sectorData: SectorSlice[];
}

const fmt = (n: number) =>
  n >= 10000000 ? `₹${(n / 10000000).toFixed(1)} Cr` :
  n >= 100000  ? `₹${(n / 100000).toFixed(1)} L` :
  `₹${n.toLocaleString("en-IN")}`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function CSRDashboardOverview() {
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/company/stats", {
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

  const s = data?.stats;
  const kpiCards = [
    {
      label: "Total CSR Budget",
      value: fmt(s?.totalBudget ?? 0),
      badge: `${fmt(s?.totalAllocated ?? 0)} allocated`,
      badgeCls: "bg-[#dbeafe] text-[#1e40af]",
      icon: DollarSign,
      grad: "from-[#1e90ff] to-[#0066cc]",
    },
    {
      label: "Active Projects",
      value: String(s?.activeProjects ?? 0),
      badge: "Live",
      badgeCls: "bg-[#cffafe] text-[#0e7490]",
      icon: Activity,
      grad: "from-[#06b6d4] to-[#0891b2]",
    },
    {
      label: "Fund Utilization",
      value: `${s?.utilization ?? 0}%`,
      badge: (s?.utilization ?? 0) >= 80 ? "Excellent" : "On Track",
      badgeCls: "bg-[#d1fae5] text-[#065f46]",
      icon: TrendingUp,
      grad: "from-[#c026d3] to-[#9333ea]",
    },
    {
      label: "Pending Milestones",
      value: String(s?.pendingMilestones ?? 0),
      badge: (s?.pendingMilestones ?? 0) > 0 ? "Needs Review" : "All clear",
      badgeCls: "bg-[#fed7aa] text-[#92400e]",
      icon: Clock,
      grad: "from-[#f97316] to-[#ea580c]",
    },
  ];

  return (
    <>
      <div className="bg-white border-b border-[#e5e7eb] px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#1a2847]">Dashboard Overview</h2>
            <p className="text-[#64748b] text-sm mt-1">
              Welcome back, {data?.companyName ?? "Company"}! Here&apos;s your CSR portfolio.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] hover:from-[#0284c7] hover:to-[#0891b2] rounded-lg transition-all flex items-center gap-2 shadow-lg text-white">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((k) => (
            <div
              key={k.label}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-[#e5e7eb]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[#64748b] text-sm">{k.label}</p>
                  <h3 className="text-3xl font-bold mt-2 text-[#1a2847]">{k.value}</h3>
                  <div className="flex items-center gap-1 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${k.badgeCls}`}>
                      {k.badge}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${k.grad} rounded-xl flex items-center justify-center`}>
                  <k.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#1a2847]">Fund Flow Analysis</h3>
            </div>
            {(data?.fundFlowData ?? []).some((d) => d.allocated > 0 || d.utilized > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.fundFlowData ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px", color: "#1a2847" }} />
                  <Legend />
                  <Bar dataKey="allocated" name="Allocated (L)" fill="#2563eb" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="utilized" name="Utilized (L)" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-[#64748b] text-sm">
                No fund flow data yet. Approve proposals to start tracking.
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
            <h3 className="text-xl font-bold mb-4 text-[#1a2847]">Project Categories</h3>
            {(data?.sectorData ?? []).length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={data?.sectorData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                      {(data?.sectorData ?? []).map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px", color: "#1a2847" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {(data?.sectorData ?? []).map((sector, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }}></div>
                        <span className="text-[#64748b]">{sector.name}</span>
                      </div>
                      <span className="font-semibold text-[#1a2847]">{sector.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-48 text-[#64748b] text-sm">
                Approve proposals to see sector breakdown
              </div>
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#1a2847]">Recent Projects</h3>
            <button className="text-[#0ea5e9] hover:text-[#0284c7] text-sm flex items-center gap-1">
              View All <ChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          </div>
          {(data?.recentProjects ?? []).length === 0 ? (
            <div className="text-center py-12 text-[#64748b] text-sm">
              No projects yet. Review proposals in the Project Review tab.
            </div>
          ) : (
            <div className="space-y-4">
              {(data?.recentProjects ?? []).map((project) => (
                <div key={project.id} className="bg-[#f8fafc] border border-[#e5e7eb] rounded-xl p-4 hover:bg-[#f1f5f9] transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg text-[#1a2847]">{project.name}</h4>
                      <p className="text-[#64748b] text-sm">{project.ngo}</p>
                      {project.tx !== "—" && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-[#0e7490]">
                          <Link2 className="w-3 h-3" />
                          <span className="font-mono">Escrow: {project.tx}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-[#1a2847]">{fmt(project.amount)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        project.status === "Active" ? "bg-[#d1fae5] text-[#065f46]" :
                        project.status === "Review" ? "bg-[#fed7aa] text-[#92400e]" :
                        "bg-[#dbeafe] text-[#1e40af]"
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#64748b]">Progress</span>
                      <span className="font-semibold text-[#1a2847]">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-[#e5e7eb] rounded-full h-2">
                      <div className="bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] h-2 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
