import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  UserCircle,
  Mail,
  Phone,
  Home,
  ShieldCheck,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

function ResidentProfile() {
  const navigate = useNavigate();

  const [resident, setResident] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH PROFILE
  // ==========================================

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        navigate("/");
        return;
      }

      const response = await axios.get(
        "https://smart-society-backend-delta.vercel.app/resident/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setResident(response.data.data);
      } else {
        toast.error(
          response.data.message || "Failed to load profile"
        );
      }
    } catch (error) {
      console.error("Profile Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ==========================================
  // GET INITIALS
  // ==========================================

  const getInitials = (name) => {
    if (!name) return "R";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <DashboardLayout role="resident">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm font-medium text-slate-500">
            Loading profile...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <DashboardLayout role="resident">
      <div className="w-full min-w-0 max-w-full">

        {/* HEADER */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate("/resident")}
            className="mb-4 flex items-center gap-2 text-[11px] font-bold text-slate-400 transition hover:text-emerald-500"
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </button>

          <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-500">
            Resident Portal
          </p>

          <h1 className="text-[20px] font-extrabold tracking-tight text-slate-900 md:text-[22px]">
            My Profile
          </h1>

          <p className="mt-1 text-[11.5px] font-medium text-slate-400">
            View your society account and resident information.
          </p>
        </div>

        <div className="max-w-3xl space-y-5">

          {/* PROFILE HERO */}
          <section className="overflow-hidden rounded-[16px] border border-slate-200 bg-white">

            <div className="h-24 bg-gradient-to-r from-emerald-500 to-emerald-600" />

            <div className="px-5 pb-5">

              {/* AVATAR */}
              <div className="-mt-10 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-emerald-500 text-[20px] font-extrabold text-white shadow-lg">
                {getInitials(resident?.name)}
              </div>

              <div className="mt-4">
                <h2 className="text-[18px] font-extrabold text-slate-900">
                  {resident?.name || "Resident"}
                </h2>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-600">
                    Resident
                  </span>

                  {resident?.flatNo && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold text-slate-500">
                      Flat {resident.flatNo}
                    </span>
                  )}
                </div>
              </div>

            </div>
          </section>

          {/* PERSONAL INFORMATION */}
          <section className="overflow-hidden rounded-[16px] border border-slate-200 bg-white">

            <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500">
                <UserCircle size={17} />
              </div>

              <div>
                <h2 className="text-[13px] font-bold text-slate-900">
                  Personal Information
                </h2>

                <p className="mt-0.5 text-[9.5px] font-medium text-slate-400">
                  Your registered account details.
                </p>
              </div>

            </div>

            <div className="divide-y divide-slate-100">

              {/* NAME */}
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                  <UserCircle size={16} />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                    Full Name
                  </p>

                  <p className="mt-1 truncate text-[11px] font-semibold text-slate-700">
                    {resident?.name || "-"}
                  </p>
                </div>
              </div>

              {/* EMAIL */}
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                  <Mail size={16} />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                    Email Address
                  </p>

                  <p className="mt-1 break-all text-[11px] font-semibold text-slate-700">
                    {resident?.email || "-"}
                  </p>
                </div>
              </div>

              {/* PHONE */}
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                  <Phone size={16} />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                    Phone Number
                  </p>

                  <p className="mt-1 text-[11px] font-semibold text-slate-700">
                    {resident?.phone || "Not provided"}
                  </p>
                </div>
              </div>

              {/* FLAT */}
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                  <Home size={16} />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                    Flat Number
                  </p>

                  <p className="mt-1 text-[11px] font-semibold text-slate-700">
                    {resident?.flatNo || "Not assigned"}
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* ACCOUNT STATUS */}
          <section className="flex items-center gap-3 rounded-[16px] border border-emerald-100 bg-emerald-50/50 p-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-500 shadow-sm">
              <ShieldCheck size={19} />
            </div>

            <div>
              <p className="text-[11px] font-bold text-emerald-700">
                Resident Account
              </p>

              <p className="mt-1 text-[9.5px] font-medium leading-relaxed text-emerald-600/80">
                Your account is registered with the SmartSociety resident portal.
              </p>
            </div>

          </section>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default ResidentProfile;