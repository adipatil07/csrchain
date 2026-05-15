"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Filter,
  X,
  Clock,
  Shield,
  Building2,
  Target,
  CheckCircle,
  Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Project {
  id: string;
  title: string;
  ngo: string;
  ngoInitials: string;
  location: string;
  sector: string;
  description: string;
  budget: number;
  startDate: string | null;
  endDate: string | null;
  volunteerCount: number;
  myApplication: { id: string; status: string } | null;
}

const sectorOptions = ["All Sectors", "Education", "Environment", "Healthcare", "Livelihood", "Rural Dev"];

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All Sectors");
  const [selected, setSelected] = useState<Project | null>(null);
  const [applying, setApplying] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (sector !== "All Sectors") params.set("sector", sector);
      const res = await fetch(`/api/volunteer/projects?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setProjects(json.projects ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, sector]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filtered = useMemo(() => projects, [projects]);

  const handleApply = async (projectId: string) => {
    setApplying(projectId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/volunteer/apply", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
      });
      const json = await res.json();
      if (res.ok || res.status === 200) {
        setToast("Application submitted successfully!");
        setSelected(null);
        fetchProjects();
      } else {
        setToast(json.message ?? "Failed to apply");
      }
    } catch {
      setToast("Network error. Please try again.");
    } finally {
      setApplying(null);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const applicationLabel = (app: Project["myApplication"]) => {
    if (!app) return null;
    if (app.status === "ACCEPTED") return { text: "Accepted", cls: "bg-green-100 text-green-700" };
    if (app.status === "REJECTED") return { text: "Rejected", cls: "bg-red-100 text-red-700" };
    return { text: "Applied", cls: "bg-yellow-100 text-yellow-700" };
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg font-semibold">
          {toast}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Project Explorer</h2>
            <p className="text-sm text-gray-500">
              Discover verified volunteering opportunities
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700">
              {filtered.length} opportunities
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search projects or NGOs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sectorOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <button
            onClick={fetchProjects}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700"
          >
            <Filter className="w-4 h-4" />
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No active projects available right now.</p>
          <p className="text-sm text-gray-400 mt-1">
            Check back later or ask an NGO to post a project.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((project) => {
            const appLabel = applicationLabel(project.myApplication);
            return (
              <div
                key={project.id}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold">
                      {project.ngoInitials}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {project.ngo}
                      </p>
                    </div>
                  </div>
                  {appLabel ? (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${appLabel.cls}`}>
                      {appLabel.text}
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      Open
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                    {project.sector}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {project.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {project.startDate ?? "TBD"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {project.endDate ? `Until ${project.endDate}` : "Ongoing"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-blue-600" />
                    On-chain verified
                  </span>
                </div>

                <div className="mb-4">
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    {project.volunteerCount} volunteer{project.volunteerCount !== 1 ? "s" : ""} enrolled
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApply(project.id)}
                    disabled={!!project.myApplication || applying === project.id}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                      project.myApplication
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
                    }`}
                  >
                    {applying === project.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : project.myApplication ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        {appLabel?.text}
                      </>
                    ) : (
                      "Apply Now"
                    )}
                  </button>
                  <button
                    onClick={() => setSelected(project)}
                    className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-xl">
                  {selected.ngoInitials}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selected.title}</h3>
                  <p className="text-sm text-gray-500">{selected.ngo}</p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-700 mb-4">{selected.description}</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Location</p>
                <p className="font-semibold text-gray-800">{selected.location}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Start Date</p>
                <p className="font-semibold text-gray-800">{selected.startDate ?? "TBD"}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Sector</p>
                <p className="font-semibold text-gray-800">{selected.sector}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Budget</p>
                <p className="font-semibold text-gray-800">
                  ₹{selected.budget.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg mb-4">
              <Shield className="w-4 h-4 text-blue-600" />
              <p className="text-xs text-blue-700">
                Smart contract anchored on Polygon. Attendance and certificate issuance will be
                cryptographically recorded.
              </p>
            </div>
            <button
              onClick={() => handleApply(selected.id)}
              disabled={!!selected.myApplication || applying === selected.id}
              className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                selected.myApplication
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
              }`}
            >
              {applying === selected.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : selected.myApplication ? (
                "Already Applied"
              ) : (
                "Apply for this Project"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
