import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  Building2,
  Home,
  Users,
  Wrench,
  MapPinned,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

function SocietyMap() {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlat, setSelectedFlat] = useState(null);

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

  // ==========================================
  // GROUP FLATS DYNAMICALLY
  // BLOCK -> FLOOR -> FLATS
  // ==========================================

  const groupedFlats = useMemo(() => {
    return flats.reduce((groups, flat) => {
      const block = flat.block || "Other";
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
  // SORT BLOCKS
  // ==========================================

  const blocks = Object.keys(groupedFlats).sort(
    (a, b) => a.localeCompare(b)
  );

  // ==========================================
  // STATUS COUNTS
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
  // STATUS STYLE
  // ==========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Occupied":
        return "border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600";

      case "Maintenance":
        return "border-amber-400 bg-amber-400 text-slate-900 hover:bg-amber-500";

      case "Vacant":
      default:
        return "border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200";
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm font-medium text-slate-500">
            Loading society map...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="w-full min-w-0 max-w-full">

        {/* ====================================== */}
        {/* HEADER */}
        {/* ====================================== */}

        <div className="mb-6">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-500">
            Society Management
          </p>

          <h1 className="text-[22px] font-extrabold tracking-tight text-slate-900">
            Society Map
          </h1>

          <p className="mt-1 text-[11.5px] font-medium text-slate-400">
            View all blocks, floors and flats across the society.
          </p>
        </div>


        {/* ====================================== */}
        {/* STATS */}
        {/* ====================================== */}

        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">

          <div className="border border-slate-200 bg-white p-4">
            <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
              Total Flats
            </p>

            <p className="mt-2 text-[22px] font-extrabold text-slate-900">
              {stats.total}
            </p>
          </div>

          <div className="border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-[9px] font-bold uppercase tracking-wide text-emerald-600">
              Occupied
            </p>

            <p className="mt-2 text-[22px] font-extrabold text-emerald-700">
              {stats.occupied}
            </p>
          </div>

          <div className="border border-slate-200 bg-slate-50 p-4">
            <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">
              Vacant
            </p>

            <p className="mt-2 text-[22px] font-extrabold text-slate-700">
              {stats.vacant}
            </p>
          </div>

          <div className="border border-amber-200 bg-amber-50 p-4">
            <p className="text-[9px] font-bold uppercase tracking-wide text-amber-600">
              Maintenance
            </p>

            <p className="mt-2 text-[22px] font-extrabold text-amber-700">
              {stats.maintenance}
            </p>
          </div>

        </div>


        {/* ====================================== */}
        {/* LEGEND */}
        {/* ====================================== */}

        <div className="mb-6 flex flex-wrap items-center gap-4 border border-slate-200 bg-white px-4 py-3">

          <p className="mr-2 text-[10px] font-bold text-slate-500">
            STATUS:
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

        </div>


        {/* ====================================== */}
        {/* MAP */}
        {/* ====================================== */}

        {blocks.length === 0 ? (

          <div className="border border-slate-200 bg-white p-12 text-center">

            <MapPinned
              size={30}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-4 text-[14px] font-bold text-slate-700">
              No flats found
            </h2>

            <p className="mt-1 text-[10px] text-slate-400">
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

              return (

                <section
                  key={block}
                  className="border border-slate-300 bg-white"
                >

                  {/* BLOCK HEADER */}

                  <div className="flex items-center justify-between border-b border-slate-300 bg-slate-900 px-4 py-3">

                    <div className="flex items-center gap-2">

                      <Building2
                        size={16}
                        className="text-emerald-400"
                      />

                      <div>

                        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                          Society Block
                        </p>

                        <h2 className="text-[14px] font-extrabold text-white">
                          Block {block}
                        </h2>

                      </div>

                    </div>

                    <span className="border border-white/10 px-2 py-1 text-[9px] font-bold text-slate-300">
                      {floors.length} Floors
                    </span>

                  </div>


                  {/* FLOORS */}

                  <div className="p-4">

                    {floors.map((floor) => {

                      const floorFlats =
                        groupedFlats[block][floor];

                      return (

                        <div
                          key={floor}
                          className="border-b border-slate-200 py-4 last:border-b-0"
                        >

                          <div className="mb-3 flex items-center gap-2">

                            <span className="min-w-[65px] bg-slate-100 px-2 py-1 text-center text-[9px] font-bold text-slate-600">
                              Floor {floor}
                            </span>

                            <div className="h-px flex-1 bg-slate-100" />

                          </div>


                          {/* FLATS */}

                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">

                            {floorFlats
                              .sort((a, b) =>
                                a.flatNo.localeCompare(
                                  b.flatNo,
                                  undefined,
                                  {
                                    numeric: true,
                                  }
                                )
                              )
                              .map((flat) => (

                                <button
                                  key={flat._id}
                                  type="button"
                                  onClick={() =>
                                    setSelectedFlat(flat)
                                  }
                                  className={`
                                    relative
                                    min-h-[75px]
                                    border
                                    p-3
                                    text-left
                                    transition-all
                                    ${getStatusClass(
                                      flat.status
                                    )}
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
        {/* FLAT DETAILS PANEL */}
        {/* ====================================== */}

        {selectedFlat && (

          <div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 p-4 md:items-center"
            onClick={() =>
              setSelectedFlat(null)
            }
          >

            <div
              className="w-full max-w-md border border-slate-300 bg-white shadow-2xl"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

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
                  className="border border-slate-200 px-3 py-1.5 text-[10px] font-bold text-slate-500 hover:bg-slate-50"
                >
                  Close
                </button>

              </div>


              <div className="space-y-4 p-5">

                <div className="grid grid-cols-2 gap-3">

                  <div className="border border-slate-200 p-3">
                    <p className="text-[8px] font-bold uppercase text-slate-400">
                      Block
                    </p>

                    <p className="mt-1 text-[11px] font-bold text-slate-700">
                      {selectedFlat.block}
                    </p>
                  </div>

                  <div className="border border-slate-200 p-3">
                    <p className="text-[8px] font-bold uppercase text-slate-400">
                      Floor
                    </p>

                    <p className="mt-1 text-[11px] font-bold text-slate-700">
                      {selectedFlat.floor}
                    </p>
                  </div>

                  <div className="border border-slate-200 p-3">
                    <p className="text-[8px] font-bold uppercase text-slate-400">
                      Type
                    </p>

                    <p className="mt-1 text-[11px] font-bold text-slate-700">
                      {selectedFlat.type}
                    </p>
                  </div>

                  <div className="border border-slate-200 p-3">
                    <p className="text-[8px] font-bold uppercase text-slate-400">
                      Status
                    </p>

                    <p className="mt-1 text-[11px] font-bold text-slate-700">
                      {selectedFlat.status}
                    </p>
                  </div>

                </div>


                {/* RESIDENT */}

                {selectedFlat.resident ? (

                  <div className="border border-slate-200 p-4">

                    <div className="mb-3 flex items-center gap-2">

                      <Users
                        size={15}
                        className="text-emerald-500"
                      />

                      <p className="text-[10px] font-bold text-slate-700">
                        Resident Information
                      </p>

                    </div>

                    <div className="space-y-2">

                      <p className="text-[10px] text-slate-500">
                        <span className="font-bold text-slate-700">
                          Name:
                        </span>{" "}
                        {selectedFlat.resident.name}
                      </p>

                      <p className="text-[10px] text-slate-500">
                        <span className="font-bold text-slate-700">
                          Email:
                        </span>{" "}
                        {selectedFlat.resident.email}
                      </p>

                      <p className="text-[10px] text-slate-500">
                        <span className="font-bold text-slate-700">
                          Phone:
                        </span>{" "}
                        {selectedFlat.resident.phone ||
                          "Not provided"}
                      </p>

                    </div>

                  </div>

                ) : (

                  <div className="border border-slate-200 bg-slate-50 p-4">

                    <p className="text-[10px] font-medium text-slate-500">
                      No resident is currently assigned to this flat.
                    </p>

                  </div>

                )}

              </div>

            </div>

          </div>

        )}

      </div>
    </DashboardLayout>
  );
}

export default SocietyMap;