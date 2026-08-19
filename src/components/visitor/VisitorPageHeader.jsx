import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function VisitorPageHeader({ title, description, icon: Icon }) {
  const navigate = useNavigate();
  return <div className="mb-6"><button type="button" onClick={() => navigate("/visitor")} className="mb-4 flex items-center gap-2 text-[11px] font-bold text-[#8b778e] transition hover:text-[#9b7740]"><ArrowLeft size={14}/> Back to Dashboard</button><div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center bg-[#f5eee2] text-[#9b7740]">{Icon && <Icon size={19}/>}</div><div><p className="text-[9px] font-bold uppercase tracking-[.16em] text-[#9b7740]">Visitor Portal</p><h1 className="mt-1 text-[21px] font-extrabold tracking-tight text-[#32143b]">{title}</h1><p className="mt-1 text-[11.5px] font-medium text-[#8b778e]">{description}</p></div></div></div>;
}
export default VisitorPageHeader;
