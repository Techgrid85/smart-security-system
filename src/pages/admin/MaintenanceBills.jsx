import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

import {
  ReceiptText,
  Plus,
  Search,
  Pencil,
  Trash2,
  CheckCircle2,
  X,
  Loader2,
  CircleDollarSign,
  Clock3,
  AlertCircle,
  FileText,
  Download,
  Eye,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

const MaintenanceBills = () => {
  const [bills, setBills] = useState([]);
  const [residents, setResidents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingBill, setEditingBill] = useState(null);

  const [invoiceBill, setInvoiceBill] = useState(null);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    resident: "",
    amount: "",
    month: "",
    dueDate: "",
  });

  // ==========================================
  // TOKEN
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==========================================
  // FETCH BILLS
  // ==========================================

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "https://smart-society-backend-delta.vercel.app/admin/bills",
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setBills(response.data.data || []);
    } catch (error) {
      console.error("Fetch Bills Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load maintenance bills"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH RESIDENTS
  // ==========================================

  const fetchResidents = async () => {
    try {
      const response = await axios.get(
        "https://smart-society-backend-delta.vercel.app/admin/residents",
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setResidents(response.data.data || []);
    } catch (error) {
      console.error("Fetch Residents Error:", error);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchBills();
    fetchResidents();
  }, []);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // OPEN CREATE MODAL
  // ==========================================

  const openCreateModal = () => {
    setEditingBill(null);

    setFormData({
      resident: "",
      amount: "",
      month: "",
      dueDate: "",
    });

    setShowModal(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (bill) => {
    setEditingBill(bill);

    setFormData({
      resident: bill.resident?._id || bill.resident || "",
      amount: bill.amount || "",
      month: bill.month || "",
      dueDate: bill.dueDate
        ? bill.dueDate.split("T")[0]
        : "",
    });

    setShowModal(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingBill(null);

    setFormData({
      resident: "",
      amount: "",
      month: "",
      dueDate: "",
    });
  };

  // ==========================================
  // SUBMIT CREATE / UPDATE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = getToken();

      const payload = {
        resident: formData.resident,
        amount: Number(formData.amount),
        month: formData.month.trim(),
        dueDate: formData.dueDate,
      };

      if (editingBill) {
        await axios.put(
          `https://smart-society-backend-delta.vercel.app/admin/bills/${editingBill._id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          "https://smart-society-backend-delta.vercel.app/admin/bills",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      closeModal();
      await fetchBills();
    } catch (error) {
      console.error(
        "Save Maintenance Bill Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          `Failed to ${
            editingBill ? "update" : "create"
          } maintenance bill`
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // MARK AS PAID
  // ==========================================

  const markAsPaid = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to mark this bill as paid?"
    );

    if (!confirmed) return;

    try {
      await axios.patch(
        `https://smart-society-backend-delta.vercel.app/admin/bills/${id}/pay`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      await fetchBills();
    } catch (error) {
      console.error("Mark Paid Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to mark bill as paid"
      );
    }
  };

  // ==========================================
  // DELETE BILL
  // ==========================================

  const deleteBill = async (bill) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the maintenance bill for ${
        bill.resident?.name || "this resident"
      }?`
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `https://smart-society-backend-delta.vercel.app/admin/bills/${bill._id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setBills((previous) =>
        previous.filter(
          (item) => item._id !== bill._id
        )
      );
    } catch (error) {
      console.error("Delete Bill Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete maintenance bill"
      );
    }
  };

  // ==========================================
  // DOWNLOAD INVOICE PDF
  // ==========================================

  const downloadInvoicePDF = (bill) => {
    const doc = new jsPDF();

    const resident = bill.resident || {};

    const invoiceNumber =
      `INV-${bill._id
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
    doc.text("INVOICE", 150, 25);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);

    doc.text(
      `Invoice #: ${invoiceNumber}`,
      150,
      33
    );

    doc.text(
      `Date: ${createdDate}`,
      150,
      40
    );

    // ==========================================
    // HEADER LINE
    // ==========================================

    doc.setDrawColor(226, 232, 240);
    doc.line(20, 49, 190, 49);

    // ==========================================
    // BILL TO
    // ==========================================

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");

    doc.text("BILL TO", 20, 62);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.text(
      `Name: ${resident.name || "N/A"}`,
      20,
      70
    );

    doc.text(
      `Email: ${resident.email || "N/A"}`,
      20,
      77
    );

    doc.text(
      `Phone: ${resident.phone || "N/A"}`,
      20,
      84
    );

    doc.text(
      `Flat: ${
        bill.flatNo ||
        resident.flatNo ||
        "N/A"
      }`,
      20,
      91
    );

    // ==========================================
    // BILL INFORMATION
    // ==========================================

    doc.setFont("helvetica", "bold");

    doc.text(
      "BILL INFORMATION",
      110,
      62
    );

    doc.setFont("helvetica", "normal");

    doc.text(
      `Month: ${bill.month || "N/A"}`,
      110,
      70
    );

    doc.text(
      `Due Date: ${dueDate}`,
      110,
      77
    );

    doc.text(
      `Source: ${bill.source || "Normal"}`,
      110,
      84
    );

    doc.text(
      `Status: ${bill.status || "Pending"}`,
      110,
      91
    );

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
      106,
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
      114
    );

    doc.text(
      "AMOUNT",
      155,
      114
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
      130
    );

    doc.text(
      `Rs. ${amount}`,
      155,
      130
    );

    doc.setDrawColor(
      226,
      232,
      240
    );

    doc.line(
      20,
      140,
      190,
      140
    );

    // ==========================================
    // TOTAL
    // ==========================================

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");

    doc.text(
      "TOTAL",
      125,
      153
    );

    doc.text(
      `Rs. ${amount}`,
      155,
      153
    );

    // ==========================================
    // COMPLAINT INFORMATION
    // ==========================================

    let currentY = 175;

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
          bill.complaint.subject ||
          "N/A"
        }`,
        20,
        currentY
      );

      currentY += 7;

      doc.text(
        `Category: ${
          bill.complaint.category ||
          "N/A"
        }`,
        20,
        currentY
      );

      currentY += 7;

      doc.text(
        `Status: ${
          bill.complaint.status ||
          "N/A"
        }`,
        20,
        currentY
      );

      currentY += 15;
    }

    // ==========================================
    // PAYMENT INFORMATION
    // ==========================================

    if (bill.status === "Paid") {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");

      doc.text(
        "PAYMENT INFORMATION",
        20,
        currentY
      );

      currentY += 9;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");

      doc.text(
        `Paid Date: ${
          bill.paidAt
            ? new Date(
                bill.paidAt
              ).toLocaleDateString()
            : "N/A"
        }`,
        20,
        currentY
      );

      currentY += 7;

      doc.text(
        `Transaction ID: ${
          bill.transactionId ||
          "N/A"
        }`,
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
      "This is a computer-generated invoice.",
      20,
      275
    );

    doc.text(
      "SmartSociety Management System",
      20,
      282
    );

    // ==========================================
    // SAVE PDF
    // ==========================================

    doc.save(
      `SmartSociety-${invoiceNumber}.pdf`
    );
  };

  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  const filteredBills = bills.filter(
    (bill) => {
      const query =
        search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        bill.resident?.name
          ?.toLowerCase()
          .includes(query) ||
        bill.resident?.email
          ?.toLowerCase()
          .includes(query) ||
        bill.flatNo
          ?.toLowerCase()
          .includes(query) ||
        bill.month
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        bill.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  // ==========================================
  // COUNTS
  // ==========================================

  const totalBills = bills.length;

  const pendingBills = bills.filter(
    (bill) =>
      bill.status === "Pending"
  ).length;

  const paidBills = bills.filter(
    (bill) =>
      bill.status === "Paid"
  ).length;

  const overdueBills = bills.filter(
    (bill) =>
      bill.status === "Overdue"
  ).length;

  return (
    <DashboardLayout role="admin">
      <div className="w-full">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

          <div>
            <h1 className="flex items-center gap-2 text-[22px] font-extrabold text-slate-900">
              <ReceiptText
                size={23}
                className="text-emerald-500"
              />

              Maintenance Bills
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-slate-400">
              Manage resident maintenance bills and payments.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-[11px] font-bold text-white transition hover:bg-emerald-600"
          >
            <Plus size={14} />
            Create Bill
          </button>

        </div>

        {/* ======================================
            STATS
        ====================================== */}

        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">

          <StatCard
            icon={
              <ReceiptText size={17} />
            }
            label="Total Bills"
            value={totalBills}
            iconClass="bg-emerald-50 text-emerald-500"
          />

          <StatCard
            icon={
              <Clock3 size={17} />
            }
            label="Pending"
            value={pendingBills}
            iconClass="bg-amber-50 text-amber-500"
          />

          <StatCard
            icon={
              <CheckCircle2 size={17} />
            }
            label="Paid"
            value={paidBills}
            iconClass="bg-sky-50 text-sky-500"
          />

          <StatCard
            icon={
              <AlertCircle size={17} />
            }
            label="Overdue"
            value={overdueBills}
            iconClass="bg-red-50 text-red-500"
          />

        </div>

        {/* ======================================
            SEARCH + FILTER
        ====================================== */}

        <div className="mb-5 flex flex-col gap-4 rounded-[16px] border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="relative w-full sm:max-w-md">

            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search resident, flat or month..."
              className="w-full rounded-[10px] border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-[12px] font-medium text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white"
            />

          </div>

          <div className="flex flex-wrap items-center gap-3">

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-[11px] font-semibold text-slate-600 outline-none focus:border-emerald-400"
            >
              <option value="All">
                All Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Paid">
                Paid
              </option>

              <option value="Overdue">
                Overdue
              </option>
            </select>

            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">

              <ReceiptText
                size={16}
                className="text-emerald-500"
              />

              {filteredBills.length} Bills

            </div>

          </div>

        </div>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-medium text-red-600">

            <AlertCircle size={16} />

            {error}

          </div>
        )}

        {/* ======================================
            TABLE
        ====================================== */}

        <section className="overflow-hidden rounded-[16px] border border-slate-200 bg-white">

          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

            <div>
              <h2 className="text-[13px] font-bold text-slate-900">
                All Maintenance Bills
              </h2>

              <p className="mt-0.5 text-[10.5px] font-medium text-slate-400">
                Registered resident maintenance payments
              </p>
            </div>

            <button
              type="button"
              onClick={fetchBills}
              className="rounded-lg border border-slate-200 px-3 py-2 text-[10.5px] font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Refresh
            </button>

          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">

              <Loader2
                size={28}
                className="animate-spin text-emerald-500"
              />

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1200px] border-collapse">

                <thead>
                  <tr className="bg-slate-50">

                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Resident
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Flat
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Month
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Amount
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Due Date
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredBills.length > 0 ? (
                    filteredBills.map(
                      (bill) => (
                        <tr
                          key={bill._id}
                          className="border-t border-slate-200 transition hover:bg-slate-50"
                        >

                          {/* RESIDENT */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                <CircleDollarSign
                                  size={16}
                                />
                              </div>

                              <div>

                                <p className="text-[12px] font-bold text-slate-800">
                                  {bill.resident
                                    ?.name ||
                                    "Unknown"}
                                </p>

                                <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                                  {bill.resident
                                    ?.email ||
                                    "-"}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* FLAT */}

                          <td className="px-4 py-4">

                            <span className="text-[11px] font-semibold text-slate-700">
                              {bill.flatNo ||
                                "-"}
                            </span>

                          </td>

                          {/* MONTH */}

                          <td className="px-4 py-4">

                            <span className="text-[11px] font-semibold text-slate-700">
                              {bill.month ||
                                "-"}
                            </span>

                          </td>

                          {/* AMOUNT */}

                          <td className="px-4 py-4">

                            <span className="text-[11px] font-bold text-slate-800">
                              Rs.{" "}
                              {Number(
                                bill.amount ||
                                  0
                              ).toLocaleString()}
                            </span>

                          </td>

                          {/* DUE DATE */}

                          <td className="px-4 py-4">

                            <span className="text-[11px] font-medium text-slate-500">
                              {bill.dueDate
                                ? new Date(
                                    bill.dueDate
                                  ).toLocaleDateString()
                                : "-"}
                            </span>

                          </td>

                          {/* STATUS */}

                          <td className="px-4 py-4">

                            <StatusBadge
                              status={
                                bill.status
                              }
                            />

                          </td>

                          {/* ACTIONS */}

                          <td className="px-5 py-4">

                            <div className="flex justify-end gap-2">

                              {/* VIEW INVOICE */}

                              <button
                                type="button"
                                onClick={() =>
                                  setInvoiceBill(
                                    bill
                                  )
                                }
                                title="View Invoice"
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600 transition hover:bg-violet-100"
                              >
                                <Eye
                                  size={14}
                                />
                              </button>

                              {/* DOWNLOAD PDF */}

                              <button
                                type="button"
                                onClick={() =>
                                  downloadInvoicePDF(
                                    bill
                                  )
                                }
                                title="Download Invoice PDF"
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                              >
                                <Download
                                  size={14}
                                />
                              </button>

                              {/* MARK PAID */}

                              {bill.status !==
                                "Paid" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    markAsPaid(
                                      bill._id
                                    )
                                  }
                                  title="Mark as Paid"
                                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100"
                                >
                                  <CheckCircle2
                                    size={14}
                                  />
                                </button>
                              )}

                              {/* EDIT */}

                              <button
                                type="button"
                                onClick={() =>
                                  openEditModal(
                                    bill
                                  )
                                }
                                title="Edit Bill"
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 transition hover:bg-sky-100"
                              >
                                <Pencil
                                  size={14}
                                />
                              </button>

                              {/* DELETE */}

                              <button
                                type="button"
                                onClick={() =>
                                  deleteBill(
                                    bill
                                  )
                                }
                                title="Delete Bill"
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
                              >
                                <Trash2
                                  size={14}
                                />
                              </button>

                            </div>

                          </td>

                        </tr>
                      )
                    )
                  ) : (
                    <tr>

                      <td
                        colSpan="7"
                        className="px-5 py-14 text-center"
                      >

                        <ReceiptText
                          size={32}
                          className="mx-auto mb-3 text-slate-300"
                        />

                        <p className="text-[12px] font-bold text-slate-600">
                          No maintenance bills found
                        </p>

                        <p className="mt-1 text-[10.5px] font-medium text-slate-400">
                          No bill matches your search
                          or filter.
                        </p>

                      </td>

                    </tr>
                  )}

                </tbody>

              </table>

            </div>
          )}

        </section>

        {/* ======================================
            CREATE / EDIT MODAL
        ====================================== */}

        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4">

            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[18px] bg-white shadow-2xl">

              {/* HEADER */}

              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

                <div>

                  <h2 className="text-[15px] font-bold text-slate-900">
                    {editingBill
                      ? "Edit Maintenance Bill"
                      : "Create Maintenance Bill"}
                  </h2>

                  <p className="mt-0.5 text-[10.5px] font-medium text-slate-400">
                    {editingBill
                      ? "Update bill information."
                      : "Create a new resident maintenance bill."}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                >
                  <X size={18} />
                </button>

              </div>

              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="p-5"
              >

                {/* RESIDENT */}

                <div>

                  <label className="mb-1.5 block text-[10.5px] font-bold text-slate-600">
                    Resident
                  </label>

                  <select
                    name="resident"
                    value={
                      formData.resident
                    }
                    onChange={
                      handleChange
                    }
                    required
                    className="w-full rounded-[9px] border border-slate-200 bg-white px-3 py-2.5 text-[11.5px] font-medium text-slate-700 outline-none transition focus:border-emerald-400"
                  >

                    <option value="">
                      Select Resident
                    </option>

                    {residents.map(
                      (resident) => (
                        <option
                          key={
                            resident._id
                          }
                          value={
                            resident._id
                          }
                        >
                          {resident.name}

                          {resident.flatNo
                            ? ` — ${resident.flatNo}`
                            : ""}
                        </option>
                      )
                    )}

                  </select>

                </div>

                {/* TWO COLUMNS */}

                <div className="mt-4 grid gap-4 sm:grid-cols-2">

                  {/* AMOUNT */}

                  <div>

                    <label className="mb-1.5 block text-[10.5px] font-bold text-slate-600">
                      Amount
                    </label>

                    <input
                      type="number"
                      name="amount"
                      min="0"
                      value={
                        formData.amount
                      }
                      onChange={
                        handleChange
                      }
                      required
                      placeholder="5000"
                      className="w-full rounded-[9px] border border-slate-200 bg-white px-3 py-2.5 text-[11.5px] font-medium text-slate-700 outline-none transition focus:border-emerald-400"
                    />

                  </div>

                  {/* MONTH */}

                  <div>

                    <label className="mb-1.5 block text-[10.5px] font-bold text-slate-600">
                      Month
                    </label>

                    <input
                      type="text"
                      name="month"
                      value={
                        formData.month
                      }
                      onChange={
                        handleChange
                      }
                      required
                      placeholder="August 2026"
                      className="w-full rounded-[9px] border border-slate-200 bg-white px-3 py-2.5 text-[11.5px] font-medium text-slate-700 outline-none transition focus:border-emerald-400"
                    />

                  </div>

                </div>

                {/* DUE DATE */}

                <div className="mt-4">

                  <label className="mb-1.5 block text-[10.5px] font-bold text-slate-600">
                    Due Date
                  </label>

                  <input
                    type="date"
                    name="dueDate"
                    value={
                      formData.dueDate
                    }
                    onChange={
                      handleChange
                    }
                    required
                    className="w-full rounded-[9px] border border-slate-200 bg-white px-3 py-2.5 text-[11.5px] font-medium text-slate-700 outline-none transition focus:border-emerald-400"
                  />

                </div>

                {/* BUTTONS */}

                <div className="mt-6 flex justify-end gap-3">

                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-[11px] font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {saving && (
                      <Loader2
                        size={14}
                        className="animate-spin"
                      />
                    )}

                    {saving
                      ? "Saving..."
                      : editingBill
                      ? "Save Changes"
                      : "Create Bill"}

                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

        {/* ======================================
            INVOICE MODAL
        ====================================== */}

        {invoiceBill && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/50 p-4">

            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[18px] bg-white shadow-2xl">

              {/* INVOICE HEADER */}

              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <FileText
                      size={18}
                    />
                  </div>

                  <div>

                    <h2 className="text-[15px] font-bold text-slate-900">
                      Invoice
                    </h2>

                    <p className="text-[10.5px] font-medium text-slate-400">
                      SmartSociety Maintenance Invoice
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setInvoiceBill(
                      null
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={18} />
                </button>

              </div>

              {/* INVOICE CONTENT */}

              <div className="p-6">

                {/* TOP */}

                <div className="flex items-start justify-between border-b border-slate-200 pb-5">

                  <div>

                    <h1 className="text-[22px] font-extrabold text-slate-900">
                      SmartSociety
                    </h1>

                    <p className="mt-1 text-[10.5px] font-medium text-slate-400">
                      Society Management System
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-[18px] font-extrabold text-slate-900">
                      INVOICE
                    </p>

                    <p className="mt-1 text-[10px] font-semibold text-slate-400">
                      INV-
                      {invoiceBill._id
                        ?.slice(-8)
                        .toUpperCase()}
                    </p>

                  </div>

                </div>

                {/* CUSTOMER + BILL INFORMATION */}

                <div className="grid gap-6 py-6 sm:grid-cols-2">

                  {/* BILL TO */}

                  <div>

                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Bill To
                    </p>

                    <p className="text-[12px] font-bold text-slate-800">
                      {invoiceBill
                        .resident
                        ?.name ||
                        "N/A"}
                    </p>

                    <p className="mt-1 text-[10.5px] text-slate-500">
                      {invoiceBill
                        .resident
                        ?.email ||
                        "N/A"}
                    </p>

                    <p className="mt-1 text-[10.5px] text-slate-500">
                      {invoiceBill
                        .resident
                        ?.phone ||
                        "N/A"}
                    </p>

                    <p className="mt-1 text-[10.5px] font-semibold text-slate-600">
                      Flat:{" "}
                      {invoiceBill
                        .flatNo ||
                        invoiceBill
                          .resident
                          ?.flatNo ||
                        "N/A"}
                    </p>

                  </div>

                  {/* BILL INFO */}

                  <div className="sm:text-right">

                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Bill Information
                    </p>

                    <p className="text-[10.5px] text-slate-500">
                      Month:{" "}
                      <span className="font-semibold text-slate-700">
                        {invoiceBill.month ||
                          "N/A"}
                      </span>
                    </p>

                    <p className="mt-1 text-[10.5px] text-slate-500">
                      Due Date:{" "}
                      <span className="font-semibold text-slate-700">
                        {invoiceBill.dueDate
                          ? new Date(
                              invoiceBill.dueDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </p>

                    <div className="mt-2">
                      <StatusBadge
                        status={
                          invoiceBill.status
                        }
                      />
                    </div>

                  </div>

                </div>

                {/* INVOICE TABLE */}

                <div className="overflow-hidden rounded-xl border border-slate-200">

                  <div className="grid grid-cols-[1fr_auto] bg-slate-50 px-4 py-3">

                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Description
                    </span>

                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Amount
                    </span>

                  </div>

                  <div className="grid grid-cols-[1fr_auto] px-4 py-4">

                    <div>

                      <p className="text-[11px] font-bold text-slate-700">
                        {invoiceBill.source ===
                        "Complaint"
                          ? "Complaint / Maintenance Charges"
                          : "Monthly Maintenance Charges"}
                      </p>

                      {invoiceBill.source ===
                        "Complaint" &&
                        invoiceBill.complaint && (
                          <p className="mt-1 text-[9.5px] text-slate-400">
                            {invoiceBill
                              .complaint
                              .subject ||
                              "Complaint"}
                          </p>
                        )}

                    </div>

                    <span className="text-[11px] font-bold text-slate-800">
                      Rs.{" "}
                      {Number(
                        invoiceBill.amount ||
                          0
                      ).toLocaleString()}
                    </span>

                  </div>

                </div>

                {/* TOTAL */}

                <div className="mt-5 flex justify-end">

                  <div className="w-full max-w-[240px]">

                    <div className="flex items-center justify-between border-t border-slate-200 pt-3">

                      <span className="text-[12px] font-bold text-slate-600">
                        Total
                      </span>

                      <span className="text-[17px] font-extrabold text-emerald-600">
                        Rs.{" "}
                        {Number(
                          invoiceBill.amount ||
                            0
                        ).toLocaleString()}
                      </span>

                    </div>

                  </div>

                </div>

                {/* COMPLAINT DETAILS */}

                {invoiceBill.source ===
                  "Complaint" &&
                  invoiceBill.complaint && (
                    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">

                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Complaint Information
                      </p>

                      <div className="mt-3 grid gap-2 sm:grid-cols-2">

                        <p className="text-[10.5px] text-slate-600">
                          Subject:{" "}
                          <span className="font-semibold text-slate-800">
                            {invoiceBill
                              .complaint
                              .subject ||
                              "N/A"}
                          </span>
                        </p>

                        <p className="text-[10.5px] text-slate-600">
                          Category:{" "}
                          <span className="font-semibold text-slate-800">
                            {invoiceBill
                              .complaint
                              .category ||
                              "N/A"}
                          </span>
                        </p>

                        <p className="text-[10.5px] text-slate-600">
                          Status:{" "}
                          <span className="font-semibold text-slate-800">
                            {invoiceBill
                              .complaint
                              .status ||
                              "N/A"}
                          </span>
                        </p>

                      </div>

                    </div>
                  )}

                {/* PAYMENT INFORMATION */}

                {invoiceBill.status ===
                  "Paid" && (
                  <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4">

                    <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                      Payment Information
                    </p>

                    <div className="mt-2 grid gap-2 sm:grid-cols-2">

                      <p className="text-[10.5px] text-slate-600">
                        Paid Date:{" "}
                        <span className="font-semibold">
                          {invoiceBill.paidAt
                            ? new Date(
                                invoiceBill.paidAt
                              ).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </p>

                      <p className="text-[10.5px] text-slate-600">
                        Transaction ID:{" "}
                        <span className="font-semibold">
                          {invoiceBill
                            .transactionId ||
                            "N/A"}
                        </span>
                      </p>

                    </div>

                  </div>
                )}

                {/* FOOTER */}

                <div className="mt-8 border-t border-slate-200 pt-4">

                  <p className="text-center text-[9.5px] font-medium text-slate-400">
                    This is a computer-generated invoice.
                  </p>

                  <p className="mt-1 text-center text-[9.5px] font-medium text-slate-400">
                    SmartSociety Management System
                  </p>

                </div>

              </div>

              {/* MODAL ACTIONS */}

              <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">

                <button
                  type="button"
                  onClick={() =>
                    setInvoiceBill(
                      null
                    )
                  }
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-bold text-slate-600 transition hover:bg-slate-100"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() =>
                    downloadInvoicePDF(
                      invoiceBill
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-[11px] font-bold text-white transition hover:bg-emerald-600"
                >
                  <Download
                    size={14}
                  />
                  Download PDF
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

// ==========================================
// STAT CARD
// ==========================================

function StatCard({
  icon,
  label,
  value,
  iconClass,
}) {
  return (
    <div className="flex items-center justify-between rounded-[16px] border border-slate-200 bg-white p-4">

      <div>

        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-[20px] font-extrabold text-slate-900">
          {value}
        </p>

      </div>

      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

    </div>
  );
}

// ==========================================
// STATUS BADGE
// ==========================================

function StatusBadge({ status }) {
  if (status === "Paid") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">

        <CheckCircle2 size={12} />

        Paid

      </span>
    );
  }

  if (status === "Overdue") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-600">

        <AlertCircle size={12} />

        Overdue

      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-600">

      <Clock3 size={12} />

      Pending

    </span>
  );
}

export default MaintenanceBills;