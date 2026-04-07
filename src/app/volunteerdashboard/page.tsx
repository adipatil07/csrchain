"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Award,
  MapPin,
  Users,
  CheckCircle,
  Star,
  TrendingUp,
  Shield,
  Link2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const stats = [
  { label: "Hours Contributed", value: "156", trend: "+12%", icon: Clock, color: "from-blue-500 to-cyan-500" },
  { label: "Projects Joined", value: "8", trend: "+2", icon: CheckCircle, color: "from-purple-500 to-pink-500" },
  { label: "Certificates Earned", value: "5", trend: "New", icon: Award, color: "from-orange-500 to-red-500" },
  { label: "Volunteer Rating", value: "4.8", trend: "Top 5%", icon: Star, color: "from-green-500 to-teal-500" },
];

const upcomingEvents = [
  { id: 1, title: "Community Clean-Up Drive", ngo: "Green Earth Foundation", date: "2026-04-12", time: "09:00 AM", location: "Marine Drive, Mumbai", status: "Accepted", hours: 4 },
  { id: 2, title: "Teaching Session for Underprivileged", ngo: "Education First India", date: "2026-04-15", time: "02:00 PM", location: "Dharavi Community Center", status: "Accepted", hours: 3 },
  { id: 3, title: "Food Distribution Program", ngo: "Hope Foundation", date: "2026-04-18", time: "11:00 AM", location: "Andheri West, Mumbai", status: "Applied", hours: 5 },
];

const hoursTrend = [
  { month: "Nov", hours: 12 },
  { month: "Dec", hours: 18 },
  { month: "Jan", hours: 22 },
  { month: "Feb", hours: 28 },
  { month: "Mar", hours: 34 },
  { month: "Apr", hours: 42 },
];

const causeBreakdown = [
  { name: "Education", value: 42, color: "#2563eb" },
  { name: "Environment", value: 35, color: "#06b6d4" },
  { name: "Healthcare", value: 22, color: "#8b5cf6" },
  { name: "Food Relief", value: 18, color: "#f59e0b" },
];

export default function VolunteerDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 rounded-xl shadow-sm p-6 text-white flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Welcome back, Aarav</h2>
          <p className="text-blue-100 text-sm">
            You have 2 events this week and 1 pending application. Keep making an impact.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
          <Shield className="w-4 h-4" />
          <span className="text-xs font-semibold">Polygon Verified Volunteer</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-green-600">{stat.trend}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Impact Hours Trend</h2>
              <p className="text-sm text-gray-500">Verified on-chain volunteering hours</p>
            </div>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={hoursTrend}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="#2563eb"
                strokeWidth={2}
                fill="url(#colorHours)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Causes Supported</h2>
          <p className="text-sm text-gray-500 mb-2">Hours distribution</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={causeBreakdown}
                dataKey="value"
                nameKey="name"
                innerRadius={45}
                outerRadius={80}
                paddingAngle={3}
              >
                {causeBreakdown.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Legend iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming events */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Upcoming Events</h2>
          <Link
            href="/volunteerdashboard/projects"
            className="text-blue-600 text-sm font-semibold hover:text-blue-700"
          >
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{event.ngo}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    event.status === "Accepted"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {event.status}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-600">{event.hours} hours</span>
                <Link
                  href="/volunteerdashboard/projects"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity + Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { action: "Completed", project: "Food Distribution Drive", date: "2 days ago", icon: CheckCircle, color: "text-green-500", tx: "0x7a8f...9e2c" },
              { action: "Joined", project: "Beach Cleanup Initiative", date: "5 days ago", icon: Users, color: "text-blue-500", tx: "0x4d1e...7f3a" },
              { action: "Certificate Issued", project: "Teaching Program", date: "1 week ago", icon: Award, color: "text-purple-500", tx: "0x2b5a...4e1c" },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <activity.icon className={`w-5 h-5 ${activity.color}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {activity.action}: {activity.project}
                  </p>
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-mono">
                  <Link2 className="w-3 h-3" />
                  {activity.tx}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-sm p-6 text-white">
          <h2 className="text-xl font-bold mb-2">Your Impact</h2>
          <p className="text-blue-100 mb-4 text-sm">
            You are making a measurable difference across India.
          </p>
          <div className="space-y-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Lives Impacted</span>
                <span className="text-2xl font-bold">234</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2" style={{ width: "78%" }}></div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Next Badge: Community Hero</span>
                <span className="text-sm font-semibold">45h to go</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2" style={{ width: "65%" }}></div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center gap-3">
              <Shield className="w-5 h-5" />
              <div className="text-xs">
                All activity cryptographically anchored on Polygon for lifetime
                verifiability.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
