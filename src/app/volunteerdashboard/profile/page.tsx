"use client";

import React, { useState } from "react";
import {
  Star,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Award,
  Clock,
  CheckCircle,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Plus,
  X,
  Shield,
  Edit3,
} from "lucide-react";

const defaultSkills = [
  "Teaching",
  "Healthcare",
  "Environmental Conservation",
  "Community Service",
  "Event Management",
  "Digital Literacy",
];

const interests = [
  "Child Education",
  "Climate Action",
  "Rural Development",
  "Animal Welfare",
];

const availability = [
  { day: "Mon", slot: "Evening" },
  { day: "Tue", slot: "Unavailable" },
  { day: "Wed", slot: "Evening" },
  { day: "Thu", slot: "Unavailable" },
  { day: "Fri", slot: "Evening" },
  { day: "Sat", slot: "Full Day" },
  { day: "Sun", slot: "Full Day" },
];

export default function ProfilePage() {
  const [skills, setSkills] = useState<string[]>(defaultSkills);
  const [newSkill, setNewSkill] = useState("");
  const [editing, setEditing] = useState(false);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (s: string) => setSkills(skills.filter((x) => x !== s));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: profile card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600"></div>
            <div className="p-6 -mt-12 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full border-4 border-white text-white text-3xl font-bold shadow-lg">
                AS
              </div>
              <h2 className="text-xl font-bold text-gray-800 mt-3">Aarav Sharma</h2>
              <p className="text-sm text-gray-500">Passionate changemaker</p>
              <div className="flex items-center justify-center gap-1 my-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-5 h-5 ${
                      s <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-semibold text-gray-700">4.8</span>
              </div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100">
                  <Shield className="w-3 h-3" />
                  Verified Volunteer
                </span>
              </div>
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setEditing(!editing)}
                  className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  {editing ? "Save Profile" : "Edit Profile"}
                </button>
                <button className="w-full py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50">
                  View Public Profile
                </button>
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
                  <p className="text-lg font-bold text-gray-800">156h</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Projects</p>
                  <p className="text-lg font-bold text-gray-800">8 Completed</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Award className="w-5 h-5 text-orange-600" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Certificates</p>
                  <p className="text-lg font-bold text-gray-800">5 NFTs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Social Links</h3>
            <div className="space-y-2">
              {[
                { icon: Linkedin, label: "linkedin.com/in/aaravsharma" },
                { icon: Twitter, label: "@aaravsharma" },
                { icon: Github, label: "github.com/aaravsharma" },
                { icon: Globe, label: "aaravsharma.dev" },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">About Me</h3>
            {editing ? (
              <textarea
                defaultValue="Third-year Computer Science student at IIT Bombay. Passionate about leveraging technology for social good, especially in education and environmental sustainability. I have been volunteering across Mumbai since 2023."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">
                Third-year Computer Science student at IIT Bombay. Passionate about
                leveraging technology for social good, especially in education and
                environmental sustainability. I have been volunteering across Mumbai
                since 2023.
              </p>
            )}
          </div>

          {/* Personal info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Full Name", value: "Aarav Sharma", icon: null },
                { label: "Email", value: "aarav.sharma@hope.org", icon: Mail },
                { label: "Phone", value: "+91 98765 43210", icon: Phone },
                { label: "Location", value: "Mumbai, Maharashtra", icon: MapPin },
                { label: "Date of Birth", value: "August 14, 2003", icon: Calendar },
                { label: "Blood Group", value: "O+", icon: null },
              ].map((field, idx) => {
                const Icon = field.icon;
                return (
                  <div key={idx}>
                    <label className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                      {Icon && <Icon className="w-3 h-3" />}
                      {field.label}
                    </label>
                    {editing ? (
                      <input
                        defaultValue={field.value}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    ) : (
                      <p className="font-medium text-gray-800">{field.value}</p>
                    )}
                  </div>
                );
              })}
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
                  <button
                    onClick={() => removeSkill(s)}
                    className="hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
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
          </div>

          {/* Interests */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((i, idx) => (
                <span
                  key={idx}
                  className="px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-100"
                >
                  {i}
                </span>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Availability Schedule</h3>
            <div className="grid grid-cols-7 gap-2">
              {availability.map((a, idx) => (
                <div
                  key={idx}
                  className={`text-center p-3 rounded-lg border-2 ${
                    a.slot === "Unavailable"
                      ? "border-gray-200 bg-gray-50 text-gray-400"
                      : a.slot === "Full Day"
                      ? "border-green-300 bg-green-50 text-green-700"
                      : "border-blue-300 bg-blue-50 text-blue-700"
                  }`}
                >
                  <p className="text-xs font-bold">{a.day}</p>
                  <p className="text-[10px] mt-1">{a.slot}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
