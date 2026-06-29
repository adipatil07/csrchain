"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  User,
  Search,
  TrendingUp,
  QrCode,
  Award,
  LogOut,
  Cpu,
} from "lucide-react";

const navItems = [
  { href: "/volunteerdashboard", label: "Dashboard", icon: TrendingUp },
  { href: "/volunteerdashboard/projects", label: "Project Explorer", icon: Search },
  { href: "/volunteerdashboard/attendance", label: "Attendance", icon: QrCode },
  { href: "/volunteerdashboard/certificates", label: "Certificates", icon: Award },
  { href: "/volunteerdashboard/profile", label: "Profile", icon: User },
  { href: "/volunteerdashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/blockchain", label: "Blockchain Explorer", icon: Cpu },
];

function decodeToken(token: string): { name?: string; email?: string } {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { name: payload.name, email: payload.email };
  } catch {
    return {};
  }
}

export default function VolunteerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [userName, setUserName] = useState("Volunteer");
  const [userInitial, setUserInitial] = useState("V");
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Decode name from JWT
    const decoded = decodeToken(token);
    if (decoded.name) {
      setUserName(decoded.name);
      setUserInitial(decoded.name.charAt(0).toUpperCase());
    }

    // Fetch notification count for the badge
    const fetchNotifCount = async () => {
      try {
        const res = await fetch("/api/volunteer/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const unread = (data.notifications || []).filter(
            (n: { read: boolean }) => !n.read,
          ).length;
          setNotifCount(unread);
        }
      } catch { /* ignore */ }
    };
    fetchNotifCount();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Brand */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center font-bold text-2xl border border-white/30">
                {userInitial}
              </div>
              <div>
                <h1 className="text-xl font-bold">{userName}</h1>
                <p className="text-blue-100 text-sm">Volunteer Portal</p>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 w-56"
                />
              </div>

              {/* Notifications */}
              <Link
                href="/volunteerdashboard/notifications"
                className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                {notifCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">
                    {notifCount > 9 ? "9+" : notifCount}
                  </span>
                )}
              </Link>

              {/* Profile */}
              <Link
                href="/volunteerdashboard/profile"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
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
                    isActive
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600" />
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
