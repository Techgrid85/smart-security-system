import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  UserCircle,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

function AdminProfile() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH ADMIN PROFILE
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
        "https://smart-society-backend-delta.vercel.app/admin/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setAdmin(response.data.data);
      } else {
        toast.error(
          response.data.message || "Failed to load profile"
        );
      }
    } catch (error) {
      console.error("Admin Profile Error:", error);

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
    if (!name) return "A";

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
      <DashboardLayout role="admin">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm font-medium text-[#756b78]">
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
    <DashboardLayout role="admin">
      <div className="w-full min-w-0 max-w-full">

        {/* HEADER */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="mb-4 flex items-center gap-2 text-[11px] font-bold text-[#8b778e] transition hover:text-[#9b7740]"
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </button>

          <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#9b7740]">
            Administration
          </p>

          <h1 className="text-[20px] font-extrabold tracking-tight text-[#32143b] md:text-[22px]">
            My Profile
          </h1>

          <p className="mt-1 text-[11.5px] font-medium text-[#8b778e]">
            View your SmartSociety administrator account information.
          </p>
        </div>

        <div className="max-w-3xl space-y-5">

          {/* PROFILE HERO */}
          <section className="overflow-hidden rounded-[16px] border border-[#e2d9df] bg-white">

            <div className="h-24 bg-gradient-to-r from-[#9b7740] to-[#9b7740]" />

            <div className="px-5 pb-5">

              {/* AVATAR */}
              <div className="-mt-10 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-[#9b7740] text-[20px] font-extrabold text-white shadow-lg">
                {getInitials(admin?.name)}
              </div>

              <div className="mt-4">
                <h2 className="text-[18px] font-extrabold text-[#32143b]">
                  {admin?.name || "Administrator"}
                </h2>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#f7f3ed] px-2.5 py-1 text-[9px] font-bold text-[#9b7740]">
                    Administrator
                  </span>

                  <span className="rounded-full bg-[#eee8ed] px-2.5 py-1 text-[9px] font-bold text-[#756b78]">
                    SmartSociety Admin
                  </span>
                </div>
              </div>

            </div>
          </section>

          {/* PERSONAL INFORMATION */}
          <section className="overflow-hidden rounded-[16px] border border-[#e2d9df] bg-white">

            <div className="flex items-center gap-3 border-b border-[#e2d9df] px-5 py-4">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f7f3ed] text-[#9b7740]">
                <UserCircle size={17} />
              </div>

              <div>
                <h2 className="text-[13px] font-bold text-[#32143b]">
                  Account Information
                </h2>

                <p className="mt-0.5 text-[9.5px] font-medium text-[#8b778e]">
                  Your registered administrator account details.
                </p>
              </div>

            </div>

            <div className="divide-y divide-#eee8ed">

              {/* NAME */}
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f7f3ed] text-[#8b778e]">
                  <UserCircle size={16} />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                    Full Name
                  </p>

                  <p className="mt-1 truncate text-[11px] font-semibold text-[#49394d]">
                    {admin?.name || "-"}
                  </p>
                </div>
              </div>

              {/* EMAIL */}
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f7f3ed] text-[#8b778e]">
                  <Mail size={16} />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                    Email Address
                  </p>

                  <p className="mt-1 break-all text-[11px] font-semibold text-[#49394d]">
                    {admin?.email || "-"}
                  </p>
                </div>
              </div>

              {/* PHONE */}
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f7f3ed] text-[#8b778e]">
                  <Phone size={16} />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                    Phone Number
                  </p>

                  <p className="mt-1 text-[11px] font-semibold text-[#49394d]">
                    {admin?.phone || "Not provided"}
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* ACCOUNT STATUS */}
          <section className="flex items-center gap-3 rounded-[16px] border border-[#f5eee2] bg-[#f7f3ed]/50 p-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#9b7740] shadow-sm">
              <ShieldCheck size={19} />
            </div>

            <div>
              <p className="text-[11px] font-bold text-[#826331]">
                Administrator Account
              </p>

              <p className="mt-1 text-[9.5px] font-medium leading-relaxed text-[#9b7740]/80">
                Your account has administrator access to manage SmartSociety operations.
              </p>
            </div>

          </section>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminProfile;