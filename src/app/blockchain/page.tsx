"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Shield, Link2, Cpu, CheckCircle2, Clock, Award, Banknote,
  RefreshCw, AlertTriangle, ChevronRight, Database, Lock,
  Zap, Globe, Eye, FileCheck, Users, TrendingUp,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Tx {
  hash: string;
  type: string;
  typeColor: string;
  description: string;
  actor: string;
  amount: string;
  timestamp: string;
  contract: string;
}

interface ExplorerData {
  network: {
    name: string;
    chainId: number;
    rpcUrl: string;
    blockNumber: number;
    blockTimestamp: string | null;
  };
  contracts: { escrow: string; attendance: string; certificate: string };
  stats: {
    totalTx: number;
    escrowLocks: number;
    fundReleases: number;
    attendanceTx: number;
    certificatesMinted: number;
  };
  transactions: Tx[];
}

// ─── Traditional vs Blockchain comparison data ─────────────────────────────
const comparison = [
  {
    aspect: "Fund Transparency",
    traditional: "Manual ledgers, reconciled monthly. Difficult to audit.",
    blockchain: "Every rupee locked in smart contract escrow. Verifiable by anyone.",
    icon: Eye,
  },
  {
    aspect: "Fraud Prevention",
    traditional: "No enforcement. Funds can be misused after transfer.",
    blockchain: "Funds automatically released only on verified milestone proof.",
    icon: Shield,
  },
  {
    aspect: "Audit Trail",
    traditional: "Excel/PDF reports. Can be altered. No timestamp proof.",
    blockchain: "Immutable on-chain record. Hash-verified. Timestamp by block.",
    icon: FileCheck,
  },
  {
    aspect: "Volunteer Records",
    traditional: "Attendance on paper sheets. Easy to forge.",
    blockchain: "Each check-out written to blockchain. Cannot be altered.",
    icon: Users,
  },
  {
    aspect: "Certificates",
    traditional: "PDF certificates. Can be faked or duplicated.",
    blockchain: "NFT on Polygon. Globally verifiable. Cannot be duplicated.",
    icon: Award,
  },
  {
    aspect: "Milestone Verification",
    traditional: "Email or paper submission. No proof of authenticity.",
    blockchain: "Proof uploaded to IPFS (permanent). Hash recorded on-chain.",
    icon: TrendingUp,
  },
  {
    aspect: "Trust",
    traditional: "Depends on the organization's reputation.",
    blockchain: "Code is law. Smart contract enforces rules automatically.",
    icon: Lock,
  },
  {
    aspect: "Speed of Release",
    traditional: "Funds released after manual approval — days to weeks.",
    blockchain: "Smart contract releases funds in seconds on approval.",
    icon: Zap,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function BlockchainExplorer() {
  const [data, setData] = useState<ExplorerData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"explorer" | "comparison" | "contracts">("explorer");
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/blockchain/explorer");
      if (!res.ok) {
        const err = await res.json();
        setError(err.error ?? "Failed to connect to blockchain node");
        return;
      }
      setError(null);
      setData(await res.json());
    } catch {
      setError("Cannot connect to blockchain node. Make sure 'npx hardhat node' is running.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // auto-refresh every 10s
    return () => clearInterval(interval);
  }, [fetchData]);

  const typeIcon: Record<string, React.ElementType> = {
    "Escrow Lock": Lock,
    "Fund Release": Banknote,
    "Attendance": Clock,
    "NFT Certificate": Award,
  };

  return (
    <div className="min-h-screen bg-[#0f1c3f]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0f1c3f] via-[#1a2847] to-[#0f1c3f] border-b border-[#2d3f6b] px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#0ea5e9]/30">
              <Cpu className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">CSRChain Blockchain Explorer</h1>
              <p className="text-[#7e9bc9] text-sm">Real-time view of all on-chain CSR transactions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {data && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/30">
                <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
                <span className="text-xs font-semibold text-[#10b981]">Node Online</span>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ef4444]/10 border border-[#ef4444]/30">
                <div className="w-2 h-2 rounded-full bg-[#ef4444]"></div>
                <span className="text-xs font-semibold text-[#ef4444]">Node Offline</span>
              </div>
            )}
            <button
              onClick={fetchData}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a2847] border border-[#2d3f6b] rounded-xl text-[#7e9bc9] hover:text-white hover:border-[#0ea5e9] transition-all text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#1a2847] border-b border-[#2d3f6b] px-6">
        <div className="max-w-7xl mx-auto flex gap-1">
          {(["explorer", "comparison", "contracts"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-semibold capitalize border-b-2 transition-all ${
                activeTab === tab
                  ? "border-[#0ea5e9] text-[#0ea5e9]"
                  : "border-transparent text-[#7e9bc9] hover:text-white"
              }`}
            >
              {tab === "explorer" ? "Transaction Explorer" : tab === "comparison" ? "Traditional vs Blockchain" : "Smart Contracts"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* ── EXPLORER TAB ────────────────────────────────────────────── */}
        {activeTab === "explorer" && (
          <>
            {error ? (
              <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-2xl p-8 text-center">
                <AlertTriangle className="w-12 h-12 text-[#ef4444] mx-auto mb-3" />
                <p className="text-white font-semibold text-lg mb-1">Blockchain Node Not Running</p>
                <p className="text-[#7e9bc9] text-sm">{error}</p>
                <code className="mt-4 block bg-[#0f1c3f] text-[#06b6d4] px-4 py-2 rounded-lg text-sm mx-auto max-w-sm">
                  npx hardhat node
                </code>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin w-10 h-10 border-4 border-[#0ea5e9] border-t-transparent rounded-full"></div>
              </div>
            ) : data ? (
              <>
                {/* Network Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Network", value: data.network.name, icon: Globe, color: "text-[#0ea5e9]" },
                    { label: "Block Number", value: `#${data.network.blockNumber.toLocaleString()}`, icon: Database, color: "text-[#06b6d4]" },
                    { label: "Chain ID", value: data.network.chainId.toString(), icon: Link2, color: "text-[#8b5cf6]" },
                    { label: "Total On-chain Tx", value: data.stats.totalTx.toString(), icon: CheckCircle2, color: "text-[#10b981]" },
                  ].map((s) => (
                    <div key={s.label} className="bg-[#1a2847] border border-[#2d3f6b] rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[#7e9bc9] text-xs">{s.label}</p>
                        <s.icon className={`w-4 h-4 ${s.color}`} />
                      </div>
                      <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Tx Type Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Escrow Locks", value: data.stats.escrowLocks, color: "#0ea5e9", icon: Lock },
                    { label: "Fund Releases", value: data.stats.fundReleases, color: "#10b981", icon: Banknote },
                    { label: "Attendance Tx", value: data.stats.attendanceTx, color: "#f59e0b", icon: Clock },
                    { label: "NFTs Minted", value: data.stats.certificatesMinted, color: "#8b5cf6", icon: Award },
                  ].map((s) => (
                    <div key={s.label} className="bg-[#1a2847] border border-[#2d3f6b] rounded-2xl p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${s.color}20` }}>
                        <s.icon className="w-6 h-6" style={{ color: s.color }} />
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-white">{s.value}</p>
                        <p className="text-[#7e9bc9] text-xs">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Transaction List */}
                <div className="bg-[#1a2847] border border-[#2d3f6b] rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#2d3f6b] flex items-center justify-between">
                    <h2 className="text-white font-bold text-lg flex items-center gap-2">
                      <Link2 className="w-5 h-5 text-[#0ea5e9]" /> On-Chain Transactions
                    </h2>
                    <span className="text-xs text-[#7e9bc9] bg-[#0f1c3f] px-3 py-1 rounded-full">
                      Auto-refreshing every 10s
                    </span>
                  </div>

                  {data.transactions.length === 0 ? (
                    <div className="p-12 text-center">
                      <Cpu className="w-12 h-12 text-[#2d3f6b] mx-auto mb-3" />
                      <p className="text-[#7e9bc9] font-semibold">No transactions yet</p>
                      <p className="text-[#4a5f8a] text-sm mt-1">Approve a project or volunteer checkout to generate real blockchain transactions</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#2d3f6b]">
                      {data.transactions.map((tx, i) => {
                        const Icon = typeIcon[tx.type] ?? Link2;
                        return (
                          <div key={i} className="px-6 py-4 hover:bg-[#0f1c3f]/50 transition-all">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                                style={{ background: `${tx.typeColor}20` }}>
                                <Icon className="w-5 h-5" style={{ color: tx.typeColor }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${tx.typeColor}20`, color: tx.typeColor }}>
                                    {tx.type}
                                  </span>
                                  <span className="text-[#7e9bc9] text-xs">{new Date(tx.timestamp).toLocaleString("en-IN")}</span>
                                </div>
                                <p className="text-white font-semibold text-sm">{tx.description}</p>
                                <p className="text-[#7e9bc9] text-xs mt-0.5">by {tx.actor} · {tx.amount}</p>
                                <div className="mt-2 font-mono text-xs bg-[#0f1c3f] px-3 py-1.5 rounded-lg text-[#06b6d4] flex items-center gap-2">
                                  <CheckCircle2 className="w-3 h-3 text-[#10b981] flex-shrink-0" />
                                  <span className="truncate">{tx.hash}</span>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <span className="text-xs bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 px-2 py-0.5 rounded-full font-semibold">
                                  Confirmed
                                </span>
                                <p className="text-[#4a5f8a] text-xs mt-2 font-mono">
                                  {tx.hash.slice(0, 10)}...
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </>
        )}

        {/* ── COMPARISON TAB ──────────────────────────────────────────── */}
        {activeTab === "comparison" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#ef4444]/10 via-[#1a2847] to-[#10b981]/10 border border-[#2d3f6b] rounded-2xl p-6">
              <h2 className="text-white font-bold text-xl text-center mb-1">Traditional CSR Management vs CSRChain</h2>
              <p className="text-[#7e9bc9] text-sm text-center">Why blockchain changes everything for CSR compliance and transparency</p>
            </div>

            {/* Header row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#1a2847] border border-[#2d3f6b] rounded-xl p-4 text-center">
                <Database className="w-8 h-8 text-[#ef4444] mx-auto mb-2" />
                <p className="text-white font-bold">Traditional System</p>
                <p className="text-[#7e9bc9] text-xs mt-1">Manual, Centralized, Mutable</p>
              </div>
              <div className="bg-[#1a2847] border border-[#2d3f6b] rounded-xl p-4 text-center flex items-center justify-center">
                <ChevronRight className="w-8 h-8 text-[#2d3f6b]" />
              </div>
              <div className="bg-gradient-to-br from-[#0ea5e9]/10 to-[#06b6d4]/10 border border-[#0ea5e9]/30 rounded-xl p-4 text-center">
                <Shield className="w-8 h-8 text-[#0ea5e9] mx-auto mb-2" />
                <p className="text-white font-bold">CSRChain (Blockchain)</p>
                <p className="text-[#7e9bc9] text-xs mt-1">Automated, Decentralized, Immutable</p>
              </div>
            </div>

            {/* Comparison rows */}
            {comparison.map((row) => (
              <div key={row.aspect} className="grid grid-cols-3 gap-4 items-stretch">
                {/* Traditional */}
                <div className="bg-[#1a2847] border border-[#ef4444]/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#ef4444]"></div>
                    <span className="text-[#ef4444] text-xs font-bold">PROBLEM</span>
                  </div>
                  <p className="text-[#94a3b8] text-sm">{row.traditional}</p>
                </div>

                {/* Aspect label */}
                <div className="bg-[#0f1c3f] border border-[#2d3f6b] rounded-xl p-4 flex flex-col items-center justify-center text-center">
                  <row.icon className="w-6 h-6 text-[#0ea5e9] mb-2" />
                  <p className="text-white font-bold text-sm">{row.aspect}</p>
                </div>

                {/* Blockchain */}
                <div className="bg-[#1a2847] border border-[#10b981]/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
                    <span className="text-[#10b981] text-xs font-bold">SOLVED</span>
                  </div>
                  <p className="text-[#94a3b8] text-sm">{row.blockchain}</p>
                </div>
              </div>
            ))}

            {/* Key benefit callout */}
            <div className="bg-gradient-to-r from-[#0ea5e9]/10 to-[#06b6d4]/10 border border-[#0ea5e9]/30 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-4 text-center">How CSRChain Flow Works</h3>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {[
                  { label: "Company Allocates Funds", color: "#0ea5e9" },
                  { label: "→", color: "#4a5f8a" },
                  { label: "Smart Contract Locks in Escrow", color: "#06b6d4" },
                  { label: "→", color: "#4a5f8a" },
                  { label: "NGO Submits Proof to IPFS", color: "#8b5cf6" },
                  { label: "→", color: "#4a5f8a" },
                  { label: "Company Verifies On-chain", color: "#f59e0b" },
                  { label: "→", color: "#4a5f8a" },
                  { label: "Funds Auto-Released", color: "#10b981" },
                  { label: "→", color: "#4a5f8a" },
                  { label: "NFT Certificate Minted", color: "#8b5cf6" },
                ].map((step, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-sm font-semibold"
                    style={{ color: step.color, background: step.color === "#4a5f8a" ? "transparent" : `${step.color}15` }}
                  >
                    {step.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── CONTRACTS TAB ───────────────────────────────────────────── */}
        {activeTab === "contracts" && data && (
          <div className="space-y-6">
            <div className="bg-[#1a2847] border border-[#2d3f6b] rounded-2xl p-6">
              <h2 className="text-white font-bold text-xl mb-1">Deployed Smart Contracts</h2>
              <p className="text-[#7e9bc9] text-sm">These contracts are the backbone of CSRChain — they enforce rules automatically, with no middleman.</p>
            </div>

            {[
              {
                name: "CSREscrow.sol",
                address: data.contracts.escrow,
                color: "#0ea5e9",
                icon: Lock,
                description: "Holds CSR funds in escrow until milestones are verified. Prevents misuse of funds by enforcing on-chain conditions.",
                functions: [
                  { fn: "lockFunds(projectId, company)", desc: "Called when company approves a project. Locks allocated funds." },
                  { fn: "releaseFunds(projectId, milestoneId, recipient, amount)", desc: "Called on milestone approval. Releases exact amount to NGO." },
                  { fn: "getEscrow(projectId)", desc: "Anyone can verify the escrow balance for any project." },
                ],
              },
              {
                name: "VolunteerAttendance.sol",
                address: data.contracts.attendance,
                color: "#f59e0b",
                icon: Clock,
                description: "Records every volunteer check-in and check-out permanently on-chain. Prevents fake attendance records.",
                functions: [
                  { fn: "recordAttendance(attendanceId, volunteerId, projectId, checkIn, checkOut, hours)", desc: "Written when volunteer checks out." },
                  { fn: "getRecord(attendanceId)", desc: "Verify any attendance record on-chain." },
                ],
              },
              {
                name: "VolunteerCertificate.sol",
                address: data.contracts.certificate,
                color: "#8b5cf6",
                icon: Award,
                description: "Issues NFT certificates to volunteers. Each certificate is a unique token on the blockchain — cannot be faked or duplicated.",
                functions: [
                  { fn: "issueCertificate(volunteerId, projectId, ipfsHash)", desc: "Mints an NFT with IPFS metadata. Returns tokenId." },
                  { fn: "getCertificate(tokenId)", desc: "Verify any certificate by its token ID." },
                  { fn: "getVolunteerCertificates(volunteerId)", desc: "List all NFTs owned by a volunteer." },
                ],
              },
            ].map((contract) => (
              <div key={contract.name} className="bg-[#1a2847] border border-[#2d3f6b] rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-[#2d3f6b] flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${contract.color}20` }}>
                    <contract.icon className="w-6 h-6" style={{ color: contract.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">{contract.name}</h3>
                    <p className="font-mono text-xs text-[#7e9bc9] mt-0.5">{contract.address || "Not deployed"}</p>
                  </div>
                  <span className="text-xs bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 px-3 py-1 rounded-full font-semibold">
                    ✓ Deployed
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-[#94a3b8] text-sm">{contract.description}</p>
                  <div className="space-y-2">
                    <p className="text-[#7e9bc9] text-xs font-bold uppercase tracking-wider">Functions</p>
                    {contract.functions.map((f, i) => (
                      <div key={i} className="bg-[#0f1c3f] rounded-xl p-4">
                        <code className="text-[#06b6d4] text-sm font-mono">{f.fn}</code>
                        <p className="text-[#7e9bc9] text-xs mt-1">{f.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "contracts" && !data && (
          <div className="bg-[#1a2847] border border-[#f59e0b]/30 rounded-2xl p-8 text-center">
            <AlertTriangle className="w-10 h-10 text-[#f59e0b] mx-auto mb-3" />
            <p className="text-white font-semibold">Start the Hardhat node to view contract data</p>
            <code className="mt-3 block bg-[#0f1c3f] text-[#06b6d4] px-4 py-2 rounded-lg text-sm mx-auto max-w-xs">
              npx hardhat node
            </code>
          </div>
        )}
      </div>
    </div>
  );
}
