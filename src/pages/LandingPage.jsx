import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  ShieldCheck,
  Users,
  Wrench,
  Home,
  MessageSquareWarning,
  UserRoundCheck,
  ReceiptText,
  CalendarDays,
  Bell,
  Vote,
  ClipboardCheck,
  LockKeyhole,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

function LandingPage() {
  const portals = [
    {
      icon: ShieldCheck,
      title: "Administration",
      subtitle: "Complete Society Control",
      description:
        "Manage residents, flats, staff, guards, complaints, maintenance and overall society operations from one central dashboard.",
      features: [
        "Resident & flat management",
        "Staff and guard management",
        "Complaint monitoring",
        "Maintenance oversight",
      ],
    },
    {
      icon: Home,
      title: "Resident Portal",
      subtitle: "Everything in One Place",
      description:
        "Residents can manage their profile, submit complaints, create visitor passes, view bills and stay connected with society updates.",
      features: [
        "Complaint management",
        "Visitor passes",
        "Maintenance bills",
        "Events, notices & polls",
      ],
    },
    {
      icon: UserRoundCheck,
      title: "Security Portal",
      subtitle: "Smarter Visitor Control",
      description:
        "Guards can manage visitor approvals, entry and exit records and maintain better control over society access.",
      features: [
        "Visitor approval",
        "Entry & exit logging",
        "Active visitor tracking",
        "Security monitoring",
      ],
    },
    {
      icon: Wrench,
      title: "Staff Portal",
      subtitle: "Maintenance Made Simple",
      description:
        "Maintenance staff can view assigned complaints, update work progress and maintain a complete history of completed work.",
      features: [
        "Assigned complaints",
        "Work status updates",
        "Completed work history",
        "Profile management",
      ],
    },
  ];

  const modules = [
    {
      icon: Building2,
      title: "Flat Management",
      description:
        "Organize flats, occupancy and resident assignments efficiently.",
    },
    {
      icon: Users,
      title: "Resident Management",
      description:
        "Maintain resident information and connected flat records.",
    },
    {
      icon: MessageSquareWarning,
      title: "Complaints",
      description:
        "Submit, assign, track and resolve society maintenance issues.",
    },
    {
      icon: UserRoundCheck,
      title: "Visitor Management",
      description:
        "Create visitor passes and manage approval, entry and exit.",
    },
    {
      icon: ReceiptText,
      title: "Maintenance",
      description:
        "Manage maintenance records, bills and generated invoices.",
    },
    {
      icon: CalendarDays,
      title: "Events & Bookings",
      description:
        "Keep residents informed about events and society activities.",
    },
    {
      icon: Bell,
      title: "Notices",
      description:
        "Share important announcements with society residents.",
    },
    {
      icon: Vote,
      title: "Polls",
      description:
        "Create polls and allow residents to participate in decisions.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Secure Access",
      description:
        "Users access the system through secure authentication based on their assigned role.",
    },
    {
      number: "02",
      title: "Role-Based Portal",
      description:
        "Each user gets a dedicated dashboard with features relevant to their responsibilities.",
    },
    {
      number: "03",
      title: "Connected Operations",
      description:
        "Residents, guards, staff and administrators work together through one connected system.",
    },
    {
      number: "04",
      title: "Better Management",
      description:
        "Track activities, manage records and improve daily society operations efficiently.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* ================= NAVBAR ================= */}

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0f172a]">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">

          {/* LOGO */}

          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-[1px] bg-emerald-500 shadow-lg shadow-emerald-500/20">
              <img
                src="/SmartSociety_Logo.svg"
                alt="SmartSociety"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <h1 className="text-[17px] font-extrabold tracking-tight text-white">
                SmartSociety
              </h1>

              <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Society Management System
              </p>
            </div>
          </Link>

          {/* ACTIONS */}

          <div className="flex items-center gap-3">

            <Link
              to="/login"
              className="hidden px-4 py-2 text-[11px] font-bold text-slate-300 transition hover:text-white sm:block"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="flex items-center gap-2 rounded-[1px] bg-emerald-500 px-4 py-2.5 text-[10px] font-bold text-white transition hover:bg-emerald-600"
            >
              Get Started
              <ArrowRight size={14} />
            </Link>

          </div>

        </div>
      </nav>


      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden bg-[#0f172a]">

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">

          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">

            {/* LEFT */}

            <div>

              <div className="mb-6 inline-flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-400">
                <ShieldCheck size={14} />
                Smart Society Management
              </div>

              <h2 className="max-w-3xl text-[38px] font-extrabold leading-[1.08] tracking-tight text-white sm:text-[50px] lg:text-[58px]">
                Manage Your Society.
                <br />

                <span className="text-emerald-400">
                  Smarter. Faster. Together.
                </span>
              </h2>

              <p className="mt-6 max-w-2xl text-[14px] leading-relaxed text-slate-400">
                SmartSociety is a complete housing society management
                system designed to connect administrators, residents,
                security guards and maintenance staff through one
                centralized platform.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">

                <Link
                  to="/register"
                  className="flex items-center gap-2 rounded-[1px] bg-emerald-500 px-5 py-3 text-[11px] font-bold text-white transition hover:bg-emerald-600"
                >
                  Create Account
                  <ArrowRight size={15} />
                </Link>

                <Link
                  to="/login"
                  className="flex items-center gap-2 border border-white/15 px-5 py-3 text-[11px] font-bold text-white transition hover:border-emerald-400 hover:text-emerald-400"
                >
                  Sign In
                  <ChevronRight size={15} />
                </Link>

              </div>


              {/* STATS */}

              <div className="mt-12 grid max-w-xl grid-cols-3 border-t border-white/10 pt-7">

                <div className="border-r border-white/10">
                  <p className="text-[22px] font-extrabold text-white">
                    4
                  </p>

                  <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-slate-500">
                    User Portals
                  </p>
                </div>

                <div className="border-r border-white/10 px-5">
                  <p className="text-[22px] font-extrabold text-white">
                    8+
                  </p>

                  <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-slate-500">
                    Core Modules
                  </p>
                </div>

                <div className="px-5">
                  <p className="text-[22px] font-extrabold text-white">
                    1
                  </p>

                  <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-slate-500">
                    Connected System
                  </p>
                </div>

              </div>

            </div>


            {/* RIGHT SYSTEM PREVIEW */}

            <div className="border border-white/10 bg-[#111c30] shadow-2xl">

              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-8 w-8 items-center justify-center rounded-[1px] bg-emerald-500 text-white">
                    <Building2 size={16} />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold text-white">
                      SmartSociety Overview
                    </p>

                    <p className="text-[8px] text-slate-500">
                      Connected management platform
                    </p>
                  </div>

                </div>

                <div className="flex gap-1.5">
                  <span className="h-2 w-2 bg-emerald-400" />
                  <span className="h-2 w-2 bg-slate-600" />
                  <span className="h-2 w-2 bg-slate-600" />
                </div>

              </div>

              <div className="grid grid-cols-2 gap-px bg-white/10">

                {[
                  ["Residents", Users],
                  ["Security", ShieldCheck],
                  ["Maintenance", Wrench],
                  ["Management", ClipboardCheck],
                ].map(([label, Icon]) => (
                  <div
                    key={label}
                    className="bg-[#111c30] p-5"
                  >
                    <Icon
                      size={19}
                      className="text-emerald-400"
                    />

                    <p className="mt-4 text-[11px] font-bold text-white">
                      {label}
                    </p>

                    <p className="mt-1 text-[8px] leading-relaxed text-slate-500">
                      Connected and managed from one system.
                    </p>
                  </div>
                ))}

              </div>

              <div className="border-t border-white/10 p-5">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
                      System Status
                    </p>

                    <p className="mt-1 flex items-center gap-2 text-[11px] font-bold text-emerald-400">
                      <span className="h-2 w-2 bg-emerald-400" />
                      All modules connected
                    </p>
                  </div>

                  <LockKeyhole
                    size={20}
                    className="text-slate-600"
                  />

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ================= OVERVIEW ================= */}

      <section className="border-b border-slate-200 bg-white">

        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">

          <div>

            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-500">
              System Overview
            </p>

            <h2 className="mt-3 text-[28px] font-extrabold tracking-tight text-slate-900">
              One platform for your entire society.
            </h2>

          </div>

          <div>

            <p className="text-[13px] leading-relaxed text-slate-500">
              SmartSociety brings essential society operations into one
              connected system. Instead of managing residents, security,
              maintenance and communication separately, every role has
              access to the tools they need.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">

              {[
                "Centralized society management",
                "Role-based access control",
                "Connected visitor workflow",
                "Complaint tracking and assignment",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 border border-slate-200 bg-slate-50 p-3"
                >
                  <CheckCircle2
                    size={15}
                    className="shrink-0 text-emerald-500"
                  />

                  <span className="text-[10px] font-bold text-slate-600">
                    {item}
                  </span>
                </div>
              ))}

            </div>

          </div>

        </div>
      </section>


      {/* ================= PORTALS ================= */}

      <section className="bg-slate-50 py-20">

        <div className="mx-auto max-w-7xl px-5 lg:px-8">

          <div className="max-w-2xl">

            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-500">
              Role-Based Access
            </p>

            <h2 className="mt-3 text-[30px] font-extrabold tracking-tight text-slate-900">
              Built for every role in the society.
            </h2>

            <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
              Every user gets a dedicated workspace designed around their
              responsibilities.
            </p>

          </div>


          <div className="mt-10 grid gap-px border border-slate-200 bg-slate-200 md:grid-cols-2">

            {portals.map((portal) => {
              const Icon = portal.icon;

              return (
                <article
                  key={portal.title}
                  className="bg-white p-6 transition hover:bg-slate-50"
                >

                  <div className="flex h-10 w-10 items-center justify-center rounded-[1px] bg-emerald-50 text-emerald-500">
                    <Icon size={20} />
                  </div>

                  <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.13em] text-emerald-500">
                    {portal.subtitle}
                  </p>

                  <h3 className="mt-2 text-[18px] font-extrabold text-slate-900">
                    {portal.title}
                  </h3>

                  <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                    {portal.description}
                  </p>

                  <div className="mt-5 space-y-2 border-t border-slate-100 pt-5">

                    {portal.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2"
                      >
                        <span className="h-1.5 w-1.5 bg-emerald-500" />

                        <span className="text-[10px] font-semibold text-slate-600">
                          {feature}
                        </span>
                      </div>
                    ))}

                  </div>

                </article>
              );
            })}

          </div>

        </div>
      </section>


      {/* ================= MODULES ================= */}

      <section className="bg-white py-20">

        <div className="mx-auto max-w-7xl px-5 lg:px-8">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div className="max-w-2xl">

              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-500">
                Core Modules
              </p>

              <h2 className="mt-3 text-[30px] font-extrabold tracking-tight text-slate-900">
                Everything needed for daily operations.
              </h2>

            </div>

            <p className="max-w-sm text-[11px] leading-relaxed text-slate-500">
              A collection of connected modules designed to simplify
              society management.
            </p>

          </div>


          <div className="mt-10 grid gap-px border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">

            {modules.map((module) => {
              const Icon = module.icon;

              return (
                <div
                  key={module.title}
                  className="bg-white p-5 transition hover:bg-slate-50"
                >
                  <Icon
                    size={19}
                    className="text-emerald-500"
                  />

                  <h3 className="mt-5 text-[12px] font-bold text-slate-900">
                    {module.title}
                  </h3>

                  <p className="mt-2 text-[9.5px] leading-relaxed text-slate-500">
                    {module.description}
                  </p>

                </div>
              );
            })}

          </div>

        </div>
      </section>


      {/* ================= HOW IT WORKS ================= */}

      <section className="border-y border-white/5 bg-[#0f172a] py-20">

        <div className="mx-auto max-w-7xl px-5 lg:px-8">

          <div className="max-w-2xl">

            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-400">
              How It Works
            </p>

            <h2 className="mt-3 text-[30px] font-extrabold tracking-tight text-white">
              Simple workflows. Connected departments.
            </h2>

          </div>


          <div className="mt-10 grid gap-px bg-white/10 md:grid-cols-2 lg:grid-cols-4">

            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-[#0f172a] p-6"
              >

                <p className="text-[28px] font-extrabold text-emerald-500">
                  {step.number}
                </p>

                <h3 className="mt-6 text-[13px] font-bold text-white">
                  {step.title}
                </h3>

                <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
                  {step.description}
                </p>

              </div>
            ))}

          </div>

        </div>
      </section>


      {/* ================= SECURITY ================= */}

      <section className="bg-emerald-500 py-16">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 lg:flex-row lg:items-center lg:px-8">

          <div className="max-w-2xl">

            <div className="flex h-10 w-10 items-center justify-center border border-white/30 bg-white/10 text-white">
              <ShieldCheck size={20} />
            </div>

            <h2 className="mt-5 text-[28px] font-extrabold tracking-tight text-white">
              Organized management starts with a connected system.
            </h2>

            <p className="mt-3 text-[12px] leading-relaxed text-emerald-50/80">
              SmartSociety helps bring residents, administration,
              security and maintenance together through clear,
              role-based workflows.
            </p>

          </div>

          <Link
            to="/register"
            className="flex w-fit items-center gap-2 border border-white bg-white px-5 py-3 text-[11px] font-bold text-emerald-600 transition hover:bg-emerald-50"
          >
            Get Started
            <ArrowRight size={15} />
          </Link>

        </div>
      </section>


      {/* ================= FOOTER ================= */}

      <footer className="bg-[#09111f]">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-8 sm:flex-row sm:items-center lg:px-8">

          <div className="flex items-center gap-3">

            <div className="flex h-8 w-8 items-center justify-center rounded-[1px] bg-emerald-500">
              <img
                src="/SmartSociety_Logo.svg"
                alt="SmartSociety"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <p className="text-[11px] font-bold text-white">
                SmartSociety
              </p>

              <p className="text-[8px] text-slate-500">
                Smart Society Management System
              </p>
            </div>

          </div>

          <p className="text-[9px] font-medium text-slate-600">
            © {new Date().getFullYear()} SmartSociety. All rights reserved.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default LandingPage;