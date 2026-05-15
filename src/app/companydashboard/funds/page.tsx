"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Wallet,
  Lock,
  TrendingUp,
  ArrowUpRight,
  Link2,
  Plus,
  ExternalLink,
  DollarSign,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Budget { totalBudget: number; totalAllocated: number; totalDisbursed: number; inEscrow: number; available: number }
interface Escrow { id: string; project: string; ngo: string; locked: number; released: number; tx: string | null; status: string }
interface Tx { hash: string; type: string; project: string; amount: number; amountLabel: string; time: string; status: string }
interface PieSlice { name: string; value: number; color: string }
interface ActiveProject { id: string; title: string; ngo: string }

const fmt = (n: number) =>
  n >= 10000000 ? `₹${(n / 10000000).toFixed(2)} Cr` :
  n >= 100000 ? `₹${(n / 100000).toFixed(2)} L` :
  `₹${n.toLocaleString("en-IN")}`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function FundManagementPage() {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [escrows, setEscrows] = useState<Escrow[]>([]);
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [allocationPie, setAllocationPie] = useState<PieSlice[]>([]);
  const [activeProjects, setActiveProjects] = useState<ActiveProject[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [selectedProject, setSelectedProject] = useState("");
  const [amount, setAmount] = useState("");
  const [allocating, setAllocating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/company/funds", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setBudget(json.budget);
      setEscrows(json.escrows ?? []);
      setTransactions(json.transactions ?? []);
      setAllocationPie(json.allocationPie ?? []);
      setActiveProjects(json.activeProjects ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAllocate = async () => {
    if (!selectedProject || !amount) return;
    setAllocating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/company/funds", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: selectedProject, amount: Number(amount) }),
      });
      const json = await res.json();
      if (res.ok) {
        setToast(json.escrowTxHash);
        setAmount(""); setSelectedProject("");
        fetchData();
        setTimeout(() => setToast(null), 8000);
      }
    } finally {
      setAllocating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#0ea5e9]" />
      </div>
    );
  }

  const kpiCards = [
    { label: "Total CSR Budget", value: fmt(budget?.totalBudget ?? 0), sub: "Company total", icon: Wallet, grad: "from-[#1e90ff] to-[#0066cc]" },
    { label: "Allocated", value: fmt(budget?.totalAllocated ?? 0), sub: `${budget?.totalBudget ? Math.round(((budget.totalAllocated ?? 0) / budget.totalBudget) * 100) : 0}% of budget`, icon: ArrowUpRight, grad: "from-[#8b5cf6] to-[#6d28d9]" },
    { label: "In Escrow", value: fmt(budget?.inEscrow ?? 0), sub: "On-chain locked", icon: Lock, grad: "from-[#0ea5e9] to-[#06b6d4]" },
    { label: "Disbursed", value: fmt(budget?.totalDisbursed ?? 0), sub: "Milestone releases", icon: TrendingUp, grad: "from-[#10b981] to-[#059669]" },
  ];

  return (
    <>
      <div className="bg-white border-b border-[#e5e7eb] px-6 py-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a2847]">Fund Management</h2>
          <p className="text-[#64748b] text-sm mt-1">Track CSR budget, escrow balances and on-chain disbursements.</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {kpiCards.map((k) => (
            <div key={k.label} className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[#64748b] text-sm">{k.label}</p>
                  <h3 className="text-2xl font-bold mt-2 text-[#1a2847]">{k.value}</h3>
                  <p className="text-xs text-[#64748b] mt-1">{k.sub}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${k.grad} rounded-xl flex items-center justify-center`}>
                  <k.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Allocation pie */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
            <h3 className="text-lg font-bold text-[#1a2847] mb-4">Budget Allocation</h3>
            {allocationPie.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={allocationPie} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                      {allocationPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px", color: "#1a2847" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {allocationPie.map((e) => (
                    <div key={e.name} className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ background: e.color }}></span>
                        <span className="text-[#64748b]">{e.name}</span>
                      </div>
                      <span className="font-semibold text-[#1a2847]">₹{e.value}.00 L</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-48 text-[#64748b] text-sm text-center">
                No allocations yet
              </div>
            )}
          </div>

          {/* Allocate form */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1a2847]">Allocate Additional Funds</h3>
                <p className="text-xs text-[#64748b]">Funds will be locked in a Polygon escrow contract</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#64748b] block mb-1">Select Active Project</label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-sm text-[#1a2847] bg-white"
                >
                  <option value="">— Choose project —</option>
                  {activeProjects.map((p) => (
                    <option key={p.id} value={p.id}>{p.title} ({p.ngo})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-[#64748b] block mb-1">Amount (₹)</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    placeholder="2500000"
                    className="w-full pl-10 pr-4 py-2.5 border border-[#e5e7eb] rounded-lg text-sm text-[#1a2847] bg-white outline-none focus:border-[#06b6d4]"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <button
                  onClick={handleAllocate}
                  disabled={allocating || !selectedProject || !amount}
                  className="w-full px-4 py-3 bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] hover:from-[#0284c7] hover:to-[#0891b2] text-white rounded-lg font-semibold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {allocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  Lock in Escrow
                </button>
              </div>
            </div>
            {activeProjects.length === 0 && (
              <p className="mt-3 text-xs text-[#94a3b8] text-center">
                Approve proposals first to unlock active projects for funding.
              </p>
            )}
          </div>
        </div>

        {/* Escrow balances */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#1a2847]">Active Escrow Contracts</h3>
            <span className="text-xs px-3 py-1 rounded-full bg-[#ecfeff] text-[#0e7490] border border-[#06b6d4]/30">Polygon Mainnet</span>
          </div>
          {escrows.length === 0 ? (
            <div className="text-center py-8 text-[#64748b] text-sm">No escrow contracts yet. Approve proposals to create escrow.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {escrows.map((e) => {
                const pct = e.locked > 0 ? Math.min(Math.round((e.released / e.locked) * 100), 100) : 0;
                return (
                  <div key={e.id} className="border border-[#e5e7eb] rounded-xl p-4 hover:shadow-md transition-all bg-[#f8fafc]">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-[#1a2847]">{e.project}</p>
                        <p className="text-xs text-[#64748b]">{e.ngo}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-[#cffafe] text-[#0e7490]">{e.status}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div><p className="text-xs text-[#64748b]">Locked</p><p className="font-bold text-[#1a2847]">{fmt(e.locked)}</p></div>
                      <div><p className="text-xs text-[#64748b]">Released</p><p className="font-bold text-[#10b981]">{fmt(e.released)}</p></div>
                    </div>
                    <div className="w-full bg-[#e5e7eb] rounded-full h-1.5 mb-3">
                      <div className="bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] h-1.5 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      {e.tx ? (
                        <div className="flex items-center gap-1 text-[#0e7490] font-mono">
                          <Link2 className="w-3 h-3" />
                          {e.tx.slice(0, 10)}...{e.tx.slice(-6)}
                        </div>
                      ) : <span className="text-[#94a3b8]">No tx yet</span>}
                      <a href="#" className="text-[#06b6d4] flex items-center gap-1 hover:underline">
                        Polygonscan <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] overflow-hidden">
          <div className="p-6 border-b border-[#e5e7eb]">
            <h3 className="text-lg font-bold text-[#1a2847]">On-Chain Transactions</h3>
          </div>
          {transactions.length === 0 ? (
            <div className="p-12 text-center text-[#64748b] text-sm">No transactions yet.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-[#f8fafc] text-xs uppercase text-[#64748b]">
                <tr>
                  <th className="text-left px-6 py-3">Tx Hash</th>
                  <th className="text-left px-6 py-3">Type</th>
                  <th className="text-left px-6 py-3">Project</th>
                  <th className="text-left px-6 py-3">Amount</th>
                  <th className="text-left px-6 py-3">Date</th>
                  <th className="text-right px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 10).map((t, idx) => (
                  <tr key={idx} className="border-b border-[#e5e7eb] hover:bg-[#f8fafc]">
                    <td className="px-6 py-4">
                      {t.hash && t.hash !== "—" ? (
                        <a href="#" className="text-[#06b6d4] font-mono text-xs flex items-center gap-1 hover:underline">
                          {t.hash.slice(0, 16)}... <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : <span className="text-[#94a3b8] text-xs font-mono">—</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1a2847]">{t.type}</td>
                    <td className="px-6 py-4 text-sm text-[#475569] max-w-[180px] truncate">{t.project}</td>
                    <td className={`px-6 py-4 text-sm font-semibold ${t.amount >= 0 ? "text-[#10b981]" : "text-[#f97316]"}`}>{t.amountLabel}</td>
                    <td className="px-6 py-4 text-xs text-[#64748b]">{t.time}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs px-2 py-1 rounded-full bg-[#d1fae5] text-[#065f46]">{t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Escrow toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#0f1c3f] border border-[#06b6d4] text-white rounded-xl p-4 shadow-2xl max-w-md z-50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Escrow Contract Deployed</p>
              <p className="text-xs text-[#7e9bc9] mt-1 flex items-center gap-1"><Link2 className="w-3 h-3" /> Tx Hash:</p>
              <p className="text-xs font-mono text-[#06b6d4] break-all mt-0.5">{toast}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
