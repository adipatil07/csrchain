"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Star,
  MapPin,
  Mail,
  Clock,
  Award,
  CheckCircle,
  Shield,
  Edit3,
  Plus,
  X,
  Loader2,
  Save,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProfileData {
  id: string;
  name: string;
  email: string;
  skills: string[];
  totalHours: number;
  location: string | null;
  availability: Record<string, string> | null;
  walletAddress: string | null;
  certificatesCount: number;
  projectsCompleted: number;
  rating: number;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOT_OPTIONS = ["Unavailable", "Morning", "Afternoon", "Evening", "Full Day"];

const defaultAvailability: Record<string, string> = {
  Mon: "Unavailable",
  Tue: "Unavailable",
  Wed: "Unavailable",
  Thu: "Unavailable",
  Fri: "Unavailable",
  Sat: "Unavailable",
  Sun: "Unavailable",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Editable fields
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [availability, setAvailability] = useState<Record<string, string>>(defaultAvailability);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/volunteer/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setProfile(json);
      setName(json.name ?? "");
      setLocation(json.location ?? "");
      setSkills(json.skills ?? []);
      if (json.availability) setAvailability(json.availability);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/volunteer/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, location, skills, availability }),
      });
      if (res.ok) {
        showToast("Profile saved successfully!");
        setEditing(false);
        fetchProfile();
      } else {
        const json = await res.json();
        showToast(json.message ?? "Failed to save profile");
      }
    } catch {
      showToast("Network error. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setNewSkill("");
    }
  };

  const removeSkill = (s: string) => setSkills(skills.filter((x) => x !== s));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-blue-700 text-white px-5 py-3 rounded-xl shadow-lg font-semibold">
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: profile card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600"></div>
            <div className="p-6 -mt-12 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full border-4 border-white text-white text-3xl font-bold shadow-lg">
                {initials || "V"}
              </div>
              <h2 className="text-xl font-bold text-gray-800 mt-3">{profile?.name}</h2>
              <p className="text-sm text-gray-500">{profile?.email}</p>
              <div className="flex items-center justify-center gap-1 my-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-5 h-5 ${
                      s <= Math.round(profile?.rating ?? 3) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-semibold text-gray-700">{profile?.rating?.toFixed(1) ?? "3.0"}</span>
              </div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100">
                  <Shield className="w-3 h-3" />
                  Verified Volunteer
                </span>
              </div>
              <div className="space-y-2 pt-4 border-t border-gray-200">
                {editing ? (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Profile
                  </button>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
                {editing && (
                  <button
                    onClick={() => { setEditing(false); fetchProfile(); }}
                    className="w-full py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Total Hours</p>
                  <p className="text-lg font-bold text-gray-800">{profile?.totalHours ?? 0}h</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Projects</p>
                  <p className="text-lg font-bold text-gray-800">
                    {profile?.projectsCompleted ?? 0} Accepted
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Award className="w-5 h-5 text-orange-600" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Certificates</p>
                  <p className="text-lg font-bold text-gray-800">
                    {profile?.certificatesCount ?? 0} NFTs
                  </p>
                </div>
              </div>
              {profile?.location && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-bold text-gray-800">{profile.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Wallet */}
          {profile?.walletAddress && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Wallet</h3>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-gray-500 mb-1">Polygon Address</p>
                <p className="font-mono text-xs text-blue-700 break-all">
                  {profile.walletAddress}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Full Name</label>
                {editing ? (
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                ) : (
                  <p className="font-medium text-gray-800">{profile?.name}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email
                </label>
                <p className="font-medium text-gray-800">{profile?.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Location
                </label>
                {editing ? (
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mumbai, Maharashtra"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                ) : (
                  <p className="font-medium text-gray-800">{profile?.location ?? "—"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map((s, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100"
                >
                  {s}
                  {editing && (
                    <button onClick={() => removeSkill(s)} className="hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
              {skills.length === 0 && (
                <p className="text-sm text-gray-400">No skills added yet.</p>
              )}
            </div>
            {editing && (
              <div className="flex gap-2">
                <input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  placeholder="Add a skill"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  onClick={addSkill}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Availability Schedule</h3>
            <div className="grid grid-cols-7 gap-2">
              {DAYS.map((day) => {
                const slot = availability[day] ?? "Unavailable";
                return (
                  <div
                    key={day}
                    className={`text-center p-3 rounded-lg border-2 ${
                      slot === "Unavailable"
                        ? "border-gray-200 bg-gray-50 text-gray-400"
                        : slot === "Full Day"
                          ? "border-green-300 bg-green-50 text-green-700"
                          : "border-blue-300 bg-blue-50 text-blue-700"
                    }`}
                  >
                    <p className="text-xs font-bold">{day}</p>
                    {editing ? (
                      <select
                        value={slot}
                        onChange={(e) =>
                          setAvailability({ ...availability, [day]: e.target.value })
                        }
                        className="mt-1 w-full text-[9px] border-0 bg-transparent focus:outline-none text-center"
                      >
                        {SLOT_OPTIONS.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-[10px] mt-1">{slot}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
