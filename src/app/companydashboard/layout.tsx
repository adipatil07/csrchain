"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileCheck,
  Wallet,
  Activity,
  FileText,
  BarChart3,
  Building2,
  ChevronDown,
  Bell,
  Search,
  Shield,
} from "lucide-react";

const navItems = [
  { href: "/companydashboard", icon: LayoutDashboard, label: "CSR Dashboard" },
  { href: "/companydashboard/projects", icon: FileCheck, label: "Project Review" },
  { href: "/companydashboard/funds", icon: Wallet, label: "Fund Management" },
  { href: "/companydashboard/monitoring", icon: Activity, label: "Project Monitoring" },
  { href: "/companydashboard/compliance", icon: FileText, label: "Compliance & Reports" },
  { href: "/companydashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/companydashboard/profile", icon: Building2, label: "Organization Profile" },
];

export default function CompanyDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/companydashboard"
      ? pathname === href
      : pathname.startsWith(href);

  return (
    <div className="flex h-screen bg-[#0f1c3f] text-white">
      {/* Sidebar */}
      <div
        className={`${
          sidebarExpanded ? "w-64" : "w-20"
        } bg-[#1a2847] border-r border-[#2d3f6b] transition-all duration-300 flex flex-col`}
      >
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

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] shadow-lg"
                    : "hover:bg-[#243555]"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarExpanded && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {sidebarExpanded && (
          <div className="p-4 mx-4 mb-2 rounded-xl bg-gradient-to-br from-[#0ea5e9]/20 to-[#06b6d4]/10 border border-[#0ea5e9]/30">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-[#06b6d4]" />
              <span className="text-xs font-semibold text-[#06b6d4]">
                Polygon Secured
              </span>
            </div>
            <p className="text-[10px] text-[#7e9bc9] leading-tight">
              All CSR funds locked via on-chain escrow contracts
            </p>
          </div>
        )}

        <div className="p-4 border-t border-[#2d3f6b]">
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#243555] hover:bg-[#2d4067] transition-all"
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                sidebarExpanded ? "rotate-90" : "-rotate-90"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-[#f0f4f9]">
        {/* Header */}
        <div className="bg-white border-b border-[#e5e7eb] p-6 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
                <input
                  placeholder="Search projects, NGOs, transactions..."
                  className="pl-9 pr-4 py-2 rounded-lg bg-[#f8fafc] border border-[#e5e7eb] text-sm text-[#1a2847] w-80 outline-none focus:border-[#06b6d4]"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ecfeff] border border-[#06b6d4]/30">
                <div className="w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse"></div>
                <span className="text-xs font-semibold text-[#0e7490]">
                  Polygon Mainnet
                </span>
              </div>
              <button className="w-10 h-10 rounded-lg bg-[#f8fafc] border border-[#e5e7eb] flex items-center justify-center hover:bg-[#f1f5f9]">
                <Bell className="w-4 h-4 text-[#1a2847]" />
              </button>
              <div className="flex items-center gap-3 pl-3 border-l border-[#e5e7eb]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] flex items-center justify-center font-bold text-white">
                  TC
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-[#1a2847]">TechCorp India Ltd.</p>
                  <p className="text-xs text-[#64748b]">CSR Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
