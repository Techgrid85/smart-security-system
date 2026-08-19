import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { MapPin } from "lucide-react";
import VisitorPageHeader from "../../components/visitor/VisitorPageHeader";
const API="https://smart-society-backend-delta.vercel.app/visitor"; const config=()=>({headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});
export default function VisitorMap(){const[url,setUrl]=useState("");useEffect(()=>{axios.get(`${API}/map`,config()).then(r=>setUrl(r.data.data?.publicMapUrl||""))},[]);return <DashboardLayout role="visitor"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#9b7740]">Visitor Portal</p><h1 className="mt-2 text-2xl font-extrabold text-[#32143b]">Society map</h1><section className="mt-6 border border-[#e2d9df] bg-white p-6"><h2 className="font-bold text-[#32143b]">Visitor directions</h2><p className="mt-2 text-sm text-[#8b778e]">Use this public map and follow the gate instructions provided with your approved pass.</p>{url?<a href={url} target="_blank" rel="noreferrer" className="mt-5 inline-block bg-[#32143b] px-4 py-2.5 text-xs font-bold text-white">Open society map</a>:<p className="mt-5 border border-dashed p-4 text-sm text-[#8b778e]">The society map has not been published yet.</p>}</section></div></DashboardLayout>}
