import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Settings,
  User,
  Phone,
  Mail,
  Home,
  Save,
  Lock,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

function ResidentSettings() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    flatNo: "",
  });

  // ==========================================
  // FETCH PROFILE
  // ==========================================

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
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
        const resident = response.data.data;

        setFormData({
          name: resident.name || "",
          email: resident.email || "",
          phone: resident.phone || "",
          flatNo: resident.flatNo || "",
        });
      } else {
        toast.error(
          response.data.message ||
            "Failed to load settings"
        );
      }
    } catch (error) {
      console.error("Settings Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load settings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ==========================================
  // HANDLE CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // UPDATE PROFILE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        return;
      }

      const response = await axios.put(
        "https://smart-society-backend-delta.vercel.app/resident/profile",
        {
          name: formData.name,
          phone: formData.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Settings updated successfully"
        );

        // Keep localStorage user data updated
        const storedUser =
          localStorage.getItem("user");

        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);

            const updatedUser = {
              ...user,
              ...response.data.data,
            };

            localStorage.setItem(
              "user",
              JSON.stringify(updatedUser)
            );
          } catch (error) {
            console.error(
              "Local user update error:",
              error
            );
          }
        }

        setFormData((prev) => ({
          ...prev,
          name:
            response.data.data?.name ||
            prev.name,
          phone:
            response.data.data?.phone ||
            prev.phone,
        }));
      } else {
        toast.error(
          response.data.message ||
            "Failed to update settings"
        );
      }
    } catch (error) {
      console.error(
        "Update Settings Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update settings"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <DashboardLayout role="resident">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm font-medium text-slate-500">
            Loading settings...
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
            Settings
          </h1>

          <p className="mt-1 text-[11.5px] font-medium text-slate-400">
            Manage your resident account information.
          </p>

        </div>

        {/* SETTINGS CARD */}
        <section className="max-w-3xl overflow-hidden rounded-[16px] border border-slate-200 bg-white">

          {/* CARD HEADER */}
          <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500">
              <Settings size={17} />
            </div>

            <div>
              <h2 className="text-[13px] font-bold text-slate-900">
                Account Settings
              </h2>

              <p className="mt-0.5 text-[9.5px] font-medium text-slate-400">
                Update your personal information.
              </p>
            </div>

          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5 p-5"
          >

            {/* NAME */}
            <div>
              <label className="mb-1.5 block text-[10px] font-bold text-slate-600">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[11px] text-slate-700 outline-none transition focus:border-emerald-400"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-1.5 block text-[10px] font-bold text-slate-600">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="h-10 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-[11px] text-slate-400 outline-none"
                />
              </div>

              <p className="mt-1.5 flex items-center gap-1 text-[9px] font-medium text-slate-400">
                <Lock size={10} />
                Email address cannot be changed here.
              </p>
            </div>

            {/* PHONE */}
            <div>
              <label className="mb-1.5 block text-[10px] font-bold text-slate-600">
                Phone Number
              </label>

              <div className="relative">
                <Phone
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter 10 digit phone number"
                  maxLength={10}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[11px] text-slate-700 outline-none transition focus:border-emerald-400"
                />
              </div>
            </div>

            {/* FLAT */}
            <div>
              <label className="mb-1.5 block text-[10px] font-bold text-slate-600">
                Flat Number
              </label>

              <div className="relative">
                <Home
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={formData.flatNo}
                  disabled
                  className="h-10 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-[11px] text-slate-400 outline-none"
                />
              </div>

              <p className="mt-1.5 text-[9px] font-medium text-slate-400">
                Flat assignment can only be changed by the administrator.
              </p>
            </div>

            {/* SAVE */}
            <div className="flex justify-end border-t border-slate-100 pt-5">

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-[10.5px] font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={14} />

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </form>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default ResidentSettings;