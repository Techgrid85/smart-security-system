import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  Megaphone,
  ArrowLeft,
  CalendarDays,
  AlertTriangle,
  Info,
  ShieldAlert,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

function ResidentNotices() {
  const navigate = useNavigate();

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Please login again");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "https://smart-society-backend-delta.vercel.app/resident/notices",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setNotices(response.data.data || []);
        } else {
          toast.error(
            response.data.message || "Failed to load notices"
          );
        }
      } catch (error) {
        console.error("Notices Error:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load notices"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  if (loading) {
    return (
      <DashboardLayout role="resident">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm font-medium text-slate-500">
            Loading notices...
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
            className="mb-4 flex items-center gap-2 text-[11px] font-semibold text-slate-400 transition hover:text-emerald-500"
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
              <Megaphone size={21} />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-500">
                Community
              </p>

              <h1 className="text-[21px] font-extrabold tracking-tight text-slate-900">
                Society Notices
              </h1>

              <p className="mt-1 text-[11.5px] font-medium text-slate-400">
                Stay updated with the latest society announcements.
              </p>
            </div>
          </div>
        </div>

        {/* NOTICE COUNT */}
        <div className="mb-5 rounded-[14px] border border-slate-200 bg-white px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
            Available Notices
          </p>

          <p className="mt-1 text-[22px] font-extrabold text-slate-900">
            {notices.length}
          </p>
        </div>

        {/* NOTICES */}
        {notices.length > 0 ? (
          <div className="space-y-4">
            {notices.map((notice) => (
              <NoticeCard
                key={notice._id}
                notice={notice}
                onClick={() =>
                  navigate(`/resident/notices/${notice._id}`)
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </DashboardLayout>
  );
}

/* ================= NOTICE CARD ================= */

function NoticeCard({ notice, onClick }) {
  const priority = notice.priority || "Normal";

  const priorityConfig = {
    Normal: {
      icon: Info,
      bg: "bg-sky-50",
      iconColor: "text-sky-500",
      badge: "bg-slate-100 text-slate-600",
    },

    Important: {
      icon: AlertTriangle,
      bg: "bg-amber-50",
      iconColor: "text-amber-500",
      badge: "bg-amber-50 text-amber-600",
    },

    Urgent: {
      icon: ShieldAlert,
      bg: "bg-red-50",
      iconColor: "text-red-500",
      badge: "bg-red-50 text-red-600",
    },
  };

  const config =
    priorityConfig[priority] || priorityConfig.Normal;

  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-[16px] border border-slate-200 bg-white p-5 text-left transition hover:border-emerald-300 hover:shadow-sm"
    >
      <div className="flex gap-4">

        {/* ICON */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.bg} ${config.iconColor}`}
        >
          <Icon size={20} />
        </div>

        {/* CONTENT */}
        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-start justify-between gap-2">
            <h2 className="text-[13px] font-bold text-slate-900 group-hover:text-emerald-600">
              {notice.title}
            </h2>

            <span
              className={`rounded-full px-2 py-1 text-[8.5px] font-bold ${config.badge}`}
            >
              {priority}
            </span>
          </div>

          <p className="mt-2 text-[11px] leading-5 text-slate-500">
            {notice.description}
          </p>

          <div className="mt-3 flex items-center gap-1.5 text-[9.5px] font-semibold text-slate-400">
            <CalendarDays size={12} />

            {notice.createdAt
              ? new Date(
                  notice.createdAt
                ).toLocaleDateString()
              : "-"}
          </div>

        </div>
      </div>
    </button>
  );
}

/* ================= EMPTY STATE ================= */

function EmptyState() {
  return (
    <div className="flex min-h-[250px] flex-col items-center justify-center rounded-[16px] border border-dashed border-slate-200 bg-white px-5 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
        <Megaphone size={21} />
      </div>

      <h2 className="mt-4 text-[13px] font-bold text-slate-700">
        No Notices Available
      </h2>

      <p className="mt-1 max-w-sm text-[10.5px] leading-5 text-slate-400">
        There are currently no society announcements available.
      </p>
    </div>
  );
}

export default ResidentNotices;