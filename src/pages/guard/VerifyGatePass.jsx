
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  User,
  Phone,
  Home,
  CalendarDays,
  Clock3,
  KeyRound,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

function VerifyGatePass() {
  const [gateKey, setGateKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [visitor, setVisitor] = useState(null);

  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(gateKey)) {
      return toast.error("Please enter a valid 6-digit gate key");
    }

    try {
      setLoading(true);
      setVisitor(null);

      const response = await axios.get(
        `https://smart-society-backend-delta.vercel.app/guard/verify-pass/${gateKey}`,
        {
          headers: getHeaders(),
        }
      );

      if (response.data.success) {
        setVisitor(response.data.data);
        toast.success("Visitor pass verified successfully");
      } else {
        toast.error(response.data.message || "Verification failed");
      }
    } catch (error) {
      console.error("Verify Visitor Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to verify visitor pass"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString();
  };

  const formatTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEntry = async () => {
    if (!visitor?._id) return;

    try {
      setLoading(true);

      const response = await axios.put(
        `https://smart-society-backend-delta.vercel.app/guard/visitors/${visitor._id}/entry`,
        {},
        {
          headers: getHeaders(),
        }
      );

      if (response.data.success) {
        toast.success("Visitor entry recorded successfully");

        setVisitor(response.data.data);
        setGateKey("");
      }
    } catch (error) {
      console.error("Mark Entry Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to record visitor entry"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="guard">
      <div className="w-full min-w-0 max-w-full">

        {/* HEADER */}
        <div className="mb-6">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-500">
            Security Portal
          </p>

          <h1 className="text-[20px] font-extrabold tracking-tight text-slate-900 md:text-[22px]">
            Verify Visitor Pass
          </h1>

          <p className="mt-1 text-[11.5px] font-medium text-slate-400">
            Enter the visitor's 6-digit gate key to verify access.
          </p>
        </div>

        {/* VERIFY FORM */}
        <section className="rounded-[16px] border border-slate-200 bg-white p-5">

          <form
            onSubmit={handleVerify}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <KeyRound
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={gateKey}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6);

                  setGateKey(value);
                }}
                placeholder="Enter 6-digit gate key"
                inputMode="numeric"
                maxLength={6}
                className="w-full rounded-[10px] border border-slate-200 py-3 pl-10 pr-3 text-[13px] font-bold tracking-[0.15em] text-slate-700 outline-none transition placeholder:font-medium placeholder:tracking-normal placeholder:text-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-[10px] bg-emerald-500 px-5 py-3 text-[11px] font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Search size={15} />

              {loading ? "Verifying..." : "Verify Pass"}
            </button>
          </form>
        </section>

        {/* VERIFIED VISITOR */}
        {visitor && (
          <section className="mt-6 overflow-hidden rounded-[16px] border border-emerald-200 bg-white">

            <div className="flex items-center gap-3 border-b border-emerald-100 bg-emerald-50 px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <ShieldCheck size={20} />
              </div>

              <div>
                <p className="text-[12px] font-bold text-emerald-700">
                  Verified Visitor Pass
                </p>

                <p className="mt-0.5 text-[10px] font-medium text-emerald-600">
                  This visitor is approved for entry.
                </p>
              </div>
            </div>

            <div className="p-5">

              <div className="grid gap-5 sm:grid-cols-2">

                <Info
                  icon={User}
                  label="Visitor Name"
                  value={visitor.visitorName}
                />

                <Info
                  icon={Phone}
                  label="Phone"
                  value={visitor.phone}
                />

                <Info
                  icon={Home}
                  label="Flat Number"
                  value={visitor.flatNo}
                />

                <Info
                  icon={CalendarDays}
                  label="Visit Date"
                  value={formatDate(visitor.visitDate)}
                />

                <Info
                  icon={Clock3}
                  label="Allowed Time"
                  value={`${formatTime(
                    visitor.visitStartTime
                  )} - ${formatTime(visitor.visitEndTime)}`}
                />

                <Info
                  icon={KeyRound}
                  label="Gate Key"
                  value={visitor.gateKey}
                />

              </div>

              <div className="mt-5">
                <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                  Purpose
                </p>

                <div className="mt-2 rounded-[10px] bg-slate-50 p-4">
                  <p className="text-[11px] font-medium text-slate-600">
                    {visitor.purpose}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleEntry}
                disabled={loading || visitor.gateStatus !== "Not Entered"}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-[10px] bg-emerald-500 px-4 py-3 text-[11px] font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CheckCircle2 size={16} />

                {visitor.gateStatus === "Not Entered"
                  ? "Allow Entry"
                  : "Entry Already Recorded"}
              </button>

            </div>
          </section>
        )}

      </div>
    </DashboardLayout>
  );
}


function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-slate-400">
        <Icon size={16} />
      </div>

      <div>
        <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-[11px] font-bold text-slate-700">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}


export default VerifyGatePass;
