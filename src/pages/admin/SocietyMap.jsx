import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  Building2,
  Home,
  User,
  Mail,
  Phone,
  Layers3,
  RefreshCw,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

function SocietyMap() {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFlat, setSelectedFlat] = useState(null);

  // ==========================================
  // FETCH FLATS
  // ==========================================

  const fetchFlats = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFlats();
  }, []);

  // ==========================================
  // GROUP FLATS BY BLOCK
  // ==========================================

  const blocks = useMemo(() => {
    const grouped = {};

    flats.forEach((flat) => {
      if (!grouped[flat.block]) {
        grouped[flat.block] = [];
      }

      grouped[flat.block].push(flat);
    });

    return Object.entries(grouped).sort(([a], [b]) =>
      a.localeCompare(b)
    );
  }, [flats]);

  // ==========================================
  // STATISTICS
  // ==========================================

  const stats = useMemo(() => {
    return {
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

      blocks: blocks.length,
    };
  }, [flats, blocks]);

  // ==========================================
  // STATUS STYLING
  // ==========================================

  const getStatusStyles = (status) => {
    switch (status) {
      case "Occupied":
        return {
          box: "border-emerald-300 bg-emerald-50 hover:bg-emerald-100",
          icon: "bg-emerald-500 text-white",
          text: "text-emerald-700",
          label: "Occupied",
        };

      case "Maintenance":
        return {
          box: "border-amber-300 bg-amber-50 hover:bg-amber-100",
          icon: "bg-amber-500 text-white",
          text: "text-amber-700",
          label: "Maintenance",
        };

      default:
        return {
          box: "border-slate-300 bg-slate-50 hover:bg-slate-100",
          icon: "bg-slate-400 text-white",
          text: "text-slate-600",
          label: "Vacant",
        };
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-500" />

            <p className="text-[11px] font-semibold text-slate-500">
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

      <div className="w-full min-w-0">

        {/* ====================================== */}
        {/* HEADER */}
        {/* ====================================== */}

        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">

          <div>

            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-500">
              Society Overview
            </p>

            <h1 className="text-[21px] font-extrabold tracking-tight text-slate-900">
              Society Map
            </h1>

            <p className="mt-1 text-[11px] font-medium text-slate-400">
              Live overview of blocks, flats and occupancy status.
            </p>

          </div>

          <button
            type="button"
            onClick={() => fetchFlats(true)}
            disabled={refreshing}
            className="flex h-9 items-center justify-center gap-2 self-start border border-slate-200 bg-white px-3 text-[10px] font-bold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600 disabled:opacity-60 md:self-auto"
          >
            <RefreshCw
              size={13}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh Map
          </button>

        </div>


        {/* ====================================== */}
        {/* STATISTICS */}
        {/* ====================================== */}

        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">

          {/* TOTAL */}

          <div className="border border-slate-200 bg-white p-4">

            <div className="mb-3 flex h-8 w-8 items-center justify-center bg-slate-100 text-slate-500">
              <Building2 size={15} />
            </div>

            <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
              Total Flats
            </p>

            <p className="mt-1 text-[20px] font-extrabold text-slate-900">
              {stats.total}
            </p>

          </div>


          {/* OCCUPIED */}

          <div className="border border-emerald-200 bg-emerald-50/50 p-4">

            <div className="mb-3 flex h-8 w-8 items-center justify-center bg-emerald-500 text-white">
              <Home size={15} />
            </div>

            <p className="text-[9px] font-bold uppercase tracking-wide text-emerald-600">
              Occupied
            </p>

            <p className="mt-1 text-[20px] font-extrabold text-emerald-700">
              {stats.occupied}
            </p>

          </div>


          {/* VACANT */}

          <div className="border border-slate-200 bg-slate-50 p-4">

            <div className="mb-3 flex h-8 w-8 items-center justify-center bg-slate-400 text-white">
              <Home size={15} />
            </div>

            <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">
              Vacant
            </p>

            <p className="mt-1 text-[20px] font-extrabold text-slate-700">
              {stats.vacant}
            </p>

          </div>


          {/* MAINTENANCE */}

          <div className="border border-amber-200 bg-amber-50/50 p-4">

            <div className="mb-3 flex h-8 w-8 items-center justify-center bg-amber-500 text-white">
              <Layers3 size={15} />
            </div>

            <p className="text-[9px] font-bold uppercase tracking-wide text-amber-600">
              Maintenance
            </p>

            <p className="mt-1 text-[20px] font-extrabold text-amber-700">
              {stats.maintenance}
            </p>

          </div>


          {/* BLOCKS */}

          <div className="border border-slate-200 bg-white p-4">

            <div className="mb-3 flex h-8 w-8 items-center justify-center bg-indigo-500 text-white">
              <Building2 size={15} />
            </div>

            <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
              Blocks
            </p>

            <p className="mt-1 text-[20px] font-extrabold text-slate-900">
              {stats.blocks}
            </p>

          </div>

        </div>


        {/* ====================================== */}
        {/* LEGEND */}
        {/* ====================================== */}

        <div className="mb-5 flex flex-wrap items-center gap-4 border border-slate-200 bg-white px-4 py-3">

          <p className="mr-2 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
            Status
          </p>

          <div className="flex items-center gap-2">

            <span className="h-3 w-3 bg-emerald-500" />

            <span className="text-[10px] font-semibold text-slate-600">
              Occupied
            </span>

          </div>

          <div className="flex items-center gap-2">

            <span className="h-3 w-3 bg-slate-400" />

            <span className="text-[10px] font-semibold text-slate-600">
              Vacant
            </span>

          </div>

          <div className="flex items-center gap-2">

            <span className="h-3 w-3 bg-amber-500" />

            <span className="text-[10px] font-semibold text-slate-600">
              Maintenance
            </span>

          </div>

        </div>


        {/* ====================================== */}
        {/* SOCIETY MAP */}
        {/* ====================================== */}

        {blocks.length === 0 ? (

          <div className="border border-slate-200 bg-white py-20 text-center">

            <Building2
              size={35}
              className="mx-auto mb-3 text-slate-300"
            />

            <h3 className="text-[13px] font-bold text-slate-700">
              No Flats Found
            </h3>

            <p className="mt-1 text-[10px] font-medium text-slate-400">
              Add flats from the Flats management section.
            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {blocks.map(([blockName, blockFlats]) => {

              // Group flats inside block by floor

              const floors = {};

              blockFlats.forEach((flat) => {

                if (!floors[flat.floor]) {
                  floors[flat.floor] = [];
                }

                floors[flat.floor].push(flat);

              });

              const sortedFloors = Object.entries(
                floors
              ).sort(
                ([a], [b]) =>
                  Number(b) - Number(a)
              );

              return (

                <section
                  key={blockName}
                  className="border border-slate-200 bg-white"
                >

                  {/* BLOCK HEADER */}

                  <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center bg-slate-900 text-white">
                        <Building2 size={16} />
                      </div>

                      <div>

                        <h2 className="text-[14px] font-extrabold text-slate-900">
                          Block {blockName}
                        </h2>

                        <p className="mt-0.5 text-[9px] font-medium text-slate-400">
                          {blockFlats.length}{" "}
                          {blockFlats.length === 1
                            ? "Flat"
                            : "Flats"}
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* FLOORS */}

                  <div className="space-y-5 p-5">

                    {sortedFloors.map(
                      ([floor, floorFlats]) => (

                        <div key={floor}>

                          {/* FLOOR LABEL */}

                          <div className="mb-3 flex items-center gap-2">

                            <div className="h-px flex-1 bg-slate-100" />

                            <span className="bg-slate-100 px-2.5 py-1 text-[8px] font-bold uppercase tracking-wide text-slate-500">
                              Floor {floor}
                            </span>

                            <div className="h-px flex-1 bg-slate-100" />

                          </div>


                          {/* FLATS */}

                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">

                            {floorFlats.map((flat) => {

                              const styles =
                                getStatusStyles(
                                  flat.status
                                );

                              return (

                                <button
                                  key={flat._id}
                                  type="button"
                                  onClick={() =>
                                    setSelectedFlat(
                                      flat
                                    )
                                  }
                                  className={`
                                    group
                                    border
                                    p-3
                                    text-left
                                    transition-all
                                    ${styles.box}
                                  `}
                                >

                                  <div className="flex items-start justify-between gap-2">

                                    <div
                                      className={`
                                        flex
                                        h-7
                                        w-7
                                        shrink-0
                                        items-center
                                        justify-center
                                        ${styles.icon}
                                      `}
                                    >
                                      <Home size={13} />
                                    </div>

                                    <span
                                      className={`
                                        text-[8px]
                                        font-bold
                                        ${styles.text}
                                      `}
                                    >
                                      {flat.status}
                                    </span>

                                  </div>


                                  <p className="mt-3 text-[11px] font-extrabold text-slate-800">
                                    {flat.flatNo}
                                  </p>

                                  <p className="mt-0.5 text-[8px] font-medium text-slate-400">
                                    {flat.type}
                                  </p>

                                </button>

                              );

                            })}

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </section>

              );

            })}

          </div>

        )}


        {/* ====================================== */}
        {/* FLAT DETAILS */}
        {/* ====================================== */}

        {selectedFlat && (

          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4"
            onClick={() => setSelectedFlat(null)}
          >

            <div
              className="w-full max-w-md border border-slate-200 bg-white shadow-2xl"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* MODAL HEADER */}

              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-500">
                    Flat Details
                  </p>

                  <h2 className="mt-1 text-[18px] font-extrabold text-slate-900">
                    {selectedFlat.flatNo}
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedFlat(null)
                  }
                  className="flex h-7 w-7 items-center justify-center border border-slate-200 text-slate-400 transition hover:border-red-300 hover:text-red-500"
                >
                  ×
                </button>

              </div>


              {/* DETAILS */}

              <div className="space-y-4 p-5">

                {/* STATUS */}

                <div className="border border-slate-200 p-4">

                  <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
                    Status
                  </p>

                  <p
                    className={`
                      mt-1
                      text-[12px]
                      font-extrabold
                      ${
                        selectedFlat.status ===
                        "Occupied"
                          ? "text-emerald-600"
                          : selectedFlat.status ===
                            "Maintenance"
                          ? "text-amber-600"
                          : "text-slate-500"
                      }
                    `}
                  >
                    {selectedFlat.status}
                  </p>

                </div>


                {/* FLAT INFO */}

                <div className="grid grid-cols-2 gap-3">

                  <div className="border border-slate-200 p-3">

                    <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
                      Block
                    </p>

                    <p className="mt-1 text-[11px] font-bold text-slate-700">
                      {selectedFlat.block}
                    </p>

                  </div>

                  <div className="border border-slate-200 p-3">

                    <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
                      Floor
                    </p>

                    <p className="mt-1 text-[11px] font-bold text-slate-700">
                      {selectedFlat.floor}
                    </p>

                  </div>

                  <div className="border border-slate-200 p-3">

                    <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
                      Type
                    </p>

                    <p className="mt-1 text-[11px] font-bold text-slate-700">
                      {selectedFlat.type}
                    </p>

                  </div>

                </div>


                {/* RESIDENT */}

                <div className="border border-slate-200">

                  <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">

                    <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">
                      Resident Information
                    </p>

                  </div>

                  {selectedFlat.resident ? (

                    <div className="space-y-3 p-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center bg-emerald-500 text-white">
                          <User size={15} />
                        </div>

                        <div>

                          <p className="text-[11px] font-bold text-slate-800">
                            {selectedFlat.resident.name}
                          </p>

                          <p className="text-[9px] text-slate-400">
                            Resident
                          </p>

                        </div>

                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-500">

                        <Mail size={13} />

                        {selectedFlat.resident.email}

                      </div>

                      {selectedFlat.resident.phone && (

                        <div className="flex items-center gap-2 text-[10px] text-slate-500">

                          <Phone size={13} />

                          {selectedFlat.resident.phone}

                        </div>

                      )}

                    </div>

                  ) : (

                    <div className="p-4">

                      <p className="text-[10px] font-medium text-slate-400">
                        No resident is currently assigned to this flat.
                      </p>

                    </div>

                  )}

                </div>

              </div>

            </div>

          </div>

        )}

      </div>

    </DashboardLayout>
  );
}

export default SocietyMap;