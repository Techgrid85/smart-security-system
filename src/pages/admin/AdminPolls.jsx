import { useEffect, useState } from "react";
import {
  Vote,
  Plus,
  Trash2,
  Pencil,
  X,
  Clock,
  CheckCircle2,
  FileText,
  Loader2,
  RefreshCw,
  CalendarDays,
  Users,
  CircleDot,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

const initialForm = {
  question: "",
  description: "",
  options: ["", ""],
  startDate: "",
  endDate: "",
  status: "Active",
};

function AdminPolls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingPoll, setEditingPoll] = useState(null);

  const [formData, setFormData] = useState(initialForm);

  // ==========================================
  // TOKEN
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==========================================
  // FETCH POLLS
  // ==========================================

  const fetchPolls = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://smart-society-backend-delta.vercel.app/admin/polls",
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load polls"
        );
      }

      setPolls(result.data || []);
    } catch (error) {
      console.error("Fetch Polls Error:", error);

      setError(
        error.message || "Failed to load polls"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  // ==========================================
  // OPEN CREATE MODAL
  // ==========================================

  const openCreateModal = () => {
    setEditingPoll(null);
    setFormData(initialForm);
    setShowModal(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (poll) => {
    setEditingPoll(poll);

    setFormData({
      question: poll.question || "",
      description: poll.description || "",

      options:
        poll.options?.map((option) => option.text) ||
        ["", ""],

      startDate: poll.startDate
        ? new Date(poll.startDate)
            .toISOString()
            .slice(0, 10)
        : "",

      endDate: poll.endDate
        ? new Date(poll.endDate)
            .toISOString()
            .slice(0, 10)
        : "",

      status: poll.status || "Active",
    });

    setShowModal(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);
    setEditingPoll(null);
    setFormData(initialForm);
  };

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // OPTION CHANGE
  // ==========================================

  const handleOptionChange = (index, value) => {
    setFormData((prev) => {
      const updatedOptions = [...prev.options];

      updatedOptions[index] = value;

      return {
        ...prev,
        options: updatedOptions,
      };
    });
  };

  // ==========================================
  // ADD OPTION
  // ==========================================

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  // ==========================================
  // REMOVE OPTION
  // ==========================================

  const removeOption = (index) => {
    if (formData.options.length <= 2) {
      alert("A poll must have at least 2 options");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter(
        (_, optionIndex) => optionIndex !== index
      ),
    }));
  };

  // ==========================================
  // CREATE / UPDATE POLL
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validOptions = formData.options
      .map((option) => option.trim())
      .filter(Boolean);

    if (validOptions.length < 2) {
      alert("Please enter at least 2 valid options");
      return;
    }

    const payload = {
      question: formData.question.trim(),
      description: formData.description.trim(),
      options: validOptions,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
    };

    try {
      setSubmitting(true);

      const url = editingPoll
        ? `https://smart-society-backend-delta.vercel.app/admin/polls/${editingPoll._id}`
        : "https://smart-society-backend-delta.vercel.app/admin/polls";

      const method = editingPoll ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to save poll"
        );
      }

      closeModal();
      fetchPolls();
    } catch (error) {
      console.error("Save Poll Error:", error);

      alert(
        error.message || "Failed to save poll"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // UPDATE POLL STATUS
  // ==========================================

  const changeStatus = async (pollId, status) => {
    try {
      const response = await fetch(
        `https://smart-society-backend-delta.vercel.app/admin/polls/${pollId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update poll status"
        );
      }

      fetchPolls();
    } catch (error) {
      console.error("Update Poll Status Error:", error);

      alert(
        error.message ||
          "Failed to update poll status"
      );
    }
  };

  // ==========================================
  // DELETE POLL
  // ==========================================

  const deletePoll = async (pollId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this poll?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://smart-society-backend-delta.vercel.app/admin/polls/${pollId}`,
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
          result.message || "Failed to delete poll"
        );
      }

      fetchPolls();
    } catch (error) {
      console.error("Delete Poll Error:", error);

      alert(
        error.message || "Failed to delete poll"
      );
    }
  };

  // ==========================================
  // TOTAL VOTES
  // ==========================================

  const getTotalVotes = (poll) => {
    return (
      poll.options?.reduce(
        (total, option) =>
          total + (option.votes || 0),
        0
      ) || 0
    );
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString();
  };

  // ==========================================
  // COUNTS
  // ==========================================

  const totalPolls = polls.length;

  const activePolls = polls.filter(
    (poll) => poll.status === "Active"
  ).length;

  const draftPolls = polls.filter(
    (poll) => poll.status === "Draft"
  ).length;

  const closedPolls = polls.filter(
    (poll) => poll.status === "Closed"
  ).length;

  return (
    <DashboardLayout role="admin">
      <div className="w-full">

        {/* ================= HEADER ================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

          <div>
            <h1 className="flex items-center gap-2 text-[22px] font-extrabold text-[#32143b]">
              <Vote
                size={23}
                className="text-[#9b7740]"
              />
              Poll Management
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-[#8b778e]">
              Create and manage society polls and voting.
            </p>
          </div>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={fetchPolls}
              className="inline-flex items-center justify-center gap-2 rounded-none border border-[#e2d9df] bg-white px-4 py-2.5 text-[11px] font-bold text-[#756b78] transition hover:bg-[#f7f3ed]"
            >
              <RefreshCw size={14} />
              Refresh
            </button>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-none bg-[#9b7740] px-4 py-2.5 text-[11px] font-bold text-white transition hover:bg-[#9b7740]"
            >
              <Plus size={15} />
              Create Poll
            </button>

          </div>

        </div>

        {/* ================= STATS ================= */}

        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">

          <StatCard
            icon={<Vote size={17} />}
            label="Total Polls"
            value={totalPolls}
            iconClass="bg-[#f7f3ed] text-[#9b7740]"
          />

          <StatCard
            icon={<CheckCircle2 size={17} />}
            label="Active Polls"
            value={activePolls}
            iconClass="bg-[#f7f3ed] text-[#9b7740]"
          />

          <StatCard
            icon={<FileText size={17} />}
            label="Draft Polls"
            value={draftPolls}
            iconClass="bg-[#f7f3ed] text-[#9b7740]"
          />

          <StatCard
            icon={<Clock size={17} />}
            label="Closed Polls"
            value={closedPolls}
            iconClass="bg-[#eee8ed] text-[#756b78]"
          />

        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mb-5 flex items-center justify-between rounded-none border border-red-200 bg-red-50 px-4 py-3">

            <p className="text-[12px] font-medium text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchPolls}
              className="text-[11px] font-bold text-red-600 hover:underline"
            >
              Retry
            </button>

          </div>
        )}

        {/* ================= POLLS ================= */}

        <section className="overflow-hidden rounded-none border border-[#e2d9df] bg-white">

          <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-none bg-[#f7f3ed] text-[#9b7740]">
                <Vote size={17} />
              </div>

              <div>
                <h2 className="text-[13px] font-bold text-[#32143b]">
                  Society Polls
                </h2>

                <p className="mt-0.5 text-[10.5px] font-medium text-[#8b778e]">
                  Manage active, draft and closed polls.
                </p>
              </div>

            </div>

            <span className="rounded-none bg-[#f7f3ed] px-2.5 py-1 text-[10px] font-bold text-[#9b7740]">
              {polls.length} Polls
            </span>

          </div>

          {!loading && polls.length > 0 ? (

            <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-2">

              {polls.map((poll) => {
                const totalVotes = getTotalVotes(poll);

                return (
                  <div
                    key={poll._id}
                    className="rounded-none border border-[#e2d9df] bg-[#f7f3ed] p-4 transition hover:border-[#e2d9df]"
                  >

                    {/* POLL TOP */}

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">

                        <div className="flex items-start gap-2">

                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-none bg-[#f7f3ed] text-[#9b7740]">
                            <CircleDot size={15} />
                          </div>

                          <div className="min-w-0">

                            <h3 className="text-[12px] font-bold text-[#49394d]">
                              {poll.question}
                            </h3>

                            {poll.description && (
                              <p className="mt-1 text-[10px] font-medium leading-relaxed text-[#8b778e]">
                                {poll.description}
                              </p>
                            )}

                          </div>

                        </div>

                      </div>

                      <PollStatusBadge
                        status={poll.status}
                      />

                    </div>

                    {/* OPTIONS */}

                    <div className="mt-4 space-y-3 border-t border-[#e2d9df] pt-4">

                      {poll.options?.map((option) => {
                        const percentage =
                          totalVotes > 0
                            ? Math.round(
                                ((option.votes || 0) /
                                  totalVotes) *
                                  100
                              )
                            : 0;

                        return (
                          <div
                            key={
                              option._id || option.text
                            }
                          >

                            <div className="mb-1.5 flex items-center justify-between gap-3">

                              <span className="truncate text-[10.5px] font-semibold text-[#49394d]">
                                {option.text}
                              </span>

                              <span className="shrink-0 text-[9.5px] font-bold text-[#8b778e]">
                                {option.votes || 0} Votes ·{" "}
                                {percentage}%
                              </span>

                            </div>

                            <div className="h-1.5 overflow-hidden rounded-none bg-[#e2d9df]">

                              <div
                                className="h-full rounded-none bg-[#9b7740] transition-all"
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />

                            </div>

                          </div>
                        );
                      })}

                    </div>

                    {/* INFO */}

                    <div className="mt-4 flex flex-wrap gap-3 border-t border-[#e2d9df] pt-3">

                      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#756b78]">
                        <Users
                          size={13}
                          className="text-[#9b7740]"
                        />
                        {totalVotes} Total Votes
                      </span>

                      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#756b78]">
                        <CalendarDays
                          size={13}
                          className="text-[#8b778e]"
                        />
                        {formatDate(poll.startDate)} -{" "}
                        {formatDate(poll.endDate)}
                      </span>

                    </div>

                    {/* ACTIONS */}

                    <div className="mt-4 flex gap-2 border-t border-[#e2d9df] pt-3">

                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(poll)
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-none border border-[#e2d9df] bg-white py-2.5 text-[10.5px] font-bold text-[#756b78] transition hover:bg-[#eee8ed]"
                      >
                        <Pencil size={14} />
                        Edit Poll
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deletePoll(poll._id)
                        }
                        className="flex items-center justify-center rounded-none border border-red-100 bg-white px-3 text-red-500 transition hover:bg-red-50"
                        title="Delete Poll"
                      >
                        <Trash2 size={15} />
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>

          ) : !loading ? (

            <div className="px-5 py-16 text-center">

              <Vote
                size={32}
                className="mx-auto mb-3 text-[#bca9c0]"
              />

              <p className="text-[12px] font-bold text-[#756b78]">
                No polls found
              </p>

              <p className="mt-1 text-[10.5px] font-medium text-[#8b778e]">
                Create your first society poll to start voting.
              </p>

              <button
                type="button"
                onClick={openCreateModal}
                className="mt-4 inline-flex items-center gap-2 rounded-none bg-[#9b7740] px-4 py-2.5 text-[10.5px] font-bold text-white hover:bg-[#9b7740]"
              >
                <Plus size={14} />
                Create Poll
              </button>

            </div>

          ) : null}

        </section>

        {/* ================= CREATE / EDIT MODAL ================= */}

        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#32143b]/40 p-4">

            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-none border border-[#e2d9df] bg-white shadow-xl">

              {/* MODAL HEADER */}

              <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-none bg-[#f7f3ed] text-[#9b7740]">
                    <Vote size={17} />
                  </div>

                  <div>
                    <h2 className="text-[13px] font-bold text-[#32143b]">
                      {editingPoll
                        ? "Edit Poll"
                        : "Create Poll"}
                    </h2>

                    <p className="mt-0.5 text-[10.5px] font-medium text-[#8b778e]">
                      Configure poll question, options and duration.
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="flex h-8 w-8 items-center justify-center rounded-none text-[#8b778e] transition hover:bg-[#eee8ed] hover:text-[#756b78] disabled:opacity-50"
                >
                  <X size={17} />
                </button>

              </div>

              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="p-5"
              >

                <div className="space-y-5">

                  {/* QUESTION */}

                  <div>

                    <label className="mb-2 block text-[10.5px] font-bold text-[#756b78]">
                      Poll Question
                    </label>

                    <input
                      type="text"
                      name="question"
                      value={formData.question}
                      onChange={handleChange}
                      required
                      placeholder="Enter your poll question"
                      className="w-full rounded-none border border-[#e2d9df] bg-[#f7f3ed] px-3 py-2.5 text-[11px] font-medium text-[#49394d] outline-none transition focus:border-[#bca16a] focus:bg-white"
                    />

                  </div>

                  {/* DESCRIPTION */}

                  <div>

                    <label className="mb-2 block text-[10.5px] font-bold text-[#756b78]">
                      Description
                      <span className="ml-1 font-medium text-[#8b778e]">
                        Optional
                      </span>
                    </label>

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Add a short description..."
                      className="w-full resize-none rounded-none border border-[#e2d9df] bg-[#f7f3ed] px-3 py-2.5 text-[11px] font-medium text-[#49394d] outline-none transition focus:border-[#bca16a] focus:bg-white"
                    />

                  </div>

                  {/* OPTIONS */}

                  <div>

                    <div className="mb-2 flex items-center justify-between">

                      <label className="text-[10.5px] font-bold text-[#756b78]">
                        Poll Options
                      </label>

                      <button
                        type="button"
                        onClick={addOption}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-[#9b7740] hover:text-[#826331]"
                      >
                        <Plus size={13} />
                        Add Option
                      </button>

                    </div>

                    <div className="space-y-2">

                      {formData.options.map(
                        (option, index) => (
                          <div
                            key={index}
                            className="flex gap-2"
                          >

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none border border-[#e2d9df] bg-[#f7f3ed] text-[10px] font-bold text-[#8b778e]">
                              {index + 1}
                            </div>

                            <input
                              type="text"
                              value={option}
                              onChange={(e) =>
                                handleOptionChange(
                                  index,
                                  e.target.value
                                )
                              }
                              required
                              placeholder={`Option ${
                                index + 1
                              }`}
                              className="min-w-0 flex-1 rounded-none border border-[#e2d9df] bg-[#f7f3ed] px-3 py-2.5 text-[11px] font-medium text-[#49394d] outline-none transition focus:border-[#bca16a] focus:bg-white"
                            />

                            {formData.options.length >
                              2 && (
                              <button
                                type="button"
                                onClick={() =>
                                  removeOption(index)
                                }
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none border border-red-100 text-red-500 transition hover:bg-red-50"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}

                          </div>
                        )
                      )}

                    </div>

                  </div>

                  {/* DATES */}

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <div>

                      <label className="mb-2 block text-[10.5px] font-bold text-[#756b78]">
                        Start Date
                      </label>

                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className="w-full rounded-none border border-[#e2d9df] bg-[#f7f3ed] px-3 py-2.5 text-[11px] font-medium text-[#49394d] outline-none transition focus:border-[#bca16a] focus:bg-white"
                      />

                    </div>

                    <div>

                      <label className="mb-2 block text-[10.5px] font-bold text-[#756b78]">
                        End Date
                      </label>

                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        className="w-full rounded-none border border-[#e2d9df] bg-[#f7f3ed] px-3 py-2.5 text-[11px] font-medium text-[#49394d] outline-none transition focus:border-[#bca16a] focus:bg-white"
                      />

                    </div>

                  </div>

                  {/* STATUS */}

                  <div>

                    <label className="mb-2 block text-[10.5px] font-bold text-[#756b78]">
                      Poll Status
                    </label>

                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full rounded-none border border-[#e2d9df] bg-[#f7f3ed] px-3 py-2.5 text-[11px] font-medium text-[#49394d] outline-none transition focus:border-[#bca16a] focus:bg-white"
                    >
                      <option value="Draft">
                        Draft
                      </option>

                      <option value="Active">
                        Active
                      </option>

                      <option value="Closed">
                        Closed
                      </option>
                    </select>

                  </div>

                </div>

                {/* BUTTONS */}

                <div className="mt-5 flex justify-end gap-2 border-t border-[#e2d9df] pt-4">

                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={submitting}
                    className="rounded-none border border-[#e2d9df] bg-white px-4 py-2.5 text-[10.5px] font-bold text-[#756b78] transition hover:bg-[#f7f3ed] disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-none bg-[#9b7740] px-4 py-2.5 text-[10.5px] font-bold text-white transition hover:bg-[#9b7740] disabled:opacity-60"
                  >

                    {submitting && (
                      <Loader2
                        size={14}
                        className="animate-spin"
                      />
                    )}

                    {editingPoll
                      ? "Update Poll"
                      : "Create Poll"}

                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#32143b]/20">

            <div className="flex items-center gap-3 rounded-none border border-[#e2d9df] bg-white px-5 py-3 shadow-xl">

              <Loader2
                size={18}
                className="animate-spin text-[#9b7740]"
              />

              <span className="text-[11px] font-bold text-[#756b78]">
                Loading polls...
              </span>

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
// POLL STATUS BADGE
// ==========================================

function PollStatusBadge({ status }) {
  if (status === "Active") {
    return (
      <span className="inline-flex shrink-0 rounded-none bg-[#f7f3ed] px-2.5 py-1 text-[9.5px] font-bold text-[#9b7740]">
        Active
      </span>
    );
  }

  if (status === "Closed") {
    return (
      <span className="inline-flex shrink-0 rounded-none bg-[#eee8ed] px-2.5 py-1 text-[9.5px] font-bold text-[#756b78]">
        Closed
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 rounded-none bg-[#f7f3ed] px-2.5 py-1 text-[9.5px] font-bold text-[#9b7740]">
      Draft
    </span>
  );
}

export default AdminPolls;