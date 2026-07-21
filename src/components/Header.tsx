import { ReactNode } from "react";
import { Bell } from "lucide-react";

interface HeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export default function Header({ title, description, children }: HeaderProps) {
  return (
    <div className="flex justify-between items-start border-b border-gray-200 pb-5 mb-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          {title}
        </h1>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
      <div className="flex items-center gap-4">
        {children ? (
          children
        ) : (
          <>
            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl border border-gray-200 bg-white shadow-xs relative">
              <Bell size={16} />
              <span className="w-2 h-2 bg-orange-500 rounded-full absolute top-1 right-1" />
            </button>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Last Updated
              </p>
              <p className="text-xs font-black text-gray-700">
                Today, 09:41 AM
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
