import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Building2,
  CircleCheck,
  Loader2,
  Camera,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

const GuardProfile = () => {
  const [guard, setGuard] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL =
    "https://smart-society-backend-delta.vercel.app/guard/profile";

  // ==========================================
  // GET GUARD PROFILE
  // ==========================================

  useEffect(() => {
    fetchGuardProfile();
  }, []);

  const fetchGuardProfile = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Authentication token not found");
        setLoading(false);
        return;
      }

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setGuard(response.data.data);
      }
    } catch (error) {
      console.error(
        "Get Guard Profile Error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load guard profile"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <DashboardLayout role="guard">
        <div className="flex min-h-[60vh] items-center justify-center bg-white">
          <Loader2
            size={36}
            className="animate-spin text-[#9b7740]"
          />
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================

  if (!guard) {
    return (
      <DashboardLayout role="guard">
        <div className="rounded-2xl border border-[#e2d9df] bg-white p-8 text-center shadow-sm">
          <p className="text-[#756b78]">
            Unable to load your profile.
          </p>

          <button
            type="button"
            onClick={fetchGuardProfile}
            className="mt-4 rounded-xl bg-[#9b7740] px-5 py-2.5 font-medium text-white transition hover:bg-[#826331]"
          >
            Try Again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // INITIALS FALLBACK
  // ==========================================

  const initials =
    guard.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "G";

  // ==========================================
  // PROFILE INFORMATION
  // ==========================================

  const profileItems = [
    {
      label: "Full Name",
      value: guard.name,
      icon: User,
    },
    {
      label: "Email Address",
      value: guard.email,
      icon: Mail,
    },
    {
      label: "Phone Number",
      value: guard.phone,
      icon: Phone,
    },
    {
      label: "Role",
      value: "Security Guard",
      icon: ShieldCheck,
    },
    {
      label: "Assigned Flat",
      value: guard.flatNo,
      icon: Building2,
    },
    {
      label: "Account Status",
      value: guard.isActive ? "Active" : "Inactive",
      icon: CircleCheck,
    },
  ];

  return (
    <DashboardLayout role="guard">
      <div className="min-h-full bg-white px-1 py-2">
        <div className="mx-auto w-full max-w-6xl">

          {/* ==========================================
              PAGE HEADER
          ========================================== */}

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#32143b] sm:text-3xl">
              My Profile
            </h1>

            <p className="mt-2 text-sm text-[#756b78]">
              View your security guard account information.
            </p>
          </div>

          {/* ==========================================
              PROFILE HEADER
          ========================================== */}

          <div className="mb-6 overflow-hidden rounded-2xl border border-[#e2d9df] bg-white shadow-sm">

            {/* GREEN TOP BANNER */}
            <div className="h-28 bg-gradient-to-r from-[#9b7740] to-[#9b7740]" />

            <div className="px-6 pb-6 sm:px-8">

              <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">

                {/* ==========================================
                    PROFILE IMAGE
                ========================================== */}

                <div className="relative shrink-0">

                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#f5eee2] text-2xl font-bold text-[#826331] shadow-md">

                    {guard.profilePic ? (
                      <img
                        src={guard.profilePic}
                        alt={`${guard.name}'s profile`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      initials
                    )}

                  </div>

                  {/* CAMERA INDICATOR */}
                  <div className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#9b7740] text-white shadow-sm">
                    <Camera size={13} />
                  </div>

                </div>

                {/* ==========================================
                    NAME
                ========================================== */}

                <div className="pb-1">

                  <h2 className="text-xl font-bold text-[#32143b]">
                    {guard.name}
                  </h2>

                  <div className="mt-1 flex items-center gap-2 text-sm text-[#756b78]">

                    <ShieldCheck
                      size={16}
                      className="text-[#9b7740]"
                    />

                    Security Guard

                  </div>

                </div>

                {/* ==========================================
                    STATUS
                ========================================== */}

                <div className="sm:ml-auto sm:pb-1">

                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
                      guard.isActive
                        ? "bg-[#f5eee2] text-[#826331]"
                        : "bg-red-100 text-red-600"
                    }`}
                  >

                    <span
                      className={`h-2 w-2 rounded-full ${
                        guard.isActive
                          ? "bg-[#9b7740]"
                          : "bg-red-500"
                      }`}
                    />

                    {guard.isActive
                      ? "Active Account"
                      : "Inactive Account"}

                  </span>

                </div>

              </div>

              {/* PROFILE PICTURE STATUS */}
              <div className="mt-4 flex items-center gap-2 text-xs text-[#8b778e]">

                <Camera size={13} />

                {guard.profilePic
                  ? "Profile picture uploaded"
                  : "No profile picture uploaded"}

              </div>

            </div>
          </div>

          {/* ==========================================
              PROFILE INFORMATION
          ========================================== */}

          <div className="rounded-2xl border border-[#e2d9df] bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-6">

              <h2 className="text-lg font-semibold text-[#32143b]">
                Profile Information
              </h2>

              <p className="mt-1 text-sm text-[#756b78]">
                Your personal and account information.
              </p>

            </div>

            <div className="grid gap-4 md:grid-cols-2">

              {profileItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 rounded-xl border border-[#e2d9df] bg-white p-4 transition hover:border-[#e2d9df] hover:bg-[#f7f3ed]/40"
                  >

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f5eee2] text-[#9b7740]">
                      <Icon size={20} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-xs font-medium uppercase tracking-wider text-[#756b78]">
                        {item.label}
                      </p>

                      <p className="mt-1 truncate text-sm font-medium text-[#32143b]">
                        {item.value || "Not available"}
                      </p>

                    </div>

                  </div>
                );
              })}

            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default GuardProfile;