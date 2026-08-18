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
  Clock,
  Zap,
  UserCog,
} from "lucide-react";

function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
  // PORTALS
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
  // MODULES
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
  // AMENITIES / SYSTEM FEATURES
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
          icon: ShieldCheck,
        },
        {
          name: "Entry & Exit Logs",
          desc: "Maintain organized records of visitor entry and exit activity.",
          icon: ClipboardCheck,
        },
        {
          name: "Active Visitor Tracking",
          desc: "Monitor visitors currently inside the society more efficiently.",
          icon: Users,
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
    <div className="min-h-screen overflow-x-hidden bg-white font-[Plus_Jakarta_Sans] text-plum-950">

      {/* =====================================================
          NAVBAR
      ===================================================== */}
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "border-b border-plum-100 bg-white/85 py-3 shadow-sm shadow-plum-900/5 backdrop-blur-md"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* LOGO */}
            <button
              onClick={scrollToTop}
              className="group flex items-center space-x-2.5"
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-plum-800 via-lavender-400 to-sand-400 opacity-60 blur transition duration-300 group-hover:opacity-100" />

                <div className="relative flex items-center justify-center rounded-xl border border-plum-100 bg-white p-2 shadow-sm">
                  <img
                    src="/SmartSociety_Logo.svg"
                    alt="SmartSociety"
                    className="h-5 w-5 object-contain"
                  />
                </div>
              </div>

              <div className="flex flex-col text-left">
                <span
                  className={`text-lg font-extrabold leading-none tracking-tight transition-colors ${
                    isScrolled ? "text-plum-900" : "text-white"
                  }`}
                >
                  Smart
                  <span className="font-light text-sand-400">
                    Society
                  </span>
                </span>

                <span
                  className={`mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] transition-colors ${
                    isScrolled
                      ? "text-lavender-600"
                      : "text-lavender-200"
                  }`}
                >
                  Smart Society Management
                </span>
              </div>
            </button>

            {/* DESKTOP NAV */}
            <nav className="hidden items-center justify-center gap-2 lg:flex">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isScrolled
                      ? "text-plum-700 hover:bg-lavender-100 hover:text-plum-950"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </nav>

            {/* ACTIONS */}
            <div className="hidden items-center gap-2 lg:flex">
              <Link
                to="/login"
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  isScrolled
                    ? "text-plum-700 hover:bg-lavender-100"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-sand-400 px-5 py-2.5 text-sm font-bold text-plum-950 shadow-lg shadow-sand-400/20 transition hover:bg-sand-300"
              >
                Get Started
              </Link>
            </div>

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`rounded-lg p-2 transition-colors lg:hidden ${
                isScrolled
                  ? "text-plum-800 hover:bg-lavender-100"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`absolute left-0 right-0 top-full border-b border-plum-100 bg-white/97 backdrop-blur-lg transition-all duration-300 lg:hidden ${
            isMobileMenuOpen
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-4 opacity-0"
          }`}
        >
          <div className="space-y-1 px-4 pb-6 pt-4">

            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="block w-full rounded-xl px-4 py-3 text-left text-base font-semibold text-plum-800 transition-colors hover:bg-lavender-100 hover:text-plum-950"
              >
                {link.name}
              </button>
            ))}

            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-plum-100 pt-4">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl border border-plum-200 py-3 text-center text-sm font-semibold text-plum-800 transition hover:bg-lavender-50"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl bg-sand-400 py-3 text-center text-sm font-bold text-plum-950 transition hover:bg-sand-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}
      <section
        id="home"
        className="relative min-h-screen overflow-hidden bg-plum-950 pt-32"
      >
        {/* GRID */}
        <div className="absolute inset-0 bg-grid-dark opacity-60" />

        {/* GLOW */}
        <div className="absolute -right-20 -top-32 h-[520px] w-[520px] rounded-full bg-plum-700/30 blur-[130px]" />

        <div className="absolute -bottom-32 -left-20 h-[450px] w-[450px] rounded-full bg-lavender-400/10 blur-[120px]" />

        <div className="relative mx-auto grid min-h-[calc(100vh-100px)] max-w-7xl items-center gap-16 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">

          {/* LEFT */}
          <div className="animate-fade-in">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sand-400/30 bg-sand-400/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-sand-300">
              <Sparkles size={13} />
              Complete Society Management Platform
            </div>

            <h1 className="max-w-3xl text-[43px] font-extrabold leading-[1.04] tracking-tight text-white sm:text-[57px] lg:text-[68px]">
              Smarter Society.
              <br />
              <span className="text-gradient-gold">
                Better Living.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-lavender-200 sm:text-[17px]">
              SmartSociety brings residents, administration, security and
              maintenance together through one connected system designed for
              better daily society management.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-sand-400 px-6 py-3.5 text-[12px] font-bold text-plum-950 shadow-lg shadow-sand-400/20 transition hover:bg-sand-300"
              >
                Get Started
                <ArrowRight size={16} />
              </Link>

              <button
                onClick={() => handleNavClick("#about")}
                className="rounded-xl border border-lavender-400/20 bg-white/5 px-6 py-3.5 text-[12px] font-bold text-white transition hover:bg-white/10"
              >
                Explore Platform
              </button>
            </div>

            {/* STATS */}
            <div className="mt-12 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                ["4", "Dedicated Portals"],
                ["8+", "Core Modules"],
                ["1", "Connected System"],
                ["24/7", "Organized Access"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="border-l border-lavender-400/20 pl-4"
                >
                  <p className="text-[24px] font-extrabold text-white">
                    {value}
                  </p>

                  <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-lavender-400">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative animate-float">

            <div className="absolute -inset-8 rounded-[40px] bg-lavender-400/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[28px] border border-plum-700 bg-plum-900/80 shadow-2xl backdrop-blur-sm">

              {/* HEADER */}
              <div className="flex items-center justify-between border-b border-plum-700 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-plum-700 to-plum-800 text-sand-400">
                    <Building2 size={20} />
                  </div>

                  <div>
                    <p className="text-[12px] font-bold text-white">
                      SmartSociety Overview
                    </p>

                    <p className="text-[9px] text-lavender-400">
                      Connected management platform
                    </p>
                  </div>
                </div>

                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-plum-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-sand-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-lavender-400" />
                </div>
              </div>

              {/* GRID */}
              <div className="grid grid-cols-2">
                {[
                  ["Residents", Users],
                  ["Security", ShieldCheck],
                  ["Maintenance", Wrench],
                  ["Management", ClipboardCheck],
                ].map(([label, Icon], index) => (
                  <div
                    key={label}
                    className={`border-plum-700 p-6 ${
                      index < 2 ? "border-b" : ""
                    } ${index % 2 === 0 ? "border-r" : ""}`}
                  >
                    <Icon
                      size={21}
                      className="text-sand-400"
                    />

                    <p className="mt-5 text-[12px] font-bold text-white">
                      {label}
                    </p>

                    <p className="mt-2 text-[9px] leading-relaxed text-lavender-400">
                      Connected and managed from one system.
                    </p>
                  </div>
                ))}
              </div>

              {/* STATUS */}
              <div className="flex items-center justify-between border-t border-plum-700 px-6 py-5">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-lavender-500">
                    System Status
                  </p>

                  <p className="mt-2 flex items-center gap-2 text-[11px] font-bold text-sand-400">
                    <span className="h-2 w-2 rounded-full bg-sand-400" />
                    All modules connected
                  </p>
                </div>

                <LockKeyhole
                  size={23}
                  className="text-plum-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ABOUT
      ===================================================== */}
      <section
        id="about"
        className="scroll-mt-24 bg-white py-24"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">

          {/* VISUAL */}
          <div className="relative">

            <div className="absolute -inset-5 rounded-[35px] bg-lavender-100 blur-2xl" />

            <div className="relative rounded-[28px] border border-plum-100 bg-lavender-50 p-3 shadow-xl">

              <div className="rounded-[23px] bg-plum-950 p-7">

                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-plum-700 to-plum-800 text-sand-400">
                    <Building2 size={25} />
                  </div>

                  <div>
                    <p className="text-[18px] font-extrabold text-white">
                      One Connected Platform
                    </p>

                    <p className="mt-1 text-[11px] text-lavender-400">
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
                      className="rounded-xl border border-plum-700 bg-plum-900/70 p-4"
                    >
                      <CheckCircle2
                        size={17}
                        className="text-sand-400"
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

          {/* CONTENT */}
          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-plum-100 bg-lavender-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-plum-700">
              <Sparkles size={13} />
              About SmartSociety
            </div>

            <h2 className="mt-6 text-[36px] font-extrabold leading-tight tracking-tight text-plum-950 sm:text-[49px]">
              One platform for your
              <span className="block text-gradient-plum">
                entire society.
              </span>
            </h2>

            <p className="mt-6 text-[15px] leading-relaxed text-plum-700/70">
              SmartSociety brings essential society operations into one
              connected system. Instead of managing residents, visitors,
              complaints, maintenance and communication separately, everything
              can be organized through dedicated role-based portals.
            </p>

            <p className="mt-4 text-[15px] leading-relaxed text-plum-700/70">
              Administration, residents, guards and maintenance staff can work
              together through clear workflows and access the features relevant
              to their responsibilities.
            </p>

            <button
              onClick={() => handleNavClick("#portals")}
              className="mt-8 inline-flex items-center gap-2 text-[12px] font-bold text-plum-700 transition hover:text-plum-950"
            >
              Explore the portals
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          PORTALS
      ===================================================== */}
      <section
        id="portals"
        className="scroll-mt-24 relative overflow-hidden bg-lavender-50 py-24"
      >
        <div className="absolute inset-0 bg-grid-light opacity-70" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto mb-16 max-w-3xl text-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-plum-100 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-plum-700 shadow-sm">
              <Users size={13} />
              Role-Based Access
            </div>

            <h2 className="mt-5 text-[35px] font-extrabold tracking-tight text-plum-950 sm:text-[48px]">
              A portal designed for
              <span className="block text-gradient-plum">
                every role.
              </span>
            </h2>

            <p className="mt-5 text-[15px] leading-relaxed text-plum-700/65">
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
                  className="group rounded-[24px] border border-plum-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-lavender-300 hover:shadow-xl hover:shadow-plum-900/10"
                >
                  <div className="flex items-start justify-between gap-5">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-plum-100 bg-lavender-50 text-plum-800 transition duration-300 group-hover:bg-plum-800 group-hover:text-sand-300">
                      <Icon size={25} />
                    </div>

                    <span className="rounded-full bg-lavender-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wide text-lavender-700">
                      Portal
                    </span>
                  </div>

                  <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.1em] text-sand-600">
                    {portal.subtitle}
                  </p>

                  <h3 className="mt-2 text-[22px] font-extrabold text-plum-950">
                    {portal.title}
                  </h3>

                  <p className="mt-4 text-[13px] leading-relaxed text-plum-700/65">
                    {portal.description}
                  </p>

                  <div className="mt-6 grid gap-2 sm:grid-cols-2">
                    {portal.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-[11px] font-semibold text-plum-700"
                      >
                        <CheckCircle2
                          size={14}
                          className="shrink-0 text-sand-600"
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

      {/* =====================================================
          FEATURES
      ===================================================== */}
      <section
        id="features"
        className="scroll-mt-24 bg-white py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-16 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

            <div className="max-w-2xl">

              <div className="inline-flex items-center gap-2 rounded-full border border-plum-100 bg-lavender-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-plum-700">
                <Zap size={13} />
                Core Modules
              </div>

              <h2 className="mt-5 text-[35px] font-extrabold tracking-tight text-plum-950 sm:text-[48px]">
                Everything your society
                <span className="block text-gradient-plum">
                  needs in one system.
                </span>
              </h2>
            </div>

            <p className="max-w-md text-[14px] leading-relaxed text-plum-700/65">
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
                  className="group rounded-[20px] border border-plum-100 bg-lavender-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-lavender-300 hover:bg-white hover:shadow-lg hover:shadow-plum-900/10"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-plum-100 bg-white text-plum-800 shadow-sm transition group-hover:bg-plum-800 group-hover:text-sand-300">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-6 text-[15px] font-extrabold text-plum-950">
                    {module.title}
                  </h3>

                  <p className="mt-3 text-[11px] leading-relaxed text-plum-700/65">
                    {module.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          AMENITIES
      ===================================================== */}
      <section
        id="amenities"
        className="scroll-mt-24 relative overflow-hidden bg-lavender-50 py-24"
      >
        <div className="absolute inset-0 bg-grid-light opacity-60" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto mb-16 max-w-3xl text-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-plum-100 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-plum-700 shadow-sm">
              <Sparkles size={13} />
              Connected Society Features
            </div>

            <h2 className="mt-5 text-[35px] font-extrabold tracking-tight text-plum-950 sm:text-[48px]">
              Everything needed for
              <span className="block text-gradient-plum">
                smarter society living.
              </span>
            </h2>

            <p className="mt-5 text-[15px] leading-relaxed text-plum-700/65">
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

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-plum-100 bg-white text-plum-800 shadow-sm">
                      <CategoryIcon size={20} />
                    </div>

                    <h3 className="text-[20px] font-extrabold text-plum-950">
                      {category.category}
                    </h3>

                    <div className="ml-2 h-px flex-1 bg-gradient-to-r from-lavender-300 to-transparent" />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                    {category.items.map((item) => {
                      const ItemIcon = item.icon;

                      return (
                        <div
                          key={item.name}
                          className="group overflow-hidden rounded-[20px] border border-plum-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-lavender-300 hover:shadow-xl hover:shadow-plum-900/10"
                        >

                          <div className="flex h-36 items-center justify-center bg-gradient-to-br from-lavender-50 via-white to-sand-50">

                            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-plum-100 bg-white text-plum-800 shadow-sm transition duration-300 group-hover:scale-110 group-hover:bg-plum-800 group-hover:text-sand-300">
                              <ItemIcon size={25} />
                            </div>
                          </div>

                          <div className="p-5">

                            <h4 className="text-[13px] font-extrabold text-plum-950">
                              {item.name}
                            </h4>

                            <p className="mt-2 text-[11px] leading-relaxed text-plum-700/65">
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

          {/* FEATURE SUMMARY */}
          <div className="mt-20 rounded-[28px] border border-plum-100 bg-white p-8 shadow-sm sm:p-12">

            <h3 className="text-center text-[24px] font-extrabold text-plum-950">
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
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sand-100 text-sand-700">
                    <CheckCircle2 size={12} />
                  </div>

                  <span className="text-[11px] font-semibold text-plum-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}
      <section className="relative overflow-hidden bg-plum-950 py-24">

        <div className="absolute inset-0 bg-grid-dark opacity-60" />

        <div className="absolute -right-20 top-0 h-96 w-96 rounded-full bg-plum-700/20 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto mb-16 max-w-3xl text-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-sand-400/30 bg-sand-400/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-sand-300">
              <ClipboardCheck size={13} />
              How It Works
            </div>

            <h2 className="mt-5 text-[35px] font-extrabold tracking-tight text-white sm:text-[48px]">
              Simple workflows.
              <span className="block text-gradient-gold">
                Better management.
              </span>
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            {steps.map((step) => (
              <div
                key={step.number}
                className="group relative overflow-hidden rounded-[22px] border border-plum-700 bg-plum-900/70 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-lavender-500/40"
              >
                <p className="text-[42px] font-extrabold leading-none text-sand-400/20 transition group-hover:text-sand-400/30">
                  {step.number}
                </p>

                <h3 className="mt-7 text-[15px] font-bold text-white">
                  {step.title}
                </h3>

                <p className="mt-3 text-[11px] leading-relaxed text-lavender-300/70">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          FAQ
      ===================================================== */}
      <section
        id="faq"
        className="scroll-mt-24 bg-white py-24"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto mb-14 max-w-2xl text-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-plum-100 bg-lavender-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-plum-700">
              <HelpCircle size={13} />
              Frequently Asked Questions
            </div>

            <h2 className="mt-5 text-[35px] font-extrabold tracking-tight text-plum-950 sm:text-[45px]">
              Everything you need to
              <span className="block text-gradient-plum">
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
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? "border-lavender-300 bg-lavender-50/60 shadow-sm"
                      : "border-plum-100 bg-white hover:border-lavender-300"
                  }`}
                >
                  <button
                    onClick={() =>
                      setOpenFAQ(isOpen ? null : index)
                    }
                    className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left"
                  >
                    <span className="text-[13px] font-bold text-plum-900 sm:text-[15px]">
                      {item.question}
                    </span>

                    {isOpen ? (
                      <ChevronUp
                        size={19}
                        className="shrink-0 text-plum-700"
                      />
                    ) : (
                      <ChevronDown
                        size={19}
                        className="shrink-0 text-lavender-600"
                      />
                    )}
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <p className="px-6 pb-6 text-[13px] leading-relaxed text-plum-700/65">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}
      <section className="relative overflow-hidden bg-plum-800 py-20">

        <div className="absolute inset-0 bg-grid-dark opacity-50" />

        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-lavender-400/10 blur-[100px]" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">

          <div className="max-w-2xl">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sand-400/30 bg-sand-400/10 text-sand-300">
              <ShieldCheck size={21} />
            </div>

            <h2 className="mt-5 text-[32px] font-extrabold tracking-tight text-white sm:text-[42px]">
              Ready for smarter society management?
            </h2>

            <p className="mt-3 text-[14px] leading-relaxed text-lavender-200/80">
              Bring administration, residents, security and maintenance
              together through one connected SmartSociety platform.
            </p>
          </div>

          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-sand-400 px-6 py-3.5 text-[12px] font-bold text-plum-950 shadow-lg transition hover:bg-sand-300"
          >
            Get Started
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer
        id="contact"
        className="relative overflow-hidden bg-plum-950 pb-8 pt-16 text-lavender-200"
      >

        {/* TOP LINE */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-plum-800 via-sand-400 to-plum-800" />

        {/* GRID */}
        <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-50" />

        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-plum-700/20 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-12">

            {/* BRAND */}
            <div className="space-y-5 md:col-span-4">

              <button
                onClick={scrollToTop}
                className="group flex items-center space-x-2.5"
              >
                <div className="relative">

                  <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-lavender-400 to-sand-400 opacity-50 blur" />

                  <div className="relative flex items-center justify-center rounded-xl border border-plum-700 bg-plum-900 p-2">
                    <img
                      src="/SmartSociety_Logo.svg"
                      alt="SmartSociety"
                      className="h-5 w-5 object-contain"
                    />
                  </div>
                </div>

                <div className="flex flex-col text-left">

                  <span className="text-xl font-extrabold leading-none tracking-tight text-white">
                    Smart
                    <span className="font-light text-sand-400">
                      Society
                    </span>
                  </span>

                  <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-lavender-400">
                    Smart Society Management
                  </span>
                </div>
              </button>

              <p className="max-w-sm text-sm leading-relaxed text-lavender-300/75">
                A connected platform designed to help manage residents,
                visitors, complaints, maintenance, communication and daily
                society operations more efficiently.
              </p>

              <div className="space-y-3 text-sm">

                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 shrink-0 text-sand-400" />
                  <span className="text-lavender-300/75">
                    Society Management Platform
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-sand-400" />
                  <span className="text-lavender-300/75">
                    Role-Based Access
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 shrink-0 text-sand-400" />
                  <span className="text-lavender-300/75">
                    Connected Operations
                  </span>
                </div>
              </div>
            </div>

            {/* EXPLORE */}
            <div className="space-y-4 md:col-span-2">

              <span className="block text-xs font-extrabold uppercase tracking-widest text-sand-400">
                Explore
              </span>

              <ul className="space-y-2 text-sm">

                {[
                  ["About", "#about"],
                  ["Portals", "#portals"],
                  ["Features", "#features"],
                  ["Amenities", "#amenities"],
                  ["FAQ", "#faq"],
                ].map(([name, href]) => (
                  <li key={name}>
                    <button
                      onClick={() => handleNavClick(href)}
                      className="text-lavender-300/75 transition-colors hover:text-white"
                    >
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* PORTALS */}
            <div className="space-y-4 md:col-span-2">

              <span className="block text-xs font-extrabold uppercase tracking-widest text-sand-400">
                Portals
              </span>

              <ul className="space-y-2 text-sm">

                <li className="text-lavender-300/75">
                  Administration
                </li>

                <li className="text-lavender-300/75">
                  Resident Portal
                </li>

                <li className="text-lavender-300/75">
                  Security Portal
                </li>

                <li className="text-lavender-300/75">
                  Staff Portal
                </li>
              </ul>
            </div>

            {/* SMART SOCIETY */}
            <div className="space-y-4 md:col-span-4">

              <span className="block text-xs font-extrabold uppercase tracking-widest text-sand-400">
                SmartSociety
              </span>

              <p className="text-sm leading-relaxed text-lavender-300/75">
                One connected system for better society management and
                organized daily operations.
              </p>

              <div className="rounded-2xl border border-plum-700 bg-plum-900/60 p-5">

                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-lavender-400">
                  System Access
                </p>

                <div className="mt-4 flex flex-wrap gap-2">

                  {[
                    "Administration",
                    "Residents",
                    "Security",
                    "Maintenance",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-plum-700 bg-plum-800 px-3 py-1.5 text-[10px] font-semibold text-lavender-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-plum-800 py-7 text-xs text-lavender-400/70 sm:flex-row">

            <p>
              © {new Date().getFullYear()} SmartSociety. All rights reserved.
            </p>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 rounded-lg border border-plum-700 bg-plum-900 px-3 py-1.5 text-lavender-200 transition-colors hover:bg-plum-800"
            >
              Back to top
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;