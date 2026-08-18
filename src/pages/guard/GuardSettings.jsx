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
  Camera,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

const GuardSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);

  const [profilePic, setProfilePic] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    flatNo: "",
  });

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
      } else {
        toast.error(
          response.data.message ||
            "Failed to load profile"
        );
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
  // PROFILE INITIALS
  // ==========================================
  const getInitials = (name) => {
    if (!name) return "G";

    return name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // ==========================================
  // SELECT PROFILE PICTURE
  // ==========================================
  const handlePictureChange = (e) => {
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
        "Profile picture must be less than 5MB"
      );

      e.target.value = "";
      return;
    }

    setSelectedFile(file);

    // Instant preview
    const previewUrl = URL.createObjectURL(file);
    setProfilePic(previewUrl);
  };

  // ==========================================
  // UPLOAD PROFILE PICTURE
  // ==========================================
  const uploadProfilePicture = async () => {
    if (!selectedFile) {
      toast.error("Please select a picture first");
      return;
    }

    try {
      setUploadingPicture(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        return;
      }

      const data = new FormData();

      data.append("profilePic", selectedFile);

      const response = await axios.put(
        `${API_BASE_URL}/profile/picture`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const updatedProfilePic =
          response.data.data?.profilePic || "";

        setProfilePic(updatedProfilePic);
        setSelectedFile(null);

        // Update localStorage
        const storedUser =
          localStorage.getItem("user");

        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);

            const updatedUser = {
              ...user,
              profilePic: updatedProfilePic,
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
        "Upload Profile Picture Error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to upload profile picture"
      );
    } finally {
      setUploadingPicture(false);
    }
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
        return;
      }

      const response = await axios.put(
        `${API_BASE_URL}/profile`,
        {
          name: formData.name,
          email: formData.email,
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
            "Profile updated successfully"
        );

        const updatedData = response.data.data;

        setFormData((prev) => ({
          ...prev,
          name: updatedData?.name || prev.name,
          email: updatedData?.email || prev.email,
          phone: updatedData?.phone || prev.phone,
          flatNo: updatedData?.flatNo || prev.flatNo,
        }));

        // Update localStorage
        const storedUser =
          localStorage.getItem("user");

        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);

            const updatedUser = {
              ...user,
              name:
                updatedData?.name || user.name,
              email:
                updatedData?.email || user.email,
              phone:
                updatedData?.phone || user.phone,
              flatNo:
                updatedData?.flatNo || user.flatNo,
              profilePic:
                updatedData?.profilePic ||
                user.profilePic,
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
      } else {
        toast.error(
          response.data.message ||
            "Failed to update profile"
        );
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
            className="animate-spin text-[#9b7740]"
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

          {/* =====================================
              HEADER
          ====================================== */}
          <div className="mb-8">
            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-none bg-[#f5eee2] text-[#9b7740]">
                <Settings size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-[#32143b] sm:text-3xl">
                  Account Settings
                </h1>

                <p className="mt-1 text-sm text-[#756b78]">
                  Manage and update your guard account information.
                </p>
              </div>

            </div>
          </div>

          {/* =====================================
              SETTINGS FORM
          ====================================== */}
          <form
            onSubmit={handleSubmit}
            className="rounded-none border border-[#e2d9df] bg-white p-6 shadow-sm sm:p-8"
          >

            {/* =================================
                PROFILE PICTURE
            ================================== */}
            <div className="mb-8 flex flex-col items-center gap-5 border-b border-[#e2d9df] pb-8 sm:flex-row">

              {/* AVATAR */}
              <div className="relative">

                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-none border-4 border-white bg-[#f5eee2] text-3xl font-bold text-[#826331] shadow-md">

                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt={formData.name || "Guard"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitials(formData.name)
                  )}

                </div>

                {/* CAMERA BUTTON */}
                <label
                  htmlFor="profilePic"
                  className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-none border-2 border-white bg-[#9b7740] text-white shadow-md transition hover:bg-[#826331]"
                >
                  <Camera size={16} />

                  <input
                    id="profilePic"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handlePictureChange}
                    className="hidden"
                  />
                </label>

              </div>

              {/* TEXT */}
              <div className="text-center sm:text-left">

                <h3 className="text-base font-semibold text-[#32143b]">
                  Profile Picture
                </h3>

                <p className="mt-1 text-sm text-[#756b78]">
                  Upload a new profile picture.
                </p>

                <p className="mt-1 text-xs text-[#8b778e]">
                  JPG, PNG or WEBP • Maximum 5MB
                </p>

                {/* UPLOAD BUTTON */}
                {selectedFile && (
                  <button
                    type="button"
                    onClick={uploadProfilePicture}
                    disabled={uploadingPicture}
                    className="mt-3 inline-flex items-center gap-2 rounded-none bg-[#9b7740] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#826331] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {uploadingPicture ? (
                      <>
                        <Loader2
                          size={14}
                          className="animate-spin"
                        />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        Upload Picture
                      </>
                    )}
                  </button>
                )}

              </div>
            </div>

            {/* =================================
                PERSONAL INFORMATION
            ================================== */}
            <div className="mb-7">
              <h2 className="text-lg font-semibold text-[#32143b]">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-[#756b78]">
                Update your account details below.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* NAME */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[#49394d]">
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b778e]"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full rounded-none border border-[#bca9c0] bg-white py-3 pl-11 pr-4 text-sm text-[#32143b] outline-none transition placeholder:text-[#8b778e] focus:border-[#9b7740] focus:ring-2 focus:ring-[#f5eee2]"
                    required
                  />

                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#49394d]">
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b778e]"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className="w-full rounded-none border border-[#bca9c0] bg-white py-3 pl-11 pr-4 text-sm text-[#32143b] outline-none transition placeholder:text-[#8b778e] focus:border-[#9b7740] focus:ring-2 focus:ring-[#f5eee2]"
                    required
                  />

                </div>
              </div>

              {/* PHONE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#49394d]">
                  Phone Number
                </label>

                <div className="relative">

                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b778e]"
                  />

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter 10 digit phone number"
                    maxLength={10}
                    className="w-full rounded-none border border-[#bca9c0] bg-white py-3 pl-11 pr-4 text-sm text-[#32143b] outline-none transition placeholder:text-[#8b778e] focus:border-[#9b7740] focus:ring-2 focus:ring-[#f5eee2]"
                    required
                  />

                </div>
              </div>

              {/* FLAT NUMBER */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#49394d]">
                  Assigned Flat
                </label>

                <div className="relative">

                  <Building2
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b778e]"
                  />

                  <input
                    type="text"
                    name="flatNo"
                    value={formData.flatNo}
                    disabled
                    className="w-full cursor-not-allowed rounded-none border border-[#bca9c0] bg-[#f7f3ed] py-3 pl-11 pr-4 text-sm text-[#756b78] outline-none"
                  />

                </div>

                <p className="mt-1.5 text-xs text-[#8b778e]">
                  Flat assignment can only be changed by the administrator.
                </p>
              </div>

              {/* ROLE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#49394d]">
                  Account Role
                </label>

                <div className="relative">

                  <ShieldCheck
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9b7740]"
                  />

                  <input
                    type="text"
                    value="Security Guard"
                    disabled
                    className="w-full cursor-not-allowed rounded-none border border-[#e2d9df] bg-[#f7f3ed] py-3 pl-11 pr-4 text-sm text-[#826331]"
                  />

                </div>
              </div>

            </div>

            {/* =================================
                SAVE BUTTON
            ================================== */}
            <div className="mt-8 flex justify-end border-t border-[#e2d9df] pt-6">

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-none bg-[#9b7740] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#826331] disabled:cursor-not-allowed disabled:opacity-60"
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