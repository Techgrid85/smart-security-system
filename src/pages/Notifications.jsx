import { useEffect, useState } from "react";
import axios from "axios";
import { Bell, CheckCheck, Clock3, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/dashboard/DashboardLayout";

const API = "https://smart-society-backend-delta.vercel.app/notifications";
const authConfig = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

const relativeTime = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return new Date(date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};

export default function Notifications({ role }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API, authConfig());
      setNotifications(response.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadNotifications(); }, []);

  const markRead = async (notification) => {
    if (notification.isRead) return;
    try {
      await axios.patch(`${API}/${notification._id}/read`, {}, authConfig());
      setNotifications((items) => items.map((item) => item._id === notification._id ? { ...item, isRead: true } : item));
      window.dispatchEvent(new Event("notifications-updated"));
    } catch {
      toast.error("Could not mark notification as read");
    }
  };

  const markAllRead = async () => {
    try {
      setMarkingAll(true);
      await axios.patch(`${API}/read-all`, {}, authConfig());
      setNotifications((items) => items.map((item) => ({ ...item, isRead: true })));
      window.dispatchEvent(new Event("notifications-updated"));
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Could not update notifications");
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <DashboardLayout role={role}>
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-4 border-b border-[#e2d9df] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#9b7740]">{role} portal</p>
            <h1 className="mt-2 text-2xl font-extrabold text-[#32143b]">Notifications</h1>
            <p className="mt-1 text-sm text-[#8b778e]">Stay informed about activity relevant to your account.</p>
          </div>
          <button type="button" disabled={!unreadCount || markingAll} onClick={markAllRead} className="inline-flex items-center justify-center gap-2 bg-[#32143b] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#63366f] disabled:cursor-not-allowed disabled:opacity-45">
            {markingAll ? <LoaderCircle size={15} className="animate-spin" /> : <CheckCheck size={15} />}
            Mark all as read
          </button>
        </div>

        <section className="mt-6 overflow-hidden border border-[#e2d9df] bg-white">
          {loading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-sm text-[#8b778e]"><LoaderCircle size={18} className="animate-spin" /> Loading notifications…</div>
          ) : notifications.length ? (
            <div className="divide-y divide-[#eee8ed]">
              {notifications.map((notification) => (
                <button type="button" key={notification._id} onClick={() => markRead(notification)} className={`flex w-full gap-4 p-5 text-left transition hover:bg-[#fdfaf6] ${notification.isRead ? "bg-white" : "bg-[#fffaf0]"}`}>
                  <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${notification.isRead ? "bg-[#f1eaf3] text-[#63366f]" : "bg-[#f5e6bf] text-[#9b7740]"}`}><Bell size={16} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1"><strong className="text-sm text-[#32143b]">{notification.title}</strong>{!notification.isRead && <span className="rounded-full bg-[#9b7740] px-2 py-0.5 text-[9px] font-bold uppercase text-white">New</span>}</span>
                    <span className="mt-1 block text-sm leading-6 text-[#756b78]">{notification.message}</span>
                    <span className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-[#9c8b99]"><Clock3 size={12} /> {relativeTime(notification.createdAt)}{role === "admin" && notification.actor?.name ? ` · ${notification.actor.name} (${notification.actor.role})` : ""}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center"><Bell size={28} className="mx-auto text-[#d9be82]" /><h2 className="mt-4 font-bold text-[#32143b]">You’re all caught up</h2><p className="mt-1 text-sm text-[#8b778e]">New activity notifications will appear here.</p></div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
