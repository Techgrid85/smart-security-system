import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserPlus,
  Search,
  Pencil,
  Power,
  X,
  Loader2,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Building2,
} from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const API_URL = "https://smart-society-backend-delta.vercel.app/admin";

function AdminResidents() {
  const navigate = useNavigate();
  const [residents, setResidents] = useState([]);
  const [filteredResidents, setFilteredResidents] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedResident, setSelectedResident] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    flatNo: "",
    isActive: true,
  });

  // ==========================================
  // GET TOKEN
  // ==========================================
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==========================================
  // FETCH RESIDENTS
  // ==========================================
  const fetchResidents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/residents`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch residents");
      }

      setResidents(result.data || []);
      setFilteredResidents(result.data || []);
    } catch (error) {
      console.error("Fetch Residents Error:", error);
      setError(error.message || "Failed to load residents");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD RESIDENTS
  // ==========================================
  useEffect(() => {
    fetchResidents();
  }, []);

  // ==========================================
  // SEARCH RESIDENTS
  // ==========================================
  useEffect(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      setFilteredResidents(residents);
      return;
    }

    const filtered = residents.filter((resident) => {
      return (
        resident.name?.toLowerCase().includes(query) ||
        resident.email?.toLowerCase().includes(query) ||
        resident.phone?.toLowerCase().includes(query) ||
        resident.flatNo?.toLowerCase().includes(query)
      );
    });

    setFilteredResidents(filtered);
  }, [search, residents]);

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================
  const openEditModal = (resident) => {
    setSelectedResident(resident);

    setFormData({
      name: resident.name || "",
      email: resident.email || "",
      phone: resident.phone || "",
      flatNo: resident.flatNo || "",
      isActive: resident.isActive ?? true,
    });

    setEditOpen(true);
  };

  // ==========================================
  // CLOSE EDIT MODAL
  // ==========================================
  const closeEditModal = () => {
    setEditOpen(false);
    setSelectedResident(null);
  };

  // ==========================================
  // HANDLE FORM CHANGE
  // ==========================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==========================================
  // UPDATE RESIDENT
  // ==========================================
  const handleUpdateResident = async (e) => {
    e.preventDefault();

    if (!selectedResident) return;

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/residents/${selectedResident._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update resident");
      }

      // Update resident directly in frontend
      setResidents((previous) =>
        previous.map((resident) =>
          resident._id === selectedResident._id
            ? result.data
            : resident
        )
      );

      closeEditModal();
    } catch (error) {
      console.error("Update Resident Error:", error);
      alert(error.message || "Failed to update resident");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // TOGGLE RESIDENT STATUS
  // ==========================================
  const handleToggleStatus = async (resident) => {
    const action = resident.isActive
      ? "deactivate"
      : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${resident.name}?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/residents/${resident._id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update resident status"
        );
      }

      setResidents((previous) =>
        previous.map((item) =>
          item._id === resident._id
            ? {
                ...item,
                isActive: result.data.isActive,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Toggle Status Error:", error);
      alert(error.message || "Failed to update resident status");
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="w-full">
            
              <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                      <h1 className="flex items-center gap-2 text-[22px] font-extrabold text-slate-900">
                          <Users size={23} className="text-emerald-500" />
                          Residents
                      </h1>

                      <p className="mt-1 text-[11.5px] font-medium text-slate-400">
                          Manage all registered residents in your society.
                      </p>
                  </div>

                  <button
                      type="button"
                      onClick={() => navigate("/register")}
                      className="inline-flex shrink-0 items-center gap-2 rounded-[9px] bg-emerald-500 px-4 py-2.5 text-[11px] font-bold text-white shadow-[0_4px_14px_rgba(16,185,129,0.22)] transition hover:bg-emerald-600"
                  >
                      <UserPlus size={15} />
                      Add Resident
                  </button>
              </div>

        {/* ================= SEARCH + COUNT ================= */}
        <div className="mb-5 flex flex-col gap-4 rounded-[16px] border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone or flat..."
              className="w-full rounded-[10px] border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-[12px] font-medium text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
            <Users size={16} className="text-emerald-500" />
            {filteredResidents.length} Residents
          </div>
        </div>

        {/* ================= ERROR ================= */}
        {error && (
          <div className="mb-5 rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-medium text-red-600">
            {error}
          </div>
        )}

        {/* ================= RESIDENTS TABLE ================= */}
        <section className="overflow-hidden rounded-[16px] border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-[13px] font-bold text-slate-900">
                All Residents
              </h2>

              <p className="mt-0.5 text-[10.5px] font-medium text-slate-400">
                Registered resident accounts
              </p>
            </div>

            <button
              type="button"
              onClick={fetchResidents}
              className="rounded-lg border border-slate-200 px-3 py-2 text-[10.5px] font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <Loader2
                size={28}
                className="animate-spin text-emerald-500"
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Resident
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Contact
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Flat No.
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredResidents.length > 0 ? (
                    filteredResidents.map((resident) => (
                      <tr
                        key={resident._id}
                        className="border-t border-slate-200 transition hover:bg-slate-50"
                      >
                        {/* NAME */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-[11px] font-bold text-emerald-600">
                              {resident.name
                                ?.split(" ")
                                .map((word) => word[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase() || "R"}
                            </div>

                            <div>
                              <p className="text-[12px] font-bold text-slate-800">
                                {resident.name || "Unnamed Resident"}
                              </p>

                              <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                                Resident
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* CONTACT */}
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <p className="flex items-center gap-1.5 text-[10.5px] font-medium text-slate-600">
                              <Mail size={12} className="text-slate-400" />
                              {resident.email || "-"}
                            </p>

                            <p className="flex items-center gap-1.5 text-[10.5px] font-medium text-slate-500">
                              <Phone size={12} className="text-slate-400" />
                              {resident.phone || "-"}
                            </p>
                          </div>
                        </td>

                        {/* FLAT */}
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                            <Building2
                              size={14}
                              className="text-emerald-500"
                            />
                            {resident.flatNo || "Not Assigned"}
                          </span>
                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-4">
                          {resident.isActive ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                              <UserCheck size={12} />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-600">
                              <UserX size={12} />
                              Inactive
                            </span>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(resident)}
                              title="Edit Resident"
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 transition hover:bg-sky-100"
                            >
                              <Pencil size={14} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleToggleStatus(resident)
                              }
                              title={
                                resident.isActive
                                  ? "Deactivate Resident"
                                  : "Activate Resident"
                              }
                              className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                                resident.isActive
                                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                                  : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                              }`}
                            >
                              <Power size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-5 py-14 text-center"
                      >
                        <Users
                          size={32}
                          className="mx-auto mb-3 text-slate-300"
                        />

                        <p className="text-[12px] font-bold text-slate-600">
                          No residents found
                        </p>

                        <p className="mt-1 text-[10.5px] font-medium text-slate-400">
                          No resident matches your search.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ================= EDIT MODAL ================= */}
        {editOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[18px] bg-white shadow-2xl">
              {/* MODAL HEADER */}
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div>
                  <h2 className="text-[15px] font-bold text-slate-900">
                    Edit Resident
                  </h2>

                  <p className="mt-0.5 text-[10.5px] font-medium text-slate-400">
                    Update resident account information.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>

              {/* FORM */}
              <form onSubmit={handleUpdateResident} className="p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />

                  <FormField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />

                  <FormField
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />

                  <FormField
                    label="Flat Number"
                    name="flatNo"
                    value={formData.flatNo}
                    onChange={handleChange}
                  />
                </div>

                {/* STATUS */}
                <label className="mt-5 flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-[11.5px] font-bold text-slate-700">
                      Active Account
                    </p>

                    <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                      Allow this resident to use the system.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 accent-emerald-500"
                  />
                </label>

                {/* BUTTONS */}
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    disabled={saving}
                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-[11px] font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving && (
                      <Loader2 size={14} className="animate-spin" />
                    )}

                    {saving ? "Saving..." : "Save Changes"}
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
// REUSABLE FORM FIELD
// ==========================================
function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[10.5px] font-bold text-slate-600">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full rounded-[9px] border border-slate-200 bg-white px-3 py-2.5 text-[11.5px] font-medium text-slate-700 outline-none transition focus:border-emerald-400"
      />
    </div>
  );
}

export default AdminResidents;