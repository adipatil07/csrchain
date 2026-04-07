"use client";

import React, { useMemo, useState } from "react";
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
} from "lucide-react";

type Project = {
  id: number;
  title: string;
  ngo: string;
  ngoInitials: string;
  location: string;
  city: string;
  skills: string[];
  volunteers: number;
  maxVolunteers: number;
  date: string;
  duration: string;
  category: string;
  description: string;
  status: "Open" | "Full" | "Closing Soon";
};

const allProjects: Project[] = [
  {
    id: 1,
    title: "Versova Beach Cleanup Initiative",
    ngo: "Coastal Care India",
    ngoInitials: "CC",
    location: "Versova Beach",
    city: "Mumbai",
    skills: ["Physical Work", "Team Work"],
    volunteers: 45,
    maxVolunteers: 50,
    date: "2026-04-20",
    duration: "4 hours",
    category: "Environment",
    description:
      "Join our flagship coastal cleanup drive to remove plastic waste from Versova beach. Gloves and bags provided.",
    status: "Closing Soon",
  },
  {
    id: 2,
    title: "Digital Literacy Workshop",
    ngo: "Tech for All Foundation",
    ngoInitials: "TA",
    location: "Powai Municipal School",
    city: "Mumbai",
    skills: ["Teaching", "Technology"],
    volunteers: 12,
    maxVolunteers: 15,
    date: "2026-04-22",
    duration: "3 hours",
    category: "Education",
    description:
      "Teach basic computer skills to government school students aged 12-16. Curriculum provided.",
    status: "Open",
  },
  {
    id: 3,
    title: "Blood Donation Camp",
    ngo: "Life Savers Trust",
    ngoInitials: "LS",
    location: "Bandra Kurla Complex",
    city: "Mumbai",
    skills: ["Healthcare", "Organization"],
    volunteers: 20,
    maxVolunteers: 20,
    date: "2026-04-25",
    duration: "6 hours",
    category: "Healthcare",
    description:
      "Help organize a large-scale blood donation camp with Red Cross in collaboration with major hospitals.",
    status: "Full",
  },
  {
    id: 4,
    title: "Street Children Education Drive",
    ngo: "Udaan Foundation",
    ngoInitials: "UF",
    location: "Connaught Place",
    city: "Delhi",
    skills: ["Teaching", "Child Care"],
    volunteers: 8,
    maxVolunteers: 20,
    date: "2026-04-28",
    duration: "5 hours",
    category: "Education",
    description:
      "Mentor and teach street children basic reading, writing and math skills in open classroom setup.",
    status: "Open",
  },
  {
    id: 5,
    title: "Tree Plantation Drive - Cubbon Park",
    ngo: "Green Earth Foundation",
    ngoInitials: "GE",
    location: "Cubbon Park",
    city: "Bangalore",
    skills: ["Physical Work", "Environment"],
    volunteers: 30,
    maxVolunteers: 80,
    date: "2026-05-02",
    duration: "4 hours",
    category: "Environment",
    description:
      "Plant 500 native saplings as part of Bengaluru's urban reforestation mission. Tools provided.",
    status: "Open",
  },
  {
    id: 6,
    title: "Elderly Care Visit Program",
    ngo: "HelpAge India",
    ngoInitials: "HA",
    location: "Vasant Kunj Old Age Home",
    city: "Delhi",
    skills: ["Empathy", "Communication"],
    volunteers: 6,
    maxVolunteers: 12,
    date: "2026-05-05",
    duration: "3 hours",
    category: "Healthcare",
    description:
      "Spend quality time with elderly residents, organize activities, and assist caregivers.",
    status: "Open",
  },
];

const skillOptions = ["All Skills", "Teaching", "Healthcare", "Physical Work", "Technology", "Child Care", "Empathy"];
const cityOptions = ["All Cities", "Mumbai", "Delhi", "Bangalore"];
const categoryOptions = ["All Categories", "Education", "Environment", "Healthcare"];

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("All Skills");
  const [city, setCity] = useState("All Cities");
  const [category, setCategory] = useState("All Categories");
  const [selected, setSelected] = useState<Project | null>(null);

  const filtered = useMemo(() => {
    return allProjects.filter((p) => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.ngo.toLowerCase().includes(search.toLowerCase())) return false;
      if (skill !== "All Skills" && !p.skills.includes(skill)) return false;
      if (city !== "All Cities" && p.city !== city) return false;
      if (category !== "All Categories" && p.category !== category) return false;
      return true;
    });
  }, [search, skill, city, category]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Project Explorer</h2>
            <p className="text-sm text-gray-500">
              Discover verified volunteering opportunities across India
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
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {cityOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <select
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {skillOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categoryOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700">
            <Filter className="w-4 h-4" />
            More
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((project) => (
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
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  project.status === "Open"
                    ? "bg-green-100 text-green-700"
                    : project.status === "Closing Soon"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {project.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {project.skills.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium"
                >
                  {s}
                </span>
              ))}
              <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                {project.category}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {project.location}, {project.city}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {project.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {project.duration}
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-blue-600" />
                On-chain verified
              </span>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {project.volunteers}/{project.maxVolunteers} volunteers
                </span>
                <span>
                  {Math.round((project.volunteers / project.maxVolunteers) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full h-2"
                  style={{
                    width: `${(project.volunteers / project.maxVolunteers) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                disabled={project.status === "Full"}
                className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                  project.status === "Full"
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
                }`}
              >
                {project.status === "Full" ? "Project Full" : "Apply Now"}
              </button>
              <button
                onClick={() => setSelected(project)}
                className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

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
                <p className="font-semibold text-gray-800">
                  {selected.location}, {selected.city}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Date</p>
                <p className="font-semibold text-gray-800">{selected.date}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Duration</p>
                <p className="font-semibold text-gray-800">{selected.duration}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Category</p>
                <p className="font-semibold text-gray-800">{selected.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg mb-4">
              <Shield className="w-4 h-4 text-blue-600" />
              <p className="text-xs text-blue-700">
                Smart contract anchored on Polygon. Attendance and certificate issuance
                will be cryptographically recorded.
              </p>
            </div>
            <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700">
              Apply for this Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
