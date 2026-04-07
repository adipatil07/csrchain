"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const sectorSpend = [
  { sector: "Education", spend: 87 },
  { sector: "Healthcare", spend: 62 },
  { sector: "Environment", spend: 50 },
  { sector: "Rural Dev", spend: 38 },
  { sector: "Women Emp", spend: 32 },
  { sector: "Others", spend: 12 },
];

const geoImpact = [
  { state: "Maharashtra", beneficiaries: 18500 },
  { state: "Bihar", beneficiaries: 24100 },
  { state: "UP", beneficiaries: 31200 },
  { state: "Rajasthan", beneficiaries: 12400 },
  { state: "Karnataka", beneficiaries: 9800 },
  { state: "TN", beneficiaries: 14500 },
];

const ngoRadar = [
  { criterion: "Timeliness", Shiksha: 92, Shakti: 78, Arogya: 85 },
  { criterion: "Transparency", Shiksha: 95, Shakti: 82, Arogya: 90 },
  { criterion: "Impact", Shiksha: 88, Shakti: 85, Arogya: 92 },
  { criterion: "Fund Usage", Shiksha: 90, Shakti: 80, Arogya: 88 },
  { criterion: "Reporting", Shiksha: 94, Shakti: 76, Arogya: 86 },
];

const milestoneTrend = [
  { month: "Oct", completed: 12, delayed: 2 },
  { month: "Nov", completed: 15, delayed: 3 },
  { month: "Dec", completed: 18, delayed: 1 },
  { month: "Jan", completed: 22, delayed: 4 },
  { month: "Feb", completed: 20, delayed: 2 },
  { month: "Mar", completed: 26, delayed: 3 },
];

const beneficiariesTrend = [
  { month: "Oct", people: 8200 },
  { month: "Nov", people: 12400 },
  { month: "Dec", people: 18900 },
  { month: "Jan", people: 27500 },
  { month: "Feb", people: 38200 },
  { month: "Mar", people: 52100 },
];

export default function AnalyticsPage() {
  const [range, setRange] = useState("Last 6 months");

  return (
    <>
      <div className="bg-white border-b border-[#e5e7eb] px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#1a2847]">
              Impact Analytics
            </h2>
            <p className="text-[#64748b] text-sm mt-1">
              Deep insights into CSR spend effectiveness and beneficiary reach.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg">
              <Calendar className="w-4 h-4 text-[#64748b]" />
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="text-sm text-[#1a2847] bg-transparent outline-none"
              >
                <option>Last 6 months</option>
                <option>Last 12 months</option>
                <option>FY 2025-26</option>
                <option>All time</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Beneficiaries",
              value: "1,57,200",
              icon: Users,
              trend: "+23% YoY",
              grad: "from-[#1e90ff] to-[#0066cc]",
            },
            {
              label: "Milestone Success",
              value: "91.2%",
              icon: Target,
              trend: "+4.1%",
              grad: "from-[#0ea5e9] to-[#06b6d4]",
            },
            {
              label: "Cost per Beneficiary",
              value: "₹1,432",
              icon: TrendingUp,
              trend: "−8% MoM",
              grad: "from-[#10b981] to-[#059669]",
            },
            {
              label: "Active Districts",
              value: "48",
              icon: BarChart3,
              trend: "+6",
              grad: "from-[#8b5cf6] to-[#6d28d9]",
            },
          ].map((k) => (
            <div
              key={k.label}
              className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5e7eb]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#64748b] text-xs">{k.label}</p>
                  <p className="text-2xl font-bold text-[#1a2847] mt-1">
                    {k.value}
                  </p>
                  <p className="text-xs text-[#10b981] mt-1">{k.trend}</p>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${k.grad} flex items-center justify-center`}
                >
                  <k.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sector spend */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
            <h3 className="text-lg font-bold text-[#1a2847] mb-4">
              Sector-wise Spend (₹ Lakh)
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={sectorSpend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="sector" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    color: "#1a2847",
                  }}
                />
                <Bar
                  dataKey="spend"
                  fill="url(#sg)"
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Geographical Impact */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
            <h3 className="text-lg font-bold text-[#1a2847] mb-4">
              Geographical Impact (Beneficiaries by State)
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={geoImpact} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis
                  type="category"
                  dataKey="state"
                  stroke="#64748b"
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    color: "#1a2847",
                  }}
                />
                <Bar
                  dataKey="beneficiaries"
                  fill="#8b5cf6"
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* NGO Radar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
            <h3 className="text-lg font-bold text-[#1a2847] mb-4">
              NGO Performance Comparison
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={ngoRadar}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis
                  dataKey="criterion"
                  stroke="#64748b"
                  fontSize={12}
                />
                <PolarRadiusAxis stroke="#94a3b8" />
                <Radar
                  name="Shiksha"
                  dataKey="Shiksha"
                  stroke="#0ea5e9"
                  fill="#0ea5e9"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Shakti"
                  dataKey="Shakti"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Arogya"
                  dataKey="Arogya"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                />
                <Legend />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    color: "#1a2847",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Milestone trend */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
            <h3 className="text-lg font-bold text-[#1a2847] mb-4">
              Milestone Completion Rate
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={milestoneTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    color: "#1a2847",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="delayed"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Beneficiaries reached */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
          <h3 className="text-lg font-bold text-[#1a2847] mb-4">
            Cumulative Beneficiaries Reached
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={beneficiariesTrend}>
              <defs>
                <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  color: "#1a2847",
                }}
              />
              <Area
                type="monotone"
                dataKey="people"
                stroke="#0ea5e9"
                strokeWidth={3}
                fill="url(#bg)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
