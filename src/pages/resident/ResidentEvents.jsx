import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Eye,
  X,
  ArrowRight,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

const API_URL = "https://smart-society-backend-delta.vercel.app";

function ResidentEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // ==========================================
  // GET UPCOMING EVENTS
  // ==========================================
  const fetchEvents = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        return;
      }

      const response = await axios.get(
        `${API_URL}/resident/events`,
        {
          headers: getHeaders(),
        }
      );

      if (response.data.success) {
        setEvents(response.data.data || []);
      } else {
        toast.error(
          response.data.message ||
            "Failed to fetch events"
        );
      }
    } catch (error) {
      console.error("Events Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch events"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ==========================================
  // VIEW EVENT DETAILS
  // ==========================================
  const handleViewEvent = async (id) => {
    try {
      setDetailsLoading(true);

      const response = await axios.get(
        `${API_URL}/resident/events/${id}`,
        {
          headers: getHeaders(),
        }
      );

      if (response.data.success) {
        setSelectedEvent(response.data.data);
      } else {
        toast.error(
          response.data.message ||
            "Failed to fetch event details"
        );
      }
    } catch (error) {
      console.error("Event Details Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch event details"
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <DashboardLayout role="resident">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm font-medium text-[#756b78]">
            Loading events...
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
            Society Events
          </h1>

          <p className="mt-1 text-[11.5px] font-medium text-[#8b778e]">
            View upcoming events and activities in your society.
          </p>
        </div>

        {/* ================= EVENT COUNT ================= */}
        <div className="mb-6 rounded-none border border-[#e2d9df] bg-[#f7f3ed] p-5">
          <div className="flex items-center justify-between gap-4">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#9b7740]">
                Upcoming Events
              </p>

              <p className="mt-1 text-[26px] font-extrabold text-[#826331]">
                {events.length}
              </p>

              <p className="mt-1 text-[10.5px] font-medium text-[#9b7740]">
                Events currently scheduled
              </p>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-none bg-white text-[#9b7740]">
              <CalendarDays size={22} />
            </div>

          </div>
        </div>

        {/* ================= EVENTS ================= */}
        <section className="overflow-hidden rounded-none border border-[#e2d9df] bg-white">

          <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">

            <div>
              <h2 className="flex items-center gap-2 text-[13px] font-bold text-[#32143b]">
                <CalendarDays
                  size={16}
                  className="text-[#9b7740]"
                />
                Upcoming Society Events
              </h2>

              <p className="mt-1 text-[10px] text-[#8b778e]">
                Stay updated with society activities.
              </p>
            </div>

          </div>

          <div className="p-5">

            {events.length === 0 ? (
              <div className="flex min-h-[180px] items-center justify-center rounded-none border border-dashed border-[#e2d9df] bg-[#f7f3ed]">
                <div className="text-center">

                  <CalendarDays
                    size={28}
                    className="mx-auto mb-2 text-[#bca9c0]"
                  />

                  <p className="text-[11px] font-semibold text-[#756b78]">
                    No upcoming events
                  </p>

                  <p className="mt-1 text-[10px] text-[#8b778e]">
                    New society events will appear here.
                  </p>

                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                {events.map((event) => (
                  <div
                    key={event._id}
                    className="group overflow-hidden rounded-none border border-[#e2d9df] bg-white transition hover:border-[#d9be82] hover:shadow-sm"
                  >

                    {/* EVENT HEADER */}
                    <div className="flex items-center justify-between border-b border-[#eee8ed] bg-[#f7f3ed] px-4 py-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-none bg-[#f7f3ed] text-[#9b7740]">
                        <CalendarDays size={19} />
                      </div>

                      <span className="rounded-none bg-[#f7f3ed] px-2 py-1 text-[8.5px] font-bold text-[#9b7740]">
                        Upcoming
                      </span>

                    </div>

                    {/* EVENT CONTENT */}
                    <div className="p-4">

                      <h3 className="line-clamp-2 text-[12.5px] font-bold text-[#49394d]">
                        {event.title}
                      </h3>

                      <p className="mt-2 line-clamp-3 text-[10.5px] leading-5 text-[#756b78]">
                        {event.description}
                      </p>

                      <div className="mt-4 space-y-2">

                        <div className="flex items-center gap-2 text-[9.5px] font-semibold text-[#756b78]">
                          <Clock3
                            size={13}
                            className="shrink-0 text-[#9b7740]"
                          />

                          {event.eventDate
                            ? new Date(
                                event.eventDate
                              ).toLocaleString()
                            : "-"}
                        </div>

                        <div className="flex items-center gap-2 text-[9.5px] font-semibold text-[#756b78]">
                          <MapPin
                            size={13}
                            className="shrink-0 text-[#9b7740]"
                          />

                          <span className="truncate">
                            {event.location}
                          </span>
                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleViewEvent(event._id)
                        }
                        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-none border border-[#e2d9df] bg-[#f7f3ed] py-2.5 text-[10px] font-bold text-[#9b7740] transition hover:bg-[#f5eee2]"
                      >
                        <Eye size={13} />
                        View Details
                      </button>

                    </div>
                  </div>
                ))}

              </div>
            )}

          </div>
        </section>

        {/* ================= DETAILS MODAL ================= */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#32143b]/50 p-4">

            <div className="w-full max-w-md overflow-hidden rounded-none bg-white shadow-2xl">

              {/* HEADER */}
              <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-[#9b7740]">
                    Event Details
                  </p>

                  <h2 className="mt-1 text-[16px] font-extrabold text-[#32143b]">
                    {selectedEvent.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedEvent(null)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-none text-[#8b778e] transition hover:bg-[#eee8ed] hover:text-[#49394d]"
                >
                  <X size={17} />
                </button>

              </div>

              {/* DETAILS */}
              <div className="space-y-3 p-5">

                <EventDetail
                  icon={CalendarDays}
                  label="Event"
                  value={
                    selectedEvent.title || "-"
                  }
                />

                <EventDetail
                  icon={Clock3}
                  label="Date & Time"
                  value={
                    selectedEvent.eventDate
                      ? new Date(
                          selectedEvent.eventDate
                        ).toLocaleString()
                      : "-"
                  }
                />

                <EventDetail
                  icon={MapPin}
                  label="Location"
                  value={
                    selectedEvent.location || "-"
                  }
                />

                <div className="rounded-none bg-[#f7f3ed] px-3 py-3">

                  <p className="mb-1 text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                    Description
                  </p>

                  <p className="text-[10.5px] leading-5 text-[#756b78]">
                    {selectedEvent.description ||
                      "-"}
                  </p>

                </div>

              </div>

              {/* FOOTER */}
              <div className="border-t border-[#e2d9df] px-5 py-4">

                <button
                  type="button"
                  onClick={() =>
                    setSelectedEvent(null)
                  }
                  className="flex w-full items-center justify-center gap-1.5 rounded-none bg-[#32143b] py-2.5 text-[11px] font-bold text-white transition hover:bg-[#49394d]"
                >
                  Close
                  <ArrowRight size={13} />
                </button>

              </div>

            </div>

          </div>
        )}

        {/* ================= LOADING DETAILS ================= */}
        {detailsLoading && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#32143b]/30">
            <div className="rounded-none bg-white px-5 py-3 shadow-lg">
              <p className="text-[11px] font-semibold text-[#756b78]">
                Loading event details...
              </p>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

/* ================= EVENT DETAIL ================= */

function EventDetail({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-3 rounded-none bg-[#f7f3ed] px-3 py-2.5">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none bg-[#f7f3ed] text-[#9b7740]">
        <Icon size={14} />
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-semibold text-[#8b778e]">
          {label}
        </p>

        <p className="break-words text-[10.5px] font-bold text-[#49394d]">
          {value}
        </p>
      </div>

    </div>
  );
}

export default ResidentEvents;