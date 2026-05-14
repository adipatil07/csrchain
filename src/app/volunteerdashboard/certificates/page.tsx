"use client";

import React, { useCallback, useEffect, useState } from "react";
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
  Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Cert {
  id: string;
  title: string;
  project: string;
  ngo: string;
  issueDate: string;
  hours: number;
  hash: string;
  ipfsHash: string;
  tokenId: string;
  chain: string;
  verified: boolean;
}

interface Badge {
  name: string;
  description: string;
  color: string;
  earned: boolean;
}

const BADGE_ICONS: Record<string, React.ElementType> = {
  "First Step": Star,
  "Community Hero": Trophy,
  "Eco Warrior": Sparkles,
  Mentor: Award,
  Dedication: Shield,
  Ambassador: Star,
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Cert[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/volunteer/certificates", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setCertificates(json.certificates ?? []);
      setBadges(json.badges ?? []);
      setTotalHours(json.totalHours ?? 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const truncate = (s: string) => `${s.slice(0, 8)}...${s.slice(-6)}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const earnedBadges = badges.filter((b) => b.earned).length;

  return (
    <div className="space-y-6">
      {/* Header banner */}
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
            <p className="text-3xl font-bold">{Math.round(totalHours)}</p>
            <p className="text-xs text-blue-100">Hours Certified</p>
          </div>
        </div>
      </div>

      {/* Certificate cards */}
      {certificates.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No certificates yet.</p>
          <p className="text-sm text-gray-400 mt-1">
            Complete volunteer projects to earn NFT certificates.
          </p>
        </div>
      ) : (
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
                  <a
                    href={`https://polygonscan.com/tx/${cert.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Polygonscan
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Achievements / Badges */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Achievements and Badges</h2>
            <p className="text-sm text-gray-500">Unlock badges by hitting volunteer milestones</p>
          </div>
          <span className="text-sm text-gray-600">
            {earnedBadges}/{badges.length} earned
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge, idx) => {
            const Icon = BADGE_ICONS[badge.name] ?? Award;
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
