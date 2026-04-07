"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  User,
  Search,
  TrendingUp,
  QrCode,
  Award,
} from "lucide-react";

const navItems = [
  { href: "/volunteerdashboard", label: "Dashboard", icon: TrendingUp },
  { href: "/volunteerdashboard/projects", label: "Project Explorer", icon: Search },
  { href: "/volunteerdashboard/attendance", label: "Attendance", icon: QrCode },
  { href: "/volunteerdashboard/certificates", label: "Certificates", icon: Award },
  { href: "/volunteerdashboard/profile", label: "Profile", icon: User },
  { href: "/volunteerdashboard/notifications", label: "Notifications", icon: Bell },
];

export default function VolunteerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan-400 rounded-xl flex items-center justify-center font-bold text-2xl">
                H
              </div>
              <div>
                <h1 className="text-xl font-bold">Hope Foundation</h1>
                <p className="text-blue-100 text-sm">Volunteer Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 w-64"
                />
              </div>
              <Link
                href="/volunteerdashboard/notifications"
                className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>
              <Link
                href="/volunteerdashboard/profile"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map((tab) => {
              const isActive =
                tab.href === "/volunteerdashboard"
                  ? pathname === "/volunteerdashboard"
                  : pathname.startsWith(tab.href);
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all relative whitespace-nowrap ${
                    isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">{children}</div>
    </div>
  );
}
