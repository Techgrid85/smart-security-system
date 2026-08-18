import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUp,
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
  CheckCircle2,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MapPin,
  Clock,
  Waves,
  Dumbbell,
  TreeDeciduous,
  Gamepad2,
  Shield,
  Film,
  Music,
  Coffee,
  Flower2,
  TentTree,
  Baby,
  Footprints,
  Zap,
  UserCog,
} from "lucide-react";

function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(0);

  // ==========================================
  // SCROLL NAVBAR EFFECT
  // ==========================================
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ==========================================
  // NAV LINKS
  // ==========================================
  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Portals", href: "#portals" },
    { name: "Features", href: "#features" },
    { name: "Amenities", href: "#amenities" },
    { name: "FAQ", href: "#faq" },
    { name: "Contact", href: "#contact" },
  ];

  // ==========================================
  // PORTALS - KEEPING YOUR EXISTING DATA
  // ==========================================
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

  // ==========================================
  // MODULES - KEEPING YOUR EXISTING DATA
  // ==========================================
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

  // ==========================================
  // HOW IT WORKS
  // ==========================================
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

  // ==========================================
  // AMENITIES / SYSTEM BENEFITS
  // ==========================================
  const facilityCategories = [
    {
      category: "Security & Access",
      icon: ShieldCheck,
      items: [
        {
          name: "Smart Visitor Passes",
          desc: "Create and manage visitor passes with a clear approval workflow.",
          icon: UserRoundCheck,
        },
        {
          name: "Guard Approval System",
          desc: "Security guards can approve visitors before allowing entry.",
          icon: Shield,
        },
        {
          name: "Entry & Exit Logs",
          desc: "Maintain organized records of visitor entry and exit activity.",
          icon: ClipboardCheck,
        },
        {
          name: "Active Visitor Tracking",
          desc: "Monitor visitors currently inside the society more efficiently.",
          icon: Footprints,
        },
      ],
    },
    {
      category: "Management & Maintenance",
      icon: Building2,
      items: [
        {
          name: "Flat Management",
          desc: "Organize society flats, occupancy and resident assignments.",
          icon: Building2,
        },
        {
          name: "Complaint Management",
          desc: "Submit complaints, assign staff and track their resolution.",
          icon: MessageSquareWarning,
        },
        {
          name: "Maintenance Bills",
          desc: "Manage maintenance records, bills and generated invoices.",
          icon: ReceiptText,
        },
        {
          name: "Staff Management",
          desc: "Keep staff responsibilities and assigned work organized.",
          icon: UserCog,
        },
      ],
    },
    {
      category: "Community & Communication",
      icon: Users,
      items: [
        {
          name: "Events & Bookings",
          desc: "Keep residents informed about society events and activities.",
          icon: CalendarDays,
        },
        {
          name: "Important Notices",
          desc: "Share announcements and important information with residents.",
          icon: Bell,
        },
        {
          name: "Society Polls",
          desc: "Allow residents to participate in community decisions.",
          icon: Vote,
        },
        {
          name: "Resident Portal",
          desc: "Give residents access to important society services in one place.",
          icon: Home,
        },
      ],
    },
  ];

  // ==========================================
  // FAQ
  // ==========================================
  const faqData = [
    {
      question: "What is SmartSociety?",
      answer:
        "SmartSociety is a web-based society management system designed to connect administration, residents, security guards and maintenance staff through one centralized platform.",
    },
    {
      question: "Who can use the SmartSociety system?",
      answer:
        "The system provides dedicated portals for administrators, residents, security guards and maintenance staff. Each user receives access according to their assigned role.",
    },
    {
      question: "How does visitor management work?",
      answer:
        "Residents can create visitor passes, while security guards can manage approvals and maintain visitor entry and exit records through the security workflow.",
    },
    {
      question: "Can residents submit and track complaints?",
      answer:
        "Yes. Residents can submit complaints from their portal. Administration can review complaints, assign maintenance staff and manage their progress.",
    },
    {
      question: "Does SmartSociety manage maintenance?",
      answer:
        "Yes. The platform includes maintenance management features for handling records, bills, invoices and maintenance-related workflows.",
    },
    {
      question: "Can residents receive notices and participate in polls?",
      answer:
        "Yes. SmartSociety includes notices, events and polls so residents can stay informed and participate in society activities.",
    },
  ];

  // ==========================================
  // SMOOTH SCROLL
  // ==========================================
  const handleNavClick = (href) => {
    setIsMobileMenuOpen(false);

    const element = document.querySelector(href);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">

      {/* ==========================================
          NAVBAR
      ========================================== */}
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "border-b border-slate-200 bg-white/95 py-3 shadow-sm backdrop-blur-xl"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* LOGO */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-3 text-left"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/25">
              <img
                src="/SmartSociety_Logo.svg"
                alt="SmartSociety"
                className="h-full w-full object-contain p-1"
              />
            </div>

            <div>
              <h1
                className={`text-[18px] font-extrabold tracking-tight transition-colors ${
                  isScrolled ? "text-slate-900" : "text-white"
                }`}
              >
                Smart<span className="text-emerald-400">Society</span>
              </h1>

              <p
                className={`text-[8px] font-bold uppercase tracking-[0.15em] ${
                  isScrolled ? "text-slate-400" : "text-slate-300"
                }`}
              >
                Smart Society Management
              </p>
            </div>
          </button>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className={`rounded-full px-4 py-2 text-[12px] font-bold transition ${
                  isScrolled
                    ? "text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/login"
              className={`rounded-xl px-4 py-2.5 text-[11px] font-bold transition ${
                isScrolled
                  ? "text-slate-600 hover:text-emerald-600"
                  : "text-white hover:text-emerald-300"
              }`}
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-emerald-500 px-5 py-2.5 text-[11px] font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600"
            >
              Get Started
            </Link>
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`rounded-xl p-2.5 transition lg:hidden ${
              isScrolled
                ? "text-slate-800 hover:bg-slate-100"
                : "text-white hover:bg-white/10"
            }`}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`absolute left-0 right-0 top-full border-t border-slate-100 bg-white shadow-xl transition-all duration-300 lg:hidden ${
            isMobileMenuOpen
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-3 opacity-0"
          }`}
        >
          <div className="space-y-1 px-4 py-5">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="block w-full rounded-xl px-4 py-3 text-left text-[13px] font-bold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-600"
              >
                {link.name}
              </button>
            ))}

            <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
              <Link
                to="/login"
                className="rounded-xl border border-slate-200 py-3 text-center text-[12px] font-bold text-slate-700"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-emerald-500 py-3 text-center text-[12px] font-bold text-white"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ==========================================
          HERO
      ========================================== */}
      <section
        id="home"
        className="relative min-h-screen overflow-hidden bg-[#0b1628] pt-32"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.22),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.12),_transparent_30%)]" />
          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:45px_45px]" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100vh-100px)] max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">

          {/* HERO LEFT */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-300">
              <Sparkles size={14} />
              Complete Society Management Platform
            </div>

            <h2 className="max-w-3xl text-[42px] font-extrabold leading-[1.08] tracking-tight text-white sm:text-[56px] lg:text-[64px]">
              Smarter Society.
              <br />
              <span className="text-emerald-400">
                Better Living.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-slate-300 sm:text-[17px]">
              SmartSociety brings residents, administration, security and
              maintenance together through one connected system designed for
              better daily society management.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-[12px] font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600"
              >
                Get Started
                <ArrowRight size={16} />
              </Link>

              <button
                onClick={() => handleNavClick("#about")}
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-[12px] font-bold text-white transition hover:bg-white/10"
              >
                Explore Platform
              </button>
            </div>

            <div className="mt-12 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                ["4", "Dedicated Portals"],
                ["8+", "Core Modules"],
                ["1", "Connected System"],
                ["24/7", "Organized Access"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="border-l border-white/10 pl-4"
                >
                  <p className="text-[23px] font-extrabold text-white">
                    {value}
                  </p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-slate-500">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* HERO RIGHT */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-[35px] bg-emerald-500/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111c30] shadow-2xl">

              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">
                    <Building2 size={19} className="text-white" />
                  </div>

                  <div>
                    <p className="text-[12px] font-bold text-white">
                      SmartSociety Overview
                    </p>

                    <p className="text-[9px] text-slate-500">
                      Connected management platform
                    </p>
                  </div>
                </div>

                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                </div>
              </div>

              <div className="grid grid-cols-2">
                {[
                  ["Residents", Users],
                  ["Security", ShieldCheck],
                  ["Maintenance", Wrench],
                  ["Management", ClipboardCheck],
                ].map(([label, Icon]) => (
                  <div
                    key={label}
                    className="border-b border-r border-white/10 p-6 last:border-r-0"
                  >
                    <Icon size={21} className="text-emerald-400" />

                    <p className="mt-5 text-[12px] font-bold text-white">
                      {label}
                    </p>

                    <p className="mt-2 text-[9px] leading-relaxed text-slate-500">
                      Connected and managed from one system.
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between px-6 py-5">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    System Status
                  </p>

                  <p className="mt-2 flex items-center gap-2 text-[11px] font-bold text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    All modules connected
                  </p>
                </div>

                <LockKeyhole size={23} className="text-slate-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          ABOUT
      ========================================== */}
      <section id="about" className="scroll-mt-24 bg-white py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">

          <div className="relative">
            <div className="rounded-[28px] bg-gradient-to-br from-emerald-500 to-teal-700 p-8 shadow-xl shadow-emerald-500/15">
              <div className="rounded-[22px] border border-white/20 bg-[#0f172a] p-7">

                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500">
                    <Building2 className="text-white" size={25} />
                  </div>

                  <div>
                    <p className="text-[18px] font-extrabold text-white">
                      One Connected Platform
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      Built for modern society operations
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  {[
                    "Administration",
                    "Residents",
                    "Security",
                    "Maintenance",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-white/10 bg-white/5 p-4"
                    >
                      <CheckCircle2
                        size={17}
                        className="text-emerald-400"
                      />
                      <p className="mt-3 text-[11px] font-bold text-white">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-600">
              <Sparkles size={13} />
              About SmartSociety
            </div>

            <h2 className="mt-6 text-[35px] font-extrabold leading-tight tracking-tight text-slate-900 sm:text-[48px]">
              One platform for your
              <span className="block text-emerald-500">
                entire society.
              </span>
            </h2>

            <p className="mt-6 text-[15px] leading-relaxed text-slate-500">
              SmartSociety brings essential society operations into one
              connected system. Instead of managing residents, visitors,
              complaints, maintenance and communication separately, everything
              can be organized through dedicated role-based portals.
            </p>

            <p className="mt-4 text-[15px] leading-relaxed text-slate-500">
              Administration, residents, guards and maintenance staff can work
              together through clear workflows and access the features relevant
              to their responsibilities.
            </p>

            <button
              onClick={() => handleNavClick("#portals")}
              className="mt-8 inline-flex items-center gap-2 text-[12px] font-bold text-emerald-600 transition hover:text-emerald-700"
            >
              Explore the portals
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ==========================================
          PORTALS
      ========================================== */}
      <section
        id="portals"
        className="scroll-mt-24 bg-slate-50 py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-600">
              <Users size={13} />
              Role-Based Access
            </div>

            <h2 className="mt-5 text-[34px] font-extrabold tracking-tight text-slate-900 sm:text-[48px]">
              A portal designed for
              <span className="text-emerald-500"> every role.</span>
            </h2>

            <p className="mt-5 text-[15px] leading-relaxed text-slate-500">
              Every user gets a dedicated workspace with the tools and
              information relevant to their responsibilities.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {portals.map((portal) => {
              const Icon = portal.icon;

              return (
                <div
                  key={portal.title}
                  className="group rounded-[24px] border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/10"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 transition group-hover:bg-emerald-500 group-hover:text-white">
                      <Icon size={25} />
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wide text-slate-400">
                      Portal
                    </span>
                  </div>

                  <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-500">
                    {portal.subtitle}
                  </p>

                  <h3 className="mt-2 text-[22px] font-extrabold text-slate-900">
                    {portal.title}
                  </h3>

                  <p className="mt-4 text-[13px] leading-relaxed text-slate-500">
                    {portal.description}
                  </p>

                  <div className="mt-6 grid gap-2 sm:grid-cols-2">
                    {portal.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-[11px] font-semibold text-slate-600"
                      >
                        <CheckCircle2
                          size={14}
                          className="shrink-0 text-emerald-500"
                        />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          FEATURES
      ========================================== */}
      <section
        id="features"
        className="scroll-mt-24 bg-white py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-16 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-600">
                <Zap size={13} />
                Core Modules
              </div>

              <h2 className="mt-5 text-[34px] font-extrabold tracking-tight text-slate-900 sm:text-[48px]">
                Everything your society
                <span className="block text-emerald-500">
                  needs in one system.
                </span>
              </h2>
            </div>

            <p className="max-w-md text-[14px] leading-relaxed text-slate-500">
              Manage essential society operations through connected modules
              built around everyday administrative and community workflows.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((module) => {
              const Icon = module.icon;

              return (
                <div
                  key={module.title}
                  className="group rounded-[20px] border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-emerald-200 hover:bg-white hover:shadow-lg hover:shadow-slate-200/60"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-emerald-500 shadow-sm transition group-hover:bg-emerald-500 group-hover:text-white">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-6 text-[15px] font-extrabold text-slate-900">
                    {module.title}
                  </h3>

                  <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                    {module.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          AMENITIES
      ========================================== */}
      <section
        id="amenities"
        className="scroll-mt-24 relative overflow-hidden bg-emerald-50/40 py-24"
      >
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(16,185,129,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,.7)_1px,transparent_1px)] [background-size:40px_40px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-600 shadow-sm">
              <Sparkles size={13} />
              Connected Society Features
            </div>

            <h2 className="mt-5 text-[34px] font-extrabold tracking-tight text-slate-900 sm:text-[48px]">
              Everything needed for
              <span className="block text-emerald-500">
                smarter society living.
              </span>
            </h2>

            <p className="mt-5 text-[15px] leading-relaxed text-slate-500">
              From visitor control and maintenance workflows to resident
              communication and community activities, SmartSociety keeps
              important operations connected.
            </p>
          </div>

          <div className="space-y-16">
            {facilityCategories.map((category) => {
              const CategoryIcon = category.icon;

              return (
                <div key={category.category}>
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-500 shadow-sm">
                      <CategoryIcon size={20} />
                    </div>

                    <h3 className="text-[20px] font-extrabold text-slate-900">
                      {category.category}
                    </h3>

                    <div className="ml-2 h-px flex-1 bg-gradient-to-r from-emerald-200 to-transparent" />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {category.items.map((item) => {
                      const ItemIcon = item.icon;

                      return (
                        <div
                          key={item.name}
                          className="group overflow-hidden rounded-[20px] border border-emerald-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/10"
                        >
                          <div className="flex h-36 items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-100 bg-white text-emerald-500 shadow-sm transition duration-300 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white">
                              <ItemIcon size={25} />
                            </div>
                          </div>

                          <div className="p-5">
                            <h4 className="text-[13px] font-extrabold text-slate-900">
                              {item.name}
                            </h4>

                            <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-20 rounded-[28px] border border-emerald-100 bg-white p-8 shadow-sm sm:p-12">
            <h3 className="text-center text-[24px] font-extrabold text-slate-900">
              One Connected SmartSociety Experience
            </h3>

            <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3 lg:grid-cols-4">
              {[
                "Role-Based Access",
                "Resident Profiles",
                "Visitor Passes",
                "Guard Approval",
                "Complaint Tracking",
                "Staff Assignment",
                "Maintenance Bills",
                "Generated Invoices",
                "Events & Bookings",
                "Important Notices",
                "Resident Polls",
                "Centralized Management",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 size={12} />
                  </div>

                  <span className="text-[11px] font-semibold text-slate-600">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          HOW IT WORKS
      ========================================== */}
      <section className="bg-[#0b1628] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-300">
              <ClipboardCheck size={13} />
              How It Works
            </div>

            <h2 className="mt-5 text-[34px] font-extrabold tracking-tight text-white sm:text-[48px]">
              Simple workflows.
              <span className="block text-emerald-400">
                Better management.
              </span>
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative overflow-hidden rounded-[22px] border border-white/10 bg-white/5 p-7"
              >
                <p className="text-[42px] font-extrabold leading-none text-emerald-400/25">
                  {step.number}
                </p>

                <h3 className="mt-7 text-[15px] font-bold text-white">
                  {step.title}
                </h3>

                <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          FAQ
      ========================================== */}
      <section
        id="faq"
        className="scroll-mt-24 bg-white py-24"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-600">
              <HelpCircle size={13} />
              Frequently Asked Questions
            </div>

            <h2 className="mt-5 text-[34px] font-extrabold tracking-tight text-slate-900 sm:text-[45px]">
              Everything you need to
              <span className="block text-emerald-500">
                know about SmartSociety.
              </span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqData.map((item, index) => {
              const isOpen = openFAQ === index;

              return (
                <div
                  key={item.question}
                  className={`overflow-hidden rounded-2xl border transition-all ${
                    isOpen
                      ? "border-emerald-300 bg-emerald-50/40 shadow-sm"
                      : "border-slate-200 bg-white hover:border-emerald-200"
                  }`}
                >
                  <button
                    onClick={() =>
                      setOpenFAQ(isOpen ? null : index)
                    }
                    className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left"
                  >
                    <span className="text-[13px] font-bold text-slate-800 sm:text-[15px]">
                      {item.question}
                    </span>

                    {isOpen ? (
                      <ChevronUp
                        size={19}
                        className="shrink-0 text-emerald-600"
                      />
                    ) : (
                      <ChevronDown
                        size={19}
                        className="shrink-0 text-slate-400"
                      />
                    )}
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <p className="px-6 pb-6 text-[13px] leading-relaxed text-slate-500">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          CTA
      ========================================== */}
      <section className="bg-emerald-500 py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="max-w-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-white">
              <ShieldCheck size={21} />
            </div>

            <h2 className="mt-5 text-[32px] font-extrabold tracking-tight text-white sm:text-[42px]">
              Ready for smarter society management?
            </h2>

            <p className="mt-3 text-[14px] leading-relaxed text-emerald-50/90">
              Bring administration, residents, security and maintenance
              together through one connected SmartSociety platform.
            </p>
          </div>

          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-[12px] font-bold text-emerald-600 shadow-lg transition hover:bg-emerald-50"
          >
            Get Started
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ==========================================
          FOOTER
      ========================================== */}
      <footer
        id="contact"
        className="scroll-mt-24 relative overflow-hidden bg-[#08111f] pt-16"
      >
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:40px_40px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-10 pb-12 md:grid-cols-2 lg:grid-cols-4">

            {/* BRAND */}
            <div>
              <button
                onClick={scrollToTop}
                className="flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500">
                  <img
                    src="/SmartSociety_Logo.svg"
                    alt="SmartSociety"
                    className="h-full w-full object-contain p-1"
                  />
                </div>

                <div className="text-left">
                  <p className="text-[18px] font-extrabold text-white">
                    Smart<span className="text-emerald-400">Society</span>
                  </p>

                  <p className="text-[8px] font-bold uppercase tracking-[0.13em] text-slate-500">
                    Smart Society Management
                  </p>
                </div>
              </button>

              <p className="mt-5 max-w-sm text-[12px] leading-relaxed text-slate-400">
                A connected platform designed to help manage residents,
                visitors, complaints, maintenance, communication and daily
                society operations more efficiently.
              </p>
            </div>

            {/* EXPLORE */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-400">
                Explore
              </p>

              <div className="mt-5 space-y-3">
                {[
                  ["About", "#about"],
                  ["Portals", "#portals"],
                  ["Features", "#features"],
                  ["Amenities", "#amenities"],
                  ["FAQ", "#faq"],
                ].map(([name, href]) => (
                  <button
                    key={name}
                    onClick={() => handleNavClick(href)}
                    className="block text-[12px] font-medium text-slate-400 transition hover:text-white"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* PORTALS */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-400">
                Portals
              </p>

              <div className="mt-5 space-y-3 text-[12px] font-medium text-slate-400">
                <p>Administration</p>
                <p>Resident Portal</p>
                <p>Security Portal</p>
                <p>Staff Portal</p>
              </div>
            </div>

            {/* CONTACT */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-400">
                SmartSociety
              </p>

              <p className="mt-5 text-[12px] leading-relaxed text-slate-400">
                One connected system for better society management and
                organized daily operations.
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <Building2 size={15} className="text-emerald-400" />
                  Society Management Platform
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <ShieldCheck size={15} className="text-emerald-400" />
                  Role-Based Access
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <Clock size={15} className="text-emerald-400" />
                  Connected Operations
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 sm:flex-row">
            <p className="text-[10px] font-medium text-slate-600">
              © {new Date().getFullYear()} SmartSociety. All rights reserved.
            </p>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Back to top
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;