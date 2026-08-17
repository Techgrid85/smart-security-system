import {
  BookOpen,
  Car,
  Users,
  Volume2,
  Trash2,
  Waves,
  PawPrint,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

function ResidentGuidelines() {
  const guidelines = [
    {
      title: "General Society Rules",
      icon: BookOpen,
      tone: "emerald",
      points: [
        "Residents and visitors must follow society rules and regulations.",
        "Common areas should be kept clean and accessible to everyone.",
        "Residents should cooperate with security and society management.",
        "Any damage to common property should be reported to management.",
      ],
    },
    {
      title: "Parking & Vehicles",
      icon: Car,
      tone: "blue",
      points: [
        "Park vehicles only in designated parking spaces.",
        "Do not block entrances, exits, emergency routes, or other vehicles.",
        "Visitors should use designated visitor parking where available.",
        "Vehicle registration details should remain up to date.",
      ],
    },
    {
      title: "Visitor Guidelines",
      icon: Users,
      tone: "violet",
      points: [
        "Residents should pre-approve expected visitors whenever possible.",
        "Visitors must present their QR pass or gate key at security.",
        "Security personnel may verify visitor information before allowing entry.",
        "Residents are responsible for their visitors while they are inside the society.",
      ],
    },
    {
      title: "Noise & Quiet Hours",
      icon: Volume2,
      tone: "amber",
      points: [
        "Avoid excessive noise that may disturb other residents.",
        "Keep music and gatherings at a reasonable volume.",
        "Residents should respect designated quiet hours.",
        "Construction or renovation work should follow society-approved timings.",
      ],
    },
    {
      title: "Waste Disposal",
      icon: Trash2,
      tone: "green",
      points: [
        "Dispose of household waste only in designated areas.",
        "Do not throw waste in corridors, parking areas, gardens, or other common spaces.",
        "Separate waste where society disposal facilities require it.",
        "Report overflowing or damaged waste containers to management.",
      ],
    },
    {
      title: "Facility & Amenity Rules",
      icon: Waves,
      tone: "cyan",
      points: [
        "Use community facilities only during their permitted hours.",
        "Bookings should be made through the official facility booking system.",
        "Keep facilities clean after use.",
        "Follow safety instructions and facility-specific rules.",
      ],
    },
    {
      title: "Pet Guidelines",
      icon: PawPrint,
      tone: "orange",
      points: [
        "Pets should be handled responsibly in common areas.",
        "Keep pets under appropriate control when outside the flat.",
        "Clean up after pets in shared areas.",
        "Residents should ensure pets do not create unnecessary disturbance.",
      ],
    },
    {
      title: "Safety & Security",
      icon: ShieldCheck,
      tone: "red",
      points: [
        "Do not allow unauthorized persons to enter restricted areas.",
        "Report suspicious activity to society security immediately.",
        "Do not obstruct emergency exits or fire safety equipment.",
        "Follow instructions from security personnel during emergencies.",
      ],
    },
  ];

  const toneStyles = {
    emerald: "bg-emerald-50 text-emerald-500",
    blue: "bg-blue-50 text-blue-500",
    violet: "bg-violet-50 text-violet-500",
    amber: "bg-amber-50 text-amber-500",
    green: "bg-green-50 text-green-500",
    cyan: "bg-cyan-50 text-cyan-500",
    orange: "bg-orange-50 text-orange-500",
    red: "bg-red-50 text-red-500",
  };

  return (
    <DashboardLayout role="resident">
      <div className="w-full min-w-0 max-w-full">

        {/* ================= HEADER ================= */}

        <div className="mb-6">

          <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-500">
            Resident Portal
          </p>

          <h1 className="text-[20px] font-extrabold tracking-tight text-slate-900 md:text-[22px]">
            Society Guidelines
          </h1>

          <p className="mt-1 text-[11.5px] font-medium text-slate-400">
            Important rules and guidelines for residents, visitors, and
            community facilities.
          </p>

        </div>

        {/* ================= INFORMATION BANNER ================= */}

        <div className="mb-6 flex items-start gap-4 rounded-[16px] border border-emerald-100 bg-emerald-50 p-5">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-500">
            <BookOpen size={19} />
          </div>

          <div>
            <h2 className="text-[12.5px] font-bold text-emerald-700">
              Please follow society guidelines
            </h2>

            <p className="mt-1 text-[10.5px] font-medium leading-5 text-emerald-600/80">
              These guidelines help maintain a safe, clean, and
              comfortable environment for everyone in the society.
            </p>
          </div>

        </div>

        {/* ================= GUIDELINES ================= */}

        <section>

          <div className="mb-4">

            <h2 className="text-[13px] font-bold text-slate-900">
              Community Rules
            </h2>

            <p className="mt-1 text-[10px] font-medium text-slate-400">
              Please review the following society guidelines.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {guidelines.map((guideline) => {

              const Icon = guideline.icon;

              return (
                <div
                  key={guideline.title}
                  className="overflow-hidden rounded-[16px] border border-slate-200 bg-white"
                >

                  {/* CARD HEADER */}

                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${toneStyles[guideline.tone]}`}
                      >
                        <Icon size={17} />
                      </div>

                      <h3 className="text-[12px] font-bold text-slate-800">
                        {guideline.title}
                      </h3>

                    </div>

                    <ChevronDown
                      size={15}
                      className="text-slate-300"
                    />

                  </div>

                  {/* RULES */}

                  <div className="p-5">

                    <ul className="space-y-3">

                      {guideline.points.map((point, index) => (

                        <li
                          key={index}
                          className="flex items-start gap-2.5"
                        >

                          <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />

                          <p className="text-[10.5px] font-medium leading-5 text-slate-500">
                            {point}
                          </p>

                        </li>

                      ))}

                    </ul>

                  </div>

                </div>
              );
            })}

          </div>

        </section>

        {/* ================= IMPORTANT NOTICE ================= */}

        <div className="mt-6 flex items-start gap-3 rounded-[14px] border border-amber-100 bg-amber-50 p-4">

          <AlertTriangle
            size={17}
            className="mt-0.5 shrink-0 text-amber-500"
          />

          <div>

            <p className="text-[10.5px] font-bold text-amber-700">
              Important
            </p>

            <p className="mt-1 text-[10px] font-medium leading-5 text-amber-600/80">
              Society management may update rules and regulations when
              necessary. Residents should follow the latest official
              notices issued through the Resident Portal.
            </p>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default ResidentGuidelines;