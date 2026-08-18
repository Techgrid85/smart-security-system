
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import jsPDF from "jspdf";

import {
  ReceiptText,
  CalendarDays,
  Eye,
  X,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Download,
  FileText,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

const API_URL = "https://smart-society-backend-delta.vercel.app";

function ResidentMaintenance() {
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [voucherMaintenance, setVoucherMaintenance] = useState(null);

  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // ==========================================
  // GET MY MAINTENANCE
  // ==========================================
  const fetchMaintenance = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        return;
      }

      const response = await axios.get(
        `${API_URL}/resident/maintenance`,
        {
          headers: getHeaders(),
        }
      );

      if (response.data.success) {
        setMaintenance(response.data.data || []);
      } else {
        toast.error(
          response.data.message ||
            "Failed to fetch maintenance records"
        );
      }
    } catch (error) {
      console.error("Maintenance Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch maintenance records"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  // ==========================================
  // VIEW MAINTENANCE DETAILS
  // ==========================================
  const handleViewMaintenance = async (id) => {
    try {
      setDetailsLoading(true);

      const response = await axios.get(
        `${API_URL}/resident/maintenance/${id}`,
        {
          headers: getHeaders(),
        }
      );

      if (response.data.success) {
        setSelectedMaintenance(response.data.data);
      } else {
        toast.error(
          response.data.message ||
            "Failed to fetch maintenance details"
        );
      }
    } catch (error) {
      console.error(
        "Maintenance Details Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch maintenance details"
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // ==========================================
  // DOWNLOAD MAINTENANCE VOUCHER PDF
  // ==========================================
  const downloadVoucherPDF = (bill) => {
    try {
      const doc = new jsPDF();

      const invoiceNumber = `INV-${bill._id
        ?.slice(-8)
        .toUpperCase()}`;

      const amount = Number(
        bill.amount || 0
      ).toLocaleString();

      const dueDate = bill.dueDate
        ? new Date(
            bill.dueDate
          ).toLocaleDateString()
        : "N/A";

      const createdDate = bill.createdAt
        ? new Date(
            bill.createdAt
          ).toLocaleDateString()
        : new Date().toLocaleDateString();

      // ==========================================
      // HEADER
      // ==========================================

      doc.setTextColor(15, 23, 42);

      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("SmartSociety", 20, 25);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);

      doc.text(
        "Society Management System",
        20,
        32
      );

      doc.setTextColor(15, 23, 42);

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("MAINTENANCE VOUCHER", 115, 25);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);

      doc.text(
        `Voucher #: ${invoiceNumber}`,
        115,
        33
      );

      doc.text(
        `Date: ${createdDate}`,
        115,
        40
      );

      // ==========================================
      // HEADER LINE
      // ==========================================

      doc.setDrawColor(226, 232, 240);
      doc.line(20, 49, 190, 49);

      // ==========================================
      // RESIDENT INFORMATION
      // ==========================================

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");

      doc.text("RESIDENT INFORMATION", 20, 62);

      doc.setFont("helvetica", "normal");

      doc.text(
        `Flat: ${bill.flatNo || "N/A"}`,
        20,
        71
      );

      doc.text(
        `Month: ${bill.month || "N/A"}`,
        20,
        78
      );

      doc.text(
        `Due Date: ${dueDate}`,
        20,
        85
      );

      // ==========================================
      // PAYMENT INFORMATION
      // ==========================================

      doc.setFont("helvetica", "bold");

      doc.text(
        "PAYMENT INFORMATION",
        110,
        62
      );

      doc.setFont("helvetica", "normal");

      doc.text(
        `Status: ${bill.status || "Pending"}`,
        110,
        71
      );

      if (bill.status === "Paid") {
        doc.text(
          `Paid Date: ${
            bill.paidAt
              ? new Date(
                  bill.paidAt
                ).toLocaleDateString()
              : "N/A"
          }`,
          110,
          78
        );

        doc.text(
          `Transaction ID: ${
            bill.transactionId || "N/A"
          }`,
          110,
          85
        );
      }

      // ==========================================
      // BILL TABLE
      // ==========================================

      doc.setFillColor(
        245,
        247,
        250
      );

      doc.rect(
        20,
        101,
        170,
        13,
        "F"
      );

      doc.setTextColor(71, 85, 105);

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");

      doc.text(
        "DESCRIPTION",
        25,
        109
      );

      doc.text(
        "AMOUNT",
        155,
        109
      );

      doc.setTextColor(15, 23, 42);

      doc.setFont("helvetica", "normal");

      const description =
        bill.source === "Complaint"
          ? "Complaint / Maintenance Charges"
          : "Monthly Maintenance Charges";

      doc.text(
        description,
        25,
        125
      );

      doc.text(
        `Rs. ${amount}`,
        155,
        125
      );

      doc.setDrawColor(
        226,
        232,
        240
      );

      doc.line(
        20,
        135,
        190,
        135
      );

      // ==========================================
      // TOTAL
      // ==========================================

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");

      doc.text(
        "TOTAL",
        125,
        149
      );

      doc.text(
        `Rs. ${amount}`,
        155,
        149
      );

      // ==========================================
      // COMPLAINT INFORMATION
      // ==========================================

      let currentY = 170;

      if (
        bill.source === "Complaint" &&
        bill.complaint
      ) {
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");

        doc.text(
          "COMPLAINT INFORMATION",
          20,
          currentY
        );

        currentY += 9;

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");

        doc.text(
          `Subject: ${
            bill.complaint.subject || "N/A"
          }`,
          20,
          currentY
        );

        currentY += 7;

        doc.text(
          `Category: ${
            bill.complaint.category || "N/A"
          }`,
          20,
          currentY
        );

        currentY += 7;

        doc.text(
          `Status: ${
            bill.complaint.status || "N/A"
          }`,
          20,
          currentY
        );

        currentY += 15;
      }

      // ==========================================
      // STATUS MESSAGE
      // ==========================================

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");

      if (bill.status === "Paid") {
        doc.setTextColor(16, 185, 129);

        doc.text(
          "Payment Status: PAID",
          20,
          currentY
        );
      } else if (
        bill.status === "Overdue"
      ) {
        doc.setTextColor(239, 68, 68);

        doc.text(
          "Payment Status: OVERDUE",
          20,
          currentY
        );
      } else {
        doc.setTextColor(245, 158, 11);

        doc.text(
          "Payment Status: PENDING",
          20,
          currentY
        );
      }

      // ==========================================
      // FOOTER
      // ==========================================

      doc.setFontSize(8);
      doc.setTextColor(
        100,
        116,
        139
      );

      doc.text(
        "This is a computer-generated maintenance voucher.",
        20,
        275
      );

      doc.text(
        "SmartSociety Management System",
        20,
        282
      );

      // ==========================================
      // SAVE
      // ==========================================

      doc.save(
        `SmartSociety-${invoiceNumber}.pdf`
      );

      toast.success(
        "Maintenance voucher downloaded"
      );
    } catch (error) {
      console.error(
        "Voucher PDF Error:",
        error
      );

      toast.error(
        "Failed to generate voucher PDF"
      );
    }
  };

  // ==========================================
  // STATS
  // ==========================================

  const totalRecords = maintenance.length;

  const pendingRecords = maintenance.filter(
    (item) => item.status === "Pending"
  ).length;

  const overdueRecords = maintenance.filter(
    (item) => item.status === "Overdue"
  ).length;

  const paidRecords = maintenance.filter(
    (item) => item.status === "Paid"
  ).length;

  const pendingAmount = maintenance
    .filter(
      (item) =>
        item.status === "Pending" ||
        item.status === "Overdue"
    )
    .reduce(
      (total, item) =>
        total + Number(item.amount || 0),
      0
    );

  if (loading) {
    return (
      <DashboardLayout role="resident">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm font-medium text-[#756b78]">
            Loading maintenance records...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="resident">
      <div className="w-full min-w-0 max-w-full">

        {/* ================= HEADER ================= */}

        <div className="mb-6">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#9b7740]">
            Resident Portal
          </p>

          <h1 className="text-[20px] font-extrabold tracking-tight text-[#32143b] md:text-[22px]">
            Maintenance
          </h1>

          <p className="mt-1 text-[11.5px] font-medium text-[#8b778e]">
            View your maintenance bills and payment status.
          </p>
        </div>

        {/* ================= STATS ================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <MaintenanceStat
            title="Total Records"
            value={totalRecords}
            label="All maintenance bills"
            icon={ReceiptText}
            tone="green"
          />

          <MaintenanceStat
            title="Pending"
            value={pendingRecords}
            label="Awaiting payment"
            icon={Clock3}
            tone="yellow"
          />

          <MaintenanceStat
            title="Overdue"
            value={overdueRecords}
            label="Past due date"
            icon={AlertCircle}
            tone="red"
          />

          <MaintenanceStat
            title="Paid"
            value={paidRecords}
            label="Completed payments"
            icon={CheckCircle2}
            tone="blue"
          />

        </div>

        {/* ================= PENDING AMOUNT ================= */}

        <section className="mt-6 overflow-hidden rounded-none border border-[#e2d9df] bg-[#f7f3ed]">

          <div className="flex items-center justify-between gap-4 p-5">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#9b7740]">
                Outstanding Maintenance
              </p>

              <p className="mt-1 text-[24px] font-extrabold text-[#826331]">
                Rs.{" "}
                {pendingAmount.toLocaleString()}
              </p>

              <p className="mt-1 text-[10.5px] font-medium text-[#9b7740]">
                Pending and overdue maintenance
              </p>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-none bg-white text-[#9b7740]">
              <ReceiptText size={22} />
            </div>

          </div>

        </section>

        {/* ================= MAINTENANCE LIST ================= */}

        <section className="mt-6 overflow-hidden rounded-none border border-[#e2d9df] bg-white">

          <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">

            <div>
              <h2 className="flex items-center gap-2 text-[13px] font-bold text-[#32143b]">

                <ReceiptText
                  size={16}
                  className="text-[#9b7740]"
                />

                Maintenance Records

              </h2>

              <p className="mt-1 text-[10px] text-[#8b778e]">
                Your maintenance bills and payment history
              </p>
            </div>

          </div>

          <div className="p-5">

            {maintenance.length === 0 ? (

              <div className="flex min-h-[180px] items-center justify-center rounded-none border border-dashed border-[#e2d9df] bg-[#f7f3ed]">

                <div className="text-center">

                  <ReceiptText
                    size={28}
                    className="mx-auto mb-2 text-[#bca9c0]"
                  />

                  <p className="text-[11px] font-semibold text-[#756b78]">
                    No maintenance records found
                  </p>

                  <p className="mt-1 text-[10px] text-[#8b778e]">
                    Your maintenance bills will appear here.
                  </p>

                </div>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[900px] border-collapse">

                  <thead>

                    <tr className="border-b border-[#e2d9df]">

                      <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                        Month
                      </th>

                      <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                        Amount
                      </th>

                      <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                        Due Date
                      </th>

                      <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                        Status
                      </th>

                      <th className="px-4 py-3 text-right text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {maintenance.map((item) => (

                      <tr
                        key={item._id}
                        className="border-b border-[#eee8ed] last:border-0 hover:bg-[#f7f3ed]"
                      >

                        {/* MONTH */}

                        <td className="px-4 py-4">

                          <div className="flex items-center gap-2.5">

                            <div className="flex h-9 w-9 items-center justify-center rounded-none bg-[#f7f3ed] text-[#9b7740]">

                              <ReceiptText size={16} />

                            </div>

                            <span className="text-[11px] font-bold text-[#49394d]">
                              {item.month}
                            </span>

                          </div>

                        </td>

                        {/* AMOUNT */}

                        <td className="px-4 py-4">

                          <span className="text-[11px] font-bold text-[#49394d]">

                            Rs.{" "}

                            {Number(
                              item.amount || 0
                            ).toLocaleString()}

                          </span>

                        </td>

                        {/* DUE DATE */}

                        <td className="px-4 py-4">

                          <div className="flex items-center gap-1.5 text-[10px] font-medium text-[#756b78]">

                            <CalendarDays size={13} />

                            {item.dueDate
                              ? new Date(
                                  item.dueDate
                                ).toLocaleDateString()
                              : "-"}

                          </div>

                        </td>

                        {/* STATUS */}

                        <td className="px-4 py-4">

                          <MaintenanceStatus
                            status={item.status}
                          />

                        </td>

                        {/* ACTIONS */}

                        <td className="px-4 py-4">

                          <div className="flex justify-end gap-2">

                            {/* VIEW DETAILS */}

                            <button
                              type="button"
                              onClick={() =>
                                handleViewMaintenance(
                                  item._id
                                )
                              }
                              title="View Details"
                              className="inline-flex h-8 items-center gap-1.5 rounded-none border border-[#e2d9df] bg-white px-3 text-[10px] font-bold text-[#756b78] transition hover:border-[#d9be82] hover:bg-[#f7f3ed] hover:text-[#9b7740]"
                            >

                              <Eye size={13} />

                              View

                            </button>

                            {/* VIEW VOUCHER */}

                            <button
                              type="button"
                              onClick={() =>
                                setVoucherMaintenance(
                                  item
                                )
                              }
                              title="View Voucher"
                              className="inline-flex h-8 items-center gap-1.5 rounded-none bg-[#f7f3ed] px-3 text-[10px] font-bold text-[#63366f] transition hover:bg-[#f1eaf3]"
                            >

                              <FileText size={13} />

                              Voucher

                            </button>

                            {/* DOWNLOAD PDF */}

                            <button
                              type="button"
                              onClick={() =>
                                downloadVoucherPDF(
                                  item
                                )
                              }
                              title="Download Voucher PDF"
                              className="inline-flex h-8 items-center gap-1.5 rounded-none bg-[#eee8ed] px-3 text-[10px] font-bold text-[#756b78] transition hover:bg-[#e2d9df]"
                            >

                              <Download size={13} />

                              PDF

                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </section>

        {/* ================= DETAILS MODAL ================= */}

        {selectedMaintenance && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#32143b]/50 p-4">

            <div className="w-full max-w-md overflow-hidden rounded-none bg-white shadow-2xl">

              <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-wide text-[#9b7740]">
                    Maintenance Details
                  </p>

                  <h2 className="mt-1 text-[16px] font-extrabold text-[#32143b]">
                    {selectedMaintenance.month}
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedMaintenance(null)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-none text-[#8b778e] transition hover:bg-[#eee8ed] hover:text-[#49394d]"
                >

                  <X size={17} />

                </button>

              </div>

              <div className="space-y-3 p-5">

                <MaintenanceDetail
                  label="Flat Number"
                  value={
                    selectedMaintenance.flatNo ||
                    "-"
                  }
                />

                <MaintenanceDetail
                  label="Month"
                  value={
                    selectedMaintenance.month ||
                    "-"
                  }
                />

                <MaintenanceDetail
                  label="Amount"
                  value={`Rs. ${Number(
                    selectedMaintenance.amount || 0
                  ).toLocaleString()}`}
                />

                <MaintenanceDetail
                  label="Due Date"
                  value={
                    selectedMaintenance.dueDate
                      ? new Date(
                          selectedMaintenance.dueDate
                        ).toLocaleDateString()
                      : "-"
                  }
                />

                <MaintenanceDetail
                  label="Status"
                  value={
                    selectedMaintenance.status ||
                    "Pending"
                  }
                />

                {selectedMaintenance.paidAt && (

                  <MaintenanceDetail
                    label="Paid At"
                    value={new Date(
                      selectedMaintenance.paidAt
                    ).toLocaleDateString()}
                  />

                )}

                {selectedMaintenance.transactionId && (

                  <MaintenanceDetail
                    label="Transaction ID"
                    value={
                      selectedMaintenance.transactionId
                    }
                  />

                )}

              </div>

              <div className="flex gap-2 border-t border-[#e2d9df] px-5 py-4">

                <button
                  type="button"
                  onClick={() =>
                    setSelectedMaintenance(null)
                  }
                  className="flex-1 rounded-none border border-[#e2d9df] bg-white py-2.5 text-[11px] font-bold text-[#756b78] transition hover:bg-[#f7f3ed]"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedMaintenance(null);
                    setVoucherMaintenance(
                      selectedMaintenance
                    );
                  }}
                  className="flex-1 rounded-none bg-[#63366f] py-2.5 text-[11px] font-bold text-white transition hover:bg-[#63366f]"
                >
                  View Voucher
                </button>

              </div>

            </div>

          </div>

        )}

        {/* ================= VOUCHER MODAL ================= */}

        {voucherMaintenance && (

          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#32143b]/50 p-4">

            <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-none bg-white shadow-2xl">

              {/* VOUCHER HEADER */}

              <div className="flex items-center justify-between border-b border-[#e2d9df] px-6 py-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-none bg-[#f7f3ed] text-[#63366f]">

                    <FileText size={18} />

                  </div>

                  <div>

                    <h2 className="text-[15px] font-bold text-[#32143b]">
                      Maintenance Voucher
                    </h2>

                    <p className="text-[10.5px] font-medium text-[#8b778e]">
                      SmartSociety Maintenance Voucher
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setVoucherMaintenance(null)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-none text-[#8b778e] transition hover:bg-[#eee8ed] hover:text-[#49394d]"
                >

                  <X size={18} />

                </button>

              </div>

              {/* VOUCHER CONTENT */}

              <div className="p-6">

                {/* TOP */}

                <div className="flex items-start justify-between border-b border-[#e2d9df] pb-5">

                  <div>

                    <h1 className="text-[22px] font-extrabold text-[#32143b]">
                      SmartSociety
                    </h1>

                    <p className="mt-1 text-[10.5px] font-medium text-[#8b778e]">
                      Society Management System
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-[18px] font-extrabold text-[#32143b]">
                      MAINTENANCE VOUCHER
                    </p>

                    <p className="mt-1 text-[10px] font-semibold text-[#8b778e]">
                      INV-
                      {voucherMaintenance._id
                        ?.slice(-8)
                        .toUpperCase()}
                    </p>

                    <p className="mt-1 text-[10px] font-semibold text-[#8b778e]">
                      {voucherMaintenance.createdAt
                        ? new Date(
                            voucherMaintenance.createdAt
                          ).toLocaleDateString()
                        : new Date().toLocaleDateString()}
                    </p>

                  </div>

                </div>

                {/* INFORMATION */}

                <div className="grid gap-6 py-6 sm:grid-cols-2">

                  {/* RESIDENT */}

                  <div>

                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Resident Information
                    </p>

                    <p className="text-[12px] font-bold text-[#49394d]">
                      Flat:{" "}
                      {voucherMaintenance.flatNo ||
                        "-"}
                    </p>

                    <p className="mt-1 text-[10.5px] text-[#756b78]">
                      Month:{" "}
                      {voucherMaintenance.month ||
                        "-"}
                    </p>

                    <p className="mt-1 text-[10.5px] text-[#756b78]">
                      Due Date:{" "}
                      {voucherMaintenance.dueDate
                        ? new Date(
                            voucherMaintenance.dueDate
                          ).toLocaleDateString()
                        : "-"}
                    </p>

                  </div>

                  {/* PAYMENT */}

                  <div className="sm:text-right">

                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Payment Information
                    </p>

                    <MaintenanceStatus
                      status={
                        voucherMaintenance.status
                      }
                    />

                    {voucherMaintenance.paidAt && (

                      <p className="mt-2 text-[10.5px] text-[#756b78]">
                        Paid:{" "}
                        {new Date(
                          voucherMaintenance.paidAt
                        ).toLocaleDateString()}
                      </p>

                    )}

                    {voucherMaintenance.transactionId && (

                      <p className="mt-1 break-all text-[10px] text-[#756b78]">
                        Transaction:{" "}
                        {voucherMaintenance.transactionId}
                      </p>

                    )}

                  </div>

                </div>

                {/* TABLE */}

                <div className="overflow-hidden rounded-none border border-[#e2d9df]">

                  <div className="grid grid-cols-[1fr_auto] bg-[#f7f3ed] px-4 py-3">

                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Description
                    </span>

                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Amount
                    </span>

                  </div>

                  <div className="grid grid-cols-[1fr_auto] px-4 py-4">

                    <div>

                      <p className="text-[11px] font-bold text-[#49394d]">
                        {voucherMaintenance.source ===
                        "Complaint"
                          ? "Complaint / Maintenance Charges"
                          : "Monthly Maintenance Charges"}
                      </p>

                      {voucherMaintenance.source ===
                        "Complaint" &&
                        voucherMaintenance.complaint && (

                          <p className="mt-1 text-[9.5px] text-[#8b778e]">
                            {voucherMaintenance
                              .complaint
                              .subject ||
                              "Complaint"}
                          </p>

                        )}

                    </div>

                    <span className="text-[11px] font-bold text-[#49394d]">
                      Rs.{" "}
                      {Number(
                        voucherMaintenance.amount ||
                          0
                      ).toLocaleString()}
                    </span>

                  </div>

                </div>

                {/* TOTAL */}

                <div className="mt-5 flex justify-end">

                  <div className="w-full max-w-[240px]">

                    <div className="flex items-center justify-between border-t border-[#e2d9df] pt-3">

                      <span className="text-[12px] font-bold text-[#756b78]">
                        Total
                      </span>

                      <span className="text-[17px] font-extrabold text-[#9b7740]">
                        Rs.{" "}
                        {Number(
                          voucherMaintenance.amount ||
                            0
                        ).toLocaleString()}
                      </span>

                    </div>

                  </div>

                </div>

                {/* COMPLAINT DETAILS */}

                {voucherMaintenance.source ===
                  "Complaint" &&
                  voucherMaintenance.complaint && (

                    <div className="mt-6 rounded-none border border-[#e2d9df] bg-[#f7f3ed] p-4">

                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#8b778e]">
                        Complaint Information
                      </p>

                      <div className="mt-3 grid gap-2 sm:grid-cols-2">

                        <p className="text-[10.5px] text-[#756b78]">

                          Subject:{" "}

                          <span className="font-semibold text-[#49394d]">

                            {voucherMaintenance
                              .complaint
                              .subject ||
                              "N/A"}

                          </span>

                        </p>

                        <p className="text-[10.5px] text-[#756b78]">

                          Category:{" "}

                          <span className="font-semibold text-[#49394d]">

                            {voucherMaintenance
                              .complaint
                              .category ||
                              "N/A"}

                          </span>

                        </p>

                      </div>

                    </div>

                  )}

                {/* FOOTER */}

                <div className="mt-8 border-t border-[#e2d9df] pt-4">

                  <p className="text-center text-[9.5px] font-medium text-[#8b778e]">
                    This is a computer-generated maintenance voucher.
                  </p>

                  <p className="mt-1 text-center text-[9.5px] font-medium text-[#8b778e]">
                    SmartSociety Management System
                  </p>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="flex justify-end gap-3 border-t border-[#e2d9df] bg-[#f7f3ed] px-6 py-4">

                <button
                  type="button"
                  onClick={() =>
                    setVoucherMaintenance(null)
                  }
                  className="rounded-none border border-[#e2d9df] bg-white px-4 py-2.5 text-[11px] font-bold text-[#756b78] transition hover:bg-[#eee8ed]"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() =>
                    downloadVoucherPDF(
                      voucherMaintenance
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-none bg-[#9b7740] px-4 py-2.5 text-[11px] font-bold text-white transition hover:bg-[#9b7740]"
                >

                  <Download size={14} />

                  Download PDF

                </button>

              </div>

            </div>

          </div>

        )}

        {/* ================= DETAILS LOADING ================= */}

        {detailsLoading && (

          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#32143b]/30">

            <div className="rounded-none bg-white px-5 py-3 shadow-lg">

              <p className="text-[11px] font-semibold text-[#756b78]">
                Loading details...
              </p>

            </div>

          </div>

        )}

      </div>
    </DashboardLayout>
  );
}

/* ================= STAT ================= */

function MaintenanceStat({
  title,
  value,
  label,
  icon: Icon,
  tone,
}) {
  const tones = {
    green: {
      icon: "bg-[#f7f3ed] text-[#9b7740]",
      circle: "bg-[#9b7740]",
    },
    yellow: {
      icon: "bg-[#f7f3ed] text-[#9b7740]",
      circle: "bg-[#9b7740]",
    },
    red: {
      icon: "bg-red-50 text-red-500",
      circle: "bg-red-500",
    },
    blue: {
      icon: "bg-[#f7f3ed] text-[#9b7740]",
      circle: "bg-[#9b7740]",
    },
  };

  const current = tones[tone] || tones.green;

  return (
    <div className="relative overflow-hidden rounded-none border border-[#e2d9df] bg-white p-5">

      <div
        className={`absolute -right-5 -top-5 h-20 w-20 rounded-none opacity-[0.06] ${current.circle}`}
      />

      <div
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-none ${current.icon}`}
      >
        <Icon size={20} />
      </div>

      <div className="text-[26px] font-extrabold leading-none tracking-tight text-[#32143b]">
        {value}
      </div>

      <div className="mt-1 text-[12.5px] font-semibold text-[#756b78]">
        {title}
      </div>

      <div className="mt-1 text-[10.5px] font-medium text-[#8b778e]">
        {label}
      </div>

    </div>
  );
}

/* ================= STATUS ================= */

function MaintenanceStatus({ status }) {
  if (status === "Paid") {
    return (
      <span className="inline-flex rounded-none bg-[#f7f3ed] px-2 py-1 text-[8.5px] font-bold text-[#9b7740]">
        Paid
      </span>
    );
  }

  if (status === "Overdue") {
    return (
      <span className="inline-flex rounded-none bg-red-50 px-2 py-1 text-[8.5px] font-bold text-red-600">
        Overdue
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-none bg-[#f7f3ed] px-2 py-1 text-[8.5px] font-bold text-[#9b7740]">
      Pending
    </span>
  );
}

/* ================= DETAIL ROW ================= */

function MaintenanceDetail({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-none bg-[#f7f3ed] px-3 py-2.5">

      <span className="text-[10px] font-semibold text-[#8b778e]">
        {label}
      </span>

      <span className="break-all text-right text-[10.5px] font-bold text-[#49394d]">
        {value}
      </span>

    </div>
  );
}

export default ResidentMaintenance;

