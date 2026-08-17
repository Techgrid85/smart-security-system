import { useEffect, useState } from "react";
import {
  Bell,
  Plus,
  Search,
  RefreshCw,
  Loader2,
  FileText,
  AlertCircle,
  AlertTriangle,
  Info,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  User,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

function AdminNotices() {
  const [notices, setNotices] = useState([]);

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Normal",
  });

  // ==========================================
  // TOKEN
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==========================================
  // FETCH ALL NOTICES
  // ==========================================

  const fetchNotices = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(
        "https://smart-society-backend-delta.vercel.app/admin/notices",
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load notices"
        );
      }

      setNotices(result.data || []);
    } catch (error) {
      console.error("Fetch Notices Error:", error);
      setError(error.message || "Failed to load notices");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // ==========================================
  // OPEN CREATE MODAL
  // ==========================================

  const openCreateModal = () => {
    setEditingNotice(null);

    setFormData({
      title: "",
      description: "",
      priority: "Normal",
    });

    setShowModal(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (notice) => {
    setEditingNotice(notice);

    setFormData({
      title: notice.title || "",
      description: notice.description || "",
      priority: notice.priority || "Normal",
    });

    setShowModal(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);
    setEditingNotice(null);

    setFormData({
      title: "",
      description: "",
      priority: "Normal",
    });
  };

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // CREATE / UPDATE NOTICE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter a notice title");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please enter a notice description");
      return;
    }

    try {
      setSubmitting(true);

      const isEditing = Boolean(editingNotice);

      const url = isEditing
        ? `https://smart-society-backend-delta.vercel.app/admin/notices/${editingNotice._id}`
        : "https://smart-society-backend-delta.vercel.app/admin/notices";

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },

        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          priority: formData.priority,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Failed to ${
              isEditing ? "update" : "create"
            } notice`
        );
      }

      if (isEditing) {
        setNotices((prev) =>
          prev.map((notice) =>
            notice._id === editingNotice._id
              ? result.data
              : notice
          )
        );
      } else {
        setNotices((prev) => [
          result.data,
          ...prev,
        ]);
      }

      closeModal();
    } catch (error) {
      console.error("Save Notice Error:", error);
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // DELETE NOTICE
  // ==========================================

  const deleteNotice = async (notice) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${notice.title}"?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `https://smart-society-backend-delta.vercel.app/admin/notices/${notice._id}`,
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
          result.message || "Failed to delete notice"
        );
      }

      setNotices((prev) =>
        prev.filter(
          (item) => item._id !== notice._id
        )
      );
    } catch (error) {
      console.error("Delete Notice Error:", error);
      alert(error.message);
    }
  };

  // ==========================================
  // FILTER NOTICES
  // ==========================================

  const filteredNotices = notices.filter((notice) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      notice.title?.toLowerCase().includes(searchText) ||
      notice.description
        ?.toLowerCase()
        .includes(searchText);

    const matchesPriority =
      priorityFilter === "All" ||
      notice.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  // ==========================================
  // COUNTS
  // ==========================================

  const totalNotices = notices.length;

  const normalCount = notices.filter(
    (notice) => notice.priority === "Normal"
  ).length;

  const importantCount = notices.filter(
    (notice) => notice.priority === "Important"
  ).length;

  const urgentCount = notices.filter(
    (notice) => notice.priority === "Urgent"
  ).length;

  return (
    <DashboardLayout role="admin">
      <div className="w-full">

        {/* ================= HEADER ================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

          <div>
            <h1 className="flex items-center gap-2 text-[22px] font-extrabold text-slate-900">
              <Bell
                size={23}
                className="text-emerald-500"
              />
              Notices
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-slate-400">
              Create and manage society announcements and notices.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">

            <button
              type="button"
              onClick={() => fetchNotices(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw
                size={14}
                className={
                  refreshing ? "animate-spin" : ""
                }
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-[11px] font-bold text-white transition hover:bg-emerald-600"
            >
              <Plus size={15} />
              Create Notice
            </button>

          </div>

        </div>

        {/* ================= STATS ================= */}

        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">

          <StatCard
            icon={<FileText size={17} />}
            label="Total Notices"
            value={totalNotices}
            iconClass="bg-sky-50 text-sky-500"
          />

          <StatCard
            icon={<Info size={17} />}
            label="Normal"
            value={normalCount}
            iconClass="bg-slate-100 text-slate-500"
          />

          <StatCard
            icon={<AlertCircle size={17} />}
            label="Important"
            value={importantCount}
            iconClass="bg-amber-50 text-amber-500"
          />

          <StatCard
            icon={<AlertTriangle size={17} />}
            label="Urgent"
            value={urgentCount}
            iconClass="bg-red-50 text-red-500"
          />

        </div>

        {/* ================= FILTERS ================= */}

        <div className="mb-5 rounded-[16px] border border-slate-200 bg-white p-4">

          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">

              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search notices by title or description..."
                className="w-full rounded-[10px] border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-[12px] font-medium text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white"
              />

            </div>

            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value)
              }
              className="rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-2.5 text-[12px] font-bold text-slate-600 outline-none focus:border-emerald-400"
            >
              <option value="All">
                All Priorities
              </option>

              <option value="Normal">
                Normal
              </option>

              <option value="Important">
                Important
              </option>

              <option value="Urgent">
                Urgent
              </option>
            </select>

          </div>

        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-[12px] border border-red-200 bg-red-50 px-4 py-3">

            <p className="text-[12px] font-medium text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => fetchNotices()}
              className="shrink-0 text-[11px] font-bold text-red-600 hover:underline"
            >
              Retry
            </button>

          </div>
        )}

        {/* ================= NOTICES TABLE ================= */}

        <section className="overflow-hidden rounded-[16px] border border-slate-200 bg-white">

          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                <Bell size={17} />
              </div>

              <div>
                <h2 className="text-[13px] font-bold text-slate-900">
                  All Notices
                </h2>

                <p className="mt-0.5 text-[10.5px] font-medium text-slate-400">
                  Manage announcements published for residents.
                </p>
              </div>

            </div>

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
              {filteredNotices.length} Notices
            </span>

          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 px-5 py-16">

              <Loader2
                size={19}
                className="animate-spin text-emerald-500"
              />

              <span className="text-[11px] font-bold text-slate-500">
                Loading notices...
              </span>

            </div>
          ) : filteredNotices.length > 0 ? (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px] border-collapse">

                <thead>
                  <tr className="bg-slate-50">

                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Notice
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Priority
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Created By
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Date
                    </th>

                    <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredNotices.map((notice) => (
                    <tr
                      key={notice._id}
                      className="border-t border-slate-200 transition hover:bg-slate-50"
                    >

                      {/* NOTICE */}

                      <td className="max-w-[420px] px-5 py-4">

                        <div className="flex items-start gap-3">

                          <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${getPriorityIconClass(
                            notice.priority
                          )}`}>
                            <Bell size={14} />
                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-[12px] font-bold text-slate-800">
                              {notice.title}
                            </p>

                            <p className="mt-1 line-clamp-2 text-[10.5px] font-medium leading-5 text-slate-400">
                              {notice.description}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* PRIORITY */}

                      <td className="px-4 py-4">
                        <PriorityBadge
                          priority={notice.priority}
                        />
                      </td>

                      {/* CREATED BY */}

                      <td className="px-4 py-4">

                        <div className="flex items-center gap-2">

                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                            <User size={13} />
                          </div>

                          <span className="text-[11px] font-semibold text-slate-600">
                            {notice.createdBy?.name ||
                              "Admin"}
                          </span>

                        </div>

                      </td>

                      {/* DATE */}

                      <td className="px-4 py-4">

                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">

                          <CalendarDays
                            size={13}
                            className="text-slate-400"
                          />

                          {formatDate(
                            notice.createdAt
                          )}

                        </div>

                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(notice)
                            }
                            title="Edit Notice"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteNotice(notice)
                            }
                            title="Delete Notice"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          ) : (
            <div className="px-5 py-16 text-center">

              <Bell
                size={32}
                className="mx-auto mb-3 text-slate-300"
              />

              <p className="text-[12px] font-bold text-slate-600">
                No notices found
              </p>

              <p className="mt-1 text-[10.5px] font-medium text-slate-400">
                Create a new notice or try changing your filters.
              </p>

              {!search &&
                priorityFilter === "All" && (
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-[11px] font-bold text-white hover:bg-emerald-600"
                  >
                    <Plus size={14} />
                    Create First Notice
                  </button>
                )}

            </div>
          )}

        </section>

        {/* ================= CREATE / EDIT MODAL ================= */}

        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">

            <div className="w-full max-w-[560px] overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-2xl">

              {/* MODAL HEADER */}

              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                    {editingNotice ? (
                      <Pencil size={17} />
                    ) : (
                      <Plus size={18} />
                    )}
                  </div>

                  <div>
                    <h2 className="text-[14px] font-bold text-slate-900">
                      {editingNotice
                        ? "Edit Notice"
                        : "Create Notice"}
                    </h2>

                    <p className="mt-0.5 text-[10.5px] font-medium text-slate-400">
                      {editingNotice
                        ? "Update the notice information."
                        : "Publish an announcement for residents."}
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                >
                  <X size={17} />
                </button>

              </div>

              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="p-5"
              >

                <div className="space-y-4">

                  {/* TITLE */}

                  <div>

                    <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
                      Notice Title
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      maxLength={150}
                      placeholder="Enter notice title..."
                      className="w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-[12px] font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
                    />

                  </div>

                  {/* PRIORITY */}

                  <div>

                    <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
                      Priority
                    </label>

                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-[12px] font-bold text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white"
                    >
                      <option value="Normal">
                        Normal
                      </option>

                      <option value="Important">
                        Important
                      </option>

                      <option value="Urgent">
                        Urgent
                      </option>
                    </select>

                  </div>

                  {/* DESCRIPTION */}

                  <div>

                    <div className="mb-1.5 flex items-center justify-between">

                      <label className="text-[11px] font-bold text-slate-600">
                        Description
                      </label>

                      <span className="text-[9.5px] font-medium text-slate-400">
                        {formData.description.length}/2000
                      </span>

                    </div>

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      maxLength={2000}
                      rows={6}
                      placeholder="Write the notice details..."
                      className="w-full resize-none rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-3 text-[12px] font-medium leading-5 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
                    />

                  </div>

                </div>

                {/* MODAL ACTIONS */}

                <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">

                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={submitting}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-[11px] font-bold text-white transition hover:bg-emerald-600 disabled:opacity-60"
                  >

                    {submitting && (
                      <Loader2
                        size={14}
                        className="animate-spin"
                      />
                    )}

                    {editingNotice
                      ? "Save Changes"
                      : "Publish Notice"}

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
// PRIORITY BADGE
// ==========================================

function PriorityBadge({ priority }) {
  if (priority === "Urgent") {
    return (
      <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-600">
        Urgent
      </span>
    );
  }

  if (priority === "Important") {
    return (
      <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-600">
        Important
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
      Normal
    </span>
  );
}


// ==========================================
// PRIORITY ICON CLASS
// ==========================================

function getPriorityIconClass(priority) {
  if (priority === "Urgent") {
    return "bg-red-50 text-red-500";
  }

  if (priority === "Important") {
    return "bg-amber-50 text-amber-500";
  }

  return "bg-sky-50 text-sky-500";
}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

export default AdminNotices;