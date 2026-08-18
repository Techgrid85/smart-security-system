
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  UserPlus,
  User,
  Home,
  Phone,
  Mail,
  ClipboardList,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  TicketCheck,
  RefreshCw,
  CalendarDays,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

function WalkInVisitor() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("walkin");

  const [formData, setFormData] = useState({
    resident: "",
    flatNo: "",
    visitorName: "",
    email: "",
    phone: "",
    purpose: "",
  });

  const [residents, setResidents] = useState([]);
  const [approvedVisitors, setApprovedVisitors] = useState([]);

  const [selectedApprovedId, setSelectedApprovedId] = useState("");
  const [approvedVisitor, setApprovedVisitor] = useState(null);

  const [loadingResidents, setLoadingResidents] = useState(true);
  const [loadingApproved, setLoadingApproved] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const fetchResidents = async () => {
    try {
      setLoadingResidents(true);

      const response = await axios.get(
        "https://smart-society-backend-delta.vercel.app/guard/residents",
        config
      );

      console.log("RESIDENT RESPONSE:", response.data);

      const residentData =
        response.data?.data || [];

      setResidents(
        Array.isArray(residentData)
          ? residentData
          : []
      );
    } catch (error) {
      console.error(
        "Load Residents Error:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load residents"
      );

      setResidents([]);
    } finally {
      setLoadingResidents(false);
    }
  };

const fetchApprovedVisitors = async () => {
  try {
    setLoadingApproved(true);
    setError("");

    const response = await axios.get(
      "https://smart-society-backend-delta.vercel.app/guard/visitor-passes",
      config
    );

    console.log(
      "APPROVED VISITORS RESPONSE:",
      response.data
    );

    const visitors = response.data?.data || [];

    setApprovedVisitors(
      Array.isArray(visitors) ? visitors : []
    );
  } catch (error) {
    console.error(
      "Load Approved Visitors Error:",
      error.response?.data || error
    );

    setApprovedVisitors([]);

    setError(
      error.response?.data?.message ||
        "Failed to load approved visitor passes"
    );
  } finally {
    setLoadingApproved(false);
  }
};
  useEffect(() => {
    fetchResidents();
    fetchApprovedVisitors();
  }, []);

  
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setError("");

    if (newMode === "walkin") {
      setSelectedApprovedId("");
      setApprovedVisitor(null);
    }

    if (newMode === "approved") {
      setFormData({
        resident: "",
        flatNo: "",
        visitorName: "",
        email: "",
        phone: "",
        purpose: "",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const numbersOnly =
        value.replace(/\D/g, "");

      setFormData((prev) => ({
        ...prev,
        phone: numbersOnly,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResidentChange = (e) => {
    const residentId = e.target.value;

    const selectedResident =
      residents.find(
        (resident) =>
          String(resident._id) ===
          String(residentId)
      );

    setFormData((prev) => ({
      ...prev,
      resident: residentId,
      flatNo:
        selectedResident?.flatNo || "",
    }));
  };

  
  const handleApprovedVisitorChange = async (
    e
  ) => {
    const visitorId = e.target.value;
    const selectedVisitor = approvedVisitors.find(
      (visitor) => String(visitor._id) === String(visitorId)
    );

    setSelectedApprovedId(visitorId);
    setApprovedVisitor(null);
    setError("");

    if (!visitorId) {
      return;
    }

    if (!selectedVisitor?.gateKey) {
      setError(
        "This visitor pass does not have a valid gate key. Please refresh the visitor list."
      );
      return;
    }

    try {
      setLoadingDetails(true);

      const response = await axios.get(
        `https://smart-society-backend-delta.vercel.app/guard/verify-pass/${selectedVisitor.gateKey}`,
        config
      );

      console.log(
        "VISITOR DETAILS RESPONSE:",
        response.data
      );

      setApprovedVisitor(
        response.data?.data || null
      );
    } catch (error) {
      console.error(
        "Load Visitor Details Error:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load visitor details"
      );

      setApprovedVisitor(null);
    } finally {
      setLoadingDetails(false);
    }
  };

 
  const handleRefresh = async () => {
    setError("");

    await Promise.all([
      fetchResidents(),
      fetchApprovedVisitors(),
    ]);

    setSelectedApprovedId("");
    setApprovedVisitor(null);

    toast.success("Visitor data refreshed");
  };

  // ==========================================
  // SUBMIT WALK-IN VISITOR
  // ==========================================

  const handleWalkInSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const {
      resident,
      flatNo,
      visitorName,
      email,
      phone,
      purpose,
    } = formData;

    if (
      !resident ||
      !flatNo ||
      !visitorName.trim() ||
      !email.trim() ||
      !phone ||
      !purpose.trim()
    ) {
      setError(
        "Please fill in all required fields."
      );

      return;
    }
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim()
      )
    ) {
      setError(
        "Please enter a valid email address."
      );

      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setError(
        "Phone number must contain exactly 10 digits."
      );

      return;
    }

    try {
      setSubmitting(true);

      const response = await axios.post(
        "https://smart-society-backend-delta.vercel.app/guard/walk-in",
        {
          resident,
          flatNo,
          visitorName: visitorName.trim(),
          email: email.trim().toLowerCase(),
          phone,
          purpose: purpose.trim(),
        },
        config
      );

      toast.success(
        response.data?.message ||
          "Walk-in visitor checked in successfully"
      );

      setFormData({
        resident: "",
        flatNo: "",
        visitorName: "",
        email: "",
        phone: "",
        purpose: "",
      });

      setTimeout(() => {
        navigate("/guard");
      }, 800);
    } catch (error) {
      console.error(
        "Walk-In Submit Error:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.message ||
          "Failed to register walk-in visitor"
      );
    } finally {
      setSubmitting(false);
    }
  };

  
  const handleApprovedEntry = async () => {
    if (!approvedVisitor?._id) {
      setError(
        "Please select an approved visitor first."
      );

      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await axios.put(
        `https://smart-society-backend-delta.vercel.app/guard/visitors/${approvedVisitor._id}/entry`,
        {},
        config
      );

      toast.success(
        response.data?.message ||
          "Visitor entry recorded successfully"
      );

      setSelectedApprovedId("");
      setApprovedVisitor(null);

      await fetchApprovedVisitors();

      setTimeout(() => {
        navigate("/guard");
      }, 800);
    } catch (error) {
      console.error(
        "Allow Entry Error:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.message ||
          "Failed to allow visitor entry"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="guard">
      <div className="w-full">

        {/* HEADER */}

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#9b7740]">
              Security Portal
            </p>

            <h1 className="text-[20px] font-extrabold tracking-tight text-[#32143b] md:text-[22px]">
              Visitor Entry
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-[#8b778e]">
              Register walk-in visitors or allow entry
              for approved visitor passes.
            </p>
          </div>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={handleRefresh}
              disabled={
                loadingResidents ||
                loadingApproved
              }
              className="flex h-9 w-9 items-center justify-center rounded-none border border-[#e2d9df] bg-white text-[#8b778e] transition hover:border-[#d9be82] hover:text-[#9b7740] disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw
                size={14}
                className={
                  loadingResidents ||
                  loadingApproved
                    ? "animate-spin"
                    : ""
                }
              />
            </button>

            <Link
              to="/guard"
              className="inline-flex items-center gap-2 rounded-none border border-[#e2d9df] bg-white px-3 py-2 text-[10.5px] font-bold text-[#756b78] transition hover:border-[#d9be82] hover:text-[#9b7740]"
            >
              <ArrowLeft size={14} />
              Back
            </Link>

          </div>
        </div>

        {/* MODE TABS */}

        <div className="mb-5 grid grid-cols-2 gap-2 rounded-none border border-[#e2d9df] bg-white p-1.5">

          <button
            type="button"
            onClick={() =>
              handleModeChange("walkin")
            }
            className={`flex items-center justify-center gap-2 rounded-none px-4 py-3 text-[11px] font-bold transition ${
              mode === "walkin"
                ? "bg-[#9b7740] text-white shadow-sm"
                : "text-[#756b78] hover:bg-[#f7f3ed]"
            }`}
          >
            <UserPlus size={15} />
            Walk-in Visitor
          </button>

          <button
            type="button"
            onClick={() =>
              handleModeChange("approved")
            }
            className={`flex items-center justify-center gap-2 rounded-none px-4 py-3 text-[11px] font-bold transition ${
              mode === "approved"
                ? "bg-[#9b7740] text-white shadow-sm"
                : "text-[#756b78] hover:bg-[#f7f3ed]"
            }`}
          >
            <TicketCheck size={15} />
            Approved Visitor
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-none border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-[11px] font-semibold text-red-500">
              {error}
            </p>
          </div>
        )}

        {/* WALK-IN MODE */}

        {mode === "walkin" && (
          <div className="grid gap-5 xl:grid-cols-[1fr_0.42fr]">

            <section className="overflow-hidden rounded-none border border-[#e2d9df] bg-white">

              <div className="border-b border-[#e2d9df] px-5 py-4">
                <h2 className="flex items-center gap-2 text-[13px] font-bold text-[#32143b]">
                  <UserPlus
                    size={16}
                    className="text-[#9b7740]"
                  />
                  Walk-in Visitor Information
                </h2>

                <p className="mt-1 text-[10px] font-medium text-[#8b778e]">
                  Select the resident and enter the
                  visitor details.
                </p>
              </div>

              <form
                onSubmit={handleWalkInSubmit}
                className="space-y-5 p-5"
              >

                {/* RESIDENT */}

                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-[#756b78]">
                    Resident
                  </label>

                  <div className="relative">
                    <User
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b778e]"
                    />

                    <select
                      value={formData.resident}
                      onChange={handleResidentChange}
                      disabled={loadingResidents}
                      className="h-11 w-full appearance-none rounded-none border border-[#e2d9df] bg-white pl-10 pr-4 text-[11.5px] font-medium text-[#49394d] outline-none transition focus:border-[#bca16a] focus:ring-2 focus:ring-[#f7f3ed] disabled:bg-[#f7f3ed]"
                    >
                      <option value="">
                        {loadingResidents
                          ? "Loading residents..."
                          : residents.length === 0
                          ? "No residents found"
                          : "Select resident"}
                      </option>

                      {residents.map((resident) => (
                        <option
                          key={resident._id}
                          value={resident._id}
                        >
                          {resident.name}
                          {resident.flatNo
                            ? ` — ${resident.flatNo}`
                            : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* FLAT */}

                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-[#756b78]">
                    Flat Number
                  </label>

                  <div className="relative">
                    <Home
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b778e]"
                    />

                    <input
                      type="text"
                      name="flatNo"
                      value={formData.flatNo}
                      readOnly
                      placeholder="Select resident first"
                      className="h-11 w-full rounded-none border border-[#e2d9df] bg-[#f7f3ed] pl-10 pr-4 text-[11.5px] font-medium text-[#49394d] outline-none"
                    />
                  </div>
                </div>

                {/* VISITOR NAME */}

                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-[#756b78]">
                    Visitor Name
                  </label>

                  <div className="relative">
                    <User
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b778e]"
                    />

                    <input
                      type="text"
                      name="visitorName"
                      value={formData.visitorName}
                      onChange={handleChange}
                      placeholder="Enter visitor name"
                      className="h-11 w-full rounded-none border border-[#e2d9df] bg-white pl-10 pr-4 text-[11.5px] font-medium text-[#49394d] outline-none transition focus:border-[#bca16a] focus:ring-2 focus:ring-[#f7f3ed]"
                    />
                  </div>
                </div>

                {/* EMAIL */}

                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-[#756b78]">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b778e]"
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter visitor email"
                      required
                      className="h-11 w-full rounded-none border border-[#e2d9df] bg-white pl-10 pr-4 text-[11.5px] font-medium text-[#49394d] outline-none transition focus:border-[#bca16a] focus:ring-2 focus:ring-[#f7f3ed]"
                    />
                  </div>
                </div>

                {/* PHONE */}

                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-[#756b78]">
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
                      placeholder="10 digit phone number"
                      maxLength={10}
                      className="h-11 w-full rounded-none border border-[#e2d9df] bg-white pl-10 pr-4 text-[11.5px] font-medium text-[#49394d] outline-none transition focus:border-[#bca16a] focus:ring-2 focus:ring-[#f7f3ed]"
                    />
                  </div>
                </div>

                {/* PURPOSE */}

                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-[#756b78]">
                    Purpose of Visit
                  </label>

                  <div className="relative">
                    <ClipboardList
                      size={15}
                      className="absolute left-3 top-3.5 text-[#8b778e]"
                    />

                    <textarea
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Why is the visitor entering the society?"
                      className="w-full resize-none rounded-none border border-[#e2d9df] bg-white py-3 pl-10 pr-4 text-[11.5px] font-medium text-[#49394d] outline-none transition focus:border-[#bca16a] focus:ring-2 focus:ring-[#f7f3ed]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={
                    submitting ||
                    loadingResidents ||
                    residents.length === 0
                  }
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-none bg-[#9b7740] text-[11.5px] font-bold text-white transition hover:bg-[#9b7740] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      Registering...
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      Register & Allow Entry
                    </>
                  )}
                </button>

              </form>
            </section>

            <InformationCard
              title="Walk-in Entry"
              description="Use this when a visitor arrives without an existing visitor pass."
              steps={[
                "Select the resident",
                "Flat number is filled automatically",
                "Enter visitor details",
                "Register and allow entry",
              ]}
            />

          </div>
        )}

        {/* APPROVED MODE */}

        {mode === "approved" && (
          <div className="grid gap-5 xl:grid-cols-[1fr_0.42fr]">

            <section className="overflow-hidden rounded-none border border-[#e2d9df] bg-white">

              <div className="border-b border-[#e2d9df] px-5 py-4">
                <h2 className="flex items-center gap-2 text-[13px] font-bold text-[#32143b]">
                  <TicketCheck
                    size={16}
                    className="text-[#9b7740]"
                  />
                  Approved Visitor Passes
                </h2>

                <p className="mt-1 text-[10px] font-medium text-[#8b778e]">
                  Select an approved visitor and allow
                  them to enter the society.
                </p>
              </div>

              <div className="space-y-5 p-5">

                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-[#756b78]">
                    Approved Visitor
                  </label>

                  <select
                    value={selectedApprovedId}
                    onChange={
                      handleApprovedVisitorChange
                    }
                    disabled={
                      loadingApproved ||
                      loadingDetails
                    }
                    className="h-11 w-full rounded-none border border-[#e2d9df] bg-white px-4 text-[11.5px] font-medium text-[#49394d] outline-none transition focus:border-[#bca16a] focus:ring-2 focus:ring-[#f7f3ed] disabled:bg-[#f7f3ed]"
                  >
                    <option value="">
                      {loadingApproved
                        ? "Loading approved visitors..."
                        : approvedVisitors.length === 0
                        ? "No approved visitors waiting"
                        : "Select approved visitor"}
                    </option>

                    {approvedVisitors.map((visitor) => (
                      <option
                        key={visitor._id}
                        value={visitor._id}
                      >
                        {visitor.visitorName}
                        {visitor.flatNo
                          ? ` — ${visitor.flatNo}`
                          : ""}
                        {visitor.phone
                          ? ` — ${visitor.phone}`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {loadingDetails && (
                  <div className="flex items-center justify-center rounded-none border border-[#e2d9df] bg-[#f7f3ed] py-10">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-[#8b778e]">
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      Loading visitor details...
                    </div>
                  </div>
                )}

                {approvedVisitor &&
                  !loadingDetails && (
                    <div className="overflow-hidden rounded-none border border-[#f5eee2] bg-[#f7f3ed]/50">

                      <div className="flex items-start justify-between border-b border-[#f5eee2] px-4 py-4">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wide text-[#9b7740]">
                            Approved Visitor
                          </p>

                          <h3 className="mt-1 text-[16px] font-extrabold text-[#32143b]">
                            {
                              approvedVisitor.visitorName
                            }
                          </h3>
                        </div>

                        <span className="rounded-none bg-[#f5eee2] px-3 py-1 text-[9px] font-bold text-[#826331]">
                          {
                            approvedVisitor.status
                          }
                        </span>
                      </div>

                      <div className="grid gap-4 p-4 sm:grid-cols-2">

                        <DetailItem
                          icon={<User size={14} />}
                          label="Visitor"
                          value={
                            approvedVisitor.visitorName
                          }
                        />

                        <DetailItem
                          icon={<Phone size={14} />}
                          label="Phone"
                          value={
                            approvedVisitor.phone || "—"
                          }
                        />

                        <DetailItem
                          icon={<User size={14} />}
                          label="Resident"
                          value={
                            approvedVisitor.resident?.name ||
                            "—"
                          }
                        />

                        <DetailItem
                          icon={<Home size={14} />}
                          label="Flat Number"
                          value={
                            approvedVisitor.flatNo ||
                            approvedVisitor.resident
                              ?.flatNo ||
                            "—"
                          }
                        />

                        <DetailItem
                          icon={
                            <ClipboardList size={14} />
                          }
                          label="Purpose"
                          value={
                            approvedVisitor.purpose || "—"
                          }
                          full
                        />

                        <DetailItem
                          icon={
                            <CalendarDays size={14} />
                          }
                          label="Visit Date"
                          value={
                            approvedVisitor.visitDate
                              ? new Date(
                                  approvedVisitor.visitDate
                                ).toLocaleDateString()
                              : "—"
                          }
                        />

                      </div>

                      <div className="border-t border-[#f5eee2] p-4">
                        <button
                          type="button"
                          onClick={
                            handleApprovedEntry
                          }
                          disabled={submitting}
                          className="flex h-11 w-full items-center justify-center gap-2 rounded-none bg-[#9b7740] text-[11.5px] font-bold text-white transition hover:bg-[#9b7740] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {submitting ? (
                            <>
                              <Loader2
                                size={16}
                                className="animate-spin"
                              />
                              Allowing Entry...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={16} />
                              Allow Entry
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  )}

                {!loadingApproved &&
                  approvedVisitors.length === 0 && (
                    <div className="rounded-none border border-dashed border-[#e2d9df] bg-[#f7f3ed] px-5 py-10 text-center">

                      <TicketCheck
                        size={28}
                        className="mx-auto text-[#bca9c0]"
                      />

                      <h3 className="mt-3 text-[12px] font-bold text-[#756b78]">
                        No approved visitors waiting
                      </h3>

                      <p className="mt-2 text-[10px] leading-5 text-[#8b778e]">
                        Approved visitor passes will
                        appear here until the guard
                        records their entry.
                      </p>

                    </div>
                  )}

              </div>
            </section>

            <InformationCard
              title="Approved Pass Entry"
              description="The visitor already has an approved request, so their existing details are loaded directly from the database."
              steps={[
                "Select approved visitor",
                "Load existing details",
                "Verify visitor information",
                "Allow entry",
              ]}
            />

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

function InformationCard({
  title,
  description,
  steps,
}) {
  return (
    <section className="h-fit rounded-none border border-[#f5eee2] bg-[#f7f3ed]/60 p-5">

      <div className="flex h-11 w-11 items-center justify-center rounded-none bg-[#f5eee2] text-[#9b7740]">
        <CheckCircle2 size={20} />
      </div>

      <h3 className="mt-4 text-[13px] font-bold text-[#32143b]">
        {title}
      </h3>

      <p className="mt-2 text-[10.5px] leading-5 text-[#756b78]">
        {description}
      </p>

      <div className="mt-5 space-y-3">
        {steps.map((step, index) => (
          <div
            key={step}
            className="flex items-center gap-3"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-none bg-white text-[9px] font-bold text-[#9b7740]">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="text-[10.5px] font-semibold text-[#756b78]">
              {step}
            </span>
          </div>
        ))}
      </div>

    </section>
  );
}

function DetailItem({
  icon,
  label,
  value,
  full = false,
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <p className="mb-1 text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
        {label}
      </p>

      <div className="flex items-start gap-2 text-[11px] font-semibold text-[#49394d]">
        {icon && (
          <span className="mt-0.5 text-[#9b7740]">
            {icon}
          </span>
        )}

        <span className="break-words">
          {value}
        </span>
      </div>
    </div>
  );
}

export default WalkInVisitor;

