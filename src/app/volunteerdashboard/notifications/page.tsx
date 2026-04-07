"use client";

import React, { useState } from "react";
import {
  Bell,
  CheckCircle,
  Award,
  MessageSquare,
  Calendar,
  AlertCircle,
  Users,
  CheckCheck,
  Shield,
} from "lucide-react";

type Category = "All" | "Application Update" | "Event Reminder" | "Certificate Issued" | "NGO Message";

type Notif = {
  id: number;
  category: Exclude<Category, "All">;
  title: string;
  message: string;
  group: "Today" | "Yesterday" | "Earlier";
  unread: boolean;
  ngo?: string;
};

const initial: Notif[] = [
  {
    id: 1,
    category: "Certificate Issued",
    title: "Certificate minted on Polygon",
    message:
      "Your NFT certificate for Versova Beach Cleanup has been issued. Tx: 0x7a8f...9e2c",
    group: "Today",
    unread: true,
    ngo: "Coastal Care India",
  },
  {
    id: 2,
    category: "Event Reminder",
    title: "Event starts in 2 hours",
    message: "Teaching Session at Dharavi Community Center begins at 02:00 PM.",
    group: "Today",
    unread: true,
    ngo: "Education First India",
  },
  {
    id: 3,
    category: "Application Update",
    title: "Application Accepted",
    message:
      "Congratulations! You have been accepted for Food Distribution Program in Andheri West.",
    group: "Yesterday",
    unread: true,
    ngo: "Hope Foundation",
  },
  {
    id: 4,
    category: "NGO Message",
    title: "Thank you note from Green Earth",
    message:
      "Thank you for participating in our tree plantation drive. Your impact is being measured!",
    group: "Yesterday",
    unread: false,
    ngo: "Green Earth Foundation",
  },
  {
    id: 5,
    category: "Event Reminder",
    title: "Location changed",
    message:
      "Beach Cleanup Initiative has been moved from Juhu to Versova Beach. Please arrive by 9 AM.",
    group: "Earlier",
    unread: false,
    ngo: "Coastal Care India",
  },
  {
    id: 6,
    category: "Certificate Issued",
    title: "Certificate signed by issuing NGO",
    message:
      "Youth Mentorship Program certificate has been signed and anchored to Polygon.",
    group: "Earlier",
    unread: false,
    ngo: "Tech for All Foundation",
  },
  {
    id: 7,
    category: "Application Update",
    title: "New badge earned",
    message:
      "You earned the Community Hero badge for crossing 100 verified volunteering hours.",
    group: "Earlier",
    unread: false,
  },
];

const categoryConfig: Record<
  Exclude<Category, "All">,
  { icon: React.ElementType; bg: string; color: string }
> = {
  "Application Update": { icon: Users, bg: "bg-blue-100", color: "text-blue-600" },
  "Event Reminder": { icon: Calendar, bg: "bg-yellow-100", color: "text-yellow-600" },
  "Certificate Issued": { icon: Award, bg: "bg-purple-100", color: "text-purple-600" },
  "NGO Message": { icon: MessageSquare, bg: "bg-green-100", color: "text-green-600" },
};

const categories: Category[] = [
  "All",
  "Application Update",
  "Event Reminder",
  "Certificate Issued",
  "NGO Message",
];

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notif[]>(initial);
  const [active, setActive] = useState<Category>("All");

  const unreadCount = notifs.filter((n) => n.unread).length;

  const filtered = active === "All" ? notifs : notifs.filter((n) => n.category === active);

  const groups: ("Today" | "Yesterday" | "Earlier")[] = ["Today", "Yesterday", "Earlier"];

  const markAllRead = () => setNotifs(notifs.map((n) => ({ ...n, unread: false })));
  const toggleRead = (id: number) =>
    setNotifs(notifs.map((n) => (n.id === id ? { ...n, unread: false } : n)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
              {unreadCount > 0 && (
                <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Stay updated on applications, events and on-chain issuances
            </p>
          </div>
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((cat) => {
            const count =
              cat === "All"
                ? notifs.length
                : notifs.filter((n) => n.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  active === cat
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    active === cat ? "bg-white/20" : "bg-white"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grouped lists */}
      {groups.map((group) => {
        const items = filtered.filter((n) => n.group === group);
        if (items.length === 0) return null;
        return (
          <div key={group} className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
              {group}
            </h3>
            <div className="space-y-3">
              {items.map((notif) => {
                const cfg = categoryConfig[notif.category];
                const Icon = cfg.icon;
                return (
                  <div
                    key={notif.id}
                    onClick={() => toggleRead(notif.id)}
                    className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                      notif.unread
                        ? "bg-blue-50/60 border-blue-200 hover:border-blue-300"
                        : "bg-gray-50 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${cfg.bg}`}>
                      <Icon className={`w-5 h-5 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1 gap-2">
                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                          {notif.title}
                          {notif.category === "Certificate Issued" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-mono">
                              <Shield className="w-3 h-3" />
                              on-chain
                            </span>
                          )}
                        </h4>
                        {notif.unread && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{notif.message}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="px-2 py-0.5 bg-white rounded border border-gray-200">
                          {notif.category}
                        </span>
                        {notif.ngo && <span>{notif.ngo}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No notifications in this category</p>
        </div>
      )}
    </div>
  );
}
