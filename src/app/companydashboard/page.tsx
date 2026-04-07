"use client";

import React, { useState } from 'react';
import { LayoutDashboard, FileCheck, Wallet, Activity, FileText, BarChart3, Building2, ChevronDown, TrendingUp, Users, DollarSign, CheckCircle, Clock, AlertCircle, Download, Search, Filter } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CSRDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'CSR Dashboard' },
    { id: 'projects', icon: FileCheck, label: 'Project Review' },
    { id: 'funds', icon: Wallet, label: 'Fund Management' },
    { id: 'monitoring', icon: Activity, label: 'Project Monitoring' },
    { id: 'compliance', icon: FileText, label: 'Compliance & Reports' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'profile', icon: Building2, label: 'Organization Profile' }
  ];

  const disbursementData = [
    { month: 'Jan', allocated: 400, utilized: 240 },
    { month: 'Feb', allocated: 300, utilized: 280 },
    { month: 'Mar', allocated: 450, utilized: 390 },
    { month: 'Apr', allocated: 500, utilized: 450 },
    { month: 'May', allocated: 380, utilized: 340 },
    { month: 'Jun', allocated: 420, utilized: 400 }
  ];

  const sectorData = [
    { name: 'Education', value: 35, color: '#2563eb' },
    { name: 'Healthcare', value: 25, color: '#06b6d4' },
    { name: 'Environment', value: 20, color: '#10b981' },
    { name: 'Rural Dev', value: 15, color: '#8b5cf6' },
    { name: 'Others', value: 5, color: '#f59e0b' }
  ];

  const recentProjects = [
    { id: 1, name: 'Rural Education Initiative', ngo: 'Shiksha Foundation', amount: '₹25,00,000', status: 'Active', progress: 65 },
    { id: 2, name: 'Clean Water Project', ngo: 'Jal Seva Trust', amount: '₹18,50,000', status: 'Review', progress: 0 },
    { id: 3, name: 'Women Empowerment', ngo: 'Shakti NGO', amount: '₹32,00,000', status: 'Active', progress: 40 },
    { id: 4, name: 'Healthcare Camp', ngo: 'Arogya Sewa', amount: '₹15,00,000', status: 'Completed', progress: 100 }
  ];

  return (
    <div className="flex h-screen bg-[#0f1c3f] text-white">
      {/* Sidebar */}
      <div className={`${sidebarExpanded ? 'w-64' : 'w-20'} bg-[#1a2847] border-r border-[#2d3f6b] transition-all duration-300 flex flex-col`}>
        <div className="p-6 border-b border-[#2d3f6b]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1e90ff] to-[#0066cc] rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            {sidebarExpanded && (
              <div>
                <h1 className="font-bold text-lg">CSR Portal</h1>
                <p className="text-xs text-[#7e9bc9]">Corporate Panel</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] shadow-lg'
                  : 'hover:bg-[#243555]'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarExpanded && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#2d3f6b]">
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#243555] hover:bg-[#2d4067] transition-all"
          >
            <ChevronDown className={`w-5 h-5 transition-transform ${sidebarExpanded ? 'rotate-90' : '-rotate-90'}`} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-[#f0f4f9]">
        {/* Header */}
        <div className="bg-white border-b border-[#e5e7eb] p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-[#1a2847]">Dashboard Overview</h2>
              <p className="text-[#64748b] text-sm mt-1">Welcome back! Here's what's happening with your CSR initiatives.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white border border-[#e5e7eb] text-[#1a2847] hover:bg-[#f8fafc] rounded-lg transition-all flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] hover:from-[#0284c7] hover:to-[#0891b2] rounded-lg transition-all flex items-center gap-2 shadow-lg text-white">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-[#e5e7eb]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[#64748b] text-sm">Total CSR Budget</p>
                  <h3 className="text-3xl font-bold mt-2 text-[#1a2847]">₹2.5 Cr</h3>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-[#dbeafe] text-[#1e40af]">+12.5%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#1e90ff] to-[#0066cc] rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-[#e5e7eb]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[#64748b] text-sm">Active Projects</p>
                  <h3 className="text-3xl font-bold mt-2 text-[#1a2847]">24</h3>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-[#cffafe] text-[#0e7490]">Live</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#06b6d4] to-[#0891b2] rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-[#e5e7eb]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[#64748b] text-sm">Fund Utilization</p>
                  <h3 className="text-3xl font-bold mt-2 text-[#1a2847]">94.2%</h3>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-[#d1fae5] text-[#065f46]">Excellent</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#c026d3] to-[#9333ea] rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-[#e5e7eb]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[#64748b] text-sm">Pending Milestones</p>
                  <h3 className="text-3xl font-bold mt-2 text-[#1a2847]">8</h3>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-[#fed7aa] text-[#92400e]">3 urgent</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Disbursement Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#1a2847]">Fund Flow Analysis</h3>
                <select className="px-3 py-1 border border-[#e5e7eb] rounded-lg text-sm text-[#1a2847] bg-white">
                  <option>Last 6 months</option>
                  <option>Last 12 months</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={disbursementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#1a2847'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="allocated" fill="#2563eb" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="utilized" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Sector Distribution */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
              <h3 className="text-xl font-bold mb-4 text-[#1a2847]">Project Categories</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#1a2847'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {sectorData.map((sector, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }}></div>
                      <span className="text-[#64748b]">{sector.name}</span>
                    </div>
                    <span className="font-semibold text-[#1a2847]">{sector.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#1a2847]">Recent Projects</h3>
              <button className="text-[#0ea5e9] hover:text-[#0284c7] text-sm flex items-center gap-1">
                View All
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </button>
            </div>
            <div className="space-y-4">
              {recentProjects.map(project => (
                <div key={project.id} className="bg-[#f8fafc] border border-[#e5e7eb] rounded-xl p-4 hover:bg-[#f1f5f9] transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg text-[#1a2847]">{project.name}</h4>
                      <p className="text-[#64748b] text-sm">{project.ngo}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-[#1a2847]">{project.amount}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        project.status === 'Active' ? 'bg-[#d1fae5] text-[#065f46]' :
                        project.status === 'Review' ? 'bg-[#fed7aa] text-[#92400e]' :
                        'bg-[#dbeafe] text-[#1e40af]'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#64748b]">Progress</span>
                      <span className="font-semibold text-[#1a2847]">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-[#e5e7eb] rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSRDashboard;