import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Settings,
  User,
  Phone,
  Mail,
  Save,
  Lock,
  Camera,
  X,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

const API_URL =
  "https://smart-society-backend-delta.vercel.app";

function StaffSettings() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profilePic: "",
  });

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
        `${API_URL}/staff/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const staff = response.data.data;

        setFormData({
          name: staff.name || "",
          email: staff.email || "",
          phone: staff.phone || "",
          profilePic: staff.profilePic || "",
        });
      } else {
        toast.error(
          response.data.message ||
            "Failed to load settings"
        );
      }
    } catch (error) {
      console.error("Staff Settings Error:", error);

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
  // HANDLE TEXT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // UPDATE PROFILE INFORMATION
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
        `${API_URL}/staff/profile`,
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

        const updatedStaff = response.data.data;

        // Update localStorage user
        const storedUser =
          localStorage.getItem("user");

        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);

            localStorage.setItem(
              "user",
              JSON.stringify({
                ...user,
                ...updatedStaff,
              })
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
            updatedStaff?.name || prev.name,
          phone:
            updatedStaff?.phone || prev.phone,
          profilePic:
            updatedStaff?.profilePic ||
            prev.profilePic,
        }));
      } else {
        toast.error(
          response.data.message ||
            "Failed to update settings"
        );
      }
    } catch (error) {
      console.error(
        "Update Staff Settings Error:",
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
  // SELECT PROFILE PICTURE
  // ==========================================

  const handlePictureSelect = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Only JPG, JPEG, PNG and WEBP images are allowed"
      );

      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Profile picture must be smaller than 5MB"
      );

      e.target.value = "";
      return;
    }

    uploadProfilePicture(file);
  };

  // ==========================================
  // UPLOAD PROFILE PICTURE
  // ==========================================

  const uploadProfilePicture = async (file) => {
    try {
      setUploadingPicture(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        navigate("/");
        return;
      }

      const formData = new FormData();

      formData.append("profilePic", file);

      const response = await axios.put(
        `${API_URL}/staff/profile/picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // DO NOT manually set Content-Type.
            // Axios will set multipart/form-data boundary.
          },
        }
      );

      if (response.data.success) {
        const updatedStaff =
          response.data.data;

        setFormData((prev) => ({
          ...prev,
          profilePic:
            updatedStaff?.profilePic || "",
          name:
            updatedStaff?.name || prev.name,
          email:
            updatedStaff?.email || prev.email,
          phone:
            updatedStaff?.phone || prev.phone,
        }));

        // Update localStorage
        const storedUser =
          localStorage.getItem("user");

        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);

            localStorage.setItem(
              "user",
              JSON.stringify({
                ...user,
                ...updatedStaff,
              })
            );
          } catch (error) {
            console.error(
              "Local user update error:",
              error
            );
          }
        }

        toast.success(
          response.data.message ||
            "Profile picture updated successfully"
        );
      } else {
        toast.error(
          response.data.message ||
            "Failed to upload profile picture"
        );
      }
    } catch (error) {
      console.error(
        "Staff Profile Picture Upload Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to upload profile picture"
      );
    } finally {
      setUploadingPicture(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // ==========================================
  // REMOVE / RESET PREVIEW ONLY
  // ==========================================

  const handleCancelPicture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <DashboardLayout role="staff">
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
    <DashboardLayout role="staff">
      <div className="w-full min-w-0 max-w-full">

        {/* HEADER */}

        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate("/staff")}
            className="mb-4 flex items-center gap-2 text-[11px] font-bold text-slate-400 transition hover:text-emerald-500"
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </button>

          <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-500">
            Maintenance Portal
          </p>

          <h1 className="text-[20px] font-extrabold tracking-tight text-slate-900 md:text-[22px]">
            Settings
          </h1>

          <p className="mt-1 text-[11.5px] font-medium text-slate-400">
            Manage your maintenance staff account information.
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
                Update your personal information and profile picture.
              </p>
            </div>

          </div>

          {/* PROFILE PICTURE */}

          <div className="border-b border-slate-100 p-5">

            <label className="mb-3 block text-[10px] font-bold text-slate-600">
              Profile Picture
            </label>

            <div className="flex flex-wrap items-center gap-4">

              {/* AVATAR */}

              <div className="relative">

                {formData.profilePic ? (
                  <img
                    src={formData.profilePic}
                    alt="Staff profile"
                    className="h-20 w-20 rounded-2xl border-2 border-slate-100 object-cover shadow-sm"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500 text-xl font-extrabold text-white shadow-sm">
                    {formData.name
                      ? formData.name
                          .split(" ")
                          .map(
                            (word) =>
                              word[0]
                          )
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "MS"}
                  </div>
                )}

                {uploadingPicture && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </div>
                )}

              </div>

              {/* ACTIONS */}

              <div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handlePictureSelect}
                  className="hidden"
                  id="staff-profile-picture"
                />

                <label
                  htmlFor="staff-profile-picture"
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[10px] font-bold text-slate-600 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 ${
                    uploadingPicture
                      ? "pointer-events-none opacity-60"
                      : ""
                  }`}
                >
                  <Camera size={14} />

                  {uploadingPicture
                    ? "Uploading..."
                    : "Change Picture"}
                </label>

                <p className="mt-2 text-[9px] font-medium text-slate-400">
                  JPG, PNG or WEBP • Maximum 5MB
                </p>

              </div>

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
                  placeholder="Enter phone number"
                  maxLength={10}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[11px] text-slate-700 outline-none transition focus:border-emerald-400"
                />
              </div>
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

export default StaffSettings;