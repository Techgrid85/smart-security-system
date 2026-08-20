import PageLoader from "../../components/dashboard/PageLoader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import QRCode from "qrcode";

import {
  Users,
  Plus,
  X,
  Send,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock3,
  Eye,
  UserCheck,
  Mail,
  Download,
  CalendarDays,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";


function ResidentVisitors() {
  const [visitors, setVisitors] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

const [formData, setFormData] = useState({
  visitorName: "",
  email: "",
  phone: "",
  visitorType: "Guest",
  vehicleNumber: "",
  purpose: "",
  visitDate: "",
  visitStartTime: "",
  visitEndTime: "",
});

  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchVisitors = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "https://smart-society-backend-delta.vercel.app/resident/visitors",
        {
          headers: getHeaders(),
        }
      );

      if (response.data.success) {
        setVisitors(response.data.data || []);
      } else {
        toast.error(
          response.data.message || "Failed to load visitors"
        );
      }
    } catch (error) {
      console.error("Get Visitors Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load visitors"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================================
  // RESET FORM
  // ================================
const resetForm = () => {
  setFormData({
    visitorName: "",
    email: "",
    phone: "",
    visitorType: "Guest",
    vehicleNumber: "",
    purpose: "",
    visitDate: "",
    visitStartTime: "",
    visitEndTime: "",
  });
};

  // ================================
  // CLOSE CREATE FORM
  // ================================
  const handleCloseCreate = () => {
    setCreating(false);
    resetForm();
  };

  // ================================
  // CREATE VISITOR PASS
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.visitorName.trim().length < 3) {
      return toast.error(
        "Visitor name must be at least 3 characters"
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email.trim())) {
      return toast.error(
        "Please enter a valid visitor email address"
      );
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      return toast.error(
        "Phone number must contain exactly 10 digits"
      );
    }

    if (formData.purpose.trim().length < 3) {
      return toast.error(
        "Purpose must be at least 3 characters"
      );
    }

    if (formData.purpose.trim().length > 200) {
      return toast.error(
        "Purpose cannot exceed 200 characters"
      );
    }

    if (!formData.visitDate) {
      return toast.error("Please select a visit date");
    }

    if (!formData.visitStartTime) {
      return toast.error("Please select a visit start time");
    }

    if (!formData.visitEndTime) {
      return toast.error("Please select a visit end time");
    }

    // ==========================================
    // COMBINE DATE + TIME FOR BACKEND
    // ==========================================
    const visitStartTime = new Date(
      `${formData.visitDate}T${formData.visitStartTime}`
    );

    const visitEndTime = new Date(
      `${formData.visitDate}T${formData.visitEndTime}`
    );

    if (
      Number.isNaN(visitStartTime.getTime()) ||
      Number.isNaN(visitEndTime.getTime())
    ) {
      return toast.error("Invalid visit date or time");
    }

    if (visitEndTime <= visitStartTime) {
      return toast.error(
        "Visit end time must be later than visit start time"
      );
    }

    try {
      setSubmitting(true);

      const payload = {
  visitorName: formData.visitorName.trim(),
  email: formData.email.trim().toLowerCase(),
  phone: formData.phone,

  visitorType: formData.visitorType,

  vehicleNumber: formData.vehicleNumber.trim().toUpperCase(),

  purpose: formData.purpose.trim(),

  visitDate: formData.visitDate,
  visitStartTime: visitStartTime.toISOString(),
  visitEndTime: visitEndTime.toISOString(),
};

      const response = await axios.post(
        "https://smart-society-backend-delta.vercel.app/resident/visitors",
        payload,
        {
          headers: getHeaders(),
        }
      );

      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Visitor pass created successfully"
        );

        resetForm();
        setCreating(false);

        fetchVisitors();
      } else {
        toast.error(
          response.data.message ||
            "Failed to create visitor pass"
        );
      }
    } catch (error) {
      console.error(
        "Create Visitor Error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to create visitor pass"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ================================
  // GET SINGLE VISITOR
  // ================================
  const handleViewVisitor = async (id) => {
    try {
      setDetailLoading(true);
      setSelectedVisitor(null);

      const response = await axios.get(
        `https://smart-society-backend-delta.vercel.app/resident/visitors/${id}`,
        {
          headers: getHeaders(),
        }
      );

      if (response.data.success) {
        setSelectedVisitor(response.data.data);
      } else {
        toast.error(
          response.data.message ||
            "Failed to load visitor details"
        );
      }
    } catch (error) {
      console.error("Get Visitor Detail Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load visitor details"
      );
    } finally {
      setDetailLoading(false);
    }
  };

  // ================================
  // DATE FORMAT
  // ================================
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString();
  };

  // ================================
  // TIME FORMAT
  // ================================
  const formatTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

const getQrUrl = (gateKey) => {
  if (!gateKey) return "";

  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    gateKey
  )}`;
};
// ================================
// DOWNLOAD VISITOR PASS PDF
// ================================
const downloadVisitorPassPDF = async (visitor) => {
  try {
    if (!visitor?.gateKey) {
      toast.error("Gate key is not available yet");
      return;
    }

    const qrDataUrl = await QRCode.toDataURL(
      visitor.gateKey,
      {
        width: 300,
        margin: 2,
      }
    );

    const pdf = new jsPDF();

    const pageWidth = pdf.internal.pageSize.getWidth();

    // ================================
    // HEADER
    // ================================

    pdf.setFillColor(16, 185, 129);
    pdf.rect(0, 0, pageWidth, 32, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.text("SmartSociety", 20, 20);

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text("DIGITAL VISITOR PASS", pageWidth - 20, 20, {
      align: "right",
    });

    // ================================
    // VISITOR INFORMATION
    // ================================

    pdf.setTextColor(30, 41, 59);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(15);
    pdf.text("Visitor Pass", 20, 48);

    pdf.setDrawColor(226, 232, 240);
    pdf.line(20, 53, pageWidth - 20, 53);

    let y = 66;

    const addRow = (label, value) => {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(100, 116, 139);
      pdf.text(label, 20, y);

      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(30, 41, 59);
      pdf.text(String(value || "-"), 65, y);

      y += 12;
    };

    addRow("Visitor Name", visitor.visitorName);
    addRow("Visitor Type", visitor.visitorType || "Guest");
    addRow("Phone", visitor.phone);
    addRow("Email", visitor.email);
    addRow(
      "Vehicle Number",
      visitor.vehicleNumber || "No vehicle"
    );
    addRow(
      "Resident",
      visitor.resident?.name || "Resident"
    );
    addRow("Flat Number", visitor.flatNo || visitor.resident?.flatNo);
    addRow("Visit Date", formatDate(visitor.visitDate));
    addRow(
      "Start Time",
      formatTime(visitor.visitStartTime)
    );
    addRow(
      "End Time",
      formatTime(visitor.visitEndTime)
    );
    addRow("Purpose", visitor.purpose);
    addRow("Status", visitor.status);

    // ================================
    // QR CODE
    // ================================

    const qrX = pageWidth - 78;
    const qrY = 62;

    pdf.addImage(
      qrDataUrl,
      "PNG",
      qrX,
      qrY,
      55,
      55
    );

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);

    pdf.text(
      "SCAN AT GATE",
      qrX + 27.5,
      qrY + 61,
      {
        align: "center",
      }
    );

    // ================================
    // GATE KEY BOX
    // ================================

    y = Math.max(y, 130);

    pdf.setFillColor(236, 253, 245);
    pdf.setDrawColor(167, 243, 208);

    pdf.roundedRect(
      20,
      y,
      pageWidth - 40,
      30,
      4,
      4,
      "FD"
    );

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(5, 150, 105);

    pdf.text(
      "DIGITAL GATE KEY",
      pageWidth / 2,
      y + 9,
      {
        align: "center",
      }
    );

    pdf.setFontSize(18);
    pdf.setTextColor(4, 120, 87);

    pdf.text(
      visitor.gateKey,
      pageWidth / 2,
      y + 22,
      {
        align: "center",
      }
    );

    // ================================
    // SECURITY NOTICE
    // ================================

    y += 43;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(30, 41, 59);

    pdf.text(
      "Security Instructions",
      20,
      y
    );

    y += 8;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);

    pdf.text(
      "Please present this QR code or Gate Key to security",
      20,
      y
    );

    y += 6;

    pdf.text(
      "personnel for verification at the society entrance.",
      20,
      y
    );

    // ================================
    // FOOTER
    // ================================

    const pageHeight =
      pdf.internal.pageSize.getHeight();

    pdf.setDrawColor(226, 232, 240);

    pdf.line(
      20,
      pageHeight - 25,
      pageWidth - 20,
      pageHeight - 25
    );

    pdf.setFontSize(7);
    pdf.setTextColor(148, 163, 184);

    pdf.text(
      "Generated by SmartSociety",
      20,
      pageHeight - 15
    );

    pdf.text(
      `Pass ID: ${visitor._id}`,
      pageWidth - 20,
      pageHeight - 15,
      {
        align: "right",
      }
    );

    // ================================
    // DOWNLOAD
    // ================================

    pdf.save(
      `SmartSociety-Visitor-Pass-${visitor.visitorName
        ?.replace(/\s+/g, "-")
        .toLowerCase()}.pdf`
    );

    toast.success("Visitor pass PDF downloaded");
  } catch (error) {
    console.error(
      "Visitor Pass PDF Error:",
      error
    );

    toast.error(
      "Failed to generate visitor pass PDF"
    );
  }
};


  return (
    <DashboardLayout role="resident">
      <div className="w-full min-w-0 max-w-full">

        {/* ================= HEADER ================= */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#9b7740]">
              Resident Portal
            </p>

            <h1 className="text-[20px] font-extrabold tracking-tight text-[#32143b] md:text-[22px]">
              Visitor Passes
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-[#8b778e]">
              Create and manage visitor passes for your guests.
            </p>
          </div>

          <div className="flex gap-2">

            <button
              type="button"
              onClick={fetchVisitors}
              className="flex items-center justify-center gap-2 rounded-none border border-[#e2d9df] bg-white px-3.5 py-2.5 text-[11px] font-bold text-[#756b78] transition hover:bg-[#f7f3ed]"
            >
              <RefreshCw size={14} />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => setCreating(true)}
              className="flex items-center justify-center gap-2 rounded-none bg-[#9b7740] px-4 py-2.5 text-[11px] font-bold text-white transition hover:bg-[#9b7740]"
            >
              <Plus size={15} />
              New Visitor
            </button>

          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <VisitorStat
            title="Total Visitors"
            value={visitors.length}
            icon={Users}
            tone="slate"
          />

          <VisitorStat
            title="Pending"
            value={
              visitors.filter(
                (visitor) => visitor.status === "Pending"
              ).length
            }
            icon={Clock3}
            tone="amber"
          />

          <VisitorStat
            title="Approved"
            value={
              visitors.filter(
                (visitor) => visitor.status === "Approved"
              ).length
            }
            icon={CheckCircle2}
            tone="emerald"
          />

        </div>

        {/* ================= CREATE FORM ================= */}
        {creating && (
          <section className="mb-6 overflow-hidden rounded-none border border-[#e2d9df] bg-white">

            <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">

              <div>
                <h2 className="text-[13px] font-bold text-[#32143b]">
                  Create Visitor Pass
                </h2>

                <p className="mt-1 text-[10px] font-medium text-[#8b778e]">
                  Enter your visitor details and planned visit time.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseCreate}
                className="flex h-8 w-8 items-center justify-center rounded-none text-[#8b778e] transition hover:bg-[#eee8ed] hover:text-[#49394d]"
              >
                <X size={17} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-5"
            >

              <div className="grid gap-4 md:grid-cols-2">

                {/* VISITOR NAME */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-[#756b78]">
                    Visitor Name
                  </label>

                  <input
                    type="text"
                    name="visitorName"
                    value={formData.visitorName}
                    onChange={handleChange}
                    placeholder="Enter visitor name"
                    required
                    className="w-full rounded-none border border-[#e2d9df] px-3 py-2.5 text-[11px] font-medium text-[#49394d] outline-none transition placeholder:text-[#bca9c0] focus:border-[#bca16a] focus:ring-2 focus:ring-[#f5eee2]"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-[#756b78]">
                    Visitor Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter visitor email"
                    required
                    className="w-full rounded-none border border-[#e2d9df] px-3 py-2.5 text-[11px] font-medium text-[#49394d] outline-none transition placeholder:text-[#bca9c0] focus:border-[#bca16a] focus:ring-2 focus:ring-[#f5eee2]"
                  />
                </div>

                {/* PHONE */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-[#756b78]">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

                      setFormData((prev) => ({
                        ...prev,
                        phone: value,
                      }));
                    }}
                    placeholder="Enter 10 digit phone number"
                    inputMode="numeric"
                    maxLength={10}
                    required
                    className="w-full rounded-none border border-[#e2d9df] px-3 py-2.5 text-[11px] font-medium text-[#49394d] outline-none transition placeholder:text-[#bca9c0] focus:border-[#bca16a] focus:ring-2 focus:ring-[#f5eee2]"
                  />
                </div>
                {/* VISITOR TYPE */}
<div>
  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-[#756b78]">
    Visitor Type
  </label>

  <select
    name="visitorType"
    value={formData.visitorType}
    onChange={handleChange}
    required
    className="w-full rounded-none border border-[#e2d9df] bg-white px-3 py-2.5 text-[11px] font-medium text-[#49394d] outline-none transition focus:border-[#bca16a] focus:ring-2 focus:ring-[#f5eee2]"
  >
    <option value="Guest">Guest</option>
    <option value="Delivery">Delivery</option>
    <option value="Cab">Cab</option>
    <option value="Vendor">Vendor</option>
  </select>
</div>

{/* VEHICLE NUMBER */}
<div>
  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-[#756b78]">
    Vehicle Number
    <span className="ml-1 normal-case text-[#8b778e]">
      (Optional)
    </span>
  </label>

  <input
    type="text"
    name="vehicleNumber"
    value={formData.vehicleNumber}
    onChange={(e) => {
      setFormData((prev) => ({
        ...prev,
        vehicleNumber: e.target.value.toUpperCase(),
      }));
    }}
    placeholder="e.g. ABC-123"
    className="w-full rounded-none border border-[#e2d9df] px-3 py-2.5 text-[11px] font-medium uppercase text-[#49394d] outline-none transition placeholder:normal-case placeholder:text-[#bca9c0] focus:border-[#bca16a] focus:ring-2 focus:ring-[#f5eee2]"
  />
</div>

                {/* PURPOSE */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-[#756b78]">
                    Purpose
                  </label>

                  <input
                    type="text"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    placeholder="Reason for visit"
                    maxLength={200}
                    required
                    className="w-full rounded-none border border-[#e2d9df] px-3 py-2.5 text-[11px] font-medium text-[#49394d] outline-none transition placeholder:text-[#bca9c0] focus:border-[#bca16a] focus:ring-2 focus:ring-[#f5eee2]"
                  />
                </div>

                {/* VISIT DATE */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-[#756b78]">
                    Visit Date
                  </label>

                  <input
                    type="date"
                    name="visitDate"
                    value={formData.visitDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    className="w-full rounded-none border border-[#e2d9df] px-3 py-2.5 text-[11px] font-medium text-[#49394d] outline-none transition focus:border-[#bca16a] focus:ring-2 focus:ring-[#f5eee2]"
                  />
                </div>

                {/* START TIME */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-[#756b78]">
                    Visit Start Time
                  </label>

                  <input
                    type="time"
                    name="visitStartTime"
                    value={formData.visitStartTime}
                    onChange={handleChange}
                    required
                    className="w-full rounded-none border border-[#e2d9df] px-3 py-2.5 text-[11px] font-medium text-[#49394d] outline-none transition focus:border-[#bca16a] focus:ring-2 focus:ring-[#f5eee2]"
                  />
                </div>

                {/* END TIME */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-[#756b78]">
                    Visit End Time
                  </label>

                  <input
                    type="time"
                    name="visitEndTime"
                    value={formData.visitEndTime}
                    onChange={handleChange}
                    required
                    className="w-full rounded-none border border-[#e2d9df] px-3 py-2.5 text-[11px] font-medium text-[#49394d] outline-none transition focus:border-[#bca16a] focus:ring-2 focus:ring-[#f5eee2]"
                  />
                </div>

              </div>

              <div className="flex justify-end gap-2 border-t border-[#eee8ed] pt-4">

                <button
                  type="button"
                  onClick={handleCloseCreate}
                  className="rounded-none border border-[#e2d9df] px-4 py-2.5 text-[11px] font-bold text-[#756b78] transition hover:bg-[#f7f3ed]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-none bg-[#9b7740] px-4 py-2.5 text-[11px] font-bold text-white transition hover:bg-[#9b7740] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={14} />

                  {submitting
                    ? "Creating..."
                    : "Create Pass"}
                </button>

              </div>

            </form>
          </section>
        )}

        {/* ================= VISITORS TABLE ================= */}
        <section className="overflow-hidden rounded-none border border-[#e2d9df] bg-white">

          <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">

            <div>
              <h2 className="text-[13px] font-bold text-[#32143b]">
                Visitor History
              </h2>

              <p className="mt-1 text-[10px] font-medium text-[#8b778e]">
                {visitors.length} visitor
                {visitors.length !== 1 ? "s" : ""} found
              </p>
            </div>

          </div>

          {loading ? (
            <PageLoader message="Loading visitors..." />
          ) : visitors.length > 0 ? (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[950px]">

                <thead>
                  <tr className="bg-[#f7f3ed]">
                    <TableHead>ID</TableHead>
                    <TableHead>Visitor</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Visit Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </tr>
                </thead>

                <tbody>

                  {visitors.map((visitor) => (
                    <tr
                      key={visitor._id}
                      className="border-t border-[#e2d9df] transition hover:bg-[#f7f3ed]"
                    >

                      <td className="px-5 py-4 text-[10.5px] font-bold text-[#9b7740]">
                        #{visitor._id?.slice(-6)}
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-[11px] font-bold text-[#49394d]">
                          {visitor.visitorName}
                        </p>

                        <p className="mt-0.5 text-[9px] font-medium text-[#8b778e]">
                          {visitor.email}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-[10px] font-medium text-[#756b78]">
                        {visitor.phone}
                      </td>

                      <td className="max-w-[180px] px-5 py-4">
                        <p className="truncate text-[10px] font-medium text-[#756b78]">
                          {visitor.purpose}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-[10px] font-medium text-[#8b778e]">
                        {formatDate(visitor.visitDate)}
                      </td>

                      <td className="px-5 py-4 text-[10px] font-medium text-[#756b78]">
                        {formatTime(visitor.visitStartTime)}
                        {" - "}
                        {formatTime(visitor.visitEndTime)}
                      </td>

                      <td className="px-5 py-4">
                        <VisitorStatus
                          status={visitor.status}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => handleViewVisitor(visitor._id)}
                          className="flex items-center gap-1.5 rounded-none border border-[#e2d9df] bg-white px-2.5 py-1.5 text-[9.5px] font-bold text-[#756b78] transition hover:border-[#d9be82] hover:text-[#9b7740]"
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
            <EmptyState text="You have not created any visitor passes yet." />
          )}

        </section>

      {/* ================= VISITOR DETAIL MODAL ================= */}
{(detailLoading || selectedVisitor) && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#32143b]/40 p-4">

    <div className="max-h-[90vh] w-full max-w-[550px] overflow-y-auto rounded-none bg-white shadow-xl">

      {detailLoading ? (
        <div className="flex min-h-[250px] items-center justify-center">
          <p className="text-[11px] font-medium text-[#8b778e]">
            Loading visitor details...
          </p>
        </div>
      ) : (
        <>
          {/* ================= MODAL HEADER ================= */}
          <div className="flex items-start justify-between border-b border-[#e2d9df] px-5 py-4">

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9b7740]">
                Visitor Details
              </p>

              <h2 className="mt-1 text-[15px] font-bold text-[#32143b]">
                {selectedVisitor?.visitorName}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setSelectedVisitor(null)}
              className="flex h-8 w-8 items-center justify-center rounded-none text-[#8b778e] transition hover:bg-[#eee8ed]"
            >
              <X size={17} />
            </button>

          </div>

          <div className="space-y-5 p-5">

            {/* ================= DIGITAL GATE KEY ================= */}
            <div className="rounded-none border border-[#f5eee2] bg-[#f7f3ed] p-4">

              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9b7740]">
                Digital Gate Key
              </p>

              <p className="mt-2 break-all text-[20px] font-extrabold tracking-[0.18em] text-[#826331]">
                {selectedVisitor?.gateKey || "Not available"}
              </p>

              <p className="mt-2 text-[10px] font-medium text-[#9b7740]/80">
                Show this key to security personnel for visitor verification.
              </p>

            </div>

                      <div className="mt-5 flex justify-center">
                        <button
                          type="button"
                          onClick={() =>
                            downloadVisitorPassPDF(selectedVisitor)
                          }
                          className="inline-flex items-center gap-2 rounded-none bg-[#9b7740] px-4 py-2.5 text-[10px] font-bold text-white transition hover:bg-[#9b7740]"
                        >
                          <Download size={14} />
                          Download Visitor Pass PDF
                        </button>
                      </div>

            {/* ================= DETAILS GRID ================= */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <DetailItem
                label="Email"
                value={selectedVisitor?.email}
              />

              <DetailItem
                label="Phone"
                value={selectedVisitor?.phone}
              />

              <DetailItem
                label="Visitor Type"
                value={selectedVisitor?.visitorType || "Guest"}
              />

              <DetailItem
                label="Vehicle Number"
                value={selectedVisitor?.vehicleNumber || "No vehicle"}
              />

              <DetailItem
                label="Flat Number"
                value={selectedVisitor?.flatNo || "-"}
              />

              <DetailItem
                label="Visit Date"
                value={formatDate(selectedVisitor?.visitDate)}
              />

              <DetailItem
                label="Start Time"
                value={formatTime(selectedVisitor?.visitStartTime)}
              />

              <DetailItem
                label="End Time"
                value={formatTime(selectedVisitor?.visitEndTime)}
              />

              <DetailItem
                label="Gate Status"
                value={selectedVisitor?.gateStatus || "-"}
              />

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                  Approval Status
                </p>

                <div className="mt-1">
                  <VisitorStatus
                    status={selectedVisitor?.status}
                  />
                </div>
              </div>

            </div>

            {/* ================= QR GATE PASS ================= */}
{selectedVisitor?.gateKey && (
  <div className="rounded-none border border-[#e2d9df] bg-[#f7f3ed] p-5 text-center">
    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8b778e]">
      Digital Visitor Pass
    </p>

    <h3 className="mt-1 text-[13px] font-bold text-[#49394d]">
      Gate Verification QR
    </h3>

    <div className="mx-auto mt-4 flex w-fit rounded-none bg-white p-3 shadow-sm">
      <img
        src={getQrUrl(selectedVisitor.gateKey)}
        alt="Visitor Gate QR Code"
        className="h-[180px] w-[180px]"
      />
    </div>

    <p className="mt-4 text-[10px] font-medium text-[#756b78]">
      Show this QR code to security at the gate.
    </p>

    <div className="mt-3">
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8b778e]">
        Gate Key
      </p>

      <p className="mt-1 text-[20px] font-extrabold tracking-[0.2em] text-[#9b7740]">
        {selectedVisitor.gateKey}
      </p>
    </div>
  </div>
)}

            {/* ================= PURPOSE ================= */}
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                Purpose
              </p>

              <div className="mt-2 rounded-none bg-[#f7f3ed] p-4">
                <p className="text-[11px] leading-6 text-[#756b78]">
                  {selectedVisitor?.purpose || "-"}
                </p>
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  </div>
)}

      </div>
    </DashboardLayout>
  );
}


/* ================= STAT ================= */

function VisitorStat({
  title,
  value,
  icon: Icon,
  tone,
}) {
  const tones = {
    slate: "bg-[#eee8ed] text-[#756b78]",
    amber: "bg-[#f7f3ed] text-[#9b7740]",
    emerald: "bg-[#f7f3ed] text-[#9b7740]",
  };

  return (
    <div className="rounded-none border border-[#e2d9df] bg-white p-5">

      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-none ${tones[tone]}`}
      >
        <Icon size={19} />
      </div>

      <p className="text-[25px] font-extrabold leading-none text-[#32143b]">
        {value}
      </p>

      <p className="mt-2 text-[11px] font-semibold text-[#756b78]">
        {title}
      </p>

    </div>
  );
}


/* ================= STATUS ================= */

function VisitorStatus({ status }) {
  if (status === "Approved") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-none bg-[#f7f3ed] px-2.5 py-1 text-[9px] font-bold text-[#9b7740]">
        <CheckCircle2 size={11} />
        Approved
      </span>
    );
  }

  if (status === "Rejected") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-none bg-red-50 px-2.5 py-1 text-[9px] font-bold text-red-600">
        <AlertCircle size={11} />
        Rejected
      </span>
    );
  }

  if (status === "Completed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-none bg-[#f7f3ed] px-2.5 py-1 text-[9px] font-bold text-[#63366f]">
        <UserCheck size={11} />
        Completed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-none bg-[#f7f3ed] px-2.5 py-1 text-[9px] font-bold text-[#9b7740]">
      <Clock3 size={11} />
      Pending
    </span>
  );
}


/* ================= DETAIL ITEM ================= */

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
        {label}
      </p>

      <p className="mt-1 break-words text-[11px] font-bold text-[#49394d]">
        {value || "-"}
      </p>
    </div>
  );
}


/* ================= TABLE HEAD ================= */

function TableHead({ children }) {
  return (
    <th className="px-5 py-3.5 text-left text-[9px] font-bold uppercase tracking-[0.08em] text-[#8b778e]">
      {children}
    </th>
  );
}


/* ================= EMPTY STATE ================= */

function EmptyState({ text }) {
  return (
    <div className="flex min-h-[250px] flex-col items-center justify-center px-4 text-center">

      <div className="flex h-12 w-12 items-center justify-center rounded-none bg-[#eee8ed] text-[#8b778e]">
        <Users size={21} />
      </div>

      <p className="mt-3 text-[11px] font-medium text-[#8b778e]">
        {text}
      </p>

    </div>
  );
}

export default ResidentVisitors;
