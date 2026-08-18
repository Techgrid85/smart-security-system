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
              className="mx-auto animate-spin text-[#9b7740]"
            />

            <p className="mt-4 text-sm font-medium text-[#756b78]">
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

            <h2 className="mt-3 font-bold text-[#32143b]">
              Failed to Load Data
            </h2>

            <p className="mt-2 text-sm text-[#756b78]">
              {error}
            </p>

            <button
              onClick={fetchUsers}
              className="mt-5 rounded-lg bg-[#9b7740] px-4 py-2 text-sm font-semibold text-white hover:bg-[#9b7740]"
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
            <h1 className="text-[21px] font-extrabold text-[#32143b]">
              Staff & Security
            </h1>

            <p className="mt-1 text-[12px] font-medium text-[#8b778e]">
              Manage maintenance staff and security guards.
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 rounded-[10px] bg-[#9b7740] px-4 py-2.5 text-[11.5px] font-bold text-white shadow-[0_4px_14px_rgba(16,185,129,0.2)] transition hover:bg-[#9b7740]"
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

        <section className="overflow-hidden rounded-[16px] border border-[#e2d9df] bg-white">

          {/* TABS + SEARCH */}

          <div className="flex flex-col gap-4 border-b border-[#e2d9df] p-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex w-full rounded-xl bg-[#eee8ed] p-1 lg:w-auto">

              <button
                onClick={() => {
                  setActiveTab("staff");
                  setSearch("");
                }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-[11.5px] font-bold transition lg:flex-none ${
                  activeTab === "staff"
                    ? "bg-white text-[#9b7740] shadow-sm"
                    : "text-[#756b78] hover:text-[#49394d]"
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
                    ? "bg-white text-[#9b7740] shadow-sm"
                    : "text-[#756b78] hover:text-[#49394d]"
                }`}
              >
                <ShieldCheck size={15} />
                Security Guards
              </button>

            </div>

            <div className="relative w-full lg:w-[270px]">

              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b778e]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${activeTab === "staff" ? "staff" : "guards"}...`}
                className="w-full rounded-[10px] border border-[#e2d9df] py-2.5 pl-10 pr-4 text-[11.5px] font-medium outline-none transition focus:border-[#bca16a] focus:ring-2 focus:ring-[#f5eee2]"
              />

            </div>

          </div>

          {/* ================= TABLE ================= */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px]">

              <thead>
                <tr className="border-b border-[#e2d9df] bg-[#f7f3ed]">

                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-[#8b778e]">
                    Name
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-[#8b778e]">
                    Contact
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-[#8b778e]">
                    Role
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-[#8b778e]">
                    Status
                  </th>

                  <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider text-[#8b778e]">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (

                    <tr
                      key={user._id}
                      className="border-b border-[#eee8ed] transition hover:bg-[#f7f3ed]"
                    >

                      {/* NAME */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                              activeTab === "staff"
                                ? "bg-[#f7f3ed] text-[#9b7740]"
                                : "bg-[#f7f3ed] text-[#9b7740]"
                            }`}
                          >
                            {activeTab === "staff" ? (
                              <UserCog size={18} />
                            ) : (
                              <ShieldCheck size={18} />
                            )}
                          </div>

                          <div>
                            <p className="text-[12px] font-bold text-[#49394d]">
                              {user.name}
                            </p>

                            <p className="mt-0.5 text-[10px] text-[#8b778e]">
                              ID: {user._id.slice(-6).toUpperCase()}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* CONTACT */}

                      <td className="px-5 py-4">

                        <div className="space-y-1">

                          <p className="flex items-center gap-2 text-[11px] font-medium text-[#756b78]">
                            <Mail size={13} className="text-[#8b778e]" />
                            {user.email}
                          </p>

                          <p className="flex items-center gap-2 text-[11px] font-medium text-[#756b78]">
                            <Phone size={13} className="text-[#8b778e]" />
                            {user.phone || "N/A"}
                          </p>

                        </div>

                      </td>

                      {/* ROLE */}

                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            activeTab === "staff"
                              ? "bg-[#f7f3ed] text-[#9b7740]"
                              : "bg-[#f7f3ed] text-[#9b7740]"
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
                              ? "bg-[#f7f3ed] text-[#826331]"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              user.isActive
                                ? "bg-[#9b7740]"
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
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2d9df] text-[#756b78] transition hover:border-[#e2d9df] hover:bg-[#f7f3ed] hover:text-[#9b7740]"
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
                                : "border-[#e2d9df] text-[#9b7740] hover:bg-[#f7f3ed]"
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
                      <div className="text-sm font-medium text-[#8b778e]">
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

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#210c28]/40 p-4">

          <div className="w-full max-w-md rounded-[18px] bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">

              <div>

                <h2 className="text-[15px] font-bold text-[#32143b]">
                  {editingUser
                    ? `Edit ${activeTab === "staff" ? "Staff Member" : "Security Guard"}`
                    : `Add ${activeTab === "staff" ? "Staff Member" : "Security Guard"}`}
                </h2>

                <p className="mt-1 text-[10.5px] text-[#8b778e]">
                  Fill in the details below.
                </p>

              </div>

              <button
                onClick={() => {
                  if (!actionLoading) {
                    setModalOpen(false);
                  }
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8b778e] hover:bg-[#eee8ed] hover:text-[#49394d]"
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
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#e2d9df] bg-[#f7f3ed] px-4 py-3">

                  <div>
                    <p className="text-[11.5px] font-bold text-[#49394d]">
                      Account Status
                    </p>

                    <p className="mt-0.5 text-[10px] text-[#8b778e]">
                      Allow this user to access the system.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 accent-#9b7740"
                  />

                </label>
              )}

              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => setModalOpen(false)}
                  className="flex-1 rounded-[10px] border border-[#e2d9df] py-2.5 text-[11.5px] font-bold text-[#756b78] hover:bg-[#f7f3ed]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-[10px] bg-[#9b7740] py-2.5 text-[11.5px] font-bold text-white hover:bg-[#9b7740] disabled:cursor-not-allowed disabled:opacity-70"
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
    emerald: "bg-[#f7f3ed] text-[#9b7740]",
    sky: "bg-[#f7f3ed] text-[#9b7740]",
    amber: "bg-[#f7f3ed] text-[#9b7740]",
    purple: "bg-[#f1eaf3] text-[#63366f]",
  };

  return (
    <div className="rounded-[15px] border border-[#e2d9df] bg-white p-4">

      <div className="flex items-center justify-between">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles[tone]}`}
        >
          <Icon size={18} />
        </div>

        <span className="text-[24px] font-extrabold text-[#32143b]">
          {value}
        </span>

      </div>

      <p className="mt-3 text-[11px] font-semibold text-[#756b78]">
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

      <label className="mb-1.5 block text-[11px] font-bold text-[#756b78]">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-[10px] border border-[#e2d9df] px-3.5 py-2.5 text-[11.5px] font-medium text-[#49394d] outline-none transition placeholder:text-[#bca9c0] focus:border-[#bca16a] focus:ring-2 focus:ring-[#f5eee2]"
      />

    </div>
  );
}

export default StaffGuards;