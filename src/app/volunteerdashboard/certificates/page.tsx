"use client";

import React from "react";
import {
  Award,
  CheckCircle,
  Download,
  ExternalLink,
  Shield,
  Link2,
  Trophy,
  Star,
  Sparkles,
} from "lucide-react";

const certificates = [
  {
    id: 1,
    title: "Community Service Excellence",
    project: "Versova Beach Cleanup",
    ngo: "Coastal Care India",
    issueDate: "2026-03-30",
    hours: 24,
    hash: "0x7a8f3b12e9c4d5678a9b0c1d2e3f4a5b6c7d8e9f",
    tokenId: "#4821",
    chain: "Polygon",
    verified: true,
  },
  {
    id: 2,
    title: "Youth Mentorship Program",
    project: "Digital Literacy Workshop",
    ngo: "Tech for All Foundation",
    issueDate: "2026-02-22",
    hours: 18,
    hash: "0x4d1e9c7f3a2b5c8d1e4f7a9b2c5d8e1f4a7b0c3d",
    tokenId: "#4702",
    chain: "Polygon",
    verified: true,
  },
  {
    id: 3,
    title: "Healthcare Support Volunteer",
    project: "Blood Donation Camp",
    ngo: "Life Savers Trust",
    issueDate: "2026-01-10",
    hours: 12,
    hash: "0x2b5a8d4e1c9f3a6b8d2e5c8f1a4b7d0e3c6f9a2b",
    tokenId: "#4550",
    chain: "Polygon",
    verified: true,
  },
  {
    id: 4,
    title: "Environmental Champion",
    project: "Tree Plantation Drive",
    ngo: "Green Earth Foundation",
    issueDate: "2025-12-18",
    hours: 16,
    hash: "0x9f3a6b8d2e5c8f1a4b7d0e3c6f9a2b5d8e1f4a7b",
    tokenId: "#4401",
    chain: "Polygon",
    verified: true,
  },
];

const badges = [
  { name: "First Step", description: "Completed first project", icon: Star, color: "from-blue-500 to-cyan-500", earned: true },
  { name: "Community Hero", description: "100+ hours volunteered", icon: Trophy, color: "from-yellow-500 to-orange-500", earned: true },
  { name: "Eco Warrior", description: "5 environmental projects", icon: Sparkles, color: "from-green-500 to-emerald-500", earned: true },
  { name: "Mentor", description: "Taught 50+ students", icon: Award, color: "from-purple-500 to-pink-500", earned: true },
  { name: "Dedication", description: "6 months active streak", icon: Shield, color: "from-red-500 to-rose-500", earned: false },
  { name: "Ambassador", description: "Referred 10 volunteers", icon: Star, color: "from-indigo-500 to-blue-500", earned: false },
];

export default function CertificatesPage() {
  const truncate = (s: string) => `${s.slice(0, 8)}...${s.slice(-6)}`;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 rounded-xl shadow-sm p-6 text-white flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Certificate Wallet</h2>
          <p className="text-blue-100 text-sm">
            Your achievements, cryptographically signed and permanently verifiable
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-3xl font-bold">{certificates.length}</p>
            <p className="text-xs text-blue-100">NFT Certificates</p>
          </div>
          <div className="h-10 w-px bg-white/30"></div>
          <div className="text-center">
            <p className="text-3xl font-bold">
              {certificates.reduce((a, b) => a + b.hours, 0)}
            </p>
            <p className="text-xs text-blue-100">Hours Certified</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-blue-400 hover:shadow-xl transition-all"
          >
            {/* NFT header */}
            <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-6 text-white">
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold border border-white/30">
                <Shield className="w-3 h-3" />
                {cert.chain}
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <Award className="w-10 h-10" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-xs text-blue-100 font-mono">Token {cert.tokenId}</p>
                  <h3 className="text-lg font-bold leading-tight mb-1">{cert.title}</h3>
                  <p className="text-sm text-blue-100">{cert.ngo}</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="mb-4 pb-4 border-b border-gray-200 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Project</span>
                  <span className="font-medium text-gray-800">{cert.project}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Issue Date</span>
                  <span className="font-medium text-gray-800">{cert.issueDate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Hours Logged</span>
                  <span className="font-medium text-gray-800">{cert.hours}h</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tx Hash</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-mono border border-blue-100">
                    <Link2 className="w-3 h-3" />
                    {truncate(cert.hash)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg mb-4">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <p className="text-xs text-green-700 font-semibold">
                  Verified on Polygon. Signed by issuing NGO smart contract.
                </p>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button className="flex-1 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Polygonscan
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Achievements / Badges */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Achievements and Badges</h2>
            <p className="text-sm text-gray-500">
              Unlock badges by hitting volunteer milestones
            </p>
          </div>
          <span className="text-sm text-gray-600">
            {badges.filter((b) => b.earned).length}/{badges.length} earned
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className={`text-center p-4 rounded-xl border-2 transition-all ${
                  badge.earned
                    ? "border-blue-200 bg-blue-50/40 hover:border-blue-400"
                    : "border-dashed border-gray-200 opacity-50"
                }`}
              >
                <div
                  className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 bg-gradient-to-br ${badge.color}`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-sm font-semibold text-gray-800">{badge.name}</p>
                <p className="text-xs text-gray-500">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
