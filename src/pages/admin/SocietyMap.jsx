import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  Building2,
  Home,
  Users,
  MapPinned,
  X,
  Mail,
  Phone,
  Layers3,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

function SocietyMap() {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Clicked flat
  const [selectedFlat, setSelectedFlat] = useState(null);

  // Hovered flat
  const [hoveredFlat, setHoveredFlat] = useState(null);

  // ==========================================
  // FETCH FLATS
  // ==========================================

  const fetchFlats = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        return;
      }

      const response = await axios.get(
        "https://smart-society-backend-delta.vercel.app/admin/flats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setFlats(response.data.data || []);
      } else {
        toast.error(
          response.data.message || "Failed to load society map"
        );
      }
    } catch (error) {
      console.error("Society Map Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load society map"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlats();
  }, []);

  // ==========================================
  // GROUP
  // BLOCK -> FLOOR -> FLATS
  // ==========================================

  const groupedFlats = useMemo(() => {
    return flats.reduce((groups, flat) => {
      const block = flat.block || "OTHER";
      const floor = flat.floor ?? 0;

      if (!groups[block]) {
        groups[block] = {};
      }

      if (!groups[block][floor]) {
        groups[block][floor] = [];
      }

      groups[block][floor].push(flat);

      return groups;
    }, {});
  }, [flats]);

  // ==========================================
  // BLOCKS
  // ==========================================

  const blocks = Object.keys(groupedFlats).sort((a, b) =>
    a.localeCompare(b)
  );

  // ==========================================
  // STATS
  // ==========================================

  const stats = {
    total: flats.length,

    occupied: flats.filter(
      (flat) => flat.status === "Occupied"
    ).length,

    vacant: flats.filter(
      (flat) => flat.status === "Vacant"
    ).length,

    maintenance: flats.filter(
      (flat) => flat.status === "Maintenance"
    ).length,
  };

  // ==========================================
  // STATUS COLORS
  // ==========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Occupied":
        return `
          border-emerald-500
          bg-emerald-500
          text-white
          hover:bg-emerald-600
        `;

      case "Maintenance":
        return `
          border-amber-400
          bg-amber-400
          text-slate-900
          hover:bg-amber-500
        `;

      case "Vacant":
      default:
        return `
          border-slate-300
          bg-slate-100
          text-slate-600
          hover:bg-slate-200
        `;
    }
  };

  // ==========================================
  // STATUS DOT
  // ==========================================

  const getStatusDot = (status) => {
    switch (status) {
      case "Occupied":
        return "bg-emerald-500";

      case "Maintenance":
        return "bg-amber-400";

      default:
        return "bg-slate-300";
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />

            <p className="mt-4 text-[11px] font-semibold text-slate-500">
              Loading society map...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <DashboardLayout role="admin">
      <div className="w-full min-w-0 max-w-full">

        {/* ====================================== */}
        {/* PAGE HEADER */}
        {/* ====================================== */}

        <div className="mb-6">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-500">
            Society Management
          </p>

          <h1 className="text-[22px] font-extrabold tracking-tight text-slate-900 md:text-[24px]">
            Society Map
          </h1>

          <p className="mt-1 text-[11.5px] font-medium text-slate-400">
            Visual overview of blocks, floors and flats across the
            society.
          </p>
        </div>

        {/* ====================================== */}
        {/* STAT CARDS */}
        {/* ====================================== */}

        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">

          {/* TOTAL */}

          <div className="border border-slate-200 bg-white p-4 transition hover:border-slate-300">
            <div className="mb-3 flex h-9 w-9 items-center justify-center bg-slate-100 text-slate-500">
              <Home size={17} />
            </div>

            <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
              Total Flats
            </p>

            <p className="mt-2 text-[22px] font-extrabold leading-none text-slate-900">
              {stats.total}
            </p>
          </div>

          {/* OCCUPIED */}

          <div className="border border-emerald-200 bg-emerald-50 p-4 transition hover:border-emerald-300">
            <div className="mb-3 flex h-9 w-9 items-center justify-center bg-emerald-100 text-emerald-600">
              <Users size={17} />
            </div>

            <p className="text-[9px] font-bold uppercase tracking-wide text-emerald-600">
              Occupied
            </p>

            <p className="mt-2 text-[22px] font-extrabold leading-none text-emerald-700">
              {stats.occupied}
            </p>
          </div>

          {/* VACANT */}

          <div className="border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300">
            <div className="mb-3 flex h-9 w-9 items-center justify-center bg-white text-slate-500">
              <Building2 size={17} />
            </div>

            <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">
              Vacant
            </p>

            <p className="mt-2 text-[22px] font-extrabold leading-none text-slate-700">
              {stats.vacant}
            </p>
          </div>

          {/* MAINTENANCE */}

          <div className="border border-amber-200 bg-amber-50 p-4 transition hover:border-amber-300">
            <div className="mb-3 flex h-9 w-9 items-center justify-center bg-amber-100 text-amber-600">
              <MapPinned size={17} />
            </div>

            <p className="text-[9px] font-bold uppercase tracking-wide text-amber-600">
              Maintenance
            </p>

            <p className="mt-2 text-[22px] font-extrabold leading-none text-amber-700">
              {stats.maintenance}
            </p>
          </div>
        </div>

        {/* ====================================== */}
        {/* LEGEND */}
        {/* ====================================== */}

        <div className="mb-6 flex flex-wrap items-center gap-5 border border-slate-200 bg-white px-4 py-3">

          <p className="mr-1 text-[10px] font-bold tracking-wide text-slate-500">
            STATUS
          </p>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 bg-emerald-500" />

            <span className="text-[10px] font-semibold text-slate-600">
              Occupied
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 bg-slate-300" />

            <span className="text-[10px] font-semibold text-slate-600">
              Vacant
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 bg-amber-400" />

            <span className="text-[10px] font-semibold text-slate-600">
              Maintenance
            </span>
          </div>

          <div className="ml-auto hidden text-[9px] font-medium text-slate-400 md:block">
            Hover for quick information • Click for full details
          </div>
        </div>

        {/* ====================================== */}
        {/* MAP */}
        {/* ====================================== */}

        {blocks.length === 0 ? (
          <div className="border border-slate-200 bg-white p-12 text-center">
            <MapPinned
              size={32}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-4 text-[14px] font-bold text-slate-700">
              No flats found
            </h2>

            <p className="mt-1 text-[10px] font-medium text-slate-400">
              Add flats from the Flats management section.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">

            {blocks.map((block) => {
              const floors = Object.keys(
                groupedFlats[block]
              )
                .map(Number)
                .sort((a, b) => b - a);

              const blockFlats = flats.filter(
                (flat) => flat.block === block
              );

              return (
                <section
                  key={block}
                  className="overflow-hidden border border-slate-200 bg-white shadow-sm"
                >

                  {/* BLOCK HEADER */}

                  <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3">

                    <div className="flex items-center gap-3">

                      <div className="flex h-8 w-8 items-center justify-center border border-white/10 bg-white/5">
                        <Building2
                          size={15}
                          className="text-emerald-400"
                        />
                      </div>

                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-slate-500">
                          Society Block
                        </p>

                        <h2 className="text-[14px] font-extrabold text-white">
                          Block {block}
                        </h2>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] font-bold text-white">
                        {blockFlats.length}
                      </p>

                      <p className="text-[8px] font-medium text-slate-500">
                        Flats
                      </p>
                    </div>
                  </div>

                  {/* FLOORS */}

                  <div className="p-4">
                    {floors.map((floor) => {
                      const floorFlats = [
                        ...groupedFlats[block][floor],
                      ].sort((a, b) =>
                        a.flatNo.localeCompare(
                          b.flatNo,
                          undefined,
                          {
                            numeric: true,
                          }
                        )
                      );

                      return (
                        <div
                          key={floor}
                          className="border-b border-slate-200 py-4 last:border-b-0"
                        >

                          {/* FLOOR LABEL */}

                          <div className="mb-3 flex items-center gap-3">

                            <div className="flex items-center gap-2">
                              <Layers3
                                size={13}
                                className="text-emerald-500"
                              />

                              <span className="text-[9px] font-bold uppercase tracking-wide text-slate-500">
                                Floor {floor}
                              </span>
                            </div>

                            <div className="h-px flex-1 bg-slate-100" />

                            <span className="text-[8px] font-semibold text-slate-400">
                              {floorFlats.length} flats
                            </span>
                          </div>

                          {/* FLATS */}

                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">

                            {floorFlats.map((flat) => (
                              <button
                                key={flat._id}
                                type="button"
                                onClick={() =>
                                  setSelectedFlat(flat)
                                }
                                onMouseEnter={() =>
                                  setHoveredFlat(flat._id)
                                }
                                onMouseLeave={() =>
                                  setHoveredFlat(null)
                                }
                                className={`
                                  group
                                  relative
                                  min-h-[78px]
                                  border
                                  p-3
                                  text-left
                                  transition-all
                                  duration-150
                                  hover:-translate-y-0.5
                                  hover:shadow-lg
                                  ${getStatusClass(flat.status)}
                                `}
                              >

                                {/* FLAT ICON */}

                                <Home
                                  size={15}
                                  className="mb-2 opacity-80"
                                />

                                {/* FLAT NUMBER */}

                                <p className="text-[11px] font-extrabold">
                                  {flat.flatNo}
                                </p>

                                {/* TYPE */}

                                <p className="mt-0.5 text-[8px] font-medium opacity-80">
                                  {flat.type}
                                </p>

                                {/* HOVER POPUP */}

                                {hoveredFlat === flat._id && (
                                  <div
                                    className="
                                      pointer-events-none
                                      absolute
                                      bottom-full
                                      left-1/2
                                      z-[100]
                                      mb-2
                                      w-56
                                      -translate-x-1/2
                                      border
                                      border-slate-700
                                      bg-slate-900
                                      p-3
                                      text-left
                                      shadow-2xl
                                    "
                                  >

                                    {/* TITLE */}

                                    <div className="border-b border-white/10 pb-2">

                                      <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-emerald-400">
                                        Flat Information
                                      </p>

                                      <p className="mt-1 text-[12px] font-extrabold text-white">
                                        {flat.flatNo}
                                      </p>
                                    </div>

                                    {/* BASIC DETAILS */}

                                    <div className="mt-2 space-y-1.5">

                                      <div className="flex justify-between gap-3">
                                        <span className="text-[9px] text-slate-500">
                                          Block
                                        </span>

                                        <span className="text-[9px] font-bold text-slate-200">
                                          {flat.block}
                                        </span>
                                      </div>

                                      <div className="flex justify-between gap-3">
                                        <span className="text-[9px] text-slate-500">
                                          Floor
                                        </span>

                                        <span className="text-[9px] font-bold text-slate-200">
                                          {flat.floor}
                                        </span>
                                      </div>

                                      <div className="flex justify-between gap-3">
                                        <span className="text-[9px] text-slate-500">
                                          Type
                                        </span>

                                        <span className="text-[9px] font-bold text-slate-200">
                                          {flat.type}
                                        </span>
                                      </div>

                                      <div className="flex justify-between gap-3">
                                        <span className="text-[9px] text-slate-500">
                                          Status
                                        </span>

                                        <span
                                          className={`
                                            text-[9px]
                                            font-bold
                                            ${
                                              flat.status ===
                                              "Occupied"
                                                ? "text-emerald-400"
                                                : flat.status ===
                                                  "Maintenance"
                                                ? "text-amber-400"
                                                : "text-slate-300"
                                            }
                                          `}
                                        >
                                          {flat.status}
                                        </span>
                                      </div>
                                    </div>

                                    {/* RESIDENT */}

                                    <div className="mt-3 border-t border-white/10 pt-2">

                                      <p className="text-[8px] font-bold uppercase tracking-wide text-slate-500">
                                        Resident
                                      </p>

                                      {flat.resident ? (
                                        <>
                                          <p className="mt-1 text-[9px] font-bold text-white">
                                            {flat.resident.name}
                                          </p>

                                          <p className="mt-0.5 truncate text-[8px] text-slate-400">
                                            {flat.resident.email}
                                          </p>
                                        </>
                                      ) : (
                                        <p className="mt-1 text-[8px] text-slate-400">
                                          No resident assigned
                                        </p>
                                      )}
                                    </div>

                                    {/* CLICK HINT */}

                                    <div className="mt-3 border-t border-white/10 pt-2">
                                      <p className="text-[8px] font-medium text-slate-500">
                                        Click for full details
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* ====================================== */}
        {/* FULL DETAILS MODAL */}
        {/* ====================================== */}

        {selectedFlat && (
          <div
            className="
              fixed
              inset-0
              z-[200]
              flex
              items-end
              justify-center
              bg-slate-950/60
              p-4
              md:items-center
            "
            onClick={() => setSelectedFlat(null)}
          >
            <div
              className="
                w-full
                max-w-lg
                overflow-hidden
                border
                border-slate-200
                bg-white
                shadow-2xl
              "
              onClick={(e) => e.stopPropagation()}
            >

              {/* MODAL HEADER */}

              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-emerald-500">
                    Flat Details
                  </p>

                  <h2 className="mt-1 text-[19px] font-extrabold text-slate-900">
                    {selectedFlat.flatNo}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFlat(null)}
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    border
                    border-slate-200
                    text-slate-400
                    transition
                    hover:bg-slate-50
                    hover:text-slate-700
                  "
                >
                  <X size={15} />
                </button>
              </div>

              {/* MODAL CONTENT */}

              <div className="space-y-4 p-5">

                {/* STATUS */}

                <div
                  className={`
                    flex
                    items-center
                    justify-between
                    border
                    p-3
                    ${
                      selectedFlat.status === "Occupied"
                        ? "border-emerald-200 bg-emerald-50"
                        : selectedFlat.status ===
                          "Maintenance"
                        ? "border-amber-200 bg-amber-50"
                        : "border-slate-200 bg-slate-50"
                    }
                  `}
                >
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
                      Current Status
                    </p>

                    <p className="mt-1 text-[12px] font-extrabold text-slate-800">
                      {selectedFlat.status}
                    </p>
                  </div>

                  <span
                    className={`
                      h-3
                      w-3
                      ${getStatusDot(
                        selectedFlat.status
                      )}
                    `}
                  />
                </div>

                {/* BASIC INFORMATION */}

                <div className="grid grid-cols-2 gap-3">

                  <InfoBox
                    label="Block"
                    value={selectedFlat.block}
                  />

                  <InfoBox
                    label="Floor"
                    value={selectedFlat.floor}
                  />

                  <InfoBox
                    label="Flat Type"
                    value={selectedFlat.type}
                  />

                  <InfoBox
                    label="Flat Number"
                    value={selectedFlat.flatNo}
                  />

                </div>

                {/* RESIDENT */}

                {selectedFlat.resident ? (
                  <div className="border border-slate-200">

                    <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">

                      <div className="flex h-7 w-7 items-center justify-center bg-emerald-50 text-emerald-500">
                        <Users size={14} />
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-slate-800">
                          Resident Information
                        </p>

                        <p className="text-[8px] text-slate-400">
                          Assigned resident
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 p-4">

                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
                          Name
                        </p>

                        <p className="mt-1 text-[11px] font-bold text-slate-700">
                          {selectedFlat.resident.name}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Mail
                          size={13}
                          className="text-emerald-500"
                        />

                        <p className="break-all text-[10px] font-medium text-slate-600">
                          {selectedFlat.resident.email}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone
                          size={13}
                          className="text-emerald-500"
                        />

                        <p className="text-[10px] font-medium text-slate-600">
                          {selectedFlat.resident.phone ||
                            "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-medium text-slate-500">
                      No resident is currently assigned to this
                      flat.
                    </p>
                  </div>
                )}
              </div>

              {/* MODAL FOOTER */}

              <div className="flex justify-end border-t border-slate-200 px-5 py-3">

                <button
                  type="button"
                  onClick={() => setSelectedFlat(null)}
                  className="
                    border
                    border-slate-300
                    px-4
                    py-2
                    text-[10px]
                    font-bold
                    text-slate-600
                    transition
                    hover:border-emerald-300
                    hover:bg-emerald-50
                    hover:text-emerald-600
                  "
                >
                  Close
                </button>

              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

/* ==========================================
   INFO BOX
========================================== */

function InfoBox({ label, value }) {
  return (
    <div className="border border-slate-200 bg-white p-3 transition hover:border-emerald-200">
      <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-[11px] font-bold text-slate-700">
        {value}
      </p>
    </div>
  );
}

export default SocietyMap;