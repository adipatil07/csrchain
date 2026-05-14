"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  Lock,
  Link2,
  X,
  Calendar,
  MapPin,
  Users,
  FileText,
  Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Status = "Pending" | "Approved" | "Rejected";

interface Milestone { title: string; amount: number; deadline: string }

interface Proposal {
  id: string;
  proposalRef: string;
  ngo: string;
  project: string;
  budget: number;
  sector: string;
  location: string;
  beneficiaries: number;
  description: string;
  submitted: string;
  status: Status;
  escrowTx: string | null;
  milestones: Milestone[];
  hasMyAllocation: boolean;
}

interface Counts { total: number; pending: number; approved: number; rejected: number }

const statusStyles: Record<Status, string> = {
  Pending: "bg-[#fef3c7] text-[#92400e]",
  Approved: "bg-[#d1fae5] text-[#065f46]",
  Rejected: "bg-[#fee2e2] text-[#991b1b]",
};

const fmt = (n: number) =>
  n >= 10000000 ? `₹${(n / 10000000).toFixed(1)} Cr` :
  n >= 100000 ? `₹${(n / 100000).toFixed(1)} L` :
  `₹${n.toLocaleString("en-IN")}`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProjectReviewPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [counts, setCounts] = useState<Counts>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | Status>("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Proposal | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [txToast, setTxToast] = useState<string | null>(null);

  const fetchProposals = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/company/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setProposals(json.proposals ?? []);
      setCounts(json.counts ?? { total: 0, pending: 0, approved: 0, rejected: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProposals(); }, [fetchProposals]);

  const handleApprove = async (p: Proposal) => {
    setActionLoading(p.id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/company/projects/${p.id}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ amount: p.budget }),
      });
      const json = await res.json();
      if (res.ok) {
        setTxToast(json.escrowTxHash);
        setSelected(null);
        fetchProposals();
        setTimeout(() => setTxToast(null), 8000);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      const token = localStorage.getItem("token");
      await fetch(`/api/company/projects/${id}/reject`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProposals();
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = proposals.filter((p) => {
    if (filter !== "All" && p.status !== filter) return false;
    if (search && !p.project.toLowerCase().includes(search.toLowerCase()) && !p.ngo.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <div className="bg-white border-b border-[#e5e7eb] px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#1a2847]">Project Review Queue</h2>
            <p className="text-[#64748b] text-sm mt-1">
              Review NGO proposals and lock CSR funds in on-chain escrow.
            </p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search NGOs or projects..."
              className="pl-9 pr-4 py-2 rounded-lg bg-white border border-[#e5e7eb] text-sm text-[#1a2847] w-64 outline-none focus:border-[#06b6d4]"
            />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Proposals", value: counts.total, color: "text-[#1a2847]" },
            { label: "Pending Review", value: counts.pending, color: "text-[#b45309]" },
            { label: "Approved", value: counts.approved, color: "text-[#047857]" },
            { label: "Rejected", value: counts.rejected, color: "text-[#b91c1c]" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5e7eb]">
              <p className="text-[#64748b] text-sm">{s.label}</p>
              <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {(["All", "Pending", "Approved", "Rejected"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === t
                  ? "bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] text-white shadow"
                  : "bg-white border border-[#e5e7eb] text-[#1a2847] hover:bg-[#f8fafc]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Proposals table */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-[#0ea5e9]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-[#e5e7eb]">
            <FileText className="w-12 h-12 text-[#cbd5e1] mx-auto mb-3" />
            <p className="text-[#64748b]">No proposals found. NGOs need to submit projects for review.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#f8fafc] border-b border-[#e5e7eb]">
                <tr className="text-left text-xs uppercase text-[#64748b]">
                  <th className="px-6 py-4">NGO / Project</th>
                  <th className="px-6 py-4">Sector</th>
                  <th className="px-6 py-4">Budget</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-[#e5e7eb] hover:bg-[#f8fafc]">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#1a2847]">{p.project}</p>
                      <p className="text-sm text-[#64748b]">{p.ngo} • {p.location}</p>
                      {p.escrowTx && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-[#0e7490]">
                          <Link2 className="w-3 h-3" />
                          <span className="font-mono">{p.escrowTx.slice(0, 10)}...{p.escrowTx.slice(-6)}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-[#e0f2fe] text-[#075985]">{p.sector}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#1a2847]">{fmt(p.budget)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1 rounded-full ${statusStyles[p.status]}`}>{p.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setSelected(p)}
                          className="px-3 py-1.5 bg-white border border-[#e5e7eb] hover:bg-[#f1f5f9] rounded-lg text-sm text-[#1a2847] flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                        {p.status === "Pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(p)}
                              disabled={actionLoading === p.id}
                              className="px-3 py-1.5 bg-[#d1fae5] hover:bg-[#a7f3d0] text-[#065f46] rounded-lg text-sm flex items-center gap-1 disabled:opacity-50"
                            >
                              {actionLoading === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(p.id)}
                              disabled={actionLoading === p.id}
                              className="px-3 py-1.5 bg-[#fee2e2] hover:bg-[#fecaca] text-[#991b1b] rounded-lg text-sm flex items-center gap-1 disabled:opacity-50"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] text-white p-6 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold">{selected.project}</h3>
                <p className="text-white/90 text-sm mt-1">Proposal by {selected.ngo}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-white/20">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-[#64748b] flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</p>
                  <p className="font-semibold text-[#1a2847]">{selected.location}</p>
                </div>
                <div>
                  <p className="text-[#64748b] flex items-center gap-1"><Calendar className="w-3 h-3" /> Submitted</p>
                  <p className="font-semibold text-[#1a2847]">{selected.submitted}</p>
                </div>
                <div>
                  <p className="text-[#64748b] flex items-center gap-1"><Users className="w-3 h-3" /> Beneficiaries</p>
                  <p className="font-semibold text-[#1a2847]">{selected.beneficiaries.toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-[#64748b] flex items-center gap-1"><FileText className="w-3 h-3" /> Budget</p>
                  <p className="font-semibold text-[#1a2847]">{fmt(selected.budget)}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#1a2847] mb-2">Project Description</h4>
                <p className="text-sm text-[#475569] leading-relaxed">{selected.description}</p>
              </div>

              {selected.milestones.length > 0 && (
                <div>
                  <h4 className="font-bold text-[#1a2847] mb-3">Milestone Breakdown</h4>
                  <div className="space-y-2">
                    {selected.milestones.map((m, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-[#f8fafc] border border-[#e5e7eb] rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] text-white flex items-center justify-center font-bold text-sm">
                            {i + 1}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#1a2847]">{m.title}</p>
                            <p className="text-xs text-[#64748b]">{m.deadline}</p>
                          </div>
                        </div>
                        <p className="font-bold text-[#1a2847]">{fmt(m.amount)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selected.status === "Pending" && (
                <div className="bg-gradient-to-br from-[#0ea5e9]/10 to-[#06b6d4]/5 border border-[#0ea5e9]/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-[#0e7490]" />
                    <p className="font-semibold text-[#0e7490] text-sm">On-Chain Escrow Contract</p>
                  </div>
                  <p className="text-xs text-[#475569] mb-3">
                    Approving will deploy {fmt(selected.budget)} into a Polygon smart contract escrow. Funds are released milestone-by-milestone after verification.
                  </p>
                  <button
                    onClick={() => handleApprove(selected)}
                    disabled={actionLoading === selected.id}
                    className="w-full px-4 py-3 bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] hover:from-[#0284c7] hover:to-[#0891b2] text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {actionLoading === selected.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    Approve &amp; Lock Funds in Escrow
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tx Toast */}
      {txToast && (
        <div className="fixed bottom-6 right-6 bg-[#0f1c3f] border border-[#06b6d4] text-white rounded-xl p-4 shadow-2xl max-w-md z-50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Escrow Contract Deployed</p>
              <p className="text-xs text-[#7e9bc9] mt-1 flex items-center gap-1">
                <Link2 className="w-3 h-3" /> Tx Hash:
              </p>
              <p className="text-xs font-mono text-[#06b6d4] break-all mt-0.5">{txToast}</p>
              <a href="#" className="text-xs text-[#06b6d4] underline mt-1 inline-block">View on Polygonscan →</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
