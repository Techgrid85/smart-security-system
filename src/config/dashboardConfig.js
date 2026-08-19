import {
  LayoutDashboard,
  Users,
  Building2,
  ReceiptText,
  MessageSquareWarning,
  ShieldCheck,
  CalendarDays,
  Megaphone,
  Vote,
  UserCog,
  ClipboardList,
  Settings,
  QrCode,
  CreditCard,
  Phone,
  BookOpen,
  UserCircle,
  LogIn,
  LogOut,
  AlertTriangle,
  UserPlus,
  Search,
  Wrench,
  History,
  CheckCircle2,
  MapPin,
  Bell,
} from "lucide-react";

const dashboardConfig = {
  admin: {
    title: "Admin Dashboard",
    welcome: "Welcome back, Society Admin 👋",
    roleLabel: "Administrator",
    initials: "SA",
    portalLabel: "Administration Portal",

    sections: [
      {
        title: "MAIN MENU",
        items: [
          {
            label: "Dashboard",
            icon: LayoutDashboard,
            path: "/admin",
          },
          {
            label: "Notifications",
            icon: Bell,
            path: "/admin/notifications",
          },
        ],
      },
      {
        title: "SOCIETY MANAGEMENT",
        items: [
          {
            label: "Society Map",
            icon: MapPin,
            path: "/admin/society-map",
          },
          {
            label: "Residents",
            icon: Users,
            path: "/admin/residents",
          },
          {
            label: "Flats & Units",
            icon: Building2,
            path: "/admin/flats",
          },
          {
            label: "Maintenance Bills",
            icon: ReceiptText,
            path: "/admin/bills",
          },
        ],
      },
      {
        title: "OPERATIONS",
        items: [
          {
            label: "Complaints",
            icon: MessageSquareWarning,
            path: "/admin/complaints",
          },
          {
            label: "Completed Complaints",
            icon: CheckCircle2,
            path: "/admin/completed-complaints",
          },
          {
            label: "Security",
            icon: ShieldCheck,
            path: "/admin/security",
          },
          {
            label: "Facilities & Bookings",
            icon: CalendarDays,
            path: "/admin/facilities",
          },
        ],
      },
      {
        title: "COMMUNICATION",
        items: [
          {
            label: "Notices",
            icon: Megaphone,
            path: "/admin/notices",
          },
          {
            label: "Polls & Voting",
            icon: Vote,
            path: "/admin/polls",
          },
        ],
      },
      {
        title: "ADMINISTRATION",
        items: [
          {
            label: "Staff & Guards",
            icon: UserCog,
            path: "/admin/staff",
          },
          {
            label: "Audit Logs",
            icon: ClipboardList,
            path: "/admin/audit-logs",
          },
          {
            label: "Settings",
            icon: Settings,
            path: "/admin/settings",
          },
        ],
      },
    ],
  },

  resident: {
    title: "Resident Dashboard",
    welcome: "Welcome back, Resident 👋",
    roleLabel: "Resident",
    initials: "RS",
    portalLabel: "Resident Portal",

    sections: [
      {
        title: "MAIN MENU",
        items: [
          {
            label: "Dashboard",
            icon: LayoutDashboard,
            path: "/resident",
          },
          {
            label: "Notifications",
            icon: Bell,
            path: "/resident/notifications",
          },
        ],
      },
      {
        title: "MY SOCIETY",
        items: [
          {
            label: "My Profile",
            icon: UserCircle,
            path: "/resident/profile",
          },
          {
            label: "Maintenance Bills",
            icon: ReceiptText,
            path: "/resident/bills",
          },
          {
            label: "Visitor Passes",
            icon: QrCode,
            path: "/resident/visitor-passes",
          },
          {
            label: "Visitor Requests",
            icon: UserPlus,
            path: "/resident/visitor-requests",
          },
          {
            label: "Visitor Details",
            icon: Users,
            path: "/resident/visitors-details",
          },
          {
            label: "Complaints",
            icon: MessageSquareWarning,
            path: "/resident/complaints",
          },
        ],
      },
      {
        title: "COMMUNITY",
        items: [
          {
            label: "Facility Booking",
            icon: CalendarDays,
            path: "/resident/bookings",
          },
          {
            label: "Notices",
            icon: Megaphone,
            path: "/resident/notices",
          },
          {
            label: "Events",
            icon: CalendarDays,
            path: "/resident/events",
          },
          {
            label: "Polls & Voting",
            icon: Vote,
            path: "/resident/polls",
          },
        ],
      },
      {
        title: "HELP & INFORMATION",
        items: [
          {
            label: "Emergency Center",
            icon: AlertTriangle,
            path: "/resident/emergency",
          },
          {
            label: "Society Guidelines",
            icon: BookOpen,
            path: "/resident/guidelines",
          },
          {
            label: "Settings",
            icon: Settings,
            path: "/resident/settings",
          },
        ],
      },
    ],
  },

  guard: {
    title: "Security Dashboard",
    welcome: "Welcome back, Security Guard 👋",
    roleLabel: "Security Guard",
    initials: "SG",
    portalLabel: "Security Portal",

    sections: [
      {
        title: "MAIN MENU",
        items: [
          {
            label: "Dashboard",
            icon: LayoutDashboard,
            path: "/guard",
          },
          {
            label: "Notifications",
            icon: Bell,
            path: "/guard/notifications",
          },
        ],
      },
      {
        title: "GATE MANAGEMENT",
        items: [
          {
            label: "Verify Gate Pass",
            icon: QrCode,
            path: "/guard/verify-pass",
          },
          {
            label: "Walk-in Visitor",
            icon: UserPlus,
            path: "/guard/walk-in",
          },
          {
            label: "All Visitors",
            icon: Search,
            path: "/guard/all-visitors",
          },
        ],
      },
      {
        title: "VISITOR ACTIVITY",
        items: [
          {
            label: "Active Visitors",
            icon: Users,
            path: "/guard/active-visitors",
          },
          {
            label: "Entry Logs",
            icon: LogIn,
            path: "/guard/entry-logs",
          },
          {
            label: "Exit Logs",
            icon: LogOut,
            path: "/guard/exit-logs",
          },
          {
            label: "Overstay Alerts",
            icon: AlertTriangle,
            path: "/guard/alerts",
          },
        ],
      },
      {
        title: "ACCOUNT",
        items: [
          {
            label: "Profile",
            icon: UserCircle,
            path: "/guard/profile",
          },
          {
            label: "Settings",
            icon: Settings,
            path: "/guard/settings",
          },
        ],
      },
    ],
  },

  staff: {
    title: "Maintenance Dashboard",
    welcome: "Welcome back, Maintenance Staff 👋",
    roleLabel: "Maintenance Staff",
    initials: "MS",
    portalLabel: "Maintenance Portal",

    sections: [
      {
        title: "MAIN MENU",
        items: [
          {
            label: "Dashboard",
            icon: LayoutDashboard,
            path: "/staff",
          },
          {
            label: "Notifications",
            icon: Bell,
            path: "/staff/notifications",
          },
        ],
      },
      {
        title: "COMPLAINTS",
        items: [
          {
            label: "Assigned Complaints",
            icon: ClipboardList,
            path: "/staff/assigned",
          },
          {
            label: "In Progress",
            icon: Wrench,
            path: "/staff/in-progress",
          },
          {
            label: "Completed Work",
            icon: CheckCircle2,
            path: "/staff/completed",
          },
          {
            label: "Complaint History",
            icon: History,
            path: "/staff/history",
          },
        ],
      },
      {
        title: "ACCOUNT",
        items: [
          {
            label: "My Profile",
            icon: UserCircle,
            path: "/staff/profile",
          },
          {
            label: "Settings",
            icon: Settings,
            path: "/staff/settings",
          },
        ],
      },
    ],
  },
  visitor: {
    title: "Visitor Panel",
    welcome: "Welcome to SmartSociety",
    roleLabel: "Visitor",
    initials: "VP",
    portalLabel: "Visitor Portal",
    sections: [
      {
        title: "VISIT MANAGEMENT",
        items: [
          { label: "Dashboard", icon: LayoutDashboard, path: "/visitor" },
          { label: "Notifications", icon: Bell, path: "/visitor/notifications" },
          { label: "Request a Visit", icon: UserPlus, path: "/visitor/request" },
          { label: "My Passes", icon: QrCode, path: "/visitor/passes" },
          { label: "Society Map", icon: MapPin, path: "/visitor/map" },
        ],
      },
      { title: "ACCOUNT", items: [{ label: "My Profile", icon: UserCircle, path: "/visitor/profile" }] },
    ],
  },
};

export default dashboardConfig;
