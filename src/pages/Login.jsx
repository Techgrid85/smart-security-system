import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  LogIn,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // ==========================================
  // VALIDATE FIELD
  // ==========================================
  const validateField = (name, value) => {
    if (name === "email") {
      if (!value.trim()) {
        return "Email is required";
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(value.trim())) {
        return "Please enter a valid email address";
      }
    }

    if (name === "password") {
      if (!value) {
        return "Password is required";
      }
    }

    return "";
  };

  // ==========================================
  // HANDLE CHANGE
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ==========================================
  // LOGIN
  // ==========================================
  const login = async (e) => {
    e.preventDefault();

    setErrors({});

    const { email, password } = formData;

    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email =
        "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      console.log("Sending login request...");

      const response = await axios.post(
        "https://smart-society-backend-delta.vercel.app/login",
        {
          email: email.trim(),
          password,
        },
        {
          timeout: 10000,
        }
      );

      console.log("Login response:", response.data);

      if (!response.data.success) {
        toast.error(
          response.data.message || "Login failed"
        );
        return;
      }

      // ==========================================
      // SAVE LOGIN DATA
      // ==========================================

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: response.data.userId,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          flatNo: response.data.flatNo,
          phone: response.data.phone,
        })
      );

      toast.success(response.data.message);

      // ==========================================
      // ROLE BASED REDIRECT
      // ==========================================

      const role = response.data.role;

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "resident") {
        navigate("/resident");
      } else if (role === "guard") {
        navigate("/guard");
      } else if (role === "staff") {
        navigate("/staff");
      } else {
        toast.error("Invalid user role");
      }

    } catch (error) {
      console.error(
        "Login frontend error:",
        error
      );

      const message =
        error.response?.data?.message ||
        (error.code === "ECONNABORTED"
          ? "Login request timed out"
          : "Login failed. Please try again");

      const field =
        error.response?.data?.field;

      if (
        field === "email" ||
        field === "password"
      ) {
        setErrors({
          [field]: message,
        });
      }

      toast.error(message);

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
          MAIN LAYOUT
      ===================================================== */}

      <div className="min-h-screen lg:grid lg:grid-cols-2">

        {/* ===================================================
            LEFT IMAGE SECTION
        =================================================== */}

        <section className="relative hidden min-h-screen overflow-hidden lg:block">

          {/* LANDING PAGE IMAGE */}

          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=90"
            alt="SmartSociety"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* DARK PLUM OVERLAY */}

          <div className="absolute inset-0 bg-gradient-to-r from-[#210c28]/95 via-[#32143b]/75 to-[#32143b]/45" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#210c28]/90 via-transparent to-[#210c28]/30" />

          {/* CONTENT */}

          <div className="relative z-10 flex min-h-screen flex-col justify-between p-12 xl:p-16">

            {/* LOGO */}

            <Link
              to="/"
              className="flex w-fit items-center gap-4"
            >

              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 p-2 backdrop-blur-md">

                <img
                  src="/SmartSociety_Logo.svg"
                  alt="SmartSociety Logo"
                  className="h-full w-full object-contain"
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

            {/* HERO TEXT */}

            <div className="max-w-2xl">

              <div className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d9be82]">

                <span className="h-px w-10 bg-[#d9be82]" />

                Welcome Back

              </div>

              <h2 className="text-[50px] font-black leading-[1.03] tracking-[-0.04em] text-white xl:text-[68px]">

                Manage your
                <br />

                society.

                <br />

                <span className="font-normal text-[#d9be82]">
                  Simply.
                </span>

              </h2>

              <p className="mt-7 max-w-xl text-[15px] leading-8 text-white/75">
                Stay connected with your community,
                manage your society activities, and access
                everything from one simple platform.
              </p>

              {/* FEATURES */}

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

            {/* FOOTER */}

            <div className="border-t border-white/15 pt-6 text-[10px] uppercase tracking-[0.16em] text-white/40">
              Smart Society Management Platform
            </div>

          </div>

        </section>

        {/* ===================================================
            RIGHT LOGIN SECTION
        =================================================== */}

        <section className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 lg:px-10 xl:px-16">

          <div className="w-full max-w-[450px]">

            {/* MOBILE LOGO */}

            <div className="mb-8 flex items-center justify-between lg:hidden">

              <Link
                to="/"
                className="flex items-center gap-3"
              >

                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ddd4df] bg-white p-2">

                  <img
                    src="/SmartSociety_Logo.svg"
                    alt="SmartSociety Logo"
                    className="h-full w-full object-contain"
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

            {/* LOGIN CARD */}

            <div className="border border-[#e1d8e1] bg-white p-6 shadow-[0_20px_60px_rgba(50,20,59,0.08)] sm:p-9">

              {/* ICON */}

              <div className="mb-6 flex justify-center">

                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#e1d8e1] bg-[#f7f3ed]">

                  <LogIn
                    size={26}
                    className="text-[#9b7740]"
                  />

                </div>

              </div>

              {/* HEADER */}

              <div className="mb-8 text-center">

                <div className="mb-3 flex items-center justify-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#9b7740]">

                  <span className="h-px w-6 bg-[#9b7740]" />

                  Sign In

                  <span className="h-px w-6 bg-[#9b7740]" />

                </div>

                <h2 className="text-3xl font-black tracking-tight text-[#32143b]">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-[#756b78]">
                  Sign in to your SmartSociety account
                </p>

              </div>

              {/* FORM */}

              <form
                onSubmit={login}
                className="space-y-5"
              >

                {/* EMAIL */}

                <div>

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
                      placeholder="Enter your email"
                      className={`${inputClass(
                        "email"
                      )} pl-10`}
                    />

                  </div>

                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.email}
                    </p>
                  )}

                </div>

                {/* PASSWORD */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label className="block text-xs font-bold uppercase tracking-wide text-[#49394d]">
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs font-semibold text-[#9b7740] transition hover:text-[#32143b]"
                    >
                      Forgot password?
                    </button>

                  </div>

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
                      placeholder="Enter your password"
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

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 bg-[#32143b] text-sm font-bold text-white shadow-lg shadow-[#32143b]/15 transition hover:bg-[#4b2357] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading
                    ? "Signing in..."
                    : "Sign In"}

                  {!loading && (
                    <ArrowRight size={18} />
                  )}

                </button>

              </form>

              {/* DIVIDER */}

              <div className="my-7 flex items-center gap-4">

                <div className="h-px flex-1 bg-[#e1d8e1]" />

                <span className="text-xs text-[#a296a7]">
                  or
                </span>

                <div className="h-px flex-1 bg-[#e1d8e1]" />

              </div>

              {/* REGISTER */}

              <p className="text-center text-sm text-[#756b78]">

                Don't have an account?{" "}

                <Link
                  to="/register"
                  className="font-bold text-[#9b7740] transition hover:text-[#32143b]"
                >
                  Create account
                </Link>

              </p>

              {/* HOME */}

              <p className="mt-4 text-center text-sm text-[#756b78]">

                Don't want to login?{" "}

                <Link
                  to="/"
                  className="font-bold text-[#9b7740] transition hover:text-[#32143b]"
                >
                  Go back to Home
                </Link>

              </p>

            </div>

            {/* BOTTOM TEXT */}

            <p className="mt-6 text-center text-[10px] uppercase tracking-[0.12em] text-[#a296a7]">
              SmartSociety Management Platform
            </p>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Login;