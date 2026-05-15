"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  FileText, Download, CheckCircle2, XCircle, Shield,
  AlertCircle, FileSpreadsheet, FileDown, Link2, Loader2,
} from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CheckItem { item: string; status: boolean }
interface AuditLog { time: string; user: string; action: string; txHash: string }
interface Report { name: string; type: string; size: string }
interface Budget { totalBudget: number; totalAllocated: number; disbursed: number; remaining: number }

interface ComplianceData {
  complianceScore: number;
  spendPct: number;
  budget: Budget;
  checklist: CheckItem[];
  auditLogs: AuditLog[];
  reports: Report[];
}

const fmt = (n: number) =>
  n >= 10000000 ? `₹${(n / 10000000).toFixed(2)} Cr` :
  n >= 100000 ? `₹${(n / 100000).toFixed(2)} L` :
  `₹${n.toLocaleString("en-IN")}`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function CompliancePage() {
  const [data, setData] = useState<ComplianceData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/company/compliance", {
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

  const score = data?.complianceScore ?? 0;
  const gaugeData = [{ name: "Spend", value: score, fill: "#06b6d4" }];
  const pendingItems = (data?.checklist ?? []).filter((c) => !c.status).length;

  return (
    <>
      <div className="bg-white border-b border-[#e5e7eb] px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#1a2847]">Compliance &amp; Reports</h2>
            <p className="text-[#64748b] text-sm mt-1">Section 135 CSR Act compliance tracking and audit trail.</p>
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
                <h3 className="text-2xl font-bold">Compliance Status: {score}%</h3>
                <p className="text-white/90 text-sm mt-1">
                  Section 135 of Companies Act, 2013
                  {pendingItems > 0 ? ` — ${pendingItems} item${pendingItems !== 1 ? "s" : ""} require action` : " — Fully compliant"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/80">Budget allocated</p>
              <p className="text-lg font-bold">{data?.spendPct ?? 0}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gauge */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
            <h3 className="text-lg font-bold text-[#1a2847] mb-2">Mandatory 2% Spend</h3>
            <p className="text-xs text-[#64748b] mb-2">
              Budget: {fmt(data?.budget?.totalBudget ?? 0)}
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart innerRadius="65%" outerRadius="90%" data={gaugeData} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background={{ fill: "#e5e7eb" }} dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="text-center -mt-32 mb-16 relative z-10">
              <p className="text-4xl font-bold text-[#1a2847]">{data?.spendPct ?? 0}%</p>
              <p className="text-xs text-[#64748b]">of budget allocated</p>
            </div>
            <div className="flex justify-between text-sm pt-4 border-t border-[#e5e7eb]">
              <div>
                <p className="text-xs text-[#64748b]">Allocated</p>
                <p className="font-bold text-[#10b981]">{fmt(data?.budget?.totalAllocated ?? 0)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#64748b]">Remaining</p>
                <p className="font-bold text-[#f59e0b]">{fmt(data?.budget?.remaining ?? 0)}</p>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
            <h3 className="text-lg font-bold text-[#1a2847] mb-4">Regulatory Checklist</h3>
            <div className="space-y-2">
              {(data?.checklist ?? []).map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-lg border border-[#e5e7eb]">
                  <div className="flex items-center gap-3">
                    {c.status ? (
                      <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[#ef4444]" />
                    )}
                    <span className="text-sm text-[#1a2847]">{c.item}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${c.status ? "bg-[#d1fae5] text-[#065f46]" : "bg-[#fee2e2] text-[#991b1b]"}`}>
                    {c.status ? "Compliant" : "Action Required"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reports */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
          <h3 className="text-lg font-bold text-[#1a2847] mb-4">Downloadable Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(data?.reports ?? []).map((r) => (
              <div key={r.name} className="p-4 border border-[#e5e7eb] rounded-xl hover:bg-[#f8fafc] transition-all flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${r.type === "PDF" ? "bg-[#fee2e2] text-[#dc2626]" : "bg-[#d1fae5] text-[#065f46]"}`}>
                  {r.type === "PDF" ? <FileText className="w-6 h-6" /> : <FileSpreadsheet className="w-6 h-6" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1a2847] truncate">{r.name}</p>
                  <p className="text-xs text-[#64748b]">{r.type} • {r.size}</p>
                </div>
                <button className="p-2 rounded-lg hover:bg-[#e5e7eb] text-[#1a2847]">
                  <FileDown className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Audit log */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] overflow-hidden">
          <div className="p-6 border-b border-[#e5e7eb] flex justify-between items-center">
            <h3 className="text-lg font-bold text-[#1a2847]">Immutable Audit Log</h3>
            <span className="text-xs px-3 py-1 rounded-full bg-[#ecfeff] text-[#0e7490] border border-[#06b6d4]/30 flex items-center gap-1">
              <Shield className="w-3 h-3" /> On-chain verified
            </span>
          </div>
          {(data?.auditLogs ?? []).length === 0 ? (
            <div className="p-12 text-center text-[#64748b] text-sm">No audit entries yet.</div>
          ) : (
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
                {(data?.auditLogs ?? []).map((l, i) => (
                  <tr key={i} className="border-b border-[#e5e7eb] hover:bg-[#f8fafc]">
                    <td className="px-6 py-3 text-xs font-mono text-[#64748b]">{l.time}</td>
                    <td className="px-6 py-3 text-sm text-[#1a2847]">{l.user}</td>
                    <td className="px-6 py-3 text-sm text-[#475569]">{l.action}</td>
                    <td className="px-6 py-3 text-xs font-mono">
                      {l.txHash !== "—" ? (
                        <a href="#" className="text-[#06b6d4] flex items-center gap-1 hover:underline">
                          <Link2 className="w-3 h-3" /> {l.txHash}
                        </a>
                      ) : <span className="text-[#94a3b8]">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Action required banner */}
        {pendingItems > 0 && (
          <div className="bg-[#fef3c7] border border-[#fde68a] rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#d97706] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[#92400e]">
                {pendingItems} compliance item{pendingItems !== 1 ? "s" : ""} require action
              </p>
              <p className="text-xs text-[#78350f] mt-1">
                Review the checklist above and complete pending items to achieve full Section 135 compliance.
                Unspent CSR funds must be transferred to PM CARES / Swachh Bharat Kosh as per Rule 10(1) of CSR Rules.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
