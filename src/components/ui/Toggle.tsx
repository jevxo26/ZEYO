"use client";
import { useState } from "react";

interface ToggleProps {
  label: string;
  description: string;
  initialChecked?: boolean;
}

export default function Toggle({
  label,
  description,
  initialChecked = false,
}: ToggleProps) {
  const [enabled, setEnabled] = useState(initialChecked);

  return (
    <div className="flex justify-between items-center py-2">
      <div>
        <p className="text-xs font-bold text-gray-800">{label}</p>
        <p className="text-[10px] text-gray-400 font-medium">{description}</p>
      </div>
      <button
        onClick={() => setEnabled(!enabled)}
        className="w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-all duration-200"
        style={enabled ? { background: "linear-gradient(135deg, #7c3aed, #2563eb)", boxShadow: "0 2px 8px rgba(124,58,237,0.3)" } : { background: "#e5e7eb" }}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
            enabled ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
