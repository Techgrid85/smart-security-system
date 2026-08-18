import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Building2,
  User,
  Home,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Search,
  RefreshCw,
  X,
  Loader2,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

const API_URL = "https://smart-society-backend-delta.vercel.app";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedBooking, setSelectedBooking] = useState(null);

  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [actionRemarks, setActionRemarks] = useState("");

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==========================================
  // FETCH BOOKINGS
  // ==========================================

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/admin/bookings`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch bookings"
        );
      }

      setBookings(result.data || []);
    } catch (error) {
      console.error("Fetch Bookings Error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // REFRESH
  // ==========================================

  const refreshBookings = async () => {
    try {
      setRefreshing(true);

      const response = await fetch(`${API_URL}/admin/bookings`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to refresh bookings"
        );
      }

      setBookings(result.data || []);
    } catch (error) {
      console.error("Refresh Bookings Error:", error);
      alert(error.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-[#f7f3ed] text-[#9b7740]";

      case "Approved":
        return "bg-[#f7f3ed] text-[#9b7740]";

      case "Rejected":
        return "bg-red-50 text-red-600";

      case "Cancelled":
        return "bg-[#eee8ed] text-[#756b78]";

      case "Completed":
        return "bg-[#f7f3ed] text-[#9b7740]";

      default:
        return "bg-[#eee8ed] text-[#756b78]";
    }
  };

  // ==========================================
  // ACTION MODAL
  // ==========================================

  const openActionModal = (booking, action) => {
    setSelectedBooking(booking);
    setActionType(action);
    setActionRemarks("");
    setShowActionModal(true);
  };

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const updateStatus = async () => {
    if (!selectedBooking) return;

    try {
      const response = await fetch(
        `${API_URL}/admin/bookings/${selectedBooking._id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: actionType,
            remarks: actionRemarks,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update booking"
        );
      }

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === selectedBooking._id
            ? result.data
            : booking
        )
      );

      setShowActionModal(false);
      setSelectedBooking(null);
      setActionRemarks("");

      alert(result.message);
    } catch (error) {
      console.error("Update Booking Error:", error);
      alert(error.message);
    }
  };

  // ==========================================
  // DELETE BOOKING
  // ==========================================

  const deleteBooking = async (booking) => {
    const confirmed = window.confirm(
      `Delete booking for ${booking.facility} by ${
        booking.resident?.name || "resident"
      }?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/admin/bookings/${booking._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete booking"
        );
      }

      setBookings((prev) =>
        prev.filter((item) => item._id !== booking._id)
      );

      alert(result.message);
    } catch (error) {
      console.error("Delete Booking Error:", error);
      alert(error.message);
    }
  };

  // ==========================================
  // FILTER
  // ==========================================

  const filteredBookings = bookings.filter((booking) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      booking.facility
        ?.toLowerCase()
        .includes(searchText) ||
      booking.resident?.name
        ?.toLowerCase()
        .includes(searchText) ||
      booking.flatNo
        ?.toLowerCase()
        .includes(searchText) ||
      booking.purpose
        ?.toLowerCase()
        .includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ==========================================
  // STATS
  // ==========================================

  const pendingCount = bookings.filter(
    (b) => b.status === "Pending"
  ).length;

  const approvedCount = bookings.filter(
    (b) => b.status === "Approved"
  ).length;

  const rejectedCount = bookings.filter(
    (b) => b.status === "Rejected"
  ).length;

  // ==========================================
  // UI
  // ==========================================

  return (
    <DashboardLayout role="admin">
      <div className="w-full">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7f3ed] text-[#63366f]">
              <CalendarDays size={20} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#32143b] sm:text-2xl">
                Facility Bookings
              </h1>

              <p className="mt-1 text-xs font-medium text-[#8b778e]">
                Manage resident facility booking requests.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={refreshBookings}
            disabled={refreshing}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#e2d9df] bg-white px-4 py-2.5 text-xs font-bold text-[#756b78] shadow-sm transition hover:bg-[#f7f3ed] disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={
                refreshing ? "animate-spin" : ""
              }
            />

            Refresh
          </button>

        </div>

        {/* ==========================================
            STATS
        ========================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <BookingStat
            title="Total Bookings"
            value={bookings.length}
            icon={<CalendarDays size={19} />}
            iconClass="bg-[#f7f3ed] text-[#63366f]"
          />

          <BookingStat
            title="Pending"
            value={pendingCount}
            icon={<Clock3 size={19} />}
            iconClass="bg-[#f7f3ed] text-[#9b7740]"
          />

          <BookingStat
            title="Approved"
            value={approvedCount}
            icon={<CheckCircle2 size={19} />}
            iconClass="bg-[#f7f3ed] text-[#9b7740]"
          />

          <BookingStat
            title="Rejected"
            value={rejectedCount}
            icon={<XCircle size={19} />}
            iconClass="bg-red-50 text-red-500"
          />

        </div>

        {/* ==========================================
            FILTERS
        ========================================== */}

        <div className="mb-6 rounded-2xl border border-[#e2d9df] bg-white p-5 shadow-sm">

          <div className="mb-4 flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f7f3ed] text-[#63366f]">
              <Search size={17} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-[#32143b]">
                Find Bookings
              </h2>

              <p className="mt-0.5 text-[11px] text-[#8b778e]">
                Search residents, flats, facilities or purposes.
              </p>
            </div>

          </div>

          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">

              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b778e]"
              />

              <input
                type="text"
                placeholder="Search resident, flat, facility or purpose..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full rounded-xl border border-[#e2d9df] bg-[#f7f3ed] py-3 pl-10 pr-4 text-xs font-medium text-[#49394d] outline-none transition placeholder:text-[#8b778e] focus:border-[#806d82] focus:bg-white"
              />

            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-xl border border-[#e2d9df] bg-[#f7f3ed] px-4 py-3 text-xs font-semibold text-[#756b78] outline-none focus:border-[#806d82] focus:bg-white"
            >
              <option value="All">
                All Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Approved">
                Approved
              </option>

              <option value="Rejected">
                Rejected
              </option>

              <option value="Cancelled">
                Cancelled
              </option>

              <option value="Completed">
                Completed
              </option>
            </select>

          </div>

        </div>

        {/* ==========================================
            BOOKINGS TABLE
        ========================================== */}

        <section className="overflow-hidden rounded-2xl border border-[#e2d9df] bg-white shadow-sm">

          {/* TABLE HEADER */}

          <div className="flex items-center justify-between border-b border-[#eee8ed] px-5 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f7f3ed] text-[#63366f]">
                <CalendarDays size={17} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#32143b]">
                  Booking Requests
                </h2>

                <p className="mt-0.5 text-[11px] text-[#8b778e]">
                  Review and manage facility reservations.
                </p>
              </div>

            </div>

            <span className="rounded-full bg-[#f7f3ed] px-3 py-1 text-[10px] font-bold text-[#63366f]">
              {filteredBookings.length} Bookings
            </span>

          </div>

          {/* TABLE */}

          {loading ? (
            <div className="flex items-center justify-center px-5 py-16">

              <div className="flex items-center gap-3">

                <Loader2
                  size={18}
                  className="animate-spin text-[#63366f]"
                />

                <span className="text-xs font-semibold text-[#756b78]">
                  Loading bookings...
                </span>

              </div>

            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="px-5 py-16 text-center">

              <CalendarDays
                size={34}
                className="mx-auto mb-3 text-[#bca9c0]"
              />

              <p className="text-xs font-bold text-[#756b78]">
                No facility bookings found
              </p>

              <p className="mt-1 text-[11px] text-[#8b778e]">
                Try changing your search or status filter.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1050px]">

                <thead>

                  <tr className="border-b border-[#eee8ed] bg-[#f7f3ed]">

                    <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-[#8b778e]">
                      Resident
                    </th>

                    <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-[#8b778e]">
                      Facility
                    </th>

                    <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-[#8b778e]">
                      Date
                    </th>

                    <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-[#8b778e]">
                      Time
                    </th>

                    <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-[#8b778e]">
                      Purpose
                    </th>

                    <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-[#8b778e]">
                      Status
                    </th>

                    <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider text-[#8b778e]">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="border-b border-[#eee8ed] transition hover:bg-[#f7f3ed]"
                    >

                      {/* RESIDENT */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f7f3ed] text-[#63366f]">
                            <User size={15} />
                          </div>

                          <div>

                            <p className="text-xs font-bold text-[#49394d]">
                              {booking.resident?.name ||
                                "Unknown"}
                            </p>

                            <p className="mt-0.5 text-[10px] font-medium text-[#8b778e]">
                              Flat {booking.flatNo || "-"}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* FACILITY */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <Building2
                            size={15}
                            className="text-[#806d82]"
                          />

                          <span className="text-xs font-semibold text-[#756b78]">
                            {booking.facility || "-"}
                          </span>

                        </div>

                      </td>

                      {/* DATE */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <CalendarDays
                            size={14}
                            className="text-[#8b778e]"
                          />

                          <span className="text-xs font-medium text-[#756b78]">
                            {formatDate(
                              booking.bookingDate
                            )}
                          </span>

                        </div>

                      </td>

                      {/* TIME */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <Clock3
                            size={14}
                            className="text-[#8b778e]"
                          />

                          <span className="text-xs font-medium text-[#756b78]">
                            {booking.startTime || "-"}{" "}
                            -{" "}
                            {booking.endTime || "-"}
                          </span>

                        </div>

                      </td>

                      {/* PURPOSE */}

                      <td className="max-w-[220px] px-5 py-4">

                        <p className="truncate text-xs font-medium text-[#756b78]">
                          {booking.purpose || "-"}
                        </p>

                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold ${getStatusClass(
                            booking.status
                          )}`}
                        >
                          {booking.status || "Unknown"}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          {/* VIEW */}

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedBooking(
                                booking
                              )
                            }
                            title="View booking"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2d9df] bg-white text-[#8b778e] transition hover:border-[#e2d9df] hover:bg-[#f7f3ed] hover:text-[#63366f]"
                          >
                            <Eye size={15} />
                          </button>

                          {/* APPROVE */}

                          {booking.status ===
                            "Pending" && (
                            <button
                              type="button"
                              onClick={() =>
                                openActionModal(
                                  booking,
                                  "Approved"
                                )
                              }
                              title="Approve"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#f5eee2] bg-[#f7f3ed] text-[#9b7740] transition hover:bg-[#f5eee2]"
                            >
                              <CheckCircle2
                                size={15}
                              />
                            </button>
                          )}

                          {/* REJECT */}

                          {booking.status ===
                            "Pending" && (
                            <button
                              type="button"
                              onClick={() =>
                                openActionModal(
                                  booking,
                                  "Rejected"
                                )
                              }
                              title="Reject"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100"
                            >
                              <XCircle size={15} />
                            </button>
                          )}

                          {/* DELETE */}

                          {booking.status !==
                            "Approved" &&
                            booking.status !==
                              "Completed" && (
                              <button
                                type="button"
                                onClick={() =>
                                  deleteBooking(
                                    booking
                                  )
                                }
                                title="Delete"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2d9df] bg-white text-[#8b778e] transition hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}

                        </div>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </section>

        {/* ==========================================
            DETAILS MODAL
        ========================================== */}

        {selectedBooking && !showActionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#32143b]/40 p-4 backdrop-blur-sm">

            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#e2d9df] bg-white shadow-2xl">

              {/* MODAL HEADER */}

              <div className="flex items-center justify-between border-b border-[#eee8ed] px-5 py-4">

                <div>
                  <h2 className="text-sm font-bold text-[#32143b]">
                    Booking Details
                  </h2>

                  <p className="mt-0.5 text-[11px] text-[#8b778e]">
                    Facility booking information.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedBooking(null)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8b778e] transition hover:bg-[#eee8ed] hover:text-[#49394d]"
                >
                  <X size={17} />
                </button>

              </div>

              {/* MODAL BODY */}

              <div className="space-y-5 p-5">

                <div className="rounded-xl bg-[#f7f3ed] p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#63366f]">
                      <Building2 size={20} />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#806d82]">
                        Facility
                      </p>

                      <p className="mt-1 text-sm font-bold text-[#49394d]">
                        {selectedBooking.facility ||
                          "-"}
                      </p>
                    </div>

                  </div>

                </div>

                <div className="grid grid-cols-2 gap-5">

                  <DetailItem
                    label="Resident"
                    value={
                      selectedBooking.resident?.name ||
                      "Unknown"
                    }
                  />

                  <DetailItem
                    label="Flat"
                    value={selectedBooking.flatNo}
                    icon={<Home size={13} />}
                  />

                  <DetailItem
                    label="Date"
                    value={formatDate(
                      selectedBooking.bookingDate
                    )}
                  />

                  <DetailItem
                    label="Time"
                    value={`${selectedBooking.startTime || "-"} - ${
                      selectedBooking.endTime || "-"
                    }`}
                  />

                </div>

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#8b778e]">
                    Purpose
                  </p>

                  <p className="mt-2 rounded-xl bg-[#f7f3ed] p-4 text-xs font-medium leading-6 text-[#756b78]">
                    {selectedBooking.purpose || "-"}
                  </p>

                </div>

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#8b778e]">
                    Status
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-[10px] font-bold ${getStatusClass(
                      selectedBooking.status
                    )}`}
                  >
                    {selectedBooking.status}
                  </span>

                </div>

                {selectedBooking.remarks && (
                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Admin Remarks
                    </p>

                    <p className="mt-2 rounded-xl bg-[#f7f3ed] p-4 text-xs leading-6 text-[#756b78]">
                      {selectedBooking.remarks}
                    </p>

                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* ==========================================
            APPROVE / REJECT MODAL
        ========================================== */}

        {showActionModal && selectedBooking && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#32143b]/40 p-4 backdrop-blur-sm">

            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#e2d9df] bg-white shadow-2xl">

              <div className="flex items-center justify-between border-b border-[#eee8ed] px-5 py-4">

                <div>

                  <h2 className="text-sm font-bold text-[#32143b]">
                    {actionType === "Approved"
                      ? "Approve Booking"
                      : "Reject Booking"}
                  </h2>

                  <p className="mt-1 text-[11px] text-[#8b778e]">
                    {selectedBooking.facility} • Flat{" "}
                    {selectedBooking.flatNo}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowActionModal(false)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8b778e] hover:bg-[#eee8ed] hover:text-[#49394d]"
                >
                  <X size={17} />
                </button>

              </div>

              <div className="space-y-5 p-5">

                <div>

                  <label className="mb-2 block text-xs font-bold text-[#756b78]">
                    Remarks
                  </label>

                  <textarea
                    value={actionRemarks}
                    onChange={(e) =>
                      setActionRemarks(
                        e.target.value
                      )
                    }
                    rows="4"
                    placeholder={
                      actionType === "Approved"
                        ? "Optional approval remarks..."
                        : "Reason for rejection..."
                    }
                    className="w-full resize-none rounded-xl border border-[#e2d9df] bg-[#f7f3ed] p-3 text-xs font-medium text-[#49394d] outline-none placeholder:text-[#8b778e] focus:border-[#806d82] focus:bg-white"
                  />

                </div>

                <div className="flex justify-end gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      setShowActionModal(false)
                    }
                    className="rounded-xl border border-[#e2d9df] bg-white px-4 py-2.5 text-xs font-bold text-[#756b78] transition hover:bg-[#f7f3ed]"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={updateStatus}
                    className={`rounded-xl px-4 py-2.5 text-xs font-bold text-white transition ${
                      actionType === "Approved"
                        ? "bg-[#9b7740] hover:bg-[#9b7740]"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {actionType === "Approved"
                      ? "Approve Booking"
                      : "Reject Booking"}
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default AdminBookings;


// =====================================================
// STAT CARD
// =====================================================

function BookingStat({
  title,
  value,
  icon,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-[#e2d9df] bg-white p-5 shadow-sm transition hover:shadow-md">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8b778e]">
            {title}
          </p>

          <p className="mt-2 text-2xl font-extrabold text-[#32143b]">
            {value}
          </p>

        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}


// =====================================================
// DETAIL ITEM
// =====================================================

function DetailItem({
  label,
  value,
  icon,
}) {
  return (
    <div>

      <p className="text-[10px] font-bold uppercase tracking-wide text-[#8b778e]">
        {label}
      </p>

      <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#49394d]">
        {icon}
        {value || "-"}
      </p>

    </div>
  );
}