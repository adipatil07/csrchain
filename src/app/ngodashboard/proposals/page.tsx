"use client";

import React, { useState } from 'react';
import { FolderKanban, Plus, Upload, Trash2, FileText, Link2, Filter, CheckCircle2, XCircle, Clock3, FileEdit } from 'lucide-react';

type Status = 'All' | 'Draft' | 'Under Review' | 'Approved' | 'Rejected';

export default function ProposalsPage() {
  const [milestones, setMilestones] = useState<string[]>(['Baseline survey of beneficiaries', 'Setup of learning centers']);
  const [newMilestone, setNewMilestone] = useState('');
  const [filter, setFilter] = useState<Status>('All');
  const [fileName, setFileName] = useState('');

  const proposals = [
    { id: 'PRP-2026-011', title: 'Digital Literacy for Rural Girls', sector: 'Education', budget: '₹42,00,000', beneficiaries: 1200, location: 'Nashik, MH', status: 'Approved', submitted: '12 Mar 2026' },
    { id: 'PRP-2026-010', title: 'Mobile Health Vans - Delhi NCR', sector: 'Healthcare', budget: '₹85,00,000', beneficiaries: 9500, location: 'Delhi', status: 'Under Review', submitted: '04 Mar 2026' },
    { id: 'PRP-2026-009', title: 'Mangrove Restoration Project', sector: 'Environment', budget: '₹28,50,000', beneficiaries: 450, location: 'Thane, MH', status: 'Under Review', submitted: '28 Feb 2026' },
    { id: 'PRP-2026-008', title: 'Women Tailoring Collective', sector: 'Livelihood', budget: '₹15,75,000', beneficiaries: 220, location: 'Jaipur, RJ', status: 'Draft', submitted: '—' },
    { id: 'PRP-2026-007', title: 'Clean Water Wells Program', sector: 'Rural Dev', budget: '₹60,00,000', beneficiaries: 3400, location: 'Latur, MH', status: 'Rejected', submitted: '15 Feb 2026' },
    { id: 'PRP-2026-006', title: 'After-School STEM Labs', sector: 'Education', budget: '₹33,20,000', beneficiaries: 800, location: 'Pune, MH', status: 'Approved', submitted: '10 Feb 2026' },
  ];

  const filtered = filter === 'All' ? proposals : proposals.filter(p => p.status === filter);

  const statusStyles: Record<string, string> = {
    'Draft': 'bg-slate-100 text-slate-700',
    'Under Review': 'bg-amber-100 text-amber-700',
    'Approved': 'bg-green-100 text-green-700',
    'Rejected': 'bg-red-100 text-red-700',
  };
  const statusIcons: Record<string, React.ElementType> = {
    'Draft': FileEdit, 'Under Review': Clock3, 'Approved': CheckCircle2, 'Rejected': XCircle,
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Proposals', value: '38', color: 'from-blue-600 to-blue-700' },
          { label: 'Approved', value: '21', color: 'from-green-500 to-emerald-600' },
          { label: 'Under Review', value: '9', color: 'from-amber-500 to-orange-500' },
          { label: 'Drafts', value: '5', color: 'from-slate-500 to-slate-600' },
        ].map((s, i) => (
          <div key={i} className={`bg-gradient-to-br ${s.color} rounded-2xl shadow-lg p-6 text-white`}>
            <FolderKanban size={22} className="mb-3 opacity-80" />
            <p className="text-sm opacity-90">{s.label}</p>
            <p className="text-3xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Plus size={20} className="text-blue-600" />New Project Proposal</h3>
            <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">Auto-saved to IPFS draft</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase">Project Title</label>
              <input type="text" placeholder="e.g. Digital Literacy for Rural Girls" className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase">Sector</label>
              <select className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm">
                <option>Education</option><option>Healthcare</option><option>Environment</option><option>Rural Development</option><option>Livelihood</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase">Total Budget (INR)</label>
              <input type="text" placeholder="₹ 42,00,000" className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase">Target Beneficiaries</label>
              <input type="number" placeholder="1200" className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-600 uppercase">Location</label>
              <input type="text" placeholder="Nashik, Maharashtra" className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-600 uppercase">Project Description</label>
              <textarea rows={4} placeholder="Describe objectives, approach and expected impact..." className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm"></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-600 uppercase">Milestones</label>
              <div className="mt-2 space-y-2">
                {milestones.map((m, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">{idx + 1}</span>
                    <span className="flex-1 text-sm text-slate-800">{m}</span>
                    <button onClick={() => setMilestones(milestones.filter((_, i) => i !== idx))} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input value={newMilestone} onChange={e => setNewMilestone(e.target.value)} placeholder="Add milestone..." className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                  <button onClick={() => { if (newMilestone.trim()) { setMilestones([...milestones, newMilestone.trim()]); setNewMilestone(''); } }} className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition">
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-600 uppercase">Supporting Documents (IPFS)</label>
              <label className="mt-1 flex items-center justify-center gap-3 border-2 border-dashed border-blue-300 rounded-xl py-6 cursor-pointer hover:bg-blue-50 transition">
                <Upload className="text-blue-600" size={22} />
                <span className="text-sm text-slate-600">{fileName || 'Click to upload PDF / DOCX (will be pinned to IPFS)'}</span>
                <input type="file" className="hidden" onChange={e => setFileName(e.target.files?.[0]?.name || '')} />
              </label>
              {fileName && (
                <div className="mt-2 flex items-center gap-2 text-xs text-blue-700 font-mono bg-blue-50 rounded-lg px-3 py-2">
                  <Link2 size={14} /> ipfs://Qm{Math.random().toString(36).substring(2, 12)}...{Math.random().toString(36).substring(2, 8)}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition">Save as Draft</button>
            <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:scale-105 transition">Submit for Review</button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 rounded-2xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FileText size={20} /> Proposal Guidelines</h3>
          <ul className="space-y-3 text-sm text-blue-100">
            <li className="flex gap-2"><span className="text-cyan-300">01.</span>Clearly define SMART objectives and measurable KPIs.</li>
            <li className="flex gap-2"><span className="text-cyan-300">02.</span>Break funding into 3-6 verifiable milestones.</li>
            <li className="flex gap-2"><span className="text-cyan-300">03.</span>Each milestone will be locked in a Polygon escrow smart contract.</li>
            <li className="flex gap-2"><span className="text-cyan-300">04.</span>Proof (photos, reports, geo-tags) must be uploaded to IPFS.</li>
            <li className="flex gap-2"><span className="text-cyan-300">05.</span>CSR partner approval triggers on-chain fund release.</li>
          </ul>
          <div className="mt-6 p-4 bg-white/10 rounded-xl backdrop-blur">
            <p className="text-xs uppercase tracking-wider text-cyan-200">Average Approval Time</p>
            <p className="text-2xl font-bold mt-1">4.2 days</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-bold text-slate-900">Submitted Proposals</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={16} className="text-slate-500" />
            {(['All', 'Draft', 'Under Review', 'Approved', 'Rejected'] as Status[]).map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${filter === s ? 'bg-blue-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase">ID</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase">Title</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase">Sector</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase">Budget</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase">Beneficiaries</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase">Location</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase">Submitted</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const Icon = statusIcons[p.status];
                return (
                  <tr key={p.id} className="border-b border-slate-100 hover:bg-blue-50/40 transition">
                    <td className="py-4 px-4 text-xs font-mono text-slate-500">{p.id}</td>
                    <td className="py-4 px-4 text-sm font-semibold text-slate-900">{p.title}</td>
                    <td className="py-4 px-4 text-sm text-slate-600">{p.sector}</td>
                    <td className="py-4 px-4 text-sm font-bold text-blue-600">{p.budget}</td>
                    <td className="py-4 px-4 text-sm text-slate-600">{p.beneficiaries.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-4 text-sm text-slate-600">{p.location}</td>
                    <td className="py-4 px-4 text-sm text-slate-600">{p.submitted}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${statusStyles[p.status]}`}>
                        <Icon size={14} /> {p.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
