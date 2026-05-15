"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Building2, Mail, Phone, MapPin, Wallet, Shield, Edit3,
  Save, X, Loader2, CheckCircle2, TrendingUp, Briefcase,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Profile {
  id: string;
  name: string;
  email: string;
  companyName: string;
  csrRegNo: string;
  totalBudget: number;
  walletAddress: string;
  industry: string;
  phone: string;
  address: string;
  totalAllocated: number;
  activeProjects: number;
  utilizationPct: number;
}

const fmt = (n: number) =>
  n >= 10000000 ? `₹${(n / 10000000).toFixed(2)} Cr` :
  n >= 100000 ? `₹${(n / 100000).toFixed(2)} L` :
  `₹${n.toLocaleString("en-IN")}`;

const INDUSTRIES = [
  "Technology", "Banking & Finance", "Manufacturing", "Pharmaceuticals",
  "Energy", "Telecommunications", "FMCG", "Automotive", "Infrastructure", "Other",
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function CompanyProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "", companyName: "", csrRegNo: "", totalBudget: "",
    walletAddress: "", industry: "", phone: "", address: "",
  });

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/company/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.profile) {
        setProfile(data.profile);
        setForm({
          name: data.profile.name || "",
          companyName: data.profile.companyName || "",
          csrRegNo: data.profile.csrRegNo || "",
          totalBudget: String(data.profile.totalBudget || ""),
          walletAddress: data.profile.walletAddress || "",
          industry: data.profile.industry || "",
          phone: data.profile.phone || "",
          address: data.profile.address || "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const handleSave = async () => {
    setError(""); setSuccess(""); setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/company/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, totalBudget: Number(form.totalBudget) }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Save failed"); return; }
      setProfile({ ...profile!, ...data.profile });
      setSuccess("Profile updated successfully!");
      setEditing(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#0ea5e9]" />
      </div>
    );
  }

  return (
    <>
      {/* Page header */}
      <div className="bg-white border-b border-[#e5e7eb] px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#1a2847]">Organization Profile</h2>
            <p className="text-[#64748b] text-sm mt-1">Manage your CSR portal account and company details.</p>
          </div>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] text-white rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => { setEditing(false); setError(""); }}
                className="flex items-center gap-2 px-4 py-2 bg-[#f1f5f9] text-[#1a2847] rounded-lg text-sm font-medium hover:bg-[#e2e8f0] transition">
                <X className="w-4 h-4" /> Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] text-white rounded-lg text-sm font-medium shadow hover:shadow-lg transition disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {success && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm">
            <CheckCircle2 className="w-4 h-4 text-green-600" /> {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm">{error}</div>
        )}

        {/* Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: TrendingUp, label: "CSR Budget", value: fmt(profile?.totalBudget || 0), sub: "Annual mandate", color: "from-[#0ea5e9] to-[#06b6d4]" },
            { icon: Briefcase, label: "Funds Allocated", value: fmt(profile?.totalAllocated || 0), sub: `${profile?.utilizationPct || 0}% utilized`, color: "from-[#8b5cf6] to-[#6d28d9]" },
            { icon: CheckCircle2, label: "Active Projects", value: String(profile?.activeProjects || 0), sub: "currently funded", color: "from-[#10b981] to-[#059669]" },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className={`bg-gradient-to-r ${s.color} rounded-2xl p-5 text-white shadow-lg`}>
                <Icon className="w-5 h-5 mb-3 opacity-80" />
                <p className="text-xs opacity-80">{s.label}</p>
                <p className="text-2xl font-bold mt-1">{s.value}</p>
                <p className="text-xs opacity-70 mt-1">{s.sub}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar / Summary Card */}
          <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-4">
              {(profile?.companyName || "C").charAt(0).toUpperCase()}
            </div>
            <h3 className="text-xl font-bold text-[#1a2847]">{profile?.companyName || "—"}</h3>
            <p className="text-sm text-[#64748b] mt-1">{profile?.industry || "Industry not set"}</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-[#64748b]">
              <Mail className="w-3.5 h-3.5" /> {profile?.email}
            </div>
            {profile?.phone && (
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#64748b]">
                <Phone className="w-3.5 h-3.5" /> {profile.phone}
              </div>
            )}
            {profile?.address && (
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#64748b]">
                <MapPin className="w-3.5 h-3.5" /> {profile.address}
              </div>
            )}
            <div className="mt-4 w-full p-3 rounded-xl bg-[#ecfeff] border border-[#06b6d4]/30">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0e7490] mb-1">
                <Shield className="w-3.5 h-3.5" /> CSR Registration
              </div>
              <p className="text-xs font-mono text-[#1a2847]">{profile?.csrRegNo || "Not registered"}</p>
            </div>
          </div>

          {/* Edit / View Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
            <h3 className="text-lg font-bold text-[#1a2847] mb-5">
              {editing ? "Edit Details" : "Company Information"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact Person Name */}
              <div>
                <label className="text-xs font-semibold text-[#64748b] uppercase block mb-1">Contact Person Name</label>
                {editing ? (
                  <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e5e7eb] rounded-xl text-sm focus:border-[#06b6d4] focus:outline-none" />
                ) : (
                  <p className="px-4 py-3 bg-[#f8fafc] rounded-xl text-sm text-[#1a2847]">{profile?.name || "—"}</p>
                )}
              </div>

              {/* Company Name */}
              <div>
                <label className="text-xs font-semibold text-[#64748b] uppercase block mb-1">
                  <Building2 className="inline w-3.5 h-3.5 mr-1" />Company Name
                </label>
                {editing ? (
                  <input value={form.companyName} onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e5e7eb] rounded-xl text-sm focus:border-[#06b6d4] focus:outline-none" />
                ) : (
                  <p className="px-4 py-3 bg-[#f8fafc] rounded-xl text-sm text-[#1a2847]">{profile?.companyName || "—"}</p>
                )}
              </div>

              {/* CSR Reg No */}
              <div>
                <label className="text-xs font-semibold text-[#64748b] uppercase block mb-1">
                  <Shield className="inline w-3.5 h-3.5 mr-1" />CSR Registration No.
                </label>
                {editing ? (
                  <input value={form.csrRegNo} onChange={(e) => setForm((f) => ({ ...f, csrRegNo: e.target.value }))}
                    placeholder="e.g. CSR-2024-IN-0001"
                    className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e5e7eb] rounded-xl text-sm focus:border-[#06b6d4] focus:outline-none" />
                ) : (
                  <p className="px-4 py-3 bg-[#f8fafc] rounded-xl text-sm font-mono text-[#1a2847]">{profile?.csrRegNo || "—"}</p>
                )}
              </div>

              {/* Industry */}
              <div>
                <label className="text-xs font-semibold text-[#64748b] uppercase block mb-1">Industry</label>
                {editing ? (
                  <select value={form.industry} onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e5e7eb] rounded-xl text-sm focus:border-[#06b6d4] focus:outline-none">
                    <option value="">Select Industry</option>
                    {INDUSTRIES.map((ind) => <option key={ind}>{ind}</option>)}
                  </select>
                ) : (
                  <p className="px-4 py-3 bg-[#f8fafc] rounded-xl text-sm text-[#1a2847]">{profile?.industry || "—"}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-semibold text-[#64748b] uppercase block mb-1">
                  <Phone className="inline w-3.5 h-3.5 mr-1" />Phone
                </label>
                {editing ? (
                  <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e5e7eb] rounded-xl text-sm focus:border-[#06b6d4] focus:outline-none" />
                ) : (
                  <p className="px-4 py-3 bg-[#f8fafc] rounded-xl text-sm text-[#1a2847]">{profile?.phone || "—"}</p>
                )}
              </div>

              {/* Annual CSR Budget */}
              <div>
                <label className="text-xs font-semibold text-[#64748b] uppercase block mb-1">Annual CSR Budget (₹)</label>
                {editing ? (
                  <input type="number" value={form.totalBudget} onChange={(e) => setForm((f) => ({ ...f, totalBudget: e.target.value }))}
                    placeholder="50000000"
                    className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e5e7eb] rounded-xl text-sm focus:border-[#06b6d4] focus:outline-none" />
                ) : (
                  <p className="px-4 py-3 bg-[#f8fafc] rounded-xl text-sm font-bold text-[#0ea5e9]">{fmt(profile?.totalBudget || 0)}</p>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-[#64748b] uppercase block mb-1">
                  <MapPin className="inline w-3.5 h-3.5 mr-1" />Registered Address
                </label>
                {editing ? (
                  <input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    placeholder="Bandra Kurla Complex, Mumbai, Maharashtra"
                    className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e5e7eb] rounded-xl text-sm focus:border-[#06b6d4] focus:outline-none" />
                ) : (
                  <p className="px-4 py-3 bg-[#f8fafc] rounded-xl text-sm text-[#1a2847]">{profile?.address || "—"}</p>
                )}
              </div>

              {/* Wallet Address */}
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-[#64748b] uppercase block mb-1">
                  <Wallet className="inline w-3.5 h-3.5 mr-1" />Polygon Wallet Address
                </label>
                {editing ? (
                  <input value={form.walletAddress} onChange={(e) => setForm((f) => ({ ...f, walletAddress: e.target.value }))}
                    placeholder="0x..."
                    className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e5e7eb] rounded-xl text-sm font-mono focus:border-[#06b6d4] focus:outline-none" />
                ) : (
                  <p className="px-4 py-3 bg-[#f8fafc] rounded-xl text-sm font-mono text-[#1a2847] break-all">
                    {profile?.walletAddress || "Not connected"}
                  </p>
                )}
              </div>

              {/* Email (read-only) */}
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-[#64748b] uppercase block mb-1">
                  <Mail className="inline w-3.5 h-3.5 mr-1" />Email Address
                </label>
                <p className="px-4 py-3 bg-[#f1f5f9] rounded-xl text-sm text-[#64748b] flex items-center gap-2">
                  {profile?.email}
                  <span className="text-xs bg-[#e2e8f0] px-2 py-0.5 rounded-full">Read-only</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Utilization Bar */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#1a2847]">CSR Budget Utilization</h3>
            <span className="text-sm font-semibold text-[#0ea5e9]">{profile?.utilizationPct || 0}% allocated</span>
          </div>
          <div className="w-full bg-[#e5e7eb] rounded-full h-4 overflow-hidden">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] transition-all duration-700"
              style={{ width: `${Math.min(profile?.utilizationPct || 0, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-3 text-sm">
            <div>
              <p className="text-xs text-[#64748b]">Allocated</p>
              <p className="font-bold text-[#10b981]">{fmt(profile?.totalAllocated || 0)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#64748b]">Remaining</p>
              <p className="font-bold text-[#f59e0b]">{fmt(Math.max((profile?.totalBudget || 0) - (profile?.totalAllocated || 0), 0))}</p>
            </div>
          </div>
          {(profile?.utilizationPct || 0) < 2 && (
            <p className="mt-4 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
              ⚠️ Section 135 requires at least 2% of average net profit to be spent on CSR. Ensure you allocate sufficient funds before the financial year ends.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
