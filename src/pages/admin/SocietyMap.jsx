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

const API_URL =
  "https://smart-society-backend-delta.vercel.app";

function SocietyMap() {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedFlat, setSelectedFlat] = useState(null);
  const [hoveredFlat, setHoveredFlat] = useState(null);

  // =====================================================
  // FETCH FLATS
  // =====================================================

  const fetchFlats = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        return;
      }

      const response = await axios.get(
        `${API_URL}/admin/flats`,
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
          response.data.message ||
            "Failed to load society map"
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

  // =====================================================
  // GROUP FLATS
  // BLOCK -> FLOOR -> FLATS
  // =====================================================

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

  // =====================================================
  // BLOCKS
  // =====================================================

  const blocks = Object.keys(groupedFlats).sort(
    (a, b) => a.localeCompare(b)
  );

  // =====================================================
  // STATS
  // =====================================================

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

  // =====================================================
  // STATUS CARD STYLING
  // =====================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Occupied":
        return `
          border-[#d9be82]
          bg-[#9b7740]
          text-white
          hover:bg-[#9b7740]
          hover:border-[#bca16a]
        `;

      case "Maintenance":
        return `
          border-[#d9be82]
          bg-[#bca16a]
          text-[#32143b]
          hover:bg-[#9b7740]
          hover:border-[#bca16a]
        `;

      case "Vacant":
      default:
        return `
          border-[#e2d9df]
          bg-[#f7f3ed]
          text-[#756b78]
          hover:bg-[#eee8ed]
          hover:border-[#bca9c0]
        `;
    }
  };

  // =====================================================
  // STATUS DOT
  // =====================================================

  const getStatusDot = (status) => {
    switch (status) {
      case "Occupied":
        return "bg-[#9b7740]";

      case "Maintenance":
        return "bg-[#bca16a]";

      default:
        return "bg-[#bca9c0]";
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#9b7740] border-t-transparent" />

            <p className="mt-4 text-[11px] font-medium text-[#8b778e]">
              Loading society map...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <DashboardLayout role="admin">
      <div className="w-full min-w-0 max-w-full">

        {/* ================================================= */}
        {/* PAGE HEADER */}
        {/* ================================================= */}

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#9b7740]">
              Society Management
            </p>

            <h1 className="text-[20px] font-extrabold tracking-tight text-[#32143b] md:text-[22px]">
              Society Map
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-[#8b778e]">
              Visual overview of blocks, floors and flats across the society.
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-[1px] border border-[#e2d9df] bg-white px-3 py-2 sm:flex">
            <MapPinned
              size={14}
              className="text-[#9b7740]"
            />

            <span className="text-[10px] font-semibold text-[#756b78]">
              {blocks.length} Blocks
            </span>
          </div>

        </div>

        {/* ================================================= */}
        {/* STATS */}
        {/* ================================================= */}

        <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">

          {/* TOTAL */}

          <div className="relative overflow-hidden rounded-[1px] border border-[#e2d9df] bg-white p-5">

            <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-[#32143b] opacity-[0.04]" />

            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#eee8ed] text-[#756b78]">
              <Building2 size={20} />
            </div>

            <p className="text-[9.5px] font-bold uppercase tracking-[0.05em] text-[#8b778e]">
              Total Flats
            </p>

            <p className="mt-1 text-[28px] font-extrabold leading-none tracking-tight text-[#32143b]">
              {stats.total}
            </p>

            <p className="mt-2 text-[10.5px] font-medium text-[#8b778e]">
              All registered flats
            </p>

          </div>

          {/* OCCUPIED */}

          <div className="relative overflow-hidden rounded-[1px] border border-[#e2d9df] bg-white p-5">

            <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-[#9b7740] opacity-[0.06]" />

            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#f7f3ed] text-[#9b7740]">
              <Users size={20} />
            </div>

            <p className="text-[9.5px] font-bold uppercase tracking-[0.05em] text-[#9b7740]">
              Occupied
            </p>

            <p className="mt-1 text-[28px] font-extrabold leading-none tracking-tight text-[#32143b]">
              {stats.occupied}
            </p>

            <p className="mt-2 text-[10.5px] font-medium text-[#8b778e]">
              Currently occupied
            </p>

          </div>

          {/* VACANT */}

          <div className="relative overflow-hidden rounded-[1px] border border-[#e2d9df] bg-white p-5">

            <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-[#756b78] opacity-[0.05]" />

            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#eee8ed] text-[#756b78]">
              <Home size={20} />
            </div>

            <p className="text-[9.5px] font-bold uppercase tracking-[0.05em] text-[#756b78]">
              Vacant
            </p>

            <p className="mt-1 text-[28px] font-extrabold leading-none tracking-tight text-[#32143b]">
              {stats.vacant}
            </p>

            <p className="mt-2 text-[10.5px] font-medium text-[#8b778e]">
              Available flats
            </p>

          </div>

          {/* MAINTENANCE */}

          <div className="relative overflow-hidden rounded-[1px] border border-[#e2d9df] bg-white p-5">

            <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-[#9b7740] opacity-[0.06]" />

            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#f7f3ed] text-[#9b7740]">
              <Building2 size={20} />
            </div>

            <p className="text-[9.5px] font-bold uppercase tracking-[0.05em] text-[#9b7740]">
              Maintenance
            </p>

            <p className="mt-1 text-[28px] font-extrabold leading-none tracking-tight text-[#32143b]">
              {stats.maintenance}
            </p>

            <p className="mt-2 text-[10.5px] font-medium text-[#8b778e]">
              Under maintenance
            </p>

          </div>

        </div>

        {/* ================================================= */}
        {/* LEGEND */}
        {/* ================================================= */}

        <div className="mb-6 flex flex-wrap items-center gap-5 rounded-[1px] border border-[#e2d9df] bg-white px-4 py-3">

          <div className="mr-1 flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#756b78]">
              STATUS
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-[1px] bg-[#9b7740]" />

            <span className="text-[10px] font-semibold text-[#756b78]">
              Occupied
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-[1px] bg-[#bca9c0]" />

            <span className="text-[10px] font-semibold text-[#756b78]">
              Vacant
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-[1px] bg-[#bca16a]" />

            <span className="text-[10px] font-semibold text-[#756b78]">
              Maintenance
            </span>
          </div>

          <div className="ml-auto hidden text-[9px] font-medium text-[#8b778e] md:block">
            Hover for quick information • Click for full details
          </div>

        </div>

        {/* ================================================= */}
        {/* MAP */}
        {/* ================================================= */}

        {blocks.length === 0 ? (

          <div className="rounded-[1px] border border-[#e2d9df] bg-white p-12 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#f7f3ed] text-[#bca9c0]">
              <MapPinned size={28} />
            </div>

            <h2 className="mt-4 text-[14px] font-bold text-[#49394d]">
              No flats found
            </h2>

            <p className="mt-1 text-[10px] font-medium text-[#8b778e]">
              Add flats from the Flats management section.
            </p>

          </div>

        ) : (

          <div className="grid gap-5 xl:grid-cols-2">

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
                  className="overflow-hidden rounded-[1px] border border-[#e2d9df] bg-white"
                >

                  {/* ================================================= */}
                  {/* BLOCK HEADER */}
                  {/* ================================================= */}

                  <div className="flex items-center justify-between bg-[#32143b] px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                        <Building2
                          size={16}
                          className="text-[#bca16a]"
                        />
                      </div>

                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#756b78]">
                          Society Block
                        </p>

                        <h2 className="mt-0.5 text-[14px] font-extrabold text-white">
                          Block {block}
                        </h2>
                      </div>

                    </div>

                    <div className="text-right">
                      <p className="text-[12px] font-bold text-white">
                        {blockFlats.length}
                      </p>

                      <p className="text-[8px] font-medium text-[#756b78]">
                        Flats
                      </p>
                    </div>

                  </div>

                  {/* ================================================= */}
                  {/* FLOORS */}
                  {/* ================================================= */}

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
                          className="border-b border-[#e2d9df] py-4 last:border-b-0"
                        >

                          {/* FLOOR HEADER */}

                          <div className="mb-3 flex items-center gap-3">

                            <div className="flex items-center gap-2">
                              <Layers3
                                size={13}
                                className="text-[#9b7740]"
                              />

                              <span className="text-[9px] font-bold uppercase tracking-wide text-[#756b78]">
                                Floor {floor}
                              </span>
                            </div>

                            <div className="h-px flex-1 bg-[#eee8ed]" />

                            <span className="text-[8px] font-semibold text-[#8b778e]">
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
                                  rounded-[1px]
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

                                <Home
                                  size={15}
                                  className="mb-2 opacity-80"
                                />

                                <p className="text-[11px] font-extrabold">
                                  {flat.flatNo}
                                </p>

                                <p className="mt-0.5 text-[8px] font-medium opacity-80">
                                  {flat.type}
                                </p>

                                {/* ================================================= */}
                                {/* HOVER POPUP */}
                                {/* ================================================= */}

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
                                      overflow-hidden
                                      rounded-xl
                                      border
                                      border-[#49394d]
                                      bg-[#32143b]
                                      p-3
                                      text-left
                                      shadow-2xl
                                    "
                                  >

                                    {/* POPUP TITLE */}

                                    <div className="border-b border-white/10 pb-2">

                                      <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#bca16a]">
                                        Flat Information
                                      </p>

                                      <p className="mt-1 text-[12px] font-extrabold text-white">
                                        {flat.flatNo}
                                      </p>

                                    </div>

                                    {/* DETAILS */}

                                    <div className="mt-2 space-y-1.5">

                                      <div className="flex justify-between gap-3">
                                        <span className="text-[9px] text-[#756b78]">
                                          Block
                                        </span>

                                        <span className="text-[9px] font-bold text-[#e2d9df]">
                                          {flat.block}
                                        </span>
                                      </div>

                                      <div className="flex justify-between gap-3">
                                        <span className="text-[9px] text-[#756b78]">
                                          Floor
                                        </span>

                                        <span className="text-[9px] font-bold text-[#e2d9df]">
                                          {flat.floor}
                                        </span>
                                      </div>

                                      <div className="flex justify-between gap-3">
                                        <span className="text-[9px] text-[#756b78]">
                                          Type
                                        </span>

                                        <span className="text-[9px] font-bold text-[#e2d9df]">
                                          {flat.type}
                                        </span>
                                      </div>

                                      <div className="flex justify-between gap-3">
                                        <span className="text-[9px] text-[#756b78]">
                                          Status
                                        </span>

                                        <span
                                          className={`
                                            text-[9px]
                                            font-bold
                                            ${
                                              flat.status ===
                                              "Occupied"
                                                ? "text-[#bca16a]"
                                                : flat.status ===
                                                  "Maintenance"
                                                ? "text-[#bca16a]"
                                                : "text-[#bca9c0]"
                                            }
                                          `}
                                        >
                                          {flat.status}
                                        </span>
                                      </div>

                                    </div>

                                    {/* RESIDENT */}

                                    <div className="mt-3 border-t border-white/10 pt-2">

                                      <p className="text-[8px] font-bold uppercase tracking-wide text-[#756b78]">
                                        Resident
                                      </p>

                                      {flat.resident ? (
                                        <>
                                          <p className="mt-1 text-[9px] font-bold text-white">
                                            {flat.resident.name}
                                          </p>

                                          <p className="mt-0.5 truncate text-[8px] text-[#8b778e]">
                                            {flat.resident.email}
                                          </p>
                                        </>
                                      ) : (
                                        <p className="mt-1 text-[8px] text-[#8b778e]">
                                          No resident assigned
                                        </p>
                                      )}

                                    </div>

                                    {/* HINT */}

                                    <div className="mt-3 border-t border-white/10 pt-2">
                                      <p className="text-[8px] font-medium text-[#756b78]">
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

        {/* ================================================= */}
        {/* FULL DETAILS MODAL */}
        {/* ================================================= */}

        {selectedFlat && (

          <div
            className="
              fixed
              inset-0
              z-[200]
              flex
              items-end
              justify-center
              bg-[#210c28]/60
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
                rounded-xl
                border
                border-[#e2d9df]
                bg-white
                shadow-2xl
              "
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* ================================================= */}
              {/* MODAL HEADER */}
              {/* ================================================= */}

              <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#9b7740]">
                    Flat Details
                  </p>

                  <h2 className="mt-1 text-[19px] font-extrabold text-[#32143b]">
                    {selectedFlat.flatNo}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedFlat(null)
                  }
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-[#e2d9df]
                    text-[#8b778e]
                    transition
                    hover:bg-[#f7f3ed]
                    hover:text-[#49394d]
                  "
                >
                  <X size={15} />
                </button>

              </div>

              {/* ================================================= */}
              {/* MODAL CONTENT */}
              {/* ================================================= */}

              <div className="space-y-4 p-5">

                {/* STATUS */}

                <div
                  className={`
                    flex
                    items-center
                    justify-between
                    rounded-[1px]
                    border
                    p-3
                    ${
                      selectedFlat.status ===
                      "Occupied"
                        ? "border-[#e2d9df] bg-[#f7f3ed]"
                        : selectedFlat.status ===
                          "Maintenance"
                        ? "border-[#e2d9df] bg-[#f7f3ed]"
                        : "border-[#e2d9df] bg-[#f7f3ed]"
                    }
                  `}
                >

                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Current Status
                    </p>

                    <p className="mt-1 text-[12px] font-extrabold text-[#49394d]">
                      {selectedFlat.status}
                    </p>
                  </div>

                  <span
                    className={`
                      h-3
                      w-3
                      rounded-[1px]
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

                  <div className="overflow-hidden rounded-[1px] border border-[#e2d9df]">

                    <div className="flex items-center gap-2 border-b border-[#e2d9df] bg-[#f7f3ed] px-4 py-3">

                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f7f3ed] text-[#9b7740]">
                        <Users size={14} />
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-[#49394d]">
                          Resident Information
                        </p>

                        <p className="text-[8px] text-[#8b778e]">
                          Assigned resident
                        </p>
                      </div>

                    </div>

                    <div className="space-y-3 p-4">

                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-wide text-[#8b778e]">
                          Name
                        </p>

                        <p className="mt-1 text-[11px] font-bold text-[#49394d]">
                          {selectedFlat.resident.name}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">

                        <Mail
                          size={13}
                          className="shrink-0 text-[#8b778e]"
                        />

                        <p className="break-all text-[10px] font-medium text-[#756b78]">
                          {selectedFlat.resident.email}
                        </p>

                      </div>

                      <div className="flex items-center gap-2">

                        <Phone
                          size={13}
                          className="shrink-0 text-[#8b778e]"
                        />

                        <p className="text-[10px] font-medium text-[#756b78]">
                          {selectedFlat.resident.phone ||
                            "Not provided"}
                        </p>

                      </div>

                    </div>

                  </div>

                ) : (

                  <div className="rounded-[1px] border border-[#e2d9df] bg-[#f7f3ed] p-4">

                    <p className="text-[10px] font-medium text-[#756b78]">
                      No resident is currently assigned to this flat.
                    </p>

                  </div>

                )}

              </div>

              {/* ================================================= */}
              {/* MODAL FOOTER */}
              {/* ================================================= */}

              <div className="flex justify-end border-t border-[#e2d9df] px-5 py-3">

                <button
                  type="button"
                  onClick={() =>
                    setSelectedFlat(null)
                  }
                  className="
                    rounded-[1px]
                    border
                    border-[#bca9c0]
                    px-4
                    py-2
                    text-[10px]
                    font-bold
                    text-[#756b78]
                    transition
                    hover:bg-[#f7f3ed]
                    hover:text-[#49394d]
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

// =====================================================
// INFO BOX
// =====================================================

function InfoBox({ label, value }) {
  return (
    <div className="rounded-[1px] border border-[#e2d9df] bg-white p-3">
      <p className="text-[8px] font-bold uppercase tracking-wide text-[#8b778e]">
        {label}
      </p>

      <p className="mt-1 text-[11px] font-bold text-[#49394d]">
        {value}
      </p>
    </div>
  );
}

export default SocietyMap;