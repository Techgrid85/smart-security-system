import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ArrowRight,
  User,
  Mail,
  Phone,
  Lock,
  Home,
} from "lucide-react";



function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    flatNo: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [flats, setFlats] = useState([]);
  const [flatsLoading, setFlatsLoading] = useState(true);


  // ==========================================
// FETCH AVAILABLE FLATS
// ==========================================
useEffect(() => {
  const fetchAvailableFlats = async () => {
    try {
      setFlatsLoading(true);

      const response = await axios.get(
        "https://smart-society-backend-delta.vercel.app/available-flats"
      );

      if (response.data.success) {
        setFlats(response.data.data || []);
      }
    } catch (error) {
      console.error("Fetch Available Flats Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load available flats"
      );
    } finally {
      setFlatsLoading(false);
    }
  };

  fetchAvailableFlats();
}, []);


  // Validate one field
  const validateField = (name, value, data = formData) => {
    const trimmedValue =
      typeof value === "string" ? value.trim() : value;

    switch (name) {
      case "name":
        if (!trimmedValue) return "Full name is required";
        if (trimmedValue.length < 3)
          return "Name must be at least 3 characters";
        if (trimmedValue.length > 50)
          return "Name cannot exceed 50 characters";
        if (!/^[a-zA-Z\s.'-]+$/.test(trimmedValue))
          return "Name contains invalid characters";
        return "";

      case "email":
        if (!trimmedValue) return "Email is required";
        if (
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)
        ) {
          return "Please enter a valid email address";
        }
        return "";

      case "flatNo":
        if (!trimmedValue) return "Please select your flat";

        if (!flats.some((flat) => flat.flatNo === trimmedValue)) {
          return "Please select a valid flat";
        }

        return "";

      case "phone":
        if (!trimmedValue) return "Phone number is required";
        if (!/^\d+$/.test(trimmedValue))
          return "Phone number can only contain digits";
        if (trimmedValue.length !== 10)
          return "Phone number must be exactly 10 digits";
        return "";

      case "password":
        if (!value) return "Password is required";
        if (value.length < 8)
          return "Password must be at least 8 characters";
        if (value.length > 100)
          return "Password is too long";
        if (!/[A-Z]/.test(value))
          return "Password must contain one uppercase letter";
        if (!/[a-z]/.test(value))
          return "Password must contain one lowercase letter";
        if (!/\d/.test(value))
          return "Password must contain one number";
        return "";

      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== data.password)
          return "Passwords do not match";
        return "";

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone: allow digits only
    if (name === "phone" && value && !/^\d*$/.test(value)) {
      return;
    }

    const updatedData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedData);

    const fieldError = validateField(
      name,
      value,
      updatedData
    );

    setErrors((prev) => {
      const newErrors = {
        ...prev,
        [name]: fieldError,
      };

      // Recheck confirm password when password changes
      if (
        name === "password" &&
        updatedData.confirmPassword
      ) {
        newErrors.confirmPassword = validateField(
          "confirmPassword",
          updatedData.confirmPassword,
          updatedData
        );
      }

      return newErrors;
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    const error = validateField(
      name,
      value,
      formData
    );

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((field) => {
      const error = validateField(
        field,
        formData[field],
        formData
      );

      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const register = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "https://smart-society-backend-delta.vercel.app/register",
        {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          flatNo: formData.flatNo,
          phone: formData.phone,
          password: formData.password,
        }
      );

      if (response.data.success) {
        toast.success(
          response.data.message || "Account created successfully"
        );

        setFormData({
          name: "",
          email: "",
          flatNo: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });

        setErrors({});

        navigate("/login");
      } else {
        toast.error(
          response.data.message || "Registration failed"
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full h-11 rounded-lg border px-3 text-sm text-slate-700 outline-none transition ${
      errors[field]
        ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
        : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
    }`;

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[52%] bg-[#12372a] text-white px-16 xl:px-24 py-16 flex-col justify-center">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <img src="/SmartSociety_Logo.svg" alt="SmartSociety Logo" className="h-full w-full object-contain" />
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              SmartSociety
            </h1>

            <p className="text-sm text-emerald-300">
              Society Management
            </p>
          </div>
        </div>

        <div className="max-w-xl">
          <h2 className="text-5xl xl:text-6xl font-bold leading-[1.08]">
            Manage your
            <br />
            society{" "}
            <span className="text-emerald-400">
              effortlessly
            </span>
          </h2>

          <p className="mt-8 text-lg leading-8 text-slate-300 max-w-lg">
            Pay maintenance, track complaints, and stay connected
            with your community — all in one place.
          </p>
        </div>

        <div className="mt-12 space-y-6">
          {[
            "Quick maintenance payments",
            "Real-time emergency alerts",
            "Easily manage society complaints",
          ].map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-4"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-400/15 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>

              <span className="text-slate-200">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 xl:w-[48%] min-h-screen flex items-center justify-center px-5 sm:px-8 py-8">
        <div className="w-full max-w-[470px] bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/60 px-6 sm:px-9 py-8">
          {/* MOBILE BRAND */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-7">
            <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
              <img src="/SmartSociety_Logo.svg" alt="SmartSociety Logo" className="h-full w-full object-contain" />
            </div>

            <div>
              <h1 className="font-bold text-slate-900">
                SmartSociety
              </h1>

              <p className="text-xs text-emerald-600">
                Society Management
              </p>
            </div>
          </div>

          <div className="text-center mb-7">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Create Account
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Register and join your SmartSociety community
            </p>
          </div>

          <form
            onSubmit={register}
            noValidate
            className="space-y-4"
          >
            {/* NAME */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={17}
                  className="absolute left-3.5 top-[22px] -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your full name"
                  className={`${inputClass("name")} pl-10`}
                />
              </div>

              {errors.name && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.name}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-3.5 top-[22px] -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your email"
                  className={`${inputClass("email")} pl-10`}
                />
              </div>

              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.email}
                </p>
              )}
            </div>

            {/* FLAT + PHONE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* FLAT */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Flat Number
                </label>

                <div className="relative">
                  <Home
                    size={16}
                    className="absolute left-3 top-[22px] -translate-y-1/2 text-slate-400 pointer-events-none"
                  />

                  <select
                    name="flatNo"
                    value={formData.flatNo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${inputClass("flatNo")} appearance-none pl-9 pr-9 bg-white`}
                  >
                    <option value="">
                      Select flat
                    </option>

                    {flatsLoading ? (
                      <option value="" disabled>
                        Loading flats...
                      </option>
                    ) : flats.length === 0 ? (
                      <option value="" disabled>
                        No vacant flats available
                      </option>
                    ) : (
                      flats.map((flat) => (
                        <option key={flat._id} value={flat.flatNo}>
                          {flat.flatNo} — Block {flat.block} — {flat.type}
                        </option>
                      ))
                    )}
                  </select>

                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-[22px] -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>

                {errors.flatNo && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {errors.flatNo}
                  </p>
                )}
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3.5 top-[22px] -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="10-digit number"
                    maxLength={10}
                    className={`${inputClass("phone")} pl-10`}
                  />
                </div>

                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-3.5 top-[22px] -translate-y-1/2 text-slate-400"
                />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Minimum 8 characters"
                  className={`${inputClass("password")} pl-10`}
                />
              </div>

              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.password}
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-3.5 top-[22px] -translate-y-1/2 text-slate-400"
                />

                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Confirm your password"
                  className={`${inputClass("confirmPassword")} pl-10`}
                />
              </div>

              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}

              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Sign in
            </Link>
          </p>
          <br />
          <p className="text-center text-sm text-slate-500">
            Don't want to Register?{" "}
            <Link
              to="/"
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Go back to Home Page...
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
