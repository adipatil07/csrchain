"use client";

import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Wallet, TrendingUp, Lock, ArrowUpRight, ArrowDownLeft, Link2, ExternalLink } from 'lucide-react';

const flow = [
  { m: 'Oct', received: 3200000, utilized: 2800000, escrowed: 400000 },
  { m: 'Nov', received: 4100000, utilized: 3600000, escrowed: 500000 },
  { m: 'Dec', received: 3800000, utilized: 3500000, escrowed: 300000 },
  { m: 'Jan', received: 5200000, utilized: 4700000, escrowed: 500000 },
  { m: 'Feb', received: 4700000, utilized: 4200000, escrowed: 500000 },
  { m: 'Mar', received: 6100000, utilized: 5300000, escrowed: 800000 },
  { m: 'Apr', received: 4500000, utilized: 2100000, escrowed: 2400000 },
];

const perProject = [
  { name: 'Rural Edu', received: 4500000, utilized: 3375000 },
  { name: 'Healthcare', received: 3200000, utilized: 1440000 },
  { name: 'Clean Water', received: 2800000, utilized: 2520000 },
  { name: 'Skill Dev', received: 5100000, utilized: 1530000 },
  { name: 'Nutrition', received: 2450000, utilized: 1470000 },
  { name: 'Solar', received: 2200000, utilized: 2200000 },
];

const txs = [
  { id: 1, date: '06 Apr 2026', project: 'Rural Education Program', type: 'Release', amount: '₹9,00,000', tx: '0x4a2e8b1f9c34a7d1c6c9db12e2f7a9e5b', partner: 'Tata CSR' },
  { id: 2, date: '04 Apr 2026', project: 'Healthcare Initiative Delhi', type: 'Deposit', amount: '₹17,60,000', tx: '0x91ab4f2c55df01ba8b1fc34a4a2e7d1c', partner: 'Reliance Fdn.' },
  { id: 3, date: '01 Apr 2026', project: 'Clean Water Mumbai', type: 'Release', amount: '₹7,50,000', tx: '0x6c9db12e8b1fc34a2f7a9e5b91ab4f2c', partner: 'Infosys Fdn.' },
  { id: 4, date: '28 Mar 2026', project: 'Skill Development Pune', type: 'Deposit', amount: '₹35,70,000', tx: '0x2f7a9e5b4a2e7d1c8b1fc34a55df01ba', partner: 'Mahindra Rise' },
  { id: 5, date: '22 Mar 2026', project: 'Girl Child Nutrition', type: 'Release', amount: '₹6,20,000', tx: '0x55df01ba6c9db12e91ab4f2c4a2e7d1c', partner: 'ITC MSK' },
  { id: 6, date: '15 Mar 2026', project: 'Solar Lighting', type: 'Release', amount: '₹2,20,000', tx: '0x8b1fc34a2f7a9e5b4a2e7d1c6c9db12e', partner: 'Adani Fdn.' },
];

export default function FundsPage() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-6 text-white">
          <Wallet size={22} className="mb-3 opacity-80" />
          <p className="text-sm opacity-90">Total Received</p>
          <p className="text-3xl font-bold mt-1">₹3.28 Cr</p>
          <p className="text-xs mt-2 opacity-80">+12.5% vs last quarter</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl shadow-xl p-6 text-white">
          <TrendingUp size={22} className="mb-3 opacity-80" />
          <p className="text-sm opacity-90">Total Utilized</p>
          <p className="text-3xl font-bold mt-1">₹3.09 Cr</p>
          <p className="text-xs mt-2 opacity-80">94.2% utilization rate</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white">
          <Lock size={22} className="mb-3 opacity-80" />
          <p className="text-sm opacity-90">In Escrow (On-chain)</p>
          <p className="text-3xl font-bold mt-1">₹47.82 L</p>
          <p className="text-xs mt-2 opacity-80">Across 12 projects</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
          <ArrowUpRight size={22} className="mb-3 opacity-80" />
          <p className="text-sm opacity-90">Released This Month</p>
          <p className="text-3xl font-bold mt-1">₹24.90 L</p>
          <p className="text-xs mt-2 opacity-80">7 milestone releases</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-cyan-900 rounded-2xl shadow-xl p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl"><Link2 size={24} /></div>
            <div>
              <p className="text-xs uppercase tracking-wider text-blue-200">Polygon Escrow Smart Contract</p>
              <p className="font-mono text-sm">0x8f3C72A7b4E5D6c9a12B3F8E7d6C5b4a91B2c3D4e</p>
            </div>
          </div>
          <a href="#" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur px-4 py-2.5 rounded-xl text-sm transition">
            View on Polygonscan <ExternalLink size={14} />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Fund Flow Over Time</h3>
            <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5">
              <option>Last 7 months</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={flow}>
              <defs>
                <linearGradient id="rcv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="utl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="m" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
              <Legend />
              <Area type="monotone" dataKey="received" stroke="#3b82f6" fill="url(#rcv)" strokeWidth={2} name="Received" />
              <Area type="monotone" dataKey="utilized" stroke="#06b6d4" fill="url(#utl)" strokeWidth={2} name="Utilized" />
              <Line type="monotone" dataKey="escrowed" stroke="#8b5cf6" strokeWidth={2} name="Escrowed" dot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Per-Project Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={perProject} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis type="category" dataKey="name" stroke="#94a3b8" width={80} />
              <Tooltip />
              <Bar dataKey="received" fill="#3b82f6" name="Received" radius={[0, 6, 6, 0]} />
              <Bar dataKey="utilized" fill="#06b6d4" name="Utilized" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">On-Chain Transactions</h3>
          <button className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Export CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase">Date</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase">Project</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase">Partner</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase">Type</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase">Transaction Hash</th>
              </tr>
            </thead>
            <tbody>
              {txs.map(t => (
                <tr key={t.id} className="border-b border-slate-100 hover:bg-blue-50/40 transition">
                  <td className="py-4 px-4 text-sm text-slate-600">{t.date}</td>
                  <td className="py-4 px-4 text-sm font-semibold text-slate-900">{t.project}</td>
                  <td className="py-4 px-4 text-sm text-slate-600">{t.partner}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full ${t.type === 'Deposit' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {t.type === 'Deposit' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}{t.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm font-bold text-blue-600">{t.amount}</td>
                  <td className="py-4 px-4">
                    <a href="#" className="inline-flex items-center gap-1 font-mono text-xs text-cyan-700 bg-cyan-50 hover:bg-cyan-100 px-2.5 py-1.5 rounded-lg transition">
                      <Link2 size={11} />{t.tx.substring(0, 10)}...{t.tx.substring(t.tx.length - 6)}
                      <ExternalLink size={11} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
