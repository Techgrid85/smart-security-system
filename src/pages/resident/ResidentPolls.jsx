import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  Vote,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  X,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

function ResidentPolls() {
  const navigate = useNavigate();

  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPoll, setSelectedPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ==========================================
  // FETCH POLLS
  // ==========================================

  const fetchPolls = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        return;
      }

      const response = await axios.get(
        "https://smart-society-backend-delta.vercel.app/resident/polls",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setPolls(response.data.data || []);
      } else {
        toast.error(
          response.data.message || "Failed to load polls"
        );
      }
    } catch (error) {
      console.error("Polls Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load polls"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  // ==========================================
  // OPEN VOTE MODAL
  // ==========================================

  const openVoteModal = (poll) => {
    setSelectedPoll(poll);
    setSelectedOption("");
    setShowVoteModal(true);
  };

  // ==========================================
  // SUBMIT VOTE
  // ==========================================

  const handleVote = async (e) => {
    e.preventDefault();

    if (!selectedOption) {
      toast.error("Please select an option");
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `https://smart-society-backend-delta.vercel.app/resident/polls/${selectedPoll._id}/vote`,
        {
          optionId: selectedOption,
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
            "Your vote has been submitted"
        );

        setShowVoteModal(false);
        setSelectedPoll(null);
        setSelectedOption("");

        fetchPolls();
      } else {
        toast.error(
          response.data.message ||
            "Failed to submit vote"
        );
      }
    } catch (error) {
      console.error("Vote Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to submit vote"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // HELPERS
  // ==========================================

  const getPollStatus = (poll) => {
    if (poll.status) {
      return poll.status;
    }

    if (poll.endDate) {
      return new Date(poll.endDate) >= new Date()
        ? "Active"
        : "Closed";
    }

    return "Active";
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-600";

      case "Closed":
        return "bg-slate-100 text-slate-500";

      default:
        return "bg-amber-50 text-amber-600";
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <DashboardLayout role="resident">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm font-medium text-slate-500">
            Loading polls...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <DashboardLayout role="resident">
      <div className="w-full min-w-0 max-w-full">

        {/* HEADER */}
        <div className="mb-6">

          <button
            type="button"
            onClick={() => navigate("/resident")}
            className="mb-4 flex items-center gap-2 text-[11px] font-bold text-slate-400 transition hover:text-emerald-500"
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </button>

          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-500">
              Resident Portal
            </p>

            <h1 className="text-[20px] font-extrabold tracking-tight text-slate-900 md:text-[22px]">
              Polls & Voting
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-slate-400">
              Participate in society polls and share your opinion.
            </p>
          </div>

        </div>

        {/* POLLS */}
        <section className="overflow-hidden rounded-[16px] border border-slate-200 bg-white">

          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

            <h2 className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
              <Vote
                size={16}
                className="text-emerald-500"
              />
              Available Polls
            </h2>

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold text-slate-500">
              {polls.length}{" "}
              {polls.length === 1
                ? "Poll"
                : "Polls"}
            </span>

          </div>

          <div className="space-y-3 p-5">

            {polls.length > 0 ? (
              polls.map((poll) => {
                const status = getPollStatus(poll);

                return (
                  <div
                    key={poll._id}
                    className="rounded-[13px] border border-slate-200 bg-slate-50 p-4"
                  >

                    <div className="flex items-start gap-3">

                      {/* ICON */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-emerald-50 text-emerald-500">
                        <Vote size={18} />
                      </div>

                      {/* CONTENT */}
                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-start justify-between gap-2">

                          <h3 className="text-[12px] font-bold text-slate-800">
                            {poll.question}
                          </h3>

                          <span
                            className={`rounded-full px-2 py-1 text-[8.5px] font-bold ${getStatusStyle(
                              status
                            )}`}
                          >
                            {status}
                          </span>

                        </div>

                        {poll.description && (
                          <p className="mt-2 text-[10.5px] leading-relaxed text-slate-500">
                            {poll.description}
                          </p>
                        )}

                        {/* DATE */}
                        {poll.endDate && (
                          <div className="mt-3 flex items-center gap-1 text-[9.5px] font-semibold text-slate-400">
                            <Clock3 size={12} />

                            Ends{" "}
                            {new Date(
                              poll.endDate
                            ).toLocaleDateString()}
                          </div>
                        )}

                        {/* ACTION */}
                        <div className="mt-4">

                          {status === "Active" ? (
                            <button
                              type="button"
                              onClick={() =>
                                openVoteModal(poll)
                              }
                              className="rounded-lg bg-emerald-500 px-3.5 py-2 text-[10px] font-bold text-white shadow-sm transition hover:bg-emerald-600"
                            >
                              Vote Now
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-[10px] font-bold text-slate-400">
                              <CheckCircle2 size={13} />
                              Poll Closed
                            </span>
                          )}

                        </div>

                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[13px] border border-dashed border-slate-200 bg-slate-50 px-5 text-center">

                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                  <Vote size={21} />
                </div>

                <p className="text-[12px] font-bold text-slate-700">
                  No polls available
                </p>

                <p className="mt-1 text-[10px] font-medium text-slate-400">
                  There are currently no active society polls.
                </p>

              </div>
            )}

          </div>
        </section>

        {/* VOTE MODAL */}
        {showVoteModal && selectedPoll && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">

            <div className="w-full max-w-md overflow-hidden rounded-[16px] bg-white shadow-2xl">

              {/* HEADER */}
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

                <div>
                  <h2 className="text-[14px] font-bold text-slate-900">
                    Cast Your Vote
                  </h2>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Select one option below.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowVoteModal(false)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={17} />
                </button>

              </div>

              {/* POLL */}
              <form
                onSubmit={handleVote}
                className="p-5"
              >

                <h3 className="text-[12px] font-bold text-slate-800">
                  {selectedPoll.question}
                </h3>

                {selectedPoll.description && (
                  <p className="mt-2 text-[10.5px] leading-relaxed text-slate-500">
                    {selectedPoll.description}
                  </p>
                )}

                {/* OPTIONS */}
                <div className="mt-5 space-y-2">

                  {(selectedPoll.options || []).map((option) => {
                    const optionId = option._id;
                    const optionText = option.text;

                    return (
                      <label
                        key={optionId}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 transition ${selectedOption === optionId
                            ? "border-emerald-400 bg-emerald-50"
                            : "border-slate-200 hover:bg-slate-50"
                          }`}
                      >
                        <input
                          type="radio"
                          name="pollOption"
                          value={optionId}
                          checked={selectedOption === optionId}
                          onChange={(e) =>
                            setSelectedOption(e.target.value)
                          }
                          className="accent-emerald-500"
                        />

                        <span className="text-[11px] font-semibold text-slate-700">
                          {optionText}
                        </span>
                      </label>
                    );
                  })}

                </div>

                {/* BUTTONS */}
                <div className="flex justify-end gap-2 pt-5">

                  <button
                    type="button"
                    onClick={() =>
                      setShowVoteModal(false)
                    }
                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-[10.5px] font-bold text-slate-500 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      submitting ||
                      !selectedOption
                    }
                    className="rounded-lg bg-emerald-500 px-4 py-2.5 text-[10.5px] font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting
                      ? "Submitting..."
                      : "Submit Vote"}
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

export default ResidentPolls;