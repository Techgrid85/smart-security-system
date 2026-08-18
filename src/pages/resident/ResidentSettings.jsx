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
  Car,
  UserRound,
  Users,
  Camera,
  Upload,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

function ResidentSettings() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    flatNo: "",

    vehicleRegistration: "",

    emergencyContactName: "",
    emergencyContactRelationship: "",

    familyDetails: "",

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

          vehicleRegistration:
            resident.vehicleRegistration || "",

          emergencyContactName:
            resident.emergencyContact?.name || "",

          emergencyContactRelationship:
            resident.emergencyContact?.relationship || "",

          familyDetails:
            resident.familyDetails || "",

          profilePic:
            resident.profilePic || "",
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
  // INITIALS
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
  // SELECT PROFILE PICTURE
  // ==========================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Allowed formats
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Only JPG, PNG and WEBP images are allowed"
      );

      e.target.value = "";
      return;
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Profile picture must be smaller than 5MB"
      );

      e.target.value = "";
      return;
    }

    setSelectedImage(file);

    const previewUrl = URL.createObjectURL(file);

    setPreviewImage(previewUrl);
  };

  // ==========================================
  // UPLOAD PROFILE PICTURE
  // ==========================================

  const handleProfilePictureUpload = async () => {
    if (!selectedImage) {
      toast.error("Please select a profile picture");
      return;
    }

    try {
      setUploadingPicture(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        navigate("/");
        return;
      }

      const data = new FormData();

      data.append(
        "profilePic",
        selectedImage
      );

      const response = await axios.put(
        "https://smart-society-backend-delta.vercel.app/resident/profile-picture",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        const newProfilePic =
          response.data.data?.profilePic || "";

        setFormData((prev) => ({
          ...prev,
          profilePic: newProfilePic,
        }));

        setSelectedImage(null);
        setPreviewImage("");

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
                profilePic: newProfilePic,
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
            "Failed to update profile picture"
        );
      }
    } catch (error) {
      console.error(
        "Profile Picture Upload Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile picture"
      );
    } finally {
      setUploadingPicture(false);
    }
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
        navigate("/");
        return;
      }

      const response = await axios.put(
        "https://smart-society-backend-delta.vercel.app/resident/profile",
        {
          name: formData.name,
          phone: formData.phone,

          vehicleRegistration:
            formData.vehicleRegistration,

          emergencyContactName:
            formData.emergencyContactName,

          emergencyContactRelationship:
            formData.emergencyContactRelationship,

          familyDetails:
            formData.familyDetails,
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

        // ==========================================
        // UPDATE LOCAL STORAGE USER
        // ==========================================

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

        // ==========================================
        // UPDATE FORM DATA
        // ==========================================

        const updatedResident =
          response.data.data;

        setFormData((prev) => ({
          ...prev,

          name:
            updatedResident?.name ||
            prev.name,

          phone:
            updatedResident?.phone ||
            prev.phone,

          vehicleRegistration:
            updatedResident?.vehicleRegistration ||
            "",

          emergencyContactName:
            updatedResident?.emergencyContact
              ?.name || "",

          emergencyContactRelationship:
            updatedResident?.emergencyContact
              ?.relationship || "",

          familyDetails:
            updatedResident?.familyDetails ||
            "",
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
    <DashboardLayout role="resident">
      <div className="w-full min-w-0 max-w-full">

        {/* HEADER */}
        <div className="mb-6">

          <button
            type="button"
            onClick={() => navigate("/resident")}
            className="mb-4 flex items-center gap-2 text-[11px] font-bold text-[#8b778e] transition hover:text-[#9b7740]"
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </button>

          <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#9b7740]">
            Resident Portal
          </p>

          <h1 className="text-[20px] font-extrabold tracking-tight text-[#32143b] md:text-[22px]">
            Settings
          </h1>

          <p className="mt-1 text-[11.5px] font-medium text-[#8b778e]">
            Manage your resident account information.
          </p>

        </div>

        <div className="max-w-3xl space-y-5">

          {/* ==========================================
              PROFILE PICTURE
          ========================================== */}

          <section className="overflow-hidden rounded-none border border-[#e2d9df] bg-white">

            <div className="flex items-center gap-3 border-b border-[#e2d9df] px-5 py-4">

              <div className="flex h-9 w-9 items-center justify-center rounded-none bg-[#f7f3ed] text-[#9b7740]">
                <Camera size={17} />
              </div>

              <div>
                <h2 className="text-[13px] font-bold text-[#32143b]">
                  Profile Picture
                </h2>

                <p className="mt-0.5 text-[9.5px] font-medium text-[#8b778e]">
                  Update your resident profile picture.
                </p>
              </div>

            </div>

            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">

              {/* AVATAR */}

              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-none bg-[#9b7740] text-2xl font-extrabold text-white">

                {previewImage ||
                formData.profilePic ? (
                  <img
                    src={
                      previewImage ||
                      formData.profilePic
                    }
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitials(formData.name)
                )}

              </div>

              <div className="flex flex-col gap-3">

                <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-none border border-[#e2d9df] bg-white px-4 py-2.5 text-[10.5px] font-bold text-[#756b78] transition hover:border-[#d9be82] hover:text-[#9b7740]">

                  <Upload size={14} />

                  Choose Picture

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                </label>

                {selectedImage && (
                  <button
                    type="button"
                    onClick={handleProfilePictureUpload}
                    disabled={uploadingPicture}
                    className="flex w-fit items-center gap-2 rounded-none bg-[#9b7740] px-4 py-2.5 text-[10.5px] font-bold text-white shadow-lg shadow-#9b7740/20 transition hover:bg-[#9b7740] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save size={14} />

                    {uploadingPicture
                      ? "Uploading..."
                      : "Update Picture"}
                  </button>
                )}

                <p className="text-[9px] font-medium text-[#8b778e]">
                  JPG, PNG or WEBP. Maximum size 5MB.
                </p>

              </div>

            </div>

          </section>

          {/* ==========================================
              PERSONAL INFORMATION
          ========================================== */}

          <section className="overflow-hidden rounded-none border border-[#e2d9df] bg-white">

            <div className="flex items-center gap-3 border-b border-[#e2d9df] px-5 py-4">

              <div className="flex h-9 w-9 items-center justify-center rounded-none bg-[#f7f3ed] text-[#9b7740]">
                <Settings size={17} />
              </div>

              <div>
                <h2 className="text-[13px] font-bold text-[#32143b]">
                  Personal Information
                </h2>

                <p className="mt-0.5 text-[9.5px] font-medium text-[#8b778e]">
                  Update your personal account details.
                </p>
              </div>

            </div>

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
                    className="h-10 w-full rounded-none border border-[#e2d9df] bg-white pl-9 pr-3 text-[11px] text-[#49394d] outline-none transition focus:border-[#bca16a]"
                  />

                </div>
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-[#756b78]">
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b778e]"
                  />

                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="h-10 w-full cursor-not-allowed rounded-none border border-[#e2d9df] bg-[#f7f3ed] pl-9 pr-3 text-[11px] text-[#8b778e] outline-none"
                  />

                </div>

                <p className="mt-1.5 flex items-center gap-1 text-[9px] font-medium text-[#8b778e]">
                  <Lock size={10} />
                  Email address cannot be changed here.
                </p>
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
                    placeholder="Enter 10 digit phone number"
                    maxLength={10}
                    className="h-10 w-full rounded-none border border-[#e2d9df] bg-white pl-9 pr-3 text-[11px] text-[#49394d] outline-none transition focus:border-[#bca16a]"
                  />

                </div>
              </div>

              {/* FLAT */}

              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-[#756b78]">
                  Flat Number
                </label>

                <div className="relative">

                  <Home
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b778e]"
                  />

                  <input
                    type="text"
                    value={formData.flatNo}
                    disabled
                    className="h-10 w-full cursor-not-allowed rounded-none border border-[#e2d9df] bg-[#f7f3ed] pl-9 pr-3 text-[11px] text-[#8b778e] outline-none"
                  />

                </div>

                <p className="mt-1.5 text-[9px] font-medium text-[#8b778e]">
                  Flat assignment can only be changed by the administrator.
                </p>
              </div>

              {/* ==========================================
                  OTHER INFORMATION
              ========================================== */}

              <div className="border-t border-[#eee8ed] pt-5">

                <div className="mb-5">

                  <h3 className="text-[12px] font-bold text-[#32143b]">
                    Other Information
                  </h3>

                  <p className="mt-1 text-[9.5px] font-medium text-[#8b778e]">
                    Add additional information used by the society.
                  </p>

                </div>

                {/* VEHICLE */}

                <div className="mb-5">

                  <label className="mb-1.5 block text-[10px] font-bold text-[#756b78]">
                    Vehicle Registration
                  </label>

                  <div className="relative">

                    <Car
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b778e]"
                    />

                    <input
                      type="text"
                      name="vehicleRegistration"
                      value={
                        formData.vehicleRegistration
                      }
                      onChange={handleChange}
                      placeholder="e.g. ABC-123"
                      maxLength={30}
                      className="h-10 w-full rounded-none border border-[#e2d9df] bg-white pl-9 pr-3 text-[11px] text-[#49394d] uppercase outline-none transition focus:border-[#bca16a]"
                    />

                  </div>

                </div>

                {/* EMERGENCY CONTACT */}

                <div className="mb-5">

                  <div className="mb-3 flex items-center gap-2">

                    <UserRound
                      size={14}
                      className="text-[#9b7740]"
                    />

                    <h3 className="text-[11px] font-bold text-[#49394d]">
                      Emergency Contact
                    </h3>

                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">

                    {/* CONTACT NAME */}

                    <div>

                      <label className="mb-1.5 block text-[10px] font-bold text-[#756b78]">
                        Contact Name
                      </label>

                      <input
                        type="text"
                        name="emergencyContactName"
                        value={
                          formData.emergencyContactName
                        }
                        onChange={handleChange}
                        placeholder="Enter contact name"
                        maxLength={50}
                        className="h-10 w-full rounded-none border border-[#e2d9df] bg-white px-3 text-[11px] text-[#49394d] outline-none transition focus:border-[#bca16a]"
                      />

                    </div>

                    {/* RELATIONSHIP */}

                    <div>

                      <label className="mb-1.5 block text-[10px] font-bold text-[#756b78]">
                        Relationship
                      </label>

                      <input
                        type="text"
                        name="emergencyContactRelationship"
                        value={
                          formData.emergencyContactRelationship
                        }
                        onChange={handleChange}
                        placeholder="e.g. Father, Mother"
                        maxLength={50}
                        className="h-10 w-full rounded-none border border-[#e2d9df] bg-white px-3 text-[11px] text-[#49394d] outline-none transition focus:border-[#bca16a]"
                      />

                    </div>

                  </div>

                </div>

                {/* FAMILY DETAILS */}

                <div>

                  <label className="mb-1.5 flex items-center gap-2 text-[10px] font-bold text-[#756b78]">

                    <Users
                      size={14}
                      className="text-[#8b778e]"
                    />

                    Family / Tenant Details

                  </label>

                  <textarea
                    name="familyDetails"
                    value={formData.familyDetails}
                    onChange={handleChange}
                    placeholder="Enter family member or tenant details"
                    maxLength={500}
                    rows={4}
                    className="w-full resize-none rounded-none border border-[#e2d9df] bg-white px-3 py-2.5 text-[11px] text-[#49394d] outline-none transition focus:border-[#bca16a]"
                  />

                  <p className="mt-1 text-right text-[9px] font-medium text-[#8b778e]">
                    {formData.familyDetails.length}/500
                  </p>

                </div>

              </div>

              {/* SAVE */}

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

      </div>
    </DashboardLayout>
  );
}

export default ResidentSettings;