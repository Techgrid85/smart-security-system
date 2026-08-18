import { useState } from "react";
import toast from "react-hot-toast";

import {
  AlertTriangle,
  Phone,
  ShieldAlert,
  Siren,
  Flame,
  Ambulance,
  Building2,
  BookOpen,
  ChevronDown,
  CheckCircle2,
  X,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

function ResidentEmergency() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [alertActive, setAlertActive] = useState(false);
  const [expandedGuideline, setExpandedGuideline] = useState(null);

  // ==========================================
  // EMERGENCY ALERT
  // ==========================================

  const handleEmergencyAlert = () => {
    setAlertActive(true);
    setShowConfirm(false);

    toast.error(
      "Emergency alert activated. Security has been notified.",
      {
        duration: 5000,
      }
    );
  };

  // ==========================================
  // EMERGENCY CONTACTS
  // ==========================================

  const emergencyContacts = [
    {
      name: "Society Security",
      description: "For immediate security assistance",
      number: "Security Desk",
      icon: ShieldAlert,
      tone: "emerald",
    },
    {
      name: "Police",
      description: "Police emergency assistance",
      number: "15",
      icon: ShieldAlert,
      tone: "blue",
    },
    {
      name: "Ambulance",
      description: "Medical emergency assistance",
      number: "1122",
      icon: Ambulance,
      tone: "red",
    },
    {
      name: "Fire & Rescue",
      description: "Fire or rescue emergency",
      number: "1122",
      icon: Flame,
      tone: "orange",
    },
    {
      name: "Society Management",
      description: "Contact society administration",
      number: "Management Desk",
      icon: Building2,
      tone: "violet",
    },
  ];

  // ==========================================
  // GUIDELINES
  // ==========================================

  const guidelines = [
    {
      title: "Fire Emergency",
      description:
        "Remain calm, leave the affected area safely, use designated exits, and follow security or emergency personnel instructions.",
    },
    {
      title: "Medical Emergency",
      description:
        "Contact emergency medical services and society security immediately. Keep the affected area clear so assistance can reach the resident quickly.",
    },
    {
      title: "Security Emergency",
      description:
        "Use the emergency alert when immediate security assistance is required. Avoid confrontation and follow instructions from security personnel.",
    },
    {
      title: "Evacuation",
      description:
        "Follow society evacuation instructions and move toward the designated safe area. Do not use unsafe routes or elevators during a fire emergency.",
    },
    {
      title: "General Emergency Rules",
      description:
        "Keep emergency exits accessible, avoid spreading unverified information, and cooperate with society management and emergency personnel.",
    },
  ];

  const toggleGuideline = (index) => {
    setExpandedGuideline(
      expandedGuideline === index ? null : index
    );
  };

  return (
    <DashboardLayout role="resident">
      <div className="w-full min-w-0 max-w-full">

        {/* ========================================== */}
        {/* HEADER */}
        {/* ========================================== */}

        <div className="mb-6">

          <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-rose-500">
            Resident Portal
          </p>

          <h1 className="text-[20px] font-extrabold tracking-tight text-[#32143b] md:text-[22px]">
            Emergency Center
          </h1>

          <p className="mt-1 text-[11.5px] font-medium text-[#8b778e]">
            Access emergency assistance, important contacts, and society
            safety guidelines.
          </p>

        </div>

        {/* ========================================== */}
        {/* ACTIVE ALERT */}
        {/* ========================================== */}

        {alertActive && (
          <div className="mb-6 overflow-hidden rounded-[16px] border border-red-200 bg-red-50">

            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500 text-white">
                  <Siren size={19} />
                </div>

                <div>
                  <p className="text-[12px] font-extrabold text-red-700">
                    Emergency Alert Active
                  </p>

                  <p className="mt-1 text-[10.5px] font-medium leading-5 text-red-600">
                    Your emergency alert has been activated.
                    Society security should respond immediately.
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() => setAlertActive(false)}
                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 text-[10px] font-bold text-red-600 transition hover:bg-red-100"
              >
                <X size={13} />
                Dismiss
              </button>

            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* EMERGENCY SIREN */}
        {/* ========================================== */}

        <section className="mb-6 overflow-hidden rounded-[18px] border border-red-200 bg-white">

          <div className="bg-red-50 p-6 md:p-8">

            <div className="mx-auto max-w-[650px] text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500 text-white shadow-sm">

                <Siren size={30} />

              </div>

              <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.14em] text-red-500">
                Emergency Assistance
              </p>

              <h2 className="mt-1 text-[20px] font-extrabold tracking-tight text-[#32143b]">
                Need Immediate Help?
              </h2>

              <p className="mx-auto mt-2 max-w-[500px] text-[11px] font-medium leading-5 text-[#756b78]">
                Activate the emergency alert when immediate assistance
                from society security is required.
              </p>

              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                disabled={alertActive}
                className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-500 px-6 text-[11px] font-extrabold text-white shadow-sm transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Siren size={16} />

                {alertActive
                  ? "Emergency Alert Active"
                  : "Activate Emergency Alert"}
              </button>

              <p className="mt-3 text-[9px] font-medium text-[#8b778e]">
                Only use this feature for genuine emergencies.
              </p>

            </div>

          </div>

        </section>

        {/* ========================================== */}
        {/* EMERGENCY CONTACTS */}
        {/* ========================================== */}

        <section className="mb-6 overflow-hidden rounded-[16px] border border-[#e2d9df] bg-white">

          <div className="border-b border-[#e2d9df] px-5 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f7f3ed] text-[#9b7740]">
                <Phone size={17} />
              </div>

              <div>
                <h2 className="text-[13px] font-bold text-[#32143b]">
                  Emergency Contacts
                </h2>

                <p className="mt-1 text-[10px] font-medium text-[#8b778e]">
                  Important emergency and society contacts.
                </p>
              </div>

            </div>

          </div>

          <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">

            {emergencyContacts.map((contact) => {

              const Icon = contact.icon;

              return (
                <div
                  key={contact.name}
                  className="rounded-xl border border-[#e2d9df] bg-white p-4 transition hover:border-[#bca9c0] hover:shadow-sm"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eee8ed] text-[#756b78]">
                      <Icon size={16} />
                    </div>

                    <span className="rounded-full bg-[#f7f3ed] px-2 py-1 text-[8px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Emergency
                    </span>

                  </div>

                  <h3 className="mt-4 text-[11px] font-bold text-[#49394d]">
                    {contact.name}
                  </h3>

                  <p className="mt-1 min-h-[30px] text-[9.5px] font-medium leading-4 text-[#8b778e]">
                    {contact.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#eee8ed] pt-3">

                    <p className="text-[12px] font-extrabold text-[#49394d]">
                      {contact.number}
                    </p>

                    {contact.number.match(/^\d+$/) && (
                      <a
                        href={`tel:${contact.number}`}
                        className="inline-flex h-7 items-center gap-1 rounded-lg bg-[#f7f3ed] px-2.5 text-[9px] font-bold text-[#9b7740] transition hover:bg-[#f5eee2]"
                      >
                        <Phone size={11} />
                        Call
                      </a>
                    )}

                  </div>

                </div>
              );
            })}

          </div>

        </section>

        {/* ========================================== */}
        {/* SOCIETY GUIDELINES */}
        {/* ========================================== */}

        <section className="overflow-hidden rounded-[16px] border border-[#e2d9df] bg-white">

          <div className="border-b border-[#e2d9df] px-5 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f7f3ed] text-[#63366f]">
                <BookOpen size={17} />
              </div>

              <div>
                <h2 className="text-[13px] font-bold text-[#32143b]">
                  Society Emergency Guidelines
                </h2>

                <p className="mt-1 text-[10px] font-medium text-[#8b778e]">
                  Follow these guidelines during an emergency.
                </p>
              </div>

            </div>

          </div>

          <div className="divide-y divide-#eee8ed">

            {guidelines.map((guideline, index) => {

              const isOpen =
                expandedGuideline === index;

              return (
                <div key={guideline.title}>

                  <button
                    type="button"
                    onClick={() =>
                      toggleGuideline(index)
                    }
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-[#f7f3ed]"
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eee8ed] text-[#756b78]">
                        <AlertTriangle size={14} />
                      </div>

                      <p className="text-[11px] font-bold text-[#49394d]">
                        {guideline.title}
                      </p>

                    </div>

                    <ChevronDown
                      size={15}
                      className={`shrink-0 text-[#8b778e] transition-transform ${
                        isOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />

                  </button>

                  {isOpen && (
                    <div className="bg-[#f7f3ed] px-5 pb-4 pt-0">

                      <div className="flex gap-3 rounded-xl border border-[#e2d9df] bg-white p-4">

                        <CheckCircle2
                          size={14}
                          className="mt-0.5 shrink-0 text-[#9b7740]"
                        />

                        <p className="text-[10.5px] font-medium leading-5 text-[#756b78]">
                          {guideline.description}
                        </p>

                      </div>

                    </div>
                  )}

                </div>
              );
            })}

          </div>

        </section>

        {/* ========================================== */}
        {/* CONFIRMATION MODAL */}
        {/* ========================================== */}

        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#32143b]/50 p-4">

            <div className="w-full max-w-[400px] rounded-[16px] bg-white shadow-xl">

              <div className="p-5">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  <AlertTriangle size={23} />
                </div>

                <div className="mt-4 text-center">

                  <h3 className="text-[14px] font-extrabold text-[#32143b]">
                    Activate Emergency Alert?
                  </h3>

                  <p className="mt-2 text-[10.5px] font-medium leading-5 text-[#8b778e]">
                    This will notify the society security team that
                    immediate assistance may be required.
                  </p>

                </div>

                <div className="mt-5 flex gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirm(false)
                    }
                    className="flex-1 rounded-lg border border-[#e2d9df] px-4 py-2.5 text-[10px] font-bold text-[#756b78] transition hover:bg-[#f7f3ed]"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleEmergencyAlert}
                    className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-[10px] font-bold text-white transition hover:bg-red-600"
                  >
                    Activate Alert
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default ResidentEmergency;