import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, serverError } from "@/lib/api-helpers";

type NotifCategory =
  | "Application Update"
  | "Event Reminder"
  | "Certificate Issued"
  | "NGO Message";

interface NotifItem {
  id: string;
  category: NotifCategory;
  title: string;
  message: string;
  date: string;
  unread: boolean;
  ngo?: string;
}

function ageGroup(dateStr: string): "Today" | "Yesterday" | "Earlier" {
  const now = new Date();
  const d = new Date(dateStr);
  const diffDays = Math.floor(
    (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return "Earlier";
}

export async function GET(req: Request) {
  const user = getAuthUser(req);
  if (!user || user.role !== "VOLUNTEER") return unauthorized();

  try {
    const profile = await prisma.volunteerProfile.findUnique({
      where: { userId: user.userId },
      include: {
        applications: {
          include: { project: { include: { ngo: { include: { user: true } } } } },
          orderBy: { appliedAt: "desc" },
          take: 10,
        },
        certificates: {
          orderBy: { issuedAt: "desc" },
          take: 5,
        },
        attendances: {
          include: { project: { include: { ngo: { include: { user: true } } } } },
          orderBy: { checkInTime: "desc" },
          take: 5,
        },
      },
    });

    if (!profile) return NextResponse.json({ message: "Profile not found" }, { status: 404 });

    const notifs: NotifItem[] = [];

    // Application status notifications
    profile.applications.forEach((app) => {
      if (app.status === "ACCEPTED") {
        notifs.push({
          id: `app-acc-${app.id}`,
          category: "Application Update",
          title: "Application Accepted",
          message: `Congratulations! You have been accepted for "${app.project.title}".`,
          date: app.appliedAt.toISOString(),
          unread: true,
          ngo: app.project.ngo.user.name,
        });
      } else if (app.status === "REJECTED") {
        notifs.push({
          id: `app-rej-${app.id}`,
          category: "Application Update",
          title: "Application Rejected",
          message: `Your application for "${app.project.title}" was not accepted this time.`,
          date: app.appliedAt.toISOString(),
          unread: false,
          ngo: app.project.ngo.user.name,
        });
      } else {
        notifs.push({
          id: `app-pnd-${app.id}`,
          category: "Application Update",
          title: "Application Under Review",
          message: `Your application for "${app.project.title}" is being reviewed.`,
          date: app.appliedAt.toISOString(),
          unread: false,
          ngo: app.project.ngo.user.name,
        });
      }
    });

    // Certificate issued notifications
    profile.certificates.forEach((cert) => {
      const shortTx = cert.blockchainTx
        ? `${cert.blockchainTx.slice(0, 8)}...${cert.blockchainTx.slice(-4)}`
        : "pending";
      notifs.push({
        id: `cert-${cert.id}`,
        category: "Certificate Issued",
        title: "Certificate Minted on Polygon",
        message: `Your NFT certificate "${cert.title}" has been issued. Tx: ${shortTx}`,
        date: cert.issuedAt.toISOString(),
        unread: true,
      });
    });

    // Event reminders (accepted applications with upcoming start dates)
    profile.applications
      .filter((a) => a.status === "ACCEPTED" && a.project.startDate)
      .forEach((app) => {
        const start = app.project.startDate!;
        const daysUntil = Math.ceil(
          (start.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        );
        if (daysUntil >= 0 && daysUntil <= 7) {
          notifs.push({
            id: `reminder-${app.id}`,
            category: "Event Reminder",
            title:
              daysUntil === 0
                ? "Event starts today!"
                : `Event starts in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}`,
            message: `"${app.project.title}" at ${app.project.location}.`,
            date: new Date().toISOString(),
            unread: daysUntil <= 2,
            ngo: app.project.ngo.user.name,
          });
        }
      });

    // Attendance completed = NGO thank-you message
    profile.attendances
      .filter((a) => a.checkOutTime)
      .slice(0, 3)
      .forEach((att) => {
        notifs.push({
          id: `att-msg-${att.id}`,
          category: "NGO Message",
          title: `Thank you from ${att.project.ngo.user.name}`,
          message: `Thank you for your ${att.hours}h contribution to "${att.project.title}". Your impact is recorded on-chain.`,
          date: att.checkOutTime!.toISOString(),
          unread: false,
          ngo: att.project.ngo.user.name,
        });
      });

    // Sort by date desc
    notifs.sort((a, b) => (a.date > b.date ? -1 : 1));

    // Attach group label
    const enriched = notifs.map((n) => ({
      ...n,
      group: ageGroup(n.date),
    }));

    const unreadCount = enriched.filter((n) => n.unread).length;

    return NextResponse.json({ notifications: enriched, unreadCount });
  } catch (e) {
    return serverError(e);
  }
}
