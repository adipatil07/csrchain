"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  Filter,
  Lock,
  Link2,
  X,
  Calendar,
  MapPin,
  Users,
  FileText,
} from "lucide-react";

type Status = "Pending" | "Approved" | "Rejected";

interface Proposal {
  id: number;
  ngo: string;
  project: string;
  budget: string;
  sector: string;
  location: string;
  duration: string;
  beneficiaries: number;
  status: Status;
  submitted: string;
  description: string;
  milestones: { title: string; amount: string; deadline: string }[];
}

const proposals: Proposal[] = [
  {
    id: 1,
    ngo: "Shiksha Foundation",
    project: "Digital Classrooms for Rural Bihar",
    budget: "₹45,00,000",
    sector: "Education",
    location: "Patna, Bihar",
    duration: "12 months",
    beneficiaries: 2400,
    status: "Pending",
    submitted: "2026-03-28",
    description:
      "Deployment of 40 smart digital classrooms across 20 government schools in rural Bihar with tablets, projectors, and e-learning content in Hindi.",
    milestones: [
      { title: "Infrastructure setup (20 schools)", amount: "₹15,00,000", deadline: "Month 3" },
      { title: "Device procurement & install", amount: "₹18,00,000", deadline: "Month 6" },
      { title: "Teacher training program", amount: "₹7,00,000", deadline: "Month 9" },
      { title: "Impact assessment & reporting", amount: "₹5,00,000", deadline: "Month 12" },
    ],
  },
  {
    id: 2,
    ngo: "Jal Seva Trust",
    project: "Clean Drinking Water - 50 Villages",
    budget: "₹62,00,000",
    sector: "Environment",
    location: "Bundelkhand, UP",
    duration: "18 months",
    beneficiaries: 18500,
    status: "Pending",
    submitted: "2026-03-25",
    description:
      "Installation of solar-powered RO water plants and hand-pumps in 50 drought-affected villages with community maintenance training.",
    milestones: [
      { title: "Water source survey", amount: "₹6,00,000", deadline: "Month 2" },
      { title: "RO plant installation (25)", amount: "₹28,00,000", deadline: "Month 8" },
      { title: "Community training", amount: "₹12,00,000", deadline: "Month 12" },
      { title: "Handover & audit", amount: "₹16,00,000", deadline: "Month 18" },
    ],
  },
  {
    id: 3,
    ngo: "Arogya Sewa",
    project: "Mobile Health Clinics - Maharashtra",
    budget: "₹28,50,000",
    sector: "Healthcare",
    location: "Nashik, Maharashtra",
    duration: "9 months",
    beneficiaries: 8200,
    status: "Approved",
    submitted: "2026-03-18",
    description:
      "Two fully equipped mobile health vans covering 30 tribal villages with free check-ups, medicines and maternal care.",
    milestones: [
      { title: "Van procurement & fit-out", amount: "₹14,00,000", deadline: "Month 2" },
      { title: "Medical staff onboarding", amount: "₹4,50,000", deadline: "Month 3" },
      { title: "Operations - 6 months", amount: "₹10,00,000", deadline: "Month 9" },
    ],
  },
  {
    id: 4,
    ngo: "Shakti NGO",
    project: "Women Skill Development Centre",
    budget: "₹38,00,000",
    sector: "Rural Dev",
    location: "Jaipur, Rajasthan",
    duration: "12 months",
    beneficiaries: 1200,
    status: "Pending",
    submitted: "2026-04-01",
    description:
      "Vocational training in tailoring, handicrafts and digital literacy for 1,200 women from marginalised communities with placement support.",
    milestones: [
      { title: "Centre setup", amount: "₹10,00,000", deadline: "Month 2" },
      { title: "Batch 1 training (400)", amount: "₹12,00,000", deadline: "Month 5" },
      { title: "Batch 2 training (800)", amount: "₹12,00,000", deadline: "Month 10" },
      { title: "Placement & audit", amount: "₹4,00,000", deadline: "Month 12" },
    ],
  },
  {
    id: 5,
    ngo: "Green Earth Org",
    project: "Urban Afforestation - Bengaluru",
    budget: "₹22,00,000",
    sector: "Environment",
    location: "Bengaluru, Karnataka",
    duration: "6 months",
    beneficiaries: 50000,
    status: "Rejected",
    submitted: "2026-03-10",
    description:
      "Planting 25,000 native saplings across Bengaluru with geo-tagged tracking and 2-year maintenance.",
    milestones: [],
  },
];

const statusStyles: Record<Status, string> = {
  Pending: "bg-[#fef3c7] text-[#92400e]",
  Approved: "bg-[#d1fae5] text-[#065f46]",
  Rejected: "bg-[#fee2e2] text-[#991b1b]",
};

export default function ProjectReviewPage() {
  const [items, setItems] = useState<Proposal[]>(proposals);
  const [filter, setFilter] = useState<"All" | Status>("All");
  const [selected, setSelected] = useState<Proposal | null>(null);
  const [txToast, setTxToast] = useState<string | null>(null);

  const filtered = items.filter((p) => filter === "All" || p.status === filter);

  const updateStatus = (id: number, status: Status) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const lockEscrow = (p: Proposal) => {
    const hash =
      "0x" +
      Array.from({ length: 40 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
    updateStatus(p.id, "Approved");
    setTxToast(hash);
    setSelected(null);
    setTimeout(() => setTxToast(null), 6000);
  };

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
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
              <input
                placeholder="Search NGOs or projects..."
                className="pl-9 pr-4 py-2 rounded-lg bg-white border border-[#e5e7eb] text-sm text-[#1a2847] w-64 outline-none focus:border-[#06b6d4]"
              />
            </div>
            <button className="px-4 py-2 bg-white border border-[#e5e7eb] text-[#1a2847] hover:bg-[#f8fafc] rounded-lg flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Proposals", value: items.length, color: "text-[#1a2847]" },
            {
              label: "Pending Review",
              value: items.filter((i) => i.status === "Pending").length,
              color: "text-[#b45309]",
            },
            {
              label: "Approved",
              value: items.filter((i) => i.status === "Approved").length,
              color: "text-[#047857]",
            },
            {
              label: "Rejected",
              value: items.filter((i) => i.status === "Rejected").length,
              color: "text-[#b91c1c]",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5e7eb]"
            >
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
                <tr
                  key={p.id}
                  className="border-b border-[#e5e7eb] hover:bg-[#f8fafc]"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[#1a2847]">{p.project}</p>
                    <p className="text-sm text-[#64748b]">
                      {p.ngo} • {p.location}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-[#e0f2fe] text-[#075985]">
                      {p.sector}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#1a2847]">{p.budget}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${statusStyles[p.status]}`}
                    >
                      {p.status}
                    </span>
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
                            onClick={() => updateStatus(p.id, "Approved")}
                            className="px-3 py-1.5 bg-[#d1fae5] hover:bg-[#a7f3d0] text-[#065f46] rounded-lg text-sm flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => updateStatus(p.id, "Rejected")}
                            className="px-3 py-1.5 bg-[#fee2e2] hover:bg-[#fecaca] text-[#991b1b] rounded-lg text-sm flex items-center gap-1"
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
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] text-white p-6 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold">{selected.project}</h3>
                <p className="text-white/90 text-sm mt-1">
                  Proposal by {selected.ngo}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-lg hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-[#64748b] flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Location
                  </p>
                  <p className="font-semibold text-[#1a2847]">{selected.location}</p>
                </div>
                <div>
                  <p className="text-[#64748b] flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Duration
                  </p>
                  <p className="font-semibold text-[#1a2847]">{selected.duration}</p>
                </div>
                <div>
                  <p className="text-[#64748b] flex items-center gap-1">
                    <Users className="w-3 h-3" /> Beneficiaries
                  </p>
                  <p className="font-semibold text-[#1a2847]">
                    {selected.beneficiaries.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-[#64748b] flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Budget
                  </p>
                  <p className="font-semibold text-[#1a2847]">{selected.budget}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#1a2847] mb-2">Project Description</h4>
                <p className="text-sm text-[#475569] leading-relaxed">
                  {selected.description}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#1a2847] mb-3">
                  Milestone Breakdown
                </h4>
                <div className="space-y-2">
                  {selected.milestones.map((m, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-[#f8fafc] border border-[#e5e7eb] rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] text-white flex items-center justify-center font-bold text-sm">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1a2847]">
                            {m.title}
                          </p>
                          <p className="text-xs text-[#64748b]">{m.deadline}</p>
                        </div>
                      </div>
                      <p className="font-bold text-[#1a2847]">{m.amount}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#0ea5e9]/10 to-[#06b6d4]/5 border border-[#0ea5e9]/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-[#0e7490]" />
                  <p className="font-semibold text-[#0e7490] text-sm">
                    On-Chain Escrow Contract
                  </p>
                </div>
                <p className="text-xs text-[#475569] mb-3">
                  Approving this proposal will deploy funds into a Polygon smart
                  contract escrow. Funds are released milestone-by-milestone after
                  verification.
                </p>
                <button
                  onClick={() => lockEscrow(selected)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] hover:from-[#0284c7] hover:to-[#0891b2] text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg"
                >
                  <Lock className="w-4 h-4" />
                  Approve &amp; Lock Funds in Escrow
                </button>
              </div>
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
              <p className="text-xs font-mono text-[#06b6d4] break-all mt-0.5">
                {txToast}
              </p>
              <a
                href="#"
                className="text-xs text-[#06b6d4] underline mt-1 inline-block"
              >
                View on Polygonscan →
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
