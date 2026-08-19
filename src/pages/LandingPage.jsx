import { useState, useEffect } from "react";
import staffDash from "../assets/staff-dash.png";
import adminDash from "../assets/admin-dash.png";
import residentDash from "../assets/res-dash.png";
import guardDash from "../assets/guard-dash.png";
import ssbanner from "../assets/ssbanner.png";
import flats from "../assets/flats.png";
import visitorPasses from "../assets/res-passes.png";
import visitors from "../assets/res-vistors.png";
import complaints from "../assets/complaints.png";
import maintenanceBills from "../assets/mantainace-bills.png";
import bookings from "../assets/res-booking.png";
import notices from "../assets/notices.png";
import polls from "../assets/polls.png";
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
  UserCog,
  Zap,
  Gem,
} from "lucide-react";

function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About Us", href: "#about" },
    { name: "Portals", href: "#portals" },
    { name: "Features", href: "#features" },
    { name: "Amenities", href: "#amenities" },
    { name: "FAQ", href: "#faq" },
    { name: "Contact Us", href: "#contact" },
  ];

  // YOUR EXISTING INFORMATION
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
      image:
        adminDash,
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
      image:
        residentDash,
    },
    {
      icon: UserRoundCheck,
      title: "Visitor Portal",
      subtitle: "Plan Visits Securely",
      description:
        "Visitors can create an account, request a visit using a resident's flat number, track approval and show their digital gate pass at entry.",
      features: [
        "Request a visit to a resident",
        "See when requests are unavailable",
        "Track approval status",
        "Access approved digital passes",
      ],
      image: visitorPasses,
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
      image:
        guardDash,
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
      image:
         staffDash,
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

  const facilityCategories = [
    {
      category: "Security & Access",
      icon: ShieldCheck,
      items: [
        {
          name: "Smart Visitor Passes",
          image: visitorPasses,
          desc: "Create and manage visitor passes with a clear approval workflow.",
          icon: UserRoundCheck,
        },
        {
          name: "Guard Approval System",
          image: guardDash,
          desc: "Security guards can approve visitors before allowing entry.",
          icon: ShieldCheck,
        },
        {
          name: "Entry & Exit Logs",
          image: visitors,
          desc: "Maintain organized records of visitor entry and exit activity.",
          icon: ClipboardCheck,
        },
        {
          name: "Active Visitor Tracking",
          image: visitors,
          desc: "Monitor visitors currently inside the society more efficiently.",
          icon: UserRoundCheck,
        },
      ],
    },
    {
      category: "Management & Maintenance",
      icon: Building2,
      items: [
        {
          name: "Flat Management",
          image: flats,
          desc: "Organize society flats, occupancy and resident assignments.",
          icon: Building2,
        },
        {
          name: "Complaint Management",
          image: complaints,
          desc: "Submit complaints, assign staff and track their resolution.",
          icon: MessageSquareWarning,
        },
        {
          name: "Maintenance Bills",
          image: maintenanceBills,
          desc: "Manage maintenance records, bills and generated invoices.",
          icon: ReceiptText,
        },
        {
          name: "Staff Management",
          image: staffDash,
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
          image: bookings,
          desc: "Keep residents informed about society events and activities.",
          icon: CalendarDays,
        },
        {
          name: "Important Notices",
          image: notices,
          desc: "Share announcements and important information with residents.",
          icon: Bell,
        },
        {
          name: "Society Polls",
          image: polls,
          desc: "Allow residents to participate in community decisions.",
          icon: Vote,
        },
        {
          name: "Resident Portal",
          image: residentDash,
          desc: "Give residents access to important society services in one place.",
          icon: Home,
        },
      ],
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

  const allAmenities = facilityCategories.flatMap(
    (category) => category.items
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-[#241228]">

      {/* =========================================================
          NAVBAR
      ========================================================= */}

      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "border-b border-[#e8e1e8] bg-white/95 shadow-sm backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[82px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">

          {/* LOGO */}

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-3"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10 backdrop-blur-md ${isScrolled
                  ? "border-[#e4dce5] bg-white"
                  : "border-white/30 bg-white/10 backdrop-blur-md"
                }`}
            >

              <img
                src="/SmartSociety_Logo.svg"
                alt="SmartSociety Logo"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="text-left">
              <div
                className={`text-lg font-extrabold leading-none tracking-tight ${
                  isScrolled ? "text-[#32143b]" : "text-white"
                }`}
              >
                Smart
                <span className="font-light text-[#d9be82]">
                  Society
                </span>
              </div>

              <div
                className={`mt-1 text-[8px] font-semibold uppercase tracking-[0.2em] ${
                  isScrolled ? "text-[#806d82]" : "text-white/65"
                }`}
              >
                Smart Society Management
              </div>
            </div>
          </button>

          {/* DESKTOP NAV */}

          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className={`relative text-[13px] font-semibold transition-colors ${
                  isScrolled
                    ? "text-[#4d3853] hover:text-[#9b7740]"
                    : "text-white/90 hover:text-[#d9be82]"
                }`}
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* DESKTOP CTA */}

          <div className="hidden lg:block">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-[#d9be82] px-6 py-3 text-[12px] font-bold text-[#32143b] transition-all hover:bg-white hover:shadow-lg"
            >
              Get Started
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* MOBILE */}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`rounded-full p-2 lg:hidden ${
              isScrolled ? "text-[#32143b]" : "text-white"
            }`}
          >
            {isMobileMenuOpen ? (
              <X size={25} />
            ) : (
              <Menu size={25} />
            )}
          </button>
        </div>

        {/* MOBILE MENU */}

        <div
          className={`border-t border-[#e8e1e8] bg-white transition-all duration-300 lg:hidden ${
            isMobileMenuOpen
              ? "max-h-[600px] opacity-100"
              : "pointer-events-none max-h-0 overflow-hidden opacity-0"
          }`}
        >
          <div className="space-y-1 px-5 py-5">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="block w-full border-b border-[#eee9ee] py-4 text-left text-sm font-semibold text-[#32143b]"
              >
                {link.name}
              </button>
            ))}

            <div className="grid grid-cols-2 gap-3 pt-4">
              <Link
                to="/login"
                className="border border-[#dcd2df] py-3 text-center text-sm font-semibold text-[#32143b]"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-[#32143b] py-3 text-center text-sm font-bold text-white"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================
          HERO
      ========================================================= */}

      <section
        id="home"
        className="relative min-h-[760px] overflow-hidden bg-[#241228]"
      >
        {/* HERO IMAGE */}

        <img
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=90"
          alt="SmartSociety"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* OVERLAYS */}

        <div className="absolute inset-0 bg-gradient-to-r from-[#210c28]/95 via-[#32143b]/70 to-[#32143b]/20" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#210c28]/80 via-transparent to-[#210c28]/20" />

        {/* HERO CONTENT */}

        <div className="relative z-10 mx-auto flex min-h-[760px] max-w-7xl items-center px-5 pt-20 sm:px-6 lg:px-8">

          <div className="max-w-3xl">

            <div className="mb-7 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#d9be82]">
              <span className="h-px w-10 bg-[#d9be82]" />
              Complete Society Management Platform
            </div>

            <h1 className="text-[48px] font-black leading-[1.02] tracking-[-0.04em] text-white sm:text-[64px] lg:text-[78px]">
              Smarter Society.
              <br />
              <span className="font-normal text-[#d9be82]">
                Better Living.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-[15px] leading-8 text-white/80 sm:text-[17px]">
              SmartSociety brings residents, administration,
              security and maintenance together through one
              connected system designed for better daily
              society management.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">

              <Link
                to="/register"
                className="inline-flex items-center gap-3 bg-[#d9be82] px-7 py-4 text-[12px] font-bold text-[#32143b] transition hover:bg-white"
              >
                Get Started
                <ArrowRight size={16} />
              </Link>

              <button
                onClick={() => handleNavClick("#about")}
                className="inline-flex items-center gap-3 border border-white/35 bg-white/10 px-7 py-4 text-[12px] font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#32143b]"
              >
                Explore Platform
                <ArrowRight size={16} />
              </button>

            </div>

          </div>
        </div>

        {/* HERO BOTTOM INFO */}

        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/15 bg-[#210c28]/60 backdrop-blur-md">

          <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-4">

            {[
              ["4", "Dedicated Portals"],
              ["8+", "Core Modules"],
              ["1", "Connected System"],
              ["24/7", "Organized Access"],
            ].map(([value, label], index) => (
              <div
                key={label}
                className={`px-5 py-6 sm:px-7 ${
                  index !== 0
                    ? "border-l border-white/10"
                    : ""
                }`}
              >
                <div className="text-2xl font-black text-white">
                  {value}
                </div>

                <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#d9be82]">
                  {label}
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* =========================================================
          ABOUT
      ========================================================= */}

      <section
        id="about"
        className="scroll-mt-20 bg-[#f7f3ed] py-24 sm:py-28"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-6 lg:grid-cols-2 lg:px-8">

          {/* IMAGE */}

          <div className="relative">

            <div className="overflow-hidden">
              <img
                src={ssbanner}
                alt="Modern society"
                className="h-[480px] w-full object-cover sm:h-[570px]"
              />
            </div>

            <div className="absolute bottom-0 left-0 bg-[#32143b] px-7 py-6 text-white sm:px-9">
              <div className="text-3xl font-black text-[#d9be82]">
                1
              </div>

              <div className="mt-1 text-xs uppercase tracking-wider text-white/70">
                Connected Platform
              </div>
            </div>
          </div>

          {/* CONTENT */}

          <div>

            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9b7740]">
              <span className="h-px w-8 bg-[#9b7740]" />
              About SmartSociety
            </div>

            <h2 className="mt-5 text-[39px] font-black leading-[1.08] tracking-tight text-[#32143b] sm:text-[52px]">
              One platform for your
              <span className="block font-normal text-[#63366f]">
                entire society.
              </span>
            </h2>

            <p className="mt-7 text-[15px] leading-8 text-[#756b78]">
              SmartSociety brings essential society operations
              into one connected system. Instead of managing
              residents, visitors, complaints, maintenance and
              communication separately, everything can be
              organized through dedicated role-based portals.
            </p>

            <p className="mt-5 text-[15px] leading-8 text-[#756b78]">
              Administration, residents, guards and maintenance
              staff can work together through clear workflows
              and access the features relevant to their
              responsibilities.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">

              {[
                "Administration",
                "Residents",
                "Security",
                "Maintenance",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 border-b border-[#ddd4d9] pb-3"
                >
                  <CheckCircle2
                    size={17}
                    className="text-[#9b7740]"
                  />

                  <span className="text-sm font-bold text-[#32143b]">
                    {item}
                  </span>
                </div>
              ))}

            </div>

            <button
              onClick={() => handleNavClick("#portals")}
              className="mt-9 inline-flex items-center gap-3 border-b border-[#32143b] pb-2 text-sm font-bold text-[#32143b] transition hover:text-[#9b7740]"
            >
              Explore the portals
              <ArrowRight size={16} />
            </button>

          </div>
        </div>
      </section>

      {/* =========================================================
          PORTALS
      ========================================================= */}

      <section
        id="portals"
        className="scroll-mt-20 bg-white py-24 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

          <div className="max-w-2xl">

            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9b7740]">
              <span className="h-px w-8 bg-[#9b7740]" />
              Role-Based Access
            </div>

            <h2 className="mt-5 text-[39px] font-black leading-tight text-[#32143b] sm:text-[52px]">
              A portal designed for
              <span className="block font-normal text-[#63366f]">
                every role.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-[15px] leading-8 text-[#756b78]">
              Every user gets a dedicated workspace with the
              tools and information relevant to their
              responsibilities.
            </p>

          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2">

            {portals.map((portal) => {
              const Icon = portal.icon;

              return (
                <div
                  key={portal.title}
                  className="group grid overflow-hidden border border-[#e4dce5] bg-white transition hover:border-[#bca9c0] md:grid-cols-2"
                >

                  {/* IMAGE */}

                  <div className="relative min-h-[320px] overflow-hidden">

                    <img
                      src={portal.image}
                      alt={portal.title}
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#210c28]/80 to-transparent" />

                    <div className="absolute bottom-7 left-7">
                      <Icon
                        size={42}
                        strokeWidth={1.3}
                        className="text-[#d9be82]"
                      />
                    </div>

                  </div>

                  {/* CONTENT */}

                  <div className="flex flex-col justify-center p-7 sm:p-8">

                    <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#9b7740]">
                      {portal.subtitle}
                    </div>

                    <h3 className="mt-3 text-[25px] font-black text-[#32143b]">
                      {portal.title}
                    </h3>

                    <p className="mt-4 text-[13px] leading-7 text-[#756b78]">
                      {portal.description}
                    </p>

                    <div className="mt-6 space-y-2.5">
                      {portal.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-2 text-[11px] font-semibold text-[#49394d]"
                        >
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#d9be82]" />
                          {feature}
                        </div>
                      ))}
                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURES
      ========================================================= */}

      <section
        id="features"
        className="scroll-mt-20 bg-[#32143b] py-24 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">

            <div>

              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d9be82]">
                <span className="h-px w-8 bg-[#d9be82]" />
                Core Modules
              </div>

              <h2 className="mt-5 text-[39px] font-black leading-tight text-white sm:text-[52px]">
                Everything your society
                <span className="block font-normal text-[#d9be82]">
                  needs in one system.
                </span>
              </h2>

            </div>

            <p className="text-[14px] leading-7 text-white/60">
              Manage essential society operations through
              connected modules built around everyday
              administrative and community workflows.
            </p>

          </div>

          <div className="mt-16 grid border-l border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">

            {modules.map((module) => {
              const Icon = module.icon;

              return (
                <div
                  key={module.title}
                  className="group border-b border-r border-white/10 p-7 transition hover:bg-white/[0.04]"
                >

                  <div className="flex h-12 w-12 items-center justify-center border border-white/15 text-[#d9be82]">
                    <Icon size={21} strokeWidth={1.5} />
                  </div>

                  <h3 className="mt-7 text-[15px] font-bold text-white">
                    {module.title}
                  </h3>

                  <p className="mt-3 text-[11px] leading-6 text-white/50">
                    {module.description}
                  </p>

                </div>
              );
            })}

          </div>

        </div>
      </section>

      {/* =========================================================
          AMENITIES
      ========================================================= */}

      <section
        id="amenities"
        className="scroll-mt-20 bg-[#f7f3ed] py-24 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

            <div>

              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9b7740]">
                <span className="h-px w-8 bg-[#9b7740]" />
                Connected Society Features
              </div>

              <h2 className="mt-5 text-[39px] font-black leading-tight text-[#32143b] sm:text-[52px]">
                Everything needed for
                <span className="block font-normal text-[#63366f]">
                  smarter society living.
                </span>
              </h2>

            </div>

            <p className="max-w-md text-[14px] leading-7 text-[#756b78]">
              From visitor control and maintenance workflows
              to resident communication and community
              activities, SmartSociety keeps important
              operations connected.
            </p>

          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {allAmenities.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.name}
                  className="group overflow-hidden border border-[#e2d9df] bg-white"
                >

                  <div className="relative flex h-52 items-center justify-center overflow-hidden bg-[#32143b]">

                    <div className="absolute inset-0 bg-gradient-to-br from-[#63366f] via-[#32143b] to-[#210c28]" />

                    <img
                      src={item.image}
                      alt={item.name}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    

                    <span className="absolute right-5 top-5 text-[9px] font-bold text-white/35">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                  </div>

                  <div className="p-6">

                    <h3 className="text-[14px] font-black text-[#32143b]">
                      {item.name}
                    </h3>

                    <p className="mt-2 text-[11px] leading-6 text-[#756b78]">
                      {item.desc}
                    </p>

                  </div>
                </div>
              );
            })}

          </div>

          {/* FEATURE LIST */}

          <div className="mt-16 border border-[#dfd5dc] bg-white p-7 sm:p-10">

            <h3 className="text-center text-2xl font-black text-[#32143b]">
              One Connected SmartSociety Experience
            </h3>

            <div className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-3 lg:grid-cols-4">

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
                  <CheckCircle2
                    size={14}
                    className="shrink-0 text-[#9b7740]"
                  />

                  <span className="text-[11px] font-semibold text-[#5b4a5f]">
                    {item}
                  </span>
                </div>
              ))}

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}

      <section className="bg-white py-24 sm:py-28">

        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

          <div className="max-w-2xl">

            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9b7740]">
              <span className="h-px w-8 bg-[#9b7740]" />
              How It Works
            </div>

            <h2 className="mt-5 text-[39px] font-black leading-tight text-[#32143b] sm:text-[52px]">
              Simple workflows.
              <span className="block font-normal text-[#63366f]">
                Better management.
              </span>
            </h2>

          </div>

          <div className="mt-16 grid border-l border-t border-[#e3dce3] md:grid-cols-2 lg:grid-cols-4">

            {steps.map((step) => (
              <div
                key={step.number}
                className="border-b border-r border-[#e3dce3] p-7 sm:p-8"
              >

                <div className="text-5xl font-black text-[#d9be82]/50">
                  {step.number}
                </div>

                <h3 className="mt-7 text-[16px] font-black text-[#32143b]">
                  {step.title}
                </h3>

                <p className="mt-3 text-[11px] leading-6 text-[#756b78]">
                  {step.description}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* =========================================================
          FAQ
      ========================================================= */}

      <section
        id="faq"
        className="scroll-mt-20 bg-[#f7f3ed] py-24 sm:py-28"
      >

        <div className="mx-auto max-w-4xl px-5 sm:px-6">

          <div className="mx-auto max-w-2xl text-center">

            <div className="flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9b7740]">
              <span className="h-px w-8 bg-[#9b7740]" />
              Frequently Asked Questions
              <span className="h-px w-8 bg-[#9b7740]" />
            </div>

            <h2 className="mt-5 text-[39px] font-black leading-tight text-[#32143b] sm:text-[48px]">
              Everything you need to
              <span className="block font-normal text-[#63366f]">
                know about SmartSociety.
              </span>
            </h2>

          </div>

          <div className="mt-14 space-y-3">

            {faqData.map((item, index) => {

              const isOpen = openFAQ === index;

              return (
                <div
                  key={item.question}
                  className={`border bg-white transition ${
                    isOpen
                      ? "border-[#bda9c1]"
                      : "border-[#e2d9df]"
                  }`}
                >

                  <button
                    onClick={() =>
                      setOpenFAQ(isOpen ? null : index)
                    }
                    className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left"
                  >

                    <span className="text-[13px] font-bold text-[#32143b] sm:text-[15px]">
                      {item.question}
                    </span>

                    {isOpen ? (
                      <ChevronUp
                        size={19}
                        className="shrink-0 text-[#9b7740]"
                      />
                    ) : (
                      <ChevronDown
                        size={19}
                        className="shrink-0 text-[#8b778e]"
                      />
                    )}

                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen
                        ? "grid-rows-[1fr]"
                        : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">

                      <p className="px-6 pb-6 text-[13px] leading-7 text-[#756b78]">
                        {item.answer}
                      </p>

                    </div>
                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </section>

      {/* =========================================================
          CTA
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#32143b] py-24">

        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[#63366f]/30 blur-[130px]" />

        <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-10 px-5 sm:px-6 lg:flex-row lg:items-center lg:px-8">

          <div className="max-w-2xl">

            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d9be82]">
              <span className="h-px w-8 bg-[#d9be82]" />
              Smart Society Management
            </div>

            <h2 className="mt-5 text-[39px] font-black leading-tight text-white sm:text-[52px]">
              Ready for smarter
              <span className="block font-normal text-[#d9be82]">
                society management?
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-[14px] leading-7 text-white/60">
              Bring administration, residents, security and
              maintenance together through one connected
              SmartSociety platform.
            </p>

          </div>

          <Link
            to="/register"
            className="inline-flex w-fit items-center gap-3 bg-[#d9be82] px-7 py-4 text-[12px] font-bold text-[#32143b] transition hover:bg-white"
          >
            Register as a Visitor
            <ArrowRight size={16} />
          </Link>

        </div>

      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer
        id="contact"
        className="bg-[#210c28] text-[#cdc4dd]"
      >

        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">

          <div className="grid gap-12 border-b border-white/10 pb-14 md:grid-cols-12">

            {/* BRAND */}

            <div className="md:col-span-5">

              <button
                onClick={scrollToTop}
                className="flex items-center gap-3"
              >

                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
                  <img
                    src="/SmartSociety_Logo.svg"
                    alt="SmartSociety Logo"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="text-left">

                  <div className="text-xl font-black text-white">
                    Smart
                    <span className="font-normal text-[#d9be82]">
                      Society
                    </span>
                  </div>

                  <div className="mt-1 text-[8px] uppercase tracking-[0.2em] text-white/40">
                    Smart Society Management
                  </div>

                </div>

              </button>

              <p className="mt-6 max-w-md text-sm leading-7 text-white/50">
                A connected platform designed to help manage
                residents, visitors, complaints, maintenance,
                communication and daily society operations more
                efficiently.
              </p>

              <div className="mt-6 space-y-3">

                <div className="flex items-center gap-3 text-xs text-white/50">
                  <Building2
                    size={15}
                    className="text-[#d9be82]"
                  />
                  Society Management Platform
                </div>

                <div className="flex items-center gap-3 text-xs text-white/50">
                  <ShieldCheck
                    size={15}
                    className="text-[#d9be82]"
                  />
                  Role-Based Access
                </div>

                <div className="flex items-center gap-3 text-xs text-white/50">
                  <Clock
                    size={15}
                    className="text-[#d9be82]"
                  />
                  Connected Operations
                </div>

              </div>

            </div>

            {/* EXPLORE */}

            <div className="md:col-span-2">

              <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d9be82]">
                Explore
              </h3>

              <div className="mt-5 space-y-3 text-xs">

                {[
                  ["About Us", "#about"],
                  ["Portals", "#portals"],
                  ["Features", "#features"],
                  ["Amenities", "#amenities"],
                  ["FAQ", "#faq"],
                ].map(([name, href]) => (
                  <button
                    key={name}
                    onClick={() => handleNavClick(href)}
                    className="block text-white/50 transition hover:text-white"
                  >
                    {name}
                  </button>
                ))}

              </div>

            </div>

            {/* PORTALS */}

            <div className="md:col-span-2">

              <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d9be82]">
                Portals
              </h3>

              <div className="mt-5 space-y-3 text-xs text-white/50">

                <p>Administration</p>
                <p>Resident Portal</p>
                <p>Security Portal</p>
                <p>Staff Portal</p>

              </div>

            </div>

            {/* CTA */}

            <div className="md:col-span-3">

              <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d9be82]">
                SmartSociety
              </h3>

              <p className="mt-5 text-xs leading-6 text-white/50">
                One connected system for better society
                management and organized daily operations.
              </p>

              <Link
                to="/register"
                className="mt-6 inline-flex items-center gap-2 bg-[#d9be82] px-5 py-3 text-xs font-bold text-[#32143b] transition hover:bg-white"
              >
                Visitor Registration
                <ArrowRight size={14} />
              </Link>

            </div>

          </div>

          {/* BOTTOM */}

          <div className="flex flex-col items-center justify-between gap-4 pt-7 text-[10px] sm:flex-row">

            <p className="text-white/30">
              © {new Date().getFullYear()} SmartSociety.
              All rights reserved.
            </p>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-white/40 transition hover:text-white"
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
