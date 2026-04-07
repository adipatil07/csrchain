"use client";

import React, { useState } from 'react';
import { Users, Award, Clock, Shield, UserPlus, Search, Trophy, MapPin } from 'lucide-react';

interface Volunteer {
  id: number; name: string; initials: string; skills: string[]; hours: number; projects: number; attestations: number; location: string; color: string;
}

const volunteers: Volunteer[] = [
  { id: 1, name: 'Priya Sharma', initials: 'PS', skills: ['Teaching', 'Content'], hours: 320, projects: 5, attestations: 18, location: 'Mumbai', color: 'from-pink-500 to-rose-500' },
  { id: 2, name: 'Rahul Verma', initials: 'RV', skills: ['Medical', 'First Aid'], hours: 280, projects: 4, attestations: 15, location: 'Delhi', color: 'from-blue-500 to-cyan-500' },
  { id: 3, name: 'Anjali Desai', initials: 'AD', skills: ['Fundraising', 'Events'], hours: 410, projects: 7, attestations: 24, location: 'Pune', color: 'from-purple-500 to-indigo-500' },
  { id: 4, name: 'Vikram Singh', initials: 'VS', skills: ['Construction', 'Logistics'], hours: 195, projects: 3, attestations: 11, location: 'Jaipur', color: 'from-amber-500 to-orange-500' },
  { id: 5, name: 'Meera Iyer', initials: 'MI', skills: ['Counseling', 'Teaching'], hours: 360, projects: 6, attestations: 21, location: 'Bengaluru', color: 'from-green-500 to-emerald-500' },
  { id: 6, name: 'Arjun Patel', initials: 'AP', skills: ['Photography', 'Media'], hours: 150, projects: 4, attestations: 9, location: 'Ahmedabad', color: 'from-cyan-500 to-teal-500' },
  { id: 7, name: 'Kavya Reddy', initials: 'KR', skills: ['Legal', 'Advocacy'], hours: 240, projects: 3, attestations: 13, location: 'Hyderabad', color: 'from-red-500 to-pink-500' },
  { id: 8, name: 'Sameer Khan', initials: 'SK', skills: ['Tech', 'Training'], hours: 300, projects: 5, attestations: 16, location: 'Mumbai', color: 'from-indigo-500 to-blue-500' },
];

const allSkills = ['All', 'Teaching', 'Medical', 'Fundraising', 'Construction', 'Counseling', 'Photography', 'Legal', 'Tech'];

export default function VolunteersPage() {
  const [filter, setFilter] = useState('All');
  const [q, setQ] = useState('');

  const filtered = volunteers.filter(v =>
    (filter === 'All' || v.skills.includes(filter)) &&
    (q === '' || v.name.toLowerCase().includes(q.toLowerCase()))
  );

  const leaderboard = [...volunteers].sort((a, b) => b.hours - a.hours).slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Volunteers', value: '148', icon: Users, color: 'from-blue-600 to-blue-700' },
          { label: 'Active This Month', value: '92', icon: Clock, color: 'from-cyan-500 to-blue-500' },
          { label: 'Total Hours', value: '12,480', icon: Award, color: 'from-purple-500 to-pink-500' },
          { label: 'On-chain Attestations', value: '847', icon: Shield, color: 'from-green-500 to-emerald-600' },
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
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold text-slate-900">Volunteer Directory</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search..." className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-sm font-medium hover:shadow-lg">
                <UserPlus size={16} /> Invite
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {allSkills.map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${filter === s ? 'bg-blue-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{s}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(v => (
              <div key={v.id} className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-100 hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center text-white font-bold shadow-lg`}>{v.initials}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{v.name}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={11} />{v.location}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {v.skills.map(s => (
                        <span key={s} className="text-xs bg-white border border-blue-200 text-blue-700 px-2 py-0.5 rounded-md">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200">
                  <div>
                    <p className="text-xs text-slate-500">Hours</p>
                    <p className="font-bold text-slate-900">{v.hours}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Projects</p>
                    <p className="font-bold text-slate-900">{v.projects}</p>
                  </div>
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
        </div>

        <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-900 rounded-2xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-bold mb-5 flex items-center gap-2"><Trophy className="text-yellow-400" size={20} /> Top Contributors</h3>
          <div className="space-y-3">
            {leaderboard.map((v, idx) => (
              <div key={v.id} className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl p-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${idx === 0 ? 'bg-yellow-400 text-yellow-900' : idx === 1 ? 'bg-slate-300 text-slate-800' : idx === 2 ? 'bg-orange-400 text-orange-900' : 'bg-white/20 text-white'}`}>
                  {idx + 1}
                </div>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${v.color} flex items-center justify-center font-bold text-sm`}>{v.initials}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{v.name}</p>
                  <p className="text-xs text-blue-200">{v.hours} hrs · {v.attestations} attestations</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-white/10 rounded-xl backdrop-blur">
            <div className="flex items-center gap-2 text-cyan-300 text-xs uppercase tracking-wider"><Shield size={12} />On-chain Verified</div>
            <p className="text-xs text-blue-100 mt-2">All volunteer hours are signed by NGO admin and logged as on-chain attestations, creating a tamper-proof contribution record.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
