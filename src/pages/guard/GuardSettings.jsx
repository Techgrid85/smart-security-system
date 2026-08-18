import { useEffect, useRef, useState } from "react";
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
  Camera,
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

  const [profilePic, setProfilePic] = useState("");
  const [previewPic, setPreviewPic] = useState("");

  const fileInputRef = useRef(null);

  const API_BASE_URL =
    "https://smart-society-backend-delta.vercel.app/guard";

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
        toast.error("Please login again");
        return;
      }

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

        setProfilePic(guard.profilePic || "");
        setPreviewPic(guard.profilePic || "");
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
  // HANDLE PROFILE PICTURE
  // ==========================================

  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // File type validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile picture must be less than 5MB");
      return;
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);

    setPreviewPic(previewUrl);
  };

  // ==========================================
  // UPDATE GUARD PROFILE
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

      // ==========================================
      // CREATE FORMDATA
      // ==========================================

      const data = new FormData();

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("flatNo", formData.flatNo);

      // Add selected profile picture
      const selectedFile =
        fileInputRef.current?.files?.[0];

      if (selectedFile) {
        data.append("profilePic", selectedFile);
      }

      const response = await axios.put(
        `${API_BASE_URL}/profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Profile updated successfully"
        );

        const updatedGuard = response.data.data;

        // ==========================================
        // UPDATE LOCAL STORAGE
        // ==========================================

        const storedUser =
          localStorage.getItem("user");

        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);

            const updatedUser = {
              ...user,
              name: updatedGuard.name,
              email: updatedGuard.email,
              phone: updatedGuard.phone,
              flatNo: updatedGuard.flatNo,
              profilePic:
                updatedGuard.profilePic ||
                user.profilePic ||
                "",
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

        // ==========================================
        // UPDATE FORM
        // ==========================================

        setFormData({
          name: updatedGuard.name || "",
          email: updatedGuard.email || "",
          phone: updatedGuard.phone || "",
          flatNo: updatedGuard.flatNo || "",
        });

        setProfilePic(
          updatedGuard.profilePic || ""
        );

        setPreviewPic(
          updatedGuard.profilePic || ""
        );

        // Clear selected file
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
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

  // ==========================================
  // PAGE
  // ==========================================

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

            {/* ==========================================
                PROFILE PICTURE
            ========================================== */}

            <div className="mb-8 flex flex-col items-center border-b border-slate-200 pb-8 sm:flex-row sm:items-center sm:gap-6">

              {/* AVATAR */}
              <div className="relative">

                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border-4 border-green-100 bg-green-600 text-3xl font-bold text-white shadow-sm">

                  {previewPic ? (
                    <img
                      src={previewPic}
                      alt="Guard profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    formData.name
                      ?.split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() || "G"
                  )}

                </div>

                {/* CAMERA BUTTON */}
                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-green-600 text-white shadow-md transition hover:bg-green-700"
                  title="Change profile picture"
                >
                  <Camera size={16} />
                </button>

              </div>

              {/* PROFILE INFO */}
              <div className="mt-4 text-center sm:mt-0 sm:text-left">

                <h2 className="text-lg font-semibold text-slate-900">
                  Profile Picture
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Upload a photo that will appear on your profile and dashboard.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="mt-3 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-green-500 hover:bg-green-50 hover:text-green-600"
                >
                  Choose Photo
                </button>

                <p className="mt-2 text-xs text-slate-400">
                  JPG, PNG or WEBP • Maximum 5MB
                </p>

              </div>

              {/* HIDDEN FILE INPUT */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleProfilePicChange}
                className="hidden"
              />

            </div>

            {/* ==========================================
                PERSONAL INFORMATION
            ========================================== */}

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