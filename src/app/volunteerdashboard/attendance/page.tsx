"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  QrCode,
  MapPin,
  Clock,
  CheckCircle,
  Shield,
  Link2,
  Calendar,
  Timer,
  LogIn,
  LogOut,
  Copy,
  Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AttendRecord {
  id: string;
  event: string;
  ngo: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  hours: number;
  geo: string;
  tx: string | null;
  isActive: boolean;
}

interface AttendStats {
  totalHours: number;
  eventsAttended: number;
  attestationRate: number;
}

interface ActiveCheckIn {
  id: string;
  event: string;
  ngo: string;
  location: string;
  checkIn: string;
  geo: string;
}

interface AttendData {
  history: AttendRecord[];
  stats: AttendStats;
  activeCheckIn: ActiveCheckIn | null;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AttendancePage() {
  const [data, setData] = useState<AttendData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/volunteer/attendance", {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  const handleCheckIn = async () => {
    // For demo: use the first accepted project from local state or prompt
    const projectId = prompt("Enter Project ID to check in:");
    if (!projectId) return;

    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const geo =
        await new Promise<string>((resolve) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`),
              () => resolve(""),
            );
          } else {
            resolve("");
          }
        });

      const res = await fetch("/api/volunteer/attendance", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId, geoHash: geo }),
      });
      const json = await res.json();
      if (res.ok || res.status === 200 || res.status === 201) {
        showToast("Check-in recorded! Attestation submitted.");
        fetchData();
      } else {
        showToast(json.message ?? "Check-in failed");
      }
    } catch {
      showToast("Network error. Try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async (id: string) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/volunteer/attendance/${id}/checkout`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.ok) {
        showToast(`Checked out! Hours: ${json.attendance.hours}h recorded on-chain.`);
        fetchData();
      } else {
        showToast(json.message ?? "Check-out failed");
      }
    } catch {
      showToast("Network error. Try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const copyTx = (tx: string) => {
    navigator.clipboard.writeText(tx);
    setCopied(tx);
    setTimeout(() => setCopied(null), 2000);
  };

  const truncate = (s: string) => `${s.slice(0, 6)}...${s.slice(-4)}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const stats = data?.stats ?? { totalHours: 0, eventsAttended: 0, attestationRate: 0 };
  const history = data?.history ?? [];
  const active = data?.activeCheckIn;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-blue-700 text-white px-5 py-3 rounded-xl shadow-lg font-semibold">
          {toast}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Verified Hours</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalHours}h</p>
            </div>
          </div>
          <p className="text-xs text-green-600 font-semibold">All on-chain attested</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Events Attended</p>
              <p className="text-2xl font-bold text-gray-800">{stats.eventsAttended}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Total completed sessions</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Attestation Rate</p>
              <p className="text-2xl font-bold text-gray-800">{stats.attestationRate}%</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Polygon Mumbai testnet</p>
        </div>
      </div>

      {/* QR + Active event */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-sm p-8 text-white">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-48 h-48 bg-white rounded-2xl mb-4 p-4">
              <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-0.5">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div
                    key={i}
                    className={
                      (i * 7 + 13) % 3 === 0 || i < 3 || i > 60 || i % 9 === 0
                        ? "bg-blue-700"
                        : "bg-white"
                    }
                  />
                ))}
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Scan to Check-In</h2>
            <p className="text-blue-100 mb-4 text-sm">
              Show this QR to event coordinator. Location and timestamp will be signed and pushed
              on-chain.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs bg-white/10 rounded-lg p-2 border border-white/20">
              <Shield className="w-3 h-3" />
              <span>EIP-712 signed attestation</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {active ? "Active Event" : "Current Event"}
          </h2>
          {active ? (
            <div className="border-2 border-blue-200 rounded-xl p-5 bg-blue-50/40">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{active.event}</h3>
                  <p className="text-sm text-gray-600">{active.ngo}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                  LIVE
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date().toLocaleDateString("en-IN")}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {active.location}
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  Checked in at {active.checkIn}
                </div>
                {active.geo && (
                  <div className="flex items-center gap-2 text-blue-700">
                    <MapPin className="w-4 h-4" />
                    GPS: {active.geo}
                  </div>
                )}
              </div>
              <button
                onClick={() => handleCheckOut(active.id)}
                disabled={actionLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all"
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                Check Out
              </button>
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <p className="text-xs text-green-700 font-medium">
                  Check-in attestation submitted. Tx pending confirmation...
                </p>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
              <QrCode className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm mb-4">No active check-in</p>
              <button
                onClick={handleCheckIn}
                disabled={actionLoading}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 mx-auto"
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                Check In to Project
              </button>
            </div>
          )}
        </div>
      </div>

      {/* History table */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Attendance History</h2>
            <p className="text-sm text-gray-500">
              Every record is anchored to Polygon for tamper-proof verification
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700">Blockchain Verified</span>
          </div>
        </div>
        {history.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Clock className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No attendance records yet. Join a project and check in!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Event</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Check-In</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Check-Out</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Geo</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Hours</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tx Hash</th>
                </tr>
              </thead>
              <tbody>
                {history.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">
                      <p className="font-medium text-gray-800">{r.event}</p>
                      <p className="text-xs text-gray-500">{r.ngo}</p>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{r.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{r.checkIn}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {r.checkOut ?? (
                        <span className="text-yellow-600 font-semibold">Active</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-600 font-mono">{r.geo}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-800">{r.hours}h</td>
                    <td className="py-3 px-4">
                      {r.tx ? (
                        <button
                          onClick={() => copyTx(r.tx!)}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-mono border border-blue-100 hover:bg-blue-100"
                        >
                          <Link2 className="w-3 h-3" />
                          {truncate(r.tx)}
                          <Copy className={`w-3 h-3 ml-1 ${copied === r.tx ? "text-green-600" : "opacity-60"}`} />
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
