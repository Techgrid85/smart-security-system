import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  CalendarDays,
  ArrowLeft,
  Plus,
  Clock3,
  Building2,
  X,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

function FacilityBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    facility: "",
    bookingDate: "",
    startTime: "",
    endTime: "",
    purpose: "",
  });

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        return;
      }

      const response = await axios.get(
        "https://smart-society-backend-delta.vercel.app/resident/bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setBookings(response.data.data || []);
      } else {
        toast.error(
          response.data.message || "Failed to load bookings"
        );
      }
    } catch (error) {
      console.error("Bookings Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load facility bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://smart-society-backend-delta.vercel.app/resident/bookings",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Booking request submitted"
        );

        setFormData({
          facility: "",
          bookingDate: "",
          startTime: "",
          endTime: "",
          purpose: "",
        });

        setShowForm(false);

        fetchBookings();
      } else {
        toast.error(
          response.data.message ||
            "Failed to create booking"
        );
      }
    } catch (error) {
      console.error("Create Booking Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create booking"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return "bg-[#f7f3ed] text-[#9b7740]";

      case "Rejected":
        return "bg-red-50 text-red-600";

      case "Cancelled":
        return "bg-[#eee8ed] text-[#756b78]";

      case "Completed":
        return "bg-[#f7f3ed] text-[#9b7740]";

      default:
        return "bg-[#f7f3ed] text-[#9b7740]";
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="resident">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm font-medium text-[#756b78]">
            Loading bookings...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="resident">
      <div className="w-full min-w-0 max-w-full">

        {/* HEADER */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate("/resident")}
            className="mb-4 flex items-center gap-2 text-[11px] font-bold text-[#8b778e] transition hover:text-[#9b7740]"
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </button>

          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#9b7740]">
                Resident Portal
              </p>

              <h1 className="text-[20px] font-extrabold tracking-tight text-[#32143b] md:text-[22px]">
                Facility Booking
              </h1>

              <p className="mt-1 text-[11.5px] font-medium text-[#8b778e]">
                Book society facilities for your upcoming activities.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 rounded-[10px] bg-[#9b7740] px-4 py-2.5 text-[10.5px] font-bold text-white shadow-lg shadow-#9b7740/20 transition hover:bg-[#9b7740]"
            >
              <Plus size={15} />
              New Booking
            </button>
          </div>
        </div>

        {/* BOOKINGS */}
        <section className="overflow-hidden rounded-[16px] border border-[#e2d9df] bg-white">

          <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">
            <h2 className="flex items-center gap-2 text-[13px] font-bold text-[#32143b]">
              <CalendarDays
                size={16}
                className="text-[#9b7740]"
              />
              My Bookings
            </h2>

            <span className="rounded-full bg-[#eee8ed] px-2.5 py-1 text-[9px] font-bold text-[#756b78]">
              {bookings.length}{" "}
              {bookings.length === 1
                ? "Booking"
                : "Bookings"}
            </span>
          </div>

          <div className="space-y-3 p-5">

            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="rounded-[13px] border border-[#e2d9df] bg-[#f7f3ed] p-4"
                >
                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#f7f3ed] text-[#9b7740]">
                      <Building2 size={18} />
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="text-[12px] font-bold text-[#49394d]">
                          {booking.facility}
                        </h3>

                        <span
                          className={`rounded-full px-2 py-1 text-[8.5px] font-bold ${getStatusStyle(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <p className="mt-2 text-[10.5px] text-[#756b78]">
                        {booking.purpose}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-3 text-[9.5px] font-semibold text-[#8b778e]">

                        <span className="flex items-center gap-1">
                          <CalendarDays size={12} />

                          {booking.bookingDate
                            ? new Date(
                                booking.bookingDate
                              ).toLocaleDateString()
                            : "-"}
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock3 size={12} />

                          {booking.startTime} -{" "}
                          {booking.endTime}
                        </span>

                      </div>

                      {booking.remarks && (
                        <div className="mt-3 rounded-lg bg-white px-3 py-2">
                          <p className="text-[9px] font-bold text-[#8b778e]">
                            Remarks
                          </p>

                          <p className="mt-1 text-[10px] text-[#756b78]">
                            {booking.remarks}
                          </p>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[13px] border border-dashed border-[#e2d9df] bg-[#f7f3ed] px-5 text-center">

                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f7f3ed] text-[#9b7740]">
                  <CalendarDays size={21} />
                </div>

                <p className="text-[12px] font-bold text-[#49394d]">
                  No bookings yet
                </p>

                <p className="mt-1 text-[10px] font-medium text-[#8b778e]">
                  Create your first facility booking.
                </p>

                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="mt-4 flex items-center gap-1.5 rounded-lg bg-[#9b7740] px-3 py-2 text-[10px] font-bold text-white"
                >
                  <Plus size={13} />
                  Create Booking
                </button>

              </div>
            )}

          </div>
        </section>

        {/* FORM MODAL */}
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#210c28]/50 p-4">

            <div className="w-full max-w-lg overflow-hidden rounded-[16px] bg-white shadow-2xl">

              {/* MODAL HEADER */}
              <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">

                <div>
                  <h2 className="text-[14px] font-bold text-[#32143b]">
                    New Facility Booking
                  </h2>

                  <p className="mt-1 text-[10px] text-[#8b778e]">
                    Submit a request to book a society facility.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8b778e] hover:bg-[#eee8ed] hover:text-[#49394d]"
                >
                  <X size={17} />
                </button>

              </div>

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="space-y-4 p-5"
              >

                {/* FACILITY */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-[#756b78]">
                    Facility
                  </label>

                  <select
                    name="facility"
                    value={formData.facility}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-[#e2d9df] bg-white px-3 text-[11px] text-[#49394d] outline-none focus:border-[#bca16a]"
                  >
                    <option value="">
                      Select facility
                    </option>

                    <option value="Community Hall">
                      Community Hall
                    </option>

                    <option value="Swimming Pool">
                      Swimming Pool
                    </option>

                    <option value="Gym">
                      Gym
                    </option>

                    <option value="Tennis Court">
                      Tennis Court
                    </option>

                    <option value="Party Area">
                      Party Area
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                {/* DATE */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-[#756b78]">
                    Booking Date
                  </label>

                  <input
                    type="date"
                    name="bookingDate"
                    value={formData.bookingDate}
                    onChange={handleChange}
                    min={new Date()
                      .toISOString()
                      .split("T")[0]}
                    className="h-10 w-full rounded-lg border border-[#e2d9df] px-3 text-[11px] text-[#49394d] outline-none focus:border-[#bca16a]"
                  />
                </div>

                {/* TIME */}
                <div className="grid grid-cols-2 gap-3">

                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold text-[#756b78]">
                      Start Time
                    </label>

                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className="h-10 w-full rounded-lg border border-[#e2d9df] px-3 text-[11px] text-[#49394d] outline-none focus:border-[#bca16a]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold text-[#756b78]">
                      End Time
                    </label>

                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      className="h-10 w-full rounded-lg border border-[#e2d9df] px-3 text-[11px] text-[#49394d] outline-none focus:border-[#bca16a]"
                    />
                  </div>

                </div>

                {/* PURPOSE */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-[#756b78]">
                    Purpose
                  </label>

                  <textarea
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Why do you want to book this facility?"
                    className="w-full resize-none rounded-lg border border-[#e2d9df] px-3 py-2.5 text-[11px] text-[#49394d] outline-none focus:border-[#bca16a]"
                  />
                </div>

                {/* BUTTONS */}
                <div className="flex justify-end gap-2 pt-2">

                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-lg border border-[#e2d9df] px-4 py-2.5 text-[10.5px] font-bold text-[#756b78] hover:bg-[#f7f3ed]"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-[#9b7740] px-4 py-2.5 text-[10.5px] font-bold text-white transition hover:bg-[#9b7740] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting
                      ? "Submitting..."
                      : "Submit Booking"}
                  </button>

                </div>

              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default FacilityBookings;