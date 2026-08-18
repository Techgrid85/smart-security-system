import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Html5Qrcode } from "html5-qrcode";

import {
  ShieldCheck,
  Search,
  CheckCircle2,
  User,
  Phone,
  Home,
  CalendarDays,
  Clock3,
  KeyRound,
  Camera,
  X,
  AlertCircle,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

function VerifyGatePass() {
  const [gateKey, setGateKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [visitor, setVisitor] = useState(null);

  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerError, setScannerError] = useState("");

  const scannerRef = useRef(null);
  const isScannerRunningRef = useRef(false);

  // ==========================================
  // AUTH HEADERS
  // ==========================================
  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // ==========================================
  // VERIFY VISITOR PASS
  // ==========================================
  const verifyPass = async (key) => {
    if (!/^\d{6}$/.test(key)) {
      toast.error("Invalid 6-digit gate key");
      return;
    }

    try {
      setLoading(true);
      setVisitor(null);

      const response = await axios.get(
        `https://smart-society-backend-delta.vercel.app/guard/verify-pass/${key}`,
        {
          headers: getHeaders(),
        }
      );

      if (response.data.success) {
        setVisitor(response.data.data);
        setGateKey(key);

        toast.success("Visitor pass verified successfully");
      } else {
        toast.error(
          response.data.message || "Verification failed"
        );
      }
    } catch (error) {
      console.error(
        "Verify Visitor Error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to verify visitor pass"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // MANUAL VERIFY
  // ==========================================
  const handleVerify = async (e) => {
    e.preventDefault();

    verifyPass(gateKey);
  };

  // ==========================================
  // HANDLE QR RESULT
  //
  // Supports:
  // 482916
  // SMARTSOCIETY:GATE:482916
  // ==========================================
  const handleScannedValue = async (value) => {
    const cleanValue = value?.trim();

    if (!cleanValue) {
      return;
    }

    let scannedKey = "";

    // QR contains only the 6-digit gate key
    if (/^\d{6}$/.test(cleanValue)) {
      scannedKey = cleanValue;
    } else {
      // Find a 6-digit gate key inside the QR text
      const match = cleanValue.match(/(\d{6})/);

      if (match) {
        scannedKey = match[1];
      }
    }

    if (!scannedKey) {
      toast.error("Invalid SmartSociety QR code");
      return;
    }

    // Stop scanner before verification
    await stopScanner();

    setGateKey(scannedKey);

    toast.success("QR code scanned successfully");

    verifyPass(scannedKey);
  };

  // ==========================================
  // START QR SCANNER
  // ==========================================
  const startScanner = async () => {
    try {
      setScannerError("");

      const scanner = new Html5Qrcode(
        "smart-society-qr-reader"
      );

      scannerRef.current = scanner;

      await scanner.start(
        {
          facingMode: "environment",
        },
        {
          fps: 10,

          qrbox: {
            width: 250,
            height: 250,
          },

          aspectRatio: 1,
        },
        (decodedText) => {
          handleScannedValue(decodedText);
        },
        () => {
          // Normal scanning failures are ignored.
          // The scanner keeps looking for a QR code.
        }
      );

      isScannerRunningRef.current = true;
    } catch (error) {
      console.error("QR Scanner Error:", error);

      isScannerRunningRef.current = false;

      setScannerError(
        "Unable to access the camera. Please allow camera permission and try again."
      );
    }
  };

  // ==========================================
  // OPEN SCANNER
  // ==========================================
  const openScanner = () => {
    setScannerError("");
    setScannerOpen(true);
  };

  // ==========================================
  // STOP SCANNER
  // ==========================================
  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        if (isScannerRunningRef.current) {
          await scannerRef.current.stop();
        }

        try {
          await scannerRef.current.clear();
        } catch (clearError) {
          console.warn(
            "Scanner clear warning:",
            clearError
          );
        }

        scannerRef.current = null;
      }
    } catch (error) {
      console.error("Stop Scanner Error:", error);
    }

    isScannerRunningRef.current = false;

    setScannerOpen(false);
  };

  // ==========================================
  // START SCANNER AFTER MODAL OPENS
  // ==========================================
  useEffect(() => {
    if (!scannerOpen) return;

    const timer = setTimeout(() => {
      startScanner();
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [scannerOpen]);

  // ==========================================
  // CLEAN UP SCANNER
  // ==========================================
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch(() => {})
          .finally(() => {
            try {
              scannerRef.current?.clear();
            } catch {}
          });
      }
    };
  }, []);

  // ==========================================
  // MARK ENTRY
  // ==========================================
  const handleEntry = async () => {
    if (!visitor?._id) return;

    try {
      setLoading(true);

      const response = await axios.put(
        `https://smart-society-backend-delta.vercel.app/guard/visitors/${visitor._id}/entry`,
        {},
        {
          headers: getHeaders(),
        }
      );

      if (response.data.success) {
        toast.success(
          "Visitor entry recorded successfully"
        );

        setVisitor(response.data.data);
        setGateKey("");
      }
    } catch (error) {
      console.error(
        "Mark Entry Error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to record visitor entry"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString();
  };

  // ==========================================
  // FORMAT TIME
  // ==========================================
  const formatTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout role="guard">
      <div className="w-full min-w-0 max-w-full">

        {/* ================= HEADER ================= */}
        <div className="mb-6">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#9b7740]">
            Security Portal
          </p>

          <h1 className="text-[20px] font-extrabold tracking-tight text-[#32143b] md:text-[22px]">
            Verify Visitor Pass
          </h1>

          <p className="mt-1 text-[11.5px] font-medium text-[#8b778e]">
            Scan the visitor QR code or enter the 6-digit gate key manually.
          </p>
        </div>

        {/* ================= SCAN QR ================= */}
        <section className="mb-5 rounded-[16px] border border-[#e2d9df] bg-white p-5">

          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <h2 className="text-[13px] font-bold text-[#32143b]">
                QR Code Scanner
              </h2>

              <p className="mt-1 text-[10px] font-medium text-[#8b778e]">
                Use the device camera to scan the visitor's digital pass.
              </p>
            </div>

            <button
              type="button"
              onClick={openScanner}
              disabled={loading || scannerOpen}
              className="flex items-center justify-center gap-2 rounded-[10px] bg-[#9b7740] px-4 py-2.5 text-[11px] font-bold text-white transition hover:bg-[#9b7740] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Camera size={16} />
              Scan QR Code
            </button>

          </div>
        </section>

        {/* ================= MANUAL VERIFY ================= */}
        <section className="rounded-[16px] border border-[#e2d9df] bg-white p-5">

          <div className="mb-4">
            <h2 className="text-[13px] font-bold text-[#32143b]">
              Manual Verification
            </h2>

            <p className="mt-1 text-[10px] font-medium text-[#8b778e]">
              Enter the visitor's 6-digit gate key if QR scanning is unavailable.
            </p>
          </div>

          <form
            onSubmit={handleVerify}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">

              <KeyRound
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b778e]"
              />

              <input
                type="text"
                value={gateKey}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6);

                  setGateKey(value);
                }}
                placeholder="Enter 6-digit gate key"
                inputMode="numeric"
                maxLength={6}
                className="w-full rounded-[10px] border border-[#e2d9df] py-3 pl-10 pr-3 text-[13px] font-bold tracking-[0.15em] text-[#49394d] outline-none transition placeholder:font-medium placeholder:tracking-normal placeholder:text-[#bca9c0] focus:border-[#bca16a] focus:ring-2 focus:ring-[#f5eee2]"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-[10px] border border-[#e2d9df] bg-[#32143b] px-5 py-3 text-[11px] font-bold text-white transition hover:bg-[#49394d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Search size={15} />

              {loading ? "Verifying..." : "Verify Pass"}
            </button>

          </form>
        </section>

        {/* ================= VERIFIED VISITOR ================= */}
        {visitor && (
          <section className="mt-6 overflow-hidden rounded-[16px] border border-[#e2d9df] bg-white">

            <div className="flex items-center gap-3 border-b border-[#f5eee2] bg-[#f7f3ed] px-5 py-4">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5eee2] text-[#9b7740]">
                <ShieldCheck size={20} />
              </div>

              <div>
                <p className="text-[12px] font-bold text-[#826331]">
                  Verified Visitor Pass
                </p>

                <p className="mt-0.5 text-[10px] font-medium text-[#9b7740]">
                  This visitor is approved for entry.
                </p>
              </div>

            </div>

            <div className="p-5">

              <div className="grid gap-5 sm:grid-cols-2">

                <Info
                  icon={User}
                  label="Visitor Name"
                  value={visitor.visitorName}
                />

                <Info
                  icon={Phone}
                  label="Phone"
                  value={visitor.phone}
                />

                <Info
                  icon={Home}
                  label="Flat Number"
                  value={visitor.flatNo}
                />

                <Info
                  icon={CalendarDays}
                  label="Visit Date"
                  value={formatDate(visitor.visitDate)}
                />

                <Info
                  icon={Clock3}
                  label="Allowed Time"
                  value={`${formatTime(visitor.visitStartTime)} - ${formatTime(visitor.visitEndTime)}`}
                />

                <Info
                  icon={KeyRound}
                  label="Gate Key"
                  value={visitor.gateKey}
                />

              </div>

              <div className="mt-5">

                <p className="text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                  Purpose
                </p>

                <div className="mt-2 rounded-[10px] bg-[#f7f3ed] p-4">
                  <p className="text-[11px] font-medium text-[#756b78]">
                    {visitor.purpose}
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={handleEntry}
                disabled={
                  loading ||
                  visitor.gateStatus !== "Not Entered"
                }
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#9b7740] px-4 py-3 text-[11px] font-bold text-white transition hover:bg-[#9b7740] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CheckCircle2 size={16} />

                {visitor.gateStatus === "Not Entered"
                  ? "Allow Entry"
                  : "Entry Already Recorded"}
              </button>

            </div>
          </section>
        )}

        {/* ================= QR SCANNER MODAL ================= */}
        {scannerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#32143b]/60 p-4">

            <div className="w-full max-w-[500px] overflow-hidden rounded-[18px] bg-white shadow-2xl">

              <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">

                <div>
                  <h2 className="text-[14px] font-bold text-[#32143b]">
                    Scan Visitor QR Code
                  </h2>

                  <p className="mt-1 text-[10px] font-medium text-[#8b778e]">
                    Position the QR code inside the camera view.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={stopScanner}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8b778e] transition hover:bg-[#eee8ed] hover:text-[#49394d]"
                >
                  <X size={18} />
                </button>

              </div>

              <div className="p-5">

                {/* ================= CAMERA ================= */}
                <div className="relative overflow-hidden rounded-[14px] bg-[#32143b]">

                  <div
                    id="smart-society-qr-reader"
                    className="w-full"
                  />

                  {/* Scanner Overlay */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">

                    <div className="h-[65%] w-[65%] rounded-[14px] border-2 border-[#bca16a] shadow-[0_0_0_9999px_rgba(0,0,0,0.15)]" />

                  </div>

                </div>

                {/* ================= SCANNER ERROR ================= */}
                {scannerError && (
                  <div className="mt-4 flex gap-2 rounded-[10px] bg-[#f7f3ed] p-3 text-[#826331]">

                    <AlertCircle
                      size={16}
                      className="mt-0.5 shrink-0"
                    />

                    <p className="text-[10px] font-medium leading-5">
                      {scannerError}
                    </p>

                  </div>
                )}

                {/* ================= SCANNING MESSAGE ================= */}
                {!scannerError && (
                  <p className="mt-4 text-center text-[10px] font-medium text-[#8b778e]">
                    Scanning automatically...
                  </p>
                )}

              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

// ==========================================
// INFO COMPONENT
// ==========================================
function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">

      <div className="mt-0.5 text-[#8b778e]">
        <Icon size={16} />
      </div>

      <div>
        <p className="text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
          {label}
        </p>

        <p className="mt-1 text-[11px] font-bold text-[#49394d]">
          {value || "-"}
        </p>
      </div>

    </div>
  );
}

export default VerifyGatePass;