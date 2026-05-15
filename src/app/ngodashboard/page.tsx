"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Target, CheckCircle, Clock, AlertCircle, ChevronRight, Link2, Loader2 } from 'lucide-react';

interface Stats {
  totalReceivedFormatted: string;
  activeProjects: number;
  pendingReview: number;
  utilization: string;
  pendingMilestones: number;
}

interface ActiveProject {
  id: string; name: string; partner: string; progress: number; funds: string; status: string;
}

interface PendingMilestone {
  id: string; project: string; milestone: string; deadline: string; amount: string;
}

interface Activity {
  id: string; type: string; message: string; time: string;
}

interface FlowPoint { month: string; received: number; utilized: number }
interface SectorSlice { name: string; value: number; color: string }
interface BlockchainBanner {
  escrowContract: string;
  escrowBalanceFormatted: string;
  verifiedMilestones: number;
  totalMilestones: number;
  lastTx: string;
}

export default function NGODashboardOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeProjects, setActiveProjects] = useState<ActiveProject[]>([]);
  const [pendingMilestones, setPendingMilestones] = useState<PendingMilestone[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [fundFlowData, setFundFlowData] = useState<FlowPoint[]>([]);
  const [sectorData, setSectorData] = useState<SectorSlice[]>([]);
  const [blockchain, setBlockchain] = useState<BlockchainBanner | null>(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ngo/stats', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.stats) setStats(data.stats);
      setActiveProjects(data.activeProjects || []);
      setPendingMilestones(data.pendingMilestones || []);
      setRecentActivities(data.recentActivities || []);
      setFundFlowData(data.fundFlowData || []);
      setSectorData(data.sectorData || []);
      if (data.blockchainBanner) setBlockchain(data.blockchainBanner);
    } catch {
      console.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const activityIconMap: Record<string, React.ElementType> = {
    fund: DollarSign, approval: CheckCircle, milestone: Target, alert: AlertCircle,
  };

  return (
    <>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm"><DollarSign size={24} /></div>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">Live</span>
            </div>
            <p className="text-blue-100 text-sm font-medium mb-1">Total Funds Received</p>
            <h3 className="text-3xl font-bold">{stats?.totalReceivedFormatted || '₹0'}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-3 rounded-xl"><Target className="text-white" size={24} /></div>
            <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Live</span>
          </div>
          <p className="text-slate-600 text-sm font-medium mb-1">Active Projects</p>
          <h3 className="text-3xl font-bold text-slate-900">{stats?.activeProjects || 0}</h3>
          <p className="text-slate-500 text-sm mt-2">{stats?.pendingReview || 0} pending approval</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl"><TrendingUp className="text-white" size={24} /></div>
            <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
              {parseFloat(stats?.utilization || '0') > 70 ? 'Excellent' : 'On Track'}
            </span>
          </div>
          <p className="text-slate-600 text-sm font-medium mb-1">Fund Utilization</p>
          <h3 className="text-3xl font-bold text-slate-900">{stats?.utilization || '0%'}</h3>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl"><Clock className="text-white" size={24} /></div>
            <span className="text-xs text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              {(stats?.pendingMilestones || 0) > 0 ? 'Attention' : 'All Clear'}
            </span>
          </div>
          <p className="text-slate-600 text-sm font-medium mb-1">Pending Milestones</p>
          <h3 className="text-3xl font-bold text-slate-900">{stats?.pendingMilestones || 0}</h3>
        </div>
      </div>

      {/* Blockchain Banner */}
      <div className="mb-8 bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-800 rounded-2xl shadow-xl p-6 text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur"><Link2 size={24} /></div>
          <div>
            <p className="text-xs uppercase tracking-wider text-blue-200">Polygon Escrow Contract</p>
            <p className="font-mono text-sm">{blockchain?.escrowContract || '—'}</p>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-blue-200">Escrow Balance</p>
          <p className="text-2xl font-bold">{blockchain?.escrowBalanceFormatted || '₹0'}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-blue-200">Verified Milestones</p>
          <p className="text-2xl font-bold">
            {blockchain ? `${blockchain.verifiedMilestones} / ${blockchain.totalMilestones}` : '0 / 0'}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-blue-200">Last Tx</p>
          <p className="font-mono text-sm">{blockchain?.lastTx || '—'}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Fund Flow Analysis</h3>
            <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Last 6 months</span>
          </div>
          {fundFlowData.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
              No fund data yet. Fund flow will appear once companies allocate to your projects.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={fundFlowData}>
                <defs>
                  <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e40af" stopOpacity={0.9}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  </linearGradient>
                  <linearGradient id="colorUtilized" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.9}/><stop offset="95%" stopColor="#22d3ee" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                <Tooltip
                  formatter={(v: number) => `₹${(v / 100000).toFixed(2)} L`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Bar dataKey="received" fill="url(#colorReceived)" name="Funds Received" radius={[8, 8, 0, 0]} />
                <Bar dataKey="utilized" fill="url(#colorUtilized)" name="Funds Utilized" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Project Categories</h3>
          {sectorData.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-slate-400 text-sm text-center px-4">
              No projects yet. Sector breakdown will appear once you create proposals.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={sectorData} cx="50%" cy="50%" labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={85} fill="#8884d8" dataKey="value">
                  {sectorData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Active Projects & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Active Projects</h3>
            <Link href="/ngodashboard/status" className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center">
              View All <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          {activeProjects.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Target size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No active projects yet.</p>
              <Link href="/ngodashboard/proposals" className="text-blue-600 text-sm font-medium mt-2 inline-block">Create your first proposal →</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {activeProjects.slice(0, 4).map(project => (
                <div key={project.id} className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 hover:shadow-md transition-all border border-slate-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-slate-900">{project.name}</h4>
                      <p className="text-sm text-slate-500 mt-0.5">{project.partner}</p>
                    </div>
                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{project.funds}</span>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600 font-medium">Progress</span>
                      <span className="font-bold text-slate-900">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1.5 rounded-full inline-block ${
                    project.progress > 80 ? 'bg-green-100 text-green-700' : project.progress > 50 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                  }`}>{project.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
          {recentActivities.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <CheckCircle size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No recent activity. Activity will appear here as you submit milestones.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map(activity => {
                const Icon = activityIconMap[activity.type] || AlertCircle;
                return (
                  <div key={activity.id} className="flex items-start space-x-4 pb-4 border-b border-slate-100 last:border-0">
                    <div className={`p-3 rounded-xl ${
                      activity.type === 'fund' ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                      activity.type === 'approval' ? 'bg-gradient-to-br from-blue-400 to-cyan-500' :
                      activity.type === 'milestone' ? 'bg-gradient-to-br from-purple-400 to-pink-500' :
                      'bg-gradient-to-br from-orange-400 to-red-500'
                    } shadow-md`}>
                      <Icon className="text-white" size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-800 font-medium">{activity.message}</p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center"><Clock size={12} className="mr-1" />{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Pending Milestones Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">Pending Milestones</h3>
          <div className="flex space-x-2">
            <Link href="/ngodashboard/milestones" className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Submit Proof
            </Link>
          </div>
        </div>
        {pendingMilestones.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <CheckCircle size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No pending milestones. All milestones are up to date!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  {['Project', 'Milestone', 'Deadline', 'Amount', 'Action'].map(h => (
                    <th key={h} className="text-left py-4 px-4 text-sm font-bold text-slate-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pendingMilestones.map(m => (
                  <tr key={m.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="py-4 px-4 text-sm text-slate-800 font-medium">{m.project}</td>
                    <td className="py-4 px-4 text-sm text-slate-600">{m.milestone}</td>
                    <td className="py-4 px-4 text-sm text-slate-600">{m.deadline}</td>
                    <td className="py-4 px-4 text-sm font-bold text-blue-600">{m.amount}</td>
                    <td className="py-4 px-4">
                      <Link href="/ngodashboard/milestones"
                        className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm px-5 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all">
                        Submit Proof
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
