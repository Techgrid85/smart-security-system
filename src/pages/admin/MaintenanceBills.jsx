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
            <h1 className="flex items-center gap-2 text-[22px] font-extrabold text-[#32143b]">
              <ReceiptText
                size={23}
                className="text-[#9b7740]"
              />

              Maintenance Bills
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-[#8b778e]">
              Manage resident maintenance bills and payments.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-none bg-[#9b7740] px-4 py-2.5 text-[11px] font-bold text-white transition hover:bg-[#9b7740]"
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
            iconClass="bg-[#f7f3ed] text-[#9b7740]"
          />

          <StatCard
            icon={
              <Clock3 size={17} />
            }
            label="Pending"
            value={pendingBills}
            iconClass="bg-[#f7f3ed] text-[#9b7740]"
          />

          <StatCard
            icon={
              <CheckCircle2 size={17} />
            }
            label="Paid"
            value={paidBills}
            iconClass="bg-[#f7f3ed] text-[#9b7740]"
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

        <div className="mb-5 flex flex-col gap-4 rounded-none border border-[#e2d9df] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="relative w-full sm:max-w-md">

            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b778e]"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search resident, flat or month..."
              className="w-full rounded-none border border-[#e2d9df] bg-[#f7f3ed] py-2.5 pl-10 pr-4 text-[12px] font-medium text-[#49394d] outline-none transition focus:border-[#bca16a] focus:bg-white"
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
              className="rounded-none border border-[#e2d9df] bg-[#f7f3ed] px-3 py-2.5 text-[11px] font-semibold text-[#756b78] outline-none focus:border-[#bca16a]"
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

            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#756b78]">

              <ReceiptText
                size={16}
                className="text-[#9b7740]"
              />

              {filteredBills.length} Bills

            </div>

          </div>

        </div>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-none border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-medium text-red-600">

            <AlertCircle size={16} />

            {error}

          </div>
        )}

        {/* ======================================
            TABLE
        ====================================== */}

        <section className="overflow-hidden rounded-none border border-[#e2d9df] bg-white">

          <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">

            <div>
              <h2 className="text-[13px] font-bold text-[#32143b]">
                All Maintenance Bills
              </h2>

              <p className="mt-0.5 text-[10.5px] font-medium text-[#8b778e]">
                Registered resident maintenance payments
              </p>
            </div>

            <button
              type="button"
              onClick={fetchBills}
              className="rounded-none border border-[#e2d9df] px-3 py-2 text-[10.5px] font-bold text-[#756b78] transition hover:bg-[#f7f3ed]"
            >
              Refresh
            </button>

          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">

              <Loader2
                size={28}
                className="animate-spin text-[#9b7740]"
              />

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1200px] border-collapse">

                <thead>
                  <tr className="bg-[#f7f3ed]">

                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-[#8b778e]">
                      Resident
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-[#8b778e]">
                      Flat
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-[#8b778e]">
                      Month
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-[#8b778e]">
                      Amount
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-[#8b778e]">
                      Due Date
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-[#8b778e]">
                      Status
                    </th>

                    <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.06em] text-[#8b778e]">
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
                          className="border-t border-[#e2d9df] transition hover:bg-[#f7f3ed]"
                        >

                          {/* RESIDENT */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-9 w-9 items-center justify-center rounded-none bg-[#f7f3ed] text-[#9b7740]">
                                <CircleDollarSign
                                  size={16}
                                />
                              </div>

                              <div>

                                <p className="text-[12px] font-bold text-[#49394d]">
                                  {bill.resident
                                    ?.name ||
                                    "Unknown"}
                                </p>

                                <p className="mt-0.5 text-[10px] font-medium text-[#8b778e]">
                                  {bill.resident
                                    ?.email ||
                                    "-"}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* FLAT */}

                          <td className="px-4 py-4">

                            <span className="text-[11px] font-semibold text-[#49394d]">
                              {bill.flatNo ||
                                "-"}
                            </span>

                          </td>

                          {/* MONTH */}

                          <td className="px-4 py-4">

                            <span className="text-[11px] font-semibold text-[#49394d]">
                              {bill.month ||
                                "-"}
                            </span>

                          </td>

                          {/* AMOUNT */}

                          <td className="px-4 py-4">

                            <span className="text-[11px] font-bold text-[#49394d]">
                              Rs.{" "}
                              {Number(
                                bill.amount ||
                                  0
                              ).toLocaleString()}
                            </span>

                          </td>

                          {/* DUE DATE */}

                          <td className="px-4 py-4">

                            <span className="text-[11px] font-medium text-[#756b78]">
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
                                className="flex h-8 w-8 items-center justify-center rounded-none bg-[#f7f3ed] text-[#63366f] transition hover:bg-[#f1eaf3]"
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
                                className="flex h-8 w-8 items-center justify-center rounded-none bg-[#eee8ed] text-[#756b78] transition hover:bg-[#e2d9df]"
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
                                  className="flex h-8 w-8 items-center justify-center rounded-none bg-[#f7f3ed] text-[#9b7740] transition hover:bg-[#f5eee2]"
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
                                className="flex h-8 w-8 items-center justify-center rounded-none bg-[#f7f3ed] text-[#9b7740] transition hover:bg-[#f5eee2]"
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
                                className="flex h-8 w-8 items-center justify-center rounded-none bg-red-50 text-red-600 transition hover:bg-red-100"
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
                          className="mx-auto mb-3 text-[#bca9c0]"
                        />

                        <p className="text-[12px] font-bold text-[#756b78]">
                          No maintenance bills found
                        </p>

                        <p className="mt-1 text-[10.5px] font-medium text-[#8b778e]">
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#32143b]/50 p-4">

            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-none bg-white shadow-2xl">

              {/* HEADER */}

              <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">

                <div>

                  <h2 className="text-[15px] font-bold text-[#32143b]">
                    {editingBill
                      ? "Edit Maintenance Bill"
                      : "Create Maintenance Bill"}
                  </h2>

                  <p className="mt-0.5 text-[10.5px] font-medium text-[#8b778e]">
                    {editingBill
                      ? "Update bill information."
                      : "Create a new resident maintenance bill."}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex h-8 w-8 items-center justify-center rounded-none text-[#8b778e] transition hover:bg-[#eee8ed] hover:text-[#49394d] disabled:opacity-50"
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

                  <label className="mb-1.5 block text-[10.5px] font-bold text-[#756b78]">
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
                    className="w-full rounded-none border border-[#e2d9df] bg-white px-3 py-2.5 text-[11.5px] font-medium text-[#49394d] outline-none transition focus:border-[#bca16a]"
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

                    <label className="mb-1.5 block text-[10.5px] font-bold text-[#756b78]">
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
                      className="w-full rounded-none border border-[#e2d9df] bg-white px-3 py-2.5 text-[11.5px] font-medium text-[#49394d] outline-none transition focus:border-[#bca16a]"
                    />

                  </div>

                  {/* MONTH */}

                  <div>

                    <label className="mb-1.5 block text-[10.5px] font-bold text-[#756b78]">
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
                      className="w-full rounded-none border border-[#e2d9df] bg-white px-3 py-2.5 text-[11.5px] font-medium text-[#49394d] outline-none transition focus:border-[#bca16a]"
                    />

                  </div>

                </div>

                {/* DUE DATE */}

                <div className="mt-4">

                  <label className="mb-1.5 block text-[10.5px] font-bold text-[#756b78]">
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
                    className="w-full rounded-none border border-[#e2d9df] bg-white px-3 py-2.5 text-[11.5px] font-medium text-[#49394d] outline-none transition focus:border-[#bca16a]"
                  />

                </div>

                {/* BUTTONS */}

                <div className="mt-6 flex justify-end gap-3">

                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="rounded-none border border-[#e2d9df] px-4 py-2.5 text-[11px] font-bold text-[#756b78] transition hover:bg-[#f7f3ed] disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-none bg-[#9b7740] px-4 py-2.5 text-[11px] font-bold text-white transition hover:bg-[#9b7740] disabled:cursor-not-allowed disabled:opacity-60"
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
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#32143b]/50 p-4">

            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-none bg-white shadow-2xl">

              {/* INVOICE HEADER */}

              <div className="flex items-center justify-between border-b border-[#e2d9df] px-6 py-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-none bg-[#f7f3ed] text-[#9b7740]">
                    <FileText
                      size={18}
                    />
                  </div>

                  <div>

                    <h2 className="text-[15px] font-bold text-[#32143b]">
                      Invoice
                    </h2>

                    <p className="text-[10.5px] font-medium text-[#8b778e]">
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
                  className="flex h-8 w-8 items-center justify-center rounded-none text-[#8b778e] transition hover:bg-[#eee8ed] hover:text-[#49394d]"
                >
                  <X size={18} />
                </button>

              </div>

              {/* INVOICE CONTENT */}

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
                      INVOICE
                    </p>

                    <p className="mt-1 text-[10px] font-semibold text-[#8b778e]">
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

                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Bill To
                    </p>

                    <p className="text-[12px] font-bold text-[#49394d]">
                      {invoiceBill
                        .resident
                        ?.name ||
                        "N/A"}
                    </p>

                    <p className="mt-1 text-[10.5px] text-[#756b78]">
                      {invoiceBill
                        .resident
                        ?.email ||
                        "N/A"}
                    </p>

                    <p className="mt-1 text-[10.5px] text-[#756b78]">
                      {invoiceBill
                        .resident
                        ?.phone ||
                        "N/A"}
                    </p>

                    <p className="mt-1 text-[10.5px] font-semibold text-[#756b78]">
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

                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Bill Information
                    </p>

                    <p className="text-[10.5px] text-[#756b78]">
                      Month:{" "}
                      <span className="font-semibold text-[#49394d]">
                        {invoiceBill.month ||
                          "N/A"}
                      </span>
                    </p>

                    <p className="mt-1 text-[10.5px] text-[#756b78]">
                      Due Date:{" "}
                      <span className="font-semibold text-[#49394d]">
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
                        {invoiceBill.source ===
                        "Complaint"
                          ? "Complaint / Maintenance Charges"
                          : "Monthly Maintenance Charges"}
                      </p>

                      {invoiceBill.source ===
                        "Complaint" &&
                        invoiceBill.complaint && (
                          <p className="mt-1 text-[9.5px] text-[#8b778e]">
                            {invoiceBill
                              .complaint
                              .subject ||
                              "Complaint"}
                          </p>
                        )}

                    </div>

                    <span className="text-[11px] font-bold text-[#49394d]">
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

                    <div className="flex items-center justify-between border-t border-[#e2d9df] pt-3">

                      <span className="text-[12px] font-bold text-[#756b78]">
                        Total
                      </span>

                      <span className="text-[17px] font-extrabold text-[#9b7740]">
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
                    <div className="mt-6 rounded-none border border-[#e2d9df] bg-[#f7f3ed] p-4">

                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#8b778e]">
                        Complaint Information
                      </p>

                      <div className="mt-3 grid gap-2 sm:grid-cols-2">

                        <p className="text-[10.5px] text-[#756b78]">
                          Subject:{" "}
                          <span className="font-semibold text-[#49394d]">
                            {invoiceBill
                              .complaint
                              .subject ||
                              "N/A"}
                          </span>
                        </p>

                        <p className="text-[10.5px] text-[#756b78]">
                          Category:{" "}
                          <span className="font-semibold text-[#49394d]">
                            {invoiceBill
                              .complaint
                              .category ||
                              "N/A"}
                          </span>
                        </p>

                        <p className="text-[10.5px] text-[#756b78]">
                          Status:{" "}
                          <span className="font-semibold text-[#49394d]">
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
                  <div className="mt-6 rounded-none border border-[#f5eee2] bg-[#f7f3ed] p-4">

                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#9b7740]">
                      Payment Information
                    </p>

                    <div className="mt-2 grid gap-2 sm:grid-cols-2">

                      <p className="text-[10.5px] text-[#756b78]">
                        Paid Date:{" "}
                        <span className="font-semibold">
                          {invoiceBill.paidAt
                            ? new Date(
                                invoiceBill.paidAt
                              ).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </p>

                      <p className="text-[10.5px] text-[#756b78]">
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

                <div className="mt-8 border-t border-[#e2d9df] pt-4">

                  <p className="text-center text-[9.5px] font-medium text-[#8b778e]">
                    This is a computer-generated invoice.
                  </p>

                  <p className="mt-1 text-center text-[9.5px] font-medium text-[#8b778e]">
                    SmartSociety Management System
                  </p>

                </div>

              </div>

              {/* MODAL ACTIONS */}

              <div className="flex justify-end gap-3 border-t border-[#e2d9df] bg-[#f7f3ed] px-6 py-4">

                <button
                  type="button"
                  onClick={() =>
                    setInvoiceBill(
                      null
                    )
                  }
                  className="rounded-none border border-[#e2d9df] bg-white px-4 py-2.5 text-[11px] font-bold text-[#756b78] transition hover:bg-[#eee8ed]"
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
                  className="inline-flex items-center gap-2 rounded-none bg-[#9b7740] px-4 py-2.5 text-[11px] font-bold text-white transition hover:bg-[#9b7740]"
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
    <div className="flex items-center justify-between rounded-none border border-[#e2d9df] bg-white p-4">

      <div>

        <p className="text-[10px] font-bold uppercase tracking-wide text-[#8b778e]">
          {label}
        </p>

        <p className="mt-1 text-[20px] font-extrabold text-[#32143b]">
          {value}
        </p>

      </div>

      <div
        className={`flex h-9 w-9 items-center justify-center rounded-none ${iconClass}`}
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
      <span className="inline-flex items-center gap-1.5 rounded-none bg-[#f7f3ed] px-2.5 py-1 text-[10px] font-bold text-[#9b7740]">

        <CheckCircle2 size={12} />

        Paid

      </span>
    );
  }

  if (status === "Overdue") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-none bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-600">

        <AlertCircle size={12} />

        Overdue

      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-none bg-[#f7f3ed] px-2.5 py-1 text-[10px] font-bold text-[#9b7740]">

      <Clock3 size={12} />

      Pending

    </span>
  );
}

export default MaintenanceBills;