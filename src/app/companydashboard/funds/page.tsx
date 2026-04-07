"use client";

import React, { useState } from "react";
import {
  Wallet,
  Lock,
  TrendingUp,
  ArrowUpRight,
  Link2,
  Plus,
  ExternalLink,
  DollarSign,
  Send,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const allocationPie = [
  { name: "Disbursed", value: 112, color: "#06b6d4" },
  { name: "In Escrow", value: 78, color: "#0ea5e9" },
  { name: "Allocated", value: 35, color: "#8b5cf6" },
  { name: "Available", value: 25, color: "#e2e8f0" },
];

const escrows = [
  {
    project: "Rural Education Initiative",
    ngo: "Shiksha Foundation",
    locked: "₹25,00,000",
    released: "₹16,25,000",
    tx: "0x7a3f4c2d9e1b8a5f6c3d2e1b9a8f7e6d5c4b3a21",
    status: "Active",
  },
  {
    project: "Women Empowerment Drive",
    ngo: "Shakti NGO",
    locked: "₹32,00,000",
    released: "₹12,80,000",
    tx: "0x9d1c8b7a6e5f4d3c2b1a0f9e8d7c6b5a4f3e2d10",
    status: "Active",
  },
  {
    project: "Mobile Health Clinics",
    ngo: "Arogya Sewa",
    locked: "₹28,50,000",
    released: "₹14,25,000",
    tx: "0x2b8e7c6d5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b09",
    status: "Active",
  },
  {
    project: "Clean Water - Bundelkhand",
    ngo: "Jal Seva Trust",
    locked: "₹62,00,000",
    released: "₹0",
    tx: "0x4f1d2e3c4b5a69780192a3b4c5d6e7f8091a2b3c",
    status: "Locked",
  },
];

const transactions = [
  {
    hash: "0x7a3f4c2d9e1b8a5f",
    type: "Milestone Release",
    project: "Rural Education Initiative",
    amount: "+₹5,00,000",
    time: "2h ago",
    status: "Confirmed",
  },
  {
    hash: "0x9d1c8b7a6e5f4d3c",
    type: "Escrow Lock",
    project: "Women Empowerment Drive",
    amount: "−₹32,00,000",
    time: "1d ago",
    status: "Confirmed",
  },
  {
    hash: "0x4f1d2e3c4b5a6978",
    type: "Escrow Lock",
    project: "Clean Water - Bundelkhand",
    amount: "−₹62,00,000",
    time: "2d ago",
    status: "Confirmed",
  },
  {
    hash: "0x2b8e7c6d5f4a3b2c",
    type: "Milestone Release",
    project: "Mobile Health Clinics",
    amount: "+₹4,75,000",
    time: "3d ago",
    status: "Confirmed",
  },
  {
    hash: "0x1a2b3c4d5e6f7890",
    type: "Budget Top-up",
    project: "Annual CSR Wallet",
    amount: "+₹1,00,00,000",
    time: "6d ago",
    status: "Confirmed",
  },
];

export default function FundManagementPage() {
  const [ngo, setNgo] = useState("Shiksha Foundation");
  const [amount, setAmount] = useState("");
  const [project, setProject] = useState("");

  return (
    <>
      <div className="bg-white border-b border-[#e5e7eb] px-6 py-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a2847]">Fund Management</h2>
          <p className="text-[#64748b] text-sm mt-1">
            Track CSR budget, escrow balances and on-chain disbursements.
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              label: "Total CSR Budget",
              value: "₹2.50 Cr",
              sub: "FY 2025-26",
              icon: Wallet,
              grad: "from-[#1e90ff] to-[#0066cc]",
            },
            {
              label: "Allocated",
              value: "₹2.25 Cr",
              sub: "90% of budget",
              icon: ArrowUpRight,
              grad: "from-[#8b5cf6] to-[#6d28d9]",
            },
            {
              label: "In Escrow",
              value: "₹78.00 L",
              sub: "On-chain locked",
              icon: Lock,
              grad: "from-[#0ea5e9] to-[#06b6d4]",
            },
            {
              label: "Disbursed",
              value: "₹1.12 Cr",
              sub: "+₹9.75L this week",
              icon: TrendingUp,
              grad: "from-[#10b981] to-[#059669]",
            },
          ].map((k) => (
            <div
              key={k.label}
              className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[#64748b] text-sm">{k.label}</p>
                  <h3 className="text-2xl font-bold mt-2 text-[#1a2847]">
                    {k.value}
                  </h3>
                  <p className="text-xs text-[#64748b] mt-1">{k.sub}</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Allocation pie */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
            <h3 className="text-lg font-bold text-[#1a2847] mb-4">
              Budget Allocation
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={allocationPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {allocationPie.map((e, i) => (
                    <Cell key={i} fill={e.color} />
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
            <div className="space-y-2 mt-4">
              {allocationPie.map((e) => (
                <div key={e.name} className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: e.color }}
                    ></span>
                    <span className="text-[#64748b]">{e.name}</span>
                  </div>
                  <span className="font-semibold text-[#1a2847]">
                    ₹{e.value}.00 L
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Allocation form */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1a2847]">
                  Allocate New Funds
                </h3>
                <p className="text-xs text-[#64748b]">
                  Funds will be locked in a Polygon escrow contract
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#64748b] block mb-1">
                  Select NGO
                </label>
                <select
                  value={ngo}
                  onChange={(e) => setNgo(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-sm text-[#1a2847] bg-white"
                >
                  <option>Shiksha Foundation</option>
                  <option>Jal Seva Trust</option>
                  <option>Arogya Sewa</option>
                  <option>Shakti NGO</option>
                  <option>Green Earth Org</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#64748b] block mb-1">
                  Project
                </label>
                <input
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  placeholder="e.g. Rural Education Initiative"
                  className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-sm text-[#1a2847] bg-white outline-none focus:border-[#06b6d4]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-[#64748b] block mb-1">
                  Amount (₹)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="25,00,000"
                    className="w-full pl-10 pr-4 py-2.5 border border-[#e5e7eb] rounded-lg text-sm text-[#1a2847] bg-white outline-none focus:border-[#06b6d4]"
                  />
                </div>
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button className="flex-1 px-4 py-3 bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] hover:from-[#0284c7] hover:to-[#0891b2] text-white rounded-lg font-semibold shadow-lg flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" /> Lock in Escrow
                </button>
                <button className="px-4 py-3 bg-white border border-[#e5e7eb] text-[#1a2847] hover:bg-[#f8fafc] rounded-lg flex items-center gap-2">
                  <Send className="w-4 h-4" /> Direct Transfer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Escrow balances */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#1a2847]">
              Active Escrow Contracts
            </h3>
            <span className="text-xs px-3 py-1 rounded-full bg-[#ecfeff] text-[#0e7490] border border-[#06b6d4]/30">
              Polygon Mainnet
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {escrows.map((e) => {
              const pct =
                (parseInt(e.released.replace(/[^\d]/g, "")) /
                  parseInt(e.locked.replace(/[^\d]/g, ""))) *
                100;
              return (
                <div
                  key={e.tx}
                  className="border border-[#e5e7eb] rounded-xl p-4 hover:shadow-md transition-all bg-[#f8fafc]"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-[#1a2847]">{e.project}</p>
                      <p className="text-xs text-[#64748b]">{e.ngo}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-[#cffafe] text-[#0e7490]">
                      {e.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <p className="text-xs text-[#64748b]">Locked</p>
                      <p className="font-bold text-[#1a2847]">{e.locked}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#64748b]">Released</p>
                      <p className="font-bold text-[#10b981]">{e.released}</p>
                    </div>
                  </div>
                  <div className="w-full bg-[#e5e7eb] rounded-full h-1.5 mb-3">
                    <div
                      className="bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] h-1.5 rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-[#0e7490] font-mono">
                      <Link2 className="w-3 h-3" />
                      {e.tx.slice(0, 10)}...{e.tx.slice(-6)}
                    </div>
                    <a
                      href="#"
                      className="text-[#06b6d4] flex items-center gap-1 hover:underline"
                    >
                      Polygonscan <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transactions table */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] overflow-hidden">
          <div className="p-6 border-b border-[#e5e7eb]">
            <h3 className="text-lg font-bold text-[#1a2847]">
              On-Chain Transactions
            </h3>
          </div>
          <table className="w-full">
            <thead className="bg-[#f8fafc] text-xs uppercase text-[#64748b]">
              <tr>
                <th className="text-left px-6 py-3">Tx Hash</th>
                <th className="text-left px-6 py-3">Type</th>
                <th className="text-left px-6 py-3">Project</th>
                <th className="text-left px-6 py-3">Amount</th>
                <th className="text-left px-6 py-3">Time</th>
                <th className="text-right px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr
                  key={t.hash}
                  className="border-b border-[#e5e7eb] hover:bg-[#f8fafc]"
                >
                  <td className="px-6 py-4">
                    <a
                      href="#"
                      className="text-[#06b6d4] font-mono text-xs flex items-center gap-1 hover:underline"
                    >
                      {t.hash}... <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#1a2847]">{t.type}</td>
                  <td className="px-6 py-4 text-sm text-[#475569]">
                    {t.project}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm font-semibold ${
                      t.amount.startsWith("+")
                        ? "text-[#10b981]"
                        : "text-[#f97316]"
                    }`}
                  >
                    {t.amount}
                  </td>
                  <td className="px-6 py-4 text-xs text-[#64748b]">{t.time}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-xs px-2 py-1 rounded-full bg-[#d1fae5] text-[#065f46]">
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
