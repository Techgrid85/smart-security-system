import { useEffect, useState } from "react";
import axios from "axios";
import {
  UserCog,
  ShieldCheck,
  Plus,
  Search,
  Pencil,
  Power,
  X,
  Loader2,
  AlertCircle,
  Users,
  Mail,
  Phone,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

const API_URL = "https://smart-society-backend-delta.vercel.app";

function StaffGuards() {
  const [activeTab, setActiveTab] = useState("staff");

  const [staff, setStaff] = useState([]);
  const [guards, setGuards] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const emptyForm = {
    name: "",
    email: "",
    password: "",
    phone: "",
    isActive: true,
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchUsers();
  }, []);

  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // ==========================================
  // FETCH STAFF + GUARDS
  // ==========================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const [staffResponse, guardResponse] = await Promise.all([
        axios.get(`${API_URL}/admin/staff`, getHeaders()),
        axios.get(`${API_URL}/admin/guards`, getHeaders()),
      ]);

      setStaff(staffResponse.data.data || []);
      setGuards(guardResponse.data.data || []);
    } catch (error) {
      console.error(
        "Fetch Staff/Guards Error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load staff and guards"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CURRENT DATA
  // ==========================================

  const currentUsers =
    activeTab === "staff" ? staff : guards;

  const filteredUsers = currentUsers.filter((user) => {
    const searchText = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText) ||
      user.phone?.toLowerCase().includes(searchText)
    );
  });

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  const handleAdd = () => {
    setEditingUser(null);

    setFormData({
      ...emptyForm,
      isActive: true,
    });

    setModalOpen(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const handleEdit = (user) => {
    setEditingUser(user);

    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      phone: user.phone || "",
      isActive: user.isActive ?? true,
    });

    setModalOpen(true);
  };

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setActionLoading(true);

      const config = getHeaders();

      const endpoint =
        activeTab === "staff"
          ? `${API_URL}/admin/staff`
          : `${API_URL}/admin/guards`;

      if (editingUser) {
        const updateData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          isActive: formData.isActive,
        };

        await axios.put(
          `${endpoint}/${editingUser._id}`,
          updateData,
          config
        );
      } else {
        await axios.post(
          endpoint,
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
          },
          config
        );
      }

      setModalOpen(false);
      setEditingUser(null);
      setFormData(emptyForm);

      await fetchUsers();
    } catch (error) {
      console.error(
        "Save User Error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to save user"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // TOGGLE STATUS
  // ==========================================

  const handleToggleStatus = async (user) => {
    try {
      setActionLoading(true);

      const endpoint =
        activeTab === "staff"
          ? `${API_URL}/admin/staff/${user._id}/status`
          : `${API_URL}/admin/guards/${user._id}/status`;

      await axios.patch(
        endpoint,
        {},
        getHeaders()
      );

      await fetchUsers();
    } catch (error) {
      console.error(
        "Toggle Status Error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update status"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <Loader2
              size={34}
              className="mx-auto animate-spin text-emerald-500"
            />

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading staff and guards...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <DashboardLayout role="admin">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">

            <AlertCircle
              size={34}
              className="mx-auto text-red-500"
            />

            <h2 className="mt-3 font-bold text-slate-900">
              Failed to Load Data
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {error}
            </p>

            <button
              onClick={fetchUsers}
              className="mt-5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
            >
              Try Again
            </button>

          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">

      <div className="w-full">

        {/* ================= HEADER ================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-[21px] font-extrabold text-slate-900">
              Staff & Security
            </h1>

            <p className="mt-1 text-[12px] font-medium text-slate-400">
              Manage maintenance staff and security guards.
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 rounded-[10px] bg-emerald-500 px-4 py-2.5 text-[11.5px] font-bold text-white shadow-[0_4px_14px_rgba(16,185,129,0.2)] transition hover:bg-emerald-600"
          >
            <Plus size={16} />

            Add {activeTab === "staff" ? "Staff" : "Guard"}
          </button>

        </div>

        {/* ================= STATS ================= */}

        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

          <MiniStat
            title="Total Staff"
            value={staff.length}
            icon={UserCog}
            tone="emerald"
          />

          <MiniStat
            title="Active Staff"
            value={staff.filter((item) => item.isActive).length}
            icon={Users}
            tone="sky"
          />

          <MiniStat
            title="Total Guards"
            value={guards.length}
            icon={ShieldCheck}
            tone="amber"
          />

          <MiniStat
            title="Active Guards"
            value={guards.filter((item) => item.isActive).length}
            icon={ShieldCheck}
            tone="purple"
          />

        </div>

        {/* ================= MAIN CARD ================= */}

        <section className="overflow-hidden rounded-[16px] border border-slate-200 bg-white">

          {/* TABS + SEARCH */}

          <div className="flex flex-col gap-4 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex w-full rounded-xl bg-slate-100 p-1 lg:w-auto">

              <button
                onClick={() => {
                  setActiveTab("staff");
                  setSearch("");
                }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-[11.5px] font-bold transition lg:flex-none ${
                  activeTab === "staff"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <UserCog size={15} />
                Maintenance Staff
              </button>

              <button
                onClick={() => {
                  setActiveTab("guards");
                  setSearch("");
                }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-[11.5px] font-bold transition lg:flex-none ${
                  activeTab === "guards"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <ShieldCheck size={15} />
                Security Guards
              </button>

            </div>

            <div className="relative w-full lg:w-[270px]">

              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${activeTab === "staff" ? "staff" : "guards"}...`}
                className="w-full rounded-[10px] border border-slate-200 py-2.5 pl-10 pr-4 text-[11.5px] font-medium outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />

            </div>

          </div>

          {/* ================= TABLE ================= */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px]">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">

                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Name
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Contact
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Role
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                  <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (

                    <tr
                      key={user._id}
                      className="border-b border-slate-100 transition hover:bg-slate-50"
                    >

                      {/* NAME */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                              activeTab === "staff"
                                ? "bg-emerald-50 text-emerald-500"
                                : "bg-amber-50 text-amber-500"
                            }`}
                          >
                            {activeTab === "staff" ? (
                              <UserCog size={18} />
                            ) : (
                              <ShieldCheck size={18} />
                            )}
                          </div>

                          <div>
                            <p className="text-[12px] font-bold text-slate-800">
                              {user.name}
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                              ID: {user._id.slice(-6).toUpperCase()}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* CONTACT */}

                      <td className="px-5 py-4">

                        <div className="space-y-1">

                          <p className="flex items-center gap-2 text-[11px] font-medium text-slate-600">
                            <Mail size={13} className="text-slate-400" />
                            {user.email}
                          </p>

                          <p className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                            <Phone size={13} className="text-slate-400" />
                            {user.phone || "N/A"}
                          </p>

                        </div>

                      </td>

                      {/* ROLE */}

                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            activeTab === "staff"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {activeTab === "staff"
                            ? "Maintenance Staff"
                            : "Security Guard"}
                        </span>

                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            user.isActive
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              user.isActive
                                ? "bg-emerald-500"
                                : "bg-red-500"
                            }`}
                          />

                          {user.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() => handleEdit(user)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            disabled={actionLoading}
                            onClick={() => handleToggleStatus(user)}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                              user.isActive
                                ? "border-red-200 text-red-500 hover:bg-red-50"
                                : "border-emerald-200 text-emerald-500 hover:bg-emerald-50"
                            }`}
                            title={
                              user.isActive
                                ? "Deactivate"
                                : "Activate"
                            }
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
                      className="px-5 py-12 text-center"
                    >
                      <div className="text-sm font-medium text-slate-400">
                        No {activeTab === "staff" ? "staff members" : "guards"} found
                      </div>
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </section>

      </div>

      {/* ================= ADD / EDIT MODAL ================= */}

      {modalOpen && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4">

          <div className="w-full max-w-md rounded-[18px] bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <div>

                <h2 className="text-[15px] font-bold text-slate-900">
                  {editingUser
                    ? `Edit ${activeTab === "staff" ? "Staff Member" : "Security Guard"}`
                    : `Add ${activeTab === "staff" ? "Staff Member" : "Security Guard"}`}
                </h2>

                <p className="mt-1 text-[10.5px] text-slate-400">
                  Fill in the details below.
                </p>

              </div>

              <button
                onClick={() => {
                  if (!actionLoading) {
                    setModalOpen(false);
                  }
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-5"
            >

              <FormInput
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />

              <FormInput
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />

              {!editingUser && (
                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  required
                />
              )}

              <FormInput
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />

              {editingUser && (
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                  <div>
                    <p className="text-[11.5px] font-bold text-slate-700">
                      Account Status
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      Allow this user to access the system.
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
              )}

              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => setModalOpen(false)}
                  className="flex-1 rounded-[10px] border border-slate-200 py-2.5 text-[11.5px] font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-[10px] bg-emerald-500 py-2.5 text-[11.5px] font-bold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {actionLoading && (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  )}

                  {editingUser
                    ? "Save Changes"
                    : `Add ${activeTab === "staff" ? "Staff" : "Guard"}`}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </DashboardLayout>
  );
}


/* ==========================================
   MINI STAT
========================================== */

function MiniStat({ title, value, icon: Icon, tone }) {
  const styles = {
    emerald: "bg-emerald-50 text-emerald-500",
    sky: "bg-sky-50 text-sky-500",
    amber: "bg-amber-50 text-amber-500",
    purple: "bg-purple-50 text-purple-500",
  };

  return (
    <div className="rounded-[15px] border border-slate-200 bg-white p-4">

      <div className="flex items-center justify-between">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles[tone]}`}
        >
          <Icon size={18} />
        </div>

        <span className="text-[24px] font-extrabold text-slate-900">
          {value}
        </span>

      </div>

      <p className="mt-3 text-[11px] font-semibold text-slate-500">
        {title}
      </p>

    </div>
  );
}


/* ==========================================
   FORM INPUT
========================================== */

function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}) {
  return (
    <div>

      <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-[10px] border border-slate-200 px-3.5 py-2.5 text-[11.5px] font-medium text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
      />

    </div>
  );
}

export default StaffGuards;