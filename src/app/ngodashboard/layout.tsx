"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell, Settings, LayoutDashboard, FolderKanban, Upload, Activity,
  Wallet, UserCheck, BarChart3, Menu, X, ChevronRight, Search,
} from 'lucide-react';

const navItems = [
  { href: '/ngodashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/ngodashboard/proposals', label: 'Project Proposals', icon: FolderKanban },
  { href: '/ngodashboard/status', label: 'Project Status', icon: Activity },
  { href: '/ngodashboard/milestones', label: 'Milestone Submission', icon: Upload },
  { href: '/ngodashboard/funds', label: 'Fund Tracker', icon: Wallet },
  { href: '/ngodashboard/volunteers', label: 'Volunteers', icon: UserCheck },
  { href: '/ngodashboard/reports', label: 'Reports & Analytics', icon: BarChart3 },
];

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  '/ngodashboard': { title: 'Dashboard Overview', subtitle: "Welcome back! Here's what's happening with your projects." },
  '/ngodashboard/proposals': { title: 'Project Proposals', subtitle: 'Draft, submit and track CSR project proposals.' },
  '/ngodashboard/status': { title: 'Project Status', subtitle: 'Live view of every active project and its on-chain escrow.' },
  '/ngodashboard/milestones': { title: 'Milestone Submission', subtitle: 'Submit verifiable proof anchored on IPFS & Polygon.' },
  '/ngodashboard/funds': { title: 'Fund Tracker', subtitle: 'Transparent on-chain fund movement across all projects.' },
  '/ngodashboard/volunteers': { title: 'Volunteers', subtitle: 'Manage your volunteer network and attestations.' },
  '/ngodashboard/reports': { title: 'Reports & Analytics', subtitle: 'Measure impact, efficiency and reach.' },
};

export default function NGODashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname() || '/ngodashboard';
  const meta = pageMeta[pathname] || pageMeta['/ngodashboard'];

  const isActive = (item: typeof navItems[number]) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + '/');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <aside className={`fixed left-0 top-0 h-full bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white transition-all duration-300 z-50 ${sidebarOpen ? 'w-72' : 'w-20'} shadow-2xl`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-blue-800/50">
            <div className="flex items-center justify-between">
              <div className={`flex items-center space-x-3 ${!sidebarOpen && 'justify-center'}`}>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">H</div>
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

          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all group ${
                    active ? 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/30' : 'hover:bg-blue-800/50'
                  }`}
                >
                  <Icon size={20} className={active ? 'text-white' : 'text-blue-300'} />
                  {sidebarOpen && (
                    <>
                      <span className={`flex-1 text-left text-sm font-medium ${active ? 'text-white' : 'text-blue-100'}`}>{item.label}</span>
                      {active && <ChevronRight size={16} />}
                    </>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-blue-800/50">
            <div className={`flex items-center space-x-3 ${!sidebarOpen && 'justify-center'}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center font-bold">A</div>
              {sidebarOpen && (
                <div className="flex-1">
                  <p className="text-sm font-medium">Anjali Sharma</p>
                  <p className="text-xs text-blue-300">admin@hopefoundation.org</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {!sidebarOpen && (
          <button onClick={() => setSidebarOpen(true)} className="absolute -right-3 top-6 bg-blue-600 text-white p-1.5 rounded-full shadow-lg hover:bg-blue-500 transition">
            <Menu size={16} />
          </button>
        )}
      </aside>

      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
        <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40">
          <div className="px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">{meta.title}</h2>
                <p className="text-sm text-slate-600 mt-1">{meta.subtitle}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="Search projects..." className="pl-10 pr-4 py-2.5 bg-slate-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition w-64" />
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

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
