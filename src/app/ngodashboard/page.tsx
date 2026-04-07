"use client";

import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Target, FileText, Users, CheckCircle, Clock, AlertCircle, Bell, Settings, LogOut, LayoutDashboard, FolderKanban, Upload, Activity, Wallet, UserCheck, BarChart3, Menu, X, ChevronRight, Search } from 'lucide-react';

export default function NGODashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'proposals', label: 'Project Proposals', icon: FolderKanban },
    { id: 'status', label: 'Project Status', icon: Activity },
    { id: 'milestones', label: 'Milestone Submission', icon: Upload },
    { id: 'funds', label: 'Fund Tracker', icon: Wallet },
    { id: 'volunteers', label: 'Volunteers', icon: UserCheck },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
  ];

  const fundData = [
    { month: 'Jan', received: 45000, utilized: 38000 },
    { month: 'Feb', received: 52000, utilized: 48000 },
    { month: 'Mar', received: 48000, utilized: 45000 },
    { month: 'Apr', received: 61000, utilized: 55000 },
    { month: 'May', received: 55000, utilized: 52000 },
    { month: 'Jun', received: 67000, utilized: 63000 },
    {month : 'jul', received: 57000, utilized: 23000},
  ];

  const projectDistribution = [
    { name: 'Education', value: 35, color: '#3b82f6' },
    { name: 'Healthcare', value: 25, color: '#06b6d4' },
    { name: 'Environment', value: 20, color: '#8b5cf6' },
    { name: 'Rural Dev', value: 20, color: '#10b981' },
  ];

  const recentActivities = [
    { id: 1, type: 'fund', message: 'Fund disbursed for Milestone 2 - Education Project', time: '2 hours ago', icon: DollarSign },
    { id: 2, type: 'approval', message: 'Project "Clean Water Initiative" approved by TechCorp CSR', time: '5 hours ago', icon: CheckCircle },
    { id: 3, type: 'milestone', message: 'Milestone proof submitted for Healthcare Camp', time: '1 day ago', icon: Target },
    { id: 4, type: 'alert', message: 'Deadline approaching for Rural Development Phase 1', time: '2 days ago', icon: AlertCircle },
  ];

  const activeProjects = [
    { id: 1, name: 'Rural Education Program', partner: 'TechCorp Foundation', progress: 75, funds: '$45,000', status: 'On Track' },
    { id: 2, name: 'Healthcare Initiative', partner: 'GreenEnergy CSR', progress: 45, funds: '$32,000', status: 'In Progress' },
    { id: 3, name: 'Clean Water Project', partner: 'FinServe Ltd', progress: 90, funds: '$28,000', status: 'Near Complete' },
    { id: 4, name: 'Skill Development', partner: 'AutoIndustries', progress: 30, funds: '$51,000', status: 'Starting' },
  ];

  const pendingMilestones = [
    { id: 1, project: 'Rural Education Program', milestone: 'Phase 2 Completion', deadline: '15 Dec 2025', amount: '$12,000' },
    { id: 2, project: 'Healthcare Initiative', milestone: 'Equipment Installation', deadline: '20 Dec 2025', amount: '$8,500' },
    { id: 3, project: 'Skill Development', milestone: 'Training Module 1', deadline: '28 Dec 2025', amount: '$15,000' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white transition-all duration-300 z-50 ${sidebarOpen ? 'w-72' : 'w-20'} shadow-2xl`}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-blue-800/50">
            <div className="flex items-center justify-between">
              <div className={`flex items-center space-x-3 ${!sidebarOpen && 'justify-center'}`}>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                  H
                </div>
                {sidebarOpen && (
                  <div>
                    <h1 className="text-lg font-bold">Hope Foundation</h1>
                    <p className="text-blue-300 text-xs">NGO Dashboard</p>
                  </div>
                )}
              </div>
              {sidebarOpen && (
                <button onClick={() => setSidebarOpen(false)} className="hover:bg-blue-800 p-2 rounded-lg transition">
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all group ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/30' 
                      : 'hover:bg-blue-800/50'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-white' : 'text-blue-300'} />
                  {sidebarOpen && (
                    <>
                      <span className={`flex-1 text-left text-sm font-medium ${isActive ? 'text-white' : 'text-blue-100'}`}>
                        {item.label}
                      </span>
                      {isActive && <ChevronRight size={16} />}
                    </>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Profile Section */}
          <div className="p-4 border-t border-blue-800/50">
            <div className={`flex items-center space-x-3 ${!sidebarOpen && 'justify-center'}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center font-bold">
                A
              </div>
              {sidebarOpen && (
                <div className="flex-1">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-blue-300">admin@hope.org</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Collapsed Toggle */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute -right-3 top-6 bg-blue-600 text-white p-1.5 rounded-full shadow-lg hover:bg-blue-500 transition"
          >
            <Menu size={16} />
          </button>
        )}
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
        {/* Top Bar */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40">
          <div className="px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
                  Dashboard Overview
                </h2>
                <p className="text-sm text-slate-600 mt-1">Welcome back! Here's what's happening with your projects.</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    className="pl-10 pr-4 py-2.5 bg-slate-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition w-64"
                  />
                </div>
                <button className="relative hover:bg-slate-100 p-3 rounded-xl transition">
                  <Bell size={20} className="text-slate-600" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>
                <button className="hover:bg-slate-100 p-3 rounded-xl transition">
                  <Settings size={20} className="text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <DollarSign size={24} />
                  </div>
                  <span className="text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">+12.5%</span>
                </div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Funds Received</p>
                <h3 className="text-3xl font-bold">$328K</h3>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-3 rounded-xl">
                  <Target className="text-white" size={24} />
                </div>
                <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Live</span>
              </div>
              <p className="text-slate-600 text-sm font-medium mb-1">Active Projects</p>
              <h3 className="text-3xl font-bold text-slate-900">12</h3>
              <p className="text-slate-500 text-sm mt-2">4 pending approval</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">Excellent</span>
              </div>
              <p className="text-slate-600 text-sm font-medium mb-1">Fund Utilization</p>
              <h3 className="text-3xl font-bold text-slate-900">94.2%</h3>
              <p className="text-slate-500 text-sm mt-2">$309K utilized</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl">
                  <Clock className="text-white" size={24} />
                </div>
                <span className="text-xs text-orange-600 bg-orange-50 px-3 py-1 rounded-full">3 urgent</span>
              </div>
              <p className="text-slate-600 text-sm font-medium mb-1">Pending Milestones</p>
              <h3 className="text-3xl font-bold text-slate-900">8</h3>
              <p className="text-slate-500 text-sm mt-2">Due this week</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Fund Flow Analysis</h3>
                <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500">
                  <option>Last 6 months</option>
                  <option>Last year</option>
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
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  />
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
                  <Pie
                    data={projectDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={85}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {projectDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Projects & Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Active Projects</h3>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center">
                  View All <ChevronRight size={16} className="ml-1" />
                </button>
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
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-cyan-500 h-2.5 rounded-full transition-all shadow-sm"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1.5 rounded-full inline-block ${
                      project.progress > 80 ? 'bg-green-100 text-green-700' :
                      project.progress > 50 ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {project.status}
                    </span>
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
                        <p className="text-xs text-slate-500 mt-1 flex items-center">
                          <Clock size={12} className="mr-1" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pending Milestones */}
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
                        <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm px-5 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all">
                          Submit Proof
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}