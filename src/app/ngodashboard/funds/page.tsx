"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';
import { Wallet, TrendingUp, Lock, ArrowUpRight, ArrowDownLeft, Link2, ExternalLink, Loader2 } from 'lucide-react';

interface FundStats {
  totalReceivedFormatted: string; totalUtilizedFormatted: string;
  inEscrowFormatted: string; utilization: string; releasedThisMonth: number;
}

interface Transaction {
  id: string; date: string; project: string; partner: string;
  type: 'Deposit' | 'Release'; amount: string; amountRaw: number; tx: string;
}

interface PerProject {
  name: string; received: number; utilized: number;
}

interface FlowPoint { m: string; received: number; utilized: number; escrowed: number }

export default function FundsPage() {
  const [stats, setStats] = useState<FundStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [perProject, setPerProject] = useState<PerProject[]>([]);
  const [flowData, setFlowData] = useState<FlowPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchFunds = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ngo/funds', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.stats) setStats(data.stats);
      setTransactions(data.transactions || []);
      setPerProject(data.perProject || []);
      setFlowData(data.flowData || []);
    } catch {
      console.error('Failed to load funds');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchFunds(); }, [fetchFunds]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 size={40} className="animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-6 text-white">
          <Wallet size={22} className="mb-3 opacity-80" />
          <p className="text-sm opacity-90">Total Received</p>
          <p className="text-3xl font-bold mt-1">{stats?.totalReceivedFormatted || '₹0'}</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl shadow-xl p-6 text-white">
          <TrendingUp size={22} className="mb-3 opacity-80" />
          <p className="text-sm opacity-90">Total Utilized</p>
          <p className="text-3xl font-bold mt-1">{stats?.totalUtilizedFormatted || '₹0'}</p>
          <p className="text-xs mt-2 opacity-80">{stats?.utilization || '0%'} utilization rate</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white">
          <Lock size={22} className="mb-3 opacity-80" />
          <p className="text-sm opacity-90">In Escrow (On-chain)</p>
          <p className="text-3xl font-bold mt-1">{stats?.inEscrowFormatted || '₹0'}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
          <ArrowUpRight size={22} className="mb-3 opacity-80" />
          <p className="text-sm opacity-90">Released This Month</p>
          <p className="text-3xl font-bold mt-1">
            {stats ? `₹${(stats.releasedThisMonth / 100000).toFixed(2)} L` : '₹0'}
          </p>
        </div>
      </div>

      {/* Contract Banner */}
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Fund Flow Over Time</h3>
            <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5"><option>Last 7 months</option></select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={flowData.length ? flowData : []}>
              <defs>
                <linearGradient id="rcv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="utl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="m" stroke="#94a3b8" /><YAxis stroke="#94a3b8" />
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
          {perProject.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-slate-400 text-sm">No fund data yet</div>
          ) : (
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
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">On-Chain Transactions</h3>
          <button className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Export CSV</button>
        </div>
        {transactions.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Wallet size={40} className="mx-auto mb-3 opacity-30" />
            <p>No transactions yet. Transactions appear here when companies allocate funds to your projects.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  {['Date', 'Project', 'Partner', 'Type', 'Amount', 'Transaction Hash'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
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
                      {t.tx && t.tx !== '—' ? (
                        <a href="#" className="inline-flex items-center gap-1 font-mono text-xs text-cyan-700 bg-cyan-50 hover:bg-cyan-100 px-2.5 py-1.5 rounded-lg transition">
                          <Link2 size={11} />{t.tx.substring(0, 10)}...{t.tx.slice(-6)}<ExternalLink size={11} />
                        </a>
                      ) : <span className="text-slate-400 text-xs">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
