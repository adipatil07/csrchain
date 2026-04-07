"use client";

import React from 'react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Target, CheckCircle, Clock, AlertCircle, ChevronRight, Link2 } from 'lucide-react';

export default function NGODashboardOverview() {
  const fundData = [
    { month: 'Jan', received: 450000, utilized: 380000 },
    { month: 'Feb', received: 520000, utilized: 480000 },
    { month: 'Mar', received: 480000, utilized: 450000 },
    { month: 'Apr', received: 610000, utilized: 550000 },
    { month: 'May', received: 550000, utilized: 520000 },
    { month: 'Jun', received: 670000, utilized: 630000 },
    { month: 'Jul', received: 570000, utilized: 230000 },
  ];

  const projectDistribution = [
    { name: 'Education', value: 35, color: '#3b82f6' },
    { name: 'Healthcare', value: 25, color: '#06b6d4' },
    { name: 'Environment', value: 20, color: '#8b5cf6' },
    { name: 'Rural Dev', value: 20, color: '#10b981' },
  ];

  const recentActivities = [
    { id: 1, type: 'fund', message: 'Escrow released for Milestone 2 - Rural Education Program', time: '2 hours ago', icon: DollarSign },
    { id: 2, type: 'approval', message: 'Project "Clean Water Mumbai" approved by Tata CSR', time: '5 hours ago', icon: CheckCircle },
    { id: 3, type: 'milestone', message: 'IPFS proof submitted for Healthcare Camp, Delhi', time: '1 day ago', icon: Target },
    { id: 4, type: 'alert', message: 'Deadline approaching for Skill Development Phase 1', time: '2 days ago', icon: AlertCircle },
  ];

  const activeProjects = [
    { id: 1, name: 'Rural Education Program', partner: 'Tata CSR Foundation', progress: 75, funds: '₹45,00,000', status: 'On Track' },
    { id: 2, name: 'Healthcare Initiative Delhi', partner: 'Reliance Foundation', progress: 45, funds: '₹32,00,000', status: 'In Progress' },
    { id: 3, name: 'Clean Water Mumbai', partner: 'Infosys Foundation', progress: 90, funds: '₹28,00,000', status: 'Near Complete' },
    { id: 4, name: 'Skill Development Pune', partner: 'Mahindra Rise', progress: 30, funds: '₹51,00,000', status: 'Starting' },
  ];

  const pendingMilestones = [
    { id: 1, project: 'Rural Education Program', milestone: 'Phase 2 Completion', deadline: '15 Apr 2026', amount: '₹12,00,000' },
    { id: 2, project: 'Healthcare Initiative Delhi', milestone: 'Equipment Installation', deadline: '20 Apr 2026', amount: '₹8,50,000' },
    { id: 3, project: 'Skill Development Pune', milestone: 'Training Module 1', deadline: '28 Apr 2026', amount: '₹15,00,000' },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm"><DollarSign size={24} /></div>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">+12.5%</span>
            </div>
            <p className="text-blue-100 text-sm font-medium mb-1">Total Funds Received</p>
            <h3 className="text-3xl font-bold">₹3.28 Cr</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-3 rounded-xl"><Target className="text-white" size={24} /></div>
            <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Live</span>
          </div>
          <p className="text-slate-600 text-sm font-medium mb-1">Active Projects</p>
          <h3 className="text-3xl font-bold text-slate-900">12</h3>
          <p className="text-slate-500 text-sm mt-2">4 pending approval</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl"><TrendingUp className="text-white" size={24} /></div>
            <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">Excellent</span>
          </div>
          <p className="text-slate-600 text-sm font-medium mb-1">Fund Utilization</p>
          <h3 className="text-3xl font-bold text-slate-900">94.2%</h3>
          <p className="text-slate-500 text-sm mt-2">₹3.09 Cr utilized</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl"><Clock className="text-white" size={24} /></div>
            <span className="text-xs text-orange-600 bg-orange-50 px-3 py-1 rounded-full">3 urgent</span>
          </div>
          <p className="text-slate-600 text-sm font-medium mb-1">Pending Milestones</p>
          <h3 className="text-3xl font-bold text-slate-900">8</h3>
          <p className="text-slate-500 text-sm mt-2">Due this week</p>
        </div>
      </div>

      <div className="mb-8 bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-800 rounded-2xl shadow-xl p-6 text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur"><Link2 size={24} /></div>
          <div>
            <p className="text-xs uppercase tracking-wider text-blue-200">Polygon Escrow Contract</p>
            <p className="font-mono text-sm">0x8f3C...a91B</p>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-blue-200">Escrow Balance</p>
          <p className="text-2xl font-bold">₹47,82,000</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-blue-200">Verified Milestones</p>
          <p className="text-2xl font-bold">37 / 42</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-blue-200">Last Tx</p>
          <p className="font-mono text-sm">0x4a2e...7d1c</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Fund Flow Analysis</h3>
            <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500">
              <option>Last 6 months</option><option>Last year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={fundData}>
              <defs>
                <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e40af" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.8}/>
                </linearGradient>
                <linearGradient id="colorUtilized" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
              <Legend />
              <Bar dataKey="received" fill="url(#colorReceived)" name="Funds Received" radius={[8, 8, 0, 0]} />
              <Bar dataKey="utilized" fill="url(#colorUtilized)" name="Funds Utilized" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Project Categories</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={projectDistribution} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} outerRadius={85} fill="#8884d8" dataKey="value">
                {projectDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Active Projects</h3>
            <Link href="/ngodashboard/status" className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center">
              View All <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {activeProjects.map(project => (
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
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-2.5 rounded-full transition-all shadow-sm" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>
                <span className={`text-xs font-medium px-3 py-1.5 rounded-full inline-block ${
                  project.progress > 80 ? 'bg-green-100 text-green-700' :
                  project.progress > 50 ? 'bg-blue-100 text-blue-700' :
                  'bg-orange-100 text-orange-700'
                }`}>{project.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map(activity => {
              const Icon = activity.icon;
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
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">Pending Milestones</h3>
          <div className="flex space-x-2">
            <button className="text-sm px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition">Filter</button>
            <button className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Export</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-4 px-4 text-sm font-bold text-slate-700">Project</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-slate-700">Milestone</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-slate-700">Deadline</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-slate-700">Amount</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingMilestones.map(milestone => (
                <tr key={milestone.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="py-4 px-4 text-sm text-slate-800 font-medium">{milestone.project}</td>
                  <td className="py-4 px-4 text-sm text-slate-600">{milestone.milestone}</td>
                  <td className="py-4 px-4 text-sm text-slate-600">{milestone.deadline}</td>
                  <td className="py-4 px-4 text-sm font-bold text-blue-600">{milestone.amount}</td>
                  <td className="py-4 px-4">
                    <Link href="/ngodashboard/milestones" className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm px-5 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all">
                      Submit Proof
                    </Link>
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
