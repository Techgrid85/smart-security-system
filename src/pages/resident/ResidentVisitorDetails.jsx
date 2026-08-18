import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  Users,
  RefreshCw,
  Eye,
  X,
  Download,
  CheckCircle2,
  Clock3,
  AlertCircle,
  UserCheck,
  CalendarDays,
  Phone,
  Mail,
  MapPin,
  FileText,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

const API_URL = "https://smart-society-backend-delta.vercel.app";

function ResidentVisitorDetails() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // ================================
  // AUTH HEADERS
  // ================================
  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // ================================
  // GET ALL RESIDENT VISITORS
  // ================================
  const fetchVisitors = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/resident/visitors`,
        {
          headers: getHeaders(),
        }
      );

      if (response.data.success) {
        setVisitors(response.data.data || []);
      } else {
        toast.error(
          response.data.message || "Failed to load visitors"
        );
      }
    } catch (error) {
      console.error("Get Visitors Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load visitors"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  // ================================
  // GET SINGLE VISITOR DETAILS
  // ================================
  const handleViewVisitor = async (id) => {
    try {
      setDetailLoading(true);
      setSelectedVisitor(null);

      const response = await axios.get(
        `${API_URL}/resident/visitors/${id}`,
        {
          headers: getHeaders(),
        }
      );

      if (response.data.success) {
        setSelectedVisitor(response.data.data);
      } else {
        toast.error(
          response.data.message ||
            "Failed to load visitor details"
        );
      }
    } catch (error) {
      console.error("Get Visitor Detail Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load visitor details"
      );
    } finally {
      setDetailLoading(false);
    }
  };

  // ================================
  // FORMAT DATE
  // ================================
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ================================
  // FORMAT TIME
  // ================================
  const formatTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleTimeString("en-PK", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ================================
  // DOWNLOAD VISITOR PASS
  // ================================
  const handleDownloadPass = () => {
    if (!selectedVisitor) return;

    const passWindow = window.open("", "_blank");

    if (!passWindow) {
      toast.error("Please allow popups to download the pass");
      return;
    }

    passWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Visitor Pass</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 30px;
              font-family: Arial, sans-serif;
              background: #f7f3ed;
              color: #32143b;
            }

            .pass {
              max-width: 700px;
              margin: auto;
              background: white;
              border: 2px solid #9b7740;
              border-radius: 16px;
              overflow: hidden;
            }

            .header {
              background: #9b7740;
              color: white;
              padding: 25px;
            }

            .header h1 {
              margin: 0;
              font-size: 26px;
            }

            .header p {
              margin: 8px 0 0;
              font-size: 14px;
              opacity: 0.9;
            }

            .content {
              padding: 25px;
            }

            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 18px;
            }

            .item {
              padding: 12px;
              background: #f7f3ed;
              border-radius: 10px;
            }

            .label {
              font-size: 11px;
              font-weight: bold;
              color: #756b78;
              text-transform: uppercase;
              margin-bottom: 6px;
            }

            .value {
              font-size: 15px;
              font-weight: bold;
              color: #32143b;
            }

            .status {
              display: inline-block;
              margin-top: 20px;
              padding: 8px 14px;
              border-radius: 20px;
              background: #f7f3ed;
              color: #9b7740;
              font-size: 13px;
              font-weight: bold;
            }

            .footer {
              padding: 18px 25px;
              border-top: 1px solid #e2d9df;
              color: #756b78;
              font-size: 12px;
            }

            @media print {
              body {
                padding: 0;
                background: white;
              }

              .pass {
                border: 1px solid #9b7740;
              }
            }
          </style>
        </head>

        <body>

          <div class="pass">

            <div class="header">
              <h1>SmartSociety Visitor Pass</h1>
              <p>Visitor Entry Authorization</p>
            </div>

            <div class="content">

              <div class="grid">

                <div class="item">
                  <div class="label">Visitor Name</div>
                  <div class="value">
                    ${selectedVisitor.visitorName || "-"}
                  </div>
                </div>

                <div class="item">
                  <div class="label">Phone Number</div>
                  <div class="value">
                    ${selectedVisitor.phone || "-"}
                  </div>
                </div>

                <div class="item">
                  <div class="label">Email</div>
                  <div class="value">
                    ${selectedVisitor.email || "-"}
                  </div>
                </div>

                <div class="item">
                  <div class="label">Flat Number</div>
                  <div class="value">
                    ${selectedVisitor.flatNo || "-"}
                  </div>
                </div>

                <div class="item">
                  <div class="label">Visit Date</div>
                  <div class="value">
                    ${formatDate(selectedVisitor.visitDate)}
                  </div>
                </div>

                <div class="item">
                  <div class="label">Entry Time</div>
                  <div class="value">
                    ${formatTime(selectedVisitor.visitStartTime)}
                  </div>
                </div>

                <div class="item">
                  <div class="label">Exit Time</div>
                  <div class="value">
                    ${formatTime(selectedVisitor.visitEndTime)}
                  </div>
                </div>

                <div class="item">
                  <div class="label">Purpose</div>
                  <div class="value">
                    ${selectedVisitor.purpose || "-"}
                  </div>
                </div>

              </div>

              <div class="status">
                Status: ${selectedVisitor.status || "Pending"}
              </div>

            </div>

            <div class="footer">
              Pass ID: ${selectedVisitor._id || "-"}
            </div>

          </div>

          <script>
            window.onload = function () {
              window.print();
            };
          </script>

        </body>
      </html>
    `);

    passWindow.document.close();

    toast.success("Visitor pass opened for download");
  };

  return (
    <DashboardLayout role="resident">
      <div className="w-full min-w-0 max-w-full">

        {/* ================= HEADER ================= */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#9b7740]">
              Resident Portal
            </p>

            <h1 className="text-[20px] font-extrabold tracking-tight text-[#32143b] md:text-[22px]">
              Visitor Details
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-[#8b778e]">
              View your visitor passes and download authorized passes.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchVisitors}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-[10px] border border-[#e2d9df] bg-white px-3.5 py-2.5 text-[11px] font-bold text-[#756b78] transition hover:bg-[#f7f3ed] disabled:opacity-60"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

        </div>

        {/* ================= VISITORS TABLE ================= */}
        <section className="overflow-hidden rounded-[16px] border border-[#e2d9df] bg-white">

          <div className="border-b border-[#e2d9df] px-5 py-4">
            <h2 className="text-[13px] font-bold text-[#32143b]">
              My Visitors
            </h2>

            <p className="mt-1 text-[10px] font-medium text-[#8b778e]">
              {visitors.length} visitor
              {visitors.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-[280px] items-center justify-center">
              <p className="text-[11px] font-medium text-[#8b778e]">
                Loading visitors...
              </p>
            </div>
          ) : visitors.length > 0 ? (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px]">

                <thead>
                  <tr className="bg-[#f7f3ed]">
                    <TableHead>Pass ID</TableHead>
                    <TableHead>Visitor</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Visit Date</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </tr>
                </thead>

                <tbody>
                  {visitors.map((visitor) => (
                    <tr
                      key={visitor._id}
                      className="border-t border-[#e2d9df] transition hover:bg-[#f7f3ed]"
                    >
                      <td className="px-5 py-4 text-[10px] font-bold text-[#9b7740]">
                        #{visitor._id?.slice(-6)}
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-[11px] font-bold text-[#49394d]">
                          {visitor.visitorName}
                        </p>

                        <p className="mt-1 text-[9px] font-medium text-[#8b778e]">
                          Flat {visitor.flatNo}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-[10px] font-medium text-[#756b78]">
                        {visitor.phone}
                      </td>

                      <td className="px-5 py-4 text-[10px] font-medium text-[#756b78]">
                        {formatDate(visitor.visitDate)}
                      </td>

                      <td className="max-w-[180px] px-5 py-4">
                        <p className="truncate text-[10px] font-medium text-[#756b78]">
                          {visitor.purpose}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <VisitorStatus status={visitor.status} />
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleViewVisitor(visitor._id)
                          }
                          className="flex items-center gap-1.5 rounded-[8px] border border-[#e2d9df] bg-white px-3 py-2 text-[9.5px] font-bold text-[#756b78] transition hover:border-[#d9be82] hover:text-[#9b7740]"
                        >
                          <Eye size={13} />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          ) : (
            <EmptyState />
          )}

        </section>

        {/* ================= DETAILS MODAL ================= */}
        {(detailLoading || selectedVisitor) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#32143b]/40 p-4">

            <div className="max-h-[90vh] w-full max-w-[600px] overflow-y-auto rounded-[18px] bg-white shadow-2xl">

              {detailLoading ? (
                <div className="flex min-h-[300px] items-center justify-center">
                  <p className="text-[11px] font-medium text-[#8b778e]">
                    Loading visitor details...
                  </p>
                </div>
              ) : (
                <>
                  {/* MODAL HEADER */}
                  <div className="flex items-start justify-between border-b border-[#e2d9df] px-6 py-5">

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#9b7740]">
                        Visitor Pass Details
                      </p>

                      <h2 className="mt-1 text-[18px] font-extrabold text-[#32143b]">
                        {selectedVisitor?.visitorName}
                      </h2>

                      <p className="mt-1 text-[10px] text-[#8b778e]">
                        Pass #{selectedVisitor?._id?.slice(-6)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedVisitor(null)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-[#8b778e] transition hover:bg-[#eee8ed] hover:text-[#49394d]"
                    >
                      <X size={18} />
                    </button>

                  </div>

                  {/* MODAL CONTENT */}
                  <div className="space-y-6 p-6">

                    <div className="grid gap-4 sm:grid-cols-2">

                      <DetailItem
                        icon={Phone}
                        label="Phone Number"
                        value={selectedVisitor?.phone}
                      />

                      <DetailItem
                        icon={Mail}
                        label="Email Address"
                        value={selectedVisitor?.email}
                      />

                      <DetailItem
                        icon={MapPin}
                        label="Flat Number"
                        value={selectedVisitor?.flatNo}
                      />

                      <DetailItem
                        icon={CalendarDays}
                        label="Visit Date"
                        value={formatDate(selectedVisitor?.visitDate)}
                      />

                      <DetailItem
                        icon={Clock3}
                        label="Visit Start Time"
                        value={formatTime(
                          selectedVisitor?.visitStartTime
                        )}
                      />

                      <DetailItem
                        icon={Clock3}
                        label="Visit End Time"
                        value={formatTime(
                          selectedVisitor?.visitEndTime
                        )}
                      />

                    </div>

                    {/* PURPOSE */}
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText
                          size={14}
                          className="text-[#8b778e]"
                        />

                        <p className="text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                          Purpose of Visit
                        </p>
                      </div>

                      <div className="mt-2 rounded-[10px] bg-[#f7f3ed] p-4">
                        <p className="text-[11px] leading-6 font-medium text-[#756b78]">
                          {selectedVisitor?.purpose || "-"}
                        </p>
                      </div>
                    </div>

                    {/* STATUS */}
                    <div className="rounded-[12px] border border-[#eee8ed] bg-[#f7f3ed] p-4">
                      <p className="mb-2 text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                        Approval Status
                      </p>

                      <VisitorStatus
                        status={selectedVisitor?.status}
                      />
                    </div>

                  </div>

                  {/* MODAL FOOTER */}
                  <div className="flex flex-col-reverse gap-2 border-t border-[#e2d9df] px-6 py-4 sm:flex-row sm:justify-end">

                    <button
                      type="button"
                      onClick={() => setSelectedVisitor(null)}
                      className="rounded-[9px] border border-[#e2d9df] px-4 py-2.5 text-[10px] font-bold text-[#756b78] transition hover:bg-[#f7f3ed]"
                    >
                      Close
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadPass}
                      className="flex items-center justify-center gap-2 rounded-[9px] bg-[#9b7740] px-4 py-2.5 text-[10px] font-bold text-white transition hover:bg-[#9b7740]"
                    >
                      <Download size={14} />
                      Download Pass
                    </button>

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


/* ================= STATUS ================= */

function VisitorStatus({ status }) {
  const styles = {
    Approved:
      "bg-[#f7f3ed] text-[#9b7740]",

    Rejected:
      "bg-red-50 text-red-600",

    Completed:
      "bg-[#f7f3ed] text-[#63366f]",

    Pending:
      "bg-[#f7f3ed] text-[#9b7740]",
  };

  const icons = {
    Approved: CheckCircle2,
    Rejected: AlertCircle,
    Completed: UserCheck,
    Pending: Clock3,
  };

  const Icon = icons[status] || Clock3;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold ${
        styles[status] || styles.Pending
      }`}
    >
      <Icon size={11} />
      {status || "Pending"}
    </span>
  );
}


/* ================= DETAIL ITEM ================= */

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[10px] border border-[#eee8ed] p-3">

      <div className="flex items-center gap-2">
        <Icon size={13} className="text-[#9b7740]" />

        <p className="text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
          {label}
        </p>
      </div>

      <p className="mt-2 break-all text-[11px] font-bold text-[#49394d]">
        {value || "-"}
      </p>

    </div>
  );
}


/* ================= TABLE HEAD ================= */

function TableHead({ children }) {
  return (
    <th className="px-5 py-3.5 text-left text-[9px] font-bold uppercase tracking-[0.08em] text-[#8b778e]">
      {children}
    </th>
  );
}


/* ================= EMPTY STATE ================= */

function EmptyState() {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center px-4 text-center">

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eee8ed] text-[#8b778e]">
        <Users size={24} />
      </div>

      <h3 className="mt-4 text-[13px] font-bold text-[#49394d]">
        No Visitors Found
      </h3>

      <p className="mt-1 text-[10px] font-medium text-[#8b778e]">
        You have not created any visitor passes yet.
      </p>

    </div>
  );
}

export default ResidentVisitorDetails;