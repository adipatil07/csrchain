"use client";

import React, { useState } from "react";
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
} from "lucide-react";

const attendanceHistory = [
  {
    event: "Community Clean-Up Drive",
    ngo: "Green Earth Foundation",
    date: "2026-04-02",
    checkIn: "09:05 AM",
    checkOut: "01:15 PM",
    hours: 4.2,
    geo: "19.0760, 72.8777",
    tx: "0x7a8f3b12e9c4d5678a9b0c1d2e3f4a5b6c7d8e9f",
  },
  {
    event: "Teaching Session - Dharavi",
    ngo: "Education First India",
    date: "2026-03-28",
    checkIn: "02:00 PM",
    checkOut: "05:00 PM",
    hours: 3.0,
    geo: "19.0430, 72.8570",
    tx: "0x4d1e9c7f3a2b5c8d1e4f7a9b2c5d8e1f4a7b0c3d",
  },
  {
    event: "Food Distribution",
    ngo: "Hope Foundation",
    date: "2026-03-20",
    checkIn: "11:00 AM",
    checkOut: "04:30 PM",
    hours: 5.5,
    geo: "19.1197, 72.8468",
    tx: "0x2b5a8d4e1c9f3a6b8d2e5c8f1a4b7d0e3c6f9a2b",
  },
  {
    event: "Tree Plantation",
    ngo: "Coastal Care India",
    date: "2026-03-12",
    checkIn: "07:30 AM",
    checkOut: "11:00 AM",
    hours: 3.5,
    geo: "19.0896, 72.8656",
    tx: "0x9f3a6b8d2e5c8f1a4b7d0e3c6f9a2b5d8e1f4a7b",
  },
];

export default function AttendancePage() {
  const [checkedIn, setCheckedIn] = useState(false);
  const totalHours = attendanceHistory.reduce((a, b) => a + b.hours, 0);

  const truncate = (s: string) => `${s.slice(0, 6)}...${s.slice(-4)}`;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Verified Hours</p>
              <p className="text-2xl font-bold text-gray-800">{totalHours.toFixed(1)}h</p>
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
              <p className="text-2xl font-bold text-gray-800">{attendanceHistory.length}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Last 60 days</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Attestation Rate</p>
              <p className="text-2xl font-bold text-gray-800">100%</p>
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
              {/* Simulated QR pattern */}
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
              Show this QR to event coordinator. Location and timestamp will be signed
              and pushed on-chain.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs bg-white/10 rounded-lg p-2 border border-white/20">
              <Shield className="w-3 h-3" />
              <span>EIP-712 signed attestation</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Current Event</h2>
          <div className="border-2 border-blue-200 rounded-xl p-5 bg-blue-50/40">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  Versova Beach Cleanup
                </h3>
                <p className="text-sm text-gray-600">Coastal Care India</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                LIVE
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Today, 2026-04-07
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Versova Beach, Mumbai
              </div>
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4" />
                {checkedIn ? "Checked in at 09:05 AM" : "Not checked in"}
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <MapPin className="w-4 h-4" />
                GPS: 19.1310, 72.8150 (±8m)
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCheckedIn(true)}
                disabled={checkedIn}
                className={`flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${
                  checkedIn
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
                }`}
              >
                <LogIn className="w-4 h-4" />
                Check In
              </button>
              <button
                onClick={() => setCheckedIn(false)}
                disabled={!checkedIn}
                className={`flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${
                  !checkedIn
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
                }`}
              >
                <LogOut className="w-4 h-4" />
                Check Out
              </button>
            </div>
            {checkedIn && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <p className="text-xs text-green-700 font-medium">
                  Check-in attestation submitted. Tx pending confirmation...
                </p>
              </div>
            )}
          </div>
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
            <span className="text-xs font-semibold text-blue-700">
              Blockchain Verified
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Event
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Check-In
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Check-Out
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Geo
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Hours
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Tx Hash
                </th>
              </tr>
            </thead>
            <tbody>
              {attendanceHistory.map((r, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">
                    <p className="font-medium text-gray-800">{r.event}</p>
                    <p className="text-xs text-gray-500">{r.ngo}</p>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{r.date}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{r.checkIn}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{r.checkOut}</td>
                  <td className="py-3 px-4 text-xs text-gray-600 font-mono">{r.geo}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-gray-800">
                    {r.hours}h
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-mono border border-blue-100">
                      <Link2 className="w-3 h-3" />
                      {truncate(r.tx)}
                      <Copy className="w-3 h-3 ml-1 opacity-60" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
