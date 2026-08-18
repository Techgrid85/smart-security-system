
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Settings,
  User,
  Phone,
  Save,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

function AdminSettings() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

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
        const admin = response.data.data;

        setFormData({
          name: admin.name || "",
          phone: admin.phone || "",
        });
      } else {
        toast.error(
          response.data.message || "Failed to load settings"
        );
      }
    } catch (error) {
      console.error("Admin Settings Error:", error);

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
  // UPDATE ADMIN PROFILE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        navigate("/");
        return;
      }

      const response = await axios.put(
        "https://smart-society-backend-delta.vercel.app/admin/profile",
        {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
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

        // UPDATE LOCAL STORAGE USER DATA
        const storedUser = localStorage.getItem("user");

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

        // UPDATE FORM WITH RETURNED DATA
        setFormData({
          name:
            response.data.data?.name ||
            formData.name,
          phone:
            response.data.data?.phone ||
            formData.phone,
        });
      } else {
        toast.error(
          response.data.message ||
            "Failed to update settings"
        );
      }
    } catch (error) {
      console.error(
        "Update Admin Settings Error:",
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
      <DashboardLayout role="admin">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm font-medium text-[#756b78]">
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
            Settings
          </h1>

          <p className="mt-1 text-[11.5px] font-medium text-[#8b778e]">
            Manage your administrator account information.
          </p>
        </div>

        {/* SETTINGS CARD */}
        <section className="max-w-3xl overflow-hidden rounded-none border border-[#e2d9df] bg-white">

          {/* CARD HEADER */}
          <div className="flex items-center gap-3 border-b border-[#e2d9df] px-5 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-none bg-[#f7f3ed] text-[#9b7740]">
              <Settings size={17} />
            </div>

            <div>
              <h2 className="text-[13px] font-bold text-[#32143b]">
                Account Settings
              </h2>

              <p className="mt-0.5 text-[9.5px] font-medium text-[#8b778e]">
                Update your administrator information.
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
              <label className="mb-1.5 block text-[10px] font-bold text-[#756b78]">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b778e]"
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="h-10 w-full rounded-none border border-[#e2d9df] bg-white pl-9 pr-3 text-[11px] text-[#49394d] outline-none transition focus:border-[#bca16a]"
                />
              </div>
            </div>

            {/* PHONE */}
            <div>
              <label className="mb-1.5 block text-[10px] font-bold text-[#756b78]">
                Phone Number
              </label>

              <div className="relative">
                <Phone
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b778e]"
                />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="h-10 w-full rounded-none border border-[#e2d9df] bg-white pl-9 pr-3 text-[11px] text-[#49394d] outline-none transition focus:border-[#bca16a]"
                />
              </div>
            </div>

            {/* SAVE BUTTON */}
            <div className="flex justify-end border-t border-[#eee8ed] pt-5">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-none bg-[#9b7740] px-4 py-2.5 text-[10.5px] font-bold text-white shadow-lg shadow-#9b7740/20 transition hover:bg-[#9b7740] disabled:cursor-not-allowed disabled:opacity-60"
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

export default AdminSettings;

