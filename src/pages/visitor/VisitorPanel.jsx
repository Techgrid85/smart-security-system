import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AlertTriangle, CalendarPlus, Clock, QrCode, UserCheck } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const API = "https://smart-society-backend-delta.vercel.app/visitor";
const config = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

export default function VisitorPanel() {
  const [requests, setRequests] = useState([]);
  const [requestsEnabled, setRequestsEnabled] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [requestsResponse, settingsResponse] = await Promise.all([axios.get(`${API}/requests`, config()), axios.get(`${API}/public-settings`)]);
        setRequests(requestsResponse.data.data || []);
        setRequestsEnabled(settingsResponse.data.data?.visitorRequestsEnabled !== false);
      } catch (error) {
        setRequests([]);
        toast.error(error.response?.data?.message || "Could not load visitor dashboard");
      }
    };
    loadData();
  }, []);

  const pending = requests.filter((request) => request.status === "Pending").length;
  const approved = requests.filter((request) => request.status === "Approved").length;
  const activePass = requests.find((request) => request.status === "Approved" && request.gateStatus === "Not Entered") || requests.find((request) => request.status === "Approved");
  const stats = [["Total Requests", requests.length, CalendarPlus, "bg-[#f5eee2] text-[#9b7740]"], ["Awaiting Approval", pending, Clock, "bg-[#f1eaf3] text-[#63366f]"], ["Approved Passes", approved, QrCode, "bg-[#eef6f0] text-[#277342]"]];

  return <DashboardLayout role="visitor"><div className="space-y-6">
    <header><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#9b7740]">Visitor Portal</p><h1 className="mt-2 text-2xl font-extrabold text-[#32143b]">Your visit dashboard</h1><p className="mt-1 text-sm text-[#8b778e]">Request visits, track approvals, and access your digital gate passes.</p></header>
    {!requestsEnabled && <section className="flex gap-3 border border-amber-300 bg-amber-50 p-4 text-amber-900"><AlertTriangle size={20} className="mt-0.5 shrink-0"/><div><h2 className="text-sm font-bold">Visitor visit requests are currently unavailable</h2><p className="mt-1 text-xs leading-5">The society administrator has temporarily disabled visit requests. Existing passes and requests remain available below.</p></div></section>}
    <div className="grid gap-4 sm:grid-cols-3">{stats.map(([title, value, Icon, colors]) => <div key={title} className="border border-[#e2d9df] bg-white p-5"><div className={`flex h-10 w-10 items-center justify-center ${colors}`}><Icon size={19} /></div><p className="mt-4 text-2xl font-extrabold text-[#32143b]">{value}</p><p className="mt-1 text-xs font-bold text-[#8b778e]">{title}</p></div>)}</div>
    {activePass && <section className="border border-[#d9be82] bg-[#fffaf0] p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#9b7740]">Approved digital pass</p><h2 className="mt-1 text-lg font-extrabold text-[#32143b]">{activePass.resident?.name || "Resident"} · Flat {activePass.resident?.flatNo}</h2><p className="mt-1 text-sm text-[#756b78]">{new Date(activePass.visitStartTime).toLocaleString()} · {activePass.purpose}</p></div><div className="border border-[#d9be82] bg-white px-5 py-3 text-center"><p className="text-[10px] font-bold uppercase tracking-wider text-[#8b778e]">Gate key</p><p className="mt-1 text-2xl font-black tracking-[.2em] text-[#32143b]">{activePass.gateKey}</p></div></div><Link to="/visitor/passes" className="mt-4 inline-block text-xs font-bold text-[#9b7740]">View pass details →</Link></section>}
    <div className="grid gap-5 lg:grid-cols-3"><section className="border border-[#e2d9df] bg-white p-5 lg:col-span-2"><div className="flex items-center justify-between"><h2 className="font-bold text-[#32143b]">Recent visit requests</h2><Link to="/visitor/passes" className="text-xs font-bold text-[#9b7740]">View all</Link></div>{requests.slice(0, 4).map((request) => <div key={request._id} className="mt-3 flex items-center justify-between border-t border-[#eee8ed] pt-3 text-sm"><div><b>{request.resident?.name || "Resident"}</b><p className="text-xs text-[#8b778e]">Flat {request.resident?.flatNo} · {request.purpose}</p></div><span className="text-xs font-bold text-[#9b7740]">{request.status}</span></div>)}{!requests.length && <p className="mt-4 text-sm text-[#8b778e]">No visit requests yet.</p>}</section><aside className="bg-[#32143b] p-5 text-white"><UserCheck size={22} className="text-[#d9be82]"/><h2 className="mt-4 font-bold">Planning a visit?</h2><p className="mt-2 text-sm leading-6 text-white/65">Find the resident by flat number and send your visit request securely.</p>{requestsEnabled ? <Link to="/visitor/request" className="mt-5 inline-block bg-[#d9be82] px-4 py-2 text-xs font-bold text-[#32143b]">Request a visit</Link> : <span className="mt-5 inline-block bg-white/15 px-4 py-2 text-xs font-bold text-white/55">Requests unavailable</span>}</aside></div>
  </div></DashboardLayout>;
}
