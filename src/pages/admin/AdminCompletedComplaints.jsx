import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  User,
  Home,
  Wrench,
  CalendarDays,
  ReceiptText,
  X,
  Loader2,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

function AdminCompletedComplaints() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedComplaint, setSelectedComplaint] =
    useState(null);

  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [generating, setGenerating] = useState(false);

  // ==========================================
  // FETCH COMPLETED COMPLAINTS
  // ==========================================

  const fetchCompletedComplaints = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        navigate("/");
        return;
      }

      const response = await axios.get(
        "https://smart-society-backend-delta.vercel.app/admin/complaints/completed",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setComplaints(response.data.data || []);
      } else {
        toast.error(
          response.data.message ||
            "Failed to load completed complaints"
        );
      }
    } catch (error) {
      console.error(
        "Completed Complaints Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load completed complaints"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedComplaints();
  }, []);

  // ==========================================
  // OPEN BILL MODAL
  // ==========================================

  const openBillModal = (complaint) => {
    setSelectedComplaint(complaint);
    setAmount("");
    setDueDate("");
  };

  // ==========================================
  // CLOSE BILL MODAL
  // ==========================================

  const closeBillModal = () => {
    if (generating) return;

    setSelectedComplaint(null);
    setAmount("");
    setDueDate("");
  };

  // ==========================================
  // GENERATE COMPLAINT BILL
  // ==========================================

  const handleGenerateBill = async (e) => {
    e.preventDefault();

    if (!selectedComplaint) return;

    if (!amount || Number(amount) < 0) {
      toast.error("Enter a valid bill amount");
      return;
    }

    if (!dueDate) {
      toast.error("Please select a due date");
      return;
    }

    try {
      setGenerating(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        return;
      }

      const response = await axios.post(
        `https://smart-society-backend-delta.vercel.app/admin/complaints/${selectedComplaint._id}/generate-bill`,
        {
          amount: Number(amount),
          dueDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Complaint bill generated successfully"
        );

        closeBillModal();

        // Reload completed complaints
        await fetchCompletedComplaints();
      } else {
        toast.error(
          response.data.message ||
            "Failed to generate bill"
        );
      }
    } catch (error) {
      console.error(
        "Generate Complaint Bill Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to generate complaint bill"
      );
    } finally {
      setGenerating(false);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // CHECK BILL
  // ==========================================

  const hasBill = (complaint) => {
    return Boolean(complaint.bill);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex items-center gap-2 text-sm font-medium text-[#756b78]">
            <Loader2
              size={16}
              className="animate-spin"
            />
            Loading completed complaints...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <DashboardLayout role="admin">
      <div className="w-full min-w-0 max-w-full">

        {/* HEADER */}
        <div className="mb-6">

          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="mb-4 flex items-center gap-2 text-[11px] font-bold text-[#8b778e] transition hover:text-[#9b7740]"
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </button>

          <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#9b7740]">
            Administration Portal
          </p>

          <h1 className="text-[20px] font-extrabold tracking-tight text-[#32143b] md:text-[22px]">
            Completed Complaints
          </h1>

          <p className="mt-1 text-[11.5px] font-medium text-[#8b778e]">
            Review resolved complaints and generate maintenance bills.
          </p>

        </div>

        {/* SUMMARY */}
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

          <div className="rounded-[14px] border border-[#e2d9df] bg-white p-4">
            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f7f3ed] text-[#9b7740]">
                <CheckCircle2 size={17} />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                  Completed
                </p>

                <p className="mt-1 text-[18px] font-extrabold text-[#32143b]">
                  {complaints.length}
                </p>
              </div>

            </div>
          </div>

          <div className="rounded-[14px] border border-[#e2d9df] bg-white p-4">
            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f7f3ed] text-[#63366f]">
                <ReceiptText size={17} />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                  Bills Generated
                </p>

                <p className="mt-1 text-[18px] font-extrabold text-[#32143b]">
                  {complaints.filter(hasBill).length}
                </p>
              </div>

            </div>
          </div>

          <div className="rounded-[14px] border border-[#e2d9df] bg-white p-4">
            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f7f3ed] text-[#9b7740]">
                <ClipboardList size={17} />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                  Awaiting Billing
                </p>

                <p className="mt-1 text-[18px] font-extrabold text-[#32143b]">
                  {complaints.filter(
                    (complaint) => !hasBill(complaint)
                  ).length}
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* TABLE */}
        <section className="overflow-hidden rounded-[16px] border border-[#e2d9df] bg-white">

          {/* TABLE HEADER */}
          <div className="flex items-center gap-3 border-b border-[#e2d9df] px-5 py-4">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f7f3ed] text-[#9b7740]">
              <CheckCircle2 size={17} />
            </div>

            <div>
              <h2 className="text-[13px] font-bold text-[#32143b]">
                Resolved Staff Complaints
              </h2>

              <p className="mt-0.5 text-[9.5px] font-medium text-[#8b778e]">
                Completed complaints submitted by maintenance staff.
              </p>
            </div>

          </div>

          {complaints.length === 0 ? (

            /* EMPTY */
            <div className="flex min-h-[280px] flex-col items-center justify-center px-5 text-center">

              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#eee8ed] text-[#8b778e]">
                <ClipboardList size={22} />
              </div>

              <h3 className="text-[13px] font-bold text-[#49394d]">
                No completed complaints
              </h3>

              <p className="mt-1 max-w-sm text-[10px] font-medium text-[#8b778e]">
                Resolved complaints from maintenance staff will appear here.
              </p>

            </div>

          ) : (

            /* TABLE */
            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead>
                  <tr className="border-b border-[#eee8ed] bg-[#f7f3ed]/70">

                    <th className="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Complaint
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Resident
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Flat
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Category
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Staff
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Resolved
                    </th>

                    <th className="px-5 py-3 text-right text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-#eee8ed">

                  {complaints.map((complaint) => (

                    <tr
                      key={complaint._id}
                      className="transition hover:bg-[#f7f3ed]/50"
                    >

                      {/* COMPLAINT */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f7f3ed] text-[#9b7740]">
                            <Wrench size={15} />
                          </div>

                          <div className="min-w-0">

                            <p className="max-w-[180px] truncate text-[11px] font-bold text-[#49394d]">
                              {complaint.subject || "-"}
                            </p>

                            <p className="mt-0.5 max-w-[180px] truncate text-[9px] font-medium text-[#8b778e]">
                              {complaint.description || "-"}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* RESIDENT */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <User
                            size={14}
                            className="shrink-0 text-[#8b778e]"
                          />

                          <div>

                            <p className="text-[10.5px] font-bold text-[#49394d]">
                              {complaint.resident?.name || "-"}
                            </p>

                            <p className="mt-0.5 text-[9px] text-[#8b778e]">
                              {complaint.resident?.email || ""}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* FLAT */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <Home
                            size={14}
                            className="text-[#8b778e]"
                          />

                          <span className="text-[10.5px] font-bold text-[#49394d]">
                            {complaint.flatNo ||
                              complaint.resident?.flatNo ||
                              "-"}
                          </span>

                        </div>

                      </td>

                      {/* CATEGORY */}
                      <td className="px-5 py-4">

                        <span className="inline-flex rounded-full bg-[#eee8ed] px-2.5 py-1 text-[9px] font-bold text-[#756b78]">
                          {complaint.category || "Other"}
                        </span>

                      </td>

                      {/* STAFF */}
                      <td className="px-5 py-4">

                        <p className="text-[10.5px] font-bold text-[#49394d]">
                          {complaint.assignedStaff?.name || "-"}
                        </p>

                      </td>

                      {/* DATE */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <CalendarDays
                            size={13}
                            className="text-[#8b778e]"
                          />

                          <span className="text-[10px] font-semibold text-[#756b78]">
                            {formatDate(
                              complaint.updatedAt
                            )}
                          </span>

                        </div>

                      </td>

                      {/* ACTION */}
                      <td className="px-5 py-4 text-right">

                        {hasBill(complaint) ? (

                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f7f3ed] px-3 py-2 text-[9px] font-bold text-[#9b7740]">
                            <CheckCircle2 size={13} />
                            Bill Generated
                          </span>

                        ) : (

                          <button
                            type="button"
                            onClick={() =>
                              openBillModal(complaint)
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#9b7740] px-3 py-2 text-[9px] font-bold text-white shadow-lg shadow-#9b7740/20 transition hover:bg-[#9b7740]"
                          >
                            <ReceiptText size={13} />
                            Generate Bill
                          </button>

                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </div>

      {/* ==========================================
          GENERATE BILL MODAL
      ========================================== */}

      {selectedComplaint && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#32143b]/40 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md overflow-hidden rounded-[16px] border border-[#e2d9df] bg-white shadow-2xl">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f7f3ed] text-[#9b7740]">
                  <ReceiptText size={17} />
                </div>

                <div>
                  <h2 className="text-[13px] font-bold text-[#32143b]">
                    Generate Complaint Bill
                  </h2>

                  <p className="mt-0.5 text-[9.5px] text-[#8b778e]">
                    Create a maintenance bill for this completed work.
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={closeBillModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8b778e] transition hover:bg-[#eee8ed] hover:text-[#49394d]"
              >
                <X size={17} />
              </button>

            </div>

            {/* COMPLAINT INFO */}
            <div className="space-y-3 border-b border-[#eee8ed] bg-[#f7f3ed]/60 p-5">

              <div>
                <p className="text-[8.5px] font-bold uppercase tracking-wide text-[#8b778e]">
                  Complaint
                </p>

                <p className="mt-1 text-[11px] font-bold text-[#49394d]">
                  {selectedComplaint.subject}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <p className="text-[8.5px] font-bold uppercase tracking-wide text-[#8b778e]">
                    Resident
                  </p>

                  <p className="mt-1 text-[10.5px] font-semibold text-[#49394d]">
                    {selectedComplaint.resident?.name || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-[8.5px] font-bold uppercase tracking-wide text-[#8b778e]">
                    Flat
                  </p>

                  <p className="mt-1 text-[10.5px] font-semibold text-[#49394d]">
                    {selectedComplaint.flatNo ||
                      selectedComplaint.resident?.flatNo ||
                      "-"}
                  </p>
                </div>

              </div>

              <div>
                <p className="text-[8.5px] font-bold uppercase tracking-wide text-[#8b778e]">
                  Category
                </p>

                <span className="mt-1 inline-flex rounded-full bg-[#f7f3ed] px-2 py-1 text-[8.5px] font-bold text-[#9b7740]">
                  {selectedComplaint.category}
                </span>
              </div>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleGenerateBill}
              className="space-y-5 p-5"
            >

              {/* AMOUNT */}
              <div>

                <label className="mb-1.5 block text-[10px] font-bold text-[#756b78]">
                  Bill Amount
                </label>

                <div className="relative">

                  <p
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b778e]"
                  >
                    $
                  </p>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) =>
                      setAmount(e.target.value)
                    }
                    placeholder="Enter amount"
                    className="h-10 w-full rounded-lg border border-[#e2d9df] bg-white pl-9 pr-3 text-[11px] text-[#49394d] outline-none transition focus:border-[#bca16a]"
                    required
                  />

                </div>

              </div>

              {/* DUE DATE */}
              <div>

                <label className="mb-1.5 block text-[10px] font-bold text-[#756b78]">
                  Due Date
                </label>

                <div className="relative">

                  <CalendarDays
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b778e]"
                  />

                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) =>
                      setDueDate(e.target.value)
                    }
                    className="h-10 w-full rounded-lg border border-[#e2d9df] bg-white pl-9 pr-3 text-[11px] text-[#49394d] outline-none transition focus:border-[#bca16a]"
                    required
                  />

                </div>

              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-2 border-t border-[#eee8ed] pt-5">

                <button
                  type="button"
                  onClick={closeBillModal}
                  disabled={generating}
                  className="rounded-lg border border-[#e2d9df] px-4 py-2.5 text-[10px] font-bold text-[#756b78] transition hover:bg-[#f7f3ed] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={generating}
                  className="flex items-center gap-2 rounded-lg bg-[#9b7740] px-4 py-2.5 text-[10px] font-bold text-white shadow-lg shadow-#9b7740/20 transition hover:bg-[#9b7740] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {generating ? (
                    <>
                      <Loader2
                        size={14}
                        className="animate-spin"
                      />
                      Generating...
                    </>
                  ) : (
                    <>
                      <ReceiptText size={14} />
                      Generate Bill
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </DashboardLayout>
  );
}

export default AdminCompletedComplaints;