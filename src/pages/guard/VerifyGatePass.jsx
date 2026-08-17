import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import {
  QrCode,
  Search,
  User,
  Phone,
  Home,
  Calendar,
  Clock3,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
  LogIn,
  X,
  RefreshCw,
  Eye,
  Users,
  Check,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

const API_URL = "https://smart-society-backend-delta.vercel.app";

function VerifyGatePass() {
  const [visitorId, setVisitorId] = useState("");
  const [visitor, setVisitor] = useState(null);

  const [loading, setLoading] = useState(false);
  const [entryLoading, setEntryLoading] = useState(false);

  // Pending passes
  const [pendingVisitors, setPendingVisitors] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(true);

  // Details modal
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [approveLoading, setApproveLoading] = useState(false);


  const getConfig = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };


  const fetchPendingVisitors = async () => {
    try {
      setPendingLoading(true);

      const response = await axios.get(
        `${API_URL}/guard/pending-visitors`,
        getConfig()
      );

      if (response.data.success) {
        setPendingVisitors(response.data.data || []);
      } else {
        setPendingVisitors([]);
        toast.error(
          response.data.message ||
            "Failed to load pending visitor passes"
        );
      }
    } catch (error) {
      console.error(
        "GET PENDING VISITORS ERROR:",
        error.response?.data || error
      );

      setPendingVisitors([]);

      toast.error(
        error.response?.data?.message ||
          "Failed to load pending visitor passes"
      );
    } finally {
      setPendingLoading(false);
    }
  };

  // ==========================================
  // LOAD PENDING PASSES
  // ==========================================

  useEffect(() => {
    fetchPendingVisitors();
  }, []);

  // ==========================================
  // APPROVE VISITOR PASS
  // PUT /guard/approve-pass/:visitorId
  // ==========================================

  const handleApprove = async (id) => {
    if (!id) {
      toast.error("Visitor ID is missing");
      return;
    }

    try {
      setApproveLoading(true);

      const response = await axios.put(
        `${API_URL}/guard/approve-pass/${id}`,
        {},
        getConfig()
      );

      if (!response.data.success) {
        toast.error(
          response.data.message ||
            "Failed to approve visitor pass"
        );
        return;
      }

      toast.success(
        response.data.message ||
          "Visitor pass approved successfully"
      );

      // Close modal
      setSelectedVisitor(null);

      // Remove approved visitor from pending list
      setPendingVisitors((previous) =>
        previous.filter(
          (item) => item._id !== id
        )
      );

      // Refresh list from backend
      fetchPendingVisitors();

    } catch (error) {
      console.error(
        "APPROVE VISITOR ERROR:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to approve visitor pass"
      );
    } finally {
      setApproveLoading(false);
    }
  };

  // ==========================================
  // SEARCH / VERIFY APPROVED PASS
  // ==========================================

  const handleSearch = async (e) => {
    e.preventDefault();

    const id = visitorId.trim();

    if (!id) {
      toast.error("Please enter a Visitor ID");
      return;
    }

    try {
      setLoading(true);
      setVisitor(null);

      const response = await axios.get(
        `${API_URL}/guard/verify-pass/${id}`,
        getConfig()
      );

      const visitorData =
        response.data?.data ||
        response.data?.visitor ||
        response.data;

      if (!visitorData || !visitorData._id) {
        toast.error("Visitor pass data was not found");
        return;
      }

      setVisitor(visitorData);

      toast.success(
        response.data?.message ||
          "Visitor pass verified successfully"
      );
    } catch (error) {
      console.error(
        "VERIFY PASS ERROR:",
        error.response?.data || error
      );

      setVisitor(null);

      toast.error(
        error.response?.data?.message ||
          "Failed to find visitor pass"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // MARK VISITOR ENTRY
  // ==========================================

  const handleMarkEntry = async () => {
    if (!visitor?._id) {
      toast.error("Visitor information is missing");
      return;
    }

    try {
      setEntryLoading(true);

      const response = await axios.put(
        `${API_URL}/guard/visitors/${visitor._id}/entry`,
        {},
        getConfig()
      );

      const updatedVisitor =
        response.data?.data ||
        response.data?.visitor;

      if (updatedVisitor) {
        setVisitor(updatedVisitor);
      } else {
        setVisitor((previous) => ({
          ...previous,
          gateStatus: "Inside",
          entryTime: new Date().toISOString(),
        }));
      }

      toast.success(
        response.data?.message ||
          "Visitor entry recorded successfully"
      );
    } catch (error) {
      console.error(
        "MARK ENTRY ERROR:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to record visitor entry"
      );
    } finally {
      setEntryLoading(false);
    }
  };

  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  const handleClear = () => {
    setVisitorId("");
    setVisitor(null);
  };

  return (
    <DashboardLayout role="guard">
      <div className="mx-auto w-full max-w-[1100px]">

        {/* ================= HEADER ================= */}

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <Link
              to="/guard"
              className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 transition hover:text-emerald-500"
            >
              <ArrowLeft size={14} />
              Back to Dashboard
            </Link>

            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-500">
              Security Portal
            </p>

            <h1 className="text-[22px] font-extrabold tracking-tight text-slate-900">
              Verify & Approve Visitor Passes
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-slate-400">
              Review pending visitor requests and verify approved passes at the gate.
            </p>
          </div>

          <div className="hidden h-12 w-12 items-center justify-center rounded-[14px] bg-emerald-50 text-emerald-500 sm:flex">
            <QrCode size={23} />
          </div>
        </div>

        {/* ================= PENDING PASSES ================= */}

        <section className="mb-6 overflow-hidden rounded-[18px] border border-slate-200 bg-white">

          <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">

            <div>
              <h2 className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
                <Clock3
                  size={16}
                  className="text-amber-500"
                />
                Pending Visitor Passes
              </h2>

              <p className="mt-1 text-[10.5px] font-medium text-slate-400">
                {pendingVisitors.length} visitor
                {pendingVisitors.length !== 1 ? "s" : ""} waiting for approval
              </p>
            </div>

            <button
              type="button"
              onClick={fetchPendingVisitors}
              disabled={pendingLoading}
              className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-[10px] font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw
                size={14}
                className={
                  pendingLoading
                    ? "animate-spin"
                    : ""
                }
              />
              Refresh
            </button>

          </div>

          {pendingLoading ? (

            <div className="flex min-h-[220px] items-center justify-center">
              <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Loading pending passes...
              </div>
            </div>

          ) : pendingVisitors.length > 0 ? (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px]">

                <thead>
                  <tr className="bg-slate-50">
                    <TableHead>Pass ID</TableHead>
                    <TableHead>Visitor</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Flat</TableHead>
                    <TableHead>Visit Date</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Action</TableHead>
                  </tr>
                </thead>

                <tbody>

                  {pendingVisitors.map((item) => (
                    <tr
                      key={item._id}
                      className="border-t border-slate-100 transition hover:bg-slate-50"
                    >

                      <td className="px-5 py-4 text-[10px] font-bold text-emerald-500">
                        #{item._id?.slice(-6)}
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-[11px] font-bold text-slate-800">
                          {item.visitorName}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-[10px] font-medium text-slate-500">
                        {item.phone}
                      </td>

                      <td className="px-5 py-4 text-[10px] font-medium text-slate-500">
                        {item.flatNo || item.resident?.flatNo || "-"}
                      </td>

                      <td className="px-5 py-4 text-[10px] font-medium text-slate-500">
                        {formatDate(item.visitDate)}
                      </td>

                      <td className="max-w-[180px] px-5 py-4">
                        <p className="truncate text-[10px] font-medium text-slate-500">
                          {item.purpose}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedVisitor(item)}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[9.5px] font-bold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600"
                        >
                          <Eye size={13} />
                          View
                        </button>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          ) : (

            <div className="flex min-h-[220px] flex-col items-center justify-center px-5 text-center">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                <CheckCircle2 size={21} />
              </div>

              <h3 className="mt-3 text-[11px] font-bold text-slate-700">
                No Pending Visitor Passes
              </h3>

              <p className="mt-1 text-[10px] font-medium text-slate-400">
                All visitor pass requests have been reviewed.
              </p>

            </div>

          )}

        </section>

        {/* ================= SEARCH CARD ================= */}

        <section className="overflow-hidden rounded-[18px] border border-slate-200 bg-white">

          <div className="border-b border-slate-200 px-5 py-4">

            <h2 className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
              <Search
                size={16}
                className="text-emerald-500"
              />
              Verify Approved Pass
            </h2>

            <p className="mt-1 text-[10.5px] font-medium text-slate-400">
              Enter the complete Visitor ID to verify an approved visitor at the gate.
            </p>

          </div>

          <div className="p-5">

            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-3 sm:flex-row"
            >

              <div className="relative flex-1">

                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={visitorId}
                  onChange={(e) => setVisitorId(e.target.value)}
                  placeholder="Enter complete Visitor ID..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-[12px] font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                />

              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-11 min-w-[135px] items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-[11.5px] font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Searching...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    Verify Pass
                  </>
                )}
              </button>

            </form>

          </div>

        </section>

        {/* ================= VERIFIED VISITOR RESULT ================= */}

        {visitor && (

          <section className="mt-6 overflow-hidden rounded-[18px] border border-slate-200 bg-white">

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                  <CheckCircle2 size={20} />
                </div>

                <div>
                  <h2 className="text-[13px] font-bold text-slate-900">
                    Visitor Pass Verified
                  </h2>

                  <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                    Review the details before allowing gate entry.
                  </p>
                </div>

              </div>

              <PassStatus status={visitor.status} />

            </div>

            <div className="grid md:grid-cols-2">

              <InfoItem
                icon={User}
                label="Visitor Name"
                value={visitor.visitorName}
              />

              <InfoItem
                icon={Phone}
                label="Phone Number"
                value={visitor.phone}
              />

              <InfoItem
                icon={Home}
                label="Flat Number"
                value={
                  visitor.flatNo ||
                  visitor.resident?.flatNo
                }
              />

              <InfoItem
                icon={ShieldCheck}
                label="Purpose"
                value={visitor.purpose}
              />

              <InfoItem
                icon={Calendar}
                label="Visit Date"
                value={formatDate(visitor.visitDate)}
              />

              <InfoItem
                icon={Clock3}
                label="Gate Status"
                value={visitor.gateStatus || "Not Entered"}
              />

              <InfoItem
                icon={Clock3}
                label="Entry Time"
                value={formatDateTime(visitor.entryTime)}
              />

              <InfoItem
                icon={Clock3}
                label="Exit Time"
                value={formatDateTime(visitor.exitTime)}
              />

            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-[11px] font-bold text-slate-700">
                  Gate Entry Control
                </p>

                <p className="mt-0.5 text-[9.5px] font-medium text-slate-400">
                  Record entry only after confirming the visitor at the gate.
                </p>
              </div>

              <div className="flex items-center gap-2">

                <button
                  type="button"
                  onClick={handleClear}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 text-[10.5px] font-bold text-slate-500 transition hover:bg-slate-50"
                >
                  <X size={15} />
                  Clear
                </button>

                {visitor.gateStatus === "Inside" ? (

                  <div className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 text-[10.5px] font-bold text-emerald-600">
                    <CheckCircle2 size={16} />
                    Visitor Already Inside
                  </div>

                ) : visitor.gateStatus === "Exited" ? (

                  <div className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 text-[10.5px] font-bold text-slate-500">
                    <AlertCircle size={16} />
                    Visit Completed
                  </div>

                ) : (

                  <button
                    type="button"
                    onClick={handleMarkEntry}
                    disabled={entryLoading}
                    className="flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-[10.5px] font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {entryLoading ? (
                      <>
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                        Recording...
                      </>
                    ) : (
                      <>
                        <LogIn size={15} />
                        Allow & Record Entry
                      </>
                    )}
                  </button>

                )}

              </div>

            </div>

          </section>

        )}

        {/* ================= APPROVAL MODAL ================= */}

        {selectedVisitor && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">

            <div className="w-full max-w-[580px] overflow-hidden rounded-[18px] bg-white shadow-xl">

              <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-amber-500">
                    Pending Visitor Request
                  </p>

                  <h2 className="mt-1 text-[16px] font-bold text-slate-900">
                    {selectedVisitor.visitorName}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedVisitor(null)}
                  disabled={approveLoading}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100"
                >
                  <X size={17} />
                </button>

              </div>

              <div className="grid grid-cols-2">

                <InfoItem
                  icon={User}
                  label="Visitor Name"
                  value={selectedVisitor.visitorName}
                />

                <InfoItem
                  icon={Phone}
                  label="Phone Number"
                  value={selectedVisitor.phone}
                />

                <InfoItem
                  icon={Home}
                  label="Flat Number"
                  value={
                    selectedVisitor.flatNo ||
                    selectedVisitor.resident?.flatNo
                  }
                />

                <InfoItem
                  icon={Calendar}
                  label="Visit Date"
                  value={formatDate(selectedVisitor.visitDate)}
                />

              </div>

              <div className="border-t border-slate-100 px-5 py-4">

                <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                  Purpose
                </p>

                <div className="mt-2 rounded-xl bg-slate-50 p-3.5">
                  <p className="text-[11px] leading-5 text-slate-600">
                    {selectedVisitor.purpose || "-"}
                  </p>
                </div>

              </div>

              <div className="flex flex-col gap-2 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => setSelectedVisitor(null)}
                  disabled={approveLoading}
                  className="h-10 rounded-xl border border-slate-200 px-4 text-[10.5px] font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleApprove(selectedVisitor._id)
                  }
                  disabled={approveLoading}
                  className="flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-[10.5px] font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {approveLoading ? (
                    <>
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />
                      Approving...
                    </>
                  ) : (
                    <>
                      <Check size={15} />
                      Approve Visitor Pass
                    </>
                  )}
                </button>

              </div>

            </div>

          </div>

        )}

      </div>
    </DashboardLayout>
  );
}


// ==========================================
// TABLE HEAD
// ==========================================

function TableHead({ children }) {
  return (
    <th className="px-5 py-3.5 text-left text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400">
      {children}
    </th>
  );
}


// ==========================================
// INFO ITEM
// ==========================================

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
        <Icon size={16} />
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-medium text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-[11.5px] font-bold text-slate-800">
          {value || "-"}
        </p>
      </div>

    </div>
  );
}


// ==========================================
// PASS STATUS
// ==========================================

function PassStatus({ status }) {
  if (status === "Approved") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[9.5px] font-bold text-emerald-600">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Approved
      </span>
    );
  }

  if (status === "Completed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[9.5px] font-bold text-slate-500">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
        Completed
      </span>
    );
  }

  if (status === "Rejected") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-[9.5px] font-bold text-red-500">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-[9.5px] font-bold text-amber-600">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      {status || "Pending"}
    </span>
  );
}


// ==========================================
// DATE HELPERS
// ==========================================

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString();
}

function formatDateTime(date) {
  if (!date) return "Not recorded";

  return new Date(date).toLocaleString();
}


export default VerifyGatePass;