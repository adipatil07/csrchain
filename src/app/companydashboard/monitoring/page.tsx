"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Activity, MapPin, AlertTriangle, Camera, Clock,
  CheckCircle2, Link2, Image as ImageIcon, Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface LiveProject {
  id: string; name: string; ngo: string; location: string;
  progress: number; currentMilestone: string; lastUpdate: string;
  health: "On Track" | "Delayed"; tx: string; sector: string;
}
interface Alert { level: "high" | "medium" | "low"; project: string; message: string }
interface Summary { activeProjects: number; onTrack: number; delayed: number; criticalAlerts: number }
interface GeoPhoto { label: string; coords: string }

// ─── Component ────────────────────────────────────────────────────────────────
export default function MonitoringPage() {
  const [liveProjects, setLiveProjects] = useState<LiveProject[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [summary, setSummary] = useState<Summary>({ activeProjects: 0, onTrack: 0, delayed: 0, criticalAlerts: 0 });
  const [geoPhotos, setGeoPhotos] = useState<GeoPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/company/monitoring", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setLiveProjects(json.liveProjects ?? []);
      setAlerts(json.alerts ?? []);
      setSummary(json.summary ?? { activeProjects: 0, onTrack: 0, delayed: 0, criticalAlerts: 0 });
      setGeoPhotos(json.geoPhotos ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#0ea5e9]" />
      </div>
    );
  }

  const summaryCards = [
    { label: "Active Projects", value: summary.activeProjects, icon: Activity, color: "text-[#0ea5e9]" },
    { label: "On Track", value: summary.onTrack, icon: CheckCircle2, color: "text-[#10b981]" },
    { label: "Delayed", value: summary.delayed, icon: Clock, color: "text-[#f59e0b]" },
    { label: "Critical Alerts", value: summary.criticalAlerts, icon: AlertTriangle, color: "text-[#ef4444]" },
  ];

  // Map pin positions (relative approximations for India map)
  const mapPins = liveProjects.slice(0, 5).map((p, i) => {
    const positions = [
      { top: "35%", left: "55%" }, { top: "60%", left: "38%" },
      { top: "42%", left: "28%" }, { top: "38%", left: "48%" },
      { top: "70%", left: "38%" },
    ];
    return { ...positions[i], label: p.location.split(",")[0] };
  });

  return (
    <>
      <div className="bg-white border-b border-[#e5e7eb] px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#1a2847]">Project Monitoring</h2>
            <p className="text-[#64748b] text-sm mt-1">Real-time tracking of approved CSR projects.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ecfeff] border border-[#06b6d4]/30">
            <div className="w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse"></div>
            <span className="text-xs font-semibold text-[#0e7490]">Live Updates</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {summaryCards.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5e7eb] flex items-center justify-between">
              <div>
                <p className="text-[#64748b] text-sm">{s.label}</p>
                <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              </div>
              <s.icon className={`w-8 h-8 ${s.color}`} />
            </div>
          ))}
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
            <h3 className="text-lg font-bold text-[#1a2847] mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#f59e0b]" /> Active Alerts
            </h3>
            <div className="space-y-2">
              {alerts.map((a, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    a.level === "high" ? "bg-[#fee2e2] border-[#fecaca]" :
                    a.level === "medium" ? "bg-[#fef3c7] border-[#fde68a]" :
                    "bg-[#e0f2fe] border-[#bae6fd]"
                  }`}
                >
                  <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    a.level === "high" ? "text-[#dc2626]" :
                    a.level === "medium" ? "text-[#d97706]" : "text-[#0284c7]"
                  }`} />
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-[#1a2847]">{a.project}</p>
                    <p className="text-xs text-[#475569] mt-0.5">{a.message}</p>
                  </div>
                  <button className="text-xs px-3 py-1 bg-white border border-[#e5e7eb] rounded-lg hover:bg-[#f8fafc] text-[#1a2847]">
                    Investigate
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
            <h3 className="text-lg font-bold text-[#1a2847] mb-4">Project Map — India</h3>
            <div className="relative h-[400px] rounded-xl overflow-hidden bg-gradient-to-br from-[#0f1c3f] via-[#1a2847] to-[#0f1c3f] border border-[#2d3f6b]">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_40%,#06b6d4_0%,transparent_40%),radial-gradient(circle_at_70%_60%,#0ea5e9_0%,transparent_40%)]"></div>
              {mapPins.map((p, i) => (
                <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 group" style={{ top: p.top, left: p.left }}>
                  <div className="relative">
                    <div className="absolute inset-0 w-6 h-6 rounded-full bg-[#06b6d4] animate-ping opacity-50"></div>
                    <div className="relative w-6 h-6 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] border-2 border-white flex items-center justify-center shadow-lg">
                      <MapPin className="w-3 h-3 text-white" />
                    </div>
                    <div className="absolute top-7 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap bg-[#0f1c3f]/90 px-2 py-0.5 rounded">
                      {p.label}
                    </div>
                  </div>
                </div>
              ))}
              {liveProjects.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-[#7e9bc9] text-sm">
                  Approve projects to see map markers
                </div>
              )}
              <div className="absolute bottom-4 left-4 text-xs text-[#7e9bc9]">
                Project locations derived from allocation data • {liveProjects.length} active site{liveProjects.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          {/* Geo photos */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
            <h3 className="text-lg font-bold text-[#1a2847] mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#06b6d4]" /> Latest Geo-tagged Photos
            </h3>
            {geoPhotos.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-[#94a3b8] text-sm text-center">
                Photos will appear as NGOs submit milestone proofs
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {geoPhotos.map((p, i) => (
                  <div key={i} className="relative rounded-lg overflow-hidden aspect-square bg-gradient-to-br from-[#0ea5e9]/20 to-[#06b6d4]/10 border border-[#e5e7eb] flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-[#06b6d4]/50" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <p className="text-[10px] text-white font-semibold truncate">{p.label}</p>
                      <p className="text-[9px] text-white/70 font-mono">{p.coords}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live projects list */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
          <h3 className="text-lg font-bold text-[#1a2847] mb-4">Live Project Status</h3>
          {liveProjects.length === 0 ? (
            <div className="text-center py-12 text-[#64748b] text-sm">
              No active projects yet. Approve proposals to start monitoring.
            </div>
          ) : (
            <div className="space-y-4">
              {liveProjects.map((p) => (
                <div key={p.id} className="p-4 border border-[#e5e7eb] rounded-xl hover:bg-[#f8fafc] transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-[#1a2847]">{p.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          p.health === "On Track" ? "bg-[#d1fae5] text-[#065f46]" : "bg-[#fee2e2] text-[#991b1b]"
                        }`}>{p.health}</span>
                      </div>
                      <p className="text-xs text-[#64748b] flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {p.location} • {p.ngo}
                      </p>
                      <p className="text-xs text-[#0e7490] font-mono mt-1 flex items-center gap-1">
                        <Link2 className="w-3 h-3" /> {p.tx}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#64748b]">Last update</p>
                      <p className="text-sm font-semibold text-[#1a2847]">{p.lastUpdate}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#475569] mb-2">
                    Current milestone: <span className="font-semibold text-[#1a2847]">{p.currentMilestone}</span>
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-[#e5e7eb] rounded-full h-2">
                      <div className="bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] h-2 rounded-full" style={{ width: `${p.progress}%` }}></div>
                    </div>
                    <span className="text-sm font-bold text-[#1a2847] w-10 text-right">{p.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
