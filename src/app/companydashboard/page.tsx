"use client";

import React from "react";
import {
  TrendingUp,
  DollarSign,
  Activity,
  Clock,
  Download,
  Filter,
  ChevronDown,
  Link2,
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

const disbursementData = [
  { month: "Jan", allocated: 400, utilized: 240 },
  { month: "Feb", allocated: 300, utilized: 280 },
  { month: "Mar", allocated: 450, utilized: 390 },
  { month: "Apr", allocated: 500, utilized: 450 },
  { month: "May", allocated: 380, utilized: 340 },
  { month: "Jun", allocated: 420, utilized: 400 },
];

const sectorData = [
  { name: "Education", value: 35, color: "#2563eb" },
  { name: "Healthcare", value: 25, color: "#06b6d4" },
  { name: "Environment", value: 20, color: "#10b981" },
  { name: "Rural Dev", value: 15, color: "#8b5cf6" },
  { name: "Others", value: 5, color: "#f59e0b" },
];

const recentProjects = [
  {
    id: 1,
    name: "Rural Education Initiative",
    ngo: "Shiksha Foundation",
    amount: "₹25,00,000",
    status: "Active",
    progress: 65,
    tx: "0x7a3f...e12b",
  },
  {
    id: 2,
    name: "Clean Water Project",
    ngo: "Jal Seva Trust",
    amount: "₹18,50,000",
    status: "Review",
    progress: 0,
    tx: "—",
  },
  {
    id: 3,
    name: "Women Empowerment Drive",
    ngo: "Shakti NGO",
    amount: "₹32,00,000",
    status: "Active",
    progress: 40,
    tx: "0x9d1c...a4f0",
  },
  {
    id: 4,
    name: "Healthcare Camp - Pune",
    ngo: "Arogya Sewa",
    amount: "₹15,00,000",
    status: "Completed",
    progress: 100,
    tx: "0x2b8e...c97d",
  },
];

export default function CSRDashboardOverview() {
  return (
    <>
      <div className="bg-white border-b border-[#e5e7eb] px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#1a2847]">Dashboard Overview</h2>
            <p className="text-[#64748b] text-sm mt-1">
              Welcome back! Here&apos;s what&apos;s happening with your CSR initiatives.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-[#e5e7eb] text-[#1a2847] hover:bg-[#f8fafc] rounded-lg transition-all flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
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
          {[
            {
              label: "Total CSR Budget",
              value: "₹2.5 Cr",
              badge: "+12.5%",
              badgeCls: "bg-[#dbeafe] text-[#1e40af]",
              icon: DollarSign,
              grad: "from-[#1e90ff] to-[#0066cc]",
            },
            {
              label: "Active Projects",
              value: "24",
              badge: "Live",
              badgeCls: "bg-[#cffafe] text-[#0e7490]",
              icon: Activity,
              grad: "from-[#06b6d4] to-[#0891b2]",
            },
            {
              label: "Fund Utilization",
              value: "94.2%",
              badge: "Excellent",
              badgeCls: "bg-[#d1fae5] text-[#065f46]",
              icon: TrendingUp,
              grad: "from-[#c026d3] to-[#9333ea]",
            },
            {
              label: "Pending Milestones",
              value: "8",
              badge: "3 urgent",
              badgeCls: "bg-[#fed7aa] text-[#92400e]",
              icon: Clock,
              grad: "from-[#f97316] to-[#ea580c]",
            },
          ].map((k) => (
            <div
              key={k.label}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-[#e5e7eb]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[#64748b] text-sm">{k.label}</p>
                  <h3 className="text-3xl font-bold mt-2 text-[#1a2847]">
                    {k.value}
                  </h3>
                  <div className="flex items-center gap-1 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${k.badgeCls}`}>
                      {k.badge}
                    </span>
                  </div>
                </div>
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${k.grad} rounded-xl flex items-center justify-center`}
                >
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
              <select className="px-3 py-1 border border-[#e5e7eb] rounded-lg text-sm text-[#1a2847] bg-white">
                <option>Last 6 months</option>
                <option>Last 12 months</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={disbursementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    color: "#1a2847",
                  }}
                />
                <Legend />
                <Bar dataKey="allocated" fill="#2563eb" radius={[8, 8, 0, 0]} />
                <Bar dataKey="utilized" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
            <h3 className="text-xl font-bold mb-4 text-[#1a2847]">
              Project Categories
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    color: "#1a2847",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {sectorData.map((sector, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: sector.color }}
                    ></div>
                    <span className="text-[#64748b]">{sector.name}</span>
                  </div>
                  <span className="font-semibold text-[#1a2847]">
                    {sector.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#1a2847]">Recent Projects</h3>
            <button className="text-[#0ea5e9] hover:text-[#0284c7] text-sm flex items-center gap-1">
              View All
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          </div>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="bg-[#f8fafc] border border-[#e5e7eb] rounded-xl p-4 hover:bg-[#f1f5f9] transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg text-[#1a2847]">
                      {project.name}
                    </h4>
                    <p className="text-[#64748b] text-sm">{project.ngo}</p>
                    {project.tx !== "—" && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-[#0e7490]">
                        <Link2 className="w-3 h-3" />
                        <span className="font-mono">Escrow: {project.tx}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-[#1a2847]">
                      {project.amount}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        project.status === "Active"
                          ? "bg-[#d1fae5] text-[#065f46]"
                          : project.status === "Review"
                          ? "bg-[#fed7aa] text-[#92400e]"
                          : "bg-[#dbeafe] text-[#1e40af]"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#64748b]">Progress</span>
                    <span className="font-semibold text-[#1a2847]">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-[#e5e7eb] rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
