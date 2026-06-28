"use client";

import React, { useCallback, useEffect, useState } from "react";
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

// ─── Types ────────────────────────────────────────────────────────────────────
interface Stats {
  totalHours: number;
  projectsJoined: number;
  certificatesCount: number;
  upcomingCount: number;
}

interface UpcomingEvent {
  id: string;
  title: string;
  ngo: string;
  date: string;
  location: string;
  status: string;
  hours: number;
}

interface HoursPoint {
  month: string;
  hours: number;
}

interface CauseSlice {
  name: string;
  value: number;
  color: string;
}

interface Activity {
  action: string;
  project: string;
  date: string;
  tx: string;
  type: string;
}

interface Trends {
  hours: string;
  projects: string;
  certificates: string;
  upcoming: string;
}

interface DashData {
  name: string;
  stats: Stats;
  trends: Trends;
  upcomingEvents: UpcomingEvent[];
  hoursTrend: HoursPoint[];
  causeBreakdown: CauseSlice[];
  recentActivity: Activity[];
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function VolunteerDashboardPage() {
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/volunteer/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load dashboard");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Hours Contributed",
      value: data?.stats.totalHours ?? 0,
      trend: data?.trends.hours ?? "—",
      icon: Clock,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Projects Joined",
      value: data?.stats.projectsJoined ?? 0,
      trend: data?.trends.projects ?? "—",
      icon: CheckCircle,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Certificates Earned",
      value: data?.stats.certificatesCount ?? 0,
      trend: data?.trends.certificates ?? "—",
      icon: Award,
      color: "from-orange-500 to-red-500",
    },
    {
      label: "Upcoming Events",
      value: data?.stats.upcomingCount ?? 0,
      trend: data?.trends.upcoming ?? "—",
      icon: Star,
      color: "from-green-500 to-teal-500",
    },
  ];

  const hoursTrend = data?.hoursTrend ?? [];
  const causeBreakdown = data?.causeBreakdown ?? [];
  const upcomingEvents = data?.upcomingEvents ?? [];
  const recentActivity = data?.recentActivity ?? [];
  const name = data?.name ?? "Volunteer";

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 rounded-xl shadow-sm p-6 text-white flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Welcome back, {name.split(" ")[0]}</h2>
          <p className="text-blue-100 text-sm">
            {data?.stats.upcomingCount
              ? `You have ${data.stats.upcomingCount} upcoming event${data.stats.upcomingCount !== 1 ? "s" : ""}. Keep making an impact.`
              : "Browse projects and start making an impact today."}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
          <Shield className="w-4 h-4" />
          <span className="text-xs font-semibold">Polygon Verified Volunteer</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
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
          {hoursTrend.length > 0 ? (
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
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
              No attendance data yet. Join a project to start tracking hours.
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Causes Supported</h2>
          <p className="text-sm text-gray-500 mb-2">Hours distribution</p>
          {causeBreakdown.length > 0 ? (
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
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm text-center">
              Attend events to see cause breakdown
            </div>
          )}
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
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Users className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No upcoming events. Browse projects to apply.</p>
          </div>
        ) : (
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
                  <span className="text-sm text-gray-600">~{event.hours} hours</span>
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
        )}
      </div>

      {/* Activity + Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No activity yet. Start volunteering to see your timeline.
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle
                    className={`w-5 h-5 ${
                      activity.type === "certificate"
                        ? "text-purple-500"
                        : activity.action === "Completed"
                          ? "text-green-500"
                          : "text-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {activity.action}: {activity.project}
                    </p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                  {activity.tx && activity.tx !== "pending" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-mono">
                      <Link2 className="w-3 h-3" />
                      {activity.tx.length > 12
                        ? `${activity.tx.slice(0, 6)}...${activity.tx.slice(-4)}`
                        : activity.tx}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-400 rounded text-xs">
                      Pending
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-sm p-6 text-white">
          <h2 className="text-xl font-bold mb-2">Your Impact</h2>
          <p className="text-blue-100 mb-4 text-sm">
            You are making a measurable difference.
          </p>
          <div className="space-y-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Total Hours Volunteered</span>
                <span className="text-2xl font-bold">{data?.stats.totalHours ?? 0}h</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2"
                  style={{
                    width: `${Math.min(((data?.stats.totalHours ?? 0) / 200) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Next Badge: Community Hero</span>
                <span className="text-sm font-semibold">
                  {Math.max(0, 100 - (data?.stats.totalHours ?? 0))}h to go
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2"
                  style={{
                    width: `${Math.min(((data?.stats.totalHours ?? 0) / 100) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center gap-3">
              <Shield className="w-5 h-5" />
              <div className="text-xs">
                All activity cryptographically anchored on Polygon for lifetime verifiability.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
