import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle2,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ==========================================
  // VALIDATE FIELD
  // ==========================================
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

      case "phone":
        if (!trimmedValue)
          return "Phone number is required";

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
        if (!value)
          return "Please confirm your password";

        if (value !== data.password)
          return "Passwords do not match";

        return "";

      default:
        return "";
    }
  };

  // ==========================================
  // HANDLE CHANGE
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone: digits only
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

      // Recheck confirm password
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

  // ==========================================
  // HANDLE BLUR
  // ==========================================
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

  // ==========================================
  // VALIDATE FORM
  // ==========================================
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

  // ==========================================
  // REGISTER
  // ==========================================
  const register = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "https://smart-society-backend-delta.vercel.app/visitor/register",
        {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone,
          password: formData.password,
        }
      );

      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Account created successfully"
        );

        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });

        setErrors({});

        navigate("/login");
      } else {
        toast.error(
          response.data.message ||
            "Registration failed"
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

  // ==========================================
  // INPUT STYLE
  // ==========================================
  const inputClass = (field) =>
    `h-12 w-full rounded-none border bg-white px-3 text-sm text-[#32143b] outline-none transition ${
      errors[field]
        ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
        : "border-[#ddd4df] focus:border-[#9b7740] focus:ring-4 focus:ring-[#d9be82]/20"
    }`;

  return (
    <div className="min-h-screen bg-[#f7f3ed]">

      {/* =====================================================
          DESKTOP LAYOUT
      ===================================================== */}

      <div className="min-h-screen lg:grid lg:grid-cols-2">

        {/* ===================================================
            LEFT IMAGE SECTION
        =================================================== */}

        <section className="relative hidden min-h-screen overflow-hidden lg:block">

          {/* Background Image */}

          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=90"
            alt="SmartSociety"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Overlay */}

          <div className="absolute inset-0 bg-gradient-to-r from-[#210c28]/95 via-[#32143b]/75 to-[#32143b]/45" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#210c28]/90 via-transparent to-[#210c28]/30" />

          {/* Content */}

          <div className="relative z-10 flex min-h-screen flex-col justify-between p-12 xl:p-16">

            {/* Logo */}

            <Link
              to="/"
              className="flex w-fit items-center gap-4"
            >
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
                <img
                  src="/SmartSociety_Logo.svg"
                  alt="SmartSociety Logo"
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <h1 className="text-2xl font-black text-white">
                  Smart
                  <span className="font-normal text-[#d9be82]">
                    Society
                  </span>
                </h1>

                <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/60">
                  Smart Society Management
                </p>
              </div>
            </Link>

            {/* Main Text */}

            <div className="max-w-2xl">

              <div className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d9be82]">
                <span className="h-px w-10 bg-[#d9be82]" />
                Visitor Registration
              </div>

              <h2 className="text-[50px] font-black leading-[1.03] tracking-[-0.04em] text-white xl:text-[68px]">
                Better society.
                <br />
                <span className="font-normal text-[#d9be82]">
                  Better living.
                </span>
              </h2>

              <p className="mt-7 max-w-xl text-[15px] leading-8 text-white/75">
                Create a visitor account to request visits and
                access your approved digital visitor passes.
              </p>

              {/* Features */}

              <div className="mt-9 space-y-4">

                {[
                  "Quick maintenance payments",
                  "Real-time emergency alerts",
                  "Easily manage society complaints",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-[#d9be82]"
                    />

                    <span className="text-sm font-medium text-white/80">
                      {feature}
                    </span>
                  </div>
                ))}

              </div>

            </div>

            {/* Bottom */}

            <div className="border-t border-white/15 pt-6 text-[10px] uppercase tracking-[0.16em] text-white/40">
              Smart Society Management Platform
            </div>

          </div>
        </section>

        {/* ===================================================
            RIGHT REGISTER SECTION
        =================================================== */}

        <section className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 lg:px-10 xl:px-16">

          <div className="w-full max-w-[520px]">

            {/* MOBILE BRAND */}

            <div className="mb-8 flex items-center justify-between lg:hidden">

              <Link
                to="/"
                className="flex items-center gap-3"
              >
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
                  <img
                    src="/SmartSociety_Logo.svg"
                    alt="SmartSociety Logo"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <h1 className="text-lg font-black text-[#32143b]">
                    Smart
                    <span className="font-normal text-[#9b7740]">
                      Society
                    </span>
                  </h1>

                  <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#806d82]">
                    Society Management
                  </p>
                </div>
              </Link>

            </div>

            {/* REGISTER HEADER */}

            <div className="mb-8">

              <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#9b7740]">
                <span className="h-px w-7 bg-[#9b7740]" />
                Create Your Account
              </div>

              <h2 className="mt-4 text-3xl font-black tracking-tight text-[#32143b] sm:text-4xl">
                Welcome to
                <span className="font-normal text-[#63366f]">
                  {" "}SmartSociety
                </span>
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#756b78]">
                Register as a visitor. Resident accounts are created only by the administrator.
              </p>

            </div>

            {/* FORM */}

            <form
              onSubmit={register}
              noValidate
              className="border border-[#e1d8e1] bg-white p-6 shadow-[0_20px_60px_rgba(50,20,59,0.08)] sm:p-8"
            >

              {/* NAME */}

              <div className="mb-5">

                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#49394d]">
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#958799]"
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
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.name}
                  </p>
                )}

              </div>

              {/* EMAIL */}

              <div className="mb-5">

                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#49394d]">
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#958799]"
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
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.email}
                  </p>
                )}

              </div>

              {/* PHONE */}

              <div className="mb-5">

                {false && (
                <div>

                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#49394d]">
                    Resident Flat
                  </label>

                  <div className="relative">

                    <Home
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#958799]"
                    />

                    <select
                      name="flatNo"
                      value={formData.flatNo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`${inputClass(
                        "flatNo"
                      )} appearance-none bg-white pl-9 pr-9`}
                    >

                      <option value="">
                        Choose later when requesting a visit
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
                          <option
                            key={flat._id}
                            value={flat.flatNo}
                          >
                            {flat.flatNo} — Block{" "}
                            {flat.block} — {flat.type}
                          </option>
                        ))
                      )}

                    </select>

                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#958799]"
                    />

                  </div>

                  {errors.flatNo && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.flatNo}
                    </p>
                  )}

                </div>
                )}

                {/* PHONE */}

                <div>

                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#49394d]">
                    Phone Number
                  </label>

                  <div className="relative">

                    <Phone
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#958799]"
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
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.phone}
                    </p>
                  )}

                </div>

              </div>

              {/* PASSWORD */}

              <div className="mb-5">

                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#49394d]">
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#958799]"
                  />

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Minimum 8 characters"
                    className={`${inputClass(
                      "password"
                    )} pl-10`}
                  />

                </div>

                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.password}
                  </p>
                )}

              </div>

              {/* CONFIRM PASSWORD */}

              <div className="mb-6">

                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#49394d]">
                  Confirm Password
                </label>

                <div className="relative">

                  <Lock
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#958799]"
                  />

                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Confirm your password"
                    className={`${inputClass(
                      "confirmPassword"
                    )} pl-10`}
                  />

                </div>

                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 bg-[#32143b] text-sm font-bold text-white shadow-lg shadow-[#32143b]/15 transition hover:bg-[#4b2357] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}

                {!loading && <ArrowRight size={18} />}
              </button>

              {/* LOGIN */}

              <p className="mt-6 text-center text-sm text-[#756b78]">

                Already have an account?{" "}

                <Link
                  to="/login"
                  className="font-bold text-[#9b7740] transition hover:text-[#32143b]"
                >
                  Sign in
                </Link>

              </p>

            </form>

            {/* HOME LINK */}

            <div className="mt-6 text-center">

              <Link
                to="/"
                className="text-xs font-semibold text-[#806d82] transition hover:text-[#32143b]"
              >
                ← Back to Home Page
              </Link>

            </div>

            {/* MOBILE BOTTOM */}

            <p className="mt-8 text-center text-[10px] uppercase tracking-[0.12em] text-[#a296a7]">
              SmartSociety Management Platform
            </p>

          </div>
        </section>
      </div>
    </div>
  );
}

export default Register;
