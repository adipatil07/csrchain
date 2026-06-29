"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Calendar, Link2, Wallet, Users, Target, Activity, CheckCircle2, Loader2 } from 'lucide-react';

type Lane = 'PLANNING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';

interface Project {
  id: string; proposalRef: string; name: string; partner: string; sector: string; location: string;
  progress: number; currentMilestone: string; escrow: string; totalBudget: string;
  startDate: string; endDate: string; lane: Lane; txHash: string; beneficiaries: number;
  milestones: { title: string; status: string }[];
  onTime: boolean;
}

const lanes: { key: Lane; label: string; color: string; bg: string }[] = [
  { key: 'PLANNING', label: 'Planning', color: 'from-slate-500 to-slate-600', bg: 'bg-slate-50' },
  { key: 'IN_PROGRESS', label: 'In Progress', color: 'from-blue-600 to-cyan-600', bg: 'bg-blue-50/60' },
  { key: 'REVIEW', label: 'Review', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50/60' },
  { key: 'COMPLETED', label: 'Completed', color: 'from-green-500 to-emerald-600', bg: 'bg-green-50/60' },
];

export default function StatusPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();

      const mapped: Project[] = (data.projects || []).map((p: {
        id: string; proposalRef: string; title: string; allocations: { company: { companyName: string } }[];
        sector: string; location: string; progress: number;
        milestones: { title: string; status: string; deadline?: string }[];
        escrowBalance: number; budget: number; startDate: string | null; endDate: string | null;
        lane: Lane; escrowTxHash: string | null; beneficiaries: number;
      }) => ({
        id: p.id,
        proposalRef: p.proposalRef,
        name: p.title,
        partner: p.allocations?.[0]?.company?.companyName || 'Seeking Funding',
        sector: p.sector,
        location: p.location,
        progress: p.progress,
        currentMilestone: p.milestones?.find((m) => m.status === 'PENDING')?.title || p.milestones?.[p.milestones.length - 1]?.title || 'Not Started',
        escrow: p.escrowBalance > 0 ? `₹${(p.escrowBalance / 100000).toFixed(2)} L` : '₹0',
        totalBudget: `₹${(p.budget / 100000).toFixed(2)} L`,
        startDate: p.startDate ? new Date(p.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
        endDate: p.endDate ? new Date(p.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
        lane: p.lane || 'PLANNING',
        txHash: p.escrowTxHash ? `${p.escrowTxHash.substring(0, 6)}...${p.escrowTxHash.slice(-4)}` : '—',
        beneficiaries: p.beneficiaries,
        milestones: p.milestones ?? [],
        onTime: !p.milestones?.some((m) => m.status === 'PENDING' && m.deadline && new Date(m.deadline) < new Date()),
      }));

      setProjects(mapped);
      if (mapped.length > 0) setSelected(mapped[0]);
    } catch {
      console.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const totalInEscrow = projects.reduce((s, p) => {
    const val = parseFloat(p.escrow.replace('₹', '').replace(' L', '')) || 0;
    return s + val;
  }, 0);

  const totalBeneficiaries = projects.reduce((s, p) => s + p.beneficiaries, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={40} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Projects', value: projects.length.toString(), icon: Activity, color: 'from-blue-600 to-blue-700' },
          { label: 'In Escrow', value: `₹${totalInEscrow.toFixed(2)}L`, icon: Wallet, color: 'from-cyan-500 to-blue-500' },
          { label: 'Beneficiaries', value: totalBeneficiaries > 0 ? `${totalBeneficiaries.toLocaleString('en-IN')}` : '0', icon: Users, color: 'from-purple-500 to-pink-500' },
          { label: 'On-Time Rate', value: projects.length > 0 ? `${Math.round((projects.filter(p => p.onTime).length / projects.length) * 100)}%` : '—', icon: CheckCircle2, color: 'from-green-500 to-emerald-600' },
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

      {/* Kanban Board */}
      {projects.length === 0 ? (
        <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-200">
          <Target size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No projects yet</p>
          <p className="text-sm mt-2">Create a proposal to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {lanes.map(lane => {
            const items = projects.filter(p => p.lane === lane.key);
            return (
              <div key={lane.key} className={`${lane.bg} rounded-2xl p-4 border border-slate-200`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${lane.color}`}></span>
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">{lane.label}</h3>
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full">{items.length}</span>
                </div>
                <div className="space-y-3">
                  {items.map(p => (
                    <button key={p.id} onClick={() => setSelected(p)}
                      className={`w-full text-left bg-white rounded-xl shadow-sm p-4 border border-slate-100 hover:shadow-md hover:border-blue-300 transition ${selected?.id === p.id ? 'ring-2 ring-blue-500' : ''}`}>
                      <p className="text-xs font-mono text-slate-400">{p.proposalRef}</p>
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
                  {items.length === 0 && (
                    <div className="text-center py-6 text-slate-400 text-xs">No projects in this lane</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Detail Panel */}
      {selected && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-mono text-slate-400">{selected.proposalRef}</p>
              <h3 className="text-2xl font-bold text-slate-900">{selected.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{selected.partner} · {selected.sector}</p>
            </div>
            {selected.txHash !== '—' && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-900 to-cyan-800 text-white px-4 py-2 rounded-xl">
                <Link2 size={14} /><span className="font-mono text-xs">{selected.txHash}</span>
              </div>
            )}
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
            {(selected.milestones.length > 0 ? selected.milestones : [{ title: selected.currentMilestone, status: 'PENDING' }]).map((m, idx) => {
              const done = m.status === 'APPROVED';
              const current = m.status === 'SUBMITTED' || m.status === 'PENDING';
              return (
                <div key={idx} className="relative pl-12 pb-5 last:pb-0">
                  <div className={`absolute left-1.5 w-5 h-5 rounded-full border-4 ${done ? 'bg-green-500 border-green-200' : current && idx === selected.milestones.findIndex(x => x.status === 'PENDING' || x.status === 'SUBMITTED') ? 'bg-blue-500 border-blue-200 animate-pulse' : done ? 'bg-green-500 border-green-200' : 'bg-white border-slate-300'}`}></div>
                  <div className="bg-slate-50 rounded-xl px-4 py-3">
                    <p className="font-semibold text-slate-800 text-sm">{m.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {m.status === 'APPROVED' ? 'Verified on-chain' : m.status === 'SUBMITTED' ? 'Awaiting verification' : m.status === 'REJECTED' ? 'Rejected — resubmit required' : 'Upcoming'}
                    </p>
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
