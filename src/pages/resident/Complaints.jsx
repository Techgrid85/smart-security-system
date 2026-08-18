import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  MessageSquareWarning,
  Plus,
  X,
  Send,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock3,
  Eye,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

const API_URL = "https://smart-society-backend-delta.vercel.app";

const categories = [
  "Plumbing",
  "Electrical",
  "Elevator",
  "HVAC",
  "Carpentry",
  "Cleanliness",
  "Security",
  "Parking",
  "Noise",
  "Common Area",
  "Water Supply",
  "Gas",
  "Other",
];

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [creating, setCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "",
  });

  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // ==========================================
  // FETCH COMPLAINTS
  // ==========================================

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/resident/complaints`,
        {
          headers: getHeaders(),
        }
      );

      if (response.data.success) {
        setComplaints(response.data.data || []);
      } else {
        toast.error(
          response.data.message ||
            "Failed to load complaints"
        );
      }
    } catch (error) {
      console.error("Get Complaints Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load complaints"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // PHOTO CHANGE
  // ==========================================

  const handlePhotoChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setPhoto(selectedFile);

    const previewUrl = URL.createObjectURL(
      selectedFile
    );

    setPhotoPreview(previewUrl);
  };

  // ==========================================
  // REMOVE PHOTO
  // ==========================================

  const removePhoto = () => {
    setPhoto(null);

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhotoPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      subject: "",
      description: "",
      category: "",
    });

    removePhoto();
  };

  // ==========================================
  // OPEN CREATE MODAL
  // ==========================================

  const openCreateModal = () => {
    resetForm();
    setCreating(true);
  };

  // ==========================================
  // CLOSE CREATE MODAL
  // ==========================================

  const closeCreateModal = () => {
    if (submitting) return;

    setCreating(false);
    resetForm();
  };

  // ==========================================
  // CREATE COMPLAINT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject.trim()) {
      toast.error("Please enter a complaint subject");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a complaint category");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a complaint description");
      return;
    }

    try {
      setSubmitting(true);

      const data = new FormData();

      data.append(
        "subject",
        formData.subject.trim()
      );

      data.append(
        "description",
        formData.description.trim()
      );

      data.append(
        "category",
        formData.category
      );

      if (photo) {
        data.append("photo", photo);
      }

      const response = await axios.post(
        `${API_URL}/resident/complaints`,
        data,
        {
          headers: getHeaders(),
        }
      );

      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Complaint submitted successfully"
        );

        setCreating(false);

        resetForm();

        await fetchComplaints();
      }
    } catch (error) {
      console.error(
        "Create Complaint Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to submit complaint"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // VIEW COMPLAINT
  // ==========================================

  const handleViewComplaint = async (id) => {
    try {
      setDetailLoading(true);
      setSelectedComplaint(null);

      const response = await axios.get(
        `${API_URL}/resident/complaints/${id}`,
        {
          headers: getHeaders(),
        }
      );

      if (response.data.success) {
        setSelectedComplaint(response.data.data);
      } else {
        toast.error(
          response.data.message ||
            "Failed to load complaint"
        );
      }
    } catch (error) {
      console.error(
        "Get Complaint Detail Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load complaint"
      );
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <DashboardLayout role="resident">
      <div className="w-full min-w-0 max-w-full">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-500">
              Resident Portal
            </p>

            <h1 className="text-[20px] font-extrabold tracking-tight text-slate-900 md:text-[22px]">
              Helpdesk & Complaints
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-slate-400">
              Report maintenance and society issues and
              track their progress.
            </p>
          </div>

          <div className="flex gap-2">

            <button
              type="button"
              onClick={fetchComplaints}
              className="flex items-center justify-center gap-2 rounded-[1px] border border-slate-200 bg-white px-3.5 py-2.5 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50"
            >
              <RefreshCw size={14} />
              Refresh
            </button>

            <button
              type="button"
              onClick={openCreateModal}
              className="flex items-center justify-center gap-2 rounded-[1px] bg-emerald-500 px-4 py-2.5 text-[11px] font-bold text-white transition hover:bg-emerald-600"
            >
              <Plus size={15} />
              New Complaint
            </button>

          </div>
        </div>

        {/* ==========================================
            STATS
        ========================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <ComplaintStat
            title="Total Complaints"
            value={complaints.length}
            icon={MessageSquareWarning}
            tone="slate"
          />

          <ComplaintStat
            title="Pending"
            value={
              complaints.filter(
                (complaint) =>
                  complaint.status === "Pending"
              ).length
            }
            icon={Clock3}
            tone="amber"
          />

          <ComplaintStat
            title="Resolved"
            value={
              complaints.filter(
                (complaint) =>
                  complaint.status === "Resolved"
              ).length
            }
            icon={CheckCircle2}
            tone="emerald"
          />

        </div>

        {/* ==========================================
            COMPLAINT TABLE
        ========================================== */}

        <section className="overflow-hidden rounded-[1px] border border-slate-200 bg-white">

          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

            <div>
              <h2 className="text-[13px] font-bold text-slate-900">
                Complaint History
              </h2>

              <p className="mt-1 text-[10px] font-medium text-slate-400">
                {complaints.length} complaint
                {complaints.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>
            </div>

          </div>

          {loading ? (
            <div className="flex min-h-[250px] items-center justify-center">
              <p className="text-[11px] font-medium text-slate-400">
                Loading complaints...
              </p>
            </div>
          ) : complaints.length > 0 ? (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[800px]">

                <thead>
                  <tr className="bg-slate-50">
                    <TableHead>ID</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </tr>
                </thead>

                <tbody>

                  {complaints.map((complaint) => (
                    <tr
                      key={complaint._id}
                      className="border-t border-slate-200 transition hover:bg-slate-50"
                    >

                      <td className="px-5 py-4 text-[10.5px] font-bold text-emerald-500">
                        #{complaint._id?.slice(-6)}
                      </td>

                      <td className="max-w-[250px] px-5 py-4">

                        <div className="flex items-center gap-2">

                          {complaint.photo && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[1px] border border-slate-200">
                              <img
                                src={complaint.photo}
                                alt="Complaint"
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}

                          <div className="min-w-0">

                            <p className="truncate text-[11px] font-bold text-slate-800">
                              {complaint.subject}
                            </p>

                            <p className="mt-1 truncate text-[9.5px] text-slate-400">
                              {complaint.description}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-5 py-4">

                        <span className="rounded-[1px] bg-slate-100 px-2.5 py-1 text-[9px] font-bold text-slate-600">
                          {complaint.category}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-[10px] font-medium text-slate-400">
                        {complaint.createdAt
                          ? new Date(
                              complaint.createdAt
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="px-5 py-4">
                        <ComplaintStatus
                          status={
                            complaint.status
                          }
                        />
                      </td>

                      <td className="px-5 py-4">

                        <button
                          type="button"
                          onClick={() =>
                            handleViewComplaint(
                              complaint._id
                            )
                          }
                          className="flex items-center gap-1.5 rounded-[1px] border border-slate-200 bg-white px-2.5 py-1.5 text-[9.5px] font-bold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600"
                        >
                          <Eye size={13} />
                          View
                        </button>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          ) : (
            <EmptyState
              text="You have not submitted any complaints yet."
            />
          )}

        </section>

        {/* ==========================================
            CREATE COMPLAINT MODAL
        ========================================== */}

        {creating && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4"
            onClick={closeCreateModal}
          >

            <div
              className="max-h-[92vh] w-full max-w-[760px] overflow-y-auto rounded-[1px] border border-slate-200 bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >

              {/* MODAL HEADER */}

              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-500">
                    Helpdesk
                  </p>

                  <h2 className="mt-1 text-[18px] font-extrabold text-slate-900">
                    Submit New Complaint
                  </h2>

                  <p className="mt-1 text-[10.5px] font-medium text-slate-400">
                    Report an issue to society management.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="flex h-9 w-9 items-center justify-center rounded-[1px] border border-slate-200 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
                >
                  <X size={17} />
                </button>

              </div>

              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5 p-6"
              >

                {/* SUBJECT + CATEGORY */}

                <div className="grid gap-5 md:grid-cols-2">

                  <div>

                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      Subject
                    </label>

                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      maxLength={100}
                      placeholder="e.g. Water leakage in bathroom"
                      className="w-full rounded-[1px] border border-slate-200 px-3 py-3 text-[11px] font-medium text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    />

                    <p className="mt-1 text-right text-[9px] text-slate-400">
                      {formData.subject.length}/100
                    </p>

                  </div>

                  <div>

                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      Category
                    </label>

                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full rounded-[1px] border border-slate-200 bg-white px-3 py-3 text-[11px] font-medium text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    >

                      <option value="">
                        Select complaint category
                      </option>

                      {categories.map(
                        (category) => (
                          <option
                            key={category}
                            value={category}
                          >
                            {category}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                </div>

                {/* DESCRIPTION */}

                <div>

                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={7}
                    maxLength={1000}
                    placeholder="Describe the issue clearly so management can understand and resolve it..."
                    className="w-full resize-none rounded-[1px] border border-slate-200 px-3 py-3 text-[11px] font-medium leading-5 text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />

                  <p className="mt-1 text-right text-[9px] text-slate-400">
                    {formData.description.length}/1000
                  </p>

                </div>

                {/* PHOTO UPLOAD */}

                <div>

                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Photo Evidence
                    <span className="ml-1 font-medium normal-case text-slate-400">
                      (Optional)
                    </span>
                  </label>

                  {!photoPreview ? (

                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="flex min-h-[150px] w-full flex-col items-center justify-center border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-emerald-400 hover:bg-emerald-50/30"
                    >

                      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-[1px] bg-white text-slate-400 shadow-sm">
                        <Upload size={19} />
                      </div>

                      <p className="text-[11px] font-bold text-slate-600">
                        Upload a photo
                      </p>

                      <p className="mt-1 text-[9.5px] text-slate-400">
                        JPG, PNG or WEBP · Maximum 5MB
                      </p>

                    </button>

                  ) : (

                    <div className="relative border border-slate-200 bg-slate-50 p-3">

                      <div className="relative overflow-hidden border border-slate-200 bg-white">

                        <img
                          src={photoPreview}
                          alt="Complaint preview"
                          className="max-h-[280px] w-full object-contain"
                        />

                      </div>

                      <div className="mt-3 flex items-center justify-between">

                        <div className="flex min-w-0 items-center gap-2">

                          <ImageIcon
                            size={14}
                            className="shrink-0 text-emerald-500"
                          />

                          <p className="truncate text-[10px] font-semibold text-slate-600">
                            {photo?.name}
                          </p>

                        </div>

                        <button
                          type="button"
                          onClick={removePhoto}
                          className="flex shrink-0 items-center gap-1 rounded-[1px] border border-slate-200 bg-white px-2.5 py-1.5 text-[9px] font-bold text-red-500 transition hover:bg-red-50"
                        >
                          <X size={12} />
                          Remove
                        </button>

                      </div>

                    </div>

                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />

                </div>

                {/* INFO */}

                <div className="border border-emerald-100 bg-emerald-50/50 px-4 py-3">

                  <p className="text-[10px] font-semibold text-emerald-700">
                    Helpdesk tip
                  </p>

                  <p className="mt-1 text-[9.5px] leading-5 text-emerald-600">
                    Adding a clear photo can help society
                    management understand the issue and
                    assign it to the appropriate staff member
                    faster.
                  </p>

                </div>

                {/* ACTIONS */}

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-5">

                  <button
                    type="button"
                    onClick={closeCreateModal}
                    disabled={submitting}
                    className="rounded-[1px] border border-slate-200 px-5 py-2.5 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 rounded-[1px] bg-emerald-500 px-5 py-2.5 text-[11px] font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    <Send size={14} />

                    {submitting
                      ? "Submitting..."
                      : "Submit Complaint"}

                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

        {/* ==========================================
            COMPLAINT DETAIL MODAL
        ========================================== */}

        {(detailLoading || selectedComplaint) && (
          <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/55 p-4"
            onClick={() => {
              if (!detailLoading) {
                setSelectedComplaint(null);
              }
            }}
          >

            <div
              className="max-h-[90vh] w-full max-w-[650px] overflow-y-auto rounded-[1px] border border-slate-200 bg-white shadow-2xl"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {detailLoading ? (

                <div className="flex min-h-[300px] items-center justify-center">
                  <p className="text-[11px] font-medium text-slate-400">
                    Loading complaint details...
                  </p>
                </div>

              ) : (

                <>

                  {/* HEADER */}

                  <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">

                    <div>

                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-500">
                        Complaint Details
                      </p>

                      <h2 className="mt-1 text-[17px] font-extrabold text-slate-900">
                        {selectedComplaint?.subject}
                      </h2>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedComplaint(null)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-[1px] border border-slate-200 text-slate-400 transition hover:bg-slate-50"
                    >
                      <X size={17} />
                    </button>

                  </div>

                  <div className="space-y-5 p-6">

                    {/* DETAILS */}

                    <div className="grid grid-cols-2 gap-5 md:grid-cols-4">

                      <DetailItem
                        label="Category"
                        value={
                          selectedComplaint?.category
                        }
                      />

                      <div>

                        <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                          Status
                        </p>

                        <div className="mt-1">
                          <ComplaintStatus
                            status={
                              selectedComplaint?.status
                            }
                          />
                        </div>

                      </div>

                      <DetailItem
                        label="Flat Number"
                        value={
                          selectedComplaint?.flatNo ||
                          "-"
                        }
                      />

                      <DetailItem
                        label="Submitted"
                        value={
                          selectedComplaint?.createdAt
                            ? new Date(
                                selectedComplaint.createdAt
                              ).toLocaleDateString()
                            : "-"
                        }
                      />

                    </div>

                    {/* DESCRIPTION */}

                    <div>

                      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                        Description
                      </p>

                      <div className="mt-2 border border-slate-200 bg-slate-50 p-4">

                        <p className="text-[11px] leading-6 text-slate-600">
                          {
                            selectedComplaint?.description
                          }
                        </p>

                      </div>

                    </div>

                    {/* PHOTO */}

                    {selectedComplaint?.photo && (
                      <div>

                        <p className="mb-2 text-[9px] font-bold uppercase tracking-wide text-slate-400">
                          Attached Photo
                        </p>

                        <div className="overflow-hidden border border-slate-200 bg-slate-50">

                          <img
                            src={
                              selectedComplaint.photo
                            }
                            alt="Complaint evidence"
                            className="max-h-[400px] w-full object-contain"
                          />

                        </div>

                      </div>
                    )}

                    {/* ADMIN REMARK */}

                    {selectedComplaint?.adminRemark && (
                      <div>

                        <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                          Management Remark
                        </p>

                        <div className="mt-2 border border-slate-200 bg-slate-50 p-4">

                          <p className="text-[11px] leading-6 text-slate-600">
                            {
                              selectedComplaint.adminRemark
                            }
                          </p>

                        </div>

                      </div>
                    )}

                  </div>

                </>
              )}

            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

/* ==========================================
   STAT
========================================== */

function ComplaintStat({
  title,
  value,
  icon: Icon,
  tone,
}) {
  const tones = {
    slate: "bg-slate-100 text-slate-600",
    amber: "bg-amber-50 text-amber-500",
    emerald: "bg-emerald-50 text-emerald-500",
  };

  return (
    <div className="rounded-[1px] border border-slate-200 bg-white p-5">

      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-[1px] ${tones[tone]}`}
      >
        <Icon size={19} />
      </div>

      <p className="text-[25px] font-extrabold leading-none text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-[11px] font-semibold text-slate-500">
        {title}
      </p>

    </div>
  );
}

/* ==========================================
   STATUS
========================================== */

function ComplaintStatus({ status }) {
  if (status === "Resolved") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-[1px] bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-600">
        <CheckCircle2 size={11} />
        Resolved
      </span>
    );
  }

  if (status === "In Progress") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-[1px] bg-amber-50 px-2.5 py-1 text-[9px] font-bold text-amber-600">
        <Clock3 size={11} />
        In Progress
      </span>
    );
  }

  if (status === "Rejected") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-[1px] bg-red-50 px-2.5 py-1 text-[9px] font-bold text-red-600">
        <AlertCircle size={11} />
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-[1px] bg-slate-100 px-2.5 py-1 text-[9px] font-bold text-slate-600">
      <AlertCircle size={11} />
      {status || "Pending"}
    </span>
  );
}

/* ==========================================
   DETAIL ITEM
========================================== */

function DetailItem({ label, value }) {
  return (
    <div>

      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-[11px] font-bold text-slate-700">
        {value || "-"}
      </p>

    </div>
  );
}

/* ==========================================
   TABLE HEAD
========================================== */

function TableHead({ children }) {
  return (
    <th className="px-5 py-3.5 text-left text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400">
      {children}
    </th>
  );
}

/* ==========================================
   EMPTY
========================================== */

function EmptyState({ text }) {
  return (
    <div className="flex min-h-[250px] flex-col items-center justify-center px-4 text-center">

      <div className="flex h-12 w-12 items-center justify-center rounded-[1px] bg-slate-100 text-slate-400">
        <MessageSquareWarning size={21} />
      </div>

      <p className="mt-3 text-[11px] font-medium text-slate-400">
        {text}
      </p>

    </div>
  );
}

export default Complaints;