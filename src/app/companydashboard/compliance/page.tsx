"use client";

import React from "react";
import {
  FileText,
  Download,
  CheckCircle2,
  XCircle,
  Shield,
  AlertCircle,
  FileSpreadsheet,
  FileDown,
  Link2,
} from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";

const checklist = [
  { item: "Section 135 Applicability Confirmed", status: true },
  { item: "CSR Committee Constituted (3+ Directors)", status: true },
  { item: "CSR Policy Published on Website", status: true },
  { item: "Annual CSR Plan Approved by Board", status: true },
  { item: "2% Mandatory Spend Achieved (FY 25-26)", status: false },
  { item: "Form CSR-1 Filed with MCA", status: true },
  { item: "Form CSR-2 Filed with MCA", status: true },
  { item: "Independent Impact Assessment (>₹10 Cr)", status: true },
  { item: "Unspent CSR Transferred to Govt Fund", status: false },
  { item: "On-chain Audit Trail Enabled", status: true },
];

const auditLogs = [
  {
    time: "2026-04-06 14:22",
    user: "priya.sharma@techcorp.in",
    action: "Approved proposal #1023",
    txHash: "0x7a3f...e12b",
  },
  {
    time: "2026-04-06 11:05",
    user: "rahul.mehta@techcorp.in",
    action: "Released milestone funds ₹5,00,000",
    txHash: "0x9d1c...a4f0",
  },
  {
    time: "2026-04-05 16:48",
    user: "csr-committee@techcorp.in",
    action: "Updated CSR policy document",
    txHash: "—",
  },
  {
    time: "2026-04-05 09:30",
    user: "priya.sharma@techcorp.in",
    action: "Locked ₹62,00,000 in escrow",
    txHash: "0x4f1d...2b3c",
  },
  {
    time: "2026-04-04 18:15",
    user: "auditor@knavcorp.com",
    action: "Downloaded Q4 compliance report",
    txHash: "—",
  },
];

const reports = [
  { name: "Annual CSR Report FY 2024-25", type: "PDF", size: "3.2 MB" },
  { name: "Section 135 Compliance Certificate", type: "PDF", size: "820 KB" },
  { name: "Impact Assessment Report - Q4", type: "PDF", size: "5.8 MB" },
  { name: "Fund Disbursement Ledger", type: "CSV", size: "412 KB" },
  { name: "Board Meeting Minutes - CSR", type: "PDF", size: "1.1 MB" },
  { name: "On-chain Transaction Export", type: "CSV", size: "240 KB" },
];

export default function CompliancePage() {
  const gaugeData = [{ name: "Spend", value: 87, fill: "#06b6d4" }];

  return (
    <>
      <div className="bg-white border-b border-[#e5e7eb] px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#1a2847]">
              Compliance &amp; Reports
            </h2>
            <p className="text-[#64748b] text-sm mt-1">
              Section 135 CSR Act compliance tracking and audit trail.
            </p>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] text-white rounded-lg flex items-center gap-2 shadow-lg">
            <Download className="w-4 h-4" /> Export All Reports
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Status banner */}
        <div className="bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Compliance Status: 87%</h3>
                <p className="text-white/90 text-sm mt-1">
                  Section 135 of Companies Act, 2013 — 2 items require action
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/80">Last audit</p>
              <p className="text-lg font-bold">15 Mar 2026</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 2% gauge */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
            <h3 className="text-lg font-bold text-[#1a2847] mb-2">
              Mandatory 2% Spend
            </h3>
            <p className="text-xs text-[#64748b] mb-2">
              Avg profit last 3 yrs: ₹125 Cr
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart
                innerRadius="65%"
                outerRadius="90%"
                data={gaugeData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background={{ fill: "#e5e7eb" }}
                  dataKey="value"
                  cornerRadius={10}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="text-center -mt-32 mb-16 relative z-10">
              <p className="text-4xl font-bold text-[#1a2847]">87%</p>
              <p className="text-xs text-[#64748b]">of ₹2.5 Cr target</p>
            </div>
            <div className="flex justify-between text-sm pt-4 border-t border-[#e5e7eb]">
              <div>
                <p className="text-xs text-[#64748b]">Spent</p>
                <p className="font-bold text-[#10b981]">₹2.17 Cr</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#64748b]">Remaining</p>
                <p className="font-bold text-[#f59e0b]">₹33 L</p>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
            <h3 className="text-lg font-bold text-[#1a2847] mb-4">
              Regulatory Checklist
            </h3>
            <div className="space-y-2">
              {checklist.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-lg border border-[#e5e7eb]"
                >
                  <div className="flex items-center gap-3">
                    {c.status ? (
                      <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[#ef4444]" />
                    )}
                    <span className="text-sm text-[#1a2847]">{c.item}</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      c.status
                        ? "bg-[#d1fae5] text-[#065f46]"
                        : "bg-[#fee2e2] text-[#991b1b]"
                    }`}
                  >
                    {c.status ? "Compliant" : "Action Required"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reports downloads */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
          <h3 className="text-lg font-bold text-[#1a2847] mb-4">
            Downloadable Reports
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {reports.map((r) => (
              <div
                key={r.name}
                className="p-4 border border-[#e5e7eb] rounded-xl hover:bg-[#f8fafc] transition-all flex items-center gap-3"
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    r.type === "PDF"
                      ? "bg-[#fee2e2] text-[#dc2626]"
                      : "bg-[#d1fae5] text-[#065f46]"
                  }`}
                >
                  {r.type === "PDF" ? (
                    <FileText className="w-6 h-6" />
                  ) : (
                    <FileSpreadsheet className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1a2847] truncate">
                    {r.name}
                  </p>
                  <p className="text-xs text-[#64748b]">
                    {r.type} • {r.size}
                  </p>
                </div>
                <button className="p-2 rounded-lg hover:bg-[#e5e7eb] text-[#1a2847]">
                  <FileDown className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Audit logs */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] overflow-hidden">
          <div className="p-6 border-b border-[#e5e7eb] flex justify-between items-center">
            <h3 className="text-lg font-bold text-[#1a2847]">
              Immutable Audit Log
            </h3>
            <span className="text-xs px-3 py-1 rounded-full bg-[#ecfeff] text-[#0e7490] border border-[#06b6d4]/30 flex items-center gap-1">
              <Shield className="w-3 h-3" /> On-chain verified
            </span>
          </div>
          <table className="w-full">
            <thead className="bg-[#f8fafc] text-xs uppercase text-[#64748b]">
              <tr>
                <th className="text-left px-6 py-3">Timestamp</th>
                <th className="text-left px-6 py-3">User</th>
                <th className="text-left px-6 py-3">Action</th>
                <th className="text-left px-6 py-3">Tx Hash</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((l, i) => (
                <tr
                  key={i}
                  className="border-b border-[#e5e7eb] hover:bg-[#f8fafc]"
                >
                  <td className="px-6 py-3 text-xs font-mono text-[#64748b]">
                    {l.time}
                  </td>
                  <td className="px-6 py-3 text-sm text-[#1a2847]">{l.user}</td>
                  <td className="px-6 py-3 text-sm text-[#475569]">
                    {l.action}
                  </td>
                  <td className="px-6 py-3 text-xs font-mono">
                    {l.txHash !== "—" ? (
                      <a
                        href="#"
                        className="text-[#06b6d4] flex items-center gap-1 hover:underline"
                      >
                        <Link2 className="w-3 h-3" /> {l.txHash}
                      </a>
                    ) : (
                      <span className="text-[#94a3b8]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#fef3c7] border border-[#fde68a] rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#d97706] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#92400e]">
              Action required before 31 May 2026
            </p>
            <p className="text-xs text-[#78350f] mt-1">
              Unspent amount of ₹33 L must be transferred to PM CARES / Swachh
              Bharat Kosh or an ongoing project under Schedule VII as per Rule
              10(1) of CSR Rules.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
