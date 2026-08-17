import { useEffect, useState } from "react";
import {
  Building2,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  UserCheck,
  Home,
  Wrench,
  User,
} from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const API_URL = "https://smart-society-backend-delta.vercel.app/admin";

function AdminFlats() {
  const [flats, setFlats] = useState([]);
  const [filteredFlats, setFilteredFlats] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedFlat, setSelectedFlat] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    flatNo: "",
    block: "",
    floor: "",
    type: "2BHK",
    status: "Vacant",
  });

  // ==========================================
  // TOKEN
  // ==========================================
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==========================================
  // FETCH FLATS
  // ==========================================
  const fetchFlats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/flats`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch flats");
      }

      setFlats(result.data || []);
      setFilteredFlats(result.data || []);
    } catch (error) {
      console.error("Fetch Flats Error:", error);
      setError(error.message || "Failed to load flats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlats();
  }, []);

  // ==========================================
  // SEARCH + FILTER
  // ==========================================
  useEffect(() => {
    const query = search.toLowerCase().trim();

    const filtered = flats.filter((flat) => {
      const matchesSearch =
        !query ||
        flat.flatNo?.toLowerCase().includes(query) ||
        flat.block?.toLowerCase().includes(query) ||
        flat.type?.toLowerCase().includes(query) ||
        flat.resident?.name?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || flat.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    setFilteredFlats(filtered);
  }, [search, statusFilter, flats]);

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================
  const openAddModal = () => {
    setSelectedFlat(null);

    setFormData({
      flatNo: "",
      block: "",
      floor: "",
      type: "2BHK",
      status: "Vacant",
    });

    setModalOpen(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================
  const openEditModal = (flat) => {
    setSelectedFlat(flat);

    setFormData({
      flatNo: flat.flatNo || "",
      block: flat.block || "",
      floor: flat.floor ?? "",
      type: flat.type || "Other",
      status: flat.status || "Vacant",
    });

    setModalOpen(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================
  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setSelectedFlat(null);
  };

  // ==========================================
  // FORM CHANGE
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // CREATE / UPDATE FLAT
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        flatNo: formData.flatNo.trim(),
        block: formData.block.trim(),
        floor: Number(formData.floor),
        type: formData.type,
        status: formData.status,
      };

      const url = selectedFlat
        ? `${API_URL}/flats/${selectedFlat._id}`
        : `${API_URL}/flats`;

      const response = await fetch(url, {
        method: selectedFlat ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Failed to ${selectedFlat ? "update" : "create"} flat`
        );
      }

      if (selectedFlat) {
        setFlats((previous) =>
          previous.map((flat) =>
            flat._id === selectedFlat._id ? result.data : flat
          )
        );
      } else {
        setFlats((previous) => [result.data, ...previous]);
      }

      closeModal();
    } catch (error) {
      console.error("Save Flat Error:", error);
      alert(error.message || "Failed to save flat");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE FLAT
  // ==========================================
  const handleDelete = async (flat) => {
    if (flat.resident) {
      alert("Cannot delete a flat while a resident is assigned.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete flat ${flat.flatNo}?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/flats/${flat._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete flat");
      }

      setFlats((previous) =>
        previous.filter((item) => item._id !== flat._id)
      );
    } catch (error) {
      console.error("Delete Flat Error:", error);
      alert(error.message || "Failed to delete flat");
    }
  };

  // ==========================================
  // COUNTS
  // ==========================================
  const totalFlats = flats.length;

  const occupiedFlats = flats.filter(
    (flat) => flat.status === "Occupied"
  ).length;

  const vacantFlats = flats.filter(
    (flat) => flat.status === "Vacant"
  ).length;

  const maintenanceFlats = flats.filter(
    (flat) => flat.status === "Maintenance"
  ).length;

  return (
    <DashboardLayout role="admin">
      <div className="w-full">

        {/* ================= HEADER ================= */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-[22px] font-extrabold text-slate-900">
              <Building2 size={23} className="text-emerald-500" />
              Flats
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-slate-400">
              Manage all flats and their occupancy in your society.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-[11px] font-bold text-white transition hover:bg-emerald-600"
          >
            <Building2 size={14} />
            Add Flat
          </button>
        </div>

        {/* ================= STATS ================= */}
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">

          <StatCard
            icon={<Building2 size={17} />}
            label="Total Flats"
            value={totalFlats}
            iconClass="bg-emerald-50 text-emerald-500"
          />

          <StatCard
            icon={<UserCheck size={17} />}
            label="Occupied"
            value={occupiedFlats}
            iconClass="bg-sky-50 text-sky-500"
          />

          <StatCard
            icon={<Home size={17} />}
            label="Vacant"
            value={vacantFlats}
            iconClass="bg-amber-50 text-amber-500"
          />

          <StatCard
            icon={<Wrench size={17} />}
            label="Maintenance"
            value={maintenanceFlats}
            iconClass="bg-red-50 text-red-500"
          />

        </div>

        {/* ================= SEARCH + FILTER ================= */}
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
              placeholder="Search flat, block or resident..."
              className="w-full rounded-[10px] border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-[12px] font-medium text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-[11px] font-semibold text-slate-600 outline-none focus:border-emerald-400"
            >
              <option value="All">All Status</option>
              <option value="Occupied">Occupied</option>
              <option value="Vacant">Vacant</option>
              <option value="Maintenance">Maintenance</option>
            </select>

            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
              <Building2 size={16} className="text-emerald-500" />
              {filteredFlats.length} Flats
            </div>

          </div>
        </div>

        {/* ================= ERROR ================= */}
        {error && (
          <div className="mb-5 rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-medium text-red-600">
            {error}
          </div>
        )}

        {/* ================= FLATS TABLE ================= */}
        <section className="overflow-hidden rounded-[16px] border border-slate-200 bg-white">

          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

            <div>
              <h2 className="text-[13px] font-bold text-slate-900">
                All Flats
              </h2>

              <p className="mt-0.5 text-[10.5px] font-medium text-slate-400">
                Registered society flats
              </p>
            </div>

            <button
              type="button"
              onClick={fetchFlats}
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

              <table className="w-full min-w-[950px] border-collapse">

                <thead>
                  <tr className="bg-slate-50">

                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Flat
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Block
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Floor
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Type
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Resident
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

                  {filteredFlats.length > 0 ? (
                    filteredFlats.map((flat) => (
                      <tr
                        key={flat._id}
                        className="border-t border-slate-200 transition hover:bg-slate-50"
                      >

                        {/* FLAT */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                              <Building2 size={16} />
                            </div>

                            <div>
                              <p className="text-[12px] font-bold text-slate-800">
                                {flat.flatNo}
                              </p>

                              <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                                Flat
                              </p>
                            </div>

                          </div>
                        </td>

                        {/* BLOCK */}
                        <td className="px-4 py-4">
                          <span className="text-[11px] font-semibold text-slate-700">
                            {flat.block || "-"}
                          </span>
                        </td>

                        {/* FLOOR */}
                        <td className="px-4 py-4">
                          <span className="text-[11px] font-semibold text-slate-700">
                            Floor {flat.floor}
                          </span>
                        </td>

                        {/* TYPE */}
                        <td className="px-4 py-4">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                            {flat.type}
                          </span>
                        </td>

                        {/* RESIDENT */}
                        <td className="px-4 py-4">

                          {flat.resident ? (
                            <div className="flex items-center gap-2">

                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                                <User size={13} />
                              </div>

                              <div>
                                <p className="text-[11px] font-bold text-slate-700">
                                  {flat.resident.name}
                                </p>

                                <p className="text-[9.5px] font-medium text-slate-400">
                                  {flat.resident.phone ||
                                    flat.resident.email ||
                                    "-"}
                                </p>
                              </div>

                            </div>
                          ) : (
                            <span className="text-[10.5px] font-medium text-slate-400">
                              No resident assigned
                            </span>
                          )}

                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-4">
                          <StatusBadge status={flat.status} />
                        </td>

                        {/* ACTIONS */}
                        <td className="px-5 py-4">

                          <div className="flex justify-end gap-2">

                            <button
                              type="button"
                              onClick={() => openEditModal(flat)}
                              title="Edit Flat"
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 transition hover:bg-sky-100"
                            >
                              <Pencil size={14} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(flat)}
                              disabled={!!flat.resident}
                              title={
                                flat.resident
                                  ? "Cannot delete occupied flat"
                                  : "Delete Flat"
                              }
                              className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                                flat.resident
                                  ? "cursor-not-allowed bg-slate-100 text-slate-300"
                                  : "bg-red-50 text-red-600 hover:bg-red-100"
                              }`}
                            >
                              <Trash2 size={14} />
                            </button>

                          </div>

                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-5 py-14 text-center"
                      >
                        <Building2
                          size={32}
                          className="mx-auto mb-3 text-slate-300"
                        />

                        <p className="text-[12px] font-bold text-slate-600">
                          No flats found
                        </p>

                        <p className="mt-1 text-[10.5px] font-medium text-slate-400">
                          No flat matches your search or filter.
                        </p>
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>

            </div>
          )}
        </section>

        {/* ================= ADD / EDIT MODAL ================= */}
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4">

            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[18px] bg-white shadow-2xl">

              {/* HEADER */}
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

                <div>
                  <h2 className="text-[15px] font-bold text-slate-900">
                    {selectedFlat ? "Edit Flat" : "Add Flat"}
                  </h2>

                  <p className="mt-0.5 text-[10.5px] font-medium text-slate-400">
                    {selectedFlat
                      ? "Update flat information."
                      : "Create a new society flat."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={18} />
                </button>

              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="p-5">

                <div className="grid gap-4 sm:grid-cols-2">

                  <FormField
                    label="Flat Number"
                    name="flatNo"
                    value={formData.flatNo}
                    onChange={handleChange}
                    placeholder="e.g. A-101"
                  />

                  <FormField
                    label="Block"
                    name="block"
                    value={formData.block}
                    onChange={handleChange}
                    placeholder="e.g. A"
                  />

                  <FormField
                    label="Floor"
                    name="floor"
                    type="number"
                    min="0"
                    value={formData.floor}
                    onChange={handleChange}
                    placeholder="e.g. 1"
                  />

                  <div>
                    <label className="mb-1.5 block text-[10.5px] font-bold text-slate-600">
                      Flat Type
                    </label>

                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full rounded-[9px] border border-slate-200 bg-white px-3 py-2.5 text-[11.5px] font-medium text-slate-700 outline-none transition focus:border-emerald-400"
                    >
                      <option value="1BHK">1BHK</option>
                      <option value="2BHK">2BHK</option>
                      <option value="3BHK">3BHK</option>
                      <option value="4BHK">4BHK</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                </div>

                {/* STATUS */}
                <div className="mt-4">
                  <label className="mb-1.5 block text-[10.5px] font-bold text-slate-600">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="w-full rounded-[9px] border border-slate-200 bg-white px-3 py-2.5 text-[11.5px] font-medium text-slate-700 outline-none transition focus:border-emerald-400"
                  >
                    <option value="Vacant">Vacant</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Maintenance">
                      Maintenance
                    </option>
                  </select>

                  {selectedFlat?.resident &&
                    formData.status === "Vacant" && (
                      <p className="mt-2 text-[10px] font-medium text-red-500">
                        This flat has a resident assigned and cannot
                        be marked vacant.
                      </p>
                    )}
                </div>

                {/* BUTTONS */}
                <div className="mt-6 flex justify-end gap-3">

                  <button
                    type="button"
                    onClick={closeModal}
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
                      <Loader2
                        size={14}
                        className="animate-spin"
                      />
                    )}

                    {saving
                      ? "Saving..."
                      : selectedFlat
                      ? "Save Changes"
                      : "Create Flat"}
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
// STATUS BADGE
// ==========================================
function StatusBadge({ status }) {
  if (status === "Occupied") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
        <UserCheck size={12} />
        Occupied
      </span>
    );
  }

  if (status === "Maintenance") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-600">
        <Wrench size={12} />
        Maintenance
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-bold text-sky-600">
      <Home size={12} />
      Vacant
    </span>
  );
}

// ==========================================
// FORM FIELD
// ==========================================
function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  min,
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
        placeholder={placeholder}
        min={min}
        required
        className="w-full rounded-[9px] border border-slate-200 bg-white px-3 py-2.5 text-[11.5px] font-medium text-slate-700 outline-none transition focus:border-emerald-400"
      />
    </div>
  );
}

export default AdminFlats;