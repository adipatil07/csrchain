"use client";

import React, { useState } from 'react';
import { MapPin, Calendar, Link2, Wallet, Users, Target, Activity, CheckCircle2 } from 'lucide-react';

type Lane = 'Planning' | 'In Progress' | 'Review' | 'Completed';

interface Project {
  id: string;
  name: string;
  partner: string;
  sector: string;
  location: string;
  progress: number;
  currentMilestone: string;
  escrow: string;
  totalBudget: string;
  startDate: string;
  endDate: string;
  lane: Lane;
  txHash: string;
  beneficiaries: number;
}

const projects: Project[] = [
  { id: 'PRJ-041', name: 'Rural Education Program', partner: 'Tata CSR Foundation', sector: 'Education', location: 'Nashik, MH', progress: 75, currentMilestone: 'Phase 2 - Teacher Training', escrow: '₹11,25,000', totalBudget: '₹45,00,000', startDate: '12 Jan 2026', endDate: '30 Sep 2026', lane: 'In Progress', txHash: '0x4a2e...7d1c', beneficiaries: 1450 },
  { id: 'PRJ-039', name: 'Healthcare Initiative Delhi', partner: 'Reliance Foundation', sector: 'Healthcare', location: 'Delhi NCR', progress: 45, currentMilestone: 'Equipment Installation', escrow: '₹17,60,000', totalBudget: '₹32,00,000', startDate: '05 Feb 2026', endDate: '15 Nov 2026', lane: 'In Progress', txHash: '0x8b1f...c34a', beneficiaries: 8200 },
  { id: 'PRJ-038', name: 'Clean Water Mumbai', partner: 'Infosys Foundation', sector: 'Environment', location: 'Mumbai, MH', progress: 90, currentMilestone: 'Final Audit', escrow: '₹2,80,000', totalBudget: '₹28,00,000', startDate: '20 Nov 2025', endDate: '10 Apr 2026', lane: 'Review', txHash: '0x6c9d...b12e', beneficiaries: 3100 },
  { id: 'PRJ-037', name: 'Skill Development Pune', partner: 'Mahindra Rise', sector: 'Livelihood', location: 'Pune, MH', progress: 30, currentMilestone: 'Curriculum Setup', escrow: '₹35,70,000', totalBudget: '₹51,00,000', startDate: '01 Mar 2026', endDate: '28 Feb 2027', lane: 'Planning', txHash: '0x2f7a...9e5b', beneficiaries: 650 },
  { id: 'PRJ-035', name: 'Solar Lighting Villages', partner: 'Adani Foundation', sector: 'Environment', location: 'Kutch, GJ', progress: 100, currentMilestone: 'Closed', escrow: '₹0', totalBudget: '₹22,00,000', startDate: '05 Jul 2025', endDate: '15 Feb 2026', lane: 'Completed', txHash: '0x91ab...4f2c', beneficiaries: 2800 },
  { id: 'PRJ-034', name: 'Girl Child Nutrition', partner: 'ITC Mission Sunehra Kal', sector: 'Healthcare', location: 'Jaipur, RJ', progress: 60, currentMilestone: 'Mid-term Assessment', escrow: '₹9,80,000', totalBudget: '₹24,50,000', startDate: '10 Dec 2025', endDate: '10 Aug 2026', lane: 'In Progress', txHash: '0x55df...01ba', beneficiaries: 1800 },
];

const lanes: { key: Lane; color: string; bg: string }[] = [
  { key: 'Planning', color: 'from-slate-500 to-slate-600', bg: 'bg-slate-50' },
  { key: 'In Progress', color: 'from-blue-600 to-cyan-600', bg: 'bg-blue-50/60' },
  { key: 'Review', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50/60' },
  { key: 'Completed', color: 'from-green-500 to-emerald-600', bg: 'bg-green-50/60' },
];

export default function StatusPage() {
  const [selected, setSelected] = useState<Project | null>(projects[0]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Active', value: '12', icon: Activity, color: 'from-blue-600 to-blue-700' },
          { label: 'In Escrow', value: '₹77.15L', icon: Wallet, color: 'from-cyan-500 to-blue-500' },
          { label: 'Beneficiaries', value: '18,000+', icon: Users, color: 'from-purple-500 to-pink-500' },
          { label: 'On-Time Rate', value: '92%', icon: CheckCircle2, color: 'from-green-500 to-emerald-600' },
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {lanes.map(lane => {
          const items = projects.filter(p => p.lane === lane.key);
          return (
            <div key={lane.key} className={`${lane.bg} rounded-2xl p-4 border border-slate-200`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${lane.color}`}></span>
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">{lane.key}</h3>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full">{items.length}</span>
              </div>
              <div className="space-y-3">
                {items.map(p => (
                  <button key={p.id} onClick={() => setSelected(p)} className={`w-full text-left bg-white rounded-xl shadow-sm p-4 border border-slate-100 hover:shadow-md hover:border-blue-300 transition ${selected?.id === p.id ? 'ring-2 ring-blue-500' : ''}`}>
                    <p className="text-xs font-mono text-slate-400">{p.id}</p>
                    <h4 className="font-semibold text-slate-900 text-sm mt-1">{p.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{p.partner}</p>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Progress</span>
                        <span className="font-bold text-slate-800">{p.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div className={`bg-gradient-to-r ${lane.color} h-1.5 rounded-full`} style={{ width: `${p.progress}%` }}></div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-slate-500"><MapPin size={11} />{p.location}</span>
                      <span className="font-bold text-blue-600">{p.escrow}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-mono text-slate-400">{selected.id}</p>
              <h3 className="text-2xl font-bold text-slate-900">{selected.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{selected.partner} &middot; {selected.sector}</p>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-900 to-cyan-800 text-white px-4 py-2 rounded-xl">
              <Link2 size={14} /><span className="font-mono text-xs">{selected.txHash}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-500 text-xs"><Wallet size={14} />Escrow Balance</div>
              <p className="text-xl font-bold text-slate-900 mt-1">{selected.escrow}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-500 text-xs"><Target size={14} />Total Budget</div>
              <p className="text-xl font-bold text-slate-900 mt-1">{selected.totalBudget}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-500 text-xs"><Users size={14} />Beneficiaries</div>
              <p className="text-xl font-bold text-slate-900 mt-1">{selected.beneficiaries.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-500 text-xs"><Calendar size={14} />Duration</div>
              <p className="text-sm font-semibold text-slate-900 mt-1">{selected.startDate} — {selected.endDate}</p>
            </div>
          </div>

          <h4 className="font-bold text-slate-800 mb-4">Milestone Timeline</h4>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200"></div>
            {['Kickoff & Baseline', 'Phase 1 Execution', selected.currentMilestone, 'Final Review', 'Closure'].map((m, idx) => {
              const done = idx < Math.floor(selected.progress / 25);
              const current = idx === Math.floor(selected.progress / 25);
              return (
                <div key={idx} className="relative pl-12 pb-5 last:pb-0">
                  <div className={`absolute left-1.5 w-5 h-5 rounded-full border-4 ${done ? 'bg-green-500 border-green-200' : current ? 'bg-blue-500 border-blue-200 animate-pulse' : 'bg-white border-slate-300'}`}></div>
                  <div className="bg-slate-50 rounded-xl px-4 py-3">
                    <p className="font-semibold text-slate-800 text-sm">{m}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{done ? 'Verified on-chain' : current ? 'In progress' : 'Upcoming'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
