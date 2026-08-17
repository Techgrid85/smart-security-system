import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  LogIn,
  ArrowRight,
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

const login = async (e) => {
  e.preventDefault();

  // Clear previous backend errors first
  setErrors({});

  const { email, password } = formData;

  const newErrors = {};

  if (!email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newErrors.email = "Please enter a valid email address";
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
      toast.error(response.data.message || "Login failed");
      return;
    }

    // Save login data
    localStorage.setItem("token", response.data.token);

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
    console.error("Login frontend error:", error);

    const message =
      error.response?.data?.message ||
      (error.code === "ECONNABORTED"
        ? "Login request timed out"
        : "Login failed. Please try again");

    const field = error.response?.data?.field;

    if (field === "email" || field === "password") {
      setErrors({
        [field]: message,
      });
    }

    toast.error(message);

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex bg-slate-50">

      <div className="hidden lg:flex lg:w-1/2 xl:w-[52%] bg-[#12372a] text-white px-16 xl:px-24 py-16 flex-col justify-center">

        <div className="flex items-center gap-4 mb-12">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <img
  src="/SmartSociety_Logo.svg"
  alt="SmartSociety Logo"
  className="h-full w-full object-contain"
/>
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
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-4"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-400/15 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>

              <span className="text-slate-200">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-1/2 xl:w-[48%] min-h-screen flex items-center justify-center px-5 sm:px-8 py-8">

        <div className="w-full max-w-[450px] bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/60 px-6 sm:px-9 py-9">

          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
              <img
                src="/SmartSociety_Logo.svg"
                alt="SmartSociety Logo"
                className="h-full w-full object-contain"
              />
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

          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <LogIn
                size={27}
                className="text-emerald-600"
              />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Welcome back
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Sign in to your SmartSociety account
            </p>
          </div>

          <form onSubmit={login} className="space-y-5">

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full h-12 rounded-lg border pl-11 pr-4 text-sm outline-none transition ${
                    errors.email
                      ? "border-red-500 focus:ring-4 focus:ring-red-100 focus:border-red-500"
                      : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  }`}
                />
              </div>

              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <button
                  type="button"
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full h-12 rounded-lg border pl-11 pr-4 text-sm outline-none transition ${
                    errors.password
                      ? "border-red-500 focus:ring-4 focus:ring-red-100 focus:border-red-500"
                      : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  }`}
                />
              </div>

              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}

              {!loading && <ArrowRight size={18} />}
            </button>

          </form>

          <div className="flex items-center gap-4 my-7">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-sm text-slate-400">or</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <p className="text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Create account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;
