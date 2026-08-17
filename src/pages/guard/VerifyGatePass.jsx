
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

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

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);

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
  // OPEN CAMERA
  // ==========================================
  const openScanner = async () => {
    setScannerError("");
    setScannerOpen(true);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setScannerError(
          "Camera access is not supported in this browser"
        );
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: "environment",
          },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      startQrDetection();
    } catch (error) {
      console.error("Camera Error:", error);

      setScannerError(
        "Unable to access camera. Please allow camera permission."
      );
    }
  };

  // ==========================================
  // QR DETECTION
  // Uses built-in browser BarcodeDetector
  // No npm package required
  // ==========================================
  const startQrDetection = async () => {
    if (!("BarcodeDetector" in window)) {
      setScannerError(
        "QR scanning is not supported by this browser. Please use the 6-digit gate key."
      );
      return;
    }

    try {
      const detector = new window.BarcodeDetector({
        formats: ["qr_code"],
      });

      const scanFrame = async () => {
        if (!videoRef.current || !scannerOpen) {
          return;
        }

        try {
          const barcodes = await detector.detect(
            videoRef.current
          );

          if (barcodes.length > 0) {
            const rawValue = barcodes[0].rawValue?.trim();

            if (rawValue) {
              handleScannedValue(rawValue);
              return;
            }
          }
        } catch (error) {
          console.error("QR Detection Error:", error);
        }

        animationRef.current =
          requestAnimationFrame(scanFrame);
      };

      scanFrame();
    } catch (error) {
      console.error("Barcode Detector Error:", error);

      setScannerError(
        "Unable to start QR scanner. Please enter the gate key manually."
      );
    }
  };

  // ==========================================
  // HANDLE QR RESULT
  // Supports:
  // 482916
  // SMARTSOCIETY:GATE:482916
  // ==========================================
  const handleScannedValue = (value) => {
    let scannedKey = "";

    if (/^\d{6}$/.test(value)) {
      scannedKey = value;
    } else {
      const match = value.match(/(\d{6})/);

      if (match) {
        scannedKey = match[1];
      }
    }

    if (!scannedKey) {
      toast.error("Invalid SmartSociety QR code");
      return;
    }

    stopScanner();

    setGateKey(scannedKey);

    toast.success("QR code scanned successfully");

    verifyPass(scannedKey);
  };

  // ==========================================
  // STOP CAMERA
  // ==========================================
  const stopScanner = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setScannerOpen(false);
  };

  // ==========================================
  // CLEAN UP CAMERA
  // ==========================================
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());
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
        toast.success("Visitor entry recorded successfully");

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

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString();
  };

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
          <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-500">
            Security Portal
          </p>

          <h1 className="text-[20px] font-extrabold tracking-tight text-slate-900 md:text-[22px]">
            Verify Visitor Pass
          </h1>

          <p className="mt-1 text-[11.5px] font-medium text-slate-400">
            Scan the visitor QR code or enter the 6-digit gate key manually.
          </p>
        </div>

        {/* ================= SCAN QR ================= */}
        <section className="mb-5 rounded-[16px] border border-slate-200 bg-white p-5">

          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <h2 className="text-[13px] font-bold text-slate-900">
                QR Code Scanner
              </h2>

              <p className="mt-1 text-[10px] font-medium text-slate-400">
                Use the device camera to scan the visitor's digital pass.
              </p>
            </div>

            <button
              type="button"
              onClick={openScanner}
              disabled={loading || scannerOpen}
              className="flex items-center justify-center gap-2 rounded-[10px] bg-emerald-500 px-4 py-2.5 text-[11px] font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Camera size={16} />
              Scan QR Code
            </button>

          </div>
        </section>

        {/* ================= MANUAL VERIFY ================= */}
        <section className="rounded-[16px] border border-slate-200 bg-white p-5">

          <div className="mb-4">
            <h2 className="text-[13px] font-bold text-slate-900">
              Manual Verification
            </h2>

            <p className="mt-1 text-[10px] font-medium text-slate-400">
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
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
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
                className="w-full rounded-[10px] border border-slate-200 py-3 pl-10 pr-3 text-[13px] font-bold tracking-[0.15em] text-slate-700 outline-none transition placeholder:font-medium placeholder:tracking-normal placeholder:text-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-[10px] border border-slate-200 bg-slate-900 px-5 py-3 text-[11px] font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Search size={15} />

              {loading ? "Verifying..." : "Verify Pass"}
            </button>

          </form>
        </section>

        {/* ================= VERIFIED VISITOR ================= */}
        {visitor && (
          <section className="mt-6 overflow-hidden rounded-[16px] border border-emerald-200 bg-white">

            <div className="flex items-center gap-3 border-b border-emerald-100 bg-emerald-50 px-5 py-4">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <ShieldCheck size={20} />
              </div>

              <div>
                <p className="text-[12px] font-bold text-emerald-700">
                  Verified Visitor Pass
                </p>

                <p className="mt-0.5 text-[10px] font-medium text-emerald-600">
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

                <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                  Purpose
                </p>

                <div className="mt-2 rounded-[10px] bg-slate-50 p-4">
                  <p className="text-[11px] font-medium text-slate-600">
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
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-[10px] bg-emerald-500 px-4 py-3 text-[11px] font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">

            <div className="w-full max-w-[500px] overflow-hidden rounded-[18px] bg-white shadow-2xl">

              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

                <div>
                  <h2 className="text-[14px] font-bold text-slate-900">
                    Scan Visitor QR Code
                  </h2>

                  <p className="mt-1 text-[10px] font-medium text-slate-400">
                    Position the QR code inside the camera view.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={stopScanner}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={18} />
                </button>

              </div>

              <div className="p-5">

                <div className="relative overflow-hidden rounded-[14px] bg-slate-900">

                  <video
                    ref={videoRef}
                    className="aspect-square w-full object-cover"
                    playsInline
                    muted
                  />

                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">

                    <div className="h-[65%] w-[65%] rounded-[14px] border-2 border-emerald-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.15)]" />

                  </div>

                </div>

                {scannerError && (
                  <div className="mt-4 flex gap-2 rounded-[10px] bg-amber-50 p-3 text-amber-700">

                    <AlertCircle
                      size={16}
                      className="mt-0.5 shrink-0"
                    />

                    <p className="text-[10px] font-medium leading-5">
                      {scannerError}
                    </p>

                  </div>
                )}

                {!scannerError && (
                  <p className="mt-4 text-center text-[10px] font-medium text-slate-400">
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


function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">

      <div className="mt-0.5 text-slate-400">
        <Icon size={16} />
      </div>

      <div>
        <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-[11px] font-bold text-slate-700">
          {value || "-"}
        </p>
      </div>

    </div>
  );
}


export default VerifyGatePass;

