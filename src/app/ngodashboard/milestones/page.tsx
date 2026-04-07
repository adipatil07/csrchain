"use client";

import React, { useState } from 'react';
import { Upload, MapPin, Camera, Link2, CheckCircle2, Clock3, X, Hash, Shield } from 'lucide-react';

interface Upcoming {
  id: string; project: string; milestone: string; deadline: string; amount: string; partner: string;
}

interface Submitted {
  id: string; project: string; milestone: string; date: string; amount: string; ipfs: string; tx: string; status: 'Verified' | 'Pending Verification' | 'Rejected';
}

const upcoming: Upcoming[] = [
  { id: 'M-091', project: 'Rural Education Program', milestone: 'Phase 2 Completion', deadline: '15 Apr 2026', amount: '₹12,00,000', partner: 'Tata CSR' },
  { id: 'M-092', project: 'Healthcare Initiative Delhi', milestone: 'Equipment Installation', deadline: '20 Apr 2026', amount: '₹8,50,000', partner: 'Reliance Fdn.' },
  { id: 'M-093', project: 'Skill Development Pune', milestone: 'Training Module 1', deadline: '28 Apr 2026', amount: '₹15,00,000', partner: 'Mahindra Rise' },
  { id: 'M-094', project: 'Girl Child Nutrition', milestone: 'Mid-term Assessment', deadline: '05 May 2026', amount: '₹6,20,000', partner: 'ITC MSK' },
];

const submittedHistory: Submitted[] = [
  { id: 'M-088', project: 'Rural Education Program', milestone: 'Phase 1 Baseline', date: '02 Mar 2026', amount: '₹9,00,000', ipfs: 'QmX7eF...2aKp', tx: '0x4a2e...7d1c', status: 'Verified' },
  { id: 'M-087', project: 'Clean Water Mumbai', milestone: 'Borewell Construction', date: '25 Feb 2026', amount: '₹7,50,000', ipfs: 'QmY9zR...m81T', tx: '0x8b1f...c34a', status: 'Verified' },
  { id: 'M-086', project: 'Healthcare Initiative Delhi', milestone: 'Site Survey', date: '18 Feb 2026', amount: '₹3,20,000', ipfs: 'QmA4bN...p09V', tx: '0x6c9d...b12e', status: 'Pending Verification' },
  { id: 'M-085', project: 'Solar Lighting Villages', milestone: 'Panel Deployment', date: '10 Feb 2026', amount: '₹5,60,000', ipfs: 'QmL3kH...d77C', tx: '0x91ab...4f2c', status: 'Verified' },
  { id: 'M-084', project: 'Skill Development Pune', milestone: 'Trainer Onboarding', date: '28 Jan 2026', amount: '₹2,80,000', ipfs: 'QmR6wM...t22G', tx: '0x2f7a...9e5b', status: 'Rejected' },
];

export default function MilestonesPage() {
  const [modal, setModal] = useState<Upcoming | null>(null);
  const [desc, setDesc] = useState('');
  const [photo, setPhoto] = useState('');
  const [geo, setGeo] = useState('19.0760° N, 72.8777° E (Mumbai)');
  const [generated, setGenerated] = useState<{ ipfs: string; tx: string } | null>(null);

  const handleSubmit = () => {
    const ipfs = 'Qm' + Math.random().toString(36).substring(2, 10).toUpperCase() + '...' + Math.random().toString(36).substring(2, 6);
    const tx = '0x' + Math.random().toString(36).substring(2, 6) + '...' + Math.random().toString(36).substring(2, 6);
    setGenerated({ ipfs, tx });
  };

  const closeModal = () => { setModal(null); setDesc(''); setPhoto(''); setGenerated(null); };

  const statusStyle: Record<string, string> = {
    'Verified': 'bg-green-100 text-green-700',
    'Pending Verification': 'bg-amber-100 text-amber-700',
    'Rejected': 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Upcoming', value: '8', color: 'from-blue-600 to-blue-700' },
          { label: 'Pending Verification', value: '3', color: 'from-amber-500 to-orange-500' },
          { label: 'Verified', value: '37', color: 'from-green-500 to-emerald-600' },
          { label: 'Total Unlocked', value: '₹2.41 Cr', color: 'from-purple-500 to-pink-500' },
        ].map((s, i) => (
          <div key={i} className={`bg-gradient-to-br ${s.color} rounded-2xl shadow-lg p-6 text-white`}>
            <Shield size={22} className="mb-3 opacity-80" />
            <p className="text-sm opacity-90">{s.label}</p>
            <p className="text-3xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Upcoming Milestones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcoming.map(u => (
            <div key={u.id} className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-5 border border-slate-100 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs font-mono text-slate-400">{u.id}</p>
                  <h4 className="font-semibold text-slate-900 mt-1">{u.milestone}</h4>
                  <p className="text-sm text-slate-500">{u.project}</p>
                  <p className="text-xs text-slate-400 mt-1">Partner: {u.partner}</p>
                </div>
                <span className="text-sm font-bold text-blue-600 bg-white px-3 py-1 rounded-lg">{u.amount}</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="flex items-center gap-1 text-xs text-slate-500"><Clock3 size={13} />Due {u.deadline}</span>
                <button onClick={() => setModal(u)} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-medium rounded-xl hover:shadow-lg hover:scale-105 transition">
                  Submit Proof
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Submitted Milestones History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase">ID</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase">Project / Milestone</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase">Date</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase">IPFS Hash</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase">Tx Hash</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {submittedHistory.map(s => (
                <tr key={s.id} className="border-b border-slate-100 hover:bg-blue-50/40 transition">
                  <td className="py-4 px-4 text-xs font-mono text-slate-500">{s.id}</td>
                  <td className="py-4 px-4">
                    <p className="text-sm font-semibold text-slate-900">{s.milestone}</p>
                    <p className="text-xs text-slate-500">{s.project}</p>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600">{s.date}</td>
                  <td className="py-4 px-4 text-sm font-bold text-blue-600">{s.amount}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-mono px-2 py-1 rounded-lg"><Hash size={11} />{s.ipfs}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-700 text-xs font-mono px-2 py-1 rounded-lg"><Link2 size={11} />{s.tx}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusStyle[s.status]}`}>{s.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-900 to-cyan-800 text-white p-6 rounded-t-2xl flex justify-between items-start">
              <div>
                <p className="text-xs uppercase tracking-wider text-blue-200">Submit Milestone Proof</p>
                <h3 className="text-xl font-bold mt-1">{modal.milestone}</h3>
                <p className="text-sm text-blue-100">{modal.project}</p>
              </div>
              <button onClick={closeModal} className="hover:bg-white/10 p-2 rounded-lg"><X size={20} /></button>
            </div>

            {!generated ? (
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase">Description of Work Completed</label>
                  <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4} placeholder="Describe what was accomplished, quantities, beneficiaries reached..." className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"></textarea>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase">Photo Evidence</label>
                  <label className="mt-1 flex items-center justify-center gap-3 border-2 border-dashed border-blue-300 rounded-xl py-6 cursor-pointer hover:bg-blue-50">
                    <Camera size={20} className="text-blue-600" />
                    <span className="text-sm text-slate-600">{photo || 'Upload geo-tagged photos'}</span>
                    <input type="file" className="hidden" onChange={e => setPhoto(e.target.files?.[0]?.name || 'proof_image.jpg')} />
                  </label>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase">Geo-location</label>
                  <div className="mt-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                    <MapPin size={18} className="text-blue-600" />
                    <input value={geo} onChange={e => setGeo(e.target.value)} className="flex-1 bg-transparent text-sm focus:outline-none" />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-800">
                  On submit, the proof bundle will be pinned to <span className="font-mono">IPFS</span> and its hash will be written to the Polygon escrow contract to trigger <span className="font-bold">{modal.amount}</span> release after CSR approval.
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={closeModal} className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200">Cancel</button>
                  <button onClick={handleSubmit} className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-sm font-medium hover:shadow-lg flex items-center gap-2">
                    <Upload size={16} /> Pin to IPFS & Submit
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="text-green-600" size={36} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Proof Submitted Successfully</h3>
                <p className="text-sm text-slate-500">Your milestone proof has been pinned to IPFS and recorded on Polygon.</p>
                <div className="space-y-2 text-left bg-slate-50 rounded-xl p-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase">IPFS Hash</p>
                    <p className="font-mono text-sm text-blue-700">{generated.ipfs}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Transaction Hash</p>
                    <p className="font-mono text-sm text-cyan-700">{generated.tx}</p>
                  </div>
                </div>
                <button onClick={closeModal} className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium">Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
