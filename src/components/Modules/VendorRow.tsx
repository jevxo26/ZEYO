import { Star, ChevronRight } from "lucide-react";

interface VendorRowProps {
  name: string;
  id: string;
  category: string;
  zone: string;
  rating: string;
  jobs: string;
}

export default function VendorRow({
  name,
  id,
  category,
  zone,
  rating,
  jobs,
}: VendorRowProps) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors border-b border-gray-100 last:border-0">
      <td className="px-6 py-4.5">
        <p className="font-bold text-gray-900 text-sm">{name}</p>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
          {id}
        </p>
      </td>
      <td className="px-6 py-4.5">
        <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2.5 py-1 rounded-md border border-purple-100 shadow-xs">
          {category}
        </span>
      </td>
      <td className="px-6 py-4.5 font-bold text-gray-600">{zone}</td>
      <td className="px-6 py-4.5">
        <div className="flex items-center gap-1 font-bold text-slate-800 bg-amber-50 border border-amber-100 rounded-md px-2 py-0.5 w-fit shadow-xs">
          <Star size={11} className="text-amber-500 fill-amber-500" /> 
          <span className="text-[10px]">{rating}</span>
        </div>
      </td>
      <td className="px-6 py-4.5 font-semibold text-slate-500">{jobs}</td>
      <td className="px-6 py-4.5 text-right">
        <button className="p-1 hover:bg-slate-100 rounded-lg text-gray-400 hover:text-slate-650 transition-all cursor-pointer inline-flex items-center justify-center">
          <ChevronRight size={16} />
        </button>
      </td>
    </tr>
  );
}
