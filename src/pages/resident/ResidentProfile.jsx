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
  Car,
  Contact,
  Users,
  Pencil,
  Plus,
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
  // CHECK OTHER INFORMATION
  // ==========================================

  const hasOtherInformation =
    Boolean(resident?.vehicleRegistration?.trim()) ||
    Boolean(resident?.emergencyContact?.name?.trim()) ||
    Boolean(resident?.emergencyContact?.phone?.trim()) ||
    Boolean(
      resident?.emergencyContact?.relationship?.trim()
    ) ||
    Boolean(resident?.familyDetails?.trim());

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

          {/* ==========================================
              PROFILE HERO
          ========================================== */}

          <section className="overflow-hidden rounded-[16px] border border-slate-200 bg-white">

            <div className="h-24 bg-gradient-to-r from-emerald-500 to-emerald-600" />

            <div className="px-5 pb-5">

              {/* AVATAR */}
              <div className="-mt-10 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-emerald-500 text-[20px] font-extrabold text-white shadow-lg">
                {resident?.profilePic ? (
                  <img
                    src={resident.profilePic}
                    alt={resident?.name || "Resident"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitials(resident?.name)
                )}
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

          {/* ==========================================
              PERSONAL INFORMATION
          ========================================== */}

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
              <ProfileItem
                icon={UserCircle}
                label="Full Name"
                value={resident?.name}
              />

              {/* EMAIL */}
              <ProfileItem
                icon={Mail}
                label="Email Address"
                value={resident?.email}
              />

              {/* PHONE */}
              <ProfileItem
                icon={Phone}
                label="Phone Number"
                value={resident?.phone}
                fallback="Not provided"
              />

              {/* FLAT */}
              <ProfileItem
                icon={Home}
                label="Flat Number"
                value={resident?.flatNo}
                fallback="Not assigned"
              />

            </div>
          </section>

          {/* ==========================================
              OTHER INFORMATION
          ========================================== */}

          <section className="overflow-hidden rounded-[16px] border border-slate-200 bg-white">

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500">
                  <Contact size={17} />
                </div>

                <div>

                  <h2 className="text-[13px] font-bold text-slate-900">
                    Other Information
                  </h2>

                  <p className="mt-0.5 text-[9.5px] font-medium text-slate-400">
                    Additional resident information.
                  </p>

                </div>

              </div>

            </div>

            <div className="divide-y divide-slate-100">

              {/* VEHICLE */}
              <ProfileItem
                icon={Car}
                label="Vehicle Registration"
                value={resident?.vehicleRegistration}
                fallback="N/A"
              />

              {/* EMERGENCY CONTACT */}
              <div className="flex items-center gap-3 px-5 py-4">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                  <Phone size={16} />
                </div>

                <div className="min-w-0">

                  <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                    Emergency Contact
                  </p>

                  {resident?.emergencyContact?.name ||
                  resident?.emergencyContact?.phone ||
                  resident?.emergencyContact?.relationship ? (
                    <div className="mt-1 space-y-0.5">

                      <p className="text-[11px] font-semibold text-slate-700">
                        {resident.emergencyContact.name ||
                          "N/A"}
                      </p>

                      <p className="text-[10px] font-medium text-slate-500">
                        {resident.emergencyContact.phone ||
                          "N/A"}
                      </p>

                      <p className="text-[9.5px] font-medium text-slate-400">
                        {resident.emergencyContact.relationship ||
                          "N/A"}
                      </p>

                    </div>
                  ) : (
                    <p className="mt-1 text-[11px] font-semibold text-slate-400">
                      N/A
                    </p>
                  )}

                </div>

              </div>

              {/* FAMILY DETAILS */}
              <div className="flex items-center gap-3 px-5 py-4">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                  <Users size={16} />
                </div>

                <div className="min-w-0">

                  <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                    Family / Tenant Details
                  </p>

                  <p className="mt-1 break-words text-[11px] font-semibold text-slate-700">
                    {resident?.familyDetails?.trim()
                      ? resident.familyDetails
                      : "N/A"}
                  </p>

                </div>

              </div>

            </div>

            {/* ==========================================
                ADD / EDIT BUTTON
            ========================================== */}

            <div className="border-t border-slate-100 px-5 py-4">

              <button
                type="button"
                onClick={() =>
                  navigate("/resident/settings")
                }
                className="flex items-center gap-2 rounded-[9px] bg-emerald-500 px-4 py-2.5 text-[10px] font-bold text-white transition hover:bg-emerald-600"
              >

                {hasOtherInformation ? (
                  <>
                    <Pencil size={13} />
                    Edit Other Info
                  </>
                ) : (
                  <>
                    <Plus size={13} />
                    Add Other Info
                  </>
                )}

              </button>

            </div>

          </section>

          {/* ==========================================
              ACCOUNT STATUS
          ========================================== */}

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


/* ==========================================
   PROFILE ITEM
========================================== */

function ProfileItem({
  icon: Icon,
  label,
  value,
  fallback = "-",
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
        <Icon size={16} />
      </div>

      <div className="min-w-0">

        <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-[11px] font-semibold text-slate-700">
          {value?.trim() ? value : fallback}
        </p>

      </div>

    </div>
  );
}

export default ResidentProfile;