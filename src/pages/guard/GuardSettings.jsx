
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Settings,
  User,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  Save,
  Loader2,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

const GuardSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    flatNo: "",
  });

  const API_BASE_URL = "https://smart-society-backend-delta.vercel.app/guard";

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

      const response = await axios.get(
        `${API_BASE_URL}/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const guard = response.data.data;

        setFormData({
          name: guard.name || "",
          email: guard.email || "",
          phone: guard.phone || "",
          flatNo: guard.flatNo || "",
        });
      }
    } catch (error) {
      console.error(
        "Fetch Guard Profile Error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // UPDATE GUARD PROFILE
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_BASE_URL}/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Profile updated successfully"
        );

        const storedUser = JSON.parse(
          localStorage.getItem("user")
        );

        if (storedUser) {
          const updatedUser = {
            ...storedUser,
            name: response.data.data.name,
            email: response.data.data.email,
            phone: response.data.data.phone,
            flatNo: response.data.data.flatNo,
          };

          localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
          );
        }

        setFormData({
          name: response.data.data.name || "",
          email: response.data.data.email || "",
          phone: response.data.data.phone || "",
          flatNo: response.data.data.flatNo || "",
        });
      }
    } catch (error) {
      console.error(
        "Update Guard Profile Error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile"
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
      <DashboardLayout role="guard">
        <div className="flex min-h-[60vh] items-center justify-center bg-white">
          <Loader2
            size={36}
            className="animate-spin text-green-600"
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="guard">
      <div className="min-h-full bg-white px-1 py-2">
        <div className="mx-auto w-full max-w-4xl">

          {/* HEADER */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <Settings size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  Account Settings
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage and update your guard account information.
                </p>
              </div>
            </div>
          </div>

          {/* SETTINGS FORM */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="mb-7">
              <h2 className="text-lg font-semibold text-slate-900">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update your account details below.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* NAME */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>
              </div>

              {/* PHONE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    maxLength="10"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>
              </div>

              {/* FLAT NUMBER */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Assigned Flat
                </label>

                <div className="relative">
                  <Building2
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="flatNo"
                    value={formData.flatNo}
                    onChange={handleChange}
                    placeholder="Enter flat number"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>
              </div>

              {/* ROLE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Account Role
                </label>

                <div className="relative">
                  <ShieldCheck
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600"
                  />

                  <input
                    type="text"
                    value="Security Guard"
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-green-200 bg-green-50 py-3 pl-11 pr-4 text-sm text-green-700"
                  />
                </div>
              </div>
            </div>

            {/* BUTTON */}
            <div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GuardSettings;

