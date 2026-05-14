"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Users, Award, Clock, Shield, UserPlus, Search, Trophy, MapPin, Loader2 } from 'lucide-react';

interface Volunteer {
  id: string; name: string; initials: string; skills: string[];
  hours: number; projects: number; attestations: number; location: string | null;
}

interface Stats {
  total: number; activeThisMonth: number; totalHours: string; totalAttestations: number;
}

const GRADIENT_COLORS = [
  'from-pink-500 to-rose-500', 'from-blue-500 to-cyan-500', 'from-purple-500 to-indigo-500',
  'from-amber-500 to-orange-500', 'from-green-500 to-emerald-500', 'from-cyan-500 to-teal-500',
  'from-red-500 to-pink-500', 'from-indigo-500 to-blue-500',
];

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, activeThisMonth: 0, totalHours: '0', totalAttestations: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [q, setQ] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchVolunteers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ngo/volunteers', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setVolunteers(data.volunteers || []);
      if (data.stats) setStats(data.stats);
    } catch {
      console.error('Failed to load volunteers');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchVolunteers(); }, [fetchVolunteers]);

  const allSkills = ['All', ...Array.from(new Set(volunteers.flatMap(v => v.skills)))];

  const filtered = volunteers.filter(v =>
    (filter === 'All' || v.skills.includes(filter)) &&
    (q === '' || v.name.toLowerCase().includes(q.toLowerCase()))
  );

  const leaderboard = [...volunteers].sort((a, b) => b.hours - a.hours).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Volunteers', value: stats.total.toString(), icon: Users, color: 'from-blue-600 to-blue-700' },
          { label: 'Active This Month', value: stats.activeThisMonth.toString(), icon: Clock, color: 'from-cyan-500 to-blue-500' },
          { label: 'Total Hours', value: stats.totalHours, icon: Award, color: 'from-purple-500 to-pink-500' },
          { label: 'On-chain Attestations', value: stats.totalAttestations.toString(), icon: Shield, color: 'from-green-500 to-emerald-600' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={`bg-gradient-to-br ${s.color} rounded-2xl shadow-lg p-6 text-white`}>
              <Icon size={22} className="mb-3 opacity-80" />
              <p className="text-sm opacity-90">{s.label}</p>
              <p className="text-3xl font-bold mt-1">{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Volunteer Directory */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold text-slate-900">Volunteer Directory</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search..."
                  className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-sm font-medium hover:shadow-lg">
                <UserPlus size={16} /> Invite
              </button>
            </div>
          </div>

          {allSkills.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {allSkills.map(s => (
                <button key={s} onClick={() => setFilter(s)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${filter === s ? 'bg-blue-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 size={32} className="animate-spin text-blue-600" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Users size={48} className="mx-auto mb-4 opacity-30" />
              <p className="font-medium">No volunteers yet</p>
              <p className="text-sm mt-2">Volunteers will appear here once they apply and are accepted to your projects.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((v, idx) => (
                <div key={v.id} className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-100 hover:shadow-md transition">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${GRADIENT_COLORS[idx % GRADIENT_COLORS.length]} flex items-center justify-center text-white font-bold shadow-lg`}>
                      {v.initials}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{v.name}</h4>
                      {v.location && (
                        <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={11} />{v.location}</p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {v.skills.map(s => (
                          <span key={s} className="text-xs bg-white border border-blue-200 text-blue-700 px-2 py-0.5 rounded-md">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200">
                    <div><p className="text-xs text-slate-500">Hours</p><p className="font-bold text-slate-900">{v.hours}</p></div>
                    <div><p className="text-xs text-slate-500">Projects</p><p className="font-bold text-slate-900">{v.projects}</p></div>
                    <div>
                      <p className="text-xs text-slate-500 flex items-center gap-0.5"><Shield size={10} />Attest.</p>
                      <p className="font-bold text-blue-600">{v.attestations}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 text-xs py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 font-medium">View</button>
                    <button className="flex-1 text-xs py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow">Assign</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-900 rounded-2xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-bold mb-5 flex items-center gap-2"><Trophy className="text-yellow-400" size={20} /> Top Contributors</h3>
          {leaderboard.length === 0 ? (
            <p className="text-blue-200 text-sm text-center py-8">No volunteers yet.</p>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((v, idx) => (
                <div key={v.id} className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl p-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${idx === 0 ? 'bg-yellow-400 text-yellow-900' : idx === 1 ? 'bg-slate-300 text-slate-800' : idx === 2 ? 'bg-orange-400 text-orange-900' : 'bg-white/20 text-white'}`}>
                    {idx + 1}
                  </div>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${GRADIENT_COLORS[idx % GRADIENT_COLORS.length]} flex items-center justify-center font-bold text-sm`}>
                    {v.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{v.name}</p>
                    <p className="text-xs text-blue-200">{v.hours} hrs · {v.attestations} attestations</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 p-4 bg-white/10 rounded-xl backdrop-blur">
            <div className="flex items-center gap-2 text-cyan-300 text-xs uppercase tracking-wider"><Shield size={12} />On-chain Verified</div>
            <p className="text-xs text-blue-100 mt-2">All volunteer hours are signed by NGO admin and logged as on-chain attestations, creating a tamper-proof contribution record.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
